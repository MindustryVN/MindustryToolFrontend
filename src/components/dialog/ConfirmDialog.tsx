import React, { ReactNode } from 'react';
import { Trans } from 'react-i18next';
import Button from 'src/components/button/Button';
import i18n from 'src/util/I18N';

interface ConfirmDialogProps {
	content: ReactNode;
	onClose: () => void;
	onConfirm: () => void;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
	return (
		<section className='flex-column center w100p'>
			<span className='flex-center w100p medium-padding gray-background border-box'>{props.content}</span>
			<section className='grid-row big-gap w100p medium-padding border-box black-background'>
				<Button title={i18n.t('close').toString()} onClick={() => props.onClose()}>
					<Trans i18nKey='close' />
				</Button>
				<Button title={i18n.t('confirm').toString()} onClick={() => props.onConfirm()}>
					<Trans i18nKey='confirm' />
				</Button>
			</section>
		</section>
	);
}
