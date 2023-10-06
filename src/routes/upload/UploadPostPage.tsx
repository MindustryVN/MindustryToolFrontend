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

	const addPopup = usePopup();

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
		<section className='box-border h-full w-full gap-2 rounded-lg bg-slate-900 p-4'>
			<section className='box-border flex h-full w-full flex-col gap-2'>
				<section className='flex w-full flex-col gap-2'>
					<section className='flex flex-row justify-end gap-2'>
						<a className='rounded-lg border-2 border-slate-500 bg-slate-900 px-2 py-1' href='https://vi.wikipedia.org/wiki/Markdown' target='_blank' rel='noreferrer'>
							<Trans i18nKey='how-to-write-markdown' />
						</a>
						<Button className='bg-slate-900 px-2 py-1' title={i18n.t('show-preview')} onClick={() => setVisibility(true)}>
							<Trans i18nKey='show-preview' />
						</Button>
					</section>
					<input
						className='h-full min-h-[40px] w-full bg-slate-900 outline-none'
						type='text'
						placeholder={i18n.t('title').toString()}
						value={title}
						onChange={(event) => setTitle(event.target.value)}
					/>
					<SearchBox
						className='h-20 w-full bg-slate-900'
						placeholder={i18n.t('add-tag').toString()}
						value={tag}
						items={postUploadTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						mapper={(t, index) => <TagPick key={index} tag={t} />}
					/>
				</section>
				<TagEditContainer tags={tags} onRemove={handleRemoveTag} />
				<textarea className='h-full w-full bg-slate-900 outline-none' value={content} onChange={(event) => setContent(event.target.value)} />
				<div className='flex flex-row justify-end'>
					<Button className='px-2 py-1' title={i18n.t('submit')} onClick={() => handleSubmit()}>
						<Trans i18nKey='submit' />
					</Button>
				</div>
			</section>
			{model(
				<section className='flex h-full w-full flex-col overflow-y-auto p-4'>
					<Button title={i18n.t('hide-preview')} className='self-end bg-slate-900 px-2 py-1' onClick={() => setVisibility(false)}>
						<Trans i18nKey='hide-preview' />
					</Button>
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
				</section>,
			)}
		</section>
	);
}
