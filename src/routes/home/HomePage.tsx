import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import LoadUserName from 'src/components/LoadUserName';

export default function HomePage() {
	return (
		<main className='background-image grid h-full overflow-y-auto p-8 pt-10'>
			<section className='bg-slate-800 p-8 bg-opacity-90 rounded-2xl'>
				<span className='text-2xl text-white'>Chào mừng đến với </span>
				<Link className='bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-2xl text-transparent' to='/'>
					MINDUSTRYTOOL
				</Link>
				<section className='flex flex-col gap-4 p-4'>
					<b className='text-white'>Tải game miễn phí?</b>
					<ul>
						<li>
							<a
								className='text-emerald-500 hover:text-emerald-500'
								href='https://anuke.itch.io/mindustry?fbclid=IwAR2HgdkixMrQEDhcj1an_qtWnnq6YmOlm-c8VoyPsNp5bMtu5aWq_ff7K2M'
								target='_blank'
								rel='noopener noreferrer'>
								Itch.io
							</a>
						</li>
						<li>
							<Link className='text-emerald-500 hover:text-emerald-500' to='/post/post/64ca803ea51a933422a49aac'>
								Cách tải game miễn phí
							</Link>
						</li>
						<li>
							<Link className='text-emerald-500 hover:text-emerald-500' to='/post/post/6520298fa61f817d3a535be4'>
								Cách chơi chung với bạn bè
							</Link>
						</li>
					</ul>
					<b className='text-white'>Muốn tìm người chơi game cùng?</b>
					<ul>
						<li>
							<a className='text-emerald-500 hover:text-emerald-500' href='https://discord.gg/mindustry' target='_blank' rel='noopener noreferrer'>
								Máy chủ discord Mindustry chính chủ
							</a>
						</li>
						<li>
							<a className='text-emerald-500 hover:text-emerald-500' href='https://discord.gg/DCX5yrRUyp' target='_blank' rel='noopener noreferrer'>
								Máy chủ discord Mindustry Việt Nam
							</a>
						</li>
						<li>
							<a className='text-emerald-500 hover:text-emerald-500' href='https://www.reddit.com/r/Mindustry' target='_blank' rel='noopener noreferrer'>
								Reddit r/Mindustry
							</a>
						</li>
					</ul>
					<b className='text-white'>Kênh Youtube về Mindustry dành cho người Việt Nam</b>
					<ul>
						<li>
							<a className='text-emerald-500 hover:text-emerald-500' href='https://www.youtube.com/@FourGamingStudio' target='_blank' rel='noopener noreferrer'>
								Four Gaming Studio
							</a>
						</li>
					</ul>
					<b className='text-white'>Tìm kiếm bản thiết kế?</b>
					<ul>
						<li>
							<a className='text-emerald-500 hover:text-emerald-500' href='/schematic'>
								<Trans i18nKey='schematic' />
							</a>
						</li>
					</ul>
					<b className='text-white'>Tìm kiếm bản đồ?</b>
					<ul>
						<li>
							<a className='text-emerald-500 hover:text-emerald-500' href='/map'>
								<Trans i18nKey='map' />
							</a>
						</li>
					</ul>
					sp
				</section>
				<h2>Thông tin về Website</h2>
				<section className='grid grid-cols-2 items-start justify-start gap-y-2 px-8'>
					<p className='list-item whitespace-nowrap'>
						<Trans i18nKey='page-owner' />
					</p>
					<LoadUserName userId='64b63239e53d0c354d505733' />
					<p className='list-item whitespace-nowrap'>
						<Trans i18nKey='admin' />
					</p>
					<div className='grid gap-1'>
						<LoadUserName userId='64b6def5fa35080d51928849' />
						<LoadUserName userId='64b8c74b2ab2c664a63d9f0d' />
						<LoadUserName userId='64ba2279c92ba71c46dc7355' />
					</div>
					<p className='list-item whitespace-nowrap'>
						<Trans i18nKey='contributor' />
					</p>
					<LoadUserName userId='64b7f3cf830ef61869872548' />
				</section>
			</section>
		</main>
	);
}
