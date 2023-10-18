import { API } from 'src/API';
import Schematic from 'src/data/Schematic';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import { usePopup } from 'src/context/PopupMessageProvider';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import { SchematicUploadPreview } from 'src/routes/admin/verify/VerifySchematicPage';
import { SchematicUploadInfo } from '../admin/verify/VerifySchematicPage';
import InfiniteScroll from 'src/components/InfiniteScroll';

export default function MeSchematicUploadTab() {
	const currentSchematic = useRef<Schematic>();

	const addPopup = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Schematic>(`user/schematic-upload`, 20);

	function rejectSchematic(schematic: Schematic, reason: string) {
		setVisibility(false);
		API.rejectSchematic(schematic, reason) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info')) //
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => usePage.filter((sc) => sc !== schematic));
	}

	function handleOpenSchematicInfo(schematic: Schematic) {
		currentSchematic.current = schematic;
		setVisibility(true);
	}

	return (
		<main id='schematic-tab' className='flex h-full w-full flex-col gap-2 overflow-y-auto'>
			<InfiniteScroll className='preview-container' infinitePage={usePage} mapper={(v) => <SchematicUploadPreview key={v.id} schematic={v} handleOpenModel={handleOpenSchematicInfo} />} />
			<footer className='flex items-center justify-center'>
				<ScrollToTopButton containerId='schematic-tab' />
			</footer>
			{currentSchematic.current &&
				model(
					<SchematicUploadInfo
						schematic={currentSchematic.current} //
						handleCloseModel={() => setVisibility(false)}
						handleRejectSchematic={rejectSchematic}
						handleVerifySchematic={() => {}}
					/>,
				)}
		</main>
	);
}
