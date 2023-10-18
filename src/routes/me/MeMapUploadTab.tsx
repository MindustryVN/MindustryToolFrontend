import { API } from 'src/API';
import Map from 'src/data/Map';
import React, { Fragment, useRef, useState } from 'react';

import i18n from 'src/util/I18N';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useModel from 'src/hooks/UseModel';
import { usePopup } from 'src/context/PopupMessageProvider';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import { MapUploadInfo, MapUploadPreview } from 'src/routes/admin/verify/VerifyMapPage';
import InfiniteScroll from 'src/components/InfiniteScroll';
import { cn } from 'src/util/Utils';
import UserMapTab from 'src/routes/user/UserMapTab';
import { useMe } from 'src/context/MeProvider';

export default function MeMap() {
	const [enabled, setEnable] = useState(true);
	const { me } = useMe();

	if (!me) return <Fragment></Fragment>;

	return (
		<div>
			<button
				className={cn('fixed bottom-0 right-0 m-4 flex h-6 w-12 flex-row items-center overflow-hidden rounded-3xl border-2 border-white', {
					'border-green-500': enabled,
				})}
				onClick={() => setEnable((prev) => !prev)}>
				<div
					className={cn('h-6 w-6 rounded-3xl bg-white transition-transform delay-75', {
						'translate-x-[100%]': enabled,
						'bg-green-500': enabled,
					})}
				/>
			</button>
			{enabled ? <UserMapTab user={me} /> : <MeMapUploadTab />}
		</div>
	);
}

function MeMapUploadTab() {
	const currentMap = useRef<Map>();

	const addPopup = usePopup();

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
