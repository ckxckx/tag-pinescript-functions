// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * Activate the extension.
 * @param context The extension context.
 */


export function activate(context: vscode.ExtensionContext): void {
    
    const config = vscode.workspace.getConfiguration('breadcrumbs');

    // Register a document symbol provider for Pine Script files.
    const pineScriptSymbolProvider = vscode.languages.registerDocumentSymbolProvider(
        { scheme: 'file', language: 'pine' },
        new PineScriptSymbolProvider()
    );

    context.subscriptions.push(pineScriptSymbolProvider);

    vscode.commands.executeCommand('breadcrumbs.focus');
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
