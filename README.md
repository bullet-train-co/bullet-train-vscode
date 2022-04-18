# Bullet Train for VS Code

This extension provides quick access to [Bullet Train](https://bullettrain.co/) features from within VS Code

## Features

There are commands to access the `bin/resolve` script for inspecting and ejecting code inside the framework gems. Check out the [Bullet Train Docs](https://bullettrain.co/docs/indirection) for more info.

\!\[Demo\]\(images/bt-vscode-demo.png\)

#### Resolve Text Under Cursor

Highlight a code symbol like `Users::Base` or a view path like `shared/box` and run the "Resolve Text Under Cursor" command. This will open the file where the code is defined.

Keyboard shortcut: `option + r r` (Mac)
Keyboard shortcut: `alt + r r` (Windows/Linux)

#### Eject Current File

When viewing a framework-provided file, run the "Eject Current File" command to copy the file into your project. Then you can provide your own project-specific customizations.

Keyboard shortcut: `option + r e` (Mac)
Keyboard shortcut: `alt + r e` (Windows/Linux)

#### Resolve Interactively

Run the "Resolve Interactively" command to open a text box to resolve and open framework files. This is particularly useful for resolving view partials based on the the HTML comments that Bullet Train inserts in the page source.

Keyboard shortcut: `option + r i` (Mac)
Keyboard shortcut: `alt + r i` (Windows/Linux)

## Requirements

You'll need to be running the extension from within a working Bullet Train project. Follow the [Getting Started](https://bullettrain.co/docs/getting-started) guide to get your app up and running.

If you run into issues try running the `bin/resolve` script from the command line as described in the [Bullet Train Docs](https://bullettrain.co/docs/indirection)

## Release Notes

### 1.0.0

Initial release with features for bin/resolve
