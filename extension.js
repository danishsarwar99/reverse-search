// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "reverse-search" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.reverseSearch', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Enter a string in Command input!');
		const quickPick = vscode.window.createQuickPick();
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
		quickPick.placeholder = 'Enter a String';
		quickPick.onDidAccept(() => {
			const files = vscode.workspace.findFiles('**/*.{js,scss,md}', '**/node_modules/**');
			files.then(response => {
				vscode.window.showInformationMessage('processing...');
				let reverseSearchOutPut = vscode.window.createOutputChannel("reverse-search");
				reverseSearchOutPut.show();
				let docArray = response.map((elm, i) => {
					let doc = vscode.workspace.openTextDocument(vscode.Uri.file(elm.path))
					doc.then(res => {
						let docText = res.getText().replace(/[-[\]{}()*+?.\\^$|#\s]/g, '');
						let searchString = quickPick.value.replace(/[-[\]{}()*+?.\\^$|#\s]/g, '');
						if (docText.search(`${searchString}`) < 0) {
							reverseSearchOutPut.appendLine(elm.path);
							return elm.path;
						}
						else {
							return null;
						}
					});
				});
				vscode.window.showInformationMessage('Search completed! Check "OUTPUT" tab');
			});
		});
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
