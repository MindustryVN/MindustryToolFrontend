import 'src/styles.css';
import './UserSchematicTab.css';

import React, { useState, useContext } from 'react';
import IconButton from 'src/components/button/IconButton';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import { PopupMessageContext } from 'src/components/provider/PopupMessageProvider';
import SchematicData from 'src/components/schematic/SchematicData';
import SchematicPreview from 'src/components/schematic/SchematicPreview';
import Tag, { TagChoiceLocal, Tags } from 'src/components/tag/Tag';
import LoadUserName from 'src/components/user/LoadUserName';
import UserData, { Users } from 'src/components/user/UserData';
import { API_BASE_URL } from 'src/config/Config';
import i18n from 'src/util/I18N';
import { Utils } from 'src/util/Utils';
import useClipboard from 'src/hooks/UseClipboard';
import usePage from 'src/hooks/UsePage';

interface UserSchematicTabProps {
	user: UserData;
}

export default function UserSchematicTab(props: UserSchematicTabProps) {
	const [currentSchematic, setCurrentSchematic] = useState<SchematicData>();

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const { addPopupMessage } = useContext(PopupMessageContext);

	const { copy } = useClipboard();

	const { pages, loadPage, loaderState } = usePage<SchematicData>(`schematic/user/${props.user.id}/page`);

	function buildSchematicData(schematic: SchematicData) {
		return (
			<main className='schematic-info small-gap'>
				<section className='flex-row medium-gap flex-wrap'>
					<img className='schematic-info-image' src={`${API_BASE_URL}schematic/${schematic.id}/image`} alt='schematic' />
					<section className='flex-column small-gap flex-wrap'>
						Name: <span className='capitalize'>{schematic.name}</span>
						By: <LoadUserName userId={schematic.authorId} />
						{schematic.description && <span className='capitalize'>{schematic.description}</span>}
						{schematic.requirement && (
							<section className=' flex-row flex-wrap medium-gap'>
								{schematic.requirement.map((r, index) => (
									<span key={index} className='flex-row center'>
										<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
										<span> {r.amount} </span>
									</span>
								))}
							</section>
						)}
						{schematic.tags && (
							<section className='flex-row flex-wrap small-gap'>
								{Tags.parseArray(schematic.tags, Tags.SCHEMATIC_SEARCH_TAG).map((t: TagChoiceLocal, index: number) => (
									<Tag key={index} tag={t} />
								))}
							</section>
						)}
						{schematic.verifyAdmin && (
							<span className='capitalize'>
								Verified by: <LoadUserName userId={schematic.verifyAdmin} />
							</span>
						)}
					</section>
				</section>
				<section className='grid-row small-gap'>
					<button
						className='button'
						type='button'
						onClick={() => {
							if (currentSchematic) currentSchematic.like += 1;
						}}>
						<img src='/assets/icons/play-2.png' style={{ rotate: '-90deg' }} alt='like' />
					</button>
					<button
						className='button'
						type='button'
						onClick={() => {
							if (currentSchematic) currentSchematic.dislike += 1;
						}}>
						<img src='/assets/icons/play-2.png' style={{ rotate: '90deg' }} alt='dislike' />
					</button>
					<a className='button small-padding' href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`}>
						<img src='/assets/icons/download.png' alt='download' />
					</a>
					<button className='button' type='button' onClick={() => copy(schematic.data)}>
						<img src='/assets/icons/copy.png' alt='copy' />
					</button>
					{props.user && (schematic.authorId === props.user.id || Users.isAdmin(props.user)) && (
						<button className='button' type='button'>
							<img src='/assets/icons/trash-16.png' alt='delete' />
						</button>
					)}
					<button className='button' type='button' onClick={() => setShowSchematicModel(false)}>
						Back
					</button>
				</section>
			</main>
		);
	}

	if (showSchematicModel && currentSchematic) return buildSchematicData(currentSchematic);

	return (
		<main id='schematic-tab' className='schematic-tab'>
			<section className='schematic-container'>
				{pages.map((schematic, index) => (
					<SchematicPreview
						key={index}
						schematic={schematic}
						imageUrl={`${API_BASE_URL}schematic/${schematic.id}/image`}
						onClick={() => {
							setCurrentSchematic(schematic);
							setShowSchematicModel(true);
						}}
						buttons={[
							<IconButton key={0} title='up vote' icon='/assets/icons/up-vote.png' onClick={() => addPopupMessage({ message: i18n.t('schematic.liked'), duration: 5, type: 'info' })} />, //
							<IconButton
								key={1}
								title='down vote'
								icon='/assets/icons/down-vote.png'
								onClick={() => addPopupMessage({ message: i18n.t('schematic.disliked'), duration: 5, type: 'info' })}
							/>, //
							<IconButton key={2} title='copy' icon='/assets/icons/copy.png' onClick={() => copy(schematic.data)} />, //
							<a key={3} className='button small-padding' href={Utils.getDownloadUrl(schematic.data)} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`}>
								<img src='/assets/icons/download.png' alt='download' />
							</a>,
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
						<ScrollToTopButton containerId='schematic-tab' />
					</section>
				)}
			</footer>
		</main>
	);
}
