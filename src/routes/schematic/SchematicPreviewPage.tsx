import 'src/styles.css';

import { Trans } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { API } from 'src/API';
import { Tags } from 'src/components/tag/Tag';
import { API_BASE_URL } from 'src/config/Config';

import React from 'react';
import DownloadButton from 'src/components/button/DownloadButton';
import IconButton from 'src/components/button/IconButton';
import CommentContainer from 'src/components/comment/CommentContainer';
import ColorText from 'src/components/common/ColorText';
import Icon from 'src/components/common/Icon';
import IfTrue from 'src/components/common/IfTrue';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import LikeCount from 'src/components/like/LikeCount';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import SchematicDescription from 'src/components/schematic/SchematicDescription';
import SchematicInfoImage from 'src/components/schematic/SchematicInfoImage';
import SchematicRequirement from 'src/components/schematic/SchematicRequirement';
import TagContainer from 'src/components/tag/TagContainer';
import LoadUserName from 'src/components/user/LoadUserName';
import Schematic, { Schematics } from 'src/data/Schematic';
import useClipboard from 'src/hooks/UseClipboard';
import useDialog from 'src/hooks/UseDialog';
import useLike from 'src/hooks/UseLike';
import usePopup from 'src/hooks/UsePopup';
import useQuery from 'src/hooks/UseQuery';
import useUser from 'src/hooks/UseUser';
import i18n from 'src/util/I18N';
import { Utils } from 'src/util/Utils';

export default function SchematicPreviewPage() {
	const { schematicId } = useParams();
	const { data, isLoading, isError } = useQuery<Schematic>(`schematic/${schematicId}`, {
		id: '',
		name: '',
		data: '',
		authorId: '',
		description: '',
		requirement: [],
		tags: [],
		like: 0,
		verifyAdmin: '',
	});

	const navigate = useNavigate();

	const { addPopup } = usePopup();

	let schematic = data;

	function handleDeleteSchematic(schematic: Schematic) {
		API.REQUEST.delete(`schematic/${schematic.id}`) //
			.then(() => addPopup(i18n.t('schematic.delete-success'), 5, 'info'))
			.then(() => navigate('/schematic'))
			.catch(() => addPopup(i18n.t('schematic.delete-fail'), 5, 'warning'));
	}

	if (isLoading) return <LoadingSpinner />;

	if (isError)
		return (
			<div>
				<Trans i18nKey='schematic-not-found' />
			</div>
		);

	return (
		<main className='flex-column space-between w100p h100p small-gap massive-padding border-box scroll-y'>
			<section className='flex-row medium-gap flex-wrap'>
				<SchematicInfoImage src={`${API_BASE_URL}schematic/${schematic.id}/image`} />
				<section className='flex-column small-gap flex-wrap'>
					<ColorText className='capitalize h2' text={schematic.name} />
					<Trans i18nKey='author' /> <LoadUserName userId={schematic.authorId} />
					<SchematicDescription description={schematic.description} />
					<SchematicRequirement requirement={schematic.requirement} />
					<TagContainer tags={Tags.parseArray(schematic.tags, Tags.SCHEMATIC_SEARCH_TAG)} />
					<Trans i18nKey='verify-by' /> <LoadUserName userId={schematic.verifyAdmin} />
				</section>
			</section>
			<SchematicInfoButton
				schematic={schematic} //
				handleDeleteSchematic={handleDeleteSchematic}
			/>
			<CommentContainer contentType='schematic' targetId={schematic.id} />
		</main>
	);
}

interface SchematicInfoButtonProps {
	schematic: Schematic;
	handleDeleteSchematic: (schematic: Schematic) => void;
}

function SchematicInfoButton(props: SchematicInfoButtonProps) {
	const { user } = useUser();
	const { copy } = useClipboard();

	const { dialog, setVisibility } = useDialog();

	const likeService = useLike('schematic', props.schematic.id, props.schematic.like);
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
			{dialog(
				<ConfirmDialog onClose={() => setVisibility(false)} onConfirm={() => props.handleDeleteSchematic(props.schematic)}>
					<Icon className='h1rem w1rem small-padding' icon='/assets/icons/info.png' />
					<Trans i18nKey='delete-schematic-dialog' />
				</ConfirmDialog>,
			)}
		</section>
	);
}
