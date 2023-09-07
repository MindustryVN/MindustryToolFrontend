import { API } from 'src/API';
import Map from 'src/data/Map';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import IfTrue from 'src/components/IfTrue';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import { usePopup } from 'src/context/PopupMessageProvider';
import LoadingSpinner from 'src/components/LoadingSpinner';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import { MapUploadInfo, MapUploadPreview } from 'src/routes/admin/verify/map/VerifyMapPage';
import PreviewContainer from 'src/components/PreviewContainer';

export default function UserMapUploadTab() {
	const currentMap = useRef<Map>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Map>(`user/map-upload`, 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <MapUploadPreview key={v.id} map={v} handleOpenModel={handleOpenMapInfo} />);

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
		<main id='map-tab' className='flex flex-row gap-2 w-full h-full overflow-y-auto'>
			<PreviewContainer children={pages} />
			<footer className='flex justify-center items-center'>
				<IfTrue
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
				/>
				<ScrollToTopButton containerId='map-tab' />
			</footer>
			<IfTrue
				condition={currentMap}
				whenTrue={
					currentMap.current &&
					model(
						<MapUploadInfo
							map={currentMap.current} //
							handleCloseModel={() => setVisibility(false)}
							handleRejectMap={rejectMap}
							handleVerifyMap={() => {}}
						/>,
					)
				}
			/>
		</main>
	);
}
