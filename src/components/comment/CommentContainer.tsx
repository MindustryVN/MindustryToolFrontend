import 'src/styles.css';
import './CommentContainer.css';

import { API } from 'src/API';
import { Comment } from 'src/data/Comment';
import React, { useState } from 'react';
import i18n from 'src/util/I18N';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import usePopup from 'src/hooks/UsePopup';
import IconButton from 'src/components/button/IconButton';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import IfTrue from 'src/components/common/IfTrue';
import LoadUserName from 'src/components/user/LoadUserName';
import { Trans } from 'react-i18next';
import IfTrueElse from 'src/components/common/IfTrueElse';
import ClearIconButton from 'src/components/button/ClearIconButton';
import ClearButton from 'src/components/button/ClearButton';
import { Ellipsis } from 'src/components/common/Icon';
import { Users } from 'src/data/User';
import useMe from 'src/hooks/UseMe';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';

interface CommentContainerProps {
	contentType: string;
	targetId: string;
}

export default function CommentContainer(props: CommentContainerProps) {
	const usePage = useInfinitePage<Comment>(`comment/${props.contentType}/${props.targetId}`, 20);

	const { pages, reloadPage, isLoading } = useInfiniteScroll(usePage, (v) => <Reply contentType={props.contentType + '_reply'} comment={v} nestLevel={0} reloadPage={reloadPage} />);

	const { addPopup } = usePopup();

	const [loading, setLoading] = useState(false);

	function handleAddComment(content: string, targetId: string) {
		setLoading(true);
		API.postComment(`comment/${props.contentType}`, targetId, content, props.contentType)
			.then(() => addPopup(i18n.t('comment-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('comment-fail'), 5, 'warning'))
			.finally(() => setLoading(false))
			.then(() => reloadPage());
	}

	if (isLoading || loading) return <LoadingSpinner />;

	return (
		<section className='flex-column medium-gap w100p'>
			<CommentInput targetId={props.targetId} handleAddComment={handleAddComment} />
			{pages}
		</section>
	);
}

interface ReplyProps {
	contentType: string;
	comment: Comment;
	nestLevel: number;
	reloadPage: () => void;
}

function Reply(props: ReplyProps) {
	const [showInput, setShowInput] = useState(false);
	const [showReply, setShowReply] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [loading, setLoading] = useState(false);

	const { me } = useMe();

	const { addPopup } = usePopup();

	const usePage = useInfinitePage<Comment>(`comment/${props.contentType}/${props.comment.id}`, 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <Reply contentType={props.contentType} comment={v} nestLevel={props.nestLevel + 1} reloadPage={usePage.reloadPage} />);

	function handleAddComment(content: string, targetId: string) {
		setLoading(true);

		API.postComment(`comment/${props.contentType}`, targetId, content, `${props.contentType}`)
			.then(() => addPopup(i18n.t('comment-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('comment-fail'), 5, 'warning'))
			.finally(() => setLoading(false))
			.then(() => props.reloadPage());
	}

	function handleRemoveComment(comment: Comment) {
		setLoading(true);

		API.deleteComment(props.contentType, comment.id)
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'warning'))
			.finally(() => setLoading(false))
			.then(() => props.reloadPage());
	}

	if (loading) return <LoadingSpinner />;

	return (
		<section className='relative flex-column outline-gray small-padding medium-gap background-transparent'>
			<span className='flex-row medium-gap flex-wrap'>
				<LoadUserName userId={props.comment.authorId} />
				<span>{props.comment.content}</span>
			</span>
			<IfTrue
				condition={props.nestLevel < 3}
				whenTrue={
					<section className='flex-column small-gap'>
						<section className='flex-row small-gap'>
							<ClearButton onClick={() => setShowInput((prev) => !prev)}>
								<Trans i18nKey='reply' />
							</ClearButton>
							<IfTrue
								condition={pages.length > 0}
								whenTrue={
									<IfTrueElse
										condition={showReply}
										whenTrue={<ClearIconButton icon='/assets/icons/up-vote.png' onClick={() => setShowReply(false)} />}
										whenFalse={<ClearIconButton icon='/assets/icons/down-vote.png' onClick={() => setShowReply(true)} />}
									/>
								}
							/>
						</section>

						<IfTrue
							condition={showInput}
							whenTrue={
								<ReplyInput
									targetId={props.comment.id}
									handleAddComment={handleAddComment} //
									onClose={() => setShowInput(false)}
								/>
							}
						/>
						<IfTrue
							condition={showReply}
							whenTrue={<IfTrueElse condition={isLoading} whenTrue={<LoadingSpinner />} whenFalse={<section className='flex-column small-gap w100p'>{pages}</section>} />}
						/>
					</section>
				}
			/>

			<IfTrue
				condition={Users.isAuthorOrAdmin(props.comment.id, me)}
				whenTrue={
					<section className='ellipsis absolute flex-column center small-padding'>
						<ClearButton onClick={() => setShowDropdown((prev) => !prev)}>
							<Ellipsis />
						</ClearButton>
						<IfTrue condition={showDropdown} whenTrue={<ClearIconButton icon='/assets/icons/trash-16.png' onClick={() => handleRemoveComment(props.comment)} />} />
					</section>
				}
			/>
		</section>
	);
}

interface CommentInputProps {
	targetId: string;
	handleAddComment: (content: string, targetId: string) => void;
}

function CommentInput(props: CommentInputProps) {
	const [content, setMessage] = useState('');

	return (
		<section className='w100p'>
			<textarea
				className='comment-input-area border-round small-padding w100p border-box' //
				placeholder={i18n.t('write-a-comment').toString()}
				maxLength={200}
				value={content}
				onChange={(event) => setMessage(event.target.value)}
			/>
			<section className='flex-row justify-end'>
				<IconButton icon='/assets/icons/check.png' onClick={() => props.handleAddComment(content, props.targetId)} />
			</section>
		</section>
	);
}

interface ReplyInputProps {
	targetId: string;
	handleAddComment: (content: string, targetId: string) => void;
	onClose: () => void;
}

function ReplyInput(props: ReplyInputProps) {
	const [content, setMessage] = useState('');

	return (
		<section className='w100p'>
			<textarea
				className='comment-input-area w100p border-box' //
				placeholder={i18n.t('write-a-comment').toString()}
				maxLength={200}
				value={content}
				onChange={(event) => setMessage(event.target.value)}
			/>
			<section className='flex-row justify-end'>
				<section className='grid-row small-gap'>
					<IconButton icon='/assets/icons/quit.png' onClick={() => props.onClose()} />
					<IconButton icon='/assets/icons/check.png' onClick={() => props.handleAddComment(content, props.targetId)} />
				</section>
			</section>
		</section>
	);
}
