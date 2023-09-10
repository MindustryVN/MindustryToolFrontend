/** @type {import('tailwindcss').Config} */

module.exports = {
	important: true,
	darkMode: 'media',
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			zIndex: { overlay: 2, model: 3, popup: 4, 'nav-bar': 5, top: 6 },
		},
		keyframes: {
			popup: {
				'0%': { transform: 'translateX(-100%)' },

				'100%': { transform: 'translateX(0)' },
			},
			'slide-in': {
				'0%': {
					transform: 'translateX(100%)',
				},
				'100%': {
					transform: 'translateX(0)',
				},
			},
			spin: {
				'0%': {
					transform: 'rotate(0deg)',
				},
				'100%': {
					transform: 'rotate(360deg)',
				},
			},
			appear: {
				'0%': {
					opacity: 0,
				},
				'100%': {
					opacity: 1,
				},
			},
		},
		animation: {
			popup: 'popup 0.2s forwards',
			spin: 'spin 1s linear infinite',
			'slide-in': 'slide-in 0.5s forwards',
			appear: 'appear 1s',
		},

		plugins: [require('@tailwindcss/typography')],
	},
};
