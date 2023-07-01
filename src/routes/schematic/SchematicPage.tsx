import '../../styles.css';
import './SchematicPage.css';

import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { API } from '../../API';
import { StarIcon, TrashCanIcon } from '../../components/Icon';
import Tag, { CustomTag, SCHEMATIC_SORT_CHOICE, SortChoice, TagChoice } from '../../components/common/tag/Tag';
import { LoaderState, MAX_ITEM_PER_PAGE } from '../../config/Config';
import { capitalize } from '../../util/StringUtils';

import ScrollToTopButton from '../../components/common/button/ScrollToTopButton';
import TagRemoveButton from '../../components/common/button/TagRemoveButton';
import Dropbox from '../../components/common/dropbox/Dropbox';
import LazyLoadImage from '../../components/common/img/LazyLoadImage';
import LoadingSpinner from '../../components/common/loader/LoadingSpinner';
import SchematicData from '../../components/common/schematic/SchematicData';
import TagPick from '../../components/common/tag/TagPick';
import UserData from '../../components/common/user/UserData';
import UserName from '../user/LoadUserName';

const Schematic = ({ user }: { user: UserData | undefined }) => {
	const [loaderState, setLoaderState] = useState<LoaderState>(LoaderState.LOADING);

	const [schematicList, setSchematicList] = useState<SchematicData[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

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
				let schematics: SchematicData[] = result.data;

				if (result.status === 200 && schematics.length > 0) {
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

	function buildSchematicData(schematic: SchematicData) {
		const blob = new Blob([Buffer.from(schematic.data, 'base64')], { type: 'text/plain' });
		const url = window.URL.createObjectURL(blob);

		return (
			<main className='schematic-info'>
				<section className='flexbox-row medium-gap flex-wrap'>
					<LazyLoadImage className='schematic-info-image' path={`schematic/${schematic.id}/image`}></LazyLoadImage>
					<section className='flexbox-column small-gap'>
						<span>{capitalize(schematic.name)}</span>
						<UserName userId={schematic.authorId} />
						<span>
							<StarIcon /> {schematic.like}
							<TrashCanIcon /> {schematic.dislike}
						</span>
						{schematic.description && <span>{capitalize(schematic.description)}</span>}
						{schematic.requirement && (
							<section className='requirement-container flexbox-row medium-gap'>
								{schematic.requirement.map((r, index) => (
									<span key={index} className='text-center'>
										<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
										<span> {r.amount} </span>
									</span>
								))}
							</section>
						)}
						{schematic.tags && (
							<section className='flexbox-row flex-wrap small-gap'>
								{TagChoice.parseArray(schematic.tags, schematicSearchTag).map((t: TagChoice, index: number) => (
									<Tag key={index} tag={t} />
								))}
							</section>
						)}
					</section>
				</section>
				<section className='schematic-info-button-container grid-row small-gap'>
					<button
						className='button small-padding'
						type='button'
						onClick={() => {
							if (currentSchematic) currentSchematic.like += 1;
						}}>
						<img src='/assets/icons/play-2.png' style={{ rotate: '-90deg' }} alt='like' />
					</button>
					<button
						className='button small-padding'
						type='button'
						onClick={() => {
							if (currentSchematic) currentSchematic.dislike += 1;
						}}>
						<img src='/assets/icons/play-2.png' style={{ rotate: '90deg' }} alt='dislike' />
					</button>
					<a className='button small-padding center' href={url} download={`${schematic.name.trim().replaceAll(' ', '_')}.msch`}>
						<img src='/assets/icons/download.png' alt='download' />
					</a>
					<button
						className='button small-padding'
						type='button'
						onClick={() => {
							navigator.clipboard.writeText(schematic.data).then(() => alert('Copied'));
						}}>
						<img src='/assets/icons/copy.png' alt='copy' />
					</button>
					{user && (schematic.authorId === user.id || UserData.isAdmin(user)) && (
						<button className='button  small-padding'>
							<img src='/assets/icons/trash-16.png' alt='delete' />
						</button>
					)}
					<button className='button' type='button' onClick={() => setShowSchematicModel(false)}>
						Back
					</button>
				</section>
			</main>
		);
	}

	const schematicArray: ReactElement[] = [];

	for (let p = 0; p < schematicList.length; p++) {
		for (let i = 0; i < schematicList[p].length; i++) {
			let schematic = schematicList[p][i];

			const blob = new Blob([Buffer.from(schematic.data, 'base64')], { type: 'text/plain' });

			const url = window.URL.createObjectURL(blob);
			schematicArray.push(
				<section key={p * MAX_ITEM_PER_PAGE + i} className='schematic-preview'>
					<button
						className='schematic-image-wrapper'
						type='button'
						onClick={() => {
							setCurrentSchematic(schematic);
							setShowSchematicModel(true);
						}}>
						<LazyLoadImage className='schematic-image' path={`schematic/${schematic.id}/image`}></LazyLoadImage>
					</button>

					<span className='schematic-preview-description flexbox-center'>{capitalize(schematic.name)}</span>

					<section className='schematic-info-button-container grid-row small-gap small-padding'>
						<button
							className='button small-padding'
							type='button'
							onClick={() => {
								if (currentSchematic) currentSchematic.like += 1;
							}}>
							<img src='/assets/icons/play-2.png' style={{ rotate: '-90deg' }} alt='like' />
						</button>
						<button
							className='button small-padding'
							type='button'
							onClick={() => {
								if (currentSchematic) currentSchematic.dislike += 1;
							}}>
							<img src='/assets/icons/play-2.png' style={{ rotate: '90deg' }} alt='dislike' />
						</button>
						<a className='button small-padding' href={url} download={`${schematic.name.trim().replaceAll(' ', '_')}.msch`}>
							<img src='/assets/icons/download.png' alt='download' />
						</a>
						<button className='button small-padding' type='button' onClick={() => navigator.clipboard.writeText(schematic.data).then(() => alert('Copied'))}>
							<img src='/assets/icons/copy.png' alt='copy' />
						</button>
						{user && (schematic.authorId === user.id || UserData.isAdmin(user)) && (
							<button className='button  small-padding' type='button'>
								<img src='/assets/icons/trash-16.png' alt='delete' />
							</button>
						)}
					</section>
				</section>
			);
		}
	}

	if (showSchematicModel === true && currentSchematic !== undefined) return buildSchematicData(currentSchematic);

	return (
		<div className='schematic'>
			<header className='flexbox-column medium-gap'>
				<section className='search-container'>
					<Dropbox
						placeholder='Search with tags'
						value={tag}
						items={schematicSearchTag.filter((t) => (t.name.includes(tag) || t.value.includes(tag)) && !tagQuery.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						insideChildren={
							<button className='search-button' title='Search' type='button' onClick={() => loadPage()}>
								<img src='/assets/icons/search.png' alt='search' />
							</button>
						}
						converter={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<section className='flexbox small-gap flex-wrap center'>
					{tagQuery.map((t: TagChoice, index: number) => (
						<Tag key={index} tag={t} removeButton={<TagRemoveButton onClick={() => handleRemoveTag(index)} />} />
					))}
				</section>
				<section className='sort-container grid-row small-gap center'>
					{SCHEMATIC_SORT_CHOICE.map((c: SortChoice, index) => (
						<button className={'sort-choice button ' + (c == sortQuery ? 'button-active' : '')} type='button' key={index} onClick={() => setSortQuery(c)}>
							{capitalize(c.name)}
						</button>
					))}
				</section>
			</header>
			<section className='schematic-container'>{schematicArray}</section>
			<footer className='flexbox-center'>
				{loaderState === LoaderState.LOADING ? (
					<LoadingSpinner />
				) : (
					<section className='grid-row small-gap'>
						<button className='button' type='button' onClick={() => loadPage()}>
							{loaderState === LoaderState.MORE ? 'Load more' : 'No schematic left'}
						</button>
						<ScrollToTopButton />
					</section>
				)}
			</footer>
		</div>
	);
};

export default Schematic;
