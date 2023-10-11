import React, { HTMLProps } from 'react';
import { Trans } from 'react-i18next';
import Button from 'src/components/Button';
import { BackIcon } from 'src/components/Icon';
import i18n from 'src/util/I18N';

interface BackButtonProps {
	onClick: () => void;
}

export default function BackButton({ onClick, ...props }: BackButtonProps & HTMLProps<HTMLButtonElement>) {
	return (
		<Button className='flex items-center justify-center gap-1 p-1' title={i18n.t('back')} onClick={() => onClick()} {...props}>
			<BackIcon className='h-4 w-4' />
			<Trans className='text-center' i18nKey='back' />
		</Button>
	);
}
