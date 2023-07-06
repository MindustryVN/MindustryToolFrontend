import '../../styles.css';
import './SchematicPage.css';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { API } from '../../API';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';
import Dropbox from '../../components/dropbox/Dropbox';
import LoadingSpinner from '../../components/loader/LoadingSpinner';
import SchematicData from '../../components/schematic/SchematicData';
import Tag, { SCHEMATIC_SORT_CHOICE, SortChoice, TagChoiceLocal } from '../../components/tag/Tag';
import TagPick from '../../components/tag/TagPick';
import UserData from '../../components/user/UserData';
import { API_BASE_URL, LoaderState, MAX_ITEM_PER_PAGE } from '../../config/Config';
import UserName from '../../components/user/LoadUserName';
import IconButton from '../../components/button/IconButton';
import SchematicPreview from '../../components/schematic/SchematicPreview';
import { COPY_ICON, DOWN_VOTE_ICON, QUIT_ICON, UP_VOTE_ICON } from '../../components/common/Icon';
import ClearIconButton from '../../components/button/ClearIconButton';
import { Utils } from '../../util/Utils';
import { UserContext } from '../../components/provider/UserProvider';
import { AlertContext } from '../../components/provider/AlertProvider';
import i18n from '../../util/I18N';
import LoadUserName from '../../components/user/LoadUserName';

export default function Schematic() {
	const [loaderState, setLoaderState] = useState<LoaderState>(LoaderState.MORE);

	const [schematicList, setSchematicList] = useState<SchematicData[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const [tag, setTag] = useState<string>('');

	const [sortQuery, setSortQuery] = useState<SortChoice>(SCHEMATIC_SORT_CHOICE[0]);
	const [tagQuery, setTagQuery] = useState<TagChoiceLocal[]>([]);

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const currentQuery = useRef<{ tag: TagChoiceLocal[]; sort: SortChoice }>({ tag: [], sort: SCHEMATIC_SORT_CHOICE[0] });

	const controller = new AbortController();

	const { user } = useContext(UserContext);

	useEffect(() => loadPage(), [sortQuery]);

	const { useAlert } = useContext(AlertContext);

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

	function handleAddTag(tag: TagChoiceLocal) {
		if (!tag) return;

		tagQuery.filter((q) => q.name !== tag.name);
		setTagQuery([...tagQuery, tag]);
		setTag('');
	}

	function buildSchematicData(schematic: SchematicData) {
		return (
			<main className='schematic-info small-gap'>
				<section className='flex-row medium-gap flex-wrap'>
					<img className='schematic-info-image' src={`${API_BASE_URL}schematic/${schematic.id}/image`} />
					<section className='flex-column small-gap flex-wrap'>
						Name: <span className='capitalize'>{schematic.name}</span>
						By: <UserName userId={schematic.authorId} />
						{schematic.description && <span className='capitalize'>{schematic.description}</span>}
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
								{TagChoiceLocal.parseArray(schematic.tags, TagChoiceLocal.SCHEMATIC_SEARCH_TAG).map((t: TagChoiceLocal, index: number) => (
									<Tag key={index} tag={t} />
								))}
							</section>
						)}
						{schematic.verifyAdmin && (
							<span className='capitalize'>
								Verified by: <LoadUserName userId={schematic.verifyAdmin} />
							</span>
						)}
					</section>
				</section>
				<section className='schematic-info-button-container grid-row small-gap'>
					<button
						className='button'
						type='button'
						onClick={() => {
							if (currentSchematic) currentSchematic.like += 1;
						}}>
						<img src='/assets/icons/play-2.png' style={{ rotate: '-90deg' }} alt='like' />
					</button>
					<button
						className='button'
						type='button'
						onClick={() => {
							if (currentSchematic) currentSchematic.dislike += 1;
						}}>
						<img src='/assets/icons/play-2.png' style={{ rotate: '90deg' }} alt='dislike' />
					</button>
					<a className='button small-padding' href={Utils.getDownloadUrl(schematic.data)} download={`${schematic.name.trim().replaceAll(' ', '_')}.msch`}>
						<img src='/assets/icons/download.png' alt='download' />
					</a>
					<button className='button' type='button' onClick={() => Utils.copyDataToClipboard(schematic.data).then(() => useAlert(i18n.t('copied'), 10, 'info'))}>
						<img src='/assets/icons/copy.png' alt='copy' />
					</button>
					{user && (schematic.authorId === user.id || UserData.isAdmin(user)) && (
						<button className='button' type='button'>
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
		<main id='schematic' className='schematic'>
			<header className='flex-column medium-gap'>
				<section className='search-container'>
					<Dropbox
						placeholder='Search with tags'
						value={tag}
						items={TagChoiceLocal.SCHEMATIC_SEARCH_TAG.filter((t) => `${t.displayName}:${t.displayValue}`.toLowerCase().includes(tag.toLowerCase()) && !tagQuery.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						insideChildren={<ClearIconButton icon='/assets/icons/search.png' title='search' onClick={() => loadPage()} />}
						converter={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<section className='flexbox small-gap flex-wrap center'>
					{tagQuery.map((t: TagChoiceLocal, index: number) => (
						<Tag key={index} tag={t} removeButton={<ClearIconButton icon={QUIT_ICON} title='remove' onClick={() => handleRemoveTag(index)} />} />
					))}
				</section>
				<section className='sort-container grid-row small-gap center'>
					{SCHEMATIC_SORT_CHOICE.map((c: SortChoice, index) => (
						<button className={'sort-choice capitalize button ' + (c == sortQuery ? 'button-active' : '')} type='button' key={index} onClick={() => setSortQuery(c)}>
							{c.name}
						</button>
					))}
				</section>
			</header>
			<section className='schematic-container'>
				{Utils.array2dToArray(schematicList, (schematic, index) => (
					<SchematicPreview
						key={index}
						schematic={schematic}
						imageUrl={`${API_BASE_URL}schematic/${schematic.id}/image`}
						onClick={() => {
							setCurrentSchematic(schematic);
							setShowSchematicModel(true);
						}}
						buttons={[
							<IconButton key={0} title='up vote' icon={UP_VOTE_ICON} onClick={() => useAlert(i18n.t('schematic.liked'), 5, 'info')} />, //
							<IconButton key={1} title='down vote' icon={DOWN_VOTE_ICON} onClick={() => useAlert(i18n.t('schematic.disliked'), 5, 'info')} />, //
							<IconButton key={2} title='copy' icon={COPY_ICON} onClick={() => Utils.copyDataToClipboard(schematic.data).then(() => useAlert(i18n.t('copied'), 10, 'info'))} />, //
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
		</main>
	);
}
