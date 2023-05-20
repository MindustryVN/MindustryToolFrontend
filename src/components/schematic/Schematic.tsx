import './Schematic.css';

import { SearchIcon, ArrowDownIcon, ArrowUpIcon, CopyIcon, DownloadIcon, DeleteIcon } from '../util/Icon';
import { useState, useEffect, ChangeEvent } from 'react';
import { SCHEMATIC_TAG } from './Tag';
import { useNavigate } from 'react-router-dom';
import { capitalize } from '../util/Util';
import { API } from '../../AxiosConfig';

import SchematicInfo from './SchematicInfo';
import LazyLoadImage from '../util/LazyLoadImage';
import SearchBar from '../shared/SearchBar';
import Dropbox from '../shared/Dropbox';
import React from 'react';
import Tag from '../shared/Tag';

const Schematic = () => {
	const [hasMoreContent, setHasMoreContent] = useState(true);
	const [isLoading, setLoading] = useState(false);

	const [page, setPage] = useState(0);
	const [schematicList, setSchematicList] = useState<SchematicInfo[]>([]);

	const [tag, setTag] = useState(SCHEMATIC_TAG[0]);
	const [content, setContent] = useState('');

	const [query, setQuery] = useState<TagQuery[]>([]);

	const [showSchematicModel, setShowSchematicModel] = useState(false);

	const [currentSchematic, setCurrentSchematic] = useState<SchematicInfo>();

	const navigate = useNavigate();

	useEffect(() => loadPage(page), []);

	function loadPage(page: number) {
		setLoading(true);
		API.get(`schematics/page/${page}`)
			.then((result) => {
				if (result.status === 200 && result.data && result.data.length > 0) {
					setSchematicList([...schematicList, ...result.data]);
					setPage(page + 1);
					if (result.data.length < 10) setHasMoreContent(false);
				} else setHasMoreContent(false);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}

	function handleContentInput(event: ChangeEvent<HTMLInputElement>) {
		if (event) {
			let input = event.target.value;
			setContent(input.trim());
		}
	}

	function handleRemoveTag(index: number) {
		setQuery([...query.filter((_, i) => i !== index)]);
	}

	function handleAddTag() {
		if (query.find((q) => q.category.toLowerCase() === tag.category.toLowerCase()) !== undefined) {
			alert(capitalize(tag.category) + ' tag exists in your search query ');
			return;
		}

		if (tag.getValues() == null || (tag !== null && tag.getValues().find((c: string) => c === content) !== undefined)) {
			setQuery([...query, { category: tag.category, color: tag.color, value: content }]);
		} else alert('Invalid tag ' + tag.category + ': ' + content);
	}

	function buildSchematicInfo(schematic: SchematicInfo | null) {
		if (schematic == null) return <></>;

		var blob = new Blob([schematic.data], { type: 'text/plain' });
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
							<div className='schematic-info-button-container'>
								<div
									className='schematic-info-button'
									onClick={() => {
										if (currentSchematic) {
											currentSchematic.like += 1;
											let schematic = { ...currentSchematic };
											schematicList.map((v) => (v.id === schematic.id ? schematic : v));
											setCurrentSchematic(schematic);
										}
									}}>
									<ArrowUpIcon />
								</div>
								<div
									className='schematic-info-button'
									onClick={() => {
										if (currentSchematic) {
											currentSchematic.dislike += 1;
											let schematic = { ...currentSchematic };
											schematicList.map((v) => (v.id === schematic.id ? schematic : v));
											setCurrentSchematic(schematic);
										}
									}}>
									<ArrowDownIcon />
								</div>
								<a className='schematic-info-button' href={url} download={`${schematic.name}.msch`}>
									<DownloadIcon />
								</a>
								<div
									className='schematic-info-button'
									onClick={() => {
										navigator.clipboard.writeText(schematic.data);
										alert('Copied');
									}}>
									<CopyIcon />
								</div>
								<div className='schematic-info-button'>
									<DeleteIcon />
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
			title='submit'
			className='submit-button'
			onClick={(event) => {
				handleAddTag();
				event.stopPropagation();
			}}>
			<SearchIcon />
		</button>
	);

	return (
		<div className='schematic'>
			<div className='search-container'>
				{
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
				}
				{tag.hasOption() ? (
					<Dropbox value={'Value: ' + content} submitButton={tagSubmitButton}>
						{tag.getValues().map((content: string, index: number) => (
							<div
								key={index}
								onClick={() => {
									setContent(content);
								}}>
								{content}
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
			<div className='schematic-container'>
				{schematicList.map((schematic, index) => (
					<div
						key={index}
						className='schematic-preview'
						onClick={() => {
							setCurrentSchematic(schematic);
							setShowSchematicModel(true);
						}}>
						<LazyLoadImage className='schematic-image' path={`schematics/${schematic.id}/image`}></LazyLoadImage>
						<p className='schematic-preview-description'>{capitalize(schematic.name)}</p>
					</div>
				))}
			</div>
			<div className='schematic-container-footer'>
				{isLoading ? (
					<div className='loading-spinner'></div>
				) : (
					<button className='load-more-button' disabled={!hasMoreContent} onClick={() => loadPage(page)}>
						{hasMoreContent ? 'Load more' : 'No schematic left'}
					</button>
				)}
			</div>
			{showSchematicModel === true && currentSchematic !== undefined && buildSchematicInfo(currentSchematic)}
		</div>
	);
};

export default Schematic;
