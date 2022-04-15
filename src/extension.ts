import { commands, ExtensionContext } from 'vscode';
import { resolveAndOpenTextUnderCursor, ejectActiveFile, resolveInteractive } from './bullet_train';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerTextEditorCommand('bullet-train-vscode.resolveAndOpenTextUnderCursor', resolveAndOpenTextUnderCursor),
		commands.registerTextEditorCommand('bullet-train-vscode.ejectActiveFile', ejectActiveFile),
		commands.registerCommand('bullet-train-vscode.resolveInteractive', resolveInteractive)
	)
}

// this method is called when your extension is deactivated
export function deactivate() {}
