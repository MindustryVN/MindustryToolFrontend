import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { TagChoice, Tags } from 'src/components/Tag';
import useModel from 'src/hooks/UseModel';
import Button from 'src/components/Button';
import i18n from 'src/util/I18N';
import SearchBox from 'src/components/Searchbox';
import TagPick from 'src/components/TagPick';
import TagEditContainer from 'src/components/TagEditContainer';
import PostView from 'src/components/PostView';
import { useMe } from 'src/context/MeProvider';
import { usePopup } from 'src/context/PopupMessageProvider';
import { API } from 'src/API';
import LoadingSpinner from 'src/components/LoadingSpinner';
import { useTags } from 'src/context/TagProvider';

const defaultContent = `> ## Cách để tải mindustry free
- Ấn vào link bên dưới để đến trang tải xuống (Itch.io) [Link tải Mindustry free cho Window, Linux, MacOS, Android (Và tất nhiên là không có IOS)](https://anuke.itch.io/mindustry?fbclid=IwAR2HgdkixMrQEDhcj1an_qtWnnq6YmOlm-c8VoyPsNp5bMtu5aWq_ff7K2M)
- Kéo xuống dưới và ấn vào nút "Download Now" 

- ![](/assets/images/post/download-now.jpg)

- "No thanks, just take me to the download" 

- ![](/assets/images/post/no-thank.jpg)

- Chọn phiên bản cần tải và tải thôi`;

export default function UploadPostPage() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState(defaultContent);

	const { model, setVisibility } = useModel();

	const [tag, setTag] = useState<string>('');
	const [tags, setTags] = useState<TagChoice[]>([]);

	const { me } = useMe();

	const [isLoading, setIsLoading] = useState(false);
	const { postUploadTag } = useTags();

	const { addPopup } = usePopup();

	function handleRemoveTag(index: number) {
		setTags((prev) => [...prev.filter((_, i) => i !== index)]);
	}

	function handleAddTag(tag: TagChoice) {
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
			.then(() => handleSubmitSuccess())
			.catch(() => addPopup(i18n.t('post-fail'), 5, 'error'))
			.finally(() => setIsLoading(false));
	}

	function handleSubmitSuccess() {
		setContent('');
		setTitle('');
		setTag('');
		setTags([]);
	}

	if (isLoading) return <LoadingSpinner />;

	return (
		<main className='box-border h-full w-full gap-2'>
			<section className='editor-background relative box-border flex h-full w-full flex-row gap-2 p-8'>
				<section className='align-end flex w-full flex-row gap-2'>
					<input className='box-border w-full' type='text' placeholder={i18n.t('title').toString()} value={title} onChange={(event) => setTitle(event.target.value)} />
					<SearchBox
						placeholder={i18n.t('add-tag').toString()}
						value={tag}
						items={postUploadTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						mapper={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<TagEditContainer tags={tags} onRemove={handleRemoveTag} />
				<textarea className=' h-full w-full' value={content} onChange={(event) => setContent(event.target.value)} />
				<section className='right absolute top-0 m-2 flex flex-row gap-2'>
					<a className='button' href='https://vi.wikipedia.org/wiki/Markdown' target='_blank' rel='noreferrer'>
						<Trans i18nKey='how-to-write-markdown' />
					</a>
					<Button title={i18n.t('show-preview')} onClick={() => setVisibility(true)}>
						<Trans i18nKey='show-preview' />
					</Button>
				</section>
				<Button className='bottom right absolute m-2 flex flex-row' title={i18n.t('submit')} onClick={() => handleSubmit()}>
					<Trans i18nKey='submit' />
				</Button>
			</section>
			{model(
				<section className='relative h-full w-full overflow-y-auto'>
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
					<Button className='right absolute top-0 m-2' title={i18n.t('hide-preview')} onClick={() => setVisibility(false)}>
						<Trans i18nKey='hide-preview' />
					</Button>
				</section>,
			)}
		</main>
	);
}
