import 'src/styles.css';
import './SchematicPage.css';

import React, { useEffect, useRef, useState } from 'react';
import Schematic from 'src/data/Schematic';

import { TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import { API_BASE_URL, FRONTEND_URL } from 'src/config/Config';
import { useSearchParams } from 'react-router-dom';
import { Utils } from 'src/util/Utils';
import { Trans } from 'react-i18next';
import { API } from 'src/API';
import { Buffer } from 'buffer';

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
import CommentContainer from 'src/components/comment/CommentContainer';
import useMe from 'src/hooks/UseMe';
import { Users } from 'src/data/User';

export default function SchematicPage() {
	const [searchParam, setSearchParam] = useSearchParams();

	const sort = Tags.parse(searchParam.get('sort'), Tags.SORT_TAG);
	const urlTags = searchParam.get('tags');
	const tags = Tags.parseArray((urlTags ? urlTags : '').split(','), Tags.SCHEMATIC_SEARCH_TAG);

	const currentSchematic = useRef<Schematic>();
	const [tag, setTag] = useState<string>('');

	const sortQuery = sort ? sort : Tags.SORT_TAG[0];
	const tagQuery = tags;

	const searchConfig = useRef({
		params: {
			tags: Tags.toString(tagQuery), //
			sort: sortQuery.toString(),
		},
	});

	const [totalSchematic, setTotalSchematic] = useState(0);

	const { pages, isLoading, hasMore, loadPage, reloadPage } = usePage<Schematic>('schematic', 20, searchConfig.current);
	const { model, setVisibility } = useModel();
	const { addPopup } = usePopup();

	useEffect(() => {
		API.getTotalSchematic()
			.then((result) => setTotalSchematic(result.data))
			.catch(() => console.log('Error fletching total schematic'));
	}, []);

	function setSearchConfig(sort: TagChoiceLocal, tags: TagChoiceLocal[]) {
		searchConfig.current = {
			params: {
				tags: Tags.toString(tags), //
				sort: sort.toString(),
			},
		};

		setSearchParam(searchConfig.current.params);
	}

	function handleSetSortQuery(sort: TagChoiceLocal) {
		setSearchConfig(sort, tagQuery);
	}

	function handleRemoveTag(index: number) {
		let t = tags.filter((_, i) => i !== index);
		setSearchConfig(sortQuery, t);
	}

	function handleAddTag(tag: TagChoiceLocal) {
		let t = tags.filter((q) => q !== tag);
		t.push(tag);
		setSearchConfig(sortQuery, t);
		setTag('');
	}

	function handleOpenSchematicInfo(schematic: Schematic) {
		currentSchematic.current = schematic;
		setVisibility(true);
	}

	function handleDeleteSchematic(schematic: Schematic) {
		setVisibility(false);
		API.deleteSchematic(schematic.id) //
			.then(() => addPopup(i18n.t('schematic.delete-success'), 5, 'info')) //
			.then(() => reloadPage())
			.then(() => setTotalSchematic((prev) => prev - 1))
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
					{Tags.SORT_TAG.map((c: TagChoiceLocal) => (
						<Button className='capitalize' key={c.name + c.value} active={c === sortQuery} onClick={() => handleSetSortQuery(c)}>
							{c.displayName}
						</Button>
					))}
				</section>
			</header>
			<section className='flex-row center medium-padding'>
				<Trans i18nKey='total-schematic' />:{totalSchematic > 0 ? totalSchematic : 0}
			</section>
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
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
					whenFalse={
						<Button onClick={() => loadPage()}>
							<IfTrueElse
								condition={hasMore} //
								whenTrue={<Trans i18nKey='load-more' />}
								whenFalse={<Trans i18nKey='no-more' />}
							/>
						</Button>
					}
				/>
				<ScrollToTopButton containerId='schematic' />
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
	schematic: Schematic;
	handleOpenModel: (schematic: Schematic) => void;
}

export function SchematicPreview(props: SchematicPreviewProps) {
	const { copy } = useClipboard();

	return (
		<SchematicPreviewCard className='relative' key={props.schematic.id}>
			<ClearIconButton
				className='absolute top left small-padding'
				title={i18n.t('copy-link').toString()}
				icon='/assets/icons/copy.png'
				onClick={() => copy(`${FRONTEND_URL}schematic/${props.schematic.id}`)}></ClearIconButton>
			<SchematicPreviewImage src={`${API_BASE_URL}schematic/${props.schematic.id}/image`} onClick={() => props.handleOpenModel(props.schematic)} />
			<ColorText className='capitalize small-padding flex-center text-center' text={props.schematic.name} />
			<SchematicPreviewButton schematic={props.schematic} />
		</SchematicPreviewCard>
	);
}
interface SchematicPreviewButtonProps {
	schematic: Schematic;
}

function SchematicPreviewButton(props: SchematicPreviewButtonProps) {
	const { copy } = useClipboard();

	const likeService = useLike('schematic', props.schematic.id, props.schematic.like);
	props.schematic.like = likeService.likes;

	return (
		<section className='grid-row small-gap small-padding'>
			<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount count={likeService.likes} />
			<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<IconButton title='copy' icon='/assets/icons/copy.png' onClick={() => copy(Buffer.from(props.schematic.data, 'base64').toString())} />
			<DownloadButton href={Utils.getDownloadUrl(props.schematic.data)} download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`} />
		</section>
	);
}

interface SchematicInfoProps {
	schematic: Schematic;
	handleCloseModel: () => void;
	handleDeleteSchematic: (schematic: Schematic) => void;
}

export function SchematicInfo(props: SchematicInfoProps) {
	const { copy } = useClipboard();

	return (
		<main className='flex-column space-between w100p h100p small-gap massive-padding border-box scroll-y'>
			<section className='relative flex-row medium-gap flex-wrap'>
				<SchematicInfoImage src={`${API_BASE_URL}schematic/${props.schematic.id}/image`} />
				<ClearIconButton
					className='absolute top left small-padding'
					title={i18n.t('copy-link').toString()}
					icon='/assets/icons/copy.png'
					onClick={() => copy(`${FRONTEND_URL}schematic/${props.schematic.id}`)}
				/>
				<section className='flex-column small-gap flex-wrap'>
					<ColorText className='capitalize h2' text={props.schematic.name} />
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
			<CommentContainer contentType='schematic' targetId={props.schematic.id} />
		</main>
	);
}

interface SchematicInfoButtonProps {
	schematic: Schematic;
	handleCloseModel: () => void;
	handleDeleteSchematic: (schematic: Schematic) => void;
}

function SchematicInfoButton(props: SchematicInfoButtonProps) {
	const { me } = useMe();
	const { copy } = useClipboard();

	const { dialog, setVisibility } = useDialog();

	const likeService = useLike('schematic', props.schematic.id, props.schematic.like);
	props.schematic.like = likeService.likes;

	return (
		<section className='grid-row small-gap'>
			<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount count={likeService.likes} />
			<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<IconButton icon='/assets/icons/copy.png' onClick={() => copy(Buffer.from(props.schematic.data, 'base64').toString())} />
			<DownloadButton href={Utils.getDownloadUrl(props.schematic.data)} download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`} />
			<IfTrue
				condition={Users.isAuthorOrAdmin(props.schematic.id, me)} //
				whenTrue={<IconButton icon='/assets/icons/trash-16.png' onClick={() => setVisibility(true)} />}
			/>
			<Button onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
			{dialog(
				<ConfirmDialog onClose={() => setVisibility(false)} onConfirm={() => props.handleDeleteSchematic(props.schematic)}>
					<Icon className='h1rem w1rem small-padding' icon='/assets/icons/info.png' />
					<Trans i18nKey='delete-schematic-dialog' />
				</ConfirmDialog>,
			)}
		</section>
	);
}
