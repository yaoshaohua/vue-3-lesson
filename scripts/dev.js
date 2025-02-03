import minimist from 'minimist'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import esbuild from 'esbuild'

const args = minimist(process.argv.slice(2))

const target = args._[0] || 'reactivity'
const format = args.f || args.format || 'esm'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const entry = resolve(__dirname, '../packages', target, 'src/index.ts')
const pkg = require(resolve(__dirname, '../packages', target, 'package.json'))

esbuild.context({
  entryPoints: [entry],
  outfile: resolve(__dirname, '../packages', target, `dist/${target}.${format}.js`),
  bundle: true,
  sourcemap: true,
  format,
  globalName: pkg.buildOptions?.name,
}).then(ctx => {
  console.log('Building...')
  return ctx.watch()
})
