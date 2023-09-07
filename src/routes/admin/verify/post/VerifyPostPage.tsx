import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { API } from 'src/API';
import Button from 'src/components/Button';
import ClearIconButton from 'src/components/ClearIconButton';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import IfTrue from 'src/components/IfTrue';
import ConfirmDialog from 'src/components/ConfirmDialog';
import SearchBox from 'src/components/Searchbox';
import LoadingSpinner from 'src/components/LoadingSpinner';
import PostPreview from 'src/components/PostPreview';
import PostView from 'src/components/PostView';
import { TagChoice, Tags } from 'src/components/Tag';
import TagEditContainer from 'src/components/TagEditContainer';
import TagPick from 'src/components/TagPick';
import useDialog from 'src/hooks/UseDialog';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import useModel from 'src/hooks/UseModel';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import { usePopup } from 'src/context/PopupMessageProvider';
import i18n from 'src/util/I18N';
import AdminOnly from 'src/components/AdminOnly';
import { useTags } from 'src/context/TagProvider';

export default function VerifyPostPage() {
	const [currentPost, setCurrentPost] = useState<Post>();

	const { addPopup } = usePopup();

	const usePage = useInfinitePage<Post>('post-upload', 20);
	const { model, setVisibility } = useModel();

	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <PostUploadPreview key={v.id} post={v} handleOpenModel={handleOpenPostInfo} />);

	function handleOpenPostInfo(post: Post) {
		setCurrentPost(post);
		setVisibility(true);
	}

	function rejectPost(post: Post, reason: string) {
		setVisibility(false);
		API.rejectPost(post, reason) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info')) //
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => usePage.filter((p) => p !== post));
	}

	function verifyPost(post: Post, tags: TagChoice[]) {
		setVisibility(false);
		API.verifyPost(post, tags) //
			.then(() => API.postNotification(post.authorId, 'Your post submission has be accept', 'Post post success'))
			.then(() => addPopup(i18n.t('verify-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('verify-fail'), 5, 'error'))
			.finally(() => usePage.filter((p) => p !== post));
	}

	return (
		<main id='verify-post' className='flex flex-row h-full w-full'>
			<section className='flex flex-row gap-2' children={pages} />
			<footer className='flex justify-center items-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>
				<ScrollToTopButton containerId='verify-post' />
			</footer>
			<IfTrue
				condition={currentPost}
				whenTrue={
					currentPost &&
					model(
						<PostUploadInfo
							post={currentPost} //
							handleCloseModel={() => setVisibility(false)}
							handleVerifyPost={verifyPost}
							handleRejectPost={rejectPost}
						/>,
					)
				}
			/>
		</main>
	);
}

interface PostUploadPreviewProps {
	post: Post;
	handleOpenModel: (post: Post) => void;
}

export function PostUploadPreview({ post, handleOpenModel }: PostUploadPreviewProps) {
	return (
		<section role='button' onClick={() => handleOpenModel(post)}>
			<PostPreview post={post} />
		</section>
	);
}

interface PostUploadInfoProps {
	post: Post;
	handleVerifyPost: (post: Post, tags: TagChoice[]) => void;
	handleRejectPost: (post: Post, reason: string) => void;
	handleCloseModel: () => void;
}

export function PostUploadInfo({ post, handleCloseModel, handleVerifyPost, handleRejectPost }: PostUploadInfoProps) {
	const { postUploadTag } = useTags();
	const [tags, setTags] = useState<TagChoice[]>(Tags.parseArray(post.tags, postUploadTag));
	const [tag, setTag] = useState('');

	const verifyDialog = useDialog();
	const rejectDialog = useDialog();

	const { model, setVisibility } = useModel();

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
			<section className='editor-background relative flex flex-row w-full h-full gap-2 p-8 box-border'>
				<section className='flex flex-row gap-2 w-full align-end'>
					<input className='title-editor w-full box-border' type='text' value={post.header} placeholder={i18n.t('title').toString()} disabled={true} />
					<SearchBox
						placeholder={i18n.t('add-tag').toString()}
						value={tag}
						items={postUploadTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						mapper={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<TagEditContainer tags={tags} onRemove={handleRemoveTag} />
				<textarea className='content-editor w-full h-full' value={post.content} disabled={true} />
				<section className='flex flex-row absolute top-0 right medium-margin gap-2'>
					<a className='button' href='https://vi.wikipedia.org/wiki/Markdown' target='_blank' rel='noreferrer'>
						<Trans i18nKey='how-to-write-markdown' />
					</a>
					<Button title={i18n.t('show-preview')} onClick={() => setVisibility(true)}>
						<Trans i18nKey='show-preview' />
					</Button>
				</section>
			</section>

			<section className='grid grid-auto-column grid-flow-col w-fit gap-2'>
				<Button title={i18n.t('reject')} children={<Trans i18nKey='reject' />} onClick={() => rejectDialog.setVisibility(true)} />
				<AdminOnly children={<Button title={i18n.t('verify')} children={<Trans i18nKey='verify' />} onClick={() => verifyDialog.setVisibility(true)} />} />
				<Button title={i18n.t('back')} onClick={() => handleCloseModel()} children={<Trans i18nKey='back' />} />
			</section>
			{verifyDialog.dialog(
				<ConfirmDialog
					onConfirm={() => handleVerifyPost(post, tags)} //
					onClose={() => verifyDialog.setVisibility(false)}>
					<Trans i18nKey='verify' />
				</ConfirmDialog>,
			)}
			{rejectDialog.dialog(
				<TypeDialog
					onSubmit={(reason) => handleRejectPost(post, reason)} //
					onClose={() => rejectDialog.setVisibility(false)}
				/>,
			)}
			{model(
				<section className='relative w-full h-full overflow-y-auto'>
					<PostView post={post} />
					<Button title={i18n.t('hide-preview')} className='absolute top-0 right medium-margin' onClick={() => setVisibility(false)}>
						<Trans i18nKey='hide-preview' />
					</Button>
				</section>,
			)}
		</main>
	);
}

interface TypeDialogProps {
	onSubmit: (content: string) => void;
	onClose: () => void;
}

function TypeDialog({ onSubmit, onClose }: TypeDialogProps) {
	const [content, setContent] = useState('');

	return (
		<section className='flex flex-row'>
			<header className='flex flex-row space-between p-2'>
				<Trans i18nKey='reject-reason' />
				<ClearIconButton title={i18n.t('close')} icon='/assets/icons/quit.png' onClick={() => onClose()} />
			</header>
			<textarea className='type-dialog' title='reason' onChange={(event) => setContent(event.target.value)} />
			<section className='flex flex-row justify-end w-full p-2 box-border'>
				<Button title={i18n.t('reject')} onClick={() => onSubmit(content)}>
					<Trans i18nKey='reject' />
				</Button>
			</section>
		</section>
	);
}
