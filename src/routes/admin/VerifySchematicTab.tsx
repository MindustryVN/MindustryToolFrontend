import '../../styles.css';
import './VerifySchematicTab.css';

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
import { PopupMessageContext } from '../../components/provider/PopupMessageProvider';
import i18n from '../../util/I18N';
import TagPick from '../../components/tag/TagPick';

export default function VerifySchematicTab() {
	const [loaderState, setLoaderState] = useState<LoaderState>('loading');

	const [schematicList, setSchematicList] = useState<SchematicData[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const { addPopupMessage } = useContext(PopupMessageContext);

	useEffect(() => {
		API.REQUEST.get(`schematic-upload/page/0`) //
			.then((result) => {
				setSchematicList((prev) => {
					let schematics: SchematicData[] = result.data;
					return [schematics];
				});
			})
			.catch(() => console.log('Error loading schematic verify page')) //
			.finally(() => setLoaderState('more'));
	}, []);

	function loadToPage(page: number) {
		setSchematicList([[]]);
		setLoaderState('loading');

		for (let i = 0; i < page; i++) {
			API.REQUEST.get(`schematic-upload/page/${i}`)
				.then((result) => {
					let schematics: SchematicData[] = result.data;
					if (schematics) {
						if (schematics.length < MAX_ITEM_PER_PAGE) setLoaderState('out');
						else setLoaderState('more');
						setSchematicList((prev) => [...prev, schematics]);
					} else setLoaderState('out');
				})
				.catch(() => setLoaderState('more'));
		}
	}

	function loadPage() {
		setLoaderState('loading');

		const lastIndex = schematicList.length - 1;
		const newPage = schematicList[lastIndex].length === MAX_ITEM_PER_PAGE;

		API.REQUEST.get(`schematic-upload/page/${lastIndex + (newPage ? 1 : 0)}`)
			.then((result) => {
				let schematics: SchematicData[] = result.data;
				if (schematics) {
					if (newPage)
						setSchematicList((prev) => {
							return [...prev, schematics];
						});
					else
						setSchematicList((prev) => {
							prev[lastIndex] = schematics;
							return [...prev];
						});
					if (schematics.length < MAX_ITEM_PER_PAGE) setLoaderState('out');
					else setLoaderState('more');
				} else setLoaderState('out');
			})
			.catch(() => setLoaderState('more'));
	}
	interface SchematicVerifyPanelProps {
		schematic: SchematicData;
	}

	function SchematicVerifyPanel(props: SchematicVerifyPanelProps) {
		const [tags, setTags] = useState(TagChoiceLocal.parseArray(props.schematic.tags, TagChoiceLocal.SCHEMATIC_UPLOAD_TAG));
		const [tag, setTag] = useState('');

		const { addPopupMessage } = useContext(PopupMessageContext);

		function handleRemoveTag(index: number) {
			setTags([...tags.filter((_, i) => i !== index)]);
		}

		function deleteSchematic(schematic: SchematicData) {
			setShowSchematicModel(false);
			API.REQUEST.delete(`schematic-upload/${schematic.id}`) //
				.then(() => addPopupMessage({ message: i18n.t('delete-success'), duration: 5, type: 'info' })) //.
				.catch(() => addPopupMessage({ message: i18n.t('delete-fail'), duration: 5, type: 'error' }))
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
				.then(() => addPopupMessage({ message: i18n.t('verify-success'), duration: 5, type: 'info' }))
				.catch(() => addPopupMessage({ message: i18n.t('verify-fail'), duration: 5, type: 'error' }))
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
			<main className='schematic-info-container' onClick={(event) => event.stopPropagation()}>
				<img className='schematic-info-image' src={`${API_BASE_URL}schematic-upload/${props.schematic.id}/image`} alt='schematic' />
				<div className='flex-column small-gap'>
					<span className='capitalize'>{props.schematic.name}</span>
					<span>
						<UserName userId={props.schematic.authorId} />
					</span>
					{props.schematic.description && <span className='capitalize'>{props.schematic.description}</span>}
					{props.schematic.requirement && (
						<section className=' flex-row small-gap flex-wrap center'>
							{props.schematic.requirement.map((r, index) => (
								<span key={index} className='flex-row center'>
									<img className='small-icon' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
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
						<a className='button small-padding' href={Utils.getDownloadUrl(props.schematic.data)} download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`}>
							<img src='/assets/icons/download.png' alt='download' />
						</a>
						<IconButton icon={COPY_ICON} onClick={() => Utils.copyDataToClipboard(props.schematic.data).then(() => addPopupMessage({ message: i18n.t('copied'), duration: 10, type: 'info' }))} />
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
			</main>
		);
	}

	if (showSchematicModel && currentSchematic)
		return (
			<main className='schematic-info-modal model flex-center image-background' onClick={() => setShowSchematicModel(false)}>
				<div className='flex-center'>
					<div className='schematic-card '>
						<SchematicVerifyPanel schematic={currentSchematic} />
					</div>
				</div>
			</main>
		);

	return (
		<main className='verify-schematic'>
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
							<IconButton key={2} title='copy' icon={COPY_ICON} onClick={() => Utils.copyDataToClipboard(schematic.data).then(() => addPopupMessage({ message: i18n.t('copied'), duration: 10, type: 'info' }))} />, //
							<a key={3} className='button small-padding' href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`}>
								<img src='/assets/icons/download.png' alt='download' />
							</a>
						]}
					/>
				))}
			</section>
			<footer className='flex-center'>
				{loaderState === 'loading' ? (
					<LoadingSpinner />
				) : (
					<section className='grid-row small-gap'>
						<button className='button' type='button' onClick={() => loadPage()}>
							{i18n.t(loaderState === 'more' ? 'load-more' : 'no-more-schematic')}
						</button>
						<ScrollToTopButton containerId='admin' />
					</section>
				)}
			</footer>
		</main>
	);
}
