import './SchematicCard.css';
import '../../styles.css';

import React, { ReactNode } from 'react';
import SchematicData from './SchematicData';
import LoadUserName from '../user/LoadUserName';
import Tag, { TagChoice } from '../tag/Tag';

interface SchematicCardProps {
	schematic: SchematicData;
	imageUrl: string;
	buttons: ReactNode;
}

export default function SchematicCard(props: SchematicCardProps) {
	return (
		<section className='schematic-card small-gap'>
			<section className='flex-row medium-gap flex-wrap'>
				<img className='schematic-image' src={props.imageUrl} />
				<section className='flex-column small-gap flex-wrap'>
					<span className='capitalize'>{props.schematic.name}</span>
					<LoadUserName userId={props.schematic.authorId} />
					{props.schematic.description && <span className='capitalize'>{props.schematic.description}</span>}
					{props.schematic.requirement && (
						<section className=' flex-row flex-wrap medium-gap'>
							{props.schematic.requirement.map((r, index) => (
								<span key={index} className='text-center'>
									<img className='small-icon ' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
									<span> {r.amount} </span>
								</span>
							))}
						</section>
					)}
					{props.schematic.tags && (
						<section className='flex-row flex-wrap small-gap'>
							{TagChoice.parseArray(props.schematic.tags, TagChoice.SCHEMATIC_SEARCH_TAG).map((t: TagChoice, index: number) => (
								<Tag key={index} tag={t} />
							))}
						</section>
					)}
				</section>
			</section>
			<section className='grid-row small-gap'>{props.buttons}</section>
		</section>
	);
}
