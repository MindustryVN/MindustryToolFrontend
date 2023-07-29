import 'src/styles.css';

import { API } from 'src/API';
import { Trans } from 'react-i18next';
import Schematic from 'src/data/Schematic';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import IfTrue from 'src/components/common/IfTrue';
import Button from 'src/components/button/Button';
import usePage from 'src/hooks/UsePage';
import useModel from 'src/hooks/UseModel';
import User from 'src/data/User';
import usePopup from 'src/hooks/UsePopup';
import IfTrueElse from 'src/components/common/IfTrueElse';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import SchematicContainer from 'src/components/schematic/SchematicContainer';
import { SchematicInfo, SchematicPreview } from 'src/routes/schematic/SchematicPage';

interface UserSchematicTabProps {
	user: User;
}

export default function UserSchematicTab(props: UserSchematicTabProps) {
	const currentSchematic = useRef<Schematic>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const { pages, isLoading, hasMore, loadPage, reloadPage } = usePage<Schematic>(`user/schematic/${props.user.id}`, 20);

	function handleDeleteSchematic(schematic: Schematic) {
		API.deleteSchematic(schematic.id) //
			.then(() => {
				addPopup(i18n.t('schematic.delete-success'), 5, 'info');
				reloadPage();
				setVisibility(false);
			})
			.catch(() => addPopup(i18n.t('schematic.delete-fail'), 5, 'warning'));
	}

	function handleOpenSchematicInfo(schematic: Schematic) {
		currentSchematic.current = schematic;
		setVisibility(true);
	}

	return (
		<main id='schematic-tab' className='flex-column small-gap w100p h100p scroll-y'>
			<SchematicContainer
				children={pages.map((schematic) => (
					<SchematicPreview
						key={schematic.id}
						schematic={schematic} //
						handleOpenModel={handleOpenSchematicInfo}
					/>
				))}
			/>
			<footer className='flex-center'>
				<IfTrueElse
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
					whenFalse={
						<Button onClick={() => loadPage()}>
							<IfTrueElse
								condition={hasMore} //
								whenTrue={<Trans i18nKey='load-more' />}
								whenFalse={<Trans i18nKey='no-more' />}
							/>
						</Button>
					}
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
