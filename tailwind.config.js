import TailwindCssSafeArea from 'tailwindcss-safe-area';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}"
	],
	theme: {
		extend: {},
	},
	plugins: [
		TailwindCssSafeArea,
	],
};