import 'src/styles.css';

import { API } from 'src/API';
import Map from 'src/data/Map';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import IfTrue from 'src/components/common/IfTrue';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import User from 'src/data/User';
import usePopup from 'src/hooks/UsePopup';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import ScrollToTopButton from 'src/components/button/ScrollToTopButton';
import MapContainer from 'src/components/map/MapContainer';
import { MapInfo, MapPreview } from 'src/routes/map/MapPage';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';

interface UserMapTabProps {
	user: User;
}

export default function UserMapTab(props: UserMapTabProps) {
	const currentMap = useRef<Map>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Map>(`user/map/${props.user.id}`, 20);
	const { pages, isLoading, reloadPage } = useInfiniteScroll(usePage, (v) => <MapPreview map={v} key={v.id} handleOpenModel={handleOpenMapInfo} />);

	function handleDeleteMap(map: Map) {
		setVisibility(false);
		API.deleteMap(map.id) //
			.then(() => addPopup(i18n.t('map.delete-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('map.delete-fail'), 5, 'warning'))
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
						<MapInfo
							map={currentMap.current} //
							handleCloseModel={() => setVisibility(false)}
							handleDeleteMap={handleDeleteMap}
						/>,
					)
				}
			/>
		</main>
	);
}
