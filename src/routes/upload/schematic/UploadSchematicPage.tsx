import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { API } from 'src/API';
import SearchBox from 'src/components/Searchbox';
import { TagChoice } from 'src/components/Tag';
import { PNG_IMAGE_PREFIX, SCHEMATIC_FILE_EXTENSION } from 'src/config/Config';
import i18n from 'src/util/I18N';
import { getFileExtension } from 'src/util/StringUtils';
import { PopupMessageContext } from 'src/context/PopupMessageProvider';
import { Link } from 'react-router-dom';
import TagPick from 'src/components/TagPick';
import { Trans } from 'react-i18next';
import Button from 'src/components/Button';
import TagEditContainer from 'src/components/TagEditContainer';
import LoadUserName from 'src/components/LoadUserName';
import Description from 'src/components/Description';
import ItemRequirement from 'src/components/ItemRequirement';
import ColorText from 'src/components/ColorText';
import LoadingSpinner from 'src/components/LoadingSpinner';
import { useMe } from 'src/context/MeProvider';
import SchematicUploadPreview from 'src/data/SchematicUploadPreview';
import { useTags } from 'src/context/TagProvider';
import Author from 'src/components/Author';

const tabs = ['file', 'code'];

let notLoginMessage = (
	<span>
		<Trans i18nKey='recommend-login' />
		<Link className='p-2' to='/login'>
			<Trans i18nKey='login' />
		</Link>
	</span>
);

export default function UploadSchematicPage() {
	const [currentTab, setCurrentTab] = useState<string>(tabs[0]);
	const [file, setFile] = useState<File>();
	const [code, setCode] = useState<string>('');
	const [preview, setPreview] = useState<SchematicUploadPreview>();
	const [tag, setTag] = useState<string>('');
	const [tags, setTags] = useState<TagChoice[]>([]);

	const [isLoading, setIsLoading] = useState(false);

	const { schematicUploadTag } = useTags();

	const { me, loading } = useMe();
	const popup = useRef(useContext(PopupMessageContext));

	useEffect(() => {
		if (!loading && !me) popup.current.addPopup(notLoginMessage, 20, 'warning');
	}, [me, loading]);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (!files || files.length <= 0 || !files[0]) {
			popup.current.addPopup(i18n.t('invalid-schematic-file'), 5, 'error');
			return;
		}

		const extension: string = getFileExtension(files[0]);

		if (extension !== SCHEMATIC_FILE_EXTENSION) {
			popup.current.addPopup(i18n.t('invalid-schematic-file'), 5, 'error');
			return;
		}

		setFile(files[0]);

		getView(files[0], '');
	}

	function handleCodeChange() {
		navigator.clipboard
			.readText() //
			.then((text) => {
				if (!text.startsWith('bXNja')) {
					popup.current.addPopup(i18n.t('not-schematic-code'), 5, 'warning');
					return;
				}

				setCode(text);
				getView(undefined, text);
			});
	}

	function getView(file: File | undefined, code: string) {
		setIsLoading(true);

		API.getSchematicPreview(code, file) //
			.then((result) => setPreview(result.data)) //
			.catch(() => popup.current.addPopup(i18n.t(`invalid-schematic`), 10, 'error')) //
			.finally(() => setIsLoading(false));
	}

	function handleSubmit() {
		if (!file && !code) {
			popup.current.addPopup(i18n.t('no-data'), 5, 'error');
			return;
		}

		if (!tags || tags.length === 0) {
			popup.current.addPopup(i18n.t('no-tag'), 5, 'error');
			return;
		}

		setIsLoading(true);

		API.postSchematicUpload(code, file, tags)
			.then(() => {
				setCode('');
				setFile(undefined);
				setPreview(undefined);
				setTags([]);
				popup.current.addPopup(i18n.t('upload-success'), 10, 'info');
			})
			.catch((error) => popup.current.addPopup(i18n.t('upload-fail') + ' ' + i18n.t(`${error.response.data}`), 10, 'error')) //
			.finally(() => setIsLoading(false));
	}

	function handleRemoveTag(index: number) {
		setTags((prev) => [...prev.filter((_, i) => i !== index)]);
	}

	function handleAddTag(tag: TagChoice) {
		setTags((prev) => {
			let tags = prev.filter((q) => q !== tag);
			return [...tags, tag];
		});
		setTag('');
	}

	function renderTab(currentTab: string) {
		switch (currentTab) {
			case tabs[0]:
				return (
					<>
						<Button className='p-1' title='' onClick={() => {}}>
							<label className='button' htmlFor='file'>
								<Trans i18nKey='upload-a-file' />
							</label>
						</Button>
						<input className='hidden' id='file' type='file' onChange={(event) => handleFileChange(event)} />
					</>
				);

			case tabs[1]:
				return (
					<Button className='p-1' title={i18n.t('copy-from-clipboard')} onClick={() => handleCodeChange()}>
						<Trans i18nKey='copy-from-clipboard' />
					</Button>
				);

			default:
				return <>No tab</>;
		}
	}

	function checkUploadRequirement() {
		if (!file && !code) return <Trans i18nKey='no-data' />;
		if (!tags || tags.length === 0) return <Trans i18nKey='no-tag' />;

		return <Trans i18nKey='ok' />;
	}

	if (isLoading) return <LoadingSpinner className='flex h-full w-full items-center justify-center' />;

	return (
		<main className='box-border flex h-full w-full flex-col justify-between gap-2 overflow-y-auto p-8'>
			<header className='flex flex-row gap-2'>
				<section className='flex items-center justify-center'>
					<section className='code-file grid-auto-column grid w-fit grid-flow-col gap-2 p-2'>
						{tabs.map((name, index) => (
							<Button
								className='w-fit px-2 py-1'
								active={currentTab === name}
								key={index}
								title={name}
								onClick={() => {
									setFile(undefined);
									setCode('');
									setCurrentTab(name);
								}}>
								<Trans i18nKey={name} />
							</Button>
						))}
					</section>
				</section>
				<section className='flex items-center justify-center'>{renderTab(currentTab)}</section>
			</header>
			{preview && (
				<section className='flex flex-row flex-wrap gap-2'>
					<img className='schematic-info-image' src={PNG_IMAGE_PREFIX + preview.image} alt='Error' />
					<section className='flex flex-row justify-between'>
						<section className='flex flex-row flex-wrap gap-2'>
							<ColorText className='h2 capitalize' text={preview.name} />
							<Author authorId={me ? me.id : 'community'} />
							<Description description={preview.description} />
							<ItemRequirement requirement={preview.requirement} />
							<TagEditContainer tags={tags} onRemove={(index) => handleRemoveTag(index)} />
						</section>
					</section>
					<section className='flex w-full flex-row flex-nowrap gap-2'>
						<SearchBox
							className='w-full h-10'
							placeholder={i18n.t('add-tag').toString()}
							value={tag}
							items={schematicUploadTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
							onChange={(event) => setTag(event.target.value)}
							onChoose={(item) => handleAddTag(item)}
							mapper={(t, index) => <TagPick key={index} tag={t} />}
						/>
					</section>
				</section>
			)}
			<footer className='flex flex-col items-center justify-center gap-2 p-2'>
				<span children={checkUploadRequirement()} />
				<Button className=' w-fit px-2 py-1' title={i18n.t('upload')} onClick={() => handleSubmit()}>
					<Trans i18nKey='upload' />
				</Button>
			</footer>
		</main>
	);
}
