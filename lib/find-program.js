"use strict";

const fs = require('fs');

module.exports = function(program_dir) {

  let files_in_program_dir = fs.readdirSync(program_dir);

  for (var i = 0; i < files_in_program_dir.length; i++) {
    let file = files_in_program_dir[i];
    if (file.includes("Adobe After Effects"))
      return program_dir + "/" + file;
  }

  return null;
};
