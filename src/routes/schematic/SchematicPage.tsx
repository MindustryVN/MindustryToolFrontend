import '../../styles.css';
import './SchematicPage.css';

import React, { useEffect, useRef, useState } from 'react';
import { API } from '../../API';
import ScrollToTopButton from '../../components/common/button/ScrollToTopButton';
import Dropbox from '../../components/common/dropbox/Dropbox';
import LoadingSpinner from '../../components/common/loader/LoadingSpinner';
import SchematicData from '../../components/common/schematic/SchematicData';
import Tag, { SCHEMATIC_SORT_CHOICE, SortChoice, TagChoice } from '../../components/common/tag/Tag';
import TagPick from '../../components/common/tag/TagPick';
import UserData from '../../components/common/user/UserData';
import { API_BASE_URL, LoaderState, MAX_ITEM_PER_PAGE } from '../../config/Config';
import { capitalize } from '../../util/StringUtils';
import UserName from '../../components/common/user/LoadUserName';
import { useGlobalContext } from '../../App';
import IconButton from '../../components/common/button/IconButton';
import SchematicPreview from '../../components/common/schematic/SchematicPreview';
import { COPY_ICON, DOWN_VOTE_ICON, QUIT_ICON, UP_VOTE_ICON } from '../../components/common/Icon';
import ClearIconButton from '../../components/common/button/ClearIconButton';
import { Utils } from '../../util/Utils';

const Schematic = () => {
	const [loaderState, setLoaderState] = useState<LoaderState>(LoaderState.MORE);

	const [schematicList, setSchematicList] = useState<SchematicData[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const [tag, setTag] = useState<string>('');

	const [sortQuery, setSortQuery] = useState<SortChoice>(SCHEMATIC_SORT_CHOICE[0]);
	const [tagQuery, setTagQuery] = useState<TagChoice[]>([]);

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const currentQuery = useRef<{ tag: TagChoice[]; sort: SortChoice }>({ tag: [], sort: SCHEMATIC_SORT_CHOICE[0] });

	const controller = new AbortController();

	const { user } = useGlobalContext();

	useEffect(() => loadPage(), [sortQuery]);

	function loadPage() {
		if (loaderState === LoaderState.LOADING) {
			controller.abort();
		}

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
			},
			signal: controller.signal
		})
			.then((result) => {
				let schematics: SchematicData[] = result.data;

				if (schematics.length) {
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
			<main className='schematic-info small-gap'>
				<section className='flex-row medium-gap flex-wrap'>
					<img className='schematic-info-image' src={`${API_BASE_URL}schematic/${schematic.id}/image`}/>
					<section className='flex-column small-gap flex-wrap'>
						<span>{capitalize(schematic.name)}</span>
						<UserName userId={schematic.authorId} />
						{schematic.description && <span>{capitalize(schematic.description)}</span>}
						{schematic.requirement && (
							<section className=' flex-row flex-wrap medium-gap'>
								{schematic.requirement.map((r, index) => (
									<span key={index} className='text-center'>
										<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
										<span> {r.amount} </span>
									</span>
								))}
							</section>
						)}
						{schematic.tags && (
							<section className='flex-row flex-wrap small-gap'>
								{TagChoice.parseArray(schematic.tags, TagChoice.SCHEMATIC_SEARCH_TAG).map((t: TagChoice, index: number) => (
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
						className='button small-padding center'
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

	if (showSchematicModel === true && currentSchematic !== undefined) return buildSchematicData(currentSchematic);

	return (
		<div id='schematic' className='schematic'>
			<header className='flex-column medium-gap'>
				<section className='search-container'>
					<Dropbox
						placeholder='Search with tags'
						value={tag}
						items={TagChoice.SCHEMATIC_SEARCH_TAG.filter((t) => (t.name.includes(tag) || t.value.includes(tag)) && !tagQuery.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						insideChildren={<ClearIconButton icon='/assets/icons/search.png' title='search' onClick={() => loadPage()} />}
						converter={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<section className='flexbox small-gap flex-wrap center'>
					{tagQuery.map((t: TagChoice, index: number) => (
						<Tag key={index} tag={t} removeButton={<ClearIconButton icon={QUIT_ICON} title='remove' onClick={() => handleRemoveTag(index)} />} />
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
			<section className='schematic-container'>
				{Utils.array2dToArray(schematicList, (schematic, index) => (
					<SchematicPreview
						key={index}
						schematic={schematic}
						onClick={() => {
							setCurrentSchematic(schematic);
							setShowSchematicModel(true);
						}}
						buttons={[
							<IconButton key={0} title='up vote' icon={UP_VOTE_ICON} onClick={() => console.log('Liked')} />, //
							<IconButton key={1} title='down vote' icon={DOWN_VOTE_ICON} onClick={() => console.log('Disliked')} />, //
							<IconButton key={2} title='copy' icon={COPY_ICON} onClick={() => Utils.copyDataToClipboard(schematic.data)} />, //
							<a key={3} className='button small-padding' href={Utils.getDownloadUrl(schematic.data)} download={`${schematic.name.trim().replaceAll(' ', '_')}.msch`}>
								<img src='/assets/icons/download.png' alt='download' />
							</a>
						]}
					/>
				))}
			</section>

			<footer className='flex-center'>
				{loaderState === LoaderState.LOADING ? (
					<LoadingSpinner />
				) : (
					<section className='grid-row small-gap'>
						<button className='button' type='button' onClick={() => loadPage()}>
							{loaderState === LoaderState.MORE ? 'Load more' : 'No schematic left'}
						</button>
						<ScrollToTopButton containerId='schematic' />
					</section>
				)}
			</footer>
		</div>
	);
};

export default Schematic;
