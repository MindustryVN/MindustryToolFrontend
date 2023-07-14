import 'src/styles.css';
import './SchematicPage.css';

import React, { useContext, useRef, useState } from 'react';
import SchematicData, { Schematics } from 'src/components/schematic/SchematicData';

import { SCHEMATIC_SORT_CHOICE, SortChoice, TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import { API_BASE_URL } from 'src/config/Config';
import { UserContext } from 'src/components/provider/UserProvider';
import { Utils } from 'src/util/Utils';
import { Trans } from 'react-i18next';
import { API } from 'src/API';

import SchematicPreviewImage from 'src/components/schematic/SchematicPreviewImage';
import SchematicDescription from 'src/components/schematic/SchematicDescription';
import SchematicRequirement from 'src/components/schematic/SchematicRequirement';
import SchematicInfoImage from 'src/components/schematic/SchematicInfoImage';
import SchematicContainer from 'src/components/schematic/SchematicContainer';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import SchematicPreview from 'src/components/schematic/SchematicPreview';
import TagEditContainer from 'src/components/tag/TagEditContainer';
import ClearIconButton from 'src/components/button/ClearIconButton';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import DownloadButton from 'src/components/button/DownloadButton';
import LoadUserName from 'src/components/user/LoadUserName';
import useClipboard from 'src/hooks/UseClipboard';
import TagContainer from 'src/components/tag/TagContainer';
import IconButton from 'src/components/button/IconButton';
import IfTrueElse from 'src/components/common/IfTrueElse';
import ColorText from 'src/components/common/ColorText';
import Dropbox from 'src/components/dropbox/Dropbox';
import useModel from 'src/hooks/UseModel';
import usePage from 'src/hooks/UsePage';
import TagPick from 'src/components/tag/TagPick';
import Button from 'src/components/button/Button';
import IfTrue from 'src/components/common/IfTrue';
import i18n from 'src/util/I18N';

export default function Schematic() {
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();
	const [tag, setTag] = useState<string>('');

	const [sortQuery, setSortQuery] = useState<SortChoice>(SCHEMATIC_SORT_CHOICE[0]);
	const [tagQuery, setTagQuery] = useState<TagChoiceLocal[]>([]);

	const searchConfig = useRef({
		params: {
			tags: Tags.toString(tagQuery), //
			sort: sortQuery.value,
		},
	});

	const { user } = useContext(UserContext);
	const { addPopupMessage } = useContext(PopupMessageContext);

	const { pages, loadPage, loaderState } = usePage<SchematicData>('schematic/page', searchConfig.current);
	const { model, setOpenModel } = useModel();
	const { copy } = useClipboard();

	function setSearchConfig(sort: SortChoice, tags: TagChoiceLocal[]) {
		searchConfig.current = {
			params: {
				tags: Tags.toString(tags), //
				sort: sort.value,
			},
		};
	}

	function handleSetSortQuery(sort: SortChoice) {
		setSortQuery(sort);
		setSearchConfig(sort, tagQuery);
	}

	function handleRemoveTag(index: number) {
		setTagQuery((prev) => {
			let tags = [...prev.filter((_, i) => i !== index)];
			setSearchConfig(sortQuery, tags);
			return tags;
		});
	}

	function handleAddTag(tag: TagChoiceLocal) {
		setTagQuery((prev) => {
			let tags = prev.filter((q) => q !== tag);
			tags = [...tags, tag];
			setSearchConfig(sortQuery, tags);
			return tags;
		});
		setTag('');
	}

	function handleDeleteSchematic(schematic: SchematicData) {
		API.REQUEST.delete(`schematic/${schematic.id}`) //
			.then(() => addPopupMessage(i18n.t('schematic.delete-success'), 5, 'info'))
			.catch(() => addPopupMessage(i18n.t('schematic.delete-fail'), 5, 'warning'));
	}

	function buildSchematicInfo(schematic: SchematicData) {
		return (
			<main className='flex-column space-between w100p h100p small-gap massive-padding border-box scroll-y'>
				<section className='flex-row medium-gap flex-wrap'>
					<SchematicInfoImage src={`${API_BASE_URL}schematic/${schematic.id}/image`} />
					<section className='flex-column small-gap flex-wrap'>
						<h2 className='capitalize'>{schematic.name}</h2>
						<Trans i18nKey='author' /> <LoadUserName userId={schematic.authorId} />
						<SchematicDescription description={schematic.description} />
						<SchematicRequirement requirement={schematic.requirement} />
						<TagContainer tags={Tags.parseArray(schematic.tags, Tags.SCHEMATIC_SEARCH_TAG)} />
						<Trans i18nKey='verify-by' /> <LoadUserName userId={schematic.verifyAdmin} />
					</section>
				</section>
				<section className='grid-row small-gap'>
					<IconButton icon='/assets/icons/up-vote.png' onClick={() => {}} />
					<IconButton icon='/assets/icons/down-vote.png' onClick={() => {}} />
					<IconButton icon='/assets/icons/copy.png' onClick={() => copy(schematic.data)} />
					<DownloadButton href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`} />
					<IfTrue condition={Schematics.canDelete(schematic, user)} whenTrue={<IconButton icon='/assets/icons/trash-16.png' onClick={() => handleDeleteSchematic(schematic)} />} />
					<Button onClick={() => setOpenModel(false)} children={<Trans i18nKey='back' />} />
				</section>
			</main>
		);
	}
	
	function handleOpenSchematicInfo(schematic: SchematicData) {
		setCurrentSchematic(schematic);
		setOpenModel(true);
	}

	function buildSchematicPreview(schematic: SchematicData) {
		return (
			<SchematicPreview key={schematic.id}>
				<SchematicPreviewImage src={`${API_BASE_URL}schematic/${schematic.id}/image`} onClick={() => handleOpenSchematicInfo(schematic)} />
				<ColorText className='capitalize small-padding flex-center text-center' text={schematic.name} />
				<section className='grid-row small-gap small-padding'>
					<IconButton title='up vote' icon='/assets/icons/up-vote.png' onClick={() => addPopupMessage(i18n.t('schematic.liked'), 5, 'info')} />
					<IconButton title='down vote' icon='/assets/icons/down-vote.png' onClick={() => addPopupMessage(i18n.t('schematic.disliked'), 5, 'info')} />
					<IconButton title='copy' icon='/assets/icons/copy.png' onClick={() => copy(schematic.data)} />
					<DownloadButton href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`} />
				</section>
			</SchematicPreview>
		);
	}

	function buildLoadAndScrollButton() {
		return (
			<section className='grid-row small-gap'>
				<Button onClick={() => loadPage()}>
					<IfTrueElse
						condition={loaderState === 'more'} //
						whenTrue={<Trans i18nKey='load-more' />}
						whenFalse={<Trans i18nKey='no-more-schematic' />}
					/>
				</Button>
				<ScrollToTopButton containerId='schematic' />
			</section>
		);
	}

	return (
		<main id='schematic' className='h100p w100p scroll-y flex-column small-gap'>
			<header className='flex-column medium-gap w100p'>
				<section className='search-container'>
					<Dropbox
						placeholder={i18n.t('search-with-tag').toString()}
						value={tag}
						items={Tags.SCHEMATIC_SEARCH_TAG.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tagQuery.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						insideChildren={<ClearIconButton icon='/assets/icons/search.png' title='search' onClick={() => loadPage()} />}
						mapper={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<TagEditContainer className='center' tags={tagQuery} onRemove={(index) => handleRemoveTag(index)} />
				<section className='sort-container grid-row small-gap center'>
					{SCHEMATIC_SORT_CHOICE.map((c: SortChoice) => (
						<Button className='capitalize' key={c.name} active={c === sortQuery} onClick={() => handleSetSortQuery(c)}>
							{c.name}
						</Button>
					))}
				</section>
			</header>
			<SchematicContainer children={pages.map((schematic) => buildSchematicPreview(schematic))} />
			<footer className='flex-center'>
				<IfTrueElse
					condition={loaderState === 'loading'}
					whenTrue={<LoadingSpinner />} //
					whenFalse={buildLoadAndScrollButton()}
				/>
			</footer>
			<IfTrue condition={currentSchematic} whenTrue={currentSchematic && model(buildSchematicInfo(currentSchematic))} />
		</main>
	);
}
