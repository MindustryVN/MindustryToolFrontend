import './Upload.css';

import { ChangeEvent, useState } from 'react';
import { getFileExtension } from '../util/Util';

import UploadFile from './UploadFile';
import React from 'react';
import Api from '../../AxiosConfig';
import { MAP_FILE_EXTENSION, PNG_IMAGE_PREFIX, SCHEMATIC_FILE_EXTENSION } from '../../Config';

const UPLOAD_SET_FILE = 'Upload a file';
const UPLOAD_INVALID_EXTENSION = 'Invalid file extension';
const UPLOAD_UPLOAD = 'Upload';
const UPLOAD_NETWORK_ERROR = 'Network error try later';

const config = {
	headers: {
		'content-type': 'multipart/form-data'
	}
};

const Upload = () => {
	const [file, setFile] = useState<UploadFile>();
	const [image, setImage] = useState<string>();
	const [imageState, setImageState] = useState<string>('Upload a file');
	const [uploadStatus, setUploadStatus] = useState(UPLOAD_SET_FILE);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target) return;

		let files = event.target.files;
		if (!files || files.length <= 0) return;

		let extension: string = getFileExtension(files[0]);

		if (extension === SCHEMATIC_FILE_EXTENSION || extension === MAP_FILE_EXTENSION) {
			setFile({ file: files[0], type: extension });
			let endpoint = getApiEndpoint(extension);
			let form = new FormData();
			form.append('file', files[0]);
			if (endpoint) {
				Api.post(endpoint + '/preview', form, config)
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

	function getApiEndpoint(fileExtension: string) {
		if (fileExtension === SCHEMATIC_FILE_EXTENSION) return 'schematics';
		else if (fileExtension === MAP_FILE_EXTENSION) return 'maps';
	}

	function handleFileSubmit() {
		if (!file) return;
		let currentFile = file.file;
		let extension: string = getFileExtension(currentFile);

		if (extension === 'msch' || extension === 'msav') {
			setFile({ file: currentFile, type: extension });

			let formData = new FormData();
			formData.append('file', currentFile);
			formData.append('authorId', 'shar');
			formData.append('tags', '[0]');

			let endpoint = getApiEndpoint(extension);
			if (endpoint) {
				Api.post(endpoint, formData, config)
					.then(() => setUploadStatus(UPLOAD_UPLOAD))
					.catch(() => setUploadStatus(UPLOAD_INVALID_EXTENSION));
			} else {
				setUploadStatus(UPLOAD_INVALID_EXTENSION);
			}
		}
	}

	return (
		<div className='upload'>
			<div className='upload-model'>
				<div className='preview-container'>
					<div className='preview-image-container'>
						<label htmlFor='ufb'>
							{image ? <img className='preview-image' src={PNG_IMAGE_PREFIX + image} alt={imageState}></img> : <div className='preview-image'>{imageState}</div>}
							<input id='ufb' type='file' style={{ display: 'none' }} onChange={(event) => handleFileChange(event)}></input>
						</label>
						{uploadStatus !== 'Set File' && (
							<div className='upload-button-group'>
								<button className='upload-file-button' onClick={() => handleFileSubmit()}>
									{uploadStatus}
								</button>
							</div>
						)}
					</div>
					<div className='upload-description-container'>
						<div>Name: Shar</div>
						<div>Tags: bruh bruh lmao</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Upload;
