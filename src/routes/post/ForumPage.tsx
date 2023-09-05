import './ForumPage.css';

import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { TagChoice, Tags } from 'src/components/Tag';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import SearchBox from 'src/components/Searchbox';
import i18n from 'src/util/I18N';
import ClearIconButton from 'src/components/ClearIconButton';
import TagPick from 'src/components/TagPick';
import TagEditContainer from 'src/components/TagEditContainer';
import Button from 'src/components/Button';
import { FRONTEND_URL } from 'src/config/Config';
import useClipboard from 'src/hooks/UseClipboard';
import LikeCount from 'src/components/LikeCount';
import IconButton from 'src/components/IconButton';
import useLike from 'src/hooks/UseLike';
import LoadingSpinner from 'src/components/LoadingSpinner';
import { Trans } from 'react-i18next';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import DateDisplay from 'src/components/Date';
import LoadUserName from 'src/components/LoadUserName';
import TagContainer from 'src/components/TagContainer';
import IfTrue from 'src/components/IfTrue';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import { useTags } from 'src/context/TagProvider';

export default function ForumPage() {
	const [searchParam, setSearchParam] = useSearchParams();

	const sort = Tags.parse(searchParam.get('sort'), Tags.SORT_TAG);
	const urlTags = searchParam.get('tags');
	const { postSearchTag } = useTags();
	const tags = Tags.parseArray((urlTags ? urlTags : '').split(','), postSearchTag);

	const [tag, setTag] = useState<string>('');

	const sortQuery = sort ? sort : Tags.SORT_TAG[0];
	const tagQuery = tags;

	const searchConfig = useRef({
		params: {
			tags: Tags.toString(tagQuery), //
			sort: sortQuery.toString(),
		},
	});

	const usePage = useInfinitePage<Post>('post', 20, searchConfig.current);

	const { pages, isLoading, loadNextPage } = useInfiniteScroll(usePage, (v) => <PostPreview key={v.id} post={v} />);

	const navigate = useNavigate();

	function setSearchConfig(sort: TagChoice, tags: TagChoice[]) {
		searchConfig.current = {
			params: {
				tags: Tags.toString(tags), //
				sort: sort.toString(),
			},
		};

		setSearchParam(searchConfig.current.params);
	}

	function handleSetSortQuery(sort: TagChoice) {
		setSearchConfig(sort, tagQuery);
	}

	function handleRemoveTag(index: number) {
		let t = tags.filter((_, i) => i !== index);
		setSearchConfig(sortQuery, t);
	}

	function handleAddTag(tag: TagChoice) {
		let t = tags.filter((q) => q !== tag);
		t.push(tag);
		setSearchConfig(sortQuery, t);
		setTag('');
	}

	return (
		<main className='h-full w-full overflow-y-auto flex flex-row gap-2 p-2'>
			<header className='flex flex-row gap-2 w-full'>
				<section className='search-container'>
					<SearchBox
						placeholder={i18n.t('search-with-tag').toString()}
						value={tag}
						items={postSearchTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tagQuery.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						mapper={(t, index) => <TagPick key={index} tag={t} />}>
						<ClearIconButton icon='/assets/icons/search.png' title='search' onClick={() => loadNextPage()} />
					</SearchBox>
				</section>
				<TagEditContainer className='center' tags={tagQuery} onRemove={(index) => handleRemoveTag(index)} />
				<section className='sort-container grid grid-auto-column grid-flow-col w-fit gap-2 center'>
					{Tags.SORT_TAG.map((c: TagChoice) => (
						<Button className='capitalize' key={c.name + c.value} title={i18n.t(c.name)} active={c === sortQuery} onClick={() => handleSetSortQuery(c)}>
							{c.displayName}
						</Button>
					))}
				</section>
				<section className='flex flex-row p-2 justify-end'>
					<Button title={i18n.t('write-a-post')} onClick={() => navigate('/upload/post')}>
						<Trans i18nKey='write-a-post' />
					</Button>
				</section>
			</header>
			<section className='flex flex-row gap-2' children={pages} />
			<footer className='flex justify-center items-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>
				<ScrollToTopButton containerId='schematic' />
			</footer>
		</main>
	);
}

interface PostPreviewProps {
	post: Post;
}

function PostPreview({ post }: PostPreviewProps) {
	const { copy } = useClipboard();
	const navigate = useNavigate();
	const { postSearchTag } = useTags();

	const likeService = useLike('post', post.id, post.like);
	post.like = likeService.likes;

	return (
		<section role='button' className='post-preview-card relative flex flex-row gap-2 medium-padding space-between' onClick={() => navigate(`post/${post.id}`)}>
			<header className='flex flex-row gap-2'>
				<span className='title'>{post.header}</span>
				<LoadUserName userId={post.authorId} />
				<TagContainer tags={Tags.parseArray(post.tags, postSearchTag)} />
			</header>
			<section className='flex flex-row'>
				<section className='grid grid-auto-column grid-flow-col w-fit gap-2'>
					<IconButton title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
					<LikeCount count={likeService.likes} />
					<IconButton title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
				</section>
			</section>
			<DateDisplay className='absolute bottom right small-margin align-self-end' time={post.time} />
			<ClearIconButton
				className='absolute top-0 right p-2 small-margin'
				title={i18n.t('copy-link').toString()}
				icon='/assets/icons/copy.png'
				onClick={() => copy(`${FRONTEND_URL}post/post/${post.id}`)}
			/>
		</section>
	);
}
