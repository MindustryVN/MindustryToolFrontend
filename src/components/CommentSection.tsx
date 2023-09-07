import { API } from 'src/API';
import { Comment } from 'src/data/Comment';
import React, { useRef, useState } from 'react';
import i18n from 'src/util/I18N';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import { usePopup } from 'src/context/PopupMessageProvider';
import LoadingSpinner from 'src/components/LoadingSpinner';
import IfTrue from 'src/components/IfTrue';
import LoadUserName from 'src/components/LoadUserName';
import { Trans } from 'react-i18next';
import IfTrueElse from 'src/components/IfTrueElse';
import ClearIconButton from 'src/components/ClearIconButton';
import ClearButton from 'src/components/ClearButton';
import { EllipsisIcon } from 'src/components/Icon';
import { Users } from 'src/data/User';
import { useMe } from 'src/context/MeProvider';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';

interface CommentSectionProps {
	contentType: string;
	targetId: string;
}

export default function CommentSection({ contentType, targetId }: CommentSectionProps) {
	const commentUrl = useRef(`comment/${contentType}/${targetId}`);
	const usePage = useInfinitePage<Comment>(commentUrl.current, 20);

	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <Reply key={v.id} contentType={contentType + '_reply'} comment={v} nestLevel={0} />);

	const { addPopup } = usePopup();

	const [loading, setLoading] = useState(false);

	function handleAddComment(content: string, targetId: string) {
		setLoading(true);
		API.postComment(`comment/${contentType}`, targetId, content, contentType)
			.then(() => addPopup(i18n.t('comment-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('comment-fail'), 5, 'warning'))
			.finally(() => setLoading(false));
	}

	if (isLoading || loading) return <LoadingSpinner className='flex justify-center items-center' />;

	return (
		<section className='flex flex-col gap-4 w-full'>
			<CommentInputArea targetId={targetId} handleAddComment={handleAddComment} />
			{pages}
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

	const { addPopup } = usePopup();

	const replyUrl = useRef(`comment/${contentType}/${comment.id}`);

	const usePage = useInfinitePage<Comment>(replyUrl.current, 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <Reply key={v.id} contentType={contentType} comment={v} nestLevel={nestLevel + 1} />);

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

	if (loading) return <LoadingSpinner className='flex justify-center items-center' />;

	return (
		<section className='relative flex flex-col'>
			<div className='flex flex-row gap-2 p-2 flex-wrap bg-slate-700'>
				<LoadUserName userId={comment.authorId} />
				<p>{comment.content}</p>
			</div>
			<section className='flex flex-row gap-2 justify-center items-center self-end align-bottom h-8'>
				<ClearButton className='flex flex-row gap-2' title={i18n.t('reply')} onClick={() => setShowInput((prev) => !prev)}>
					<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
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
			<IfTrue
				condition={showReply}
				whenTrue={
					<IfTrueElse
						condition={isLoading}
						whenTrue={<LoadingSpinner className='flex justify-center items-center' />}
						whenFalse={<section className='flex flex-col gap-4 w-full pl-2'>{pages}</section>}
					/>
				}
			/>
			<IfTrue
				condition={Users.isAuthorOrAdmin(comment.id, me)}
				whenTrue={
					<section className='absolute top-0 right-0 flex flex-col center p-2'>
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
			className='bg-transparent outline-none w-full box-border resize-none' //
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
		<section className='w-full flex flex-row border-b-2 border-slate-500'>
			<CommentInput content={content} onChange={(value) => setMessage(value)} />
			<section className='flex flex-row justify-end'>
				<ClearIconButton title={i18n.t('upload')} icon='/assets/icons/check.png' onClick={() => handleAddComment(content, targetId)} />
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
		<section className='w-full flex flex-row border-b-2 border-slate-500'>
			<CommentInput content={content} onChange={(value) => setMessage(value)} />
			<section className='flex flex-row justify-end'>
				<section className='grid grid-auto-column grid-flow-col w-fit gap-2'>
					<ClearIconButton title={i18n.t('quit')} icon='/assets/icons/quit.png' onClick={() => onClose()} />
					<ClearIconButton title={i18n.t('upload')} icon='/assets/icons/check.png' onClick={() => handleAddComment(content, targetId)} />
				</section>
			</section>
		</section>
	);
}
