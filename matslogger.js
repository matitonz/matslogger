// matslogger.js

function MatsLogger() {

	// enviroment enum
	const DEV_ENVIRO = 'development';
	const TEST_ENVIRO = 'testing';
	const PROD_ENVIRO = 'production';

	// default logger names
	const WARN = 'warn';
	const DEBUG = 'debug';
	const INFO = 'info';

	// unix console colours
	const RESET = '\x1b[39m';
	const RED = '\x1b[91m';
	const GREEN = '\x1b[32m';
	const YELLOW = '\x1b[93m';
	const BLUE = '\x1b[36m';
	const MAGENTA = '\x1b[35m';

	var logger = this;			// keep a ref to this
	var _enviroment = null;		// private enviroment variable
	var _udls = {}, _udl_state = {};	// objects to hold the User Defined Logging (UDL) functions and states
	this.config = config = {};	// expose config object
	this.hook = hook = {};		// object to allow hooks to be inserted

	function invalid_enviroment() {
		throw new Error('Invalid enviroment variable given.');
	}

	function validate_logging_function(loggingFunction) {
		if (!loggingFunction || typeof loggingFunction !== 'function') {
			throw new Error('Invalid logging function given.');
		}
		else {
			return true;
		}
	} 

	function valid_logging_function(enviro, loggingFunction) {
		if (enviro !== DEV_ENVIRO || enviro !== TEST_ENVIRO || enviro !== PROD_ENVIRO) {
			invalid_enviroment();
		}
		else {
			return validate_logging_function(replacementFunction);
		}
	}

	// set's the enviroment variable
	config.enviroment = function (enviro) {
		if (_enviroment) {
			throw new Error('Enviroment already set.  Cannot reset enviroment setting.');
		}
		else {
			if (enviro === DEV_ENVIRO || enviro === TEST_ENVIRO || enviro === PROD_ENVIRO) {
				_enviroment = enviro;
			}
			else {
				invalid_enviroment();
			}
		}
	};

	// allow hooks into the standard functions
	config.hook = function (name, hookFunction) {
		if (!name && name !== WARN && name !== DEBUG && name !== INFO) {
			// no valid name fond
			throw new Error('Please specify a valid logging function to hook into.');
		}
		if (validate_logging_function(hookFunction)) {
			var new_function;
				// result return by hook function is processed by the default function
				// this allows a hook function to extend or replace the default function
			switch (name) {
				case WARN:
					new_function = function (message) {
						log_warn(hookFunction.call(logger, message));
					};
					break;
				case DEBUG:
					new_function = function (message) {
						log_debug(hookFunction.call(logger, message));
					};
					break;
				case INFO:
					new_function = function (message) {
						log_info(hookFunction.call(logger, message));
					};
					break;
				// fallthrough to nothing
			}
			// set our new extended function to the logger object
			if (new_function && typeof new_function == 'function') {
				logger[name] = new_function;
			}
		}
	};

	// allow users to define their own functions with custom names
	config.udl = function (name, loggingFunction) {
		// validation
		if (!name || typeof name !== 'string') {
			throw new Error('Please specify a valid name for the User Defined Logging function.');
		}
		else {
			if (validate_logging_function(loggingFunction)) {
				_udl_state[name] = false;	// turn off when created
				logger[name] = function (message) {
					if (_udl_state[name]) {
						// logging is set for this UDL fun
						loggingFunction.call(logger, message);
					}
				};
			}
		}
	};

	config.on = function (name) {
		// turn on function by name
		if (name && _udl_state[name] !== undefined) {
			_udl_state[name] = true;
		}
	};
	
    function stringify_maybe(str_or_obj) {
        if (typeof str_or_obj === 'string') {
            return str_or_obj;
        }
        else {
            return JSON.stringify(str_or_obj);
        }
    }
    
    function print(msg) {
    	console.log(stringify_maybe(msg));
    }
    this.print = print;

	// default logging functionality
	function log_warn(message) {
		// always log unless overridden
		if (message) {
			var to_red = RED + stringify_maybe(message) + RESET;
			console.log(to_red);
		}
	};
	this.warn = log_warn;

	function log_debug(message) {
		if (!message) {
			return false;
		}
		// only log if right enviroment
		if (_enviroment === TEST_ENVIRO || _enviroment === DEV_ENVIRO) {
			var to_yellow = YELLOW + stringify_maybe(message) + RESET;
			console.log(to_yellow);
		}
	};
	this.debug = log_debug;

	function log_info(message) {
		if (!message) {
			return false;
		}
		// log only in dev
		if (_enviroment === DEV_ENVIRO) {
			var to_blue = BLUE + stringify_maybe(message) + RESET;
			console.log(to_blue);
		}
	};
	this.info = log_info;

}

module.exports = new MatsLogger();