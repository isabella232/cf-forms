module.exports = function(grunt) {

  'use strict';

  require('time-grunt')(grunt);

  var path = require('path');


  /**
   * Load the tasks we want to use, which are specified as dependencies in
   * the package.json file of cf-grunt-config.
   */

  // Sets the CWD to the cf-grunt-config package so that the loadTasks method
  // (employed in jit-grunt) looks in the correct place.
  grunt.file.setBase('./node_modules/cf-grunt-config/');
  // Loads all Grunt tasks in the node_modules directory within the new CWD.
  require('jit-grunt')(grunt, {
    // Below line needed because task name does not match package name
    bower: 'grunt-bower-task'
  });
  // Sets the CWD back to the project root so that the tasks work as expected.
  grunt.file.setBase('../../');


  /**
   * Initialize a variable to represent the Grunt task configuration.
   */
  var config = {

    // Define a couple of utility variables that may be used in task options.
    pkg: grunt.file.readJSON('bower.json'),
    env: process.env,
    opt: {
      // Include path to compiled extra CSS for IE7 and below.
      // Definitely needed if this component depends on an icon font.
      // ltIE8Source: 'static/css/main.lt-ie8.min.css',

      // Include path to compiled alternate CSS for IE8 and below.
      // Definitely needed if this component depends on media queries.
      // ltIE9AltSource: 'static/css/main.lt-ie9.min.css',

      // Set whether or not to include html5shiv for demoing a component.
      // Only necessary if component patterns include new HTML5 elements
      html5Shiv: false,
    },

    // Define tasks specific to this project here

  };


  /**
   * Define a function that, given the path argument, returns an object
   * containing all JS files in that directory.
   */
  function loadConfig(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', {cwd: path}).forEach(function(option) {
      key = option.replace(/\.js$/,'');
      object[key] = require(path + option);
      grunt.verbose.writeln("External config item - " + key + ": " + object[key]);
    });

    return object;
  }


  /**
   * Combine the config variable defined above with the results of calling the
   * loadConfig function with the given path, which is where our external
   * task options get installed by npm.
   */
  grunt.util._.extend(config, loadConfig('./node_modules/cf-grunt-config/tasks/options/'));

  grunt.initConfig(config);


  /**
   * Load any project-specific tasks installed in the customary location.
   */
  require('load-grunt-tasks')(grunt);


  /**
   * Create custom task aliases for our component build workflow.
   */
  grunt.registerTask('vendor', ['bower', 'copy:component_assets', 'copy:docs_assets', 'concat']);
  grunt.registerTask('default', ['concat', 'less', 'string-replace', 'autoprefixer', 'copy:docs', 'topdoc']);

};
