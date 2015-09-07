# middleware-chain

A middleware chain component for Node.js.

Current version: **1.0.0**

Lead Maintainer: [Halim Qarroum](mailto:hqarroum@awox.com)

## Install

Only 0.5 kB Gzipped.

```sh
$ npm install --save middleware-chain
```

```sh
$ bower install --save middleware-chain
```

## Motivations

I found the [chain of responsibility](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) pattern to be pretty useful in a lot of components I write. Allowing to separate responsibilities in the form of pluggable handlers along a processing chain allows to decouple the treatments made on the chain (pushing middlewares and interceptors), to hotplug new treatments while the application is running and expose a clean and evolutive interface.

The programming interface provided by this component draws its inspiration from the Express framework, in which Router and Middleware are in charge of treating received requests.

## Usage

### Creating a chain

Creating a middleware chain is as simple as calling its constructor. You will then be able to push new middlewares in the chain using the `.use` method.

```javascript
var chain = new Chain();

// Pushing a new function middleware.
chain.use(function (input, output, next) {
  next();
});
```

It is also possible to push many middlewares at once using an array.

```javascript
chain.use([
    function (input, output, next) {
        console.log('foo');
        next();
    },
    
    function (input, output, next) {
        console.log('bar');
        next();
    }
]);
```
