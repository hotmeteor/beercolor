/**
 * Search Controller
 */

'use strict';

var settings = require('../config/env/default');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

var request = require('request');
var _ = require('lodash');
var redis = require('redis');
var slug = require('slug');

var client = redis.createClient()

var key = settings.breweryDB.key;
var colorData = require(path.join(__dirname, '../data/colors.json'));

/*
	Search for data.
 */

var options = {
    url: 'http://api.brewerydb.com/v2/search',
    qs: {
        key: key,
        type: 'beer'
    },
    headers: {
        'User-Agent': 'request'
    }
};

var searchController = function(req, res) {

    var query = req.param('q');
    var querySlug = 'beerq_' + slug(query);
    var response = null;

    // Try to pull from cache.
    client.get(querySlug, function(err, response) {

    	// Nothing? Go get it.
        if (err || !response) {

            options.qs.q = query;

            request(options, function(err, response, body) {

                if (err) {
                    console.log(err);
                    return;
                }

                var info = JSON.parse(body);

                if (!info.data.length) {

                    response = {
                        meta: {
                            status: 'fail',
                            query: query,
                            message: 'No results'
                        }
                    };

                } else {

                    var beerData = info.data;

                    // Force one result.
                    beerData = [beerData[0]];

                    var output = [];

                    _.each(beerData, function(beer) {

                        var srmMin = _.filter(colorData, function(obj) {
                            if (beer.style === undefined) {
                                return false;
                            }
                            return beer.style.srmMin == obj.srm;
                        });

                        var srmMax = _.filter(colorData, function(obj) {
                            if (beer.style === undefined) {
                                return false;
                            }
                            return beer.style.srmMax == obj.srm;
                        });

                        output.push({
                            colors: {
                                srmMin: srmMin,
                                srmMax: srmMax
                            },
                            beer: beer
                        });

                    });

                    response = {
                        meta: {
                            status: 'ok',
                            query: query
                        },
                        data: output
                    };

                }

                // Stringify.
                response = JSON.stringify(response);

                // Cache it.
                client.set(querySlug, response, redis.print);

                // Send response.
                res.setHeader('Content-Type', 'application/json');
                res.end(response);
            });

        } else {

        	// Return cached.

            res.setHeader('Content-Type', 'application/json');

            res.end(response);

        }

    });


};


/*
	Send a response.
 */

var sendResponse = new EventEmitter();

sendResponse.on('send', function(res) {



});


module.exports = {
    index: searchController
};
