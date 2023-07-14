import 'src/styles.css';
import './VerifySchematicTab.css';

import React, { useContext, useState } from 'react';
import { TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import { API } from 'src/API';
import { API_BASE_URL } from 'src/config/Config';
import SchematicData from 'src/components/schematic/SchematicData';
import Dropbox from 'src/components/dropbox/Dropbox';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import { Utils } from 'src/util/Utils';
import SchematicPreview from 'src/components/schematic/SchematicPreview';
import IconButton from 'src/components/button/IconButton';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import i18n from 'src/util/I18N';
import TagPick from 'src/components/tag/TagPick';
import useClipboard from 'src/hooks/UseClipboard';
import usePage from 'src/hooks/UsePage';
import SchematicPreviewImage from 'src/components/schematic/SchematicPreviewImage';
import ColorText from 'src/components/common/ColorText';
import DownloadButton from 'src/components/button/DownloadButton';
import useModel from 'src/hooks/UseModel';
import SchematicContainer from 'src/components/schematic/SchematicContainer';
import TagEditContainer from 'src/components/tag/TagEditContainer';
import LoadUserName from 'src/components/user/LoadUserName';
import { Trans } from 'react-i18next';
import SchematicDescription from 'src/components/schematic/SchematicDescription';
import SchematicRequirement from 'src/components/schematic/SchematicRequirement';
import SchematicInfoImage from 'src/components/schematic/SchematicInfoImage';
import IfTrueElse from 'src/components/common/IfTrueElse';
import IfTrue from 'src/components/common/IfTrue';
import Button from 'src/components/button/Button';

export default function VerifySchematicTab() {
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const { addPopupMessage } = useContext(PopupMessageContext);

	const { copy } = useClipboard();
	const { pages, loadPage, loadToPage, loaderState } = usePage<SchematicData>('schematic-upload/page');
	const { model, setOpenModel } = useModel();

	const [tags, setTags] = useState<TagChoiceLocal[]>([]);
	const [tag, setTag] = useState('');

	function handleAddTag(tag: TagChoiceLocal) {
		tags.filter((q) => q !== tag);
		setTags((prev) => [...prev, tag]);
		setTag('');
	}

	function handleRemoveTag(index: number) {
		setTags((prev) => [...prev.filter((_, i) => i !== index)]);
	}

	function deleteSchematic(schematic: SchematicData) {
		setOpenModel(false);
		API.REQUEST.delete(`schematic-upload/${schematic.id}`) //
			.then(() => addPopupMessage(i18n.t('delete-success'), 5, 'info')) //.
			.catch(() => addPopupMessage(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => loadToPage(pages.length));
	}

	function verifySchematic(schematic: SchematicData) {
		let form = new FormData();
		const tagString = Tags.toString(tags);

		form.append('id', schematic.id);
		form.append('authorId', schematic.authorId);
		form.append('data', schematic.data);

		form.append('tags', tagString);

		API.REQUEST.post('schematic', form) //
			.then(() => addPopupMessage(i18n.t('verify-success'), 5, 'info'))
			.catch(() => addPopupMessage(i18n.t('verify-fail'), 5, 'error'))
			.finally(() => {
				loadToPage(pages.length);
				setOpenModel(false);
			});
	}

	function buildSchematicInfo(schematic: SchematicData) {
		return (
			<main className='flex-column space-between w100p h100p small-gap massive-padding border-box scroll-y'>
				<section className='flex-row medium-gap flex-wrap'>
					<SchematicInfoImage src={`${API_BASE_URL}schematic/${schematic.id}/image`} />
					<section className='flex-column small-gap flex-wrap'>
						<h2 className='capitalize'>{schematic.name}</h2>
						<Trans i18nKey='author' /> <LoadUserName userId={schematic.authorId} />
						<SchematicDescription description={schematic.description} />
						<SchematicRequirement requirement={schematic.requirement} />
						<TagEditContainer tags={tags} onRemove={(index) => handleRemoveTag(index)} />
					</section>
				</section>
				<section className='flex-column small-gap w100p'>
					<Dropbox
						placeholder={i18n.t('add-tag').toString()}
						value={tag}
						items={Tags.SCHEMATIC_UPLOAD_TAG.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						mapper={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<section className='grid-row small-gap'>
					<IconButton icon='/assets/icons/copy.png' onClick={() => copy(schematic.data)} />
					<DownloadButton href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`} />
					<Button children={<Trans i18nKey='verify' />} onClick={() => verifySchematic(schematic)} />
					<Button children={<Trans i18nKey='reject' />} onClick={() => deleteSchematic(schematic)} />
					<Button onClick={() => setOpenModel(false)} children={<Trans i18nKey='back' />} />
				</section>
			</main>
		);
	}

	function handleOpenSchematicInfo(schematic: SchematicData) {
		setCurrentSchematic(schematic);
		setOpenModel(true);
	}

	function buildSchematicPreview(schematic: SchematicData) {
		return (
			<SchematicPreview key={schematic.id}>
				<SchematicPreviewImage src={`${API_BASE_URL}schematic-upload/${schematic.id}/image`} onClick={() => handleOpenSchematicInfo(schematic)} />
				<ColorText className='capitalize small-padding flex-center text-center' text={schematic.name} />
				<section className='grid-row small-gap small-padding'>
					<IconButton title='copy' icon='/assets/icons/copy.png' onClick={() => copy(schematic.data)} />
					<DownloadButton href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`} />
				</section>
			</SchematicPreview>
		);
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

	return (
		<main className='verify-schematic'>
			<SchematicContainer children={pages.map((schematic) => buildSchematicPreview(schematic))} />
			<footer className='flex-center'>
				<IfTrueElse
					condition={loaderState === 'loading'}
					whenTrue={<LoadingSpinner />} //
					whenFalse={buildLoadAndScrollButton()}
				/>
			</footer>
			<IfTrue condition={currentSchematic} whenTrue={currentSchematic && model(buildSchematicInfo(currentSchematic))} />
		</main>
	);
}
