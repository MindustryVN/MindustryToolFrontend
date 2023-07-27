import 'src/styles.css';
import './MindustryServerPage.css';

import React, { useState } from 'react';
import MindustryServer from 'src/data/MindustryServer';
import usePage from 'src/hooks/UsePage';
import Button from 'src/components/button/Button';
import { Trans } from 'react-i18next';
import ClearIconButton from 'src/components/button/ClearIconButton';
import useDialog from 'src/hooks/UseDialog';
import { API } from 'src/API';
import usePopup from 'src/hooks/UsePopup';
import i18n from 'src/util/I18N';
import IfTrueElse from 'src/components/common/IfTrueElse';
import IfTrue from 'src/components/common/IfTrue';
import { Users } from 'src/data/User';
import useMe from 'src/hooks/UseMe';
import ClearButton from 'src/components/button/ClearButton';
import { Ellipsis } from 'src/components/common/Icon';

export default function MindustryServerPage() {
	const { pages, hasMore, loadPage, reloadPage } = usePage<MindustryServer>('mindustry-server', 100);
	const { addPopup } = usePopup();
	const { dialog, setVisibility } = useDialog();

	function handleAddServer(address: string) {
		API.postMindustryServer(address) //
			.then(() => addPopup(i18n.t('add-server-success'), 5, 'info'))
			.then(() => reloadPage())
			.then(() => setVisibility(false))
			.catch(() => addPopup(i18n.t('add-server-fail'), 5, 'warning'));
	}

	function handleRemoveServer(id: string) {
		API.deleteServer(id)
			.then(() => addPopup(i18n.t('delete-server-success'), 5, 'info'))
			.then(() => reloadPage())
			.then(() => setVisibility(false))
			.catch(() => addPopup(i18n.t('delete-server-fail'), 5, 'warning'));
	}

	return (
		<main className='flex-column small-gap h100p w100p scroll-y'>
			<section className='flex-row justify-end'>
				<Button onClick={() => setVisibility(true)}>
					<Trans i18nKey='submit' />
				</Button>
			</section>
			<section className='flex-column small-gap'>
				{pages.map((server) => (
					<MindustryServerCard server={server} handleRemoveServer={handleAddServer} />
				))}
			</section>
			<footer className='flex-center'>
				<Button onClick={() => loadPage()}>
					<IfTrueElse
						condition={hasMore} //
						whenTrue={<Trans i18nKey='load-more' />}
						whenFalse={<Trans i18nKey='no-more' />}
					/>
				</Button>
			</footer>
			{dialog(<InputAddressDialog onSubmit={handleAddServer} onClose={() => setVisibility(false)} />)}
		</main>
	);
}

interface MindustryServerCardProps {
	server: MindustryServer;
	handleRemoveServer: (id: string) => void;
}

function MindustryServerCard(props: MindustryServerCardProps) {
	const { me } = useMe();

	const [showDropdown, setShowDropdown] = useState(false);

	return (
		<section>
			{props.server.toString()}
			<IfTrue
				condition={Users.isAdmin(me)}
				whenTrue={
					<section className='ellipsis absolute flex-column center small-padding'>
						<ClearButton onClick={() => setShowDropdown((prev) => !prev)}>
							<Ellipsis />
						</ClearButton>
						<IfTrue
							condition={showDropdown}
							whenTrue={
								<ClearIconButton
									icon='/assets/icons/trash-16.png' //
									onClick={() => props.handleRemoveServer(props.server.id)}
								/>
							}
						/>
					</section>
				}
			/>
		</section>
	);
}

interface InputAddressDialogProps {
	onSubmit: (content: string) => void;
	onClose: () => void;
}

function InputAddressDialog(props: InputAddressDialogProps) {
	const [content, setContent] = useState<string>('');

	return (
		<section className='input-address-dialog flex-column small-gap medium-padding'>
			<header className='flex-row space-between small-padding'>
				<Trans i18nKey='type-ip-address' />
				<ClearIconButton icon='/assets/icons/quit.png' onClick={() => props.onClose()} />
			</header>
			<input className='input-address' type='text' title='address' onChange={(event) => setContent(event.target.value)} />
			<section className='flex-row justify-end w100p small-padding border-box'>
				<Button onClick={() => props.onSubmit(content)}>
					<Trans i18nKey='submit' />
				</Button>
			</section>
		</section>
	);
}
