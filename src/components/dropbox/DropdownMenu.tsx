import './DropdownMenu.css';
import 'src/styles.css';

import React, { ReactNode, useState } from 'react';
import IfTrue from 'src/components/common/IfTrue';
import Button from 'src/components/button/ClearButton';

interface DropdownMenuProps {
	className?: string;
	parent: ReactNode;
	children: ReactNode;
}

export default function DropdownMenu(props: DropdownMenuProps) {
	const [open, setOpen] = useState(false);

	return (
		<Button className={`dropdown flex-column relative ${props.className ? props.className : ''}`} onClick={() => setOpen((prev) => !prev)}>
			{props.parent}
			<section className='dropdown-icon'>{open ? <img src='/assets/icons/play-2.png' alt='button' /> : <img src='/assets/icons/down-vote.png' alt='button' />}</section>
			<section className='dropdown-container'>
				<IfTrue condition={open} whenTrue={<section className='absolute w100p flex-column small-gap small-padding'>{props.children}</section>} />
			</section>
		</Button>
	);
}
