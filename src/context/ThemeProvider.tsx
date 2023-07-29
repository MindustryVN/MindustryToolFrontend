import './ThemeProvider.css'

import React, { ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextProps {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
	theme: 'dark',
	setTheme: (_: Theme) => {},
});

interface ThemeProviderProps {
	children: ReactNode;
}

export default function ThemeProvider(props: ThemeProviderProps) {
	const [theme, setTheme] = React.useState<Theme>('dark');

	return (
		<ThemeContext.Provider value={{ theme, setTheme: (theme: Theme) => setTheme(theme) }}>
			<section className='theme' property={theme}>{props.children}</section>
		</ThemeContext.Provider>
	);
}
