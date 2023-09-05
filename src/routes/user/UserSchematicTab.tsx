import { API } from 'src/API';
import Schematic from 'src/data/Schematic';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import IfTrue from 'src/components/IfTrue';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import User from 'src/data/User';
import { usePopup } from 'src/context/PopupMessageProvider';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import PreviewContainer from 'src/components/PreviewContainer';
import { SchematicInfo, SchematicPreview } from 'src/routes/schematic/SchematicPage';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';

interface UserSchematicTabProps {
	user: User;
}

export default function UserSchematicTab({ user }: UserSchematicTabProps) {
	const currentSchematic = useRef<Schematic>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Schematic>(`user/${user.id}/schematic`, 20);
	const { pages } = useInfiniteScroll(usePage, (v) => <SchematicPreview key={v.id} schematic={v} handleOpenModel={handleOpenSchematicInfo} />);

	function handleDeleteSchematic(schematic: Schematic) {
		setVisibility(false);
		API.deleteSchematic(schematic.id) //
			.then(() => addPopup(i18n.t('schematic.delete-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('schematic.delete-fail'), 5, 'warning'))
			.finally(() => usePage.filter((sc) => sc !== schematic));
	}

	function handleOpenSchematicInfo(schematic: Schematic) {
		currentSchematic.current = schematic;
		setVisibility(true);
	}

	return (
		<main id='schematic-tab' className='flex flex-col gap-2 p-2 box-border w-full h-full overflow-y-auto'>
			<PreviewContainer children={pages} />
			<footer className='flex justify-center items-center'>
				<ScrollToTopButton containerId='schematic-tab' />
			</footer>
			<IfTrue
				condition={currentSchematic}
				whenTrue={
					currentSchematic.current &&
					model(
						<SchematicInfo
							schematic={currentSchematic.current} //
							handleCloseModel={() => setVisibility(false)}
							handleDeleteSchematic={handleDeleteSchematic}
						/>,
					)
				}
			/>
		</main>
	);
}
