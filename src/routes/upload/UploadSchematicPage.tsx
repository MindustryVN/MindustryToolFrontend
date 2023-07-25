import './UploadSchematicPage.css';
import 'src/styles.css';
import 'src/components/schematic/SchematicInfoImage.css';

import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import Dropbox from 'src/components/dropbox/Dropbox';
import SchematicPreviewData from 'src/components/schematic/SchematicUploadPreview';
import { TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import { PNG_IMAGE_PREFIX, SCHEMATIC_FILE_EXTENSION } from 'src/config/Config';
import i18n from 'src/util/I18N';
import { getFileExtension } from 'src/util/StringUtils';
import { PopupMessageContext } from 'src/context/PopupMessageProvider';
import { Link } from 'react-router-dom';
import TagPick from 'src/components/tag/TagPick';
import { Trans } from 'react-i18next';
import Button from 'src/components/button/Button';
import TagEditContainer from 'src/components/tag/TagEditContainer';
import IfTrue from 'src/components/common/IfTrue';
import LoadUserName from 'src/components/user/LoadUserName';
import SchematicDescription from 'src/components/schematic/SchematicDescription';
import SchematicRequirement from 'src/components/schematic/SchematicRequirement';
import ColorText from 'src/components/common/ColorText';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import useMe from 'src/hooks/UseMe';

const tabs = ['File', 'Code'];

let notLoginMessage = (
	<span>
		<Trans i18nKey='recommend-login' />
		<Link className='small-padding' to='/login'>
			<Trans i18nKey='login' />
		</Link>
	</span>
);

export default function UploadPage() {
	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);
	const [file, setFile] = useState<File>();
	const [code, setCode] = useState<string>('');
	const [preview, setPreview] = useState<SchematicPreviewData>();
	const [tag, setTag] = useState<string>('');
	const [tags, setTags] = useState<TagChoiceLocal[]>([]);

	const [isLoading, setIsLoading] = useState(false);

	const { me, loading } = useMe();
	const popup = useRef(useContext(PopupMessageContext));

	useEffect(() => {
		if (!loading && !me) popup.current.addPopup(notLoginMessage, 20, 'warning');
	}, [me, loading]);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (!files || files.length <= 0) {
			popup.current.addPopup(i18n.t('invalid-schematic-file'), 5, 'error');
			return;
		}

		const extension: string = getFileExtension(files[0]);

		if (extension !== SCHEMATIC_FILE_EXTENSION) {
			popup.current.addPopup(i18n.t('invalid-schematic-file'), 5, 'error');
			return;
		}

		setFile(files[0]);
		setCode('');

		const form = new FormData();
		form.delete('code');
		form.append('file', files[0]);

		getPreview(form);
	}

	function handleCodeChange() {
		navigator.clipboard
			.readText() //
			.then((text) => {
				if (!text.startsWith('bXNja')) {
					popup.current.addPopup(i18n.t('not-schematic-code'), 5, 'warning');
					return;
				}

				setCode(text);
				setFile(undefined);

				const form = new FormData();
				form.delete('file');
				form.append('code', text);

				getPreview(form);
			});
	}

	function getPreview(form: FormData) {
		setIsLoading(true);
		API.REQUEST.post('schematic-upload/preview', form) //
			.then((result) => setPreview(result.data)) //
			.catch((error) => popup.current.addPopup(i18n.t(`message.invalid-schematic`) + JSON.stringify(error), 10, 'error')) //
			.finally(() => setIsLoading(false));
	}

	function handleSubmit() {
		if (!file && !code) {
			popup.current.addPopup(i18n.t('no-data'), 5, 'error');
			return;
		}

		if (!tags || tags.length === 0) {
			popup.current.addPopup(i18n.t('no-tag'), 5, 'error');
			return;
		}
		const formData = new FormData();
		const tagString = Tags.toString(tags);

		formData.append('tags', tagString);

		if (file) formData.append('file', file);
		else formData.append('code', code);

		setIsLoading(true);

		API.REQUEST.post('schematic-upload', formData)
			.then(() => {
				setCode('');
				setFile(undefined);
				setPreview(undefined);
				setTags([]);
				popup.current.addPopup(i18n.t('upload-success'), 10, 'info');
			})
			.catch((error) => popup.current.addPopup(i18n.t('upload-fail') + ' ' + i18n.t(`message.${error.response.data}`), 10, 'error')) //
			.finally(() => setIsLoading(false));
	}

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

	function renderTab(currentTab: string) {
		switch (currentTab) {
			case tabs[0]:
				return (
					<section>
						<label className='button' htmlFor='ufb'>
							<Trans i18nKey='upload-a-file' />
						</label>
						<input id='ufb' type='file' onChange={(event) => handleFileChange(event)} />
					</section>
				);

			case tabs[1]:
				return (
					<section>
						<Button onClick={() => handleCodeChange()}>
							<Trans i18nKey='copy-from-clipboard' />
						</Button>
					</section>
				);

			default:
				return <>No tab</>;
		}
	}

	function checkUploadRequirement() {
		if (!file && !code) return <Trans i18nKey='no-data' />;
		if (!tags || tags.length === 0) return <Trans i18nKey='no-tag' />;

		return <Trans i18nKey='ok' />;
	}

	if (isLoading) return <LoadingSpinner />;

	return (
		<main className='flex-column space-between w100p h100p small-gap massive-padding border-box scroll-y'>
			<header className='flex-column medium-gap'>
				<section className='flex-center'>
					<section className='grid-row small-gap small-padding'>
						{tabs.map((name, index) => (
							<Button key={index} onClick={() => setCurrentTab(name)}>
								{name}
							</Button>
						))}
					</section>
				</section>
				<section className='flex-center'>{renderTab(currentTab)}</section>
			</header>
			<IfTrue
				condition={preview}
				whenTrue={
					preview && (
						<section className='flex-row flex-wrap medium-gap'>
							<img className='schematic-info-image' src={PNG_IMAGE_PREFIX + preview.image} alt='Error' />
							<section className='flex-column space-between'>
								<section className='flex-column small-gap flex-wrap'>
									<ColorText className='capitalize h2' text={preview.name} />
									<Trans i18nKey='author' /> <LoadUserName userId={me ? me.id : 'community'} />
									<SchematicDescription description={preview.description} />
									<SchematicRequirement requirement={preview.requirement} />
									<TagEditContainer tags={tags} onRemove={(index) => handleRemoveTag(index)} />
								</section>
							</section>
							<section className='flex-column flex-nowrap small-gap w100p'>
								<Dropbox
									placeholder={i18n.t('add-tag').toString()}
									value={tag}
									items={Tags.SCHEMATIC_UPLOAD_TAG.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
									onChange={(event) => setTag(event.target.value)}
									onChoose={(item) => handleAddTag(item)}
									mapper={(t, index) => <TagPick key={index} tag={t} />}
								/>
							</section>
						</section>
					)
				}
			/>
			<footer className='flex-column center small-gap medium-padding'>
				<span children={checkUploadRequirement()} />
				<Button onClick={() => handleSubmit()}>
					<Trans i18nKey='upload' />
				</Button>
			</footer>
		</main>
	);
}
