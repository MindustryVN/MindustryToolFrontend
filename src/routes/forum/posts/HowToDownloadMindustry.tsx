import 'src/styles.css';

import React from 'react';

export default function HowToDownloadMindustry() {
	return (
		<div className='flex-column h100p w100p scroll-y'>
			<h3>Cách để tải mindustry free</h3>
			<ul>
				<li>
					<span>Ấn vào link bên dưới để đến trang tải xuống (Itch.io) </span>
					<a href='https://anuke.itch.io/mindustry?fbclid=IwAR2HgdkixMrQEDhcj1an_qtWnnq6YmOlm-c8VoyPsNp5bMtu5aWq_ff7K2M'>
						Link tải Mindustry free cho Window, Linux, MacOS, Android (Và tất nhiên là không có IOS)
					</a>
				</li>
				<li>
					<p>Kéo xuống dưới và ấn vào nút "Download Now"</p>
					<img className='forum-image' src='/assets/images/forum/download-now.jpg' alt='download now'></img>
				</li>
				<li>
					<p>Ấn vào "No thanks, just take me to the download"</p>
					<img className='forum-image' src='/assets/images/forum/no-thank.jpg' alt='download'></img>
				</li>
				<li>
					<p>Chọn phiên bản cần tải và tải thôi</p>
				</li>
			</ul>
		</div>
	);
}
