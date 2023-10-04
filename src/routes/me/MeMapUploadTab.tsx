import { API } from 'src/API';
import Map from 'src/data/Map';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import { usePopup } from 'src/context/PopupMessageProvider';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import { MapUploadInfo, MapUploadPreview } from 'src/routes/admin/verify/VerifyMapPage';
import InfiniteScroll from 'src/components/InfiniteScroll';

export default function UserMapUploadTab() {
	const currentMap = useRef<Map>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Map>(`user/map-upload`, 20);

	function rejectMap(map: Map, reason: string) {
		setVisibility(false);
		API.rejectMap(map, reason) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info')) //
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => usePage.filter((m) => m !== map));
	}

	function handleOpenMapInfo(map: Map) {
		currentMap.current = map;
		setVisibility(true);
	}

	return (
		<main id='map-tab' className='flex h-full w-full flex-col gap-2 overflow-y-auto'>
			<InfiniteScroll className='preview-container' infinitePage={usePage} mapper={(v) => <MapUploadPreview key={v.id} map={v} handleOpenModel={handleOpenMapInfo} />} />
			<footer className='flex items-center justify-center'>
				<ScrollToTopButton containerId='map-tab' />
			</footer>
			{currentMap.current &&
				model(
					<MapUploadInfo
						map={currentMap.current} //
						handleCloseModel={() => setVisibility(false)}
						handleRejectMap={rejectMap}
						handleVerifyMap={() => {}}
					/>,
				)}
		</main>
	);
}
