'use strict';

const fs = 		require('fs'),
      child = require('child_process'),
      path =  require('path'),
      uuid =  require('uuid'),
      os =    require('os');

const exec =      child.exec,
      execSync =  child.execSync;

/******************************************************************************/
// HELPERS
/******************************************************************************/

function find_program(program_dir) {

  const files_in_program_dir = fs.readdirSync(program_dir);

  for (let i = 0; i < files_in_program_dir.length; i++) {
    const file = files_in_program_dir[i];
    if (file.includes('Adobe After Effects'))
      return path.join(program_dir, file);
  }

  return null;
}

function create_jsx_script(command, sync) {
  const jsx_script_file = path.join(os.tmpdir(),`ae-command-${uuid.v4()}.jsx`);
  const jsx_script = command.toString();
  const program_path = command.options.program
    ? path.join(command.options.program, 'Support Files')
    : path.join(program, 'Support Files');

  if (sync) {
    try {
      fs.writeFileSync(jsx_script_file, jsx_script, 'utf-8');
    } catch (err) {
      throw Error('Could not create jsx script for execution. Check permissions.');
    }
    return {script: jsx_script_file, program_path};
  }
  //async
  return new Promise((resolve, reject)=> {
    fs.writeFile(jsx_script_file, jsx_script, 'utf-8', err => {
      if (err)
        return reject(err);
      resolve({script: jsx_script_file, program_path});
    });
  });
}

/******************************************************************************/
// SETUP
/******************************************************************************/

const program = find_program('C:/Program Files/Adobe');

/******************************************************************************/
// EXPORT
/******************************************************************************/

module.exports = {

  execute : function(command) {

    return create_jsx_script(command)
    //Execute JSX Script
    .then( jsx => new Promise( resolve => {
      exec(`afterfx.exe -r ${jsx.script}`, {cwd: jsx.program_path}, (/*err, stdout, stderr*/) => {
        // see * below
        //if (err) return reject(err);
        //if (stderr) return reject(stderr);
        fs.unlink(jsx.script, function (err) {
          if (err) console.error(err)
        });

        resolve();
      });
    }));
  },

  executeSync : function(command) {

    const jsx = create_jsx_script(command, true);
    //Execute JSX
    try {
      execSync(`afterfx.exe -r ${jsx.script}`, {cwd: jsx.program_path});
    } catch (err) {
      //TODO *
      //I don't know why, executing a child process always throws an error in
      //windows, despite the AfterEffects execution working perfectly.
      //For now, we just ignore errors on execSync
    }

    fs.unlink(jsx.script, function (err) {
      if (err) console.error(err)
    });
  },

  canExecute: function(command) {
    return program || command && command.options.program;
  },

  scriptsDir: function(command){
    if (!this.canExecute(command))
      throw new Error('Can\'t get Scripts directory, After Effects can\'t be found.');

    if (!command || !command.options.program)
      return path.join(program, 'Support Files', 'Scripts');
    else
      return path.join(command.options.program, 'Support Files', 'Scripts');
  }
};
