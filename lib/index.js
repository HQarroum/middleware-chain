/**
 * ///////////////////////////////////////
 * ////////// Middleware chain  //////////
 * ///////////////////////////////////////
 *
 * This module exposes the interface of
 * the middleware chain.
 */

/**
 * Returns whether the given variable is a function.
 */
const isFunction = (f) => f && {}.toString.call(f) === '[object Function]';

/**
 * The chain constructor.
 * @constructor
 */
const Chain = function () {
  this.chain = [];
  this.errorChain = [];
};

/**
 * Pushes a function to the associated
 * array given its arity.
 * @param f the function to push
 */
const push = function (f) {
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
Chain.prototype.use = function (...args) {
  args.forEach((f) => {
    if (isFunction(f)) {
      push.call(this, f);
    } else if (Array.isArray(f)) {
      f.forEach((value) => push.call(this, value));
    }
  });
  return (this);
};

/**
 * Triggers a new treatment to be processed by
 * the chain.
 * @param input
 * @param output
 */
Chain.prototype.handle = function (input, output) {
  let index = 0;
  let errIndex = 0;
  let chain = this.chain;

  const callback = (chain, value) => {
    let nextFunction;
    if (chain === this.chain) {
      nextFunction = chain[index++];
      if (nextFunction) {
        nextFunction(input, output, next);
      }
    } else if (chain === this.errorChain) {
      nextFunction = chain[errIndex++];
      if (nextFunction) {
        nextFunction(value, input, output, next);
      }
    }
  };

  const next = (value) => {
    if (value instanceof Error) {
      chain = this.errorChain;
    }
    callback(chain, value);
  };

  next();
};

export default Chain;