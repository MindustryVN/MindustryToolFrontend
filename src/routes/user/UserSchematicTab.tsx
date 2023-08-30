import 'src/styles.css';

import { API } from 'src/API';
import Schematic from 'src/data/Schematic';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import IfTrue from 'src/components/common/IfTrue';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import User from 'src/data/User';
import { usePopup } from 'src/context/PopupMessageProvider';
import LoadingSpinner from 'src/components/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import SchematicContainer from 'src/components/schematic/SchematicContainer';
import { SchematicInfo, SchematicPreview } from 'src/routes/schematic/SchematicPage';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';

interface UserSchematicTabProps {
	user: User;
}

export default function UserSchematicTab(props: UserSchematicTabProps) {
	const currentSchematic = useRef<Schematic>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Schematic>(`user/${props.user.id}/schematic`, 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <SchematicPreview key={v.id} schematic={v} handleOpenModel={handleOpenSchematicInfo} />);

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
		<main id='schematic-tab' className='flex-column small-gap w100p h100p scroll-y'>
			<SchematicContainer children={pages} />
			<footer className='flex-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>
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
