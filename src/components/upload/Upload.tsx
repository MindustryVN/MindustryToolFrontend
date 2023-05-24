import './Upload.css';

import UploadFile from './UploadFile';
import SearchBar from '../shared/SearchBar';
import TagQuery from '../shared/TagQuery';
import Dropbox from '../shared/Dropbox';
import React from 'react';
import Tag, { TagChoice, UPLOAD_SCHEMATIC_TAG } from '../shared/Tag';

import { MAP_FILE_EXTENSION, PNG_IMAGE_PREFIX, SCHEMATIC_FILE_EXTENSION } from '../../Config';
import { capitalize, getFileExtension } from '../shared/Util';
import { ChangeEvent, useState } from 'react';
import { API } from '../../AxiosConfig';

const UPLOAD_INVALID_EXTENSION = 'Invalid file extension';
const UPLOAD_NETWORK_ERROR = 'Network error try later';
const UPlOAD_SUCCESSFULLY = 'Upload successfully';
const UPLOAD_INVALID_CODE = 'Invalid schematic code';
const UPLOAD_SET_FILE = 'Upload a file';
const UPLOAD_NO_DATA = 'No schematic or map provided';
const UPlOAD_FAILED = 'Upload failed';
const UPLOAD_UPLOAD = 'Upload';

const config = {
	headers: {
		'content-type': 'multipart/form-data'
	}
};

const Upload = () => {
	const [file, setFile] = useState<UploadFile>();
	const [code, setCode] = useState<string>('');
	const [image, setImage] = useState<string>();
	const [uploadStatus, setUploadStatus] = useState(UPLOAD_SET_FILE);

	const [tag, setTag] = useState(UPLOAD_SCHEMATIC_TAG[0]);
	const [content, setContent] = useState('');
	const [query, setQuery] = useState<TagQuery[]>([]);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target) return;

		const files = event.target.files;
		if (!files || files.length <= 0) return;

		const extension: string = getFileExtension(files[0]);

		if (extension === SCHEMATIC_FILE_EXTENSION || extension === MAP_FILE_EXTENSION) {
			setFile({ file: files[0], type: extension });
			setCode('');

			const endpoint = getApiEndpoint(extension);
			const form = new FormData();
			form.append('file', files[0]);
			if (endpoint) {
				API.post(endpoint + '/preview', form, config)
					.then((result) => {
						setImage(result.data);
						setUploadStatus(UPLOAD_UPLOAD);
					})
					.catch(() => {
						setUploadStatus(UPLOAD_NETWORK_ERROR);
					});
			} else setUploadStatus(UPLOAD_INVALID_EXTENSION);
		} else {
			setUploadStatus(UPLOAD_INVALID_EXTENSION);
		}
	}

	function handleCodeChange(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target) return;

		const str = event.target.value;
		if (!str.startsWith('bXNja')) {
			setUploadStatus(UPLOAD_INVALID_CODE);
			return;
		}

		setCode(str);
		setFile(undefined);

		API.get('/schematics/preview', { params: { code: str } })
			.then((result) => {
				setImage(result.data);
				setUploadStatus(UPLOAD_UPLOAD);
			})
			.catch(() => {
				setUploadStatus(UPLOAD_NETWORK_ERROR);
			});
	}

	function getApiEndpoint(fileExtension: string) {
		if (fileExtension === SCHEMATIC_FILE_EXTENSION) return 'schematics';
		else if (fileExtension === MAP_FILE_EXTENSION) return 'maps';
	}

	function handleSubmit() {
		const formData = new FormData();
		formData.append('authorId', 'Community');
		formData.append('tags', `${query.map((q) => `${q.toString()}`).join()}`);
		let endpoint;

		if (file !== undefined) {
			const currentFile = file.file;
			const extension = getFileExtension(currentFile);
			if (extension === 'msch' || extension === 'msav') {
				setFile({ file: currentFile, type: extension });
				formData.append('file', currentFile);
				endpoint = getApiEndpoint(extension);
			}
		} else if (code !== undefined && code.length > 8) {
			formData.append('code', code);
			endpoint = 'schematics';
		} else {
			setUploadStatus(UPLOAD_NO_DATA);
			return;
		}

		if (endpoint) {
			API.post(endpoint, formData, config)
				.then(() => {
					setCode('');
					setFile(undefined);
					setImage(undefined);
					setQuery([]);
					setUploadStatus(UPLOAD_SET_FILE);
					alert(UPlOAD_SUCCESSFULLY);
				})
				.catch((error) => {
					if (error.response && error.response.data) alert(`${UPlOAD_FAILED}: ${error.response.data.message}`);
				});
		} else {
			setUploadStatus(UPLOAD_INVALID_EXTENSION);
		}
	}

	function handleContentInput(event: ChangeEvent<HTMLInputElement>) {
		if (event) {
			const input = event.target.value;
			setContent(input.trim());
		}
	}

	function handleRemoveTag(index: number) {
		setQuery([...query.filter((_, i) => i !== index)]);
	}

	function handleAddTag() {
		const q = query.filter((q) => q.category !== tag.category);
		const v = tag.getValues();

		if (v === null || (v !== null && v.find((c: TagChoice) => c.value === content) !== undefined)) {
			setQuery([...q, new TagQuery(tag.category, tag.color, content)]);
		} else alert('Invalid tag ' + tag.category + ': ' + content);
	}

	const tagSubmitButton = (
		<button
			title='Add'
			className='submit-button'
			onClick={(event) => {
				handleAddTag();
				event.stopPropagation();
			}}>
			<img src='/assets/icons/check.png' alt='check' />
		</button>
	);

	return (
		<div className='upload'>
			<div className='upload-model'>
				<div className='preview-container'>
					<div className='preview-image-container'>
						<label htmlFor='ufb'>
							{image ? <img className='preview-image' src={PNG_IMAGE_PREFIX + image} alt='Upload a file'></img> : <div className='preview-image'>Upload a file</div>}
							<input id='ufb' type='file' onChange={(event) => handleFileChange(event)}></input>
						</label>
						<input className='upload-code-button' placeholder='Code' value={code} onChange={handleCodeChange} />
					</div>
					<div className='upload-description-container'>
						<div className='search-container'>
							<Dropbox value={'Tag: ' + tag.category}>
								{UPLOAD_SCHEMATIC_TAG.filter((t) => !query.find((q) => q.category === t.category)).map((t, index) => (
									<div
										key={index}
										onClick={() => {
											setTag(t);
											setContent('');
										}}>
										{t.category}
									</div>
								))}
							</Dropbox>
							{tag.hasOption() ? (
								<Dropbox value={'Value: ' + content} submitButton={tagSubmitButton}>
									{tag.getValues().map((content: { name: string; value: string }, index: number) => (
										<div key={index} onClick={() => setContent(content.value)}>
											{content.name}
										</div>
									))}
								</Dropbox>
							) : (
								<SearchBar placeholder='Search' value={content} onChange={handleContentInput} submitButton={tagSubmitButton} />
							)}
							Tag:
							<div className='tag-container'>
								{query.map((t: TagQuery, index: number) => (
									<Tag key={index} index={index} name={t.category} value={t.value} color={t.color} onRemove={handleRemoveTag} />
								))}
							</div>
						</div>
						<div className='upload-button-group'>
							<button className='upload-file-button' onClick={() => handleSubmit()}>
								{uploadStatus}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Upload;
