import 'src/styles.css';
import './UploadPostPage.css';

import React, { useState } from 'react';
import Markdown from 'src/components/markdown/Markdown';
import useModel from 'src/hooks/UseModel';
import Button from 'src/components/button/Button';
import { Trans } from 'react-i18next';
import i18n from 'src/util/I18N';
import Dropbox from 'src/components/dropbox/Dropbox';
import { TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import TagPick from 'src/components/tag/TagPick';
import TagEditContainer from 'src/components/tag/TagEditContainer';

export default function UploadPostPage() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState(`> ## Cách để tải mindustry free
- Ấn vào link bên dưới để đến trang tải xuống (Itch.io) [Link tải Mindustry free cho Window, Linux, MacOS, Android (Và tất nhiên là không có IOS)](https://anuke.itch.io/mindustry?fbclid=IwAR2HgdkixMrQEDhcj1an_qtWnnq6YmOlm-c8VoyPsNp5bMtu5aWq_ff7K2M)
- Kéo xuống dưới và ấn vào nút "Download Now" 

- ![](/assets/images/forum/download-now.jpg)

- "No thanks, just take me to the download" 

- ![](/assets/images/forum/no-thank.jpg)

- Chọn phiên bản cần tải và tải thôi`);

	const { model, setVisibility } = useModel();
	const [tag, setTag] = useState<string>('');
	const [tags, setTags] = useState<TagChoiceLocal[]>([]);

	function handleRemoveTag(index: number) {
		setTags((prev) => [...prev.filter((_, i) => i !== index)]);
	}

	function handleAddTag(tag: TagChoiceLocal) {
		setTags((prev) => {
			let tags = prev.filter((q) => q !== tag);
			return [...tags, tag];
		});
		setTag('');
	}

	function handleSubmit() {}

	return (
		<main className='w100p h100p small-gap border-box'>
			<section className='editor-background relative flex-column w100p h100p small-gap massive-padding border-box'>
				<section className='flex-row small-gap w100p align-end'>
					<input className='title-editor w100p border-box' type='text' placeholder={i18n.t('title').toString()} value={title} onChange={(event) => setTitle(event.target.value)} />
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
				<textarea className='content-editor w100p h100p' value={content} onChange={(event) => setContent(event.target.value)} />
				<section className='flex-row absolute top right medium-margin small-gap'>
					<a className='button' href='https://vi.wikipedia.org/wiki/Markdown' target='_blank' rel='noreferrer'>
						<Trans i18nKey='how-to-write-markdown' />
					</a>
					<Button onClick={() => setVisibility(true)}>
						<Trans i18nKey='show-preview' />
					</Button>
				</section>
				<Button className='flex-row absolute bottom right medium-margin' onClick={() => handleSubmit()}>
					<Trans i18nKey='submit' />
				</Button>
			</section>
			{model(
				<section className='relative w100p h100p scroll-y'>
					<Markdown children={content} />
					<Button className='absolute top right medium-margin' onClick={() => setVisibility(false)}>
						<Trans i18nKey='hide-preview' />
					</Button>
				</section>,
			)}
		</main>
	);
}
