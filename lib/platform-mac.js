const fs = 		       require('fs'),
      child =        require('child_process'),
      path =         require('path'),
      uuid =         require('uuid'),
      is =           require('is-explicit'),
      os =           require('os'),
      find_program = require('./find-program'),
      esc =          require('jsesc');

const exec =      child.exec,
      execSync =  child.execSync;

const program = find_program('/Applications');

function create_apple_script(command, sync) {
  var apple_script_file = path.join(os.tmpdir(),`ae-command-${uuid.v4()}.scpt`);
  var run_prog = path.basename(command.options.program || program);
  var apple_script = `tell application "${run_prog}"
  DoScript "${esc(command.toString(), { quotes: "double"})}"
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

module.exports = {

  execute: function(command) {

    return create_apple_script(command)
    //Execute Apple Script
    .then( apple_script => new Promise((resolve,reject) => {
      exec(`osascript ${apple_script}`, (err, stdout, stderr) => {
        if (err) return reject(err);
        if (stderr) return reject(stderr);
        fs.unlink(apple_script);

        resolve(stdout);
      });
    }))
  },

  executeSync : function(command) {

    let apple_script = create_apple_script(command, true);

    //Execute AppleScript
    execSync(`osascript ${apple_script}`);
    fs.unlink(apple_script);
  },

  canExecute: function(command) {
    return program || (command && command.options.program);
  },

  scriptsDir: function(command){
    if (!this.canExecute(command))
      throw new Error("Can't get Scripts directory, After Effects can't be found.");

    if (!command || !command.options.program)
      return path.join(program, "Scripts");
    else
      return path.join(command.options.program, "Scripts");
  }
}
