import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { TagChoice, Tags } from 'src/components/Tag';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import SearchBox from 'src/components/Searchbox';
import i18n from 'src/util/I18N';
import ClearIconButton from 'src/components/ClearIconButton';
import TagPick from 'src/components/TagPick';
import TagEditContainer from 'src/components/TagEditContainer';
import { FRONTEND_URL } from 'src/config/Config';
import useClipboard from 'src/hooks/UseClipboard';
import LikeCount from 'src/components/LikeCount';
import IconButton from 'src/components/IconButton';
import useLike from 'src/hooks/UseLike';
import LoadingSpinner from 'src/components/LoadingSpinner';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import DateDisplay from 'src/components/Date';
import TagContainer from 'src/components/TagContainer';
import IfTrue from 'src/components/IfTrue';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import { useTags } from 'src/context/TagProvider';
import OptionBox from 'src/components/OptionBox';
import Author from 'src/components/Author';
import ClearButton from 'src/components/ClearButton';
import { AddIcon } from 'src/components/Icon';

export default function PostPage() {
	const [searchParam, setSearchParam] = useSearchParams();

	const sort = Tags.parse(searchParam.get('sort'), Tags.SORT_TAG);
	const urlTags = searchParam.get('tags');
	const { postSearchTag } = useTags();
	const tags = Tags.parseArray((urlTags ? urlTags : '').split(','), postSearchTag);

	const [tag, setTag] = useState<string>('');

	const navigate = useNavigate();

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
		<main className='flex h-full w-full flex-col gap-2 overflow-y-auto p-2'>
			<span className='flex w-full flex-col gap-2'>
				<section className='m-auto mt-8 flex w-3/4 flex-row flex-wrap items-center justify-start gap-2 md:w-3/5 md:flex-nowrap'>
					<SearchBox
						className='h-10 w-full bg-slate-900'
						placeholder={i18n.t('search-with-tag').toString()}
						value={tag}
						items={postSearchTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tagQuery.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						mapper={(t, index) => <TagPick key={index} tag={t} />}>
						<ClearIconButton className='h-5' icon='/assets/icons/search.png' title='search' onClick={() => loadNextPage()} />
					</SearchBox>
					<OptionBox
						className='h-10 w-full max-w-none bg-slate-900 md:max-w-[10rem]'
						items={Tags.SORT_TAG}
						mapper={(item, index) => (
							<span key={index} className='whitespace-nowrap'>
								{item.displayName}
							</span>
						)}
						onChoose={(item) => handleSetSortQuery(item)}
					/>
				</section>
				<TagEditContainer className='m-auto flex w-3/4 items-center justify-center' tags={tagQuery} onRemove={(index) => handleRemoveTag(index)} />
			</span>
			<section className='flex flex-col gap-2 p-4' children={pages} />
			<section className='fixed bottom-4 right-0 flex flex-col items-center justify-center'>
				<ClearButton title={i18n.t('upload-your-schematic')} onClick={() => navigate('/upload/post')}>
					<AddIcon className='h-10 w-10' />
				</ClearButton>
				<ScrollToTopButton className='h-10 w-10 ' containerId='schematic' />
			</section>
			<footer className='flex w-full items-center justify-center'>
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
		<section role='button' className='relative flex w-full flex-row justify-between rounded-lg bg-slate-900 p-4'>
			<div className='flex h-full w-full flex-col justify-between gap-2' onClick={() => navigate(`post/${post.id}`)}>
				<span className='flex flex-col gap-2'>
					<span className='title text-2xl'>{post.header}</span>
					<Author authorId={post.authorId} />
					<TagContainer tags={Tags.parseArray(post.tags, postSearchTag)} />
				</span>
				<section className='flex flex-col'>
					<section className='flex w-full flex-row gap-2'>
						<IconButton className='px-2 py-1' title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
						<LikeCount className='h-8 w-8 p-2' count={likeService.likes} />
						<IconButton className='px-2 py-1' title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
					</section>
				</section>
			</div>
			<div>
				<ClearIconButton
					className='flex h-8 w-8 flex-col justify-start p-2 align-top'
					title={i18n.t('copy-link').toString()}
					icon='/assets/icons/copy.png'
					onClick={() => copy(`${FRONTEND_URL}post/post/${post.id}`)}
				/>
			</div>
			<DateDisplay className='align-self-end absolute bottom-0 right-0 p-2' time={post.time} />
		</section>
	);
}
