# middleware-chain
> A middleware chain component for Node and the browser.

[![Build Status](https://travis-ci.org/HQarroum/middleware-chain.svg?branch=master)](https://travis-ci.org/HQarroum/middleware-chain)
[![Code Climate](https://codeclimate.com/repos/55edafae69568006cf007c34/badges/cb599bae40767f430845/gpa.svg)](https://codeclimate.com/repos/55edafae69568006cf007c34/feed)

Current version: **1.0.6**

Lead Maintainer: [Halim Qarroum](mailto:hqm.post@gmail.com)

## Install

##### Using NPM

```sh
$ npm install --save middleware-chain-js
```

##### Using Bower

```sh
$ bower install --save middleware-chain
```

## Motivations

I find the [chain of responsibility](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) pattern to be pretty useful in a lot of components I write. It allows to separate responsibilities in the form of pluggable handlers along a processing chain which decouples the treatments made on the chain, while having the ability to declare in which order they will be executed.

It also makes hot-plugging of new treatments possible while the application is running, and exposes a clean and evolutive interface.

The programming interface provided by this component draws its inspiration from the [Express framework](http://expressjs.com/), in which [`routers` and `middlewares`](http://expressjs.com/guide/using-middleware.html) are in charge of treating received requests.

## Semantics

A *chain* holds a collection of middlewares, and iterates over them as a treatment is handled.

A *middleware* is a software component that handles an `input`, decides whether it can handle it, and if it does, will execute a particular routine producing an `output`. If a middleware cannot handle an input, the next middleware in the chain is called.

What an input and an output concretely are, is dependant on the implementation, and the client of the library will have to provide them. However, in order to keep an appropriate logic, their semantics should *not* change.

## Usage

### Creating a chain

Creating a middleware chain is as simple as calling its constructor. A new instance does not contain any middleware.

```javascript
var chain = new Chain();
```

### Adding middlewares

You will then be able to push new middlewares in the chain using the `.use` method.

```javascript
chain.use(function (input, output, next) {
  // Perform some treatment.
  next();
});
```

It is also possible to push many middlewares at once using an array, which comes in handy when grouping a particular set of actions together.

```javascript
chain.use([
    function (input, output, next) {
        // Verify for instance that the
        // `input` is correctly formatted.
        next();
    },

    function (input, output, next) {
        // Perform some treatment on
        // the `input`.
        next();
    }
]);
```

> Similarly, you can push many middlewares by simply passing them in the argument list of `.use`.

### Middleware lifecycle

When a middleware is called in the chain, it can handle an input, and interact with the output. If the middleware cannot handle the given input, it should call the next middleware in the chain.

```javascript
chain.use(function (input, output, next) {
  if (!handled(input)) {
    // Calling the next middleware.
    return next();
  }
  // Otherwise, we treat the input.
  // In this example we "pipe" the input
  // with the output.
  input.stream.pipe(output.stream);
});
```

### Error handlers

Sometimes it is useful to signal that an error occurred along the chain and to have an approriate handler gracefully taking care of it. As such, it is possible to insert error handlers in the chain and to signal an error in a middleware.

```javascript
// A regular middleware can trigger an `Error`
// object by passing it to the next function.
chain.use(function (input, output, next) {
  next(new Error('An error occurred');
});

// An event handler can be recognized because he
// declares an error object as first argument.
chain.use(function (err, input, output, next) {
  // Handle the error, or forward it to another error
  // handler using `next`.
});
```

> Once an `Error` has been triggered by a middleware, the next error callback will be called right away, and subsequent regular middleware will *not* be called in this case. If no error handlers are declared, the chain processing is stopped.

### Triggerring the chain

In order to start the chain and process the input, you need to call the `.handle` method. It needs two arguments, being respectively the *input* and the *output*.

```javascript
// In this example, we pass to the middleware
// chain an input stream, and an output stream.
chain.handle({ stream: input }, { stream: output });
```
