import React, { ReactNode } from 'react';
import ClearButton from 'src/components/button/ClearButton';

interface Switch {
	id: string;
	name: ReactNode;
	element: ReactNode;
}

interface SwitchBarProps {
	elements: Switch[];
}

export default function SwitchBar({ elements }: SwitchBarProps) {
	const [currentElement, setCurrentElement] = React.useState<Switch>(elements[0]);

	function renderCurrentElement() {
		const cur = elements.find((element) => element.id === currentElement.id);

		if (cur) return <React.Fragment key={cur.id}>{cur.element}</React.Fragment>;

		return <div>No matching element</div>;
	}

	return (
		<div>
			<section className='flex flex-row gap-2 p-4'>
				{elements.map((element) => (
					<ClearButton className={`capitalize py-2 ${currentElement.id === element.id ? 'border-b-2' : ''} `} key={element.id} onClick={() => setCurrentElement(element)}>
						{element.name}
					</ClearButton>
				))}
			</section>
			{renderCurrentElement()}
		</div>
	);
}
