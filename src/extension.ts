import {commands, ExtensionContext} from 'vscode';
import { resolveAndOpenTextUnderCursor } from './bullet_train';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerTextEditorCommand('bullet-train-vscode.resolveAndOpenTextUnderCursor', resolveAndOpenTextUnderCursor)
	)
}

// this method is called when your extension is deactivated
export function deactivate() {}
