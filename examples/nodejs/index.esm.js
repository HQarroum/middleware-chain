import Chain from '../../lib/index.js';

// Creating the chain.
const chain = new Chain();

// Adding handlers.
chain.use([
  (input, output, next) => {
    console.log('Handler 1');
    next();
  },
  (input, output, next) => setTimeout(() => {
    input.foo = 'bar';
    console.log('Handler 2');
    next();
  }, 1000),
  (input, _output, _next) => {
    console.log(`Handler 3 : ${input.foo}`);
  }
]);

// Starting the chain.
chain.handle({}, {});
