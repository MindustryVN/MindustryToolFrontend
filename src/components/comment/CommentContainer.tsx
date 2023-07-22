import 'src/styles.css';
import './CommentContainer.css';

import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import ClearButton from 'src/components/button/ClearButton';
import IfTrue from 'src/components/common/IfTrue';
import { Comment } from 'src/data/Comment';
import usePage from 'src/hooks/UsePage';
import IconButton from 'src/components/button/IconButton';
import { API } from 'src/API';
import usePopup from 'src/hooks/UsePopup';
import i18n from 'src/util/I18N';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';

interface CommentContainerProps {
	url: string;
	targetId: string;
	nesting: number;
}

export default function CommentContainer(props: CommentContainerProps) {
	const { pages, reloadPage, isLoading } = usePage<Comment>(`${props.url}/${props.targetId}/page`);

	const [isExpand, setIsExpand] = useState(false);

	const { addPopup } = usePopup();

	console.log('render ' + props.nesting);

	function handleSubmit(message: string, targetId: string) {
		API.postComment(props.url, targetId, message)
			.then(() => {
				addPopup(i18n.t('comment-success'), 5, 'info');
				reloadPage();
			})
			.catch(() => addPopup(i18n.t('comment-fail'), 5, 'warning'));
	}

	if (props.nesting > 2) return <></>;

	if (isLoading) return <LoadingSpinner />;

	if (pages.length <= 0) {
		if (props.nesting === 0)
			return (
				<section className='flex-column center w100p'>
					<Trans i18nKey='no-comment' />
					<CommentInput url={props.url} targetId={props.targetId} handleSubmit={handleSubmit} />
				</section>
			);
		return <CommentInput url={props.url} targetId={props.targetId} handleSubmit={handleSubmit} />;
	}
	return (
		<section className='comment-container'>
			{pages.map((page) => (
				<section>
					<p className='comment small-padding border-box'>{page.message}</p>
					<IfTrue
						condition={props.nesting <= 2}
						whenTrue={
							<section>
								<CommentInput url={props.url} targetId={page.id} handleSubmit={handleSubmit} />
								<ClearButton onClick={() => setIsExpand((prev) => !prev)}>
									<img className='load-more-icon' title='load-more-icon' src='/assets/icons/down-vote.png' alt='more' />
								</ClearButton>
							</section>
						}
					/>
					<IfTrue condition={isExpand} whenTrue={<CommentContainer key={page.id} url={props.url} targetId={page.id} nesting={props.nesting + 1} />} />
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
		<section className='flex-row center w100p'>
			<textarea className='comment-input' maxLength={200} value={message} onChange={(event) => setMessage(event.target.value)} />
			<IconButton icon='/assets/icons/check.png' onClick={() => props.handleSubmit(message, props.targetId)} />
		</section>
	);
}
