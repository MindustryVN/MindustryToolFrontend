import './Upload.css';

import UploadFile from './UploadFile';
import SearchBar from '../shared/SearchBar';
import Dropbox from '../shared/Dropbox';
import React from 'react';
import Tag from '../shared/Tag';

import { MAP_FILE_EXTENSION, PNG_IMAGE_PREFIX, SCHEMATIC_FILE_EXTENSION } from '../../Config';
import { capitalize, getFileExtension } from '../util/Util';
import { ChangeEvent, useState } from 'react';
import { UPLOAD_SCHEMATIC_TAG } from '../schematic/Tag';
import { SearchIcon } from '../util/Icon';
import { API } from '../../AxiosConfig';

const UPLOAD_INVALID_EXTENSION = 'Invalid file extension';
const UPLOAD_NETWORK_ERROR = 'Network error try later';
const UPLOAD_SET_FILE = 'Upload a file';
const UPLOAD_UPLOAD = 'Upload';
const UPLOAD_INVALID_CODE = 'Invalid schematic code';
const UPlOAD_FAILED = 'Upload failed';
const UPlOAD_SUCCESSFULLY = 'Upload successfully';
const UPLOAD_NO_DATA = 'No schematic or map provided';

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

		let files = event.target.files;
		if (!files || files.length <= 0) return;

		let extension: string = getFileExtension(files[0]);

		if (extension === SCHEMATIC_FILE_EXTENSION || extension === MAP_FILE_EXTENSION) {
			setFile({ file: files[0], type: extension });
			setCode('');

			let endpoint = getApiEndpoint(extension);
			let form = new FormData();
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

		let str = event.target.value;
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
		let formData = new FormData();
		formData.append('authorId', 'Community');
		formData.append('tags', `[${query.map((q) => `${q.category}:${q.value}`).join()}]`);
		let endpoint;

		if (file !== undefined) {
			let currentFile = file.file;
			let extension = getFileExtension(currentFile);
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
					setUploadStatus(UPLOAD_SET_FILE);
					alert(UPlOAD_SUCCESSFULLY);
				})
				.catch((error) => {
					console.log(error);
					alert(`${UPlOAD_FAILED}: ${error.response.data.message}`);
				});
		} else {
			setUploadStatus(UPLOAD_INVALID_EXTENSION);
		}
	}

	function handleContentInput(event: ChangeEvent<HTMLInputElement>) {
		if (event) {
			let input = event.target.value;
			setContent(input.trim());
		}
	}

	function handleRemoveTag(index: number) {
		setQuery([...query.filter((_, i) => i !== index)]);
	}

	function handleAddTag() {
		if (query.find((q) => q.category.toLowerCase() === tag.category.toLowerCase()) !== undefined) {
			alert(capitalize(tag.category) + ' tag exists in your search query ');
			return;
		}

		if (tag.getValues() == null || (tag !== null && tag.getValues().find((c: string) => c === content) !== undefined)) {
			setQuery([...query, { category: tag.category, color: tag.color, value: content }]);
		} else alert('Invalid tag ' + tag.category + ': ' + content);
	}

	const tagSubmitButton = (
		<button
			title='submit'
			className='submit-button'
			onClick={(event) => {
				handleAddTag();
				event.stopPropagation();
			}}>
			<SearchIcon />
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
									{tag.getValues().map((content: string, index: number) => (
										<div key={index} onClick={() => setContent(content)}>
											{content}
										</div>
									))}
								</Dropbox>
							) : (
								<SearchBar placeholder='Search' value={content} onChange={handleContentInput} submitButton={tagSubmitButton} />
							)}
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
