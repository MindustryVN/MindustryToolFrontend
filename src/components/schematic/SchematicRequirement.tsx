import 'src/styles.css';

import React from 'react';
import { ItemRequirement } from 'src/components/schematic/SchematicData';

interface SchematicRequirementProps {
	requirement: ItemRequirement[];
}

export default function SchematicRequirement(props: SchematicRequirementProps) {
	if (!props.requirement) return <></>;

	return (
		<section className=' flex-row flex-wrap medium-gap'>
			{props.requirement.map((r, index) => (
				<span key={index} className='flex-row center'>
					<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
					<span> {r.amount} </span>
				</span>
			))}
		</section>
	);
}
