import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import i18n from 'src/util/I18N';
import ClearButton from 'src/components/ClearButton';
import LoadUserName from 'src/components/LoadUserName';

export default function HomePage() {
	const navigate = useNavigate();

	return (
		<main className='flex flex-col justify-between h-full overflow-y-auto p-8 pt-8'>
			<section className='flex flex-col gap-3'>
				<h2>Bạn đang tìm kiếm thứ gì?</h2>
				<b className='text-white'>Tải game miễn phí?</b>
				<ul>
					<li>
						<a
							className='text-blue-600 hover:text-emerald-500'
							href='https://anuke.itch.io/mindustry?fbclid=IwAR2HgdkixMrQEDhcj1an_qtWnnq6YmOlm-c8VoyPsNp5bMtu5aWq_ff7K2M'
							target='_blank'
							rel='noopener noreferrer'>
							Itch.io
						</a>
					</li>
					<li>
						<Link className='text-blue-600 hover:text-emerald-500' to='/post/post/64ca803ea51a933422a49aac'>
							Cách tải game miễn phí
						</Link>
					</li>
				</ul>
				<b className='text-white'>Muốn tìm người chơi game cùng?</b>
				<ul>
					<li>
						<a className='text-blue-600 hover:text-emerald-500' href='https://discord.gg/mindustry' target='_blank' rel='noopener noreferrer'>
							Máy chủ discord Mindustry chính chủ
						</a>
					</li>
					<li>
						<a className='text-blue-600 hover:text-emerald-500' href='https://discord.gg/DCX5yrRUyp' target='_blank' rel='noopener noreferrer'>
							Máy chủ discord Mindustry Việt Nam
						</a>
					</li>
					<li>
						<a className='text-blue-600 hover:text-emerald-500' href='https://www.reddit.com/r/Mindustry' target='_blank' rel='noopener noreferrer'>
							Reddit r/Mindustry
						</a>
					</li>
				</ul>
				<b className='text-white'>Tìm kiếm bản thiết kế?</b>
				<ul>
					<li>
						<a className='text-blue-600 hover:text-emerald-500' href='/schematic'>
							Schematic
						</a>
					</li>
				</ul>
				<b className='text-white'>Tìm kiếm bản đồ?</b>
				<ul>
					<li>
						<a className='text-blue-600 hover:text-emerald-500' href='/map'>
							Map
						</a>
					</li>
				</ul>
			</section>

			<section className='grid grid-cols-2 p-2 rounded-lg gap-4 w-fit'>
				<p className='flex flex-row gap-2 whitespace-nowrap'>
					<Trans i18nKey='page-owner' />
				</p>
				<LoadUserName userId='64b63239e53d0c354d505733' />
				<p className='flex flex-row gap-2 whitespace-nowrap'>
					<Trans i18nKey='admin' />
				</p>
				<div className='grid'>
					<LoadUserName userId='64b6def5fa35080d51928849' />
					<LoadUserName userId='64b8c74b2ab2c664a63d9f0d' />
					<LoadUserName userId='64ba2279c92ba71c46dc7355' />
				</div>
				<p className='flex flex-row gap-2 whitespace-nowrap'>
					<Trans i18nKey='contributor' />
				</p>
				<LoadUserName userId='64b7f3cf830ef61869872548' />
			</section>

			<footer>
				<section className='flex flex-row items-center justify-evenly w-full bg-gray-950 rounded-xl p-2 text-white'>
					<ClearButton title={i18n.t('services')} onClick={() => navigate('/')}>
						<Trans i18nKey='services' />
					</ClearButton>
					<ClearButton title={i18n.t('about')} onClick={() => navigate('/info')}>
						<Trans i18nKey='about' />
					</ClearButton>
					<a href='https://discord.gg/DCX5yrRUyp'>
						<Trans i18nKey='contact' />
					</a>
					<a href='https://discord.gg/DCX5yrRUyp'>
						<Trans i18nKey='community' />
					</a>
				</section>
			</footer>
		</main>
	);
}
