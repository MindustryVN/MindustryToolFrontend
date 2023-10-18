import { API } from 'src/API';
import { Comment } from 'src/data/Comment';
import React, { useRef, useState } from 'react';
import i18n from 'src/util/I18N';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import { usePopup } from 'src/context/PopupMessageProvider';
import LoadingSpinner from 'src/components/LoadingSpinner';
import LoadUserName from 'src/components/LoadUserName';
import { Trans } from 'react-i18next';
import IfTrueElse from 'src/components/IfTrueElse';
import ClearIconButton from 'src/components/ClearIconButton';
import ClearButton from 'src/components/ClearButton';
import { EllipsisIcon } from 'src/components/Icon';
import { Users } from 'src/data/User';
import { useMe } from 'src/context/MeProvider';
import IconButton from 'src/components/IconButton';
import InfiniteScroll from 'src/components/InfiniteScroll';
import IfTrue from 'src/components/IfTrue';

interface CommentSectionProps {
	contentType: string;
	targetId: string;
}

export default function CommentSection({ contentType, targetId }: CommentSectionProps) {
	const commentUrl = useRef(`comment/${contentType}/${targetId}`);
	const usePage = useInfinitePage<Comment>(commentUrl.current, 20);
	const { isLoading } = usePage;

	const addPopup = usePopup();

	const [loading, setLoading] = useState(false);

	function handleAddComment(content: string, targetId: string) {
		setLoading(true);
		API.postComment(`comment/${contentType}`, targetId, content, contentType)
			.then(() => addPopup(i18n.t('comment-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('comment-fail'), 5, 'warning'))
			.finally(() => setLoading(false));
	}

	if (isLoading || loading) return <LoadingSpinner className='flex items-center justify-center' />;

	return (
		<section className='mb-4 flex w-full flex-col gap-4'>
			<CommentInputArea targetId={targetId} handleAddComment={handleAddComment} />
			<InfiniteScroll infinitePage={usePage} mapper={(v) => <Reply key={v.id} contentType={contentType + '_reply'} comment={v} nestLevel={0} />} />
		</section>
	);
}

interface ReplyProps {
	contentType: string;
	comment: Comment;
	nestLevel: number;
}

function Reply({ contentType, comment, nestLevel }: ReplyProps) {
	const [showInput, setShowInput] = useState(false);
	const [showReply, setShowReply] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [loading, setLoading] = useState(false);

	const { me } = useMe();

	const addPopup = usePopup();

	const replyUrl = useRef(`comment/${contentType}/${comment.id}`);

	const usePage = useInfinitePage<Comment>(replyUrl.current, 20);
	const { pages } = usePage;

	function handleAddComment(content: string, targetId: string) {
		setLoading(true);
		API.postComment(`comment/${contentType}`, targetId, content, contentType)
			.then(() => addPopup(i18n.t('comment-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('comment-fail'), 5, 'warning'))
			.finally(() => setLoading(false));
	}

	function handleRemoveComment(comment: Comment) {
		setLoading(true);
		API.deleteComment(contentType, comment.id)
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'warning'))
			.finally(() => setLoading(false))
			.then(() => usePage.filter((c) => c !== comment));
	}

	if (loading) return <LoadingSpinner className='flex items-center justify-center' />;

	return (
		<section className='relative flex flex-col'>
			<div className='flex flex-row flex-wrap gap-2 bg-slate-700 p-2'>
				<LoadUserName userId={comment.authorId} />
				<p>{comment.content}</p>
			</div>
			<section className='flex h-8 flex-row items-center justify-center gap-2 self-end align-bottom'>
				<ClearButton className='flex flex-row gap-2' title={i18n.t('reply')} onClick={() => setShowInput((prev) => !prev)}>
					<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='h-6 w-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
						/>
					</svg>
					<Trans i18nKey='reply' />
				</ClearButton>
				<IfTrue
					condition={nestLevel < 3}
					whenTrue={
						<section className='flex flex-row justify-end gap-2'>
							<IfTrue
								condition={pages.length > 0}
								whenTrue={
									<IfTrueElse
										condition={showReply}
										whenTrue={<ClearIconButton title={i18n.t('up-vote')} icon='/assets/icons/up-vote.png' onClick={() => setShowReply(false)} />}
										whenFalse={<ClearIconButton title={i18n.t('down-vote')} icon='/assets/icons/down-vote.png' onClick={() => setShowReply(true)} />}
									/>
								}
							/>
						</section>
					}
				/>
			</section>
			<IfTrue
				condition={showInput}
				whenTrue={
					<ReplyInputArea
						targetId={comment.id}
						handleAddComment={handleAddComment} //
						onClose={() => setShowInput(false)}
					/>
				}
			/>
			<IfTrue condition={showReply} whenTrue={<InfiniteScroll infinitePage={usePage} mapper={(v) => <Reply key={v.id} contentType={contentType} comment={v} nestLevel={nestLevel + 1} />} />} />
			<IfTrue
				condition={Users.isAuthorOrAdmin(comment.id, me)}
				whenTrue={
					<section className='center absolute right-0 top-0 flex flex-col p-2'>
						<ClearButton title={i18n.t('option')} onClick={() => setShowDropdown((prev) => !prev)}>
							<EllipsisIcon />
						</ClearButton>
						<IfTrue
							condition={showDropdown}
							whenTrue={<ClearIconButton className='absolute' title={i18n.t('delete')} icon='/assets/icons/trash-16.png' onClick={() => handleRemoveComment(comment)} />}
						/>
					</section>
				}
			/>
		</section>
	);
}

interface CommentInputProps {
	content: string;
	onChange: (value: string) => void;
}

function CommentInput({ content, onChange }: CommentInputProps) {
	return (
		<textarea
			className='box-border w-full resize-none bg-transparent outline-none' //
			placeholder={i18n.t('write-a-comment').toString()}
			maxLength={200}
			value={content}
			onChange={(event) => onChange(event.target.value)}
		/>
	);
}

interface CommentInputAreaProps {
	targetId: string;
	handleAddComment: (content: string, targetId: string) => void;
}

function CommentInputArea({ targetId, handleAddComment }: CommentInputAreaProps) {
	const [content, setMessage] = useState('');

	return (
		<section className='flex w-full flex-row border-b-2 border-slate-500'>
			<CommentInput content={content} onChange={(value) => setMessage(value)} />
			<section className='flex flex-row items-center justify-end'>
				<IconButton className='h-8 w-8 px-2 py-1' title={i18n.t('upload')} icon='/assets/icons/check.png' onClick={() => handleAddComment(content, targetId)} />
			</section>
		</section>
	);
}

interface ReplyInputProps {
	targetId: string;
	handleAddComment: (content: string, targetId: string) => void;
	onClose: () => void;
}

function ReplyInputArea({ targetId, handleAddComment, onClose }: ReplyInputProps) {
	const [content, setMessage] = useState('');

	return (
		<section className='flex w-full flex-row border-b-2 border-slate-500'>
			<CommentInput content={content} onChange={(value) => setMessage(value)} />
			<section className='flex flex-row justify-end'>
				<section className='flex flex-row items-center gap-2'>
					<IconButton className='h-8 w-8 px-2 py-1' title={i18n.t('quit')} icon='/assets/icons/quit.png' onClick={() => onClose()} />
					<IconButton className='h-8 w-8 px-2 py-1' title={i18n.t('upload')} icon='/assets/icons/check.png' onClick={() => handleAddComment(content, targetId)} />
				</section>
			</section>
		</section>
	);
}
