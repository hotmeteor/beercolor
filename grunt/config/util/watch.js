// Configuration for Watch task(s)
// Runs specified tasks when file changes are detected
'use strict';


var taskConfig = function(grunt) {

  var config = {
    configFiles: {
      files: [
        'Gruntfile.js',
        'grunt/**/*.js',
        '*.json'
      ],
      options: {
        reload: true,
        interrupt: true
      },
      tasks: [
        'wiredep',
        'serve:nowatch'
      ]
    },
    html: {
      files: [
        '<%= yeogurt.client %>/templates/**/*.html'
      ],
      tasks: [
        'clean:tmp'
      ]
    },
    sass: {
      files: ['<%= yeogurt.client %>/styles/**/*.{scss,sass}'],
      tasks: [
        'injector:sass',
        'sass:server',
        'autoprefixer:server'
      ]
    },
    injectCss: {
      files: [
        '<%= yeogurt.client %>/styles/**/*.css'
      ],
      tasks: [
        'injector:css',
        'autoprefixer:server'
      ]
    },
    injectJs: {
      files: [
        '<%= yeogurt.client %>/scripts/**/*.js',
        '!<%= yeogurt.client %>/scripts/{main,app}.js',
        '!<%= yeogurt.client %>/scripts/routes.js'
      ],
      tasks: ['injector:scripts']
    },
    js: {
      files: [
        '<%= yeogurt.client %>/scripts/**/*.js'
      ],
      tasks: [
        'newer:jshint'
      ]
    },
    handlebars: {
      files: ['<%= yeogurt.client %>/templates/**/*.hbs'],
      tasks: [
        'handlebars:server'
      ]
    },
    livereload: {
      options: {
        livereload: true
      },
      files: [
        '<%= yeogurt.client %>/*.{ico,png,txt}',
        '<%= yeogurt.client %>/**/*.html',
        '<%= yeogurt.tmp %>/styles/**/*.{css,ttf,otf,woff,svg,eot}',
        '<%= yeogurt.client %>/scripts/**/*.js',
        '<%= yeogurt.tmp %>/templates/**/*.js',
        '<%= yeogurt.client %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
      ]
    },
    express: {
      files: [
        'server.js',
        'server/**/*.{js,json,html}'
      ],
      tasks: [
        'express:server',
        'wait'
      ],
      options: {
        livereload: true,
        nospawn: true //Without this option specified express won't be reloaded
      }
    }
  };
  

  grunt.config.set('watch', config);

};

module.exports = taskConfig;
