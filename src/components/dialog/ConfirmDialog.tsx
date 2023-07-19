import React, { ReactNode } from 'react';
import { Trans } from 'react-i18next';
import Button from 'src/components/button/Button';
import Dialog from 'src/components/dialog/Dialog';
import i18n from 'src/util/I18N';

interface ConfirmDialogProps {
	className?: string;
	children: ReactNode;
	onClose: () => void;
	onConfirm: () => void;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
	return (
		<Dialog className={props.className}>
			<section className='flex-column center w100p'>
				<span className='flex-row w100p medium-padding gray-background border-box'>{props.children}</span>
				<section className='grid-row big-gap w100p medium-padding border-box black-background'>
					<Button title={i18n.t('cancel').toString()} onClick={() => props.onClose()}>
						<Trans i18nKey='cancel' />
					</Button>
					<Button title={i18n.t('confirm').toString()} onClick={() => props.onConfirm()}>
						<Trans i18nKey='confirm' />
					</Button>
				</section>
			</section>
		</Dialog>
	);
}
