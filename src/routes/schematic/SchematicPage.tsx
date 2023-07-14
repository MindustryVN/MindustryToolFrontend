import 'src/styles.css';
import './SchematicPage.css';

import React, { useContext, useRef, useState } from 'react';
import { API } from 'src/API';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import Dropbox from 'src/components/dropbox/Dropbox';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import SchematicData, { Schematics } from 'src/components/schematic/SchematicData';
import { SCHEMATIC_SORT_CHOICE, SortChoice, TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import TagPick from 'src/components/tag/TagPick';
import { API_BASE_URL } from 'src/config/Config';
import IconButton from 'src/components/button/IconButton';
import SchematicPreview from 'src/components/schematic/SchematicPreview';
import ClearIconButton from 'src/components/button/ClearIconButton';
import { Utils } from 'src/util/Utils';
import { UserContext } from 'src/components/provider/UserProvider';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import i18n from 'src/util/I18N';
import LoadUserName from 'src/components/user/LoadUserName';
import useClipboard from 'src/hooks/UseClipboard';
import usePage from 'src/hooks/UsePage';
import useModel from 'src/hooks/UseModel';
import SchematicInfoImage from 'src/components/schematic/SchematicInfoImage';
import SchematicContainer from 'src/components/schematic/SchematicContainer';
import { Trans } from 'react-i18next';
import SchematicRequirement from 'src/components/schematic/SchematicRequirement';
import SchematicDescription from 'src/components/schematic/SchematicDescription';
import TagContainer from 'src/components/tag/TagContainer';
import DownloadButton from 'src/components/button/DownloadButton';
import Button from 'src/components/button/Button';
import Condition from 'src/components/common/Condition';
import TagEditContainer from 'src/components/tag/TagEditContainer';

export default function Schematic() {
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();
	const [tag, setTag] = useState<string>('');

	const [sortQuery, setSortQuery] = useState<SortChoice>(SCHEMATIC_SORT_CHOICE[0]);
	const [tagQuery, setTagQuery] = useState<TagChoiceLocal[]>([]);

	const currentQuery = useRef<{ tag: TagChoiceLocal[]; sort: SortChoice }>({
		tag: tagQuery,
		sort: sortQuery,
	});

	const searchConfig = {
		params: {
			tags: Tags.toString(currentQuery.current.tag), //
			sort: currentQuery.current.sort.value,
		},
	};

	const { pages, loadPage, loaderState } = usePage<SchematicData>('schematic/page', searchConfig);

	const { user } = useContext(UserContext);
	const { addPopupMessage } = useContext(PopupMessageContext);
	const { model, setOpenModel } = useModel();
	const { copy } = useClipboard();

	function handleRemoveTag(index: number) {
		setTagQuery([...tagQuery.filter((_, i) => i !== index)]);
	}

	function handleAddTag(tag: TagChoiceLocal) {
		tagQuery.filter((q) => q.name !== tag.name);
		setTagQuery([...tagQuery, tag]);
		setTag('');
	}

	function handleDeleteSchematic(schematic: SchematicData) {
		API.REQUEST.delete(`schematic/${schematic.id}`) //
			.then(() =>
				addPopupMessage({
					message: i18n.t('schematic.delete-success'),
					duration: 5,
					type: 'info',
				}),
			)
			.catch(() =>
				addPopupMessage({
					message: i18n.t('schematic.delete-fail'),
					duration: 5,
					type: 'warning',
				}),
			);
	}

	function buildSchematicInfo(schematic: SchematicData) {
		return (
			<main className='flex-space-between small-gap'>
				<section className='flex-row medium-gap flex-wrap'>
					<SchematicInfoImage src={`${API_BASE_URL}schematic/${schematic.id}/image`} />
					<section className='flex-column small-gap flex-wrap'>
						<h2 className='capitalize'>{schematic.name}</h2>
						<Trans i18nKey='author' /> <LoadUserName userId={schematic.authorId} />
						<SchematicDescription schematic={schematic} />
						<SchematicRequirement schematic={schematic} />
						<TagContainer tags={Tags.parseArray(schematic.tags, Tags.SCHEMATIC_SEARCH_TAG)} />
						<Trans i18nKey='verify-by' /> <LoadUserName userId={schematic.verifyAdmin} />
					</section>
				</section>
				<section className='grid-row small-gap'>
					<IconButton icon='/assets/icons/up-vote.png' onClick={() => {}} />
					<IconButton icon='/assets/icons/down-vote.png' onClick={() => {}} />
					<IconButton icon='/assets/icons/copy.png' onClick={() => copy(schematic.data)} />
					<DownloadButton href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`} />
					<Condition condition={Schematics.canDelete(schematic, user)} element={<IconButton icon='/assets/icons/trash-16.png' onClick={() => handleDeleteSchematic(schematic)} />} />
					<Button onClick={() => setOpenModel(false)} children={<Trans i18nKey='back' />} />
				</section>
			</main>
		);
	}

	function buildSchematicPreview(schematic: SchematicData){

	}

	return (
		<main id='schematic' className='schematic flex-column small-gap'>
			<header className='flex-column medium-gap'>
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
						<Button className='capitalize' active={c === sortQuery} key={c.name} onClick={() => setSortQuery(c)}>
							{c.name}
						</Button>
					))}
				</section>
			</header>
			<SchematicContainer>
				{pages.map((schematic, index) => (
					<SchematicPreview
						key={index}
						schematic={schematic}
						imageUrl={`${API_BASE_URL}schematic/${schematic.id}/image`}
						onClick={() => {
							setCurrentSchematic(schematic);
							setOpenModel(true);
						}}
						buttons={[
							<IconButton
								key={0}
								title='up vote'
								icon='/assets/icons/up-vote.png'
								onClick={() =>
									addPopupMessage({
										message: i18n.t('schematic.liked'),
										duration: 5,
										type: 'info',
									})
								}
							/>, //
							<IconButton
								key={1}
								title='down vote'
								icon='/assets/icons/down-vote.png'
								onClick={() =>
									addPopupMessage({
										message: i18n.t('schematic.disliked'),
										duration: 5,
										type: 'info',
									})
								}
							/>, //
							<IconButton key={2} title='copy' icon='/assets/icons/copy.png' onClick={() => copy(schematic.data)} />, //
							<a key={3} className='button small-padding' href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`}>
								<img src='/assets/icons/download.png' alt='download' />
							</a>,
						]}
					/>
				))}
			</SchematicContainer>

			<footer className='flex-center'>
				{loaderState === 'loading' ? (
					<LoadingSpinner />
				) : (
					<section className='grid-row small-gap'>
						<button className='button' type='button' onClick={() => loadPage()}>
							{i18n.t(loaderState === 'more' ? 'load-more' : 'no-more-schematic')}
						</button>
						<ScrollToTopButton containerId='schematic' />
					</section>
				)}
			</footer>

			{currentSchematic && model(buildSchematicInfo(currentSchematic))}
		</main>
	);
}
