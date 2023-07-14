import 'src/styles.css';

import React, { useState, useContext } from 'react';
import IconButton from 'src/components/button/IconButton';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import SchematicData, { Schematics } from 'src/components/schematic/SchematicData';
import SchematicPreview from 'src/components/schematic/SchematicPreview';
import LoadUserName from 'src/components/user/LoadUserName';
import UserData from 'src/components/user/UserData';
import { API_BASE_URL } from 'src/config/Config';
import i18n from 'src/util/I18N';
import { Utils } from 'src/util/Utils';
import useClipboard from 'src/hooks/UseClipboard';
import usePage from 'src/hooks/UsePage';
import useModel from 'src/hooks/UseModel';
import SchematicContainer from 'src/components/schematic/SchematicContainer';
import DownloadButton from 'src/components/button/DownloadButton';
import ColorText from 'src/components/common/ColorText';
import SchematicPreviewImage from 'src/components/schematic/SchematicPreviewImage';
import { API } from 'src/API';
import SchematicInfoImage from 'src/components/schematic/SchematicInfoImage';
import { Trans } from 'react-i18next';
import SchematicDescription from 'src/components/schematic/SchematicDescription';
import TagContainer from 'src/components/tag/TagContainer';
import SchematicRequirement from 'src/components/schematic/SchematicRequirement';
import IfTrue from 'src/components/common/IfTrue';
import Button from 'src/components/button/Button';
import { UserContext } from 'src/components/provider/UserProvider';
import IfTrueElse from 'src/components/common/IfTrueElse';
import { Tags } from 'src/components/tag/Tag';

interface UserSchematicTabProps {
	user: UserData;
}

export default function UserSchematicTab(props: UserSchematicTabProps) {
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const { user } = useContext(UserContext);
	const { addPopupMessage } = useContext(PopupMessageContext);

	const { copy } = useClipboard();
	const { model, setOpenModel } = useModel();
	const { pages, loadPage, loaderState } = usePage<SchematicData>(`schematic/user/${props.user.id}/page`);

	function handleDeleteSchematic(schematic: SchematicData) {
		API.REQUEST.delete(`schematic/${schematic.id}`) //
			.then(() => addPopupMessage(i18n.t('schematic.delete-success'), 5, 'info'))
			.catch(() => addPopupMessage(i18n.t('schematic.delete-fail'), 5, 'warning'));
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
						<TagContainer tags={Tags.parseArray(schematic.tags, Tags.SCHEMATIC_SEARCH_TAG)} />
						<Trans i18nKey='verify-by' /> <LoadUserName userId={schematic.verifyAdmin} />
					</section>
				</section>
				<section className='grid-row small-gap'>
					<IconButton icon='/assets/icons/up-vote.png' onClick={() => {}} />
					<IconButton icon='/assets/icons/down-vote.png' onClick={() => {}} />
					<IconButton icon='/assets/icons/copy.png' onClick={() => copy(schematic.data)} />
					<DownloadButton href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`} />
					<IfTrue condition={Schematics.canDelete(schematic, user)} whenTrue={<IconButton icon='/assets/icons/trash-16.png' onClick={() => handleDeleteSchematic(schematic)} />} />
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
				<SchematicPreviewImage src={`${API_BASE_URL}schematic/${schematic.id}/image`} onClick={() => handleOpenSchematicInfo(schematic)} />
				<ColorText className='capitalize small-padding flex-center text-center' text={schematic.name} />
				<section className='grid-row small-gap small-padding'>
					<IconButton title='up vote' icon='/assets/icons/up-vote.png' onClick={() => addPopupMessage(i18n.t('schematic.liked'), 5, 'info')} />
					<IconButton title='down vote' icon='/assets/icons/down-vote.png' onClick={() => addPopupMessage(i18n.t('schematic.disliked'), 5, 'info')} />
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
				<ScrollToTopButton containerId='schematic-tab' />
			</section>
		);
	}

	return (
		<main id='schematic-tab' className='flex-column small-gap w100p h100p scroll-y'>
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
