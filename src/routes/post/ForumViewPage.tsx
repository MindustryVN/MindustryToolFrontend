import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useQuery from 'src/hooks/UseQuery';
import { usePopup } from 'src/context/PopupMessageProvider';
import { API } from 'src/API';
import i18n from 'src/util/I18N';
import LoadingSpinner from 'src/components/LoadingSpinner';
import { Trans } from 'react-i18next';
import { Tags } from 'src/components/tag/Tag';
import LoadUserName from 'src/components/LoadUserName';
import TagContainer from 'src/components/tag/TagContainer';
import Markdown from 'src/components/markdown/Markdown';
import DateDisplay from 'src/components/Date';
import IconButton from 'src/components/IconButton';
import IfTrue from 'src/components/IfTrue';
import { Users } from 'src/data/User';
import { useMe } from 'src/context/MeProvider';

export default function ForumViewPage() {
	const { postId } = useParams();
	const { data, isLoading, isError } = useQuery<Post>(`post/${postId}`);

	const navigate = useNavigate();

	const { addPopup } = usePopup();

	const { me } = useMe();

	function handleDeletePost(post: Post) {
		API.deletePost(post.id) //
			.then(() => addPopup(i18n.t('post.delete-success'), 5, 'info'))
			.then(() => navigate('/post'))
			.catch(() => addPopup(i18n.t('post.delete-fail'), 5, 'warning'));
	}

	if (isLoading) return <LoadingSpinner />;

	if (isError || !data)
		return (
			<div className='flex justify-center items-center w-full h-full'>
				<Trans i18nKey='post-not-found' />
			</div>
		);

	return (
		<section className='flex flex-row w-full h-full gap-2 p-8 box-border overflow-y-auto'>
			<header className='flex flex-row p-8 gap-2'>
				<span className='title'>{data.header}</span>
				<LoadUserName userId={data.authorId} />
				<TagContainer tags={Tags.parseArray(data.tags, Tags.POST_SEARCH_TAG)} />
			</header>
			<Markdown children={data.content} />
			<footer className='flex flex-row justify-end gap-2 align-end'>
				<DateDisplay time={data.time} />
				<IfTrue
					condition={Users.isAuthorOrAdmin(data.authorId, me)}
					whenTrue={
						<>
							<IconButton title={i18n.t('delete')} icon='/assets/icons/trash-16.png' onClick={() => handleDeletePost(data)} />
						</>
					}
				/>
			</footer>
		</section>
	);
}
