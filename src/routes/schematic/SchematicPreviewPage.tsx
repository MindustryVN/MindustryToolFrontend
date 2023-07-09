import React from 'react';
import { useParams } from 'react-router-dom';

export default function SchematicPreviewPage() {
	const { schematicId } = useParams();

	return <main>{schematicId}</main>;
}
