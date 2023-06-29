import './UploadSchematicPage.css';
import '../../styles.css';

import SchematicPreview from '../../components/common/schematic/SchematicPreview';
import UserData from '../../components/common/user/UserData';
import Dropbox from '../../components/common/dropbox/Dropbox';
import React, { useEffect } from 'react';

import { PNG_IMAGE_PREFIX, SCHEMATIC_FILE_EXTENSION } from '../../config/Config';
import { getFileExtension } from '../../util/StringUtils';
import { ChangeEvent, useState } from 'react';
import { Trans } from 'react-i18next';
import Tag, { CustomTag, TagChoice } from '../../components/common/tag/Tag';
import { API } from '../../API';
import { TagRemoveButton } from '../../components/common/button/TagRemoveButton';

const tabs = ['File', 'Code'];

const Upload = ({ user }: { user: UserData | undefined }) => {
	const [file, setFile] = useState<File>();
	const [code, setCode] = useState<string>('');
	const [preview, setPreview] = useState<SchematicPreview>();

	const [tag, setTag] = useState<string>('');

	const [tags, setTags] = useState<TagChoice[]>([]);

	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);

	const [schematicUploadTag, setSchematicUploadTag] = useState<Array<TagChoice>>([]);

	useEffect(() => getSchematicUploadTag(), []);

	function getSchematicUploadTag() {
		API.REQUEST.get('tag/schematic-upload-tag') //
			.then((result) => {
				let customTagList: Array<CustomTag> = result.data;
				let tagChoiceList: Array<TagChoice> = [];
				let temp = customTagList.map((customTag) => customTag.value.map((v) => new TagChoice(customTag.name, v, customTag.color)));

				temp.forEach((t) => t.forEach((r) => tagChoiceList.push(r)));
				setSchematicUploadTag(tagChoiceList);
			});
	}

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target) return;

		const files = event.target.files;
		if (!files || files.length <= 0) return;

		const extension: string = getFileExtension(files[0]);

		if (extension !== SCHEMATIC_FILE_EXTENSION) return;

		setFile(files[0]);
		setCode('');

		const form = new FormData();
		form.delete('code');
		form.append('file', files[0]);

		getPreview(form);
	}

	function handleCodeChange() {
		navigator.clipboard.readText().then((text) => {
			if (!text.startsWith('bXNja')) return;
			if (text === code) return;

			setCode(text);
			setFile(undefined);

			const form = new FormData();
			form.delete('file');
			form.append('code', text);

			getPreview(form);
		});
	}

	function getPreview(form: FormData) {
		API.REQUEST.post('schematic/preview', form) //
			.then((result) => setPreview(result.data));
	}

	function handleSubmit() {
		if (tags === null || tags.length === 0) {
			alert('No tags provided');
			return;
		}
		const formData = new FormData();
		const tagString = `${tags.map((t) => `${t.name}:${t.value}`).join()}`;

		formData.append('tags', tagString);

		if (file && getFileExtension(file) === SCHEMATIC_FILE_EXTENSION) formData.append('file', file);
		else if (code !== undefined && code.length > 8) formData.append('code', code);
		else return;

		API.REQUEST.post('schematic-upload', formData)
			.then(() => {
				setCode('');
				setFile(undefined);
				setPreview(undefined);
				setTags([]);
				alert('UPLOAD SUCCESSFULLY');
			})
			.catch((error) => {
				if (error.response && error.response.data) alert(`"UPLOAD FAILED: ${error.response.data.message}`);
			});
	}

	function handleRemoveTag(index: number) {
		setTags([...tags.filter((_, i) => i !== index)]);
	}

	function handleAddTag(tag: TagChoice) {
		if (!tag) return;

		tags.filter((q) => q.name !== tag.name);
		setTags([...tags, tag]);
		setTag('');
	}

	function renderTab(currentTab: string) {
		switch (currentTab) {
			case tabs[0]:
				return (
					<div>
						<label className='button' htmlFor='ufb'>
							Upload a file
						</label>
						<input id='ufb' type='file' onChange={(event) => handleFileChange(event)} />
					</div>
				);

			case tabs[1]:
				return (
					<div>
						<label className='button' htmlFor='ub'>
							Copy from clipboard
						</label>
						<button id='ufb' className='button' type='button' onClick={() => handleCodeChange()}></button>
					</div>
				);

			default:
				return <>No tab</>;
		}
	}

	return (
		<div className='upload'>
			<div className='upload-model'>
				<div className='preview-container '>
					<div className='upload-button flexbox-column medium-gap'>
						<div className='flexbox-center'>
							<section className='grid-row small-gap  light-border small-padding'>
								{tabs.map((name, index) => (
									<button className={currentTab === name ? 'button-active' : 'button'} key={index} type='button' onClick={() => setCurrentTab(name)}>
										{name}
									</button>
								))}
							</section>
						</div>
						<div className='flexbox-center'>{renderTab(currentTab)}</div>
						<div className='preview-image-container'>{preview && <img className='preview-image' src={PNG_IMAGE_PREFIX + preview.image} alt='Upload a file' />}</div>
					</div>
					<div className='upload-description-container'>
						{preview && (
							<div className='flexbox-column text-center'>
								{<div>Author: {user ? user.name : 'community'}</div>}
								<div>Name: {preview.name}</div>
								{preview.description && <p> {preview.description}</p>}
								{preview.requirement && (
									<section className='text-center small-gap'>
										{preview.requirement.map((r, index) => (
											<span key={index} className='text-center'>
												<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
												<span> {r.amount} </span>
											</span>
										))}
									</section>
								)}
							</div>
						)}
						<div className='upload-search-container'>
							<Dropbox
								placeholder='Add tags'
								value={tag}
								items={schematicUploadTag.filter((t) => (t.name.includes(tag) || t.value.includes(tag)) && !tags.includes(t))}
								onChange={(event) => setTag(event.target.value)}
								onChoose={(item) => handleAddTag(item)}
								converter={(t, index) => (
									<span key={index}>
										<Trans i18nKey={t.name} /> : <Trans i18nKey={t.value} />
									</span>
								)}
							/>

							<div className='flexbox-row flex-wrap medium-gap'>
								{tags.map((t: TagChoice, index: number) => (
									<Tag key={index} tag={t} removeButton={<TagRemoveButton callback={() => handleRemoveTag(index)} />} />
								))}
							</div>
						</div>
						<section className='flexbox-center'>
							<button className='button' type='button' onClick={() => handleSubmit()}>
								Upload
							</button>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Upload;
