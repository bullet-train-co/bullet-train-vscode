import { window, workspace } from 'vscode';
import { execFile } from 'child_process';
import * as path from 'path';


export function resolveAndOpenTextUnderCursor() {
  const needle = selectedTextOrWordUnderCursor()
  const workspaceFolders = workspace.workspaceFolders
  if (!needle || !workspaceFolders) {
    return
  }

  const projectRoot = workspaceFolders[0].uri.path;
  const cmd = path.join(projectRoot, 'bin', 'resolve');
  const args = [needle]

  execFile(cmd, args, {cwd: projectRoot}, (err, stdout, _stderr) => {
    if (err) {
      // TODO handle error
      console.error(err)
    } else {
      // remove terminal color characters
      const output = stdout.replace(/\033\[[0-9;]+m/g, "")
      const outputLines = output.split("\n")
      const absolutePathIndex = outputLines.indexOf("Absolute path:")
      if (absolutePathIndex) {
        const resolvedPath = outputLines[absolutePathIndex + 1].trim()
        workspace.openTextDocument(resolvedPath).then((document) => {
          window.showTextDocument(document);
        });
      } else {
        // TODO handle cannot find
        console.warn(`Could not find \`${args[0]}\` with bin/resolve`)
      }
    }
  });
};

function selectedTextOrWordUnderCursor() {
    const { activeTextEditor } = window;

    // If there's no activeTextEditor, do nothing.
    if (!activeTextEditor) {
      return;
    }
  
    const { document, selection } = activeTextEditor;
    const { end, start } = selection;
    const isMultiLine = end.line !== start.line;
  
    // If the user is trying to seek while having made a multiline selection, do nothing.
    if (isMultiLine) {
      return;
    }
  
    // If the beginning and end of selection are on different line or different characters
    // that means the user is performing a selection search, otherwise, it means the user
    // is making a whole word search
    const isSelectionSearch = end.line !== start.line || end.character !== start.character;
  
    // For selection search, our range is the selection itself. Otherwise, we use
    // `document.getWordRangeAtPosition` to get the range of the word under the cursor
    const wordAtCursorRange = isSelectionSearch ? selection : document.getWordRangeAtPosition(end);
  
    // If at this point, we don't have a word range, abort.
    if (wordAtCursorRange === undefined) {
      return;
    }
  
    return document.getText(wordAtCursorRange);
}