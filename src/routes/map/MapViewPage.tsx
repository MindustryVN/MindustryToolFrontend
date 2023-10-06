import { API } from 'src/API';
import { Trans } from 'react-i18next';
import { MapInfo } from 'src/routes/map/MapPage';
import { useNavigate, useParams } from 'react-router-dom';

import i18n from 'src/util/I18N';
import React from 'react';
import useQuery from 'src/hooks/UseQuery';
import { usePopup } from 'src/context/PopupMessageProvider';
import Map from 'src/data/Map';
import LoadingSpinner from 'src/components/LoadingSpinner';

export default function MapPreviewPage() {
	const { mapId } = useParams();
	const { data, isLoading, isError } = useQuery<Map>(`map/${mapId}`);

	const navigate = useNavigate();

	const addPopup = usePopup();

	let map = data;

	function handleDeleteMap(map: Map) {
		API.deleteMap(map.id) //
			.then(() => addPopup(i18n.t('map.delete-success'), 5, 'info'))
			.then(() => navigate('/map'))
			.catch(() => addPopup(i18n.t('map.delete-fail'), 5, 'warning'));
	}

	if (isLoading) return <LoadingSpinner />;

	if (isError || !map)
		return (
			<div className='flex h-full w-full items-center justify-center'>
				<Trans i18nKey='map-not-found' />
			</div>
		);

	return (
		<MapInfo //
			map={map}
			handleCloseModel={() => navigate('/map')}
			handleDeleteMap={handleDeleteMap}
		/>
	);
}
