const vscode      = require('vscode')
const findInFiles = require('find-in')

let reverseSearchOutput
const PACKAGE_NAME = 'reverseSearch'
let searchTerm     = null
let sep            = null
let config         = {}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    reverseSearchOutput = await vscode.window.createOutputChannel('reverse-search')

    // config
    readConfig()

    vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration(PACKAGE_NAME)) {
            readConfig()
        }
    })

    // cmnd
    context.subscriptions.push(
        vscode.commands.registerCommand(`${PACKAGE_NAME}.run`, async (e) => {
            let folderPath     = e?.fsPath || null
            let filesToInclude = null
            let filesToExclude = null

            // because we are searching in workspace by default, so we need to change path
            // from: /a/b/c/some-folder
            // to: some-folder/
            if (folderPath) {
                folderPath = folderPath.replace(vscode.workspace?.rootPath + '/', '') + '/'
            }

            const termPick    = await createPicker('Enter a String', config.rememberLastKeyword ? searchTerm : null)
            const includePick = await createPicker('Files to Include (Optional). i.e **/*.{js,scss}')
            const excludePick = await createPicker('Files to Exclude (Optional). i.e **/node_modules/**')

            // search for
            termPick.show()

            termPick.onDidAccept(() => {
                searchTerm = termPick.value

                if (searchTerm) {
                    includePick.show()
                } else {
                    includePick.dispose()
                    excludePick.dispose()
                }
            })

            termPick.onDidHide(() => {
                termPick.dispose()

                if (!searchTerm) {
                    showMsg('nothing to do!')
                }
            })

            // include path
            includePick.onDidAccept(() => {
                filesToInclude = formatPattern(includePick.value)
                excludePick.show()
            })

            includePick.onDidHide(() => {
                includePick.dispose()
                excludePick.show()
            })

            // exclude path
            excludePick.onDidAccept(() => {
                filesToExclude = formatPattern(excludePick.value)
                excludePick.hide()
            })

            excludePick.onDidHide(() => {
                excludePick.dispose()

                // do your thing
                return reverseSearch(searchTerm, filesToInclude, filesToExclude)
            })
        })
    )
}

function createPicker(placeholder, val = null) {
    const pick       = vscode.window.createInputBox()
    pick.placeholder = placeholder
    pick.value       = val

    return pick
}

/**
 * Formatting the pattern
 *
 * @param {string} pattern
 */
function formatPattern(pattern) {
    if (!pattern || pattern.trim() == '') {
        return null
    }

    if (pattern.endsWith('/') || pattern.startsWith('\\')) {
        return pattern + '**/*'
    }

    if (pattern.startsWith('/') || pattern.startsWith('\\')) {
        return pattern.substr(1)
    }

    return pattern
}

/**
 * Searching through files and displaying the result in output tab
 *
 * @param {string} searchTerm
 * @param {string|null} filesToInclude
 * @param {string|null} filesToExclude
 */
async function reverseSearch(searchTerm, filesToInclude = null, filesToExclude = null) {
    // clear old
    reverseSearchOutput?.clear()

    showMsg('processing...')
    const files = await vscode.workspace.findFiles( filesToInclude, filesToExclude)
    reverseSearchOutput?.show()
    
    if (files.length <= config.maxFileSearch) {
        let list = []
        
        for (const elm of files) {
            let {path} = elm
            path = path.substring(1)
            let found  = await findInFiles({
                path    : path,
                request : [new RegExp(searchTerm)]
            })

            if (!found[0].isFound) {
                list.push(path)
            }
        }

        // show paths
        let init = false

        list.forEach((path) => {
            if (sep && init) {
                reverseSearchOutput.appendLine(sep)
            }

            init = true

            reverseSearchOutput.appendLine(path)
        })

        showMsg(`search completed, found "${list.length}" file.`)
    } else {
        showMsg(`search stopped, too many files "${files.length}" file.`)
    }
}

/* Helpers ------------------------------------------------------------------ */

async function showMsg(msg) {
    return vscode.window.showInformationMessage(`Reverse Search: ${msg}`)
}

async function readConfig() {
    config = await vscode.workspace.getConfiguration(PACKAGE_NAME)

    sep = config.lineSeparator
}

/* -------------------------------------------------------------------------- */

exports.activate = activate

function deactivate() {
    reverseSearchOutput.dispose()
}

module.exports = {
    activate,
    deactivate
}
