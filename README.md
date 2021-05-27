# reverse-search README

Reverse Search's functionality is to search files that do not contain specific string in them. In visual studio code we can search for files where specific string exists but there are no such options for Reverse Search.
Reverse Search can have many usecases. i.e checking which files do not contain commenting license text.
String to be searched in Reverse Search doesn't have any limit on characters, for now.

## Features

- Find files that do NOT contain the string 'X'.
- Regex support.
- Files/Folders to include.
- Files/Folders to exclude.

## Usage guide

- Restart VS code after installation.
- ctrl + shift + p (for mac cmb + shift + p) to open command palette.
- Type 'Reverse Search' in command palette and press 'Enter'.
- After pressing Enter a text field will appear. Type a text or regex you want to reverse search and press Enter.
- (Optional) A new text field will appear to include files, folders or files with specific extension with GlobPattern ([Read about GlobPattern here](#globpattern)) for your reverse search. i.e \*\*/\*.{js,scss}. Press Enter.
- (Optional, but it's good to exclude Node Modules folder) A text field will appear to exclude files, folders or files with specific extension with GlobPattern ([Read about GlobPattern here](#globpattern)) for your reverse search. i.e \*\*/node_modules/\*\*. Now press Enter.
- Output tab will open up and after processing list of files that don't include your string/Regex will appear.

## GlobPattern

A file glob pattern to match file paths against. This can either be a glob pattern string (like \*_/_.{ts,js} or \*.{ts,js}).

Glob patterns can have the following syntax:

- to match one or more characters in a path segment
- ? to match on one character in a path segment
- ** to match any number of path segments, including none
- {} to group conditions (e.g. **/\*.{ts,js} matches all TypeScript and JavaScript files)
- [] to declare a range of characters to match in a path segment (e.g., example.[0-9] to match on example.0, example.1, …)
- [!...] to negate a range of characters to match in a path segment (e.g., example.[!0-9] to match on example.a, example.b, but not example.0)
  Note: a backslash (\) is not valid within a glob pattern.

## Known Issues

No issue found for current version

## Release Notes

### 1.0.0

Functionality to search a list of files not containing specific string.

### 2.0.1

Bugs resolved.
Regex support.
User can now include specific files, folder or all files with similar extension to for reverse search.
User can now exclude specific files, folder or all files with similar extension to for reverse search.
Line separator for output to improve visibility.
Remember last searched text.
Improved instructions.

---
