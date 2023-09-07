import { API } from 'src/API';
import Schematic from 'src/data/Schematic';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import IfTrue from 'src/components/IfTrue';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import { usePopup } from 'src/context/PopupMessageProvider';
import LoadingSpinner from 'src/components/LoadingSpinner';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import PreviewContainer from 'src/components/PreviewContainer';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import { SchematicUploadInfo, SchematicUploadPreview } from 'src/routes/admin/verify/schematic/VerifySchematicPage';

export default function UserSchematicUploadTab() {
	const currentSchematic = useRef<Schematic>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Schematic>(`user/schematic-upload`, 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <SchematicUploadPreview key={v.id} schematic={v} handleOpenModel={handleOpenSchematicInfo} />);

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
		<main id='schematic-tab' className='flex flex-row gap-2 w-full h-full overflow-y-auto'>
			<PreviewContainer children={pages} />
			<footer className='flex justify-center items-center'>
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
						<SchematicUploadInfo
							schematic={currentSchematic.current} //
							handleCloseModel={() => setVisibility(false)}
							handleRejectSchematic={rejectSchematic}
							handleVerifySchematic={() => {}}
						/>,
					)
				}
			/>
		</main>
	);
}
