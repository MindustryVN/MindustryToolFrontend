import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import Button from 'src/components/button/Button';

export default function HomePage() {
	const navigate = useNavigate();

	return (
		<main className='flex flex-col justify-between h-full overflow-y-auto p-8 pt-8'>
			<section className='flex flex-col gap-3'>
				<h2>Bạn đang tìm kiếm thứ gì?</h2>
				<b className='text-white-primary'>Tải game miễn phí?</b>
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
						<Link className='text-blue-600 hover:text-emerald-500' to='/forum/post/64ca803ea51a933422a49aac'>
							Cách tải game miễn phí
						</Link>
					</li>
				</ul>
				<b className='text-white-primary'>Muốn tìm người chơi game cùng?</b>
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
				<b className='text-white-primary'>Tìm kiếm bản thiết kế?</b>
				<ul>
					<li>
						<a className='text-blue-600 hover:text-emerald-500' href='/schematic'>
							Schematic
						</a>
					</li>
				</ul>
				<b className='text-white-primary'>Tìm kiếm bản đồ?</b>
				<ul>
					<li>
						<a className='text-blue-600 hover:text-emerald-500' href='/map'>
							Map
						</a>
					</li>
				</ul>
			</section>
			<footer>
				<section className='flex flex-row justify-evenly w-full bg-gray-950 rounded-xl p-2 text-white-primary'>
					<Button onClick={() => navigate('/')}>
						<Trans i18nKey='Services' />
					</Button>
					<Button onClick={() => navigate('/info')}>
						<Trans i18nKey='About' />
					</Button>
					<a href='https://discord.gg/DCX5yrRUyp'>
						<Trans i18nKey='Contact' />
					</a>
					<a href='https://discord.gg/DCX5yrRUyp'>
						<Trans i18nKey='Community' />
					</a>
				</section>
			</footer>
		</main>
	);
}
