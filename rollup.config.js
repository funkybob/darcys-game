import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import index from 'rollup-plugin-index';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy'

import autoprefixer from 'autoprefixer';

const production = !process.env.ROLLUP_WATCH;


export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.js',
		format: 'esm',
		compact: true,
		interop: false,
	},
	plugins: [
		svelte({
			emitCss: true,
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
				preserveComments: true,
			}
		}),
		resolve({
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		postcss({
			extract: true,
			minimize: production,
			plugins: [
				autoprefixer(),
			]
		}),
		production && terser({
			module: true,
			ecma: 2018,
			compress: {
				passes: 2,
				drop_console: production,
				pure_getters: true,
			},
			output: {
				beautify: !production,
			}
		}),
		copy({
			targets: [
				{ src: 'assets/*', dest: 'dist/' },
			],
		}),
		index({
			source: 'src/index.html',
			compact: production,
		}),
	]
}
