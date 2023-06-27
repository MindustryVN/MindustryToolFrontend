import './SchematicPage.css';
import '../../styles.css';

import { useState, useEffect, ReactElement, useRef } from 'react';
import { capitalize } from '../../util/StringUtils';
import { API } from '../../API';
import { Trans } from 'react-i18next';
import { LoaderState, MAX_ITEM_PER_PAGE } from '../../config/Config';
import Tag, { CustomTag, SCHEMATIC_SORT_CHOICE, SortChoice, TagChoice } from '../../components/common/Tag';

import SchematicInfo from './SchematicInfo';
import LazyLoadImage from '../../components/common/LazyLoadImage';
import UserName from '../user/LoadUserName';
import Dropbox from '../../components/common/Dropbox';
import React from 'react';
import UserInfo from '../user/UserInfo';

const Schematic = ({ user }: { user: UserInfo | undefined }) => {
	const [loaderState, setLoaderState] = useState<LoaderState>(LoaderState.LOADING);

	const [schematicList, setSchematicList] = useState<SchematicInfo[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicInfo>();

	const [tag, setTag] = useState<string>('');

	const [sortQuery, setSortQuery] = useState<SortChoice>(SCHEMATIC_SORT_CHOICE[0]);
	const [tagQuery, setTagQuery] = useState<TagChoice[]>([]);

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const currentQuery = useRef<{ tag: TagChoice[]; sort: SortChoice }>({ tag: [], sort: SCHEMATIC_SORT_CHOICE[0] });

	const [schematicSearchTag, setSchematicSearchTag] = useState<Array<TagChoice>>([]);

	useEffect(() => {
		getSchematicSearchTag();
		loadPage();
	}, [sortQuery]);

	function getSchematicSearchTag() {
		API.REQUEST.get('tag/schematic-search-tag') //
			.then((result) => {
				let customTagList: Array<CustomTag> = result.data;
				let tagChoiceList: Array<TagChoice> = [];
				let temp = customTagList.map((customTag) => customTag.value.map((v) => new TagChoice(customTag.name, v, customTag.color)));

				temp.forEach((t) => t.forEach((r) => tagChoiceList.push(r)));
				setSchematicSearchTag(tagChoiceList);
			});
	}

	function loadPage() {
		setLoaderState(LoaderState.LOADING);

		if (tagQuery !== currentQuery.current.tag || sortQuery !== currentQuery.current.sort) {
			setSchematicList([[]]);
			currentQuery.current = { tag: tagQuery, sort: sortQuery };
		}

		const lastIndex = schematicList.length - 1;
		const newPage = schematicList[lastIndex].length === MAX_ITEM_PER_PAGE;
		API.REQUEST.get(`schematic/page/${schematicList.length + (newPage ? 0 : -1)}`, {
			params: {
				tags: `${tagQuery.map((t) => `${t.name}:${t.value}`).join()}`, //
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

	function handleRemoveTag(index: number) {
		setTagQuery([...tagQuery.filter((_, i) => i !== index)]);
	}

	function handleAddTag(tag: TagChoice) {
		if (!tag) return;

		tagQuery.filter((q) => q.name !== tag.name);
		setTagQuery([...tagQuery, tag]);
		setTag('');
	}

	function buildSchematicInfo(schematic: SchematicInfo) {
		const blob = new Blob([schematic.data], { type: 'text/plain' });
		const url = window.URL.createObjectURL(blob);

		return (
			<div className='schematic-info-modal model image-background' onClick={() => setShowSchematicModel(false)}>
				<div className='schematic-card dark-background'>
					<div className='schematic-info-container' onClick={(event) => event.stopPropagation()}>
						<LazyLoadImage className='schematic-info-image' path={`schematic/${schematic.id}/image`}></LazyLoadImage>
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
							{schematic.tags && (
								<section className='flexbox-row flex-wrap'>
									{TagChoice.parseArray(schematic.tags, schematicSearchTag).map((t: TagChoice, index: number) => (
										<Tag key={index} index={index} tag={t} />
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
								{user && (schematic.authorId === user.id || UserInfo.isAdmin(user)) && (
									<button className='button-transparent'>
										<img src='/assets/icons/trash-16.png' className='model-icon' alt='check' />
									</button>
								)}
							</section>
						</div>
					</div>
				</div>
			</div>
		);
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
					<LazyLoadImage className='schematic-image' path={`schematic/${schematic.id}/image`}></LazyLoadImage>
					<div className='schematic-preview-description flexbox-center'>{capitalize(schematic.name)}</div>
				</div>
			);
		}
	}

	return (
		<div className='schematic '>
			<section className='search-container'>
				<Dropbox
					value={tag}
					onChange={(event) => setTag(event.target.value)}
					submitButton={
						<button className='button-transparent' title='Search' type='button' onClick={() => loadPage()}>
							<img src='/assets/icons/search.png' alt='search'></img>
						</button>
					}>
					{schematicSearchTag
						.filter((t) => t.name.includes(tag) || t.value.includes(tag))
						.map((t, index) => (
							<div key={index} onClick={() => handleAddTag(t)}>
								<Trans i18nKey={t.name} /> : <Trans i18nKey={t.value} />
							</div>
						))}
				</Dropbox>
			</section>
			<section className='search-tag-container'>
				{tagQuery.map((t: TagChoice, index: number) => (
					<Tag
						key={index}
						index={index}
						tag={t}
						removeButton={
							<button className='remove-tag-button button-transparent' type='button' onClick={() => handleRemoveTag(index)}>
								<img src='/assets/icons/quit.png' alt='quit'></img>
							</button>
						}
					/>
				))}
			</section>
			<section className='sort-container'>
				{SCHEMATIC_SORT_CHOICE.map((c: SortChoice, index) => (
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
					<button className='load-more-button button-normal' type='button' onClick={() => loadPage()}>
						{loaderState === LoaderState.MORE ? 'Load more' : 'No schematic left'}
					</button>
				)}
			</footer>
			{showSchematicModel === true && currentSchematic !== undefined && buildSchematicInfo(currentSchematic)}
		</div>
	);
};

export default Schematic;
