import '../../styles.css';
import './VerifySchematicPage.css';

import React, { ChangeEvent, Component, ReactElement, useEffect, useState } from 'react';
import Tag, { CustomTag, SCHEMATIC_TAG, TagChoice, UPLOAD_SCHEMATIC_TAG } from '../../components/common/Tag';
import { API, AxiosConfig } from '../../AxiosConfig';
import { capitalize } from '../../util/StringUtils';
import { TagSubmitButton } from '../../components/common/TagSubmitButton';
import { LoaderState, MAX_ITEM_PER_PAGE } from '../../config/Config';

import TagQuery from '../../components/common/TagQuery';
import UserName from '../user/LoadUserName';
import SchematicInfo from '../schematic/SchematicInfo';
import LazyLoadImage from '../../components/common/LazyLoadImage';
import Dropbox from '../../components/common/Dropbox';
import SearchBar from '../../components/common/SearchBar';

const config = {
	headers: { Authorization: AxiosConfig.bearer }
};

export const VerifySchematicPage = () => {
	const [loaderState, setLoaderState] = useState<LoaderState>(LoaderState.LOADING);

	const [schematicList, setSchematicList] = useState<SchematicInfo[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicInfo>();

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	useEffect(() => loadPage(), []);

	function loadToPage(page: number) {
		setSchematicList([[]]);
		setLoaderState(LoaderState.LOADING);

		for (let i = 0; i < page; i++) {
			const config = {
				headers: { Authorization: AxiosConfig.bearer }
			};
			API.get(`schematicupload/page/${i}`, config)
				.then((result) => {
				if (result.status === 200 && result.data) {
					let schematics: SchematicInfo[] = result.data;
					
					if (schematics.length < MAX_ITEM_PER_PAGE) setLoaderState(LoaderState.NO_MORE);
					else setLoaderState(LoaderState.MORE);

					setSchematicList([...schematicList]);
				} else setLoaderState(LoaderState.NO_MORE);
				})
				.catch((error) => console.log(error));
		}
	}

	function loadPage() {
		setLoaderState(LoaderState.LOADING);
		const config = {
			headers: { Authorization: AxiosConfig.bearer }
		};
		const lastIndex = schematicList.length - 1;
		const newPage = schematicList[lastIndex].length === MAX_ITEM_PER_PAGE;
		API.get(`schematicupload/page/${schematicList.length + (newPage ? 0 : -1)}`, config)
			.then((result) => {
				if (result.status === 200 && result.data) {
					let schematics: SchematicInfo[] = result.data;
					if (newPage) schematicList.push(schematics);
					else schematicList[lastIndex] = schematics;

					if (schematics.length < MAX_ITEM_PER_PAGE) setLoaderState(LoaderState.NO_MORE);
					else setLoaderState(LoaderState.MORE);

					setSchematicList([...schematicList]);
				} else setLoaderState(LoaderState.NO_MORE);
			})
			.catch((error) => console.log(error));
	}

	const schematicArray: ReactElement[] = [];
	for (let p = 0; p < schematicList.length; p++) {
		for (let i = 0; i < schematicList[p].length; i++) {
			let schematic = schematicList[p][i];
			schematicArray.push(
				<div
					key={p * MAX_ITEM_PER_PAGE + i}
					className='schematic-preview'
					onClick={() => {
						setCurrentSchematic(schematic);
						setShowSchematicModel(true);
					}}>
					<LazyLoadImage className='schematic-image' path={`schematicupload/${schematic.id}/image`} config={config}></LazyLoadImage>
					<div className='schematic-preview-description flexbox-center'>{capitalize(schematic.name)}</div>
				</div>
			);
		}
	}

	class SchematicVerifyPanel extends Component<{ schematic: SchematicInfo }, { tags: TagQuery[]; content: string; tag: CustomTag }> {
		state = { tags: getTagArray(this.props.schematic), content: '', tag: UPLOAD_SCHEMATIC_TAG[0] };

		handleContentInput(event: ChangeEvent<HTMLInputElement>) {
			if (event) {
				const input = event.target.value;
				this.setState({ content: input.trim() });
			}
		}

		handleRemoveTag(index: number) {
			this.setState({ tags: [...this.state.tags.filter((_, i) => i !== index)] });
		}

		deleteSchematic(id: string) {
			API.delete(`schematicupload/${id}`, config) //
				.finally(() => loadToPage(schematicList.length));
			setShowSchematicModel(false);
		}

		verifySchematic(schematic: SchematicInfo) {
			let form = new FormData();

			form.append('id', schematic.id);
			form.append('authorId', schematic.authorId);
			form.append('data', schematic.data);
			form.append('tags', `${this.state.tags.map((q) => `${q.toString()}`).join()}`);

			const config = {
				headers: { Authorization: AxiosConfig.bearer, 'content-type': 'multipart/form-data' }
			};

			API.post('schematics', form, config) //
				.finally(() => {
					loadToPage(schematicList.length);
					setShowSchematicModel(false);
				});
		}

		handleAddTag() {
			const q = this.state.tags.filter((q) => q.category !== this.state.tag.category);
			const v = this.state.tag.getValues();

			if (v === null || (v !== null && v.find((c: TagChoice) => c.value === this.state.content) !== undefined)) {
				this.setState({ tags: [...q, new TagQuery(this.state.tag.category, this.state.tag.color, this.state.content)] });
			} else alert('Invalid tag ' + this.state.tag.category + ': ' + this.state.content);
		}

		render() {
			let tagValue = this.state.tag.getValues();
			tagValue = tagValue == null ? [] : tagValue;

			return (
				<div className='schematic-info-container dark-background' onClick={(event) => event.stopPropagation()}>
					<LazyLoadImage className='schematic-info-image' path={`schematicupload/${this.props.schematic.id}/image`} config={config}></LazyLoadImage>
					<div className='schematic-info-desc-container small-gap'>
						<span>Name: {capitalize(this.props.schematic.name)}</span>
						<span>
							Author: <UserName userId={this.props.schematic.authorId} />
						</span>
						{this.props.schematic.description && <span>{this.props.schematic.description}</span>}
						{this.props.schematic.requirement && (
							<section className='flexbox-row small-gap'>
								{this.props.schematic.requirement.map((r, index) => (
									<span key={index} className='text-center'>
										<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
										<span> {r.amount} </span>
									</span>
								))}
							</section>
						)}

						<div className='flexbox-column flex-wrap small-gap'>
							<Dropbox value={'Tag: ' + capitalize(this.state.tag.category)}>
								{UPLOAD_SCHEMATIC_TAG.filter((t) => !this.state.tags.find((q) => q.category === t.category)).map((t, index) => (
									<section
										key={index}
										onClick={() => {
											this.setState({ tag: t, content: '' });
										}}>
										{capitalize(t.category)}
									</section>
								))}
							</Dropbox>
							{this.state.tag.hasOption() ? (
								<Dropbox value={'Value: ' + capitalize(this.state.content)} submitButton={<TagSubmitButton callback={() => this.handleAddTag()} />}>
									{tagValue.map((content: { name: string; value: string }, index: number) => (
										<div key={index} onClick={() => this.setState({ content: content.value })}>
											{capitalize(content.name)}
										</div>
									))}
								</Dropbox>
							) : (
								<SearchBar placeholder='Search' value={this.state.content} onChange={this.handleContentInput} submitButton={<TagSubmitButton callback={() => this.handleAddTag()} />} />
							)}
							<div className='tag-container'>
								{this.state.tags.map((t: TagQuery, index: number) => (
									<Tag
										key={index}
										index={index}
										name={t.category}
										value={t.value}
										color={t.color}
										removeButton={
											<div className='remove-tag-button button-transparent' onClick={() => this.handleRemoveTag(index)}>
												<img src='/assets/icons/quit.png' alt='quit'></img>
											</div>
										}
									/>
								))}
							</div>
						</div>
						<section className='flexbox-center flex-nowrap small-gap'>
							<button type='button' className='button-normal' onClick={() => this.verifySchematic(this.props.schematic)}>
								Verify
							</button>
							<button type='button' className='button-normal' onClick={() => this.deleteSchematic(this.props.schematic.id)}>
								Reject
							</button>
						</section>
					</div>
				</div>
			);
		}
	}

	return (
		<div className='verify-schematic'>
			<section className='schematic-container'>{schematicArray}</section>
			<footer className='schematic-container-footer'>
				{loaderState === LoaderState.LOADING ? (
					<div className='flexbox-center loading-spinner'></div>
				) : (
					<button className='load-more-button button-normal' onClick={() => loadPage()}>
						{loaderState === LoaderState.MORE ? 'Load more' : 'No schematic left'}
					</button>
				)}
			</footer>
			{showSchematicModel === true && currentSchematic !== undefined && (
				<div className='schematic-info-modal model flexbox-center image-background' onClick={() => setShowSchematicModel(false)}>
					<div className='flexbox-center'>
						<SchematicVerifyPanel schematic={currentSchematic} />
					</div>
				</div>
			)}
		</div>
	);
};

// TS suck

function getTagArray(schematic: SchematicInfo) {
	const tagArray: TagQuery[] = [];
	for (let t of schematic.tags) {
		const v = t.split(':');
		if (v.length !== 2) continue;
		const r = SCHEMATIC_TAG.find((st: CustomTag) => st.category === v[0]);
		if (r) {
			tagArray.push(new TagQuery(v[0], r.color, v[1]));
		}
	}
	return tagArray;
}
