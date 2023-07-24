import 'src/styles.css';
import './CommentContainer.css';

import { API } from 'src/API';
import { Comment } from 'src/data/Comment';
import React, { useState } from 'react';
import i18n from 'src/util/I18N';
import usePage from 'src/hooks/UsePage';
import usePopup from 'src/hooks/UsePopup';
import IconButton from 'src/components/button/IconButton';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import IfTrue from 'src/components/common/IfTrue';
import LoadUserName from 'src/components/user/LoadUserName';
import { Trans } from 'react-i18next';
import Button from 'src/components/button/Button';
import IfTrueElse from 'src/components/common/IfTrueElse';
import ClearIconButton from 'src/components/button/ClearIconButton';

interface CommentContainerProps {
	url: string;
	targetId: string;
}

export default function CommentContainer(props: CommentContainerProps) {
	const { pages, reloadPage, isLoading } = usePage<Comment>(`${props.url}/${props.targetId}/page`);

	const { addPopup } = usePopup();

	function handleAddComment(message: string, targetId: string) {
		API.postComment(props.url, targetId, message)
			.then(() => addPopup(i18n.t('comment-success'), 5, 'info'))
			.then(() => reloadPage())
			.catch(() => addPopup(i18n.t('comment-fail'), 5, 'warning'));
	}

	if (isLoading) return <LoadingSpinner />;

	return (
		<section className='flex-column small-gap w100p'>
			<CommentInput url={props.url} targetId={props.targetId} handleAddComment={handleAddComment} />
			{pages.map((comment) => (
				<Reply key={comment.id} url={props.url} comment={comment} nestLevel={0} reloadPage={reloadPage} />
			))}
		</section>
	);
}

interface ReplyProps {
	url: string;
	comment: Comment;
	nestLevel: number;
	reloadPage: () => void;
}

function Reply(props: ReplyProps) {
	const [showInput, setShowInput] = useState(false);
	const [showReply, setShowReply] = useState(false);

	const { addPopup } = usePopup();

	const { pages, reloadPage, isLoading } = usePage<Comment>(`${props.url}/${props.comment.id}/page`);

	function handleAddComment(message: string, targetId: string) {
		API.postComment(props.url, targetId, message)
			.then(() => addPopup(i18n.t('comment-success'), 5, 'info'))
			.then(() => props.reloadPage())
			.catch(() => addPopup(i18n.t('comment-fail'), 5, 'warning'));
	}

	return (
		<section className='comment-container flex-column medium-gap border-box' style={{ paddingLeft: props.nestLevel + 'rem' }}>
			<span className='flex-row medium-gap flex-wrap'>
				<LoadUserName userId={props.comment.userId} />
				<span>{props.comment.message}</span>
			</span>
			<IfTrue
				condition={props.nestLevel < 3}
				whenTrue={
					<section>
						<section className='flex-row'>
							<Button onClick={() => setShowInput((prev) => !prev)}>
								<Trans i18nKey='reply' />
							</Button>
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
									url={props.url}
									targetId={props.comment.id}
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
									whenTrue={<LoadingSpinner />}
									whenFalse={
										<section className='flex-column small-gap w100p'>
											{pages.map((comment) => (
												<Reply key={comment.id} url={props.url} comment={comment} nestLevel={props.nestLevel + 1} reloadPage={reloadPage} />
											))}
										</section>
									}
								/>
							}
						/>
					</section>
				}
			/>
		</section>
	);
}

interface CommentInputProps {
	url: string;
	targetId: string;
	handleAddComment: (message: string, targetId: string) => void;
}

function CommentInput(props: CommentInputProps) {
	const [message, setMessage] = useState('');

	return (
		<section className='w100p'>
			<textarea
				className='comment-input-area w100p border-box' //
				placeholder={i18n.t('write-a-comment').toString()}
				maxLength={200}
				value={message}
				onChange={(event) => setMessage(event.target.value)}
			/>
			<section className='flex-row justify-end'>
				<IconButton icon='/assets/icons/check.png' onClick={() => props.handleAddComment(message, props.targetId)} />
			</section>
		</section>
	);
}

interface ReplyInputProps {
	url: string;
	targetId: string;
	handleAddComment: (message: string, targetId: string) => void;
	onClose: () => void;
}

function ReplyInput(props: ReplyInputProps) {
	const [message, setMessage] = useState('');

	return (
		<section className='w100p'>
			<textarea
				className='comment-input-area w100p border-box' //
				placeholder={i18n.t('write-a-comment').toString()}
				maxLength={200}
				value={message}
				onChange={(event) => setMessage(event.target.value)}
			/>
			<section className='flex-row justify-end'>
				<IconButton icon='/assets/icons/check.png' onClick={() => props.handleAddComment(message, props.targetId)} />
				<IconButton icon='/assets/icons/quit.png' onClick={() => props.onClose()} />
			</section>
		</section>
	);
}
