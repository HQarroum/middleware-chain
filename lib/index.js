/**
 * ///////////////////////////////////////
 * ////////// Middleware chain  //////////
 * ///////////////////////////////////////
 *
 * This module exposes the interface of
 * the middleware chain.
 */

/**
 * Exporting the `Chain` module appropriately given
 * the environment (AMD, Node.js and the browser).
 */
(function (name, definition) {
    if (typeof define === 'function' && define.amd) {
	// Defining the module in an AMD fashion.
	define(['lodash'], definition);
    } else if (typeof module !== 'undefined' && module.exports) {
	// Exporting the module for Node.js/io.js.
	module.exports = definition(require('lodash'));
    } else {
	var global   = this;
	var instance = definition(global._);
	var old      = global[name];
	
	/**
	 * Allowing to scope the module
	 * avoiding global namespace pollution.
	 */
	instance.noConflict = function () {
	    global[name] = old;
	    return instance;
	};
	// Exporting the module in the global
	// namespace in a browser context.
	global[name] = instance;
    }
})('Chain', function (_) {
    
    /**
     * The chain constructor.
     * @constructor
     */
    var Chain = function () {
	this.chain      = [];
	this.errorChain = [];
    };
    
    /**
     * Pushes a function to the associated
     * array given its arity.
     * @param f the function to push
     */
    var push = function (f) {
	if (f.length === 4) {
            this.errorChain.push(f);
	} else {
            this.chain.push(f);
	}
    };
    
    /**
     * Pushes a middleware, or a collection of
     * middleware into the chain.
     * @returns {Chain}
     */
    Chain.prototype.use = function () {
	_.each(arguments, function (f) {
            if (_.isFunction(f)) {
		push.bind(this)(f);
            } else if (_.isArray(f)) {
		_.each(f, function (value) {
                    push.bind(this)(value);
		}, this);
            }
	}, this);
	return this;
    };
    
    /**
     * Triggers a new treatment to be processed by
     * the chain.
     * @param input
     * @param output
     */
    Chain.prototype.handle = function (input, output) {
	var index    = 0;
	var errIndex = 0;
	var chain    = this.chain;
	
	var next  = function (value) {
            if (value === 'middleware') {
		return;
            }
            if (value instanceof Error) {
		chain = this.errorChain;
            }
            callback(chain, value);
	}.bind(this);
	
	var callback = function (chain, value) {
            if (chain === this.chain) {
		var nextFunction = chain[index++];
		nextFunction && nextFunction(input, output, next);
            } else if (chain === this.errorChain) {
		var nextFunction = chain[errIndex++];
		nextFunction && nextFunction(value, input, output, next);
            }
	}.bind(this);
	next();
    };
    
    return Chain;
});
