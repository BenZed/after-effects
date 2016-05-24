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
