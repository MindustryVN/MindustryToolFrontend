import '../../styles.css';
import './VerifySchematicPage.css';

import React, { Component, ReactElement, useEffect, useState } from 'react';
import Tag, { TagChoice } from '../../components/common/tag/Tag';

import { API } from '../../API';
import { Trans } from 'react-i18next';
import { capitalize } from '../../util/StringUtils';
import { API_BASE_URL, LoaderState, MAX_ITEM_PER_PAGE } from '../../config/Config';

import UserName from '../../components/common/user/LoadUserName';
import SchematicData from '../../components/common/schematic/SchematicData';
import Dropbox from '../../components/common/dropbox/Dropbox';
import LoadingSpinner from '../../components/common/loader/LoadingSpinner';
import ScrollToTopButton from '../../components/common/button/ScrollToTopButton';
import ClearIconButton from '../../components/common/button/ClearIconButton';
import { QUIT_ICON } from '../../components/common/Icon';

export const VerifySchematicPage = () => {
	const [loaderState, setLoaderState] = useState<LoaderState>(LoaderState.LOADING);

	const [schematicList, setSchematicList] = useState<SchematicData[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	useEffect(() => loadPage(), []);

	function loadToPage(page: number) {
		setSchematicList([[]]);
		setLoaderState(LoaderState.LOADING);

		for (let i = 0; i < page; i++) {
			API.REQUEST.get(`schematic-upload/page/${i}`)
				.then((result) => {
					let schematics: SchematicData[] = result.data;
					if (schematics.length) {
						if (schematics.length < MAX_ITEM_PER_PAGE) setLoaderState(LoaderState.NO_MORE);
						else setLoaderState(LoaderState.MORE);

						setSchematicList([...schematicList]);
					} else setLoaderState(LoaderState.NO_MORE);
				})
				.catch(() => setLoaderState(LoaderState.MORE));
		}
	}

	function loadPage() {
		setLoaderState(LoaderState.LOADING);

		const lastIndex = schematicList.length - 1;
		const newPage = schematicList[lastIndex].length === MAX_ITEM_PER_PAGE;

		API.REQUEST.get(`schematic-upload/page/${schematicList.length + (newPage ? 0 : -1)}`)
			.then((result) => {
				let schematics: SchematicData[] = result.data;
				if (schematics.length) {
					if (newPage) schematicList.push(schematics);
					else schematicList[lastIndex] = schematics;

					if (schematics.length < MAX_ITEM_PER_PAGE) setLoaderState(LoaderState.NO_MORE);
					else setLoaderState(LoaderState.MORE);

					setSchematicList([...schematicList]);
				} else setLoaderState(LoaderState.NO_MORE);
			})
			.catch(() => setLoaderState(LoaderState.MORE));
	}

	const schematicArray: ReactElement[] = [];
	for (let p = 0; p < schematicList.length; p++) {
		for (let i = 0; i < schematicList[p].length; i++) {
			let schematic = schematicList[p][i];

			const blob = new Blob([Buffer.from(schematic.data, 'base64')], { type: 'text/plain' });

			const url = window.URL.createObjectURL(blob);

			schematicArray.push(
				<section key={p * schematicList.length + i} className='schematic-preview'>
					<button
						className='schematic-image-wrapper'
						type='button'
						onClick={() => {
							setCurrentSchematic(schematic);
							setShowSchematicModel(true);
						}}>
						<img className='schematic-image' src={`${API_BASE_URL}schematic-upload/${schematic.id}/image`}/>
					</button>
					<div className='schematic-preview-description flex-center'>{capitalize(schematic.name)}</div>

					<section className='schematic-info-button-container grid-row small-gap small-padding'>
						<a className='button  small-padding' href={url} download={`${schematic.name.trim().replaceAll(' ', '_')}.msch`}>
							<img src='/assets/icons/download.png' alt='download' />
						</a>
						<button
							className='button small-padding'
							onClick={() => {
								navigator.clipboard.writeText(schematic.data).then(() => alert('Copied'));
							}}>
							<img src='/assets/icons/copy.png' alt='copy' />
						</button>
					</section>
				</section>
			);
		}
	}

	interface SchematicVerifyPanelParam {
		schematic: SchematicData;
	}

	function SchematicVerifyPanel(param: SchematicVerifyPanelParam) {
		const [tags, setTags] = useState(TagChoice.parseArray(param.schematic.tags, TagChoice.SCHEMATIC_UPLOAD_TAG));
		const [tag, setTag] = useState('');

		function handleRemoveTag(index: number) {
			setTags([...tags.filter((_, i) => i !== index)]);
		}

		function deleteSchematic(id: string) {
			setShowSchematicModel(false);
			API.REQUEST.delete(`schematic-upload/${id}`) //
				.finally(() => loadToPage(schematicList.length));
		}

		function verifySchematic(schematic: SchematicData) {
			let form = new FormData();
			const tagString = `${tags.map((t) => `${t.name}:${t.value}`).join()}`;

			form.append('id', schematic.id);
			form.append('authorId', schematic.authorId);
			form.append('data', schematic.data);

			form.append('tags', tagString);

			API.REQUEST.post('schematic', form) //
				.finally(() => {
					loadToPage(schematicList.length);
					setShowSchematicModel(false);
				});
		}

		function handleAddTag(tag: TagChoice) {
			if (!tag) return;
			tags.filter((q) => q.name !== tag.name);
			setTags((prev) => [...prev, tag]);
			setTag('');
		}
		const blob = new Blob([Buffer.from(param.schematic.data, 'base64')], { type: 'text/plain' });
		const url = window.URL.createObjectURL(blob);

		return (
			<div className='schematic-info-container' onClick={(event) => event.stopPropagation()}>
				<img className='schematic-info-image' src={`${API_BASE_URL}schematic-upload/${param.schematic.id}/image`} />
				<div className='schematic-info-desc-container small-gap'>
					<span>Name: {capitalize(param.schematic.name)}</span>
					<span>
						Author: <UserName userId={param.schematic.authorId} />
					</span>
					{param.schematic.description && <span>{param.schematic.description}</span>}
					{param.schematic.requirement && (
						<section className=' flex-row small-gap flex-wrap'>
							{param.schematic.requirement.map((r, index) => (
								<span key={index} className='text-center'>
									<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
									<span> {r.amount} </span>
								</span>
							))}
						</section>
					)}

					<div className='flex-column small-gap'>
						<Dropbox
							placeholder='Add tags'
							value={tag}
							items={TagChoice.SCHEMATIC_UPLOAD_TAG.filter((t) => (t.name.includes(tag) || t.value.includes(tag)) && !tags.includes(t))}
							onChange={(event) => setTag(event.target.value)}
							onChoose={(item) => handleAddTag(item)}
							converter={(t, index) => (
								<span key={index}>
									<Trans i18nKey={t.name} /> : <Trans i18nKey={t.value} />
								</span>
							)}
						/>
						<div className='tag-container small-gap'>
							{tags.map((t: TagChoice, index: number) => (
								<Tag key={index} tag={t} removeButton={<ClearIconButton icon={QUIT_ICON} title='remove' onClick={() => handleRemoveTag(index)} />} />
							))}
						</div>
					</div>
					<section className='flexbox small-gap flex-wrap center'>
						<a className='button  small-padding' href={url} download={`${param.schematic.name.trim().replaceAll(' ', '_')}.msch`}>
							<img src='/assets/icons/download.png' alt='download' />
						</a>
						<button className='button  small-padding' type='button' onClick={() => navigator.clipboard.writeText(param.schematic.data).then(() => alert('Copied'))}>
							<img src='/assets/icons/copy.png' alt='copy' />
						</button>

						<button className='button' type='button' onClick={() => verifySchematic(param.schematic)}>
							Verify
						</button>
						<button className='button' type='button' onClick={() => deleteSchematic(param.schematic.id)}>
							Reject
						</button>
					</section>
				</div>
			</div>
		);
	}

	if (showSchematicModel === true && currentSchematic !== undefined)
		return (
			<div className='schematic-info-modal model flex-center image-background' onClick={() => setShowSchematicModel(false)}>
				<div className='flex-center'>
					<div className='schematic-card '>
						<SchematicVerifyPanel schematic={currentSchematic} />
					</div>
				</div>
			</div>
		);

	return (
		<div id='verify-schematic' className='verify-schematic'>
			<section className='schematic-container'>{schematicArray}</section>
			<footer className='schematic-container-footer'>
				{loaderState === LoaderState.LOADING ? (
					<LoadingSpinner />
				) : (
					<section className='grid-row small-gap'>
						<button className='button' onClick={() => loadPage()}>
							{loaderState === LoaderState.MORE ? 'Load more' : 'No schematic left'}
						</button>
						<ScrollToTopButton containerId='verify-schematic' />
					</section>
				)}
			</footer>
			+
		</div>
	);
};
