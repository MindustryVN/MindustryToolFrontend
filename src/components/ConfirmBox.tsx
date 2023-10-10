import React, { ReactNode } from 'react';
import { Trans } from 'react-i18next';
import Button from 'src/components/Button';
import ClearIconButton from 'src/components/ClearIconButton';
import Dialog from 'src/components/Dialog';
import i18n from 'src/util/I18N';

interface ConfirmBoxProps {
	className?: string;
	children: ReactNode;
	onClose: () => void;
	onConfirm: () => void;
}

export default function ConfirmBox({ className, children, onClose, onConfirm }: ConfirmBoxProps) {
	return (
		<Dialog className={className}>
			<section className='center flex w-[50vw] flex-col gap-4 rounded-lg border-2 border-black bg-slate-950 p-4 md:w-[30vw]'>
				<span className='flex flex-row justify-between'>
					{children}
					<ClearIconButton title={i18n.t('quit')} icon='/assets/icons/quit.png' onClick={() => onClose()} />
				</span>
				<section className='box-border flex w-full flex-row justify-end gap-2'>
					<Button className='flex-1 bg-slate-950' title={i18n.t('cancel').toString()} onClick={() => onClose()}>
						<Trans i18nKey='cancel' />
					</Button>
					<Button className='flex-1 bg-slate-950' title={i18n.t('confirm').toString()} onClick={() => onConfirm()}>
						<Trans i18nKey='confirm' />
					</Button>
				</section>
			</section>
		</Dialog>
	);
}
