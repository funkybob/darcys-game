import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import index from 'rollup-plugin-index';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH;


export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.js',
		format: 'esm'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			emitCss: true,
		}),
		resolve({
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		postcss({
			extract: true,
			minimize: true,
		}),
		production && terser({
			module: true,
			nameCache: {},
			ecma: 8,
			compress: {
				passes: 2,
			},
			output: {
				beautify: false
			}
		}),
		index({
			source: 'src/index.html',
			compact: production,
		}),
	]
}
