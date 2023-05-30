import './UploadSchematicPage.css';
import '../../styles.css';

import SchematicPreview from '../schematic/SchematicPreview';
import SearchBar from '../common/SearchBar';
import TagQuery from '../common/TagQuery';
import Dropbox from '../common/Dropbox';
import React from 'react';

import { PNG_IMAGE_PREFIX, SCHEMATIC_FILE_EXTENSION } from '../../config/Config';
import Tag, { TagChoice, UPLOAD_SCHEMATIC_TAG } from '../common/Tag';
import { capitalize, getFileExtension } from '../../util/StringUtils';
import { ChangeEvent, useState } from 'react';
import { API } from '../../AxiosConfig';

const config = {
	headers: {
		'content-type': 'multipart/form-data'
	}
};

const Upload = ({ user }: { user: UserInfo | undefined }) => {
	const [file, setFile] = useState<File>();
	const [code, setCode] = useState<string>('');
	const [preview, setPreview] = useState<SchematicPreview>();

	const [tag, setTag] = useState(UPLOAD_SCHEMATIC_TAG[0]);
	const [content, setContent] = useState('');
	const [tags, setTags] = useState<TagQuery[]>([]);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target) return;

		const files = event.target.files;
		if (!files || files.length <= 0) return;

		const extension: string = getFileExtension(files[0]);

		if (extension === SCHEMATIC_FILE_EXTENSION) {
			setFile(files[0]);
			setCode('');

			const form = new FormData();
			form.append('file', files[0]);

			API.post('schematics/preview', form, config)
				.then((result) => setPreview(result.data))
				.catch(() => {});
		}
	}

	function handleCodeChange(event: ChangeEvent<HTMLTextAreaElement>) {
		if (!event.target) return;

		const str = event.target.value;
		setCode(str);
		if (!str.startsWith('bXNja')) {
			return;
		}

		setFile(undefined);

		API.get('/schematics/preview', { params: { code: str } })
			.then((result) => setPreview(result.data))
			.catch(() => {});
	}

	function handleSubmit() {
		if (tags === null || tags.length === 0) {
			alert('No tags provided');
			return;
		}

		const formData = new FormData();
		const authorId = user ? user.id : 'community';
		formData.append('authorId', authorId);
		formData.append('tags', `${tags.map((q) => `${q.toString()}`).join()}`);

		if (tag)
			if (file) {
				const extension = getFileExtension(file);
				if (extension === SCHEMATIC_FILE_EXTENSION) {
					setFile(file);
					formData.append('file', file);
				}
			} else if (code !== undefined && code.length > 8) {
				formData.append('code', code);
			} else {
				return;
			}

		API.post('schematics', formData, config)
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

	function handleContentInput(event: ChangeEvent<HTMLInputElement>) {
		if (event) {
			const input = event.target.value;
			setContent(input.trim());
		}
	}

	function handleRemoveTag(index: number) {
		setTags([...tags.filter((_, i) => i !== index)]);
	}

	function handleAddTag() {
		const q = tags.filter((q) => q.category !== tag.category);
		const v = tag.getValues();

		if (v === null || (v !== null && v.find((c: TagChoice) => c.value === content) !== undefined)) {
			setTags([...q, new TagQuery(tag.category, tag.color, content)]);
		} else alert('Invalid tag ' + tag.category + ': ' + content);
	}

	const tagSubmitButton = (
		<button
			className='button-transparent'
			title='Add'
			type='button'
			onClick={(event) => {
				handleAddTag();
				event.stopPropagation();
			}}>
			<img src='/assets/icons/check.png' alt='check' />
		</button>
	);

	let tagValue = tag.getValues();
	tagValue = tagValue == null ? [] : tagValue;

	return (
		<div className='upload flexbox-center image-background'>
			<div className='upload-model flexbox-center'>
				<div className='preview-container dark-background flexbox-center'>
					<div className='preview-image-container'>
						<label htmlFor='ufb'>
							{preview ? <img className='preview-image' src={PNG_IMAGE_PREFIX + preview.image} alt='Upload a file'></img> : <div className='preview-image'>Upload a file</div>}
							<input id='ufb' type='file' onChange={(event) => handleFileChange(event)}></input>
						</label>
						<textarea className='upload-code-area' placeholder='Code' value={code} onChange={handleCodeChange} />
					</div>
					<div className='upload-description-container flexbox-center'>
						{preview && (
							<div>
								{<span>Author: {user ? user.name : 'community'}</span>}
								<br />
								<span>Name: {preview.name}</span>
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
							<Dropbox value={'Tag: ' + capitalize(tag.category)}>
								{UPLOAD_SCHEMATIC_TAG.filter((t) => !tags.find((q) => q.category === t.category)).map((t, index) => (
									<div
										key={index}
										onClick={() => {
											setTag(t);
											setContent('');
										}}>
										{capitalize(t.category)}
									</div>
								))}
							</Dropbox>
							{tag.hasOption() ? (
								<Dropbox value={'Value: ' + capitalize(content)} submitButton={tagSubmitButton}>
									{tagValue.map((content: { name: string; value: string }, index: number) => (
										<div key={index} onClick={() => setContent(content.value)}>
											{capitalize(content.name)}
										</div>
									))}
								</Dropbox>
							) : (
								<SearchBar placeholder='Search' value={content} onChange={handleContentInput} submitButton={tagSubmitButton} />
							)}
							<div className='tag-container'>
								{tags.map((t: TagQuery, index: number) => (
									<Tag
										key={index}
										index={index}
										name={t.category}
										value={t.value}
										color={t.color}
										removeButton={
											<div className='remove-tag-button button-transparent' onClick={() => handleRemoveTag(index)}>
												<img src='/assets/icons/quit.png' alt='quit'></img>
											</div>
										}
									/>
								))}
							</div>
						</div>
						<div className='flexbox-center'>
							<button className='upload-file-button' type='button' onClick={() => handleSubmit()}>
								Upload
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Upload;
