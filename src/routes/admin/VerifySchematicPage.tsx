import '../../styles.css';
import './VerifySchematicPage.css';

import React, { useContext, useEffect, useState } from 'react';
import Tag, { TagChoiceLocal } from '../../components/tag/Tag';

import { API } from '../../API';
import { API_BASE_URL, LoaderState, MAX_ITEM_PER_PAGE } from '../../config/Config';

import UserName from '../../components/user/LoadUserName';
import SchematicData from '../../components/schematic/SchematicData';
import Dropbox from '../../components/dropbox/Dropbox';
import LoadingSpinner from '../../components/loader/LoadingSpinner';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';
import ClearIconButton from '../../components/button/ClearIconButton';
import { COPY_ICON, QUIT_ICON } from '../../components/common/Icon';
import { Utils } from '../../util/Utils';
import SchematicPreview from '../../components/schematic/SchematicPreview';
import IconButton from '../../components/button/IconButton';
import { AlertContext } from '../../components/provider/AlertProvider';
import i18n from '../../util/I18N';
import TagPick from '../../components/tag/TagPick';

export const VerifySchematicPage = () => {
	const [loaderState, setLoaderState] = useState<LoaderState>(LoaderState.LOADING);

	const [schematicList, setSchematicList] = useState<SchematicData[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const { useAlert } = useContext(AlertContext);

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

	interface SchematicVerifyPanelProps {
		schematic: SchematicData;
	}

	function SchematicVerifyPanel(props: SchematicVerifyPanelProps) {
		const [tags, setTags] = useState(TagChoiceLocal.parseArray(props.schematic.tags, TagChoiceLocal.SCHEMATIC_UPLOAD_TAG));
		const [tag, setTag] = useState('');

		const { useAlert } = useContext(AlertContext);

		function handleRemoveTag(index: number) {
			setTags([...tags.filter((_, i) => i !== index)]);
		}

		function deleteSchematic(schematic: SchematicData) {
			setShowSchematicModel(false);
			API.REQUEST.delete(`schematic-upload/${schematic.id}`) //
				.then(() => useAlert(i18n.t('deleted'), 5, 'info'))
				.finally(() => loadToPage(schematicList.length));
		}

		function verifySchematic(schematic: SchematicData) {
			let form = new FormData();
			const tagString = TagChoiceLocal.toString(tags);

			form.append('id', schematic.id);
			form.append('authorId', schematic.authorId);
			form.append('data', schematic.data);

			form.append('tags', tagString);

			API.REQUEST.post('schematic', form) //
				.then(() => useAlert(i18n.t('verified'), 5, 'info'))
				.finally(() => {
					loadToPage(schematicList.length);
					setShowSchematicModel(false);
				});
		}

		function handleAddTag(tag: TagChoiceLocal) {
			if (!tag) return;
			tags.filter((q) => q.name !== tag.name);
			setTags((prev) => [...prev, tag]);
			setTag('');
		}

		return (
			<div className='schematic-info-container' onClick={(event) => event.stopPropagation()}>
				<img className='schematic-info-image' src={`${API_BASE_URL}schematic-upload/${props.schematic.id}/image`} alt='schematic' />
				<div className='flex-column small-gap'>
					<span className='capitalize'>{props.schematic.name}</span>
					<span>
						<UserName userId={props.schematic.authorId} />
					</span>
					{props.schematic.description && <span className='capitalize'>{props.schematic.description}</span>}
					{props.schematic.requirement && (
						<section className=' flex-row small-gap flex-wrap'>
							{props.schematic.requirement.map((r, index) => (
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
							items={TagChoiceLocal.SCHEMATIC_UPLOAD_TAG.filter((t) => `${t.displayName}:${t.displayValue}`.toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
							onChange={(event) => setTag(event.target.value)}
							onChoose={(item) => handleAddTag(item)}
							converter={(t, index) => <TagPick key={index} tag={t} />}
						/>
						<div className='flex-row flex-wrap small-gap'>
							{tags.map((t: TagChoiceLocal, index: number) => (
								<Tag key={index} tag={t} removeButton={<ClearIconButton icon={QUIT_ICON} title='remove' onClick={() => handleRemoveTag(index)} />} />
							))}
						</div>
					</div>
					<section className='grid-row small-gap'>
						<a className='button small-padding' href={Utils.getDownloadUrl(props.schematic.data)} download={`${props.schematic.name.trim().replaceAll(' ', '_')}.msch`}>
							<img src='/assets/icons/download.png' alt='download' />
						</a>
						<IconButton icon={COPY_ICON} onClick={() => Utils.copyDataToClipboard(props.schematic.data).then(() => useAlert(i18n.t('copied'), 10, 'info'))} />
						<button className='button' type='button' onClick={() => verifySchematic(props.schematic)}>
							Verify
						</button>
						<button className='button' type='button' onClick={() => deleteSchematic(props.schematic)}>
							Reject
						</button>
						<button className='button' type='button' onClick={() => setShowSchematicModel(false)}>
							Back
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
		<div className='verify-schematic'>
			<section className='schematic-container'>
				{Utils.array2dToArray(schematicList, (schematic, index) => (
					<SchematicPreview
						key={index}
						schematic={schematic} //
						imageUrl={`${API_BASE_URL}schematic-upload/${schematic.id}/image`}
						onClick={(schematic) => {
							setCurrentSchematic(schematic);
							setShowSchematicModel(true);
						}}
						buttons={[
							<IconButton key={2} title='copy' icon={COPY_ICON} onClick={() => Utils.copyDataToClipboard(schematic.data).then(() => useAlert(i18n.t('copied'), 10, 'info'))} />, //
							<a key={3} className='button small-padding' href={Utils.getDownloadUrl(schematic.data)} download={`${schematic.name.trim().replaceAll(' ', '_')}.msch`}>
								<img src='/assets/icons/download.png' alt='download' />
							</a>
						]}
					/>
				))}
			</section>
			<footer className='flex-center'>
				{loaderState === LoaderState.LOADING ? (
					<LoadingSpinner />
				) : (
					<section className='grid-row small-gap'>
						<button className='button' type='button' onClick={() => loadPage()}>
							{loaderState === LoaderState.MORE ? 'Load more' : 'No schematic left'}
						</button>
						<ScrollToTopButton containerId='admin' />
					</section>
				)}
			</footer>
		</div>
	);
};
