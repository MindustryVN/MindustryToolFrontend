import { API } from 'src/API';
import Map from 'src/data/Map';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import User from 'src/data/User';
import { usePopup } from 'src/context/PopupMessageProvider';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import { MapInfo, MapPreview } from 'src/routes/map/MapPage';
import InfiniteScroll from 'src/components/InfiniteScroll';

interface UserMapTabProps {
	user: User;
}

export default function UserMapTab({ user }: UserMapTabProps) {
	const currentMap = useRef<Map>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Map>(`user/${user.id}/map`, 20);

	function handleDeleteMap(map: Map) {
		setVisibility(false);
		API.deleteMap(map.id) //
			.then(() => addPopup(i18n.t('map.delete-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('map.delete-fail'), 5, 'warning'))
			.finally(() => usePage.filter((m) => m !== map));
	}

	function handleOpenMapInfo(map: Map) {
		currentMap.current = map;
		setVisibility(true);
	}

	return (
		<main id='map-tab' className='box-border flex h-full w-full flex-col gap-2 overflow-y-auto p-2'>
			<InfiniteScroll className='preview-container' infinitePage={usePage} mapper={(v) => <MapPreview map={v} key={v.id} handleOpenModel={handleOpenMapInfo} />} />
			<footer className='flex items-center justify-center'>
				<ScrollToTopButton containerId='map-tab' />
			</footer>
			{currentMap.current &&
				model(
					<MapInfo
						map={currentMap.current} //
						handleCloseModel={() => setVisibility(false)}
						handleDeleteMap={handleDeleteMap}
					/>,
				)}
		</main>
	);
}
