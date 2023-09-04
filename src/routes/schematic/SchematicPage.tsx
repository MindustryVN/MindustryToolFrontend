import React, { useCallback, useEffect, useRef, useState } from 'react';
import Schematic from 'src/data/Schematic';

import { TagChoice, Tags } from 'src/components/tag/Tag';
import { API_BASE_URL, FRONTEND_URL } from 'src/config/Config';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Utils } from 'src/util/Utils';
import { Trans } from 'react-i18next';
import { API } from 'src/API';
import { Buffer } from 'buffer';
import { useMe } from 'src/context/MeProvider';

import PreviewImage from 'src/components/PreviewImage';
import PreviewCard from 'src/components/PreviewCard';
import SchematicDescription from 'src/components/Description';
import ItemRequirement from 'src/components/ItemRequirement';
import InfoImage from 'src/components/InfoImage';
import PreviewContainer from 'src/components/PreviewContainer';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import TagEditContainer from 'src/components/tag/TagEditContainer';
import ClearIconButton from 'src/components/ClearIconButton';
import LoadingSpinner from 'src/components/LoadingSpinner';
import DownloadButton from 'src/components/DownloadButton';
import ConfirmDialog from 'src/components/ConfirmDialog';
import LoadUserName from 'src/components/LoadUserName';
import useClipboard from 'src/hooks/UseClipboard';
import TagContainer from 'src/components/tag/TagContainer';
import IconButton from 'src/components/IconButton';
import LikeCount from 'src/components/LikeCount';
import ColorText from 'src/components/ColorText';
import { usePopup } from 'src/context/PopupMessageProvider';
import useModel from 'src/hooks/UseModel';
import Dropbox from 'src/components/Dropbox';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useLike from 'src/hooks/UseLike';
import TagPick from 'src/components/tag/TagPick';
import Button from 'src/components/Button';
import IfTrue from 'src/components/IfTrue';
import Icon from 'src/components/Icon';
import i18n from 'src/util/I18N';
import useDialog from 'src/hooks/UseDialog';
import CommentSection from 'src/components/CommentSection';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
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

	const { model, setVisibility } = useModel();
	const { addPopup } = usePopup();

	const navigate = useNavigate();

	const usePage = useInfinitePage<Schematic>('schematic', 20, searchConfig.current);
	const { pages, isLoading, loadNextPage } = useInfiniteScroll(usePage, (v) => <SchematicPreview key={v.id} schematic={v} handleOpenModel={handleOpenSchematicInfo} />);

	const getTotalSchematic = useCallback(() => {
		API.getTotalSchematic(searchConfig.current)
			.then((result) => setTotalSchematic(result.data))
			.catch(() => console.log('Error fletching total schematic'));
	}, []);

	useEffect(() => {
		getTotalSchematic();
	}, [getTotalSchematic]);

	function setSearchConfig(sort: TagChoice, tags: TagChoice[]) {
		searchConfig.current = {
			params: {
				tags: Tags.toString(tags), //
				sort: sort.toString(),
			},
		};

		getTotalSchematic();

		setSearchParam(searchConfig.current.params);
	}

	function handleSetSortQuery(sort: TagChoice) {
		setSearchConfig(sort, tagQuery);
	}

	function handleRemoveTag(index: number) {
		let t = tags.filter((_, i) => i !== index);
		setSearchConfig(sortQuery, t);
	}

	function handleAddTag(tag: TagChoice) {
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
			.then(() => setTotalSchematic((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('schematic.delete-fail'), 5, 'warning'))
			.finally(() => usePage.filter((sc) => sc !== schematic));
	}

	return (
		<main id='schematic' className='h-full w-full overflow-y-auto flex flex-col gap-2 p-2'>
			<header className='flex flex-col gap-2 w-full'>
				<section className='flex justify-center items-center w-2/3 md:w-2/5 m-auto mt-8'>
					<Dropbox
						placeholder={i18n.t('search-with-tag').toString()}
						value={tag}
						items={Tags.SCHEMATIC_SEARCH_TAG.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tagQuery.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						insideChildren={<ClearIconButton icon='/assets/icons/search.png' title='search' onClick={() => loadNextPage()} />}
						mapper={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<TagEditContainer tags={tagQuery} onRemove={(index) => handleRemoveTag(index)} />
				<section className='grid grid-auto-column grid-flow-col w-fit m-auto gap-2'>
					{Tags.SORT_TAG.map((c: TagChoice) => (
						<Button
							className='capitalize' //
							key={c.name + c.value}
							title={c.name}
							active={c === sortQuery}
							onClick={() => handleSetSortQuery(c)}>
							{c.displayName}
						</Button>
					))}
				</section>
			</header>
			<section className='flex flex-row justify-center items-center p-2'>
				<Trans i18nKey='total-schematic' /> : {totalSchematic > 0 ? totalSchematic : 0}
			</section>
			<section className='flex flex-row p-2 justify-end'>
				<Button title={i18n.t('upload-your-schematic')} onClick={() => navigate('/upload/schematic')}>
					<Trans i18nKey='upload-your-schematic' />
				</Button>
			</section>
			<PreviewContainer children={pages} />
			<footer className='flex w-full justify-center items-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
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
		<PreviewCard className='relative w-full h-full' key={props.schematic.id}>
			<ClearIconButton
				className='absolute top-0 left-0 p-2'
				title={i18n.t('copy-link')}
				icon='/assets/icons/copy.png'
				onClick={() => copy(`${FRONTEND_URL}schematic/${props.schematic.id}`)}></ClearIconButton>
			<PreviewImage src={`${API_BASE_URL}schematic/${props.schematic.id}/image`} onClick={() => props.handleOpenModel(props.schematic)} />
			<ColorText className='capitalize p-4 flex justify-center items-center text-center' text={props.schematic.name} />
			<SchematicPreviewButton schematic={props.schematic} />
		</PreviewCard>
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
		<section className='grid grid-flow-col grid-auto-column gap-2 p-2'>
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
		<main className='flex flex-col space-between w-full h-full gap-4 p-8 box-border overflow-y-auto'>
			<section className='relative flex flex-row flex-wrap gap-2'>
				<InfoImage src={`${API_BASE_URL}schematic/${props.schematic.id}/image`} />
				<ClearIconButton
					className='absolute top-0 left-0 p-2'
					title={i18n.t('copy-link').toString()}
					icon='/assets/icons/copy.png'
					onClick={() => copy(`${FRONTEND_URL}schematic/${props.schematic.id}`)}
				/>
				<section className='flex flex-col gap-2'>
					<ColorText className='capitalize text-2xl' text={props.schematic.name} />
					<section className='flex flex-row whitespace-nowrap gap-2'>
						<Trans i18nKey='author' /> <LoadUserName userId={props.schematic.authorId} />
					</section>
					<SchematicDescription description={props.schematic.description} />
					<ItemRequirement requirement={props.schematic.requirement} />
					<TagContainer tags={Tags.parseArray(props.schematic.tags, Tags.SCHEMATIC_SEARCH_TAG)} />
					<section className='flex flex-row whitespace-nowrap gap-2'>
						<Trans i18nKey='verify-by' /> <LoadUserName userId={props.schematic.verifyAdmin} />
					</section>
				</section>
			</section>
			<SchematicInfoButton
				schematic={props.schematic}
				handleCloseModel={props.handleCloseModel} //
				handleDeleteSchematic={props.handleDeleteSchematic}
			/>
			<CommentSection contentType='schematic' targetId={props.schematic.id} />
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
		<section className='flex flex-row justify-between'>
			<section className='flex flex-row gap-2'>
				<IconButton title='up-vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
				<LikeCount count={likeService.likes} />
				<IconButton title='down-vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
				<IconButton title={i18n.t('copy')} icon='/assets/icons/copy.png' onClick={() => copy(Buffer.from(props.schematic.data, 'base64').toString())} />
				<DownloadButton href={Utils.getDownloadUrl(props.schematic.data)} download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`} />
				<IfTrue
					condition={Users.isAuthorOrAdmin(props.schematic.id, me)} //
					whenTrue={<IconButton title={i18n.t('delete')} icon='/assets/icons/trash-16.png' onClick={() => setVisibility(true)} />}
				/>
			</section>
			<Button title={i18n.t('back')} onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
			{dialog(
				<ConfirmDialog onClose={() => setVisibility(false)} onConfirm={() => props.handleDeleteSchematic(props.schematic)}>
					<Icon className='h-4 w-4 p-2' icon='/assets/icons/info.png' />
					<Trans i18nKey='delete-schematic-dialog' />
				</ConfirmDialog>,
			)}
		</section>
	);
}
