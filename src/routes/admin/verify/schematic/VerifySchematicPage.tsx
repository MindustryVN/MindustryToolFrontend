import './VerifySchematicPage.css';

import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { TagChoice, Tags } from 'src/components/tag/Tag';
import { API } from 'src/API';
import { API_BASE_URL } from 'src/config/Config';
import { Trans } from 'react-i18next';
import { Utils } from 'src/util/Utils';
import { usePopup } from 'src/context/PopupMessageProvider';
import Schematic from 'src/data/Schematic';
import Dropbox from 'src/components/Dropbox';
import LoadingSpinner from 'src/components/LoadingSpinner';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import IconButton from 'src/components/IconButton';
import i18n from 'src/util/I18N';
import TagPick from 'src/components/tag/TagPick';
import useClipboard from 'src/hooks/UseClipboard';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import PreviewImage from 'src/components/PreviewImage';
import ColorText from 'src/components/ColorText';
import DownloadButton from 'src/components/DownloadButton';
import useModel from 'src/hooks/UseModel';
import PreviewContainer from 'src/components/PreviewContainer';
import TagEditContainer from 'src/components/tag/TagEditContainer';
import LoadUserName from 'src/components/LoadUserName';
import SchematicDescription from 'src/components/Description';
import ItemRequirement from 'src/components/ItemRequirement';
import InfoImage from 'src/components/InfoImage';
import IfTrue from 'src/components/IfTrue';
import Button from 'src/components/Button';
import PreviewCard from 'src/components/PreviewCard';
import useDialog from 'src/hooks/UseDialog';
import ConfirmDialog from 'src/components/ConfirmDialog';
import ClearIconButton from 'src/components/ClearIconButton';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import AdminOnly from 'src/components/AdminOnly';

export default function VerifySchematicPage() {
	const [currentSchematic, setCurrentSchematic] = useState<Schematic>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();

	const usePage = useInfinitePage<Schematic>('schematic-upload', 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <SchematicUploadPreview key={v.id} schematic={v} handleOpenModel={handleOpenSchematicInfo} />);

	const [totalSchematic, setTotalSchematic] = useState(0);

	useEffect(() => {
		API.getTotalSchematicUpload()
			.then((result) => setTotalSchematic(result.data))
			.catch(() => console.log('Error fletching total schematic'));
	}, []);

	function handleOpenSchematicInfo(schematic: Schematic) {
		setCurrentSchematic(schematic);
		setVisibility(true);
	}

	function rejectSchematic(schematic: Schematic, reason: string) {
		setVisibility(false);
		API.rejectSchematic(schematic, reason) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info')) //
			.then(() => setTotalSchematic((prev) => prev - 1)) //
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => usePage.filter((sc) => sc !== schematic));
	}

	function verifySchematic(schematic: Schematic, tags: TagChoice[]) {
		setVisibility(false);
		API.verifySchematic(schematic, tags) //
			.then(() => API.postNotification(schematic.authorId, 'Your schematic submission has be accept', 'Post schematic success'))
			.then(() => addPopup(i18n.t('verify-success'), 5, 'info'))
			.then(() => setTotalSchematic((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('verify-fail'), 5, 'error'))
			.finally(() => usePage.filter((sc) => sc !== schematic));
	}

	return (
		<main id='verify-schematic' className='flex flex-row h-full w-full'>
			<section className='flex flex-row center medium-padding'>
				<Trans i18nKey='total-schematic' />:{totalSchematic > 0 ? totalSchematic : 0}
			</section>
			<PreviewContainer children={pages} />
			<footer className='flex justify-center items-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>

				<ScrollToTopButton containerId='verify-schematic' />
			</footer>
			<IfTrue
				condition={currentSchematic}
				whenTrue={
					currentSchematic &&
					model(
						<SchematicUploadInfo
							schematic={currentSchematic} //
							handleCloseModel={() => setVisibility(false)}
							handleVerifySchematic={verifySchematic}
							handleRejectSchematic={rejectSchematic}
						/>,
					)
				}
			/>
		</main>
	);
}

interface SchematicUploadPreviewProps {
	schematic: Schematic;
	handleOpenModel: (schematic: Schematic) => void;
}

export function SchematicUploadPreview(props: SchematicUploadPreviewProps) {
	const { copy } = useClipboard();

	return (
		<PreviewCard>
			<PreviewImage src={`${API_BASE_URL}schematic-upload/${props.schematic.id}/image`} onClick={() => props.handleOpenModel(props.schematic)} />
			<ColorText className='capitalize p-2 flex justify-center items-center text-center' text={props.schematic.name} />
			<section className='grid grid-auto-column grid-flow-col w-fit gap-2 p-2'>
				<IconButton title='copy' icon='/assets/icons/copy.png' onClick={() => copy(Buffer.from(props.schematic.data, 'base64').toString())} />
				<DownloadButton
					href={Utils.getDownloadUrl(props.schematic.data)} //
					download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`}
				/>
			</section>
		</PreviewCard>
	);
}

interface SchematicUploadInfoProps {
	schematic: Schematic;
	handleVerifySchematic: (schematic: Schematic, tags: TagChoice[]) => void;
	handleRejectSchematic: (schematic: Schematic, reason: string) => void;
	handleCloseModel: () => void;
}

export function SchematicUploadInfo(props: SchematicUploadInfoProps) {
	const [tags, setTags] = useState<TagChoice[]>(Tags.parseArray(props.schematic.tags, Tags.SCHEMATIC_UPLOAD_TAG));
	const [tag, setTag] = useState('');

	const verifyDialog = useDialog();
	const rejectDialog = useDialog();

	const { copy } = useClipboard();

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
				<InfoImage src={`${API_BASE_URL}schematic-upload/${props.schematic.id}/image`} />
				<section className='flex flex-row gap-2 flex-wrap'>
					<h2 className='capitalize'>{props.schematic.name}</h2>
					<Trans i18nKey='author' /> <LoadUserName userId={props.schematic.authorId} />
					<SchematicDescription description={props.schematic.description} />
					<ItemRequirement requirement={props.schematic.requirement} />
					<TagEditContainer tags={tags} onRemove={(index) => handleRemoveTag(index)} />
				</section>
			</section>
			<section className='flex flex-row gap-2 w-full'>
				<Dropbox
					placeholder={i18n.t('add-tag').toString()}
					value={tag}
					items={Tags.SCHEMATIC_UPLOAD_TAG.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
					onChange={(event) => setTag(event.target.value)}
					onChoose={(item) => handleAddTag(item)}
					mapper={(t, index) => <TagPick key={index} tag={t} />}
				/>
			</section>
			<section className='grid grid-auto-column grid-flow-col w-fit gap-2'>
				<IconButton title={i18n.t('copy')} icon='/assets/icons/copy.png' onClick={() => copy(Buffer.from(props.schematic.data, 'base64').toString())} />
				<DownloadButton
					href={Utils.getDownloadUrl(props.schematic.data)} //
					download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`}
				/>
				<Button title={i18n.t('reject')} children={<Trans i18nKey='reject' />} onClick={() => rejectDialog.setVisibility(true)} />
				<AdminOnly children={<Button title={i18n.t('verify')} children={<Trans i18nKey='verify' />} onClick={() => verifyDialog.setVisibility(true)} />} />
				<Button title={i18n.t('back')} onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
			</section>
			{verifyDialog.dialog(
				<ConfirmDialog
					onConfirm={() => props.handleVerifySchematic(props.schematic, tags)} //
					onClose={() => verifyDialog.setVisibility(false)}>
					<Trans i18nKey='verify' />
				</ConfirmDialog>,
			)}
			{rejectDialog.dialog(
				<TypeDialog
					onSubmit={(reason) => props.handleRejectSchematic(props.schematic, reason)} //
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
		<section className='flex flex-row'>
			<header className='flex flex-row space-between p-2'>
				<Trans i18nKey='reject-reason' />
				<ClearIconButton title={i18n.t('quit')} icon='/assets/icons/quit.png' onClick={() => props.onClose()} />
			</header>
			<textarea className='type-dialog' title='reason' onChange={(event) => setContent(event.target.value)} />
			<section className='flex flex-row justify-end w-full p-2 box-border'>
				<Button title={i18n.t('reject')} onClick={() => props.onSubmit(content)}>
					<Trans i18nKey='reject' />
				</Button>
			</section>
		</section>
	);
}
