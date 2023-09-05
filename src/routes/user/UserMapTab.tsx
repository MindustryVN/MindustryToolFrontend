import { API } from 'src/API';
import Map from 'src/data/Map';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import IfTrue from 'src/components/IfTrue';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import User from 'src/data/User';
import { usePopup } from 'src/context/PopupMessageProvider';
import LoadingSpinner from 'src/components/LoadingSpinner';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import { MapInfo, MapPreview } from 'src/routes/map/MapPage';
import useInfiniteScroll from 'src/hooks/UseInfiniteScroll';
import PreviewContainer from 'src/components/PreviewContainer';

interface UserMapTabProps {
	user: User;
}

export default function UserMapTab({ user }: UserMapTabProps) {
	const currentMap = useRef<Map>();

	const { addPopup } = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Map>(`user/${user.id}/map`, 20);
	const { pages, isLoading } = useInfiniteScroll(usePage, (v) => <MapPreview map={v} key={v.id} handleOpenModel={handleOpenMapInfo} />);

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
