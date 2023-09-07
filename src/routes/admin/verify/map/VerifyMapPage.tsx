import './VerifyMapPage.css';

import React, { useEffect, useState } from 'react';
import { TagChoice, Tags } from 'src/components/Tag';
import { API } from 'src/API';
import { API_BASE_URL } from 'src/config/Config';
import { Trans } from 'react-i18next';
import Map from 'src/data/Map';
import SearchBox from 'src/components/Searchbox';
import LoadingSpinner from 'src/components/LoadingSpinner';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import i18n from 'src/util/I18N';
import TagPick from 'src/components/TagPick';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import ColorText from 'src/components/ColorText';
import DownloadButton from 'src/components/DownloadButton';
import useModel from 'src/hooks/UseModel';
import TagEditContainer from 'src/components/TagEditContainer';
import LoadUserName from 'src/components/LoadUserName';
import IfTrue from 'src/components/IfTrue';
import Button from 'src/components/Button';
import { usePopup } from 'src/context/PopupMessageProvider';
import useDialog from 'src/hooks/UseDialog';
import ConfirmDialog from 'src/components/ConfirmDialog';
import ClearIconButton from 'src/components/ClearIconButton';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import AdminOnly from 'src/components/AdminOnly';
import PreviewContainer from 'src/components/PreviewContainer';
import PreviewCard from 'src/components/PreviewCard';
import PreviewImage from 'src/components/PreviewImage';
import InfoImage from 'src/components/InfoImage';
import Description from 'src/components/Description';
import { useTags } from 'src/context/TagProvider';
import { getDownloadUrl } from 'src/util/Utils';

export default function VerifyMapPage() {
	const [currentMap, setCurrentMap] = useState<Map>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();

	const usePage = useInfinitePage<Map>('map-upload', 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <MapUploadPreview key={v.id} map={v} handleOpenModel={handleOpenMapInfo} />);

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
			.finally(() => usePage.filter((m) => m !== map));
	}

	function verifyMap(map: Map, tags: TagChoice[]) {
		setVisibility(false);
		API.verifyMap(map, tags) //
			.then(() => API.postNotification(map.authorId, 'Your map submission has be accept', 'Post map success'))
			.then(() => addPopup(i18n.t('verify-success'), 5, 'info'))
			.then(() => setTotalMap((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('verify-fail'), 5, 'error'))
			.finally(() => usePage.filter((m) => m !== map));
	}

	return (
		<main id='verify-map' className='flex flex-row h-full w-full'>
			<section className='flex flex-row center medium-padding'>
				<Trans i18nKey='total-map' />:{totalMap > 0 ? totalMap : 0}
			</section>
			<PreviewContainer children={pages} />
			<footer className='flex justify-center items-center'>
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
						<MapUploadInfo
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

interface MapUploadPreviewProps {
	map: Map;
	handleOpenModel: (map: Map) => void;
}

export function MapUploadPreview({ map, handleOpenModel }: MapUploadPreviewProps) {
	return (
		<PreviewCard>
			<PreviewImage src={`${API_BASE_URL}map-upload/${map.id}/image`} onClick={() => handleOpenModel(map)} />
			<ColorText className='capitalize p-2 flex justify-center items-center text-center' text={map.name} />
			<section className='grid grid-auto-column grid-flow-col w-fit gap-2 p-2'>
				<DownloadButton
					href={getDownloadUrl(map.data)} //
					download={`${('map_' + map.name).trim().replaceAll(' ', '_')}.msch`}
				/>
			</section>
		</PreviewCard>
	);
}

interface MapUploadInfoProps {
	map: Map;
	handleVerifyMap: (map: Map, tags: TagChoice[]) => void;
	handleRejectMap: (map: Map, reason: string) => void;
	handleCloseModel: () => void;
}

export function MapUploadInfo({ map, handleCloseModel, handleRejectMap, handleVerifyMap }: MapUploadInfoProps) {
	const [tag, setTag] = useState('');
	const { mapUploadTag } = useTags();

	const [tags, setTags] = useState<TagChoice[]>(Tags.parseArray(map.tags, mapUploadTag));

	const verifyDialog = useDialog();
	const rejectDialog = useDialog();

	function handleAddTag(tag: TagChoice) {
		tags.filter((q) => q !== tag);
		setTags((prev) => [...prev, tag]);
		setTag('');
	}

	function handleRemoveTag(index: number) {
		setTags((prev) => [...prev.filter((_, i) => i !== index)]);
	}

	return (
		<main className='flex flex-row space-between w-full h-full gap-2 p-8 box-border overflow-y-auto'>
			<section className='flex flex-row gap-2 flex-wrap'>
				<InfoImage src={`${API_BASE_URL}map-upload/${map.id}/image`} />
				<section className='flex flex-row gap-2 flex-wrap'>
					<h2 className='capitalize'>{map.name}</h2>
					<Trans i18nKey='author' /> <LoadUserName userId={map.authorId} />
					<Description description={map.description} />
					<TagEditContainer tags={tags} onRemove={(index) => handleRemoveTag(index)} />
				</section>
			</section>
			<section className='flex flex-row gap-2 w-full'>
				<SearchBox
					placeholder={i18n.t('add-tag').toString()}
					value={tag}
					items={mapUploadTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
					onChange={(event) => setTag(event.target.value)}
					onChoose={(item) => handleAddTag(item)}
					mapper={(t, index) => <TagPick key={index} tag={t} />}
				/>
			</section>
			<section className='grid grid-auto-column grid-flow-col w-fit gap-2'>
				<DownloadButton
					href={getDownloadUrl(map.data)} //
					download={`${('map_' + map.name).trim().replaceAll(' ', '_')}.msch`}
				/>
				<Button title={i18n.t('reject')} children={<Trans i18nKey='reject' />} onClick={() => rejectDialog.setVisibility(true)} />
				<AdminOnly children={<Button title={i18n.t('verify')} children={<Trans i18nKey='verify' />} onClick={() => verifyDialog.setVisibility(true)} />} />
				<Button title={i18n.t('back')} onClick={() => handleCloseModel()} children={<Trans i18nKey='back' />} />
			</section>
			{verifyDialog.dialog(
				<ConfirmDialog
					onConfirm={() => handleVerifyMap(map, tags)} //
					onClose={() => verifyDialog.setVisibility(false)}>
					<Trans i18nKey='verify' />
				</ConfirmDialog>,
			)}
			{rejectDialog.dialog(
				<TypeDialog
					onSubmit={(reason) => handleRejectMap(map, reason)} //
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

function TypeDialog({ onClose, onSubmit }: TypeDialogProps) {
	const [content, setContent] = useState('');

	return (
		<section className='flex flex-row'>
			<header className='flex flex-row space-between p-2'>
				<Trans i18nKey='reject-reason' />
				<ClearIconButton title={i18n.t('quit')} icon='/assets/icons/quit.png' onClick={() => onClose()} />
			</header>
			<textarea className='type-dialog' title='reason' onChange={(event) => setContent(event.target.value)} />
			<section className='flex flex-row justify-end w-full p-2 box-border'>
				<Button title={i18n.t('reject')} onClick={() => onSubmit(content)}>
					<Trans i18nKey='reject' />
				</Button>
			</section>
		</section>
	);
}
