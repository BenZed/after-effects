'use strict';

const fs = 		 require('fs'),
      child =  require('child_process'),
      path =   require('path'),
      uuid =   require('uuid'),
      os =     require('os'),
      esc =    require('escape-string-applescript');

const exec =      child.exec,
      execSync =  child.execSync;

const MissingAfterEffects = 'After Effects could not be found.';

/******************************************************************************/
// Helpers
/******************************************************************************/

function find_application_dir(applications_dir) {

  const files_in_applications_dir = fs.readdirSync(applications_dir);

  for (let i = 0; i < files_in_applications_dir.length; i++) {
    const file = files_in_applications_dir[i];
    if (!file.includes('Adobe After Effects'))
      continue;

    const app_dir = path.join(applications_dir, file);

    //If some wise-ass named a folder 'Adobe After Effects Plugins' or whatever and leaves
    //it in his applications directory, we don't want to choose it. We want to choose an application_dir
    //that's going to have an After Effects.app in it.
    if (find_application(app_dir) !== null)
      return app_dir;
  }

  return null;
}

function find_application(application_dir) {
  if (application_dir === null)
    return null;

  const files_in_application_dir = fs.readdirSync(application_dir);

  for (let i = 0; i < files_in_application_dir.length; i++) {
    const file = files_in_application_dir[i];
    if (file.includes('Adobe After Effects') && file.endsWith('.app'))
      return path.join(application_dir, file);
  }

  return null;
}

function determine_application(command) {
  if (command && command.options.program && command.options.program.endsWith('.app'))
    return command.options.program;

  if (command && command.options.program)
    return find_application(command.options.program);

  return app;
}

function check_for_missing_app_hack(error) {
  //this is a gross hack that will only exist temporarily. I haven't
  //bothered how to use applescript well enough to determine if the After
  //Effects app exists or not. So, rather than figure it out, I'll just look
  //for an error that includes this string, because that error means that
  //DoScript couldn't complete, which means the suggested After Effects app doesnt exist
  if (error.message.includes('Expected end of line'))
    return new Error(MissingAfterEffects);
  else
    return error;

}

function create_apple_script(command, sync) {
  const apple_script_file = path.join(os.tmpdir(),`ae-command-${uuid.v4()}.scpt`);
  const execute_app = determine_application(command);

  if (execute_app === null)
    throw new Error(MissingAfterEffects);

  const apple_script = `tell application "${execute_app}"
  DoScript "${esc(command.toString(), { quotes: 'double'})}"
end tell`;

  if (sync) {
    try {
      fs.writeFileSync(apple_script_file, apple_script, 'utf-8');
    } catch (err) {
      throw new Error('Could not create apple script for execution. Check permissions.');
    }
    return apple_script_file;
  }
  //async
  return new Promise((resolve, reject)=> {
    fs.writeFile(apple_script_file, apple_script, 'utf-8', err => {
      if (err)
        return reject(err);
      resolve(apple_script_file);
    });
  });
}

/******************************************************************************/
// Setup
/******************************************************************************/

const app_dir = find_application_dir('/Applications');
const app = find_application(app_dir);

/******************************************************************************/
// Exports
/******************************************************************************/

module.exports = {

  execute: function(command) {

    return create_apple_script(command)
    //Execute Apple Script
    .then( apple_script => new Promise((resolve,reject) => {
      exec(`osascript ${apple_script}`, (err, stdout, stderr) => {
        if (err) return reject(check_for_missing_app_hack(err));
        if (stderr) return reject(stderr);
        fs.unlink(apple_script, function (err) {
          if (err) console.error(err)
        });

        resolve(stdout);
      });
    }));

  },

  executeSync : function(command) {

    const apple_script = create_apple_script(command, true);

    //Execute AppleScript
    try {
      execSync(`osascript ${apple_script}`);
    } catch (err) {
      throw check_for_missing_app_hack(err);
    }

    fs.unlink(apple_script, function (err) {
      if (err) console.error(err)
    });
  },

  canExecute: function(command) {
    return determine_application(command) !== null;
  },

  scriptsDir: function(command){
    if (!this.canExecute(command))
      throw new Error('Can\'t get Scripts directory, After Effects can\'t be found.');

    if (!command || !command.options.program)
      return path.join(app_dir, 'Scripts');
    else
      return path.join(command.options.program, 'Scripts');
  }
};
