/**
 * User Routes
 */

'use strict';

var indexController = require('../controllers/index');
var searchController = require('../controllers/search');
var path = require('path');
var fs = require('fs');

var routes = function(app) {

    // Dynamically load all routes
    fs.readdirSync(__dirname).forEach(function(file) {
        // Dont load this index.js file
        if (!/index/.test(file)) {
            var route = path.join(__dirname, file);
            require(route)(app);
        }
    });

    // Home
    app.get('/', indexController.index);

    // Search
    app.get('/search', searchController.index);

};

module.exports = routes;
