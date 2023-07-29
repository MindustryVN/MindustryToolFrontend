import './ThemeSwitcher.css';

import React, { useContext } from 'react';
import { Theme, ThemeContext } from 'src/context/ThemeProvider';

export default function ThemeSwitcher() {
	const themes: Theme[] = ['light', 'dark'];

	const { theme, setTheme } = useContext(ThemeContext);

	return (
		<section className='theme-switch flex-row'>
			<section className='grid-row'>
				{themes.map((item, index) => (
					<button className={'theme-switch-button ' + (item === theme ? 'active' : '')} key={index} onClick={() => setTheme(item)}>
						{item}
					</button>
				))}
			</section>
		</section>
	);
}
