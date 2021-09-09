import path from 'path'
import fs from 'fs'

/*** Constants ***/

const PROJECTS_DIR = path.resolve(process.cwd(), '../')
const NODE_MODULES = path.resolve(process.cwd(), 'node_modules')

const BENZED_PKGS_DIR = path.resolve(PROJECTS_DIR, 'benzed-ts/packages')
const BENZED_LINKED = path.resolve(NODE_MODULES, '@benzed')

/*** Helpers ***/

function copyModuleFiles(from: string, to: string): void {

    if (fs.existsSync(to))
        fs.rmdirSync(to, { recursive: true })

    fs.mkdirSync(to)

    const names = fs.readdirSync(from)
    for (const name of names) {

        const fromUrl = path.join(from, name)
        const toUrl = path.join(to, name)

        if (fs.statSync(fromUrl).isDirectory())
            copyModuleFiles(fromUrl, toUrl)

        else if (fromUrl.endsWith('.js') || fromUrl.endsWith('.d.ts')) {

            console.log(
                path.relative(PROJECTS_DIR, fromUrl),
                '->',
                path.relative(process.cwd(), toUrl)
            )

            fs.copyFileSync(fromUrl, toUrl)
        }
    }
}

/*** Main ***/

function copyBenzedModulesIntoNodeModules(): void {

    if (!fs.existsSync(BENZED_PKGS_DIR) || !fs.statSync(BENZED_PKGS_DIR).isDirectory())
        throw new Error('benzed-ts directory is missing.')

    if (!fs.existsSync(BENZED_LINKED))
        fs.mkdirSync(BENZED_LINKED)

    for (const pkgName of fs.readdirSync(BENZED_PKGS_DIR)) {
        const pkgDir = path.join(BENZED_PKGS_DIR, pkgName)

        const pkgBuildDir = path.join(pkgDir, 'lib')
        const pkgDestDir = path.join(BENZED_LINKED, pkgName)

        copyModuleFiles(pkgBuildDir, pkgDestDir)
    }
}

/*** Execute ***/

console.log(
    'Copying all module files from the benzed-ts folder adjacent to this project ' +
    'folder, if it exists. This is so I can use latest benzed-ts module changes ' +
    'having to publish them to npm.'
)

copyBenzedModulesIntoNodeModules()