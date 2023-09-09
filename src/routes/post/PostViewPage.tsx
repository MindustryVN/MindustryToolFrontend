import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useQuery from 'src/hooks/UseQuery';
import { usePopup } from 'src/context/PopupMessageProvider';
import { API } from 'src/API';
import i18n from 'src/util/I18N';
import LoadingSpinner from 'src/components/LoadingSpinner';
import { Trans } from 'react-i18next';
import { Tags } from 'src/components/Tag';
import LoadUserName from 'src/components/LoadUserName';
import TagContainer from 'src/components/TagContainer';
import Markdown from 'src/components/Markdown';
import DateDisplay from 'src/components/Date';
import IconButton from 'src/components/IconButton';
import IfTrue from 'src/components/IfTrue';
import { Users } from 'src/data/User';
import { useMe } from 'src/context/MeProvider';
import { useTags } from 'src/context/TagProvider';

export default function PostViewPage() {
	const { postId } = useParams();
	const { data, isLoading, isError } = useQuery<Post>(`post/${postId}`);

	const navigate = useNavigate();

	const { addPopup } = usePopup();

	const { me } = useMe();

	const { postSearchTag } = useTags();

	function handleDeletePost(post: Post) {
		API.deletePost(post.id) //
			.then(() => addPopup(i18n.t('post.delete-success'), 5, 'info'))
			.then(() => navigate('/post'))
			.catch(() => addPopup(i18n.t('post.delete-fail'), 5, 'warning'));
	}

	if (isLoading) return <LoadingSpinner className='flex h-full w-full items-center justify-center' />;

	if (isError || !data)
		return (
			<div className='flex h-full w-full items-center justify-center'>
				<Trans i18nKey='post-not-found' />
			</div>
		);

	return (
		<section className='box-border flex h-full w-full flex-col gap-2 overflow-y-auto p-8'>
			<header className='flex flex-col gap-2'>
				<span className='text-2xl'>{data.header}</span>
				<LoadUserName userId={data.authorId} />
				<TagContainer tags={Tags.parseArray(data.tags, postSearchTag)} />
			</header>
			<Markdown children={data.content} />
			<footer className='align-end flex flex-row justify-between gap-2'>
				<DateDisplay className='flex items-end align-end' time={data.time} />
				<IfTrue
					condition={Users.isAuthorOrAdmin(data.authorId, me)}
					whenTrue={<IconButton className='h-8 w-8 px-2 py-1' title={i18n.t('delete')} icon='/assets/icons/trash-16.png' onClick={() => handleDeletePost(data)} />}
				/>
			</footer>
		</section>
	);
}
