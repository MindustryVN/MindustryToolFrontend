import 'src/styles.css';
import './UploadSchematicPage.css';

import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import ClearIconButton from 'src/components/button/ClearIconButton';
import Dropbox from 'src/components/dropbox/Dropbox';
import SchematicPreviewData from 'src/components/schematic/SchematicUploadPreview';
import Tag, { TagChoiceLocal } from 'src/components/tag/Tag';
import { PNG_IMAGE_PREFIX, SCHEMATIC_FILE_EXTENSION } from 'src/config/Config';
import i18n from 'src/util/I18N';
import { getFileExtension } from 'src/util/StringUtils';
import { UserContext } from 'src/components/provider/UserProvider';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import { Link } from 'react-router-dom';
import TagPick from 'src/components/tag/TagPick';

export default function Upload() {
	const tabs = ['File', 'Code'];

	const [file, setFile] = useState<File>();
	const [code, setCode] = useState<string>('');

	const [preview, setPreview] = useState<SchematicPreviewData>();

	const [tag, setTag] = useState<string>('');
	const [tags, setTags] = useState<TagChoiceLocal[]>([]);

	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);

	const { user } = useContext(UserContext);

	const popup = useRef(useContext(PopupMessageContext));

	useEffect(() => {
		if (user) return;

		popup.current.addPopupMessage({
			message: (
				<span>
					{i18n.t('upload.login')}
					<Link className="small-padding" to="/login">
						Login
					</Link>
				</span>
			),
			duration: 20,
			type: 'warning',
		});
	}, [user]);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (!files || files.length <= 0) {
			popup.current.addPopupMessage({
				message: i18n.t('upload.invalid-schematic-file'),
				duration: 5,
				type: 'error',
			});
			return;
		}

		const extension: string = getFileExtension(files[0]);

		if (extension !== SCHEMATIC_FILE_EXTENSION) {
			popup.current.addPopupMessage({
				message: i18n.t('upload.invalid-schematic-file'),
				duration: 5,
				type: 'error',
			});
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
					popup.current.addPopupMessage({
						message: i18n.t('upload.not-schematic-code'),
						duration: 5,
						type: 'warning',
					});
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
		API.REQUEST.post('schematic-upload/preview', form) //
			.then((result) => setPreview(result.data)) //
			.catch((error) =>
				popup.current.addPopupMessage({
					message: i18n.t(`upload.invalid-schematic`) + JSON.stringify(error),
					duration: 10,
					type: 'error',
				}),
			);
	}

	function handleSubmit() {
		if (!file && !code) {
			popup.current.addPopupMessage({
				message: i18n.t('upload.no-data'),
				duration: 5,
				type: 'error',
			});
			return;
		}

		if (tags === null || tags.length === 0) {
			popup.current.addPopupMessage({
				message: i18n.t('upload.no-tag'),
				duration: 5,
				type: 'error',
			});
			return;
		}
		const formData = new FormData();
		const tagString = TagChoiceLocal.toString(tags);

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
				popup.current.addPopupMessage({
					message: i18n.t('upload.upload-success'),
					duration: 10,
					type: 'info',
				});
			})
			.catch((error) => {
				if (error.response && error.response.data)
					popup.current.addPopupMessage({
						message: i18n.t('upload.upload-fail') + error.response.data.message,
						duration: 10,
						type: 'error',
					});
			});
	}

	function handleRemoveTag(index: number) {
		setTags([...tags.filter((_, i) => i !== index)]);
	}

	function handleAddTag(tag: TagChoiceLocal) {
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
						<label className="button" htmlFor="ufb">
							Upload a file
						</label>
						<input id="ufb" type="file" onChange={(event) => handleFileChange(event)} />
					</div>
				);

			case tabs[1]:
				return (
					<div>
						<button className="button" type="button" onClick={() => handleCodeChange()}>
							Copy from clipboard
						</button>
					</div>
				);

			default:
				return <>No tab</>;
		}
	}

	return (
		<main className="upload">
			<div className="upload">
				<div className="preview-container ">
					<div className="upload-button flex-column medium-gap">
						<div className="flex-center">
							<section className="grid-row small-gap  light-border small-padding">
								{tabs.map((name, index) => (
									<button className={currentTab === name ? 'button-active' : 'button'} key={index} type="button" onClick={() => setCurrentTab(name)}>
										{name}
									</button>
								))}
							</section>
						</div>
						<div className="flex-center">{renderTab(currentTab)}</div>
						<div className="preview-image-container">{preview && <img className="preview-image" src={PNG_IMAGE_PREFIX + preview.image} alt="Upload a file" />}</div>
					</div>
					<div className="upload-description-container">
						{preview && (
							<div className="flex-column flex-wrap text-center">
								{<div>Author: {user ? user.name : 'community'}</div>}
								<div>Name: {preview.name}</div>
								{preview.description && <p> {preview.description}</p>}
								{preview.requirement && (
									<section className="flex-row flex-wrap small-gap">
										{preview.requirement.map((r, index) => (
											<span key={index} className="flex-row center">
												<img className="small-icon " src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
												<span> {r.amount} </span>
											</span>
										))}
									</section>
								)}
							</div>
						)}
						<div className="upload-search-container">
							<Dropbox
								placeholder="Add tags"
								value={tag}
								items={TagChoiceLocal.SCHEMATIC_UPLOAD_TAG.filter((t) => `${t.displayName}:${t.displayValue}`.toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
								onChange={(event) => setTag(event.target.value)}
								onChoose={(item) => handleAddTag(item)}
								converter={(t, index) => <TagPick key={index} tag={t} />}
							/>

							<div className="flex-row flex-wrap medium-gap">
								{tags.map((t: TagChoiceLocal, index: number) => (
									<Tag key={index} tag={t} removeButton={<ClearIconButton icon="/assets/icons/quit.png" title="remove" onClick={() => handleRemoveTag(index)} />} />
								))}
							</div>
						</div>
						<section className="flex-center">
							<button className="button" type="button" onClick={() => handleSubmit()}>
								Upload
							</button>
						</section>
					</div>
				</div>
			</div>
		</main>
	);
}
