import { window, workspace } from 'vscode'
import { execFile, ExecFileException } from 'child_process'
import * as path from 'path'


export function resolveAndOpenTextUnderCursor() {
  const needle = selectedTextOrWordUnderCursor()
  if (!needle) {
    return
  }

  execResolve([needle], (_err, stdout, _stderr) => {
    const lines = stdout.split("\n")
    const absolutePathIndex = lines.indexOf("Absolute path:")
    if (absolutePathIndex) {
      const resolvedPath = lines[absolutePathIndex + 1].trim()
      openFile(resolvedPath)
    } else {
      window.showWarningMessage(`Could not find \`${needle}\` with bin/resolve`)
    }
  })
}

export function ejectActiveFile() {
  const { activeTextEditor } = window
  const { workspaceFolders } = workspace
  
  if (!activeTextEditor || !workspaceFolders) {
    return
  }

  const activeFilePath = activeTextEditor.document.uri.path
  const projectRoot = workspaceFolders[0].uri.path

  execResolve([activeFilePath, "--eject"], (_err, stdout, _stderr) => {
    let ejectedPath: string | undefined
    const ejectingPattern = /^Ejecting `([^`]+)` to `([^`]+)`$/
    const alreadyEjectedPattern = /^Can't eject! `([^`]+)` already exists!/

    stdout.split("\n").forEach(line => {
      const ejectingMatches = line.match(ejectingPattern)
      if (ejectingMatches) {
        ejectedPath = ejectingMatches[2]
      } else {
        const alreadyEjectedMatches = line.match(alreadyEjectedPattern)
        if (alreadyEjectedMatches) {
          ejectedPath = alreadyEjectedMatches[1]
        }
      }
    })

    if (ejectedPath) {
      const absolutePath = path.join(projectRoot, ejectedPath)
      openFile(absolutePath)
    } else {
      window.showWarningMessage(`Unable to eject ${activeFilePath}`)
    }
  })
}

function execResolve(args: string[], callback: (err: ExecFileException | null, stdout: string, stderr: string) => void) {
  const { workspaceFolders } = workspace
  if (!workspaceFolders) {
    return
  }
  
  const projectRoot = workspaceFolders[0].uri.path
  const cmd = path.join(projectRoot, 'bin', 'resolve')

  execFile(cmd, args, {cwd: projectRoot}, (err, stdout, stderr) => {
    if (err) {
      window.showErrorMessage("Error running bin/resolve. Check the Developer Tools console for full details.")
      console.error("error running bin/resolve")
      console.error("stdout:", stdout)
      console.error("stderr:", stderr)
    } else {
      const sanitizedStdout = stdout.replace(/\033\[[0-9;]+m/g, "")
      callback(err, sanitizedStdout, stderr)
    }
  })
}

function openFile(path: string) {
  workspace.openTextDocument(path).then((document) => {
      window.showTextDocument(document)
  })
}

function selectedTextOrWordUnderCursor() {
    const { activeTextEditor } = window

    // If there's no activeTextEditor, do nothing.
    if (!activeTextEditor) {
      return
    }
  
    const { document, selection } = activeTextEditor
    const { end, start } = selection
    const isMultiLine = end.line !== start.line
  
    // If the user is trying to seek while having made a multiline selection, do nothing.
    if (isMultiLine) {
      return
    }
  
    // If the beginning and end of selection are on different line or different characters
    // that means the user is performing a selection search, otherwise, it means the user
    // is making a whole word search
    const isSelectionSearch = end.line !== start.line || end.character !== start.character
  
    // For selection search, our range is the selection itself. Otherwise, we use
    // `document.getWordRangeAtPosition` to get the range of the word under the cursor
    const wordAtCursorRange = isSelectionSearch ? selection : document.getWordRangeAtPosition(end)
  
    // If at this point, we don't have a word range, abort.
    if (wordAtCursorRange === undefined) {
      return
    }
  
    return document.getText(wordAtCursorRange)
}