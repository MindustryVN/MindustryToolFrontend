import 'src/styles.css';

import { API } from 'src/API';
import { Trans } from 'react-i18next';
import { MapInfo } from 'src/routes/map/MapPage';
import { useNavigate, useParams } from 'react-router-dom';

import i18n from 'src/util/I18N';
import React from 'react';
import useQuery from 'src/hooks/UseQuery';
import usePopup from 'src/hooks/UsePopup';
import Map from 'src/data/Map';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';

export default function MapPreviewPage() {
	const { mapId } = useParams();
	const { data, isLoading, isError } = useQuery<Map>(`map/${mapId}`, {
		id: '',
		name: '',
		data: '',
		authorId: '',
		description: '',
		tags: [],
		like: 0,
		verifyAdmin: '',
	});

	const navigate = useNavigate();

	const { addPopup } = usePopup();

	let map = data;

	function handleDeleteMap(map: Map) {
		API.deleteMap(map.id) //
			.then(() => addPopup(i18n.t('map.delete-success'), 5, 'info'))
			.then(() => navigate('/map'))
			.catch(() => addPopup(i18n.t('map.delete-fail'), 5, 'warning'));
	}

	if (isLoading) return <LoadingSpinner />;

	if (isError)
		return (
			<div className='flex-center w100p h100p'>
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
