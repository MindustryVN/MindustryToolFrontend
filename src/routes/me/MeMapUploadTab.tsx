import 'src/styles.css';

import { API } from 'src/API';
import Map from 'src/data/Map';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import IfTrue from 'src/components/common/IfTrue';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import usePopup from 'src/hooks/UsePopup';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import MapContainer from 'src/components/map/MapContainer';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import { MapUploadInfo, MapUploadPreview } from 'src/routes/admin/verify/map/VerifyMapPage';

export default function UserMapUploadTab() {
	const currentMap = useRef<Map>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Map>(`user/map-upload`, 20);
	const { pages, isLoading, reloadPage } = useInfiniteScroll(usePage, (v) => <MapUploadPreview map={v} handleOpenModel={handleOpenMapInfo} />);

	function rejectMap(map: Map, reason: string) {
		setVisibility(false);
		API.rejectMap(map, reason) //
			.then(() => addPopup(i18n.t('delete-success'), 5, 'info')) //
			.catch(() => addPopup(i18n.t('delete-fail'), 5, 'error'))
			.finally(() => reloadPage());
	}

	function handleOpenMapInfo(map: Map) {
		currentMap.current = map;
		setVisibility(true);
	}

	return (
		<main id='map-tab' className='flex-column small-gap w100p h100p scroll-y'>
			<MapContainer children={pages} />
			<footer className='flex-center'>
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
