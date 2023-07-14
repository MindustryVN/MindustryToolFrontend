import 'src/styles.css';

import React from 'react';
import SchematicData from 'src/components/schematic/SchematicData';

interface SchematicRequirementProps {
	schematic: SchematicData;
}

export default function SchematicRequirement(props: SchematicRequirementProps) {
	if (!props.schematic.requirement) return <></>;

	return (
		<section className=' flex-row flex-wrap medium-gap'>
			{props.schematic.requirement.map((r, index) => (
				<span key={index} className='flex-row center'>
					<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
					<span> {r.amount} </span>
				</span>
			))}
		</section>
	);
}
