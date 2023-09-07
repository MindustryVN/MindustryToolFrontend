import React, { ReactNode } from 'react';
import { Trans } from 'react-i18next';
import Button from 'src/components/Button';
import Dialog from 'src/components/Dialog';
import i18n from 'src/util/I18N';

interface ConfirmDialogProps {
	className?: string;
	children: ReactNode;
	onClose: () => void;
	onConfirm: () => void;
}

export default function ConfirmDialog({ className, children, onClose, onConfirm }: ConfirmDialogProps) {
	return (
		<Dialog className={className}>
			<section className='flex flex-col center border-slate-500 rounded-lg border-2 p-2 bg-slate-900 w-[50vw] md:w-[30vw]'>
				<section className='flex flex-row w-full py-4 box-border'>{children}</section>
				<section className='flex flex-row justify-end gap-4 w-full px-2 box-border'>
					<Button className='bg-slate-950 flex-1' title={i18n.t('cancel').toString()} onClick={() => onClose()}>
						<Trans i18nKey='cancel' />
					</Button>
					<Button className='bg-slate-950 flex-1' title={i18n.t('confirm').toString()} onClick={() => onConfirm()}>
						<Trans i18nKey='confirm' />
					</Button>
				</section>
			</section>
		</Dialog>
	);
}
