import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TagChoice, Tags } from 'src/components/Tag';
import { API_BASE_URL, FRONTEND_URL } from 'src/config/Config';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { API } from 'src/API';

import ScrollToTopButton from 'src/components/ScrollToTopButton';
import TagEditContainer from 'src/components/TagEditContainer';
import ClearIconButton from 'src/components/ClearIconButton';
import LoadingSpinner from 'src/components/LoadingSpinner';
import DownloadButton from 'src/components/DownloadButton';
import ConfirmBox from 'src/components/ConfirmBox';
import LoadUserName from 'src/components/LoadUserName';
import useClipboard from 'src/hooks/UseClipboard';
import TagContainer from 'src/components/TagContainer';
import IconButton from 'src/components/IconButton';
import LikeCount from 'src/components/LikeCount';
import ColorText from 'src/components/ColorText';
import { usePopup } from 'src/context/PopupMessageProvider';
import useModel from 'src/hooks/UseModel';
import SearchBox from 'src/components/Searchbox';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useLike from 'src/hooks/UseLike';
import Map from 'src/data/Map';
import TagPick from 'src/components/TagPick';
import Button from 'src/components/Button';
import IfTrue from 'src/components/IfTrue';
import Icon, { AddIcon, BackIcon } from 'src/components/Icon';
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
import { useTags } from 'src/context/TagProvider';
import { getDownloadUrl } from 'src/util/Utils';
import OptionBox from 'src/components/OptionBox';
import ClearButton from 'src/components/ClearButton';
import Author from 'src/components/Author';

export default function MapPage() {
	const [searchParam, setSearchParam] = useSearchParams();

	const sort = Tags.parse(searchParam.get('sort'), Tags.SORT_TAG);
	const urlTags = searchParam.get('tags');
	const { mapSearchTag } = useTags();
	const tags = Tags.parseArray((urlTags ? urlTags : '').split(','), mapSearchTag);

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
		<main id='map' className='flex h-full w-full flex-col gap-2 overflow-y-auto p-2'>
			<header className='flex w-full flex-col gap-2'>
				<section className='m-auto mt-8 flex w-3/4 flex-row flex-wrap items-center justify-start gap-2 md:w-3/5 md:flex-nowrap'>
					<SearchBox
						className='h-10 w-full bg-slate-900'
						placeholder={i18n.t('search-with-tag').toString()}
						value={tag}
						items={mapSearchTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tagQuery.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						mapper={(t, index) => <TagPick key={index} tag={t} />}>
						<ClearIconButton className='h-5' icon='/assets/icons/search.png' title='search' onClick={() => loadNextPage()} />
					</SearchBox>
					<OptionBox
						className='h-10 w-full max-w-[10rem] bg-slate-900'
						items={Tags.SORT_TAG}
						mapper={(item, index) => (
							<span key={index} className='whitespace-nowrap'>
								{item.displayName}
							</span>
						)}
						onChoose={(item) => handleSetSortQuery(item)}
					/>
				</section>
				<TagEditContainer className='m-auto flex w-3/4 items-center justify-center' tags={tagQuery} onRemove={(index) => handleRemoveTag(index)} />
			</header>
			<section className='flex flex-row items-center justify-center p-2'>
				<Trans i18nKey='total-map' /> : {totalMap > 0 ? totalMap : 0}
			</section>
			<PreviewContainer children={pages} />
			<footer className='flex w-full items-center justify-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>
			</footer>
			<section className='fixed bottom-4 right-0 flex flex-col items-center justify-center'>
				<ClearButton title={i18n.t('upload-your-map')} onClick={() => navigate('/upload/map')}>
					<AddIcon className='h-10 w-10' />
				</ClearButton>
				<ScrollToTopButton className='h-10 w-10' containerId='map' />
			</section>
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

export function MapPreview({ map, handleOpenModel }: MapPreviewProps) {
	const { copy } = useClipboard();

	return (
		<PreviewCard className='relative' key={map.id}>
			<ClearIconButton
				className='absolute left-0 top-0 p-2'
				title={i18n.t('copy-link').toString()}
				icon='/assets/icons/copy.png'
				onClick={() => copy(`${FRONTEND_URL}map/${map.id}`)}></ClearIconButton>
			<PreviewImage src={`${API_BASE_URL}map/${map.id}/image`} onClick={() => handleOpenModel(map)} />
			<ColorText className='flex items-center justify-center p-2 text-center capitalize' text={map.name} />
			<MapPreviewButton map={map} />
		</PreviewCard>
	);
}
interface MapPreviewButtonProps {
	map: Map;
}

function MapPreviewButton({ map }: MapPreviewButtonProps) {
	const likeService = useLike('map', map.id, map.like);
	map.like = likeService.likes;

	return (
		<section className='flex flex-row justify-center gap-2 p-2'>
			<IconButton className='h-8 w-full' title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount className='h-8 w-full' count={likeService.likes} />
			<IconButton className='h-8 w-full' title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<DownloadButton className='h-8 w-full' href={getDownloadUrl(map.data)} download={`${('map_' + map.name).trim().replaceAll(' ', '_')}.msav`} />
		</section>
	);
}

interface MapInfoProps {
	map: Map;
	handleCloseModel: () => void;
	handleDeleteMap: (map: Map) => void;
}

export function MapInfo({ map, handleCloseModel, handleDeleteMap }: MapInfoProps) {
	const { copy } = useClipboard();
	const { mapSearchTag } = useTags();

	return (
		<main className='box-border flex h-full w-full flex-col justify-between gap-4 overflow-y-auto p-8'>
			<section className='relative flex flex-row flex-wrap gap-2'>
				<InfoImage src={`${API_BASE_URL}map/${map.id}/image`} />
				<ClearIconButton className='absolute left-0 top-0 p-2' title={i18n.t('copy-link').toString()} icon='/assets/icons/copy.png' onClick={() => copy(`${FRONTEND_URL}map/${map.id}`)} />
				<section className='flex flex-col flex-wrap gap-2'>
					<ColorText className='text-2xl capitalize' text={map.name} />
					<Author authorId={map.authorId} />
					<Description description={map.description} />
					<TagContainer tags={Tags.parseArray(map.tags, mapSearchTag)} />
					<section className='flex flex-row gap-2 whitespace-nowrap'>
						<Trans i18nKey='verify-by' /> <LoadUserName userId={map.verifyAdmin} />
					</section>
				</section>
			</section>
			<MapInfoButton
				map={map}
				handleCloseModel={handleCloseModel} //
				handleDeleteMap={handleDeleteMap}
			/>
			<CommentSection contentType='map' targetId={map.id} />
		</main>
	);
}

interface MapInfoButtonProps {
	map: Map;
	handleCloseModel: () => void;
	handleDeleteMap: (map: Map) => void;
}

function MapInfoButton({ map, handleCloseModel, handleDeleteMap }: MapInfoButtonProps) {
	const { me } = useMe();

	const { dialog, setVisibility } = useDialog();

	const likeService = useLike('map', map.id, map.like);
	map.like = likeService.likes;

	return (
		<section className='flex w-full flex-row justify-between'>
			<section className='flex w-full flex-row gap-2'>
				<IconButton className='h-8 w-8' title='up-vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
				<LikeCount className='h-8 w-8' count={likeService.likes} />
				<IconButton className='h-8 w-8' title='down-vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
				<DownloadButton className='h-8 w-8' href={getDownloadUrl(map.data)} download={`${('map_' + map.name).trim().replaceAll(' ', '_')}.msch`} />
				<IfTrue
					condition={Users.isAuthorOrAdmin(map.id, me)} //
					whenTrue={<IconButton className='h-8 w-8' title={i18n.t('delete')} icon='/assets/icons/trash-16.png' onClick={() => setVisibility(true)} />}
				/>
			</section>
			<Button className='h-8 w-8' title={i18n.t('back')} onClick={() => handleCloseModel()}>
				<BackIcon className='h-6 w-6' />
			</Button>
			{dialog(
				<ConfirmBox onClose={() => setVisibility(false)} onConfirm={() => handleDeleteMap(map)}>
					<Icon className='h-4 w-4 p-2' icon='/assets/icons/info.png' />
					<Trans i18nKey='delete-map-dialog' />
				</ConfirmBox>,
			)}
		</section>
	);
}
