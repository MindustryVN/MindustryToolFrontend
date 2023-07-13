import 'src/styles.css';
import './UserSchematicTab.css';

import React, { useState, useContext, useEffect } from 'react';
import { API } from 'src/API';
import IconButton from 'src/components/button/IconButton';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import { UP_VOTE_ICON, DOWN_VOTE_ICON, COPY_ICON } from 'src/components/common/Icon';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import SchematicData from 'src/components/schematic/SchematicData';
import SchematicPreview from 'src/components/schematic/SchematicPreview';
import Tag, { TagChoiceLocal } from 'src/components/tag/Tag';
import LoadUserName from 'src/components/user/LoadUserName';
import UserData from 'src/components/user/UserData';
import { LoaderState, MAX_ITEM_PER_PAGE, API_BASE_URL } from 'src/config/Config';
import i18n from 'src/util/I18N';
import { Utils } from 'src/util/Utils';

interface UserSchematicTabProps {
	user: UserData;
}

export default function UserSchematicTab(props: UserSchematicTabProps) {
	const [loaderState, setLoaderState] = useState<LoaderState>('loading');
	const [schematicList, setSchematicList] = useState<SchematicData[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const { addPopupMessage } = useContext(PopupMessageContext);

	useEffect(() => {
		API.REQUEST.get(`schematic/user/${props.user.id}/page/0`) //
			.then((result) => {
				let schematics: SchematicData[] = result.data;
				if (schematics) {
					setSchematicList(() => {
						return [schematics];
					});
				}
			})
			.catch(() => console.log('Error loading user schematic'))
			.finally(() => setLoaderState('more'));
	}, [props.user.id]);

	function loadPage() {
		setLoaderState('loading');

		const lastIndex = schematicList.length - 1;
		const newPage = schematicList[lastIndex].length === MAX_ITEM_PER_PAGE;

		API.REQUEST.get(`schematic/user/${props.user.id}/page/${lastIndex + (newPage ? 1 : 0)}`)
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

	function buildSchematicData(schematic: SchematicData) {
		return (
			<main className="schematic-info small-gap">
				<section className="flex-row medium-gap flex-wrap">
					<img className="schematic-info-image" src={`${API_BASE_URL}schematic/${schematic.id}/image`} alt="schematic" />
					<section className="flex-column small-gap flex-wrap">
						Name: <span className="capitalize">{schematic.name}</span>
						By: <LoadUserName userId={schematic.authorId} />
						{schematic.description && <span className="capitalize">{schematic.description}</span>}
						{schematic.requirement && (
							<section className=" flex-row flex-wrap medium-gap">
								{schematic.requirement.map((r, index) => (
									<span key={index} className="flex-row center">
										<img className="small-icon " src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
										<span> {r.amount} </span>
									</span>
								))}
							</section>
						)}
						{schematic.tags && (
							<section className="flex-row flex-wrap small-gap">
								{TagChoiceLocal.parseArray(schematic.tags, TagChoiceLocal.SCHEMATIC_SEARCH_TAG).map((t: TagChoiceLocal, index: number) => (
									<Tag key={index} tag={t} />
								))}
							</section>
						)}
						{schematic.verifyAdmin && (
							<span className="capitalize">
								Verified by: <LoadUserName userId={schematic.verifyAdmin} />
							</span>
						)}
					</section>
				</section>
				<section className="grid-row small-gap">
					<button
						className="button"
						type="button"
						onClick={() => {
							if (currentSchematic) currentSchematic.like += 1;
						}}>
						<img src="/assets/icons/play-2.png" style={{ rotate: '-90deg' }} alt="like" />
					</button>
					<button
						className="button"
						type="button"
						onClick={() => {
							if (currentSchematic) currentSchematic.dislike += 1;
						}}>
						<img src="/assets/icons/play-2.png" style={{ rotate: '90deg' }} alt="dislike" />
					</button>
					<a className="button small-padding" href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`}>
						<img src="/assets/icons/download.png" alt="download" />
					</a>
					<button
						className="button"
						type="button"
						onClick={() =>
							Utils.copyDataToClipboard(schematic.data).then(() =>
								addPopupMessage({
									message: i18n.t('copied'),
									duration: 5,
									type: 'info',
								}),
							)
						}>
						<img src="/assets/icons/copy.png" alt="copy" />
					</button>
					{props.user && (schematic.authorId === props.user.id || UserData.isAdmin(props.user)) && (
						<button className="button" type="button">
							<img src="/assets/icons/trash-16.png" alt="delete" />
						</button>
					)}
					<button className="button" type="button" onClick={() => setShowSchematicModel(false)}>
						Back
					</button>
				</section>
			</main>
		);
	}

	if (showSchematicModel && currentSchematic) return buildSchematicData(currentSchematic);

	return (
		<main id="schematic-tab" className="schematic-tab">
			<section className="schematic-container">
				{Utils.array2dToArray(schematicList, (schematic, index) => (
					<SchematicPreview
						key={index}
						schematic={schematic}
						imageUrl={`${API_BASE_URL}schematic/${schematic.id}/image`}
						onClick={() => {
							setCurrentSchematic(schematic);
							setShowSchematicModel(true);
						}}
						buttons={[
							<IconButton
								key={0}
								title="up vote"
								icon={UP_VOTE_ICON}
								onClick={() =>
									addPopupMessage({
										message: i18n.t('schematic.liked'),
										duration: 5,
										type: 'info',
									})
								}
							/>, //
							<IconButton
								key={1}
								title="down vote"
								icon={DOWN_VOTE_ICON}
								onClick={() =>
									addPopupMessage({
										message: i18n.t('schematic.disliked'),
										duration: 5,
										type: 'info',
									})
								}
							/>, //
							<IconButton
								key={2}
								title="copy"
								icon={COPY_ICON}
								onClick={() =>
									Utils.copyDataToClipboard(schematic.data).then(() =>
										addPopupMessage({
											message: i18n.t('copied'),
											duration: 5,
											type: 'info',
										}),
									)
								}
							/>, //
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
						<ScrollToTopButton containerId="schematic-tab" />
					</section>
				)}
			</footer>
		</main>
	);
}
