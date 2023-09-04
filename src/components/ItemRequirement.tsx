import React from 'react';
import { ItemRequirement } from 'src/data/Schematic';

interface ItemRequirementCardProps {
	requirement: ItemRequirement[];
}

export default function ItemRequirementCard(props: ItemRequirementCardProps) {
	if (!props.requirement) return <></>;

	return (
		<section className=' flex flex-row flex-wrap gap-2'>
			{props.requirement.map((r, index) => (
				<span key={index} className='flex flex-row justify-center items-center'>
					<img className='h-4 w-4' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
					<span> {r.amount} </span>
				</span>
			))}
		</section>
	);
}
