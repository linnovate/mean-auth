'use strict';

/*
 * Defining the Package
 */

var mean = require('meanio');

var Module = mean.Module;
var Auth = new Module('mean-auth');

var passport = require('passport');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Auth.register(function(app, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Auth.routes(app, passport, database);

    mean.events.on('modulesFound', function() {
        require('./server/config/passport')(passport);

        // Register passport dependency
        mean.register('passport', function() {
            return passport;
        });
        // Register auth dependency
        mean.register('authorization', function() {
            // This needs to be replaced with proper package middleware handling.
            return require('./server/routes/middlewares/authorization');
        });

        // Use passport session
        app.use(passport.initialize());
        app.use(passport.session());
    });

    return Auth;
});
