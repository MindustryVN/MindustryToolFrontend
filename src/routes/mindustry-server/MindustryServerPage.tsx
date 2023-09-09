import './MindustryServerPage.css';

import React, { useState } from 'react';
import MindustryServer from 'src/data/MindustryServer';
import Button from 'src/components/Button';
import { Trans } from 'react-i18next';
import ClearIconButton from 'src/components/ClearIconButton';
import useDialog from 'src/hooks/UseDialog';
import { API } from 'src/API';
import { usePopup } from 'src/context/PopupMessageProvider';
import i18n from 'src/util/I18N';
import IfTrueElse from 'src/components/IfTrueElse';
import IfTrue from 'src/components/IfTrue';
import { Users } from 'src/data/User';
import { useMe } from 'src/context/MeProvider';
import LoadingSpinner from 'src/components/LoadingSpinner';
import ColorText from 'src/components/ColorText';
import useClipboard from 'src/hooks/UseClipboard';
import useInfinitePage from 'src/hooks/UseInfinitePage';

export default function MindustryServerPage() {
	const { pages, hasMore, isLoading, loadNextPage, filter } = useInfinitePage<MindustryServer>('mindustry-server', 100);
	const { addPopup } = usePopup();
	const { dialog, setVisibility } = useDialog();

	function handleAddServer(address: string) {
		setVisibility(false);
		API.postMindustryServer(address) //
			.then(() => addPopup(i18n.t('add-server-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('add-server-fail'), 5, 'warning'));
	}

	function handleRemoveServer(address: string) {
		setVisibility(false);
		API.deleteServer(address)
			.then(() => addPopup(i18n.t('delete-server-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('delete-server-fail'), 5, 'warning'))
			.finally(() => filter((data) => data.address !== address));
	}

	pages.sort((a, b) => (b.name ? 1 : 0) - (a.name ? 1 : 0));

	return (
		<main className='big-padding box-border flex h-full w-full flex-row gap-2 overflow-y-auto'>
			<section className='flex flex-row justify-end'>
				<Button title={i18n.t('submit')} onClick={() => setVisibility(true)}>
					<Trans i18nKey='submit' />
				</Button>
			</section>
			<table className='server-table h-full w-full'>
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
						<MindustryServerTableRow key={server.address} server={server} handleRemoveServer={handleRemoveServer} />
					))}
				</tbody>
			</table>
			<section className='server-card-container space-evenly flex flex-row flex-wrap gap-2'>
				{pages.map((server) => (
					<MindustryServerCard key={server.address} server={server} handleRemoveServer={handleRemoveServer} />
				))}
			</section>
			<footer className='flex items-center justify-center'>
				<IfTrueElse
					condition={isLoading}
					whenTrue={<LoadingSpinner />} //
					whenFalse={
						<Button title={i18n.t('load-more')} onClick={() => loadNextPage()}>
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

function MindustryServerTableRow({ server, handleRemoveServer }: MindustryServerTableRowProps) {
	const { me } = useMe();

	const { copy } = useClipboard();

	return (
		<tr className='server-table-row medium-padding'>
			<td>
				<section className='flex flex-row'>
					<ClearIconButton title={i18n.t('copy')} icon='/assets/icons/copy.png' onClick={() => copy(server.address)} />
					{server.address}
				</section>
			</td>
			<td>
				<span>{server.ping}</span>
			</td>
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
				<span className='flex flex-row gap-2'>
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
							title={i18n.t('delete')}
							icon='/assets/icons/trash-16.png' //
							onClick={() => handleRemoveServer(server.address)}
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

function MindustryServerCard({ server, handleRemoveServer }: MindustryServerCardProps) {
	const { me } = useMe();

	const { copy } = useClipboard();

	return (
		<section className='server-card flex flex-row'>
			<header className='flex flex-row justify-between'>
				<section className='center flex flex-row gap-2'>
					<span className='flex flex-row gap-2'>
						<ColorText text={server.name ? server.name : server.address} /> | <span className='capitalize'>{server.modeName ? server.mapname : server.mode}</span>
					</span>
					<ClearIconButton className='p-2' title={i18n.t('copy')} icon='/assets/icons/copy.png' onClick={() => copy(server.address)} />
				</section>
				<IfTrue
					condition={Users.isAdmin(me)}
					whenTrue={
						<section className='flex flex-row'>
							<ClearIconButton
								title={i18n.t('delete')}
								icon='/assets/icons/trash-16.png' //
								onClick={() => handleRemoveServer(server.address)}
							/>
						</section>
					}
				/>
			</header>

			<section className='server-card-info flex flex-row'>
				<ColorText text={server.description} />
				<span>
					{`${server.players}/${server.playerLimit} `}
					<Trans i18nKey='players' />
				</span>
				Ping: {server.ping}ms
				<span className='flex flex-row gap-2'>
					<Trans i18nKey='map' />: <ColorText text={server.mapname} />
				</span>
				<span className='flex flex-row gap-2'>
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

function InputAddressDialog({ onClose, onSubmit }: InputAddressDialogProps) {
	const [content, setContent] = useState<string>('');

	return (
		<section className='input-address-dialog medium-padding flex flex-row gap-2'>
			<header className='flex flex-row justify-between p-2'>
				<Trans i18nKey='type-ip-address' />
				<ClearIconButton title={i18n.t('close')} icon='/assets/icons/quit.png' onClick={() => onClose()} />
			</header>
			<input className='input-address' type='text' title='address' onChange={(event) => setContent(event.target.value)} />
			<section className='box-border flex w-full flex-row justify-end p-2'>
				<Button title={i18n.t('submit')} onClick={() => onSubmit(content)}>
					<Trans i18nKey='submit' />
				</Button>
			</section>
		</section>
	);
}
