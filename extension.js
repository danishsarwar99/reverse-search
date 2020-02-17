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

		const termPick = createPicker('Enter a String');
		const includePick = createPicker("Files to Include (Optional)");
		const excludePick = createPicker("Files to Exclude (Optional)");

		termPick.show();

		let searchTerm = null;
		let filesToInclude = null;
		let filesToExclude = null;
		let excludeAccept = false;

		termPick.onDidAccept(() => {
			searchTerm = termPick.value;
			includePick.show();
		});

		termPick.onDidHide(()=> {
			termPick.dispose();
		});

		includePick.onDidAccept(()=> {
			filesToInclude = formatPattern(includePick.value);
			excludePick.show();
		});

		includePick.onDidHide(()=>{
			includePick.dispose();
			excludePick.show();
		});

		excludePick.onDidAccept(()=>{
			filesToExclude = formatPattern(excludePick.value);
			excludeAccept = true;
			reverseSearch(searchTerm,filesToInclude,filesToExclude);
		});

		excludePick.onDidHide(()=>{
			excludePick.dispose();
			if(!excludeAccept)
				reverseSearch(searchTerm,filesToInclude,null);
		});

	});

	context.subscriptions.push(disposable);
}

function createPicker(placeholder){
	const pick = vscode.window.createQuickPick();
	pick.placeholder = placeholder;
	return pick;
}

/**
 * Formatting the pattern
 * 
 * @param {string} pattern 
 */
function formatPattern(pattern){
	if(pattern.trim()==''){
		return null;
	}

	if(pattern.endsWith('/')||pattern.startsWith('\\')){
		return pattern + '**';
	}

	if(pattern.startsWith('/')||pattern.startsWith('\\')){
		return pattern.substr(1);
	}

	return pattern;
}

/**
 * Searching through files and displaying the result in output tab
 * 
 * @param {string} searchTerm 
 * @param {string|null} filesToInclude 
 * @param {string|null} filesToExclude 
 */
function reverseSearch(searchTerm, filesToInclude=null, filesToExclude=null){

	const files = vscode.workspace.findFiles( filesToInclude?filesToInclude: '**/*' ,filesToExclude);

	files.then(response => {
		vscode.window.showInformationMessage('processing...');
		let reverseSearchOutPut = vscode.window.createOutputChannel("reverse-search");
		reverseSearchOutPut.show();
		let docArray = response.map((elm, i) => {
			let doc = vscode.workspace.openTextDocument(vscode.Uri.file(elm.path))
			doc.then(res => {
				let docText = res.getText().replace(/[-[\]{}()*+?.\\^$|#\s]/g, '');
				let searchString = searchTerm.replace(/[-[\]{}()*+?.\\^$|#\s]/g, '');
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
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
