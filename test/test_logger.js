// test_logger.js
var log = require('./matslogger');

// set the enviroment
log.config.enviroment('development');

// log warn
log.warn('This is a warning from mats logger.');

// log debug
log.debug('This is a debug.');

// log info
log.info('This is some info for development purposes.');

// create custom logging function
log.config.udl('auth_log', function (message) {
	console.log('Logged from the Auth Module: ' + message);
});

// turn on the custom logger
log.config.on('auth_log');

// test our custom logger
log.auth_log('user not authed!');

// hook into the warning logger
log.config.hook('warn', function (message) {
	return 'Haha: ' + message;
});

log.warn('this is NOT funny.');
// logs 'HaHa: this is NOT funny'

log.config.hook('warn', function (message) {
	console.log('This has been hijacked!');
});

log.warn('this will never sHoW');	// logs - This has been hijacked