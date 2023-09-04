import './MapPage.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Map from 'src/data/Map';

import { TagChoice, Tags } from 'src/components/tag/Tag';
import { API_BASE_URL, FRONTEND_URL } from 'src/config/Config';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Utils } from 'src/util/Utils';
import { Trans } from 'react-i18next';
import { API } from 'src/API';

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
import { useMe } from 'src/context/MeProvider';
import { Users } from 'src/data/User';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import PreviewContainer from 'src/components/PreviewContainer';
import PreviewCard from 'src/components/PreviewCard';
import PreviewImage from 'src/components/PreviewImage';
import InfoImage from 'src/components/InfoImage';
import Description from 'src/components/Description';

export default function MapPage() {
	const [searchParam, setSearchParam] = useSearchParams();

	const sort = Tags.parse(searchParam.get('sort'), Tags.SORT_TAG);
	const urlTags = searchParam.get('tags');
	const tags = Tags.parseArray((urlTags ? urlTags : '').split(','), Tags.MAP_SEARCH_TAG);

	const currentMap = useRef<Map>();
	const [tag, setTag] = useState<string>('');

	const sortQuery = sort ? sort : Tags.SORT_TAG[0];
	const tagQuery = tags;

	const searchConfig = useRef({
		params: {
			tags: Tags.toString(tagQuery), //
			sort: sortQuery.toString(),
		},
	});

	const [totalMap, setTotalMap] = useState(0);

	const { model, setVisibility } = useModel();
	const { addPopup } = usePopup();

	const usePage = useInfinitePage<Map>('map', 20, searchConfig.current);
	const { pages, loadNextPage, isLoading } = useInfiniteScroll(usePage, (v) => <MapPreview key={v.id} map={v} handleOpenModel={handleOpenMapInfo} />);

	const navigate = useNavigate();

	const getTotalMap = useCallback(() => {
		API.getTotalMap(searchConfig.current)
			.then((result) => setTotalMap(result.data))
			.catch(() => console.log('Error fletching total map'));
	}, []);

	useEffect(() => {
		getTotalMap();
	}, [getTotalMap]);

	function setSearchConfig(sort: TagChoice, tags: TagChoice[]) {
		searchConfig.current = {
			params: {
				tags: Tags.toString(tags), //
				sort: sort.toString(),
			},
		};
		getTotalMap();
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

	function handleOpenMapInfo(map: Map) {
		currentMap.current = map;
		setVisibility(true);
	}

	function handleDeleteMap(map: Map) {
		setVisibility(false);
		API.deleteMap(map.id) //
			.then(() => addPopup(i18n.t('map.delete-success'), 5, 'info')) //
			.then(() => setTotalMap((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('map.delete-fail'), 5, 'warning'))
			.finally(() => usePage.filter((m) => map !== m));
	}

	return (
		<main id='map' className='h-full w-full overflow-y-auto flex flex-row gap-2'>
			<header className='flex flex-row gap-2 w-full'>
				<section className='search-container'>
					<Dropbox
						placeholder={i18n.t('search-with-tag').toString()}
						value={tag}
						items={Tags.MAP_SEARCH_TAG.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tagQuery.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						insideChildren={<ClearIconButton icon='/assets/icons/search.png' title='search' onClick={() => loadNextPage()} />}
						mapper={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<TagEditContainer className='center' tags={tagQuery} onRemove={(index) => handleRemoveTag(index)} />
				<section className='sort-container grid grid-auto-column grid-flow-col w-fit gap-2 center'>
					{Tags.SORT_TAG.map((c: TagChoice) => (
						<Button className='capitalize' title={i18n.t(c.name)} key={c.name + c.value} active={c === sortQuery} onClick={() => handleSetSortQuery(c)}>
							{c.displayName}
						</Button>
					))}
				</section>
			</header>
			<section className='flex flex-row center medium-padding'>
				<Trans i18nKey='total-map' />:{totalMap > 0 ? totalMap : 0}
			</section>
			<section className='flex flex-row p-2 justify-end'>
				<Button title={i18n.t('upload-your-map')} onClick={() => navigate('/upload/map')}>
					<Trans i18nKey='upload-your-map' />
				</Button>
			</section>
			<PreviewContainer children={pages} />
			<footer className='flex justify-center items-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>
				<ScrollToTopButton containerId='map' />
			</footer>
			<IfTrue
				condition={currentMap}
				whenTrue={
					currentMap.current &&
					model(
						<MapInfo
							map={currentMap.current} //
							handleCloseModel={() => setVisibility(false)}
							handleDeleteMap={handleDeleteMap}
						/>,
					)
				}
			/>
		</main>
	);
}

interface MapPreviewProps {
	map: Map;
	handleOpenModel: (map: Map) => void;
}

export function MapPreview(props: MapPreviewProps) {
	const { copy } = useClipboard();

	return (
		<PreviewCard className='relative' key={props.map.id}>
			<ClearIconButton
				className='absolute top-0 left-0 p-2'
				title={i18n.t('copy-link').toString()}
				icon='/assets/icons/copy.png'
				onClick={() => copy(`${FRONTEND_URL}map/${props.map.id}`)}></ClearIconButton>
			<PreviewImage src={`${API_BASE_URL}map/${props.map.id}/image`} onClick={() => props.handleOpenModel(props.map)} />
			<ColorText className='capitalize p-2 flex justify-center items-center text-center' text={props.map.name} />
			<MapPreviewButton map={props.map} />
		</PreviewCard>
	);
}
interface MapPreviewButtonProps {
	map: Map;
}

function MapPreviewButton(props: MapPreviewButtonProps) {
	const likeService = useLike('map', props.map.id, props.map.like);
	props.map.like = likeService.likes;

	return (
		<section className='grid grid-auto-column grid-flow-col w-fit gap-2 p-2'>
			<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount count={likeService.likes} />
			<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<DownloadButton href={Utils.getDownloadUrl(props.map.data)} download={`${('map_' + props.map.name).trim().replaceAll(' ', '_')}.msav`} />
		</section>
	);
}

interface MapInfoProps {
	map: Map;
	handleCloseModel: () => void;
	handleDeleteMap: (map: Map) => void;
}

export function MapInfo(props: MapInfoProps) {
	const { copy } = useClipboard();

	return (
		<main className='flex flex-row space-between w-full h-full gap-2 p-8 box-border overflow-y-auto'>
			<section className='relative flex flex-row gap-2 flex-wrap'>
				<InfoImage src={`${API_BASE_URL}map/${props.map.id}/image`} />
				<ClearIconButton
					className='absolute top-0 left-0 p-2'
					title={i18n.t('copy-link').toString()}
					icon='/assets/icons/copy.png'
					onClick={() => copy(`${FRONTEND_URL}map/${props.map.id}`)}
				/>
				<section className='flex flex-row gap-2 flex-wrap'>
					<ColorText className='capitalize h2' text={props.map.name} />
					<Trans i18nKey='author' /> <LoadUserName userId={props.map.authorId} />
					<Description description={props.map.description} />
					<TagContainer tags={Tags.parseArray(props.map.tags, Tags.MAP_SEARCH_TAG)} />
					<Trans i18nKey='verify-by' /> <LoadUserName userId={props.map.verifyAdmin} />
				</section>
			</section>
			<MapInfoButton
				map={props.map}
				handleCloseModel={props.handleCloseModel} //
				handleDeleteMap={props.handleDeleteMap}
			/>
			<CommentSection contentType='map' targetId={props.map.id} />
		</main>
	);
}

interface MapInfoButtonProps {
	map: Map;
	handleCloseModel: () => void;
	handleDeleteMap: (map: Map) => void;
}

function MapInfoButton(props: MapInfoButtonProps) {
	const { me } = useMe();

	const { dialog, setVisibility } = useDialog();

	const likeService = useLike('map', props.map.id, props.map.like);
	props.map.like = likeService.likes;

	return (
		<section className='grid grid-auto-column grid-flow-col w-fit gap-2'>
			<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount count={likeService.likes} />
			<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<DownloadButton href={Utils.getDownloadUrl(props.map.data)} download={`${('map_' + props.map.name).trim().replaceAll(' ', '_')}.msav`} />
			<IfTrue
				condition={Users.isAuthorOrAdmin(props.map.id, me)} //
				whenTrue={<IconButton title={i18n.t('delete')} icon='/assets/icons/trash-16.png' onClick={() => setVisibility(true)} />}
			/>
			<Button title={i18n.t('back')} onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
			{dialog(
				<ConfirmDialog onClose={() => setVisibility(false)} onConfirm={() => props.handleDeleteMap(props.map)}>
					<Icon className='h-4 w-4 p-2' icon='/assets/icons/info.png' />
					<Trans i18nKey='delete-map-dialog' />
				</ConfirmDialog>,
			)}
		</section>
	);
}
