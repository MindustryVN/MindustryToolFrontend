import './SchematicPage.css';
import '../../styles.css';

import { useState, useEffect, ChangeEvent, ReactElement, useRef } from 'react';
import { capitalize } from '../../util/StringUtils';
import { API } from '../../AxiosConfig';
import { LoaderState, MAX_ITEM_PER_PAGE } from '../../config/Config';
import Tag, { CustomTag, TagChoice, SCHEMATIC_SORT_CHOICE, SCHEMATIC_TAG } from '../../components/common/Tag';

import SchematicInfo from './SchematicInfo';
import LazyLoadImage from '../../components/common/LazyLoadImage';
import SearchBar from '../../components/common/SearchBar';
import TagQuery from '../../components/common/TagQuery';
import UserName from '../user/LoadUserName';
import Dropbox from '../../components/common/Dropbox';
import React from 'react';

const Schematic = () => {
	const [loaderState, setLoaderState] = useState<LoaderState>(LoaderState.LOADING);

	const [schematicList, setSchematicList] = useState<SchematicInfo[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicInfo>();

	const [tag, setTag] = useState(SCHEMATIC_TAG[0]);
	const [sortQuery, setSortQuery] = useState<TagChoice>(SCHEMATIC_SORT_CHOICE[0]);
	const [content, setContent] = useState('');
	const [tagQuery, setTagQuery] = useState<TagQuery[]>([]);

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const currentQuery = useRef<{ tag: TagQuery[]; sort: TagChoice }>({ tag: [], sort: SCHEMATIC_SORT_CHOICE[0] });

	useEffect(() => loadPage(), [sortQuery]);

	function loadPage() {
		setLoaderState(LoaderState.LOADING);

		if (tagQuery !== currentQuery.current.tag || sortQuery !== currentQuery.current.sort) {
			setSchematicList([[]]);
			currentQuery.current = { tag: tagQuery, sort: sortQuery };
		}

		const lastIndex = schematicList.length - 1;
		const newPage = schematicList[lastIndex].length === MAX_ITEM_PER_PAGE;
		API.get(`schematics/page/${schematicList.length + (newPage ? 0 : -1)}`, {
			params: {
				tags: `${tagQuery.map((q) => `${q.toString()}`).join()}`, //
				sort: sortQuery.value
			}
		})
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
			.catch(() => setLoaderState(LoaderState.MORE));
	}

	function handleContentInput(event: ChangeEvent<HTMLInputElement>) {
		if (event) {
			const input = event.target.value;
			setContent(input.trim());
		}
	}

	function handleRemoveTag(index: number) {
		setTagQuery([...tagQuery.filter((_, i) => i !== index)]);
	}

	function handleAddTag() {
		const q = tagQuery.filter((q) => q.category !== tag.category);
		const v = tag.getValues();

		if (v === null || (v !== null && v.find((c: TagChoice) => c.value === content) !== undefined)) {
			setTagQuery([...q, new TagQuery(tag.category, tag.color, content)]);
		} else alert('Invalid tag ' + tag.category + ': ' + content);
	}

	function buildSchematicInfo(schematic: SchematicInfo) {
		const blob = new Blob([schematic.data], { type: 'text/plain' });
		const tagArray: TagQuery[] = [];
		for (let t of schematic.tags) {
			const v = t.split(':');
			if (v.length !== 2) continue;
			const r = SCHEMATIC_TAG.find((st: CustomTag) => st.category === v[0]);
			if (r) {
				tagArray.push(new TagQuery(v[0], r.color, v[1]));
			}
		}
		const url = window.URL.createObjectURL(blob);

		return (
			<div className='schematic-info-modal model image-background' onClick={() => setShowSchematicModel(false)}>
				<div className='schematic-card dark-background'>
					<div className='schematic-info-container' onClick={(event) => event.stopPropagation()}>
						<LazyLoadImage className='schematic-info-image' path={`schematics/${schematic.id}/image`}></LazyLoadImage>
						<div className='schematic-info-desc-container'>
							<span>Name: {capitalize(schematic.name)}</span>
							<span>
								Author: <UserName userId={schematic.authorId} />
							</span>
							<span>Like: {schematic.like}</span>
							<span>Dislike: {schematic.dislike}</span>
							{schematic.description && <span>{schematic.description}</span>}
							{schematic.requirement && (
								<section className='requirement-container flexbox-row small-gap'>
									{schematic.requirement.map((r, index) => (
										<span key={index} className='text-center'>
											<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
											<span> {r.amount} </span>
										</span>
									))}
								</section>
							)}
							{tagArray && (
								<section className='flexbox-row flex-wrap'>
									{tagArray.map((t: TagQuery, index: number) => (
										<Tag key={index} index={index} name={t.category} value={t.value} color={t.color} />
									))}
								</section>
							)}
							<section className='schematic-info-button-container'>
								<button
									className='button-transparent'
									onClick={() => {
										if (currentSchematic) currentSchematic.like += 1;
									}}>
									<img src='/assets/icons/play-2.png' className='model-icon' style={{ rotate: '-90deg' }} alt='check' />
								</button>
								<button
									className='button-transparent'
									onClick={() => {
										if (currentSchematic) currentSchematic.dislike += 1;
									}}>
									<img src='/assets/icons/play-2.png' className='model-icon' style={{ rotate: '90deg' }} alt='check' />
								</button>
								<a className='button-transparent' href={url} download={`${schematic.name.trim().replaceAll(' ', '_')}.msch`}>
									<img src='/assets/icons/upload.png' className='model-icon' alt='check' />
								</a>
								<button
									className='button-transparent'
									onClick={() => {
										navigator.clipboard.writeText(schematic.data).then(() => alert('Copied'));
									}}>
									<img src='/assets/icons/copy.png' className='model-icon' alt='check' />
								</button>
								<button className='button-transparent'>
									<img src='/assets/icons/trash-16.png' className='model-icon' alt='check' />
								</button>
							</section>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const tagSubmitButton = (
		<button
			className='button-transparent'
			title='Add'
			type='button'
			onClick={(event) => {
				handleAddTag();
				event.stopPropagation();
			}}>
			<img src='/assets/icons/check.png' alt='check' />
		</button>
	);

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
					<LazyLoadImage className='schematic-image' path={`schematics/${schematic.id}/image`}></LazyLoadImage>
					<div className='schematic-preview-description flexbox-center'>{capitalize(schematic.name)}</div>
				</div>
			);
		}
	}

	let tagValue = tag.getValues();
	tagValue = tagValue == null ? [] : tagValue;

	return (
		<div className='schematic '>
			<section className='search-container'>
				<Dropbox
					value={'Tag: ' + capitalize(tag.category)}
					submitButton={
						<button className='button-transparent' title='Search' type='button' onClick={(e) => loadPage()}>
							<img src='/assets/icons/search.png' alt='search'></img>
						</button>
					}>
					{SCHEMATIC_TAG.filter((t) => !tagQuery.find((q) => q.category === t.category)).map((t, index) => (
						<div
							key={index}
							onClick={() => {
								setTag(t);
								setContent('');
							}}>
							{capitalize(t.category)}
						</div>
					))}
				</Dropbox>

				{tag.hasOption() ? (
					<Dropbox value={'Value: ' + capitalize(content)} submitButton={tagSubmitButton}>
						{tagValue.map((content: { name: string; value: string }, index: number) => (
							<div key={index} onClick={() => setContent(content.value)}>
								{capitalize(content.name)}
							</div>
						))}
					</Dropbox>
				) : (
					<SearchBar placeholder='Search' value={content} onChange={handleContentInput} submitButton={tagSubmitButton} />
				)}
			</section>
			<section className='search-tag-container'>
				{tagQuery.map((t: TagQuery, index: number) => (
					<Tag
						key={index}
						index={index}
						name={t.category}
						value={t.value}
						color={t.color}
						removeButton={
							<button className='remove-tag-button button-transparent' type='button' onClick={() => handleRemoveTag(index)}>
								<img src='/assets/icons/quit.png' alt='quit'></img>
							</button>
						}
					/>
				))}
			</section>
			<section className='sort-container'>
				{SCHEMATIC_SORT_CHOICE.map((c: TagChoice, index) => (
					<button className={'sort-choice ' + (c == sortQuery ? 'button-selected' : 'button-normal')} type='button' key={index} onClick={() => setSortQuery(c)}>
						{capitalize(c.name)}
					</button>
				))}
			</section>
			<section className='schematic-container'>{schematicArray}</section>
			<footer className='schematic-container-footer'>
				{loaderState === LoaderState.LOADING ? (
					<div className='loading-spinner flexbox-center' />
				) : (
					<button className='load-more-button button-normal' onClick={() => loadPage()}>
						{loaderState === LoaderState.MORE ? 'Load more' : 'No schematic left'}
					</button>
				)}
			</footer>
			{showSchematicModel === true && currentSchematic !== undefined && buildSchematicInfo(currentSchematic)}
		</div>
	);
};

export default Schematic;
