import {commands, ExtensionContext} from 'vscode';
import { resolveAndOpenTextUnderCursor, ejectActiveFile } from './bullet_train';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerTextEditorCommand('bullet-train-vscode.resolveAndOpenTextUnderCursor', resolveAndOpenTextUnderCursor),
		commands.registerTextEditorCommand('bullet-train-vscode.ejectActiveFile', ejectActiveFile)
	)
}

// this method is called when your extension is deactivated
export function deactivate() {}
