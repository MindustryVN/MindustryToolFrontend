import 'src/styles.css';
import './SchematicPage.css';

import React, { useContext, useRef, useState } from 'react';
import SchematicData, { Schematics } from 'src/components/schematic/SchematicData';

import { SCHEMATIC_SORT_CHOICE, SortChoice, TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import { API_BASE_URL } from 'src/config/Config';
import { UserContext } from 'src/components/provider/UserProvider';
import { Utils } from 'src/util/Utils';
import { Trans } from 'react-i18next';
import { API } from 'src/API';

import SchematicPreviewImage from 'src/components/schematic/SchematicPreviewImage';
import SchematicPreviewCard from 'src/components/schematic/SchematicPreviewCard';
import SchematicDescription from 'src/components/schematic/SchematicDescription';
import SchematicRequirement from 'src/components/schematic/SchematicRequirement';
import SchematicInfoImage from 'src/components/schematic/SchematicInfoImage';
import SchematicContainer from 'src/components/schematic/SchematicContainer';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import TagEditContainer from 'src/components/tag/TagEditContainer';
import ClearIconButton from 'src/components/button/ClearIconButton';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import DownloadButton from 'src/components/button/DownloadButton';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import LoadUserName from 'src/components/user/LoadUserName';
import useClipboard from 'src/hooks/UseClipboard';
import TagContainer from 'src/components/tag/TagContainer';
import IconButton from 'src/components/button/IconButton';
import IfTrueElse from 'src/components/common/IfTrueElse';
import LikeCount from 'src/components/like/LikeCount';
import ColorText from 'src/components/common/ColorText';
import usePopup from 'src/hooks/UsePopup';
import useModel from 'src/hooks/UseModel';
import Dropbox from 'src/components/dropbox/Dropbox';
import usePage from 'src/hooks/UsePage';
import useLike from 'src/hooks/UseLike';
import TagPick from 'src/components/tag/TagPick';
import Button from 'src/components/button/Button';
import IfTrue from 'src/components/common/IfTrue';
import Icon from 'src/components/common/Icon';
import i18n from 'src/util/I18N';
import useDialog from 'src/hooks/UseDialog';

export default function Schematic() {
	const currentSchematic = useRef<SchematicData>();
	const [tag, setTag] = useState<string>('');

	const [sortQuery, setSortQuery] = useState<SortChoice>(SCHEMATIC_SORT_CHOICE[0]);
	const [tagQuery, setTagQuery] = useState<TagChoiceLocal[]>([]);

	const searchConfig = useRef({
		params: {
			tags: Tags.toString(tagQuery), //
			sort: sortQuery.value,
		},
	});

	const { pages, loaderState, loadPage, reloadPage } = usePage<SchematicData>('schematic/page', searchConfig.current);
	const { model, setVisibility } = useModel();
	const { addPopup } = usePopup();

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

	function handleOpenSchematicInfo(schematic: SchematicData) {
		currentSchematic.current = schematic;
		setVisibility(true);
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

	function handleDeleteSchematic(schematic: SchematicData) {
		API.REQUEST.delete(`schematic/${schematic.id}`) //
			.then(() => {
				addPopup(i18n.t('schematic.delete-success'), 5, 'info');
				reloadPage();
				setVisibility(false);
			})
			.catch(() => addPopup(i18n.t('schematic.delete-fail'), 5, 'warning'));
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
			<SchematicContainer
				children={pages.map((schematic) => (
					<SchematicPreview
						key={schematic.id} //
						schematic={schematic}
						handleOpenModel={(schematic) => handleOpenSchematicInfo(schematic)}
					/>
				))}
			/>
			<footer className='flex-center'>
				<IfTrueElse
					condition={loaderState === 'loading'}
					whenTrue={<LoadingSpinner />} //
					whenFalse={buildLoadAndScrollButton()}
				/>
			</footer>
			<IfTrue
				condition={currentSchematic}
				whenTrue={
					currentSchematic.current &&
					model(
						<SchematicInfo
							schematic={currentSchematic.current} //
							handleCloseModel={() => setVisibility(false)}
							handleDeleteSchematic={handleDeleteSchematic}
						/>,
					)
				}
			/>
		</main>
	);
}

interface SchematicPreviewProps {
	schematic: SchematicData;
	handleOpenModel: (schematic: SchematicData) => void;
}

function SchematicPreview(props: SchematicPreviewProps) {
	return (
		<SchematicPreviewCard key={props.schematic.id}>
			<SchematicPreviewImage src={`${API_BASE_URL}schematic/${props.schematic.id}/image`} onClick={() => props.handleOpenModel(props.schematic)} />
			<ColorText className='capitalize small-padding flex-center text-center' text={props.schematic.name} />
			<SchematicPreviewButton schematic={props.schematic} />
		</SchematicPreviewCard>
	);
}
interface SchematicPreviewButtonProps {
	schematic: SchematicData;
}

function SchematicPreviewButton(props: SchematicPreviewButtonProps) {
	const { copy } = useClipboard();

	const likeService = useLike(`${API_BASE_URL}schematic/${props.schematic.id}`, props.schematic.like);
	props.schematic.like = likeService.likes;

	return (
		<section className='grid-row small-gap small-padding'>
			<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount count={likeService.likes} />
			<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<IconButton title='copy' icon='/assets/icons/copy.png' onClick={() => copy(props.schematic.data)} />
			<DownloadButton href={Utils.getDownloadUrl(props.schematic.data)} download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`} />
		</section>
	);
}

interface SchematicInfoProps {
	schematic: SchematicData;
	handleCloseModel: () => void;
	handleDeleteSchematic: (schematic: SchematicData) => void;
}

function SchematicInfo(props: SchematicInfoProps) {
	return (
		<main className='flex-column space-between w100p h100p small-gap massive-padding border-box scroll-y'>
			<section className='flex-row medium-gap flex-wrap'>
				<SchematicInfoImage src={`${API_BASE_URL}schematic/${props.schematic.id}/image`} />
				<section className='flex-column small-gap flex-wrap'>
					<h2 className='capitalize'>{props.schematic.name}</h2>
					<Trans i18nKey='author' /> <LoadUserName userId={props.schematic.authorId} />
					<SchematicDescription description={props.schematic.description} />
					<SchematicRequirement requirement={props.schematic.requirement} />
					<TagContainer tags={Tags.parseArray(props.schematic.tags, Tags.SCHEMATIC_SEARCH_TAG)} />
					<Trans i18nKey='verify-by' /> <LoadUserName userId={props.schematic.verifyAdmin} />
				</section>
			</section>
			<SchematicInfoButton
				schematic={props.schematic}
				handleCloseModel={props.handleCloseModel} //
				handleDeleteSchematic={props.handleDeleteSchematic}
			/>
		</main>
	);
}

interface SchematicInfoButtonProps {
	schematic: SchematicData;
	handleCloseModel: () => void;
	handleDeleteSchematic: (schematic: SchematicData) => void;
}

function SchematicInfoButton(props: SchematicInfoButtonProps) {
	const { user } = useContext(UserContext);
	const { copy } = useClipboard();

	const { dialog, setVisibility } = useDialog();

	const likeService = useLike(`${API_BASE_URL}schematic/${props.schematic.id}`, props.schematic.like);
	props.schematic.like = likeService.likes;

	return (
		<section className='grid-row small-gap'>
			<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount count={likeService.likes} />
			<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<IconButton icon='/assets/icons/copy.png' onClick={() => copy(props.schematic.data)} />
			<DownloadButton href={Utils.getDownloadUrl(props.schematic.data)} download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`} />
			<IfTrue
				condition={Schematics.canDelete(props.schematic, user)} //
				whenTrue={<IconButton icon='/assets/icons/trash-16.png' onClick={() => setVisibility(true)} />}
			/>
			<Button onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
			{dialog(
				<ConfirmDialog
					onClose={() => setVisibility(false)}
					onConfirm={() => props.handleDeleteSchematic(props.schematic)}
					content={
						<>
							<Icon className='h1rem w1rem small-padding' icon='/assets/icons/info.png' />
							<span>
								<Trans i18nKey='message.delete-schematic-dialog' />
							</span>
						</>
					}
				/>,
			)}
		</section>
	);
}
