import React, { ReactNode } from 'react';
import ClearButton from 'src/components/ClearButton';
import i18n from 'src/util/I18N';
import { cn } from 'src/util/Utils';

interface Switch {
	id: string;
	name: ReactNode;
	element: ReactNode;
}

interface SwitchBarProps {
	className?: string;
	elements: Switch[];
}

export default function SwitchBar({ className, elements }: SwitchBarProps) {
	const [currentElement, setCurrentElement] = React.useState<Switch>(elements[0]);

	function renderCurrentElement() {
		const cur = elements.find((element) => element.id === currentElement.id);

		if (cur) return <React.Fragment key={cur.id}>{cur.element}</React.Fragment>;

		throw new Error('No matching element for Switcher');
	}

	return (
		<div className={cn('flex flex-col', className)}>
			<section className='no-scrollbar flex h-fit w-full flex-shrink-0 flex-row gap-4 overflow-x-auto'>
				{elements.map((element) => (
					<ClearButton
						className={cn(`whitespace-nowrap py-2 capitalize`, {
							'border-b-2': currentElement.id === element.id,
						})}
						title={i18n.t(element.id)}
						key={element.id}
						onClick={() => setCurrentElement(element)}>
						{element.name}
					</ClearButton>
				))}
			</section>
			{renderCurrentElement()}
		</div>
	);
}
