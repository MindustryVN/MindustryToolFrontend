import 'src/styles.css';

import React, { useContext, useRef } from 'react';
import IconButton from 'src/components/button/IconButton';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import SchematicData, { Schematics } from 'src/components/schematic/SchematicData';
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
import SchematicPreviewCard from 'src/components/schematic/SchematicPreviewCard';
import useLike from 'src/hooks/UseLike';
import LikeCount from 'src/components/like/LikeCount';

interface UserSchematicTabProps {
	user: UserData;
}

export default function UserSchematicTab(props: UserSchematicTabProps) {
	const currentSchematic = useRef<SchematicData>();

	const { addPopupMessage } = useContext(PopupMessageContext);

	const { model, setOpenModel } = useModel();
	const { pages, loaderState, loadPage, reloadPage } = usePage<SchematicData>(`schematic/user/${props.user.id}/page`);

	function handleDeleteSchematic(schematic: SchematicData) {
		API.REQUEST.delete(`schematic/${schematic.id}`) //
			.then(() => {
				addPopupMessage(i18n.t('schematic.delete-success'), 5, 'info');
				reloadPage();
				setOpenModel(false);
			})
			.catch(() => addPopupMessage(i18n.t('schematic.delete-fail'), 5, 'warning'));
	}

	function handleOpenSchematicInfo(schematic: SchematicData) {
		currentSchematic.current = schematic;
		setOpenModel(true);
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
			<SchematicContainer
				children={pages.map((schematic) => (
					<SchematicPreview
						key={schematic.id}
						schematic={schematic} //
						handleOpenModel={handleOpenSchematicInfo}
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
					currentSchematic.current &&
					model(
						<SchematicInfo
							schematic={currentSchematic.current} //
							handleCloseModel={() => setOpenModel(false)}
							handleDeleteSchematic={handleDeleteSchematic}
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
	return (
		<SchematicPreviewCard key={props.schematic.id}>
			<SchematicPreviewImage src={`${API_BASE_URL}schematic/${props.schematic.id}/image`} onClick={() => props.handleOpenModel(props.schematic)} />
			<ColorText className='capitalize small-padding flex-center text-center' text={props.schematic.name} />
			<SchematicPreviewButton schematic={props.schematic} />
		</SchematicPreviewCard>
	);
}
interface SchematicPreviewButtonProps {
	schematic: SchematicData;
}

function SchematicPreviewButton(props: SchematicPreviewButtonProps) {
	const { copy } = useClipboard();

	const likeService = useLike(`${API_BASE_URL}schematic/${props.schematic.id}`, props.schematic.like);
	props.schematic.like = likeService.likes;

	return (
		<section className='grid-row small-gap small-padding'>
			<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount count={likeService.likes} />
			<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<IconButton title='copy' icon='/assets/icons/copy.png' onClick={() => copy(props.schematic.data)} />
			<DownloadButton href={Utils.getDownloadUrl(props.schematic.data)} download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`} />
		</section>
	);
}

interface SchematicInfoProps {
	schematic: SchematicData;
	handleCloseModel: () => void;
	handleDeleteSchematic: (schematic: SchematicData) => void;
}

function SchematicInfo(props: SchematicInfoProps) {
	return (
		<main className='flex-column space-between w100p h100p small-gap massive-padding border-box scroll-y'>
			<section className='flex-row medium-gap flex-wrap'>
				<SchematicInfoImage src={`${API_BASE_URL}schematic/${props.schematic.id}/image`} />
				<section className='flex-column small-gap flex-wrap'>
					<h2 className='capitalize'>{props.schematic.name}</h2>
					<Trans i18nKey='author' /> <LoadUserName userId={props.schematic.authorId} />
					<SchematicDescription description={props.schematic.description} />
					<SchematicRequirement requirement={props.schematic.requirement} />
					<TagContainer tags={Tags.parseArray(props.schematic.tags, Tags.SCHEMATIC_SEARCH_TAG)} />
					<Trans i18nKey='verify-by' /> <LoadUserName userId={props.schematic.verifyAdmin} />
				</section>
			</section>
			<SchematicInfoButton
				schematic={props.schematic}
				handleCloseModel={props.handleCloseModel} //
				handleDeleteSchematic={props.handleDeleteSchematic}
			/>
		</main>
	);
}

interface SchematicInfoButtonProps {
	schematic: SchematicData;
	handleCloseModel: () => void;
	handleDeleteSchematic: (schematic: SchematicData) => void;
}

function SchematicInfoButton(props: SchematicInfoButtonProps) {
	const { user } = useContext(UserContext);
	const { copy } = useClipboard();

	const likeService = useLike(`${API_BASE_URL}schematic/${props.schematic.id}`, props.schematic.like);
	props.schematic.like = likeService.likes;

	console.log(props.schematic);

	function like() {
		likeService.like();
	}

	function dislike() {
		likeService.dislike();
	}

	return (
		<section className='grid-row small-gap'>
			<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => like()} />
			<LikeCount count={likeService.likes} />
			<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => dislike()} />
			<IconButton icon='/assets/icons/copy.png' onClick={() => copy(props.schematic.data)} />
			<DownloadButton href={Utils.getDownloadUrl(props.schematic.data)} download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`} />
			<IfTrue condition={Schematics.canDelete(props.schematic, user)} whenTrue={<IconButton icon='/assets/icons/trash-16.png' onClick={() => props.handleDeleteSchematic(props.schematic)} />} />
			<Button onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
		</section>
	);
}
