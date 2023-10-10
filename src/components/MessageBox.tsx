import { ReactNode, useState } from 'react';
import { Trans } from 'react-i18next';
import Button from 'src/components/Button';
import ClearIconButton from 'src/components/ClearIconButton';
import i18n from 'src/util/I18N';

interface MessageBoxProps {
	children: ReactNode;
	onSubmit: (content: string) => void;
	onClose: () => void;
}

export function MessageBox({ children, onSubmit, onClose }: MessageBoxProps) {
	const [content, setContent] = useState<string>('');

	return (
		<section className='flex h-[20vh] w-[80vw] flex-col gap-2 rounded-lg border-2 border-slate-500 bg-slate-950 p-2 md:h-[50vh] md:w-[50vw]'>
			<span className='flex flex-row justify-between p-2'>
				{children}
				<ClearIconButton title={i18n.t('quit')} icon='/assets/icons/quit.png' onClick={() => onClose()} />
			</span>
			<textarea className='h-full w-full resize-none rounded-lg border-2 border-slate-500 bg-transparent p-1 outline-none' title='reason' onChange={(event) => setContent(event.target.value)} />
			<section className='box-border flex w-full flex-row justify-end gap-4'>
				<Button className='flex-1 bg-slate-950' title={i18n.t('cancel').toString()} onClick={() => onClose()}>
					<Trans i18nKey='cancel' />
				</Button>
				<Button className='flex-1 bg-slate-950' title={i18n.t('reject')} onClick={() => onSubmit(content)}>
					<Trans i18nKey='reject' />
				</Button>
			</section>
		</section>
	);
}
