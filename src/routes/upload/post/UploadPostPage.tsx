import 'src/styles.css';
import './UploadPostPage.css';

import React, { useState } from 'react';
import Markdown from 'src/components/markdown/Markdown';
import useModel from 'src/hooks/UseModel';
import Button from 'src/components/button/Button';
import { Trans } from 'react-i18next';

export default function UploadPostPage() {
	const [content, setContent] = useState('');

	const { model, setVisibility } = useModel();

	return (
		<main className='w100p h100p small-gap border-box scroll-y'>
			<section className='relative w100p h100p'>
				<textarea className='content-editor w100p h100p' onChange={(event) => setContent(event.target.value)} />
				<Button className='absolute top right small-margin' onClick={() => setVisibility(true)}>
					<Trans i18nKey='show-preview' />
				</Button>
			</section>
			{model(
				<section>
					<Button className='absolute top right small-margin' onClick={() => setVisibility(false)}>
						<Trans i18nKey='hide-preview' />
					</Button>
					<Markdown className='w100p h100p' children={content} />
				</section>,
			)}
		</main>
	);
}
