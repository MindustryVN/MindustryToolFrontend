import 'src/styles.css';
import './VerifySchematicTab.css';

import React, { useContext, useState } from 'react';
import Tag, { TagChoiceLocal } from 'src/components/tag/Tag';
import { API } from 'src/API';
import { API_BASE_URL } from 'src/config/Config';
import UserName from 'src/components/user/LoadUserName';
import SchematicData from 'src/components/schematic/SchematicData';
import Dropbox from 'src/components/dropbox/Dropbox';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import ClearIconButton from 'src/components/button/ClearIconButton';
import { Utils } from 'src/util/Utils';
import SchematicPreview from 'src/components/schematic/SchematicPreview';
import IconButton from 'src/components/button/IconButton';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import i18n from 'src/util/I18N';
import TagPick from 'src/components/tag/TagPick';
import useClipboard from 'src/hooks/UseClipboard';
import usePage from 'src/hooks/UsePage';

export default function VerifySchematicTab() {
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const { copy } = useClipboard();

	const { pages, loadPage, loadToPage, loaderState } = usePage<SchematicData>('schematic-upload/page');

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
				.finally(() => loadToPage(pages.length));
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
					loadToPage(pages.length);
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
			<main className="schematic-info-container" onClick={(event) => event.stopPropagation()}>
				<img className="schematic-info-image" src={`${API_BASE_URL}schematic-upload/${props.schematic.id}/image`} alt="schematic" />
				<div className="flex-column small-gap">
					<span className="capitalize">{props.schematic.name}</span>
					<span>
						<UserName userId={props.schematic.authorId} />
					</span>
					{props.schematic.description && <span className="capitalize">{props.schematic.description}</span>}
					{props.schematic.requirement && (
						<section className=" flex-row small-gap flex-wrap center">
							{props.schematic.requirement.map((r, index) => (
								<span key={index} className="flex-row center">
									<img className="small-icon" src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
									<span> {r.amount} </span>
								</span>
							))}
						</section>
					)}

					<div className="flex-column small-gap">
						<Dropbox
							placeholder="Add tags"
							value={tag}
							items={TagChoiceLocal.SCHEMATIC_UPLOAD_TAG.filter((t) => `${t.displayName}:${t.displayValue}`.toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
							onChange={(event) => setTag(event.target.value)}
							onChoose={(item) => handleAddTag(item)}
							converter={(t, index) => <TagPick key={index} tag={t} />}
						/>
						<div className="flex-row flex-wrap small-gap">
							{tags.map((t: TagChoiceLocal, index: number) => (
								<Tag key={index} tag={t} removeButton={<ClearIconButton icon="/assets/icons/quit.png" title="remove" onClick={() => handleRemoveTag(index)} />} />
							))}
						</div>
					</div>
					<section className="grid-row small-gap">
						<a className="button small-padding" href={Utils.getDownloadUrl(props.schematic.data)} download={`${('schematic_' + props.schematic.name).trim().replaceAll(' ', '_')}.msch`}>
							<img src="/assets/icons/download.png" alt="download" />
						</a>
						<IconButton icon="/assets/icons/copy.png" onClick={() => copy(props.schematic.data)} />
						<button className="button" type="button" onClick={() => verifySchematic(props.schematic)}>
							Verify
						</button>
						<button className="button" type="button" onClick={() => deleteSchematic(props.schematic)}>
							Reject
						</button>
						<button className="button" type="button" onClick={() => setShowSchematicModel(false)}>
							Back
						</button>
					</section>
				</div>
			</main>
		);
	}

	if (showSchematicModel && currentSchematic)
		return (
			<main className="schematic-info-modal model flex-center image-background" onClick={() => setShowSchematicModel(false)}>
				<div className="flex-center">
					<div className="schematic-card ">
						<SchematicVerifyPanel schematic={currentSchematic} />
					</div>
				</div>
			</main>
		);

	return (
		<main className="verify-schematic">
			<section className="schematic-container">
				{pages.map((schematic, index) => (
					<SchematicPreview
						key={index}
						schematic={schematic} //
						imageUrl={`${API_BASE_URL}schematic-upload/${schematic.id}/image`}
						onClick={(schematic) => {
							setCurrentSchematic(schematic);
							setShowSchematicModel(true);
						}}
						buttons={[
							<IconButton key={2} title="copy" icon="/assets/icons/copy.png" onClick={() => copy(schematic.data)} />, //
							<a key={3} className="button small-padding" href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`}>
								<img src="/assets/icons/download.png" alt="download" />
							</a>,
						]}
					/>
				))}
			</section>
			<footer className="flex-center">
				{loaderState === 'loading' ? (
					<LoadingSpinner />
				) : (
					<section className="grid-row small-gap">
						<button className="button" type="button" onClick={() => loadPage()}>
							{i18n.t(loaderState === 'more' ? 'load-more' : 'no-more-schematic')}
						</button>
						<ScrollToTopButton containerId="admin" />
					</section>
				)}
			</footer>
		</main>
	);
}
