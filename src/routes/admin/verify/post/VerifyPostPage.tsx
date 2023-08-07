import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { API } from 'src/API';
import Button from 'src/components/button/Button';
import ClearIconButton from 'src/components/button/ClearIconButton';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import IfTrue from 'src/components/common/IfTrue';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import Dropbox from 'src/components/dropbox/Dropbox';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import PostPreview from 'src/components/post/PostPreview';
import PostView from 'src/components/post/PostView';
import { TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import TagEditContainer from 'src/components/tag/TagEditContainer';
import TagPick from 'src/components/tag/TagPick';
import useDialog from 'src/hooks/UseDialog';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import useModel from 'src/hooks/UseModel';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import usePopup from 'src/hooks/UsePopup';
import i18n from 'src/util/I18N';

export default function VerifyPostPage() {
	const [currentPost, setCurrentPost] = useState<Post>();

	const { addPopup } = usePopup();

	const { pages, loadNextPage, reloadPage, isLoading } = useInfinitePage<Post>('post-upload', 20);
	const { model, setVisibility } = useModel();

	const infPages = useInfiniteScroll(pages, (v) => <PostPreviewCard post={v} handleOpenModel={handleOpenPostInfo} />, loadNextPage);

	function handleOpenPostInfo(post: Post) {
		setCurrentPost(post);
		setVisibility(true);
	}

	function rejectPost(post: Post, reason: string) {
		setVisibility(false);
		API.rejectPost(post, reason) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info')) //
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => reloadPage());
	}

	function verifyPost(post: Post, tags: TagChoiceLocal[]) {
		setVisibility(false);
		API.verifyPost(post, tags) //
			.then(() => API.postNotification(post.authorId, 'Your post submission has be accept', 'Post post success'))
			.then(() => addPopup(i18n.t('verify-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('verify-fail'), 5, 'error'))
			.finally(() => reloadPage());
	}

	return (
		<main id='verify-post' className='flex-column h100p w100p'>
			<section className='flex-column medium-gap' children={infPages} />
			<footer className='flex-center'>
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
						<PostInfo
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

interface PostPreviewProps {
	post: Post;
	handleOpenModel: (post: Post) => void;
}

function PostPreviewCard(props: PostPreviewProps) {
	return (
		<section role='button' onClick={() => props.handleOpenModel(props.post)}>
			<PostPreview post={props.post} />
		</section>
	);
}

interface PostInfoProps {
	post: Post;
	handleVerifyPost: (post: Post, tags: TagChoiceLocal[]) => void;
	handleRejectPost: (post: Post, reason: string) => void;
	handleCloseModel: () => void;
}

function PostInfo(props: PostInfoProps) {
	const [tags, setTags] = useState<TagChoiceLocal[]>(Tags.parseArray(props.post.tags, Tags.POST_UPLOAD_TAG));
	const [tag, setTag] = useState('');

	const verifyDialog = useDialog();
	const rejectDialog = useDialog();

	const { model, setVisibility } = useModel();

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
			<section className='editor-background relative flex-column w100p h100p small-gap massive-padding border-box'>
				<section className='flex-row small-gap w100p align-end'>
					<input className='title-editor w100p border-box' type='text' value={props.post.header} placeholder={i18n.t('title').toString()} disabled={true} />
					<Dropbox
						placeholder={i18n.t('add-tag').toString()}
						value={tag}
						items={Tags.POST_UPLOAD_TAG.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						mapper={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<TagEditContainer tags={tags} onRemove={handleRemoveTag} />
				<textarea className='content-editor w100p h100p' value={props.post.content} disabled={true} />
				<section className='flex-row absolute top right medium-margin small-gap'>
					<a className='button' href='https://vi.wikipedia.org/wiki/Markdown' target='_blank' rel='noreferrer'>
						<Trans i18nKey='how-to-write-markdown' />
					</a>
					<Button onClick={() => setVisibility(true)}>
						<Trans i18nKey='show-preview' />
					</Button>
				</section>
			</section>

			<section className='grid-row small-gap'>
				<Button children={<Trans i18nKey='reject' />} onClick={() => rejectDialog.setVisibility(true)} />
				<Button children={<Trans i18nKey='verify' />} onClick={() => verifyDialog.setVisibility(true)} />
				<Button onClick={() => props.handleCloseModel()} children={<Trans i18nKey='back' />} />
			</section>
			{verifyDialog.dialog(
				<ConfirmDialog
					onConfirm={() => props.handleVerifyPost(props.post, tags)} //
					onClose={() => verifyDialog.setVisibility(false)}>
					<Trans i18nKey='verify' />
				</ConfirmDialog>,
			)}
			{rejectDialog.dialog(
				<TypeDialog
					onSubmit={(reason) => props.handleRejectPost(props.post, reason)} //
					onClose={() => rejectDialog.setVisibility(false)}
				/>,
			)}
			{model(
				<section className='relative w100p h100p scroll-y'>
					<PostView post={props.post} />
					<Button className='absolute top right medium-margin' onClick={() => setVisibility(false)}>
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

function TypeDialog(props: TypeDialogProps) {
	const [content, setContent] = useState('');

	return (
		<section className='flex-column'>
			<header className='flex-row space-between small-padding'>
				<Trans i18nKey='reject-reason' />
				<ClearIconButton icon='/assets/icons/quit.png' onClick={() => props.onClose()} />
			</header>
			<textarea className='type-dialog' title='reason' onChange={(event) => setContent(event.target.value)} />
			<section className='flex-row justify-end w100p small-padding border-box'>
				<Button onClick={() => props.onSubmit(content)}>
					<Trans i18nKey='reject' />
				</Button>
			</section>
		</section>
	);
}
