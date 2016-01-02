# matslogger

A simple logger for Node

Enables different logging levels with extensibility in mind so you can customise it to however you wish to use it.

###Configuration
####Enviroment
Supports three default enviroments.  Development, testing and production.
The current enviroment must be set before the logger can be used. e.g. ```logger.config.enviroment('development');```
**Note that once the enviroment is set it is immutable. i.e. you cannot modify the enviroment once Node is running.
????NB:  You must set the enviroment explicity before starting to use this logger. (???)

