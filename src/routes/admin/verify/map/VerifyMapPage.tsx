import 'src/styles.css';
import './VerifyMapPage.css';

import React, { useEffect, useState } from 'react';
import { TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import { API } from 'src/API';
import { API_BASE_URL } from 'src/config/Config';
import { Trans } from 'react-i18next';
import { Utils } from 'src/util/Utils';
import Map from 'src/data/Map';
import Dropbox from 'src/components/dropbox/Dropbox';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import i18n from 'src/util/I18N';
import TagPick from 'src/components/tag/TagPick';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import MapPreviewImage from 'src/components/map/MapPreviewImage';
import ColorText from 'src/components/common/ColorText';
import DownloadButton from 'src/components/button/DownloadButton';
import useModel from 'src/hooks/UseModel';
import MapContainer from 'src/components/map/MapContainer';
import TagEditContainer from 'src/components/tag/TagEditContainer';
import LoadUserName from 'src/components/user/LoadUserName';
import MapDescription from 'src/components/map/MapDescription';
import MapInfoImage from 'src/components/map/MapInfoImage';
import IfTrue from 'src/components/common/IfTrue';
import Button from 'src/components/button/Button';
import MapPreviewCard from 'src/components/map/MapPreviewCard';
import usePopup from 'src/hooks/UsePopup';
import useDialog from 'src/hooks/UseDialog';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import ClearIconButton from 'src/components/button/ClearIconButton';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';

export default function VerifyMapPage() {
	const [currentMap, setCurrentMap] = useState<Map>();

	const { addPopup } = usePopup();

	const { pages, loadNextPage, reloadPage, isLoading,hasMore } = useInfinitePage<Map>('map-upload', 20);
	const { model, setVisibility } = useModel();

	const infPages = useInfiniteScroll(pages,hasMore, (v) => <MapPreview map={v} handleOpenModel={handleOpenMapInfo} />, loadNextPage);

	const [totalMap, setTotalMap] = useState(0);

	useEffect(() => {
		API.getTotalMapUpload()
			.then((result) => setTotalMap(result.data))
			.catch(() => console.log('Error fletching total map'));
	}, []);

	function handleOpenMapInfo(map: Map) {
		setCurrentMap(map);
		setVisibility(true);
	}

	function rejectMap(map: Map, reason: string) {
		setVisibility(false);
		API.rejectMap(map, reason) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info')) //
			.then(() => setTotalMap((prev) => prev - 1)) //
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => reloadPage());
	}

	function verifyMap(map: Map, tags: TagChoiceLocal[]) {
		setVisibility(false);
		API.verifyMap(map, tags) //
			.then(() => API.postNotification(map.authorId, 'Your map submission has be accept', 'Post map success'))
			.then(() => addPopup(i18n.t('verify-success'), 5, 'info'))
			.then(() => setTotalMap((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('verify-fail'), 5, 'error'))
			.finally(() => reloadPage());
	}

	return (
		<main id='verify-map' className='flex-column h100p w100p'>
			<section className='flex-row center medium-padding'>
				<Trans i18nKey='total-map' />:{totalMap > 0 ? totalMap : 0}
			</section>
			<MapContainer children={infPages} />
			<footer className='flex-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>

				<ScrollToTopButton containerId='verify-map' />
			</footer>
			<IfTrue
				condition={currentMap}
				whenTrue={
					currentMap &&
					model(
						<MapInfo
							map={currentMap} //
							handleCloseModel={() => setVisibility(false)}
							handleVerifyMap={verifyMap}
							handleRejectMap={rejectMap}
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

function MapPreview(props: MapPreviewProps) {
	return (
		<MapPreviewCard>
			<MapPreviewImage src={`${API_BASE_URL}map-upload/${props.map.id}/image`} onClick={() => props.handleOpenModel(props.map)} />
			<ColorText className='capitalize small-padding flex-center text-center' text={props.map.name} />
			<section className='grid-row small-gap small-padding'>
				<DownloadButton
					href={Utils.getDownloadUrl(props.map.data)} //
					download={`${('map_' + props.map.name).trim().replaceAll(' ', '_')}.msch`}
				/>
			</section>
		</MapPreviewCard>
	);
}

interface MapInfoProps {
	map: Map;
	handleVerifyMap: (map: Map, tags: TagChoiceLocal[]) => void;
	handleRejectMap: (map: Map, reason: string) => void;
	handleCloseModel: () => void;
}

function MapInfo(props: MapInfoProps) {
	const [tags, setTags] = useState<TagChoiceLocal[]>(Tags.parseArray(props.map.tags, Tags.MAP_UPLOAD_TAG));
	const [tag, setTag] = useState('');

	const verifyDialog = useDialog();
	const rejectDialog = useDialog();

	function handleAddTag(tag: TagChoiceLocal) {
		tags.filter((q) => q !== tag);
		setTags((prev) => [...prev, tag]);
		setTag('');
	}

	function handleRemoveTag(index: number) {
		setTags((prev) => [...prev.filter((_, i) => i !== index)]);
	}

	return (
		<main className='flex-column space-between w100p h100p small-gap massive-padding border-box scroll-y'>
			<section className='flex-row medium-gap flex-wrap'>
				<MapInfoImage src={`${API_BASE_URL}map-upload/${props.map.id}/image`} />
				<section className='flex-column small-gap flex-wrap'>
					<h2 className='capitalize'>{props.map.name}</h2>
					<Trans i18nKey='author' /> <LoadUserName userId={props.map.authorId} />
					<MapDescription description={props.map.description} />
					<TagEditContainer tags={tags} onRemove={(index) => handleRemoveTag(index)} />
				</section>
			</section>
			<section className='flex-column small-gap w100p'>
				<Dropbox
					placeholder={i18n.t('add-tag').toString()}
					value={tag}
					items={Tags.MAP_UPLOAD_TAG.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
					onChange={(event) => setTag(event.target.value)}
					onChoose={(item) => handleAddTag(item)}
					mapper={(t, index) => <TagPick key={index} tag={t} />}
				/>
			</section>
			<section className='grid-row small-gap'>
				<DownloadButton
					href={Utils.getDownloadUrl(props.map.data)} //
					download={`${('map_' + props.map.name).trim().replaceAll(' ', '_')}.msch`}
				/>
				<Button children={<Trans i18nKey='reject' />} onClick={() => rejectDialog.setVisibility(true)} />
				<Button children={<Trans i18nKey='verify' />} onClick={() => verifyDialog.setVisibility(true)} />
				<Button onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
			</section>
			{verifyDialog.dialog(
				<ConfirmDialog
					onConfirm={() => props.handleVerifyMap(props.map, tags)} //
					onClose={() => verifyDialog.setVisibility(false)}>
					<Trans i18nKey='verify' />
				</ConfirmDialog>,
			)}
			{rejectDialog.dialog(
				<TypeDialog
					onSubmit={(reason) => props.handleRejectMap(props.map, reason)} //
					onClose={() => rejectDialog.setVisibility(false)}
				/>,
			)}
		</main>
	);
}

interface TypeDialogProps {
	onSubmit: (content: string) => void;
	onClose: () => void;
}

function TypeDialog(props: TypeDialogProps) {
	const [content, setContent] = useState('');

	return (
		<section className='flex-column'>
			<header className='flex-row space-between small-padding'>
				<Trans i18nKey='reject-reason' />
				<ClearIconButton icon='/assets/icons/quit.png' onClick={() => props.onClose()} />
			</header>
			<textarea className='type-dialog' title='reason' onChange={(event) => setContent(event.target.value)} />
			<section className='flex-row justify-end w100p small-padding border-box'>
				<Button onClick={() => props.onSubmit(content)}>
					<Trans i18nKey='reject' />
				</Button>
			</section>
		</section>
	);
}
