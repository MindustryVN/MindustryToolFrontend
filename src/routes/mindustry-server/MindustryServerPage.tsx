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
import LoadingSpinner from 'src/components/loader/LoadingSpinner';
import ColorText from 'src/components/common/ColorText';
import useClipboard from 'src/hooks/UseClipboard';

export default function MindustryServerPage() {
	const { pages, hasMore, isLoading, loadPage, reloadPage } = usePage<MindustryServer>('mindustry-server', 100);
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

	pages.sort((a, b) => (b.name ? 1 : 0) - (a.name ? 1 : 0));

	return (
		<main className='flex-column small-gap h100p w100p scroll-y big-padding border-box'>
			<section className='flex-row justify-end'>
				<Button className='small-padding ' onClick={() => setVisibility(true)}>
					<Trans i18nKey='submit' />
				</Button>
			</section>
			<table className='server-table '>
				<thead className='server-table-header'>
					<tr className='server-table-header'>
						<th>
							<Trans i18nKey='address' />
						</th>
						<th>
							<Trans i18nKey='ping' />
						</th>
						<th>
							<Trans i18nKey='name' />
						</th>
						<th>
							<Trans i18nKey='description' />
						</th>
						<th>
							<Trans i18nKey='map-name' />
						</th>
						<th>
							<Trans i18nKey='wave' />
						</th>
						<th>
							<Trans i18nKey='players' />
						</th>
						<th>
							<Trans i18nKey='mode' />
						</th>
						<th>
							<Trans i18nKey='version' />
						</th>
						<th></th>
					</tr>
				</thead>
				<tbody className='server-table-body'>
					{pages.map((server) => (
						<MindustryServerTableRow key={server.id} server={server} handleRemoveServer={handleRemoveServer} />
					))}
				</tbody>
			</table>
			<section className='server-card-container flex-column small-gap'>
				{pages.map((server) => (
					<MindustryServerCard key={server.id} server={server} handleRemoveServer={handleRemoveServer} />
				))}
			</section>
			<footer className='flex-center'>
				<IfTrueElse
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
					whenFalse={
						<Button onClick={() => loadPage()}>
							<IfTrueElse
								condition={hasMore} //
								whenTrue={<Trans i18nKey='load-more' />}
								whenFalse={<Trans i18nKey='no-more' />}
							/>
						</Button>
					}
				/>
			</footer>
			{dialog(<InputAddressDialog onSubmit={handleAddServer} onClose={() => setVisibility(false)} />)}
		</main>
	);
}

interface MindustryServerTableRowProps {
	server: MindustryServer;
	handleRemoveServer: (id: string) => void;
}

function MindustryServerTableRow(props: MindustryServerTableRowProps) {
	const { server } = props;
	const { me } = useMe();

	const { copy } = useClipboard();

	return (
		<tr className='server-table-row medium-padding'>
			<td>
				<section className='flex-row'>
					<ClearIconButton icon='/assets/icons/copy.png' onClick={() => copy(server.address)} />
					{server.address}
				</section>
			</td>
			<td>{server.ping}</td>
			<td>
				<ColorText text={server.name} />
			</td>
			<td>
				<ColorText text={server.description} />
			</td>
			<td>
				<ColorText text={server.mapname} />
			</td>
			<td>{server.wave}</td>
			<td>
				<span className='flex-row small-gap'>
					{server.players}/{server.playerLimit}
					<span>
						<Trans i18nKey='players' />
					</span>
				</span>
			</td>
			<td className='capitalize'>{server.modeName ? server.mapname : server.mode}</td>
			<td>{server.version === -1 ? server.versionType : server.version}</td>
			<IfTrue
				condition={Users.isAdmin(me)}
				whenTrue={
					<td>
						<ClearIconButton
							icon='/assets/icons/trash-16.png' //
							onClick={() => props.handleRemoveServer(props.server.id)}
						/>
					</td>
				}
			/>
		</tr>
	);
}

interface MindustryServerCardProps {
	server: MindustryServer;
	handleRemoveServer: (id: string) => void;
}

function MindustryServerCard(props: MindustryServerCardProps) {
	const { server } = props;
	const { me } = useMe();

	const { copy } = useClipboard();

	return (
		<section className='server-card flex-column'>
			<header className='flex-row space-between'>
				<section className='flex-row small-gap center'>
					<span className='flex-row small-gap'>
						<ColorText text={server.name ? server.name : server.address} /> | <span className='capitalize'>{server.modeName ? server.mapname : server.mode}</span>
					</span>
					<ClearIconButton className='small-padding' icon='/assets/icons/copy.png' onClick={() => copy(server.address)} />
				</section>
				<IfTrue
					condition={Users.isAdmin(me)}
					whenTrue={
						<section className='flex-column'>
							<ClearIconButton
								icon='/assets/icons/trash-16.png' //
								onClick={() => props.handleRemoveServer(props.server.id)}
							/>
						</section>
					}
				/>
			</header>

			<section className='server-card-info flex-column'>
				<ColorText text={server.description} />
				<span>
					{server.players}/{server.playerLimit}
					<Trans i18nKey='players' />
				</span>
				Ping: {server.ping}ms
				<span className='flex-row small-gap'>
					<Trans i18nKey='map' />: <ColorText text={server.mapname} />
				</span>
				<span className='flex-row small-gap'>
					<Trans i18nKey='wave' />: {server.wave}
				</span>
				<span>
					<Trans i18nKey='version' />: {server.version === -1 ? server.versionType : server.version}
				</span>
			</section>
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
