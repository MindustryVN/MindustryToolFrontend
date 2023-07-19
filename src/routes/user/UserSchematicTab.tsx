import 'src/styles.css';

import { API } from 'src/API';
import { UserContext } from 'src/context/UserProvider';
import { Tags } from 'src/components/tag/Tag';
import { Trans } from 'react-i18next';
import { API_BASE_URL } from 'src/config/Config';
import { Utils } from 'src/util/Utils';
import Schematic, { Schematics } from 'src/data/Schematic';
import React, { useContext, useRef } from 'react';

import i18n from 'src/util/I18N';
import Icon from 'src/components/common/Icon';
import IfTrue from 'src/components/common/IfTrue';
import Button from 'src/components/button/Button';
import usePage from 'src/hooks/UsePage';
import useLike from 'src/hooks/UseLike';
import useModel from 'src/hooks/UseModel';
import User from 'src/data/User';
import usePopup from 'src/hooks/UsePopup';
import LikeCount from 'src/components/like/LikeCount';
import ColorText from 'src/components/common/ColorText';
import IconButton from 'src/components/button/IconButton';
import IfTrueElse from 'src/components/common/IfTrueElse';
import LoadUserName from 'src/components/user/LoadUserName';
import useClipboard from 'src/hooks/UseClipboard';
import TagContainer from 'src/components/tag/TagContainer';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import DownloadButton from 'src/components/button/DownloadButton';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import SchematicInfoImage from 'src/components/schematic/SchematicInfoImage';
import SchematicContainer from 'src/components/schematic/SchematicContainer';
import SchematicDescription from 'src/components/schematic/SchematicDescription';
import SchematicRequirement from 'src/components/schematic/SchematicRequirement';
import SchematicPreviewCard from 'src/components/schematic/SchematicPreviewCard';
import SchematicPreviewImage from 'src/components/schematic/SchematicPreviewImage';
import useDialog from 'src/hooks/UseDialog';

interface UserSchematicTabProps {
	user: User;
}

export default function UserSchematicTab(props: UserSchematicTabProps) {
	const currentSchematic = useRef<Schematic>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const { pages, loaderState, loadPage, reloadPage } = usePage<Schematic>(`schematic/user/${props.user.id}/page`);

	function handleDeleteSchematic(schematic: Schematic) {
		API.REQUEST.delete(`schematic/${schematic.id}`) //
			.then(() => {
				addPopup(i18n.t('schematic.delete-success'), 5, 'info');
				reloadPage();
				setVisibility(false);
			})
			.catch(() => addPopup(i18n.t('schematic.delete-fail'), 5, 'warning'));
	}

	function handleOpenSchematicInfo(schematic: Schematic) {
		currentSchematic.current = schematic;
		setVisibility(true);
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
							handleCloseModel={() => setVisibility(false)}
							handleDeleteSchematic={handleDeleteSchematic}
						/>,
					)
				}
			/>
		</main>
	);
}
interface SchematicPreviewProps {
	schematic: Schematic;
	handleOpenModel: (schematic: Schematic) => void;
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
	schematic: Schematic;
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
	schematic: Schematic;
	handleCloseModel: () => void;
	handleDeleteSchematic: (schematic: Schematic) => void;
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
	schematic: Schematic;
	handleCloseModel: () => void;
	handleDeleteSchematic: (schematic: Schematic) => void;
}

function SchematicInfoButton(props: SchematicInfoButtonProps) {
	const { user } = useContext(UserContext);
	const { copy } = useClipboard();

	const { dialog, setVisibility } = useDialog();

	const likeService = useLike(`${API_BASE_URL}schematic/${props.schematic.id}`, props.schematic.like);
	props.schematic.like = likeService.likes;

	return (
		<section className='grid-row small-gap'>
			<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount count={likeService.likes} />
			<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<IconButton icon='/assets/icons/copy.png' onClick={() => copy(props.schematic.data)} />
			<DownloadButton href={Utils.getDownloadUrl(props.schematic.data)} download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`} />
			<IfTrue
				condition={Schematics.canDelete(props.schematic, user)} //
				whenTrue={<IconButton icon='/assets/icons/trash-16.png' onClick={() => setVisibility(true)} />}
			/>
			<Button onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
			{dialog(
				<ConfirmDialog onClose={() => setVisibility(false)} onConfirm={() => props.handleDeleteSchematic(props.schematic)}>
					<Icon className='h1rem w1rem small-padding' icon='/assets/icons/info.png' />
					<span>
						<Trans i18nKey='message.delete-schematic-dialog' />
					</span>
				</ConfirmDialog>,
			)}
		</section>
	);
}
