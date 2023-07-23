import 'src/styles.css';
import './CommentContainer.css';

import { API } from 'src/API';
import { Trans } from 'react-i18next';
import { Comment } from 'src/data/Comment';
import React, { useRef, useState } from 'react';
import i18n from 'src/util/I18N';
import usePage from 'src/hooks/UsePage';
import usePopup from 'src/hooks/UsePopup';
import IconButton from 'src/components/button/IconButton';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import IfTrue from 'src/components/common/IfTrue';
import LoadUserName from 'src/components/user/LoadUserName';

interface CommentContainerProps {
	url: string;
	targetId: string;
}

export default function CommentContainer(props: CommentContainerProps) {
	const { pages, reloadPage, isLoading } = usePage<Comment>(`${props.url}/${props.targetId}/page`);

	const { addPopup } = usePopup();

	function handleSubmit(message: string, targetId: string) {
		API.postComment(props.url, targetId, message)
			.then(() => {
				addPopup(i18n.t('comment-success'), 5, 'info');
				reloadPage();
			})
			.catch(() => addPopup(i18n.t('comment-fail'), 5, 'warning'));
	}

	if (isLoading) return <LoadingSpinner />;

	return (
		<section className='flex-column small-gap w100p'>
			<CommentInput url={props.url} targetId={props.targetId} handleSubmit={handleSubmit} />
			{pages.map((comment) => (
				<Reply url={props.url} comment={comment} nestLevel={0} />
			))}
		</section>
	);
}

interface ReplyProps {
	url: string;
	comment: Comment;
	nestLevel: number;
}

function Reply(props: ReplyProps) {
	const [showInput, setShowInput] = useState(false);
	const [showReply, setShowReply] = useState(false);

	const { addPopup } = usePopup();

	function handleSubmit(message: string, targetId: string) {
		API.postComment(props.url, targetId, message)
			.then(() => addPopup(i18n.t('comment-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('comment-fail'), 5, 'warning'));
	}

	return (
		<section className='flex-column small-gap w100p' style={{ paddingBottom: props.nestLevel + 'rem' }}>
			<span className='flex-row medium-gap'>
				<LoadUserName userId={props.comment.userId} />
				{props.comment.message}
			</span>
			<IfTrue
				condition={showInput}
				whenTrue={
					<ReplyInput
						url={props.url}
						targetId={props.comment.id}
						handleSubmit={handleSubmit} //
						onClose={() => setShowInput(true)}
					/>
				}
			/>
		</section>
	);
}

interface ReplyContainerProps {
	url: string;
	targetId: string;
	nestLevel: number;
	handleSubmit: (message: string, targetId: string) => void;
}

function ReplyContainer(props: ReplyContainerProps) {
	const { pages, reloadPage, isLoading } = usePage<Comment>(`${props.url}/${props.targetId}/page`);

	return (
		<section>
			{pages.map((page) => (
				<section className='flex-column end'>
					<p className='comment small-padding border-box'>{page.message}</p>
				</section>
			))}
		</section>
	);
}

interface CommentInputProps {
	url: string;
	targetId: string;
	handleSubmit: (message: string, targetId: string) => void;
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
				<IconButton icon='/assets/icons/check.png' onClick={() => props.handleSubmit(message, props.targetId)} />
			</section>
		</section>
	);
}

interface ReplyInputProps {
	url: string;
	targetId: string;
	handleSubmit: (message: string, targetId: string) => void;
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
				<IconButton icon='/assets/icons/check.png' onClick={() => props.handleSubmit(message, props.targetId)} />
				<IconButton icon='/assets/icons/quit.png' onClick={() => props.onClose()} />
			</section>
		</section>
	);
}
