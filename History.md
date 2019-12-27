## [0.4.14]
### Changes
- Missed a Deprecation warning.

## [0.4.13]
### Changes
- Accidentally deleted index.js without realizing it last publish. Whoops.

## [0.4.12]
### Changes
- Deprecation warning in new Node.js installs Fixed

## [0.4.11]
### Changes
- Fixed an old problem with the get.js include
- Includes are now .jsx files, instead of .js files, because they are ES3 and After-Effects compliant and don't need to be transformed.
- Fixed a problem that stripped away babel-added functions, preventing usage of the class keyword.

## [0.4.9]
### Changes
- Fixed a silly bug that I missed last commit.

## [0.4.8]
### Changes
- Made a fix in osx that ensured the package couldn't execute if options.program was set to Adobe After Effects 15.3
- Prevented crash in osx that was introduced by a pull request if After Effects couldn't be found

## [0.4.7]
### Changes
- Various community pull requests.

## [0.4.6]
### Changes
- Fixed babelification bugs, added better babel -> es3 transforms

## [0.4.5]
### Changes
- Fixed a bug where console.logs called inside After Effects weren't being shown in node

## [0.4.3]
### Changes
- Fixed a es5-shim.js bug that prevented babel from working properly
- Added error message for trying to execute applescript on After Effects when app not installed

## [0.4.0]
### Changes
- Big structural changes, top-down rewrite, with a bunch of improvements detailed in the README. Now works on windows, as well as mac.
- Slight API differences
- Removed several dependencies, changed default options

## [0.3.3]
### Changes
- Updated README to fix some errors, added github repo

## [0.3.2]
### Changes
- Fixed more .get bugs

## [0.3.1]
### Changes
- Fixed a get. bug where the query wouldn't select layers
- get. now works with properties.

## [0.3.0]
### Changes
- To speed everything up, includes are now once again minified with a build script. The minified version is included if options.minify is set, and the non minified version included if not.
- Altered minify compression options that after effects doesn't like

## [0.2.1]
### Changes
- Using a javascript string escape plugin for sending code through applescript to escape errors from my previous hacky version
- Rather than having a just the includes minified, minify is now a settable options. It's nice to
have the includes not minified for testing, as After Effects obviously doesn't support source maps.

## [0.1.8]
### Changes
- Added a contingency that allows scripts to behave properly if created as UI Script, as it would be if called from the Scripts UIPanels folder.

## [0.1.7]
### Changes
- Fixed script creation
- Regular expressions now work properly in get

## [0.1.4]
### Changes
- calls to console.log in after effects will now be shown in node when results are parsed, rather than sent
to the After Effects javascript console. Presumably, if you are using this package, you wouldn't be looking at it, anyway.

## [0.1.3]
### Changes
- Finally found a workaround for the get.jsx uglify problem.

## [0.1.0]
### Changes
- did some renaming
- minify rather than uglify the after effects includes for now, mangle is breaking something.
- added uglifyjs to dependencies
- added npm minify script
- bug fixes with 'get' selector

## [0.0.4]
### Changes
- README file was somehow missing? Added it again.

## [0.0.3]
### Changes
- minor bug fixes
- get object added, behaves as readme explains
- get object does not yet select properties
