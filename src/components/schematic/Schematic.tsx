import './Schematic.css';

import { useState, useEffect, ChangeEvent, ReactElement } from 'react';
import { CustomTag, SCHEMATIC_TAG, TagChoice } from '../shared/Tags';
import { useNavigate } from 'react-router-dom';
import { capitalize } from '../shared/Util';
import { API } from '../../AxiosConfig';

import SchematicInfo from './SchematicInfo';
import LazyLoadImage from '../shared/LazyLoadImage';
import SearchBar from '../shared/SearchBar';
import TagQuery from '../shared/TagQuery';
import Dropbox from '../shared/Dropbox';
import React from 'react';
import Tag from '../shared/Tag';

const MAX_ITEM_PER_PAGE = 10;

const Schematic = () => {
	const [hasMoreContent, setHasMoreContent] = useState(true);
	const [isLoading, setLoading] = useState(false);

	const [page, setPage] = useState(0);
	const [schematicList, setSchematicList] = useState<SchematicInfo[][]>([[]]);

	const [tag, setTag] = useState(SCHEMATIC_TAG[0]);
	const [content, setContent] = useState('');

	const [query, setQuery] = useState<TagQuery[]>([]);

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const [currentSchematic, setCurrentSchematic] = useState<SchematicInfo>();

	const navigate = useNavigate();

	useEffect(() => loadPage(page), []);

	function loadPage(page: number) {
		setLoading(true);
		const lastIndex = schematicList.length - 1;
		const newPage = schematicList[lastIndex].length === MAX_ITEM_PER_PAGE;
		API.get(`schematics/page/${schematicList.length + (newPage ? 0 : -1)}`, { params: { tags: `${query.map((q) => `${q.toString()}`).join()}` } })
			.then((result) => {
				if (result.status === 200 && result.data) {
					let schematics: SchematicInfo[] = result.data;
					if (newPage) schematicList.push(schematics);
					else schematicList[lastIndex] = schematics;

					setSchematicList([...schematicList]);
					if (schematics.length < 10) setHasMoreContent(false);
				} else setHasMoreContent(false);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}

	function handleContentInput(event: ChangeEvent<HTMLInputElement>) {
		if (event) {
			const input = event.target.value;
			setContent(input.trim());
		}
	}

	function handleRemoveTag(index: number) {
		setQuery([...query.filter((_, i) => i !== index)]);
	}

	function handleAddTag() {
		const q = query.filter((q) => q.category !== tag.category);
		const v = tag.getValues();

		if (v === null || (v !== null && v.find((c: TagChoice) => c.value === content) !== undefined)) {
			setQuery([...q, new TagQuery(tag.category, tag.color, content)]);
		} else alert('Invalid tag ' + tag.category + ': ' + content);
	}

	function buildSchematicInfo(schematic: SchematicInfo | null) {
		if (schematic == null) return <></>;

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
			<div className='schematic-info-modal' onClick={() => setShowSchematicModel(false)}>
				<div className='schematic-info-pane'>
					<div className='schematic-info-container' onClick={(event) => event.stopPropagation()}>
						<LazyLoadImage className='schematic-info-image' path={`schematics/${schematic.id}/image`}></LazyLoadImage>
						<div className='schematic-info-desc-container'>
							<div>Name: {capitalize(schematic.name)}</div>
							<div onClick={() => navigate(`/user/${schematic.authorId}`)}>Author: {schematic.authorId}</div>
							<div>Like: {schematic.like}</div>
							<div>Dislike: {schematic.dislike}</div>
							<div>
								Tags: 
								{tagArray.map((t: TagQuery, index: number) => (
									<Tag key={index} index={index} name={t.category} value={t.value} color={t.color} onRemove={handleRemoveTag} />
								))}
							</div>
							<div className='schematic-info-button-container'>
								<div
									className='schematic-info-button'
									onClick={() => {
										if (currentSchematic) currentSchematic.like += 1;
									}}>
									<img src='/assets/icons/play-2.png' className='model-icon' style={{ rotate: '-90deg' }} alt='check' />
								</div>
								<div
									className='schematic-info-button'
									onClick={() => {
										if (currentSchematic) currentSchematic.dislike += 1;
									}}>
									<img src='/assets/icons/play-2.png' className='model-icon' style={{ rotate: '90deg' }} alt='check' />
								</div>
								<a className='schematic-info-button' href={url} download={`${schematic.name.trim().replaceAll(' ', '_')}.msch`}>
									<img src='/assets/icons/upload.png' className='model-icon' alt='check' />
								</a>
								<div
									className='schematic-info-button'
									onClick={() => {
										navigator.clipboard.writeText(schematic.data).then(() => alert('Copied'));
									}}>
									<img src='/assets/icons/copy.png' className='model-icon' alt='check' />
								</div>
								<div className='schematic-info-button'>
									<img src='/assets/icons/trash-16.png' className='model-icon' alt='check' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	const tagSubmitButton = (
		<button
			title='Add'
			className='submit-button'
			onClick={(event) => {
				handleAddTag();
				event.stopPropagation();
			}}>
			<img src='/assets/icons/check.png' alt='check' />
		</button>
	);

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
					<p className='schematic-preview-description'>{capitalize(schematic.name)}</p>
				</div>
			);
		}
	}

	return (
		<div className='schematic'>
			<div className='search-container'>
				<Dropbox value={'Tag: ' + tag.category}>
					{SCHEMATIC_TAG.filter((t) => !query.find((q) => q.category === t.category)).map((t, index) => (
						<div
							key={index}
							onClick={() => {
								setTag(t);
								setContent('');
							}}>
							{t.category}
						</div>
					))}
				</Dropbox>

				{tag.hasOption() ? (
					<Dropbox value={'Value: ' + content} submitButton={tagSubmitButton}>
						{tag.getValues().map((content: { name: string; value: string }, index: number) => (
							<div key={index} onClick={() => setContent(content.value)}>
								{content.name}
							</div>
						))}
					</Dropbox>
				) : (
					<SearchBar placeholder='Search' value={content} onChange={handleContentInput} submitButton={tagSubmitButton} />
				)}
				<div className='tag-container'>
					{query.map((t: TagQuery, index: number) => (
						<Tag key={index} index={index} name={t.category} value={t.value} color={t.color} onRemove={handleRemoveTag} />
					))}
				</div>
			</div>
			<div></div>
			<div className='schematic-container'>{schematicArray}</div>
			<div className='schematic-container-footer'>
				{isLoading ? (
					<div className='loading-spinner'></div>
				) : (
					<button className='load-more-button' onClick={() => loadPage(page)}>
						{hasMoreContent ? 'Load more' : 'No schematic left'}
					</button>
				)}
			</div>
			{showSchematicModel === true && currentSchematic !== undefined && buildSchematicInfo(currentSchematic)}
		</div>
	);
};

export default Schematic;
