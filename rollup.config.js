import svelte from 'rollup-plugin-svelte'
import {terser} from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;


export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.js',
		format: 'es'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			css: (css) => css.write('dist/bundle.css')
		}),
		production && terser({
			module: true,
			nameCache: {},
			compress: {
				ecma: 6,
				passes: 2,
			},
			output: {
				ecma: 5,
				beautify: false
			}
		}),

	]
}
