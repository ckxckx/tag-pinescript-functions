// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "tag-pinescript-functions" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('tag-pinescript-functions.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('xxxxx from tag_pinescript_functions!');
// 	});

// 	context.subscriptions.push(disposable);
// }



/**
 * Activate the extension.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext): void {
    // Register a document symbol provider for Pine Script files.
    const pineScriptSymbolProvider = vscode.languages.registerDocumentSymbolProvider(
        { scheme: 'file', language: 'pine' },
        new PineScriptSymbolProvider()
    );

    context.subscriptions.push(pineScriptSymbolProvider);
}

/**
 * PineScriptSymbolProvider is a class that parses Pine Script files and provides symbols.
 */
class PineScriptSymbolProvider implements vscode.DocumentSymbolProvider {
    /**
     * Provide symbols for a document.
     * @param document The text document.
     * @param token The cancellation token.
     * @returns A promise resolving to an array of document symbols.
     */
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];
        const regex = /^(?:\s*\w+\s+)?(\bfunction\b|\bmethod\b)\s+(\w+)\s*\(/gm;
        const text = document.getText();
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
            const [_, type, name] = match;
            const line = document.positionAt(match.index).line;
            const range = new vscode.Range(
                new vscode.Position(line, 0),
                new vscode.Position(line, match[0].length)
            );

            const symbolKind =
                type === 'function'
                    ? vscode.SymbolKind.Function
                    : vscode.SymbolKind.Method;

            symbols.push(new vscode.DocumentSymbol(
                name,
                '',
                symbolKind,
                range,
                range
            ));
        }

        return symbols;
    }
}

/**
 * Deactivate the extension.
 */

// This method is called when your extension is deactivated
export function deactivate() {}
