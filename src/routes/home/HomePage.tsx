import 'src/styles.css';
import './HomePage.css';

import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
	return (
		<main className='home'>
			<section className='content'>
				<h2>Bạn đang tìm kiếm thứ gì?</h2>
				<b>Tải game miễn phí?</b>
				<ul>
					<li>
						<a className='link' href='https://anuke.itch.io/mindustry?fbclid=IwAR2HgdkixMrQEDhcj1an_qtWnnq6YmOlm-c8VoyPsNp5bMtu5aWq_ff7K2M' target='_blank' rel='noopener noreferrer'>
							Itch.io
						</a>
					</li>
					<li>
						<Link className='link' to='/forum/post/64ca803ea51a933422a49aac'>
							Cách tải game miễn phí
						</Link>
					</li>
				</ul>
				<b>Muốn tìm người chơi game cùng?</b>
				<ul className='link-container'>
					<li>
						<a className='link' href='https://discord.gg/mindustry' target='_blank' rel='noopener noreferrer'>
							Máy chủ discord Mindustry chính chủ
						</a>
					</li>
					<li>
						<a className='link' href='https://discord.gg/DCX5yrRUyp' target='_blank' rel='noopener noreferrer'>
							Máy chủ discord Mindustry Việt Nam
						</a>
					</li>
					<li>
						<a className='link' href='https://www.reddit.com/r/Mindustry' target='_blank' rel='noopener noreferrer'>
							Reddit r/Mindustry
						</a>
					</li>
				</ul>
				<br />
				<b>Tìm kiếm bản thiết kế?</b>
				<ul>
					<li>
						<a className='link' href='/schematic'>
							Schematic
						</a>
					</li>
				</ul>
				<br />
				<b>Tìm kiếm map?</b>
				<ul>
					<li>
						<a className='link' href='/map'>
							Map
						</a>
					</li>
				</ul>
				<br />
			</section>
		</main>
	);
}
