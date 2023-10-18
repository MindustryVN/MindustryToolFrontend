import React, { useState } from 'react';
import { TagChoice, Tags } from 'src/components/Tag';
import { API } from 'src/API';
import { API_BASE_URL } from 'src/config/Config';
import { Trans } from 'react-i18next';
import { usePopup } from 'src/context/PopupMessageProvider';
import Map from 'src/data/Map';
import SearchBox from 'src/components/Searchbox';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import IconButton from 'src/components/IconButton';
import i18n from 'src/util/I18N';
import TagPick from 'src/components/TagPick';
import useClipboard from 'src/hooks/UseClipboard';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import PreviewImage from 'src/components/PreviewImage';
import ColorText from 'src/components/ColorText';
import DownloadButton from 'src/components/DownloadButton';
import useModel from 'src/hooks/UseModel';
import TagEditContainer from 'src/components/TagEditContainer';
import Description from 'src/components/Description';
import InfoImage from 'src/components/InfoImage';
import Button from 'src/components/Button';
import PreviewCard from 'src/components/PreviewCard';
import useDialog from 'src/hooks/UseDialog';
import ConfirmBox from 'src/components/ConfirmBox';
import { useTags } from 'src/context/TagProvider';
import Author from 'src/components/Author';
import { MessageBox } from 'src/components/MessageBox';
import { useVerifyCount } from 'src/routes/admin/AdminPage';
import BackButton from 'src/components/BackButton';
import InfiniteScroll from 'src/components/InfiniteScroll';

export default function VerifyMapPage() {
	const [currentMap, setCurrentMap] = useState<Map>();
	const { setTotalMap } = useVerifyCount();

	const addPopup = usePopup();

	const { model, setVisibility } = useModel();

	const usePage = useInfinitePage<Map>('map-upload', 20);

	function handleOpenMapInfo(map: Map) {
		setCurrentMap(map);
		setVisibility(true);
	}

	function rejectMap(map: Map, reason: string) {
		setVisibility(false);
		API.rejectMap(map, reason) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info')) //
			.then(() => setTotalMap((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => usePage.filter((sc) => sc !== map));
	}

	function verifyMap(map: Map, tags: TagChoice[]) {
		setVisibility(false);
		API.verifyMap(map, tags) //
			.then(() => API.postNotification(map.authorId, 'Your map submission has been accept', 'Post map success'))
			.then(() => addPopup(i18n.t('verify-success'), 5, 'info'))
			.then(() => setTotalMap((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('verify-fail'), 5, 'error'))
			.finally(() => usePage.filter((sc) => sc !== map));
	}

	return (
		<main id='verify-map' className='flex h-full w-full flex-col gap-2 overflow-y-auto'>
			<InfiniteScroll className='preview-container' infinitePage={usePage} mapper={(v) => <MapUploadPreview key={v.id} map={v} handleOpenModel={handleOpenMapInfo} />} />
			<footer className='flex items-center justify-center'>
				<ScrollToTopButton containerId='verify-map' />
			</footer>
			{currentMap &&
				model(
					<MapUploadInfo
						map={currentMap} //
						handleCloseModel={() => setVisibility(false)}
						handleVerifyMap={verifyMap}
						handleRejectMap={rejectMap}
					/>,
				)}
		</main>
	);
}

interface MapUploadPreviewProps {
	map: Map;
	handleOpenModel: (map: Map) => void;
}

export function MapUploadPreview({ map, handleOpenModel }: MapUploadPreviewProps) {
	const copy = useClipboard();

	return (
		<PreviewCard>
			<PreviewImage src={`${API_BASE_URL}map-upload/${map.id}/image`} onClick={() => handleOpenModel(map)} />
			<ColorText className='flex items-center justify-center p-2 text-center capitalize' text={map.name} />
			<section className='flex flex-row gap-2 p-2'>
				<IconButton
					className='h-8 w-full'
					title='copy'
					icon='/assets/icons/copy.png'
					onClick={() => API.get(`map-upload/${map.id}/data`).then((result) => copy(result.data))}
				/>
				<DownloadButton
					className='h-8 w-full'
					href={`map-upload/${map.id}/download`} //
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

export function MapUploadInfo({ map, handleRejectMap, handleCloseModel, handleVerifyMap }: MapUploadInfoProps) {
	const { mapUploadTag } = useTags();
	const [tags, setTags] = useState<TagChoice[]>(Tags.parseArray(map.tags, mapUploadTag));
	const [tag, setTag] = useState('');

	const verifyDialog = useDialog();
	const rejectDialog = useDialog();

	const copy = useClipboard();

	function handleAddTag(tag: TagChoice) {
		tags.filter((q) => q !== tag);
		setTags((prev) => [...prev, tag]);
		setTag('');
	}

	function handleRemoveTag(index: number) {
		setTags((prev) => [...prev.filter((_, i) => i !== index)]);
	}

	return (
		<main className='box-border flex h-full w-full flex-col justify-between gap-2 overflow-y-auto p-8'>
			<section className='flex flex-row flex-wrap gap-2'>
				<InfoImage src={`${API_BASE_URL}map-upload/${map.id}/image`} />
				<section className='flex flex-col flex-wrap gap-2'>
					<ColorText className='text-2xl capitalize' text={map.name} />
					<Author authorId={map.authorId} />
					<Description description={map.description} />
					<TagEditContainer tags={tags} onRemove={(index) => handleRemoveTag(index)} />
				</section>
			</section>
			<section className='grid gap-2'>
				<section className='flex w-full flex-row gap-2'>
					<SearchBox
						className='h-10 w-full'
						placeholder={i18n.t('add-tag').toString()}
						value={tag}
						items={mapUploadTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						mapper={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<section className='flex flex-row justify-between'>
					<section className='flex flex-row gap-2'>
						<IconButton
							className='h-8 w-8'
							title={i18n.t('copy')}
							icon='/assets/icons/copy.png'
							onClick={() => API.get(`map-upload/${map.id}/data`).then((result) => copy(result.data))}
						/>
						<DownloadButton
							className='h-8 w-8'
							href={`map-upload/${map.id}/download`} //
							download={`${('map_' + map.name).trim().replaceAll(' ', '_')}.msch`}
						/>
						<Button className='h-8 p-1' title={i18n.t('reject')} children={<Trans i18nKey='reject' />} onClick={() => rejectDialog.setVisibility(true)} />
						<Button className='h-8 p-1' title={i18n.t('verify')} children={<Trans i18nKey='verify' />} onClick={() => verifyDialog.setVisibility(true)} />
					</section>
					<BackButton onClick={handleCloseModel} />
				</section>
			</section>
			{verifyDialog.dialog(
				<ConfirmBox
					onConfirm={() => handleVerifyMap(map, tags)} //
					onClose={() => verifyDialog.setVisibility(false)}>
					<Trans i18nKey='verify' />
				</ConfirmBox>,
			)}
			{rejectDialog.dialog(
				<MessageBox
					onSubmit={(reason) => handleRejectMap(map, reason)} //
					onClose={() => rejectDialog.setVisibility(false)}>
					<Trans i18nKey='reject-reason' />
				</MessageBox>,
			)}
		</main>
	);
}
