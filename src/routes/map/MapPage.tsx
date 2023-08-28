import 'src/styles.css';
import './MapPage.css';

import React, { useEffect, useRef, useState } from 'react';
import Map from 'src/data/Map';

import { TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import { API_BASE_URL, FRONTEND_URL } from 'src/config/Config';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Utils } from 'src/util/Utils';
import { Trans } from 'react-i18next';
import { API } from 'src/API';

import MapPreviewImage from 'src/components/map/MapPreviewImage';
import MapPreviewCard from 'src/components/map/MapPreviewCard';
import MapDescription from 'src/components/map/MapDescription';
import MapInfoImage from 'src/components/map/MapInfoImage';
import MapContainer from 'src/components/map/MapContainer';
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
import LikeCount from 'src/components/like/LikeCount';
import ColorText from 'src/components/common/ColorText';
import { usePopup } from 'src/context/PopupMessageProvider';
import useModel from 'src/hooks/UseModel';
import Dropbox from 'src/components/dropbox/Dropbox';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useLike from 'src/hooks/UseLike';
import TagPick from 'src/components/tag/TagPick';
import Button from 'src/components/button/Button';
import IfTrue from 'src/components/common/IfTrue';
import Icon from 'src/components/common/Icon';
import i18n from 'src/util/I18N';
import useDialog from 'src/hooks/UseDialog';
import CommentContainer from 'src/components/comment/CommentContainer';
import { useMe } from 'src/context/MeProvider';
import { Users } from 'src/data/User';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';

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

	useEffect(() => {
		API.getTotalMap()
			.then((result) => setTotalMap(result.data))
			.catch(() => console.log('Error fletching total map'));
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
		<main id='map' className='h100p w100p scroll-y flex-column small-gap'>
			<header className='flex-column medium-gap w100p'>
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
				<section className='sort-container grid-row small-gap center'>
					{Tags.SORT_TAG.map((c: TagChoiceLocal) => (
						<Button className='capitalize' key={c.name + c.value} active={c === sortQuery} onClick={() => handleSetSortQuery(c)}>
							{c.displayName}
						</Button>
					))}
				</section>
			</header>
			<section className='flex-row center medium-padding'>
				<Trans i18nKey='total-map' />:{totalMap > 0 ? totalMap : 0}
			</section>
			<section className='flex-row small-padding justify-end'>
				<Button onClick={() => navigate('/upload/map')}>
					<Trans i18nKey='upload-your-map' />
				</Button>
			</section>
			<MapContainer children={pages} />
			<footer className='flex-center'>
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
		<MapPreviewCard className='relative' key={props.map.id}>
			<ClearIconButton
				className='absolute top left small-padding'
				title={i18n.t('copy-link').toString()}
				icon='/assets/icons/copy.png'
				onClick={() => copy(`${FRONTEND_URL}map/${props.map.id}`)}></ClearIconButton>
			<MapPreviewImage src={`${API_BASE_URL}map/${props.map.id}/image`} onClick={() => props.handleOpenModel(props.map)} />
			<ColorText className='capitalize small-padding flex-center text-center' text={props.map.name} />
			<MapPreviewButton map={props.map} />
		</MapPreviewCard>
	);
}
interface MapPreviewButtonProps {
	map: Map;
}

function MapPreviewButton(props: MapPreviewButtonProps) {
	const likeService = useLike('map', props.map.id, props.map.like);
	props.map.like = likeService.likes;

	return (
		<section className='grid-row small-gap small-padding'>
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
		<main className='flex-column space-between w100p h100p small-gap massive-padding border-box scroll-y'>
			<section className='relative flex-row medium-gap flex-wrap'>
				<MapInfoImage src={`${API_BASE_URL}map/${props.map.id}/image`} />
				<ClearIconButton
					className='absolute top left small-padding'
					title={i18n.t('copy-link').toString()}
					icon='/assets/icons/copy.png'
					onClick={() => copy(`${FRONTEND_URL}map/${props.map.id}`)}
				/>
				<section className='flex-column small-gap flex-wrap'>
					<ColorText className='capitalize h2' text={props.map.name} />
					<Trans i18nKey='author' /> <LoadUserName userId={props.map.authorId} />
					<MapDescription description={props.map.description} />
					<TagContainer tags={Tags.parseArray(props.map.tags, Tags.MAP_SEARCH_TAG)} />
					<Trans i18nKey='verify-by' /> <LoadUserName userId={props.map.verifyAdmin} />
				</section>
			</section>
			<MapInfoButton
				map={props.map}
				handleCloseModel={props.handleCloseModel} //
				handleDeleteMap={props.handleDeleteMap}
			/>
			<CommentContainer contentType='map' targetId={props.map.id} />
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
		<section className='grid-row small-gap'>
			<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount count={likeService.likes} />
			<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<DownloadButton href={Utils.getDownloadUrl(props.map.data)} download={`${('map_' + props.map.name).trim().replaceAll(' ', '_')}.msav`} />
			<IfTrue
				condition={Users.isAuthorOrAdmin(props.map.id, me)} //
				whenTrue={<IconButton icon='/assets/icons/trash-16.png' onClick={() => setVisibility(true)} />}
			/>
			<Button onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
			{dialog(
				<ConfirmDialog onClose={() => setVisibility(false)} onConfirm={() => props.handleDeleteMap(props.map)}>
					<Icon className='h1rem w1rem small-padding' icon='/assets/icons/info.png' />
					<Trans i18nKey='delete-map-dialog' />
				</ConfirmDialog>,
			)}
		</section>
	);
}
