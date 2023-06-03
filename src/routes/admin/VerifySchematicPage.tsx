import '../../styles.css';
import './VerifySchematicPage.css';

import { capitalize } from '../../util/StringUtils';
import React, { ReactElement, useEffect, useState } from 'react';
import Tag, { CustomTag, SCHEMATIC_TAG } from '../../components/common/Tag';
import { API } from '../../AxiosConfig';
import { LoaderState, MAX_ITEM_PER_PAGE } from '../../config/Config';

import TagQuery from '../../components/common/TagQuery';
import UserName from '../user/UserName';
import SchematicInfo from '../schematic/SchematicInfo';
import LazyLoadImage from '../../components/common/LazyLoadImage';

export const VerifySchematicPage = () => {
	const [loaderState, setLoaderState] = useState<LoaderState>(LoaderState.LOADING);

	const [schematicList, setSchematicList] = useState<SchematicInfo[][]>([[]]);
	const [currentSchematic, setCurrentSchematic] = useState<SchematicInfo>();

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	useEffect(() => loadPage(), []);

	function loadPage() {
		setLoaderState(LoaderState.LOADING);

		const lastIndex = schematicList.length - 1;
		const newPage = schematicList[lastIndex].length === MAX_ITEM_PER_PAGE;
		API.get(`schematicupload/page/${schematicList.length + (newPage ? 0 : -1)}`)
			.then((result) => {
				if (result.status === 200 && result.data) {
					let schematics: SchematicInfo[] = result.data;
					if (newPage) schematicList.push(schematics);
					else schematicList[lastIndex] = schematics;
					if (schematics.length < 10) setLoaderState(LoaderState.NO_MORE);
					else setLoaderState(LoaderState.MORE);

					setSchematicList([...schematicList]);
				} else setLoaderState(LoaderState.NO_MORE);
			})
			.catch((error) => console.log(error));
	}

	function buildSchematicInfo(schematic: SchematicInfo) {
		const blob = new Blob([schematic.data], { type: 'text/plain' });
		const tagArray: TagQuery[] = [];
		for (let t of schematic.tags) {
			const v = t.split(':');
			if (v.length !== 2) continue;
			const r = SCHEMATIC_TAG.find((st: CustomTag) => st.category === v[0]);
			if (r) {
				tagArray.push(new TagQuery(v[0], r.color, v[1]));
			}
		}
		const url = window.URL.createObjectURL(blob);

		return (
			<div className='schematic-info-modal model flexbox-center image-background' onClick={() => setShowSchematicModel(false)}>
				<div className='flexbox-center'>
					<div className='schematic-info-container dark-background' onClick={(event) => event.stopPropagation()}>
						<LazyLoadImage className='schematic-info-image' path={`schematics/${schematic.id}/image`}></LazyLoadImage>
						<div className='schematic-info-desc-container'>
							<span>Name: {capitalize(schematic.name)}</span>
							<span>
								Author: <UserName userId={schematic.authorId} />
							</span>
							<span>Like: {schematic.like}</span>
							<span>Dislike: {schematic.dislike}</span>
							{schematic.description && <span>{schematic.description}</span>}
							{schematic.requirement && (
								<section className='flexbox-row small-gap'>
									{schematic.requirement.map((r, index) => (
										<span key={index} className='text-center'>
											<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
											<span> {r.amount} </span>
										</span>
									))}
								</section>
							)}
							{tagArray && (
								<section className='tag-container'>
									{tagArray.map((t: TagQuery, index: number) => (
										<Tag key={index} index={index} name={t.category} value={t.value} color={t.color} />
									))}
								</section>
							)}
							<section className='schematic-info-button-container'>
								<button
									className='button-transparent'
									onClick={() => {
										if (currentSchematic) currentSchematic.like += 1;
									}}>
									<img src='/assets/icons/play-2.png' className='model-icon' style={{ rotate: '-90deg' }} alt='check' />
								</button>
								<button
									className='button-transparent'
									onClick={() => {
										if (currentSchematic) currentSchematic.dislike += 1;
									}}>
									<img src='/assets/icons/play-2.png' className='model-icon' style={{ rotate: '90deg' }} alt='check' />
								</button>
								<a className='button-transparent' href={url} download={`${schematic.name.trim().replaceAll(' ', '_')}.msch`}>
									<img src='/assets/icons/upload.png' className='model-icon' alt='check' />
								</a>
								<button
									className='button-transparent'
									onClick={() => {
										navigator.clipboard.writeText(schematic.data).then(() => alert('Copied'));
									}}>
									<img src='/assets/icons/copy.png' className='model-icon' alt='check' />
								</button>
								<button className='button-transparent'>
									<img src='/assets/icons/trash-16.png' className='model-icon' alt='check' />
								</button>
							</section>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const schematicArray: ReactElement[] = [];
	for (let p = 0; p < schematicList.length; p++) {
		for (let i = 0; i < schematicList[p].length; i++) {
			let schematic = schematicList[p][i];
			schematicArray.push(
				<div
					key={p * MAX_ITEM_PER_PAGE + i}
					className='schematic-preview'
					onClick={() => {
						setCurrentSchematic(schematic);
						setShowSchematicModel(true);
					}}>
					<LazyLoadImage className='schematic-image' path={`schematics/${schematic.id}/image`}></LazyLoadImage>
					<div className='schematic-preview-description flexbox-center'>{capitalize(schematic.name)}</div>
				</div>
			);
		}
	}

	return (
		<div className='verify-schematic'>
			<section className='schematic-container'>{schematicArray}</section>
			<footer className='schematic-container-footer'>
				{loaderState === LoaderState.LOADING ? (
					<div className='loading-spinner'></div>
				) : (
					<button className='load-more-button button-normal' onClick={() => loadPage()}>
						{loaderState === LoaderState.MORE ? 'Load more' : 'No schematic left'}
					</button>
				)}
			</footer>
			{showSchematicModel === true && currentSchematic !== undefined && buildSchematicInfo(currentSchematic)}
		</div>
	);
};
