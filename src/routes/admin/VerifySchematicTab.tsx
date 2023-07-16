import 'src/styles.css';

import React, { useState } from 'react';
import { TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import { API } from 'src/API';
import { API_BASE_URL } from 'src/config/Config';
import SchematicData from 'src/components/schematic/SchematicData';
import Dropbox from 'src/components/dropbox/Dropbox';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import { Utils } from 'src/util/Utils';
import IconButton from 'src/components/button/IconButton';
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
import SchematicPreviewCard from 'src/components/schematic/SchematicPreviewCard';
import usePopup from 'src/hooks/UsePopup';

export default function VerifySchematicTab() {
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const { addPopup } = usePopup();

	const { pages, loadPage, reloadPage, loaderState } = usePage<SchematicData>('schematic-upload/page');
	const { model, setOpenModel } = useModel();

	function handleOpenSchematicInfo(schematic: SchematicData) {
		setCurrentSchematic(schematic);
		setOpenModel(true);
	}

	function rejectSchematic(schematic: SchematicData) {
		setOpenModel(false);
		API.REQUEST.delete(`schematic-upload/${schematic.id}`) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info')) //.
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => reloadPage());
	}

	function verifySchematic(schematic: SchematicData, tags: TagChoiceLocal[]) {
		let form = new FormData();
		const tagString = Tags.toString(tags);

		form.append('id', schematic.id);
		form.append('authorId', schematic.authorId);
		form.append('data', schematic.data);

		form.append('tags', tagString);

		API.REQUEST.post('schematic', form) //
			.then(() => {
				addPopup(i18n.t('verify-success'), 5, 'info');
				reloadPage();
				setOpenModel(false);
			})
			.catch(() => addPopup(i18n.t('verify-fail'), 5, 'error'));
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
				<ScrollToTopButton containerId='verify-schematic' />
			</section>
		);
	}

	return (
		<main id='verify-schematic' className='flex-column h100p w100p scroll-y'>
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
					condition={loaderState === 'loading'}
					whenTrue={<LoadingSpinner />} //
					whenFalse={buildLoadAndScrollButton()}
				/>
			</footer>
			<IfTrue
				condition={currentSchematic}
				whenTrue={
					currentSchematic &&
					model(
						<SchematicInfo
							schematic={currentSchematic} //
							handleCloseModel={() => setOpenModel(false)}
							handleVerifySchematic={verifySchematic}
							handleRejectSchematic={rejectSchematic}
						/>,
					)
				}
			/>
		</main>
	);
}

interface SchematicPreviewProps {
	schematic: SchematicData;
	handleOpenModel: (schematic: SchematicData) => void;
}

function SchematicPreview(props: SchematicPreviewProps) {
	const { copy } = useClipboard();

	return (
		<SchematicPreviewCard>
			<SchematicPreviewImage src={`${API_BASE_URL}schematic-upload/${props.schematic.id}/image`} onClick={() => props.handleOpenModel(props.schematic)} />
			<ColorText className='capitalize small-padding flex-center text-center' text={props.schematic.name} />
			<section className='grid-row small-gap small-padding'>
				<IconButton title='copy' icon='/assets/icons/copy.png' onClick={() => copy(props.schematic.data)} />
				<DownloadButton
					href={Utils.getDownloadUrl(props.schematic.data)} //
					download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`}
				/>
			</section>
		</SchematicPreviewCard>
	);
}

interface SchematicInfoProps {
	schematic: SchematicData;
	handleVerifySchematic: (schematic: SchematicData, tags: TagChoiceLocal[]) => void;
	handleRejectSchematic: (schematic: SchematicData) => void;
	handleCloseModel: () => void;
}

function SchematicInfo(props: SchematicInfoProps) {
	const [tags, setTags] = useState<TagChoiceLocal[]>(Tags.parseArray(props.schematic.tags, Tags.SCHEMATIC_UPLOAD_TAG));
	const [tag, setTag] = useState('');

	const { copy } = useClipboard();

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
				<SchematicInfoImage src={`${API_BASE_URL}schematic/${props.schematic.id}/image`} />
				<section className='flex-column small-gap flex-wrap'>
					<h2 className='capitalize'>{props.schematic.name}</h2>
					<Trans i18nKey='author' /> <LoadUserName userId={props.schematic.authorId} />
					<SchematicDescription description={props.schematic.description} />
					<SchematicRequirement requirement={props.schematic.requirement} />
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
				<IconButton icon='/assets/icons/copy.png' onClick={() => copy(props.schematic.data)} />
				<DownloadButton
					href={Utils.getDownloadUrl(props.schematic.data)} //
					download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`}
				/>
				<Button children={<Trans i18nKey='verify' />} onClick={() => props.handleVerifySchematic(props.schematic, tags)} />
				<Button children={<Trans i18nKey='reject' />} onClick={() => props.handleRejectSchematic(props.schematic)} />
				<Button onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
			</section>
		</main>
	);
}
