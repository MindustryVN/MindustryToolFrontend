import 'src/styles.css';

import { API } from 'src/API';
import { Trans } from 'react-i18next';
import { SchematicInfo } from 'src/routes/schematic/SchematicPage';
import { useNavigate, useParams } from 'react-router-dom';

import i18n from 'src/util/I18N';
import React from 'react';
import useQuery from 'src/hooks/UseQuery';
import usePopup from 'src/hooks/UsePopup';
import Schematic from 'src/data/Schematic';
import LoadingSpinner from 'src/components/loader/LoadingSpinner';

export default function SchematicPreviewPage() {
	const { schematicId } = useParams();
	const { data, isLoading, isError } = useQuery<Schematic>(`schematic/${schematicId}`, {
		id: '',
		name: '',
		data: '',
		authorId: '',
		description: '',
		requirement: [],
		tags: [],
		like: 0,
		verifyAdmin: '',
	});

	const navigate = useNavigate();

	const { addPopup } = usePopup();

	let schematic = data;

	function handleDeleteSchematic(schematic: Schematic) {
		API.deleteSchematic(schematic.id) //
			.then(() => addPopup(i18n.t('schematic.delete-success'), 5, 'info'))
			.then(() => navigate('/schematic'))
			.catch(() => addPopup(i18n.t('schematic.delete-fail'), 5, 'warning'));
	}

	if (isLoading) return <LoadingSpinner />;

	if (isError)
		return (
			<div>
				<Trans i18nKey='schematic-not-found' />
			</div>
		);

	return (
		<SchematicInfo //
			schematic={schematic}
			handleCloseModel={() => navigate('/schematic')}
			handleDeleteSchematic={handleDeleteSchematic}
		/>
	);
}
