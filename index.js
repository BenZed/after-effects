'use strict';

/*******************************************************************/
// DEPENDENCIES
/*******************************************************************/

const os = 		  require('os'),
      fs =      require('fs'),
      path =    require('path'),
      is =      require('is-explicit').default,
      uuid = 		require('uuid'),
      Command = require('./lib/command');

/*******************************************************************/
// ERRORS
/*******************************************************************/

const Errors = {
  UnsupportedPlatform : 'Cannot run After Effects commands in an environment it can\'t be installed in.',
  BadExecuteArgument : 'execute expects a function or AfterEffectsCommand instance.',
  ApplicationNotFound : 'Cannot execute command, After Effects could not be found in your application directory. Install After Effects in your application directory, or provide a path in program option.',
  NoResult : 'Could not get results from After Effects. Ensure that Preferences > General > Allow Scripts to Write Files and Access Network is enabled.'
};

class AfterEffectsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AfterEffectsError';
  }
}

/*******************************************************************/
// SETUP
/*******************************************************************/

const options = {
	errorHandling: true,
	minify: false,
  program: null,
  includes: [
		path.join(__dirname, '/lib/includes/console.jsx'),
		path.join(__dirname, '/lib/includes/es5-shim.jsx'),
		path.join(__dirname, '/lib/includes/get.jsx')
	]
};

const platform = (() => {

 const platform_name = os.platform();
 if (platform_name === 'darwin') //mac
   return require('./lib/platform-mac');

 else if (platform_name.includes('win')) { //windows 32 or 64
   return require('./lib/platform-win');

 } else
   throw new Error(Errors.UnsupportedPlatform);

})();

/*******************************************************************/
// HELPER
/*******************************************************************/

function prepare_command(input_args) {

  let command = null;
  const args = Array.prototype.slice.call(input_args);
  const funcOrCommand = args.shift();

  if (is(funcOrCommand, Command))
    command = funcOrCommand;

  if (is(funcOrCommand, Function))
    command = new Command(funcOrCommand);

  if (!command)
    throw new Error(Errors.BadExecuteArgument);

  command.arguments = args;
  command.result_file = null;

  return command;

}

function ensure_executable(command) {
  if (!platform.canExecute(command))
    throw new Error(Errors.ApplicationNotFound);
}

function prepare_script_path(scriptPath, command) {
  if (!path.isAbsolute(scriptPath))
    scriptPath = path.resolve(platform.scriptsDir(command), scriptPath);

  if (path.extname(scriptPath) === '')
    scriptPath += '.jsx';

  return scriptPath;
}

function create_result_file_name(command) {
  command.result_file = `ae-result-${uuid.v4()}.js`;
}

function get_results(command) {
  if (!is(command.result_file, String))
    return;

  let results = {};

  try {
    //For macs, the javascript function inside After Effects that points toward
    //the operating systems temp folder is slightly different than os.tmpdir,
    //having a 'TemporaryItems' subfolder.
    const sub_temp_dir = os.platform() === 'darwin' ? 'TemporaryItems' : '';
    const jsfile = path.join(os.tmpdir(), sub_temp_dir, command.result_file);
    results = require(jsfile);

    fs.unlink(jsfile, function(err) {
      if (err)
        console.error (err)
    });

    command.result_file = null;
  } catch (err) {

    command.result_file = null;
    return err;
  }
  if (is(results.logs, Array))
    results.logs.forEach(log => process.stdout.write(`${log}\n`));

  return results;
}

/*******************************************************************/
// INTERFACE
/*******************************************************************/

function execute(/*args*/) {

  const command = prepare_command(arguments);
  ensure_executable(command);
  create_result_file_name(command);

  return platform.execute(command)
  //Handle Results
  .then(() => new Promise((resolve,reject) => {

    const results = get_results(command);
    if (results == null)
      resolve();

    if (is(results, Error))
      reject(Errors.NoResult);

    if (is(results.returned, Error))
      reject(new AfterEffectsError(results.returned.message));
    else
      resolve(results.returned);
  }));
}

function executeSync(/*args*/) {

  const command = prepare_command(arguments);
  ensure_executable(command);
  create_result_file_name(command);

  platform.executeSync(command);
  const results = get_results(command);

  //Handle results
  if (results == null)
    return;

  if (is(results, Error))
    throw new Error(Errors.NoResult);

  if (is(results.returned, Error))
    throw new AfterEffectsError(results.returned.message);
  else
    return results.returned;
}

function create(funcOrCommand, scriptPath) {

  //prepare command args shouldn't include scriptPath
  const args = Array.prototype.slice.call(arguments, 2);
  args.unshift(funcOrCommand);

  const command = prepare_command(args);
  scriptPath = prepare_script_path(scriptPath, command);

  return new Promise((resolve, reject) => {
    fs.writeFile(scriptPath, command.toString(), 'utf-8', (err) => {
      if (err)
        reject(err);
      else
        process.stdout.write(`Script written to ${scriptPath}\n`);
        resolve(scriptPath);
    });
  });
}

function createSync(funcOrCommand, scriptPath) {
  //prepare command args shouldn't include scriptPath
  const args = Array.prototype.slice.call(arguments, 2);
  args.unshift(funcOrCommand);

  const command = prepare_command(args);
  scriptPath = prepare_script_path(scriptPath, command);

  fs.writeFileSync(scriptPath, command.toString(), 'utf-8');

  process.stdout.write(`Script written to ${scriptPath}\n`);
  return scriptPath;
}

/*******************************************************************/
// EXPORTS
/*******************************************************************/

module.exports = function() {
  return executeSync.apply(null, arguments);
};

module.exports.execute = execute;
module.exports.executeSync = executeSync;
module.exports.create = create;
module.exports.createSync = createSync;
module.exports.options = options;
module.exports.Command = Command;

Object.defineProperty(module.exports, 'scriptsDir', {
  //Pass in dummy command so we have access to the currently set program option, if one exists
  get: () => platform.scriptsDir({ options: { program: module.exports.options.program }})
});
Object.preventExtensions(module.exports);
Object.preventExtensions(module.exports.options);
