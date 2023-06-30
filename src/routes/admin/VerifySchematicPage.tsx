import '../../styles.css';
import './VerifySchematicPage.css';

import React, { Component, ReactElement, useEffect, useState } from 'react';
import Tag, { CustomTag, TagChoice } from '../../components/common/tag/Tag';

import { API } from '../../API';
import { Trans } from 'react-i18next';
import { capitalize } from '../../util/StringUtils';
import { LoaderState, MAX_ITEM_PER_PAGE } from '../../config/Config';

import TagRemoveButton from '../../components/common/button/TagRemoveButton';
import UserName from '../user/LoadUserName';
import SchematicData from '../../components/common/schematic/SchematicData';
import LazyLoadImage from '../../components/common/img/LazyLoadImage';
import Dropbox from '../../components/common/dropbox/Dropbox';
import LoadingSpinner from '../../components/common/loader/LoadingSpinner';
import ScrollToTopButton from '../../components/common/button/ScrollToTopButton';

export const VerifySchematicPage = () => {
	const [loaderState, setLoaderState] = useState<LoaderState>(LoaderState.LOADING);

	const [schematicList, setSchematicList] = useState<SchematicData[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	useEffect(() => {
		getSchematicUploadTag();
		loadPage();
	}, []);

	const [schematicUploadTag, setSchematicUploadTag] = useState<Array<TagChoice>>([]);
	function getSchematicUploadTag() {
		API.REQUEST.get('tag/schematic-upload-tag') //
			.then((result) => {
				let customTagList: Array<CustomTag> = result.data;
				let tagChoiceList: Array<TagChoice> = [];
				let temp = customTagList.map((customTag) => customTag.value.map((v) => new TagChoice(customTag.name, v, customTag.color)));

				temp.forEach((t) => t.forEach((r) => tagChoiceList.push(r)));
				setSchematicUploadTag(tagChoiceList);
			});
	}

	function loadToPage(page: number) {
		setSchematicList([[]]);
		setLoaderState(LoaderState.LOADING);

		for (let i = 0; i < page; i++) {
			API.REQUEST.get(`schematic-upload/page/${i}`)
				.then((result) => {
					if (result.status === 200 && result.data) {
						let schematics: SchematicData[] = result.data;

						if (schematics.length < MAX_ITEM_PER_PAGE) setLoaderState(LoaderState.NO_MORE);
						else setLoaderState(LoaderState.MORE);

						setSchematicList([...schematicList]);
					} else setLoaderState(LoaderState.NO_MORE);
				})
				.catch(() => setLoaderState(LoaderState.MORE));
		}
	}

	function loadPage() {
		setLoaderState(LoaderState.LOADING);

		const lastIndex = schematicList.length - 1;
		const newPage = schematicList[lastIndex].length === MAX_ITEM_PER_PAGE;

		API.REQUEST.get(`schematic-upload/page/${schematicList.length + (newPage ? 0 : -1)}`)
			.then((result) => {
				if (result.status === 200 && result.data) {
					let schematics: SchematicData[] = result.data;
					if (newPage) schematicList.push(schematics);
					else schematicList[lastIndex] = schematics;

					if (schematics.length < MAX_ITEM_PER_PAGE) setLoaderState(LoaderState.NO_MORE);
					else setLoaderState(LoaderState.MORE);

					setSchematicList([...schematicList]);
				} else setLoaderState(LoaderState.NO_MORE);
			})
			.catch(() => setLoaderState(LoaderState.MORE));
	}

	const schematicArray: ReactElement[] = [];
	for (let p = 0; p < schematicList.length; p++) {
		for (let i = 0; i < schematicList[p].length; i++) {
			let schematic = schematicList[p][i];

			const blob = new Blob([schematic.data], { type: 'text/plain' });
			const url = window.URL.createObjectURL(blob);

			schematicArray.push(
				<section className='schematic-preview'>
					<button
						className='schematic-image-wrapper'
						type='button'
						onClick={() => {
							setCurrentSchematic(schematic);
							setShowSchematicModel(true);
						}}>
						<LazyLoadImage className='schematic-image' path={`schematic-upload/${schematic.id}/image`}></LazyLoadImage>
					</button>
					<div className='schematic-preview-description flexbox-center'>{capitalize(schematic.name)}</div>

					<section className='schematic-info-button-container grid-row small-gap small-padding'>
						<a className='button  small-padding' href={url} download={`${schematic.name.trim().replaceAll(' ', '_')}.msch`}>
							<img src='/assets/icons/upload.png' alt='download' />
						</a>
						<button
							className='button small-padding'
							onClick={() => {
								navigator.clipboard.writeText(schematic.data).then(() => alert('Copied'));
							}}>
							<img src='/assets/icons/copy.png' alt='copy' />
						</button>
					</section>
				</section>
			);
		}
	}

	class SchematicVerifyPanel extends Component<{ schematic: SchematicData }, { tags: TagChoice[]; tag: string }> {
		state = {
			tags: TagChoice.parseArray(this.props.schematic.tags, schematicUploadTag),
			tag: ''
		};

		handleRemoveTag(index: number) {
			this.setState({ tags: [...this.state.tags.filter((_, i) => i !== index)] });
		}

		deleteSchematic(id: string) {
			setShowSchematicModel(false);
			API.REQUEST.delete(`schematic-upload/${id}`) //
				.finally(() => loadToPage(schematicList.length));
		}

		verifySchematic(schematic: SchematicData) {
			let form = new FormData();
			const tagString = `${this.state.tags.map((t) => `${t.name}:${t.value}`).join()}`;

			form.append('id', schematic.id);
			form.append('authorId', schematic.authorId);
			form.append('data', schematic.data);

			form.append('tags', tagString);

			API.REQUEST.post('schematic', form) //
				.finally(() => {
					loadToPage(schematicList.length);
					setShowSchematicModel(false);
				});
		}

		handleAddTag(tag: TagChoice) {
			if (!tag) return;
			this.state.tags.filter((q) => q.name !== tag.name);
			this.setState((prev) => ({ tags: [...prev.tags, tag], tag: '' }));
		}

		render() {
			const blob = new Blob([this.props.schematic.data], { type: 'text/plain' });
			const url = window.URL.createObjectURL(blob);

			return (
				<div className='schematic-info-container' onClick={(event) => event.stopPropagation()}>
					<LazyLoadImage className='schematic-info-image' path={`schematic-upload/${this.props.schematic.id}/image`} />
					<div className='schematic-info-desc-container small-gap'>
						<span>Name: {capitalize(this.props.schematic.name)}</span>
						<span>
							Author: <UserName userId={this.props.schematic.authorId} />
						</span>
						{this.props.schematic.description && <span>{this.props.schematic.description}</span>}
						{this.props.schematic.requirement && (
							<section className='requirement-container flexbox-row small-gap'>
								{this.props.schematic.requirement.map((r, index) => (
									<span key={index} className='text-center'>
										<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
										<span> {r.amount} </span>
									</span>
								))}
							</section>
						)}

						<div className='flexbox-column small-gap'>
							<Dropbox
								placeholder='Add tags'
								value={this.state.tag}
								items={schematicUploadTag.filter((t) => (t.name.includes(this.state.tag) || t.value.includes(this.state.tag)) && !this.state.tags.includes(t))}
								onChange={(event) => this.setState({ tag: event.target.value })}
								onChoose={(item) => this.handleAddTag(item)}
								converter={(t, index) => (
									<span key={index}>
										<Trans i18nKey={t.name} /> : <Trans i18nKey={t.value} />
									</span>
								)}
							/>
							<div className='tag-container'>
								{this.state.tags.map((t: TagChoice, index: number) => (
									<Tag key={index} tag={t} removeButton={<TagRemoveButton onClick={() => this.handleRemoveTag(index)} />} />
								))}
							</div>
						</div>
						<section className='flexbox-center flex-nowrap small-gap'>
							<a className='button  small-padding' href={url} download={`${this.props.schematic.name.trim().replaceAll(' ', '_')}.msch`}>
								<img src='/assets/icons/upload.png' alt='download' />
							</a>
							<button
								className='button  small-padding'
								onClick={() => {
									navigator.clipboard.writeText(this.props.schematic.data).then(() => alert('Copied'));
								}}>
								<img src='/assets/icons/copy.png' alt='copy' />
							</button>

							<button type='button' className='button' onClick={() => this.verifySchematic(this.props.schematic)}>
								Verify
							</button>
							<button type='button' className='button' onClick={() => this.deleteSchematic(this.props.schematic.id)}>
								Reject
							</button>
						</section>
					</div>
				</div>
			);
		}
	}

	if (showSchematicModel === true && currentSchematic !== undefined)
		return (
			<div className='schematic-info-modal model flexbox-center image-background' onClick={() => setShowSchematicModel(false)}>
				<div className='flexbox-center'>
					<div className='schematic-card '>
						<SchematicVerifyPanel schematic={currentSchematic} />
					</div>
				</div>
			</div>
		);

	return (
		<div className='verify-schematic'>
			<section className='schematic-container'>{schematicArray}</section>
			<footer className='schematic-container-footer'>
				{loaderState === LoaderState.LOADING ? (
					<LoadingSpinner />
				) : (
					<section className='grid-row'>
						<button className='button' onClick={() => loadPage()}>
							{loaderState === LoaderState.MORE ? 'Load more' : 'No schematic left'}
						</button>
						<ScrollToTopButton />
					</section>
				)}
			</footer>
		</div>
	);
};
