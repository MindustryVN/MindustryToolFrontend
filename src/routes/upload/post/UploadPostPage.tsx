import 'src/styles.css';
import './UploadPostPage.css';

import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import useModel from 'src/hooks/UseModel';
import Button from 'src/components/button/Button';
import i18n from 'src/util/I18N';
import Dropbox from 'src/components/dropbox/Dropbox';
import TagPick from 'src/components/tag/TagPick';
import TagEditContainer from 'src/components/tag/TagEditContainer';
import PostView from 'src/components/post/PostView';
import useMe from 'src/hooks/UseMe';
import usePopup from 'src/hooks/UsePopup';
import { API } from 'src/API';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';

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

	const { me } = useMe();

	const [isLoading, setIsLoading] = useState(false);

	const { addPopup } = usePopup();

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

	function handleSubmit() {
		if (!title) {
			addPopup(i18n.t('no-title'), 5, 'error');
			return;
		}

		if (!content) {
			addPopup(i18n.t('no-content'), 5, 'error');
			return;
		}

		if (!tags || tags.length === 0) {
			addPopup(i18n.t('no-tag'), 5, 'error');
			return;
		}

		setIsLoading(true);

		API.postPost(title, content, tags) //
			.then(() => addPopup(i18n.t('post-success'), 10, 'info'))
			.catch(() => addPopup(i18n.t('post-fail'), 5, 'error'))
			.finally(() => setIsLoading(false));
	}

	if (isLoading) return <LoadingSpinner />;

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
					<PostView
						post={{
							id: '',
							authorId: me ? me.id : '',
							header: title,
							content: content,
							tags: Tags.toStringArray(tags),
							like: 0,
							time: new Date().toString(),
						}}
					/>
					<Button className='absolute top right medium-margin' onClick={() => setVisibility(false)}>
						<Trans i18nKey='hide-preview' />
					</Button>
				</section>,
			)}
		</main>
	);
}
