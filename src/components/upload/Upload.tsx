import './Upload.css';

import { ChangeEvent, useState } from 'react';
import { getFileExtension } from '../util/Util';

import UploadFile from './UploadFile';
import React from 'react';
import Api from '../../AxiosConfig';

const Upload = () => {
	const [file, setFile] = useState<UploadFile>();
	const [image, setImage] = useState<string>();
	const [imageState, setImageState] = useState<string>('Upload a file');

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target) return;

		let files = event.target.files;
		if (!files || files.length <= 0) return;

		let extension: string = getFileExtension(files[0]);

		if (extension === 'msch' || extension === 'msav') {
			setFile({ file: files[0], type: extension });
			const config = {
				headers: {
					'content-type': 'multipart/form-data'
				}
			};

			let formData = new FormData();
			formData.append('file', files[0]);
			formData.append('authorId', 'shar');
			formData.append('tags', '[0]');

			Api.post('schematics', formData, config)
				.then((result) => {})
				.catch((error) => console.log(error));
		} else {
			alert('Schematic file name must end with .msch');
		}
	}

	return (
		<div className='upload'>
			<div className='upload-model'>
				<div className='preview-container'>
					<div className='preview-image-container'>
						{image ? <img className='preview-image' src={image} alt={imageState}></img> : <div className='preview-image'>{imageState}</div>}
						<div className='upload-button-group'>
							<label className='upload-file-button' htmlFor='ufb'>
								Upload
							</label>
							<input id='ufb' type='file' style={{ display: 'none' }} onChange={(event) => handleFileChange(event)}></input>

						</div>
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
