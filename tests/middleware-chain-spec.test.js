import Chain from '../lib/index.js';

describe('The middleware chain', () => {
  var chain;

  /**
   * On each test, we create a new chain.
   */
  beforeEach(() => {
    chain = new Chain();
  });

  test('should present a coherent state at instantiation', () => {
    expect(chain.chain.length).toEqual(0);
    expect(chain.errorChain.length).toEqual(0);
  });

  test('should be able to carry new middleware', () => {
    chain.use(() => {});
    expect(chain.chain.length).toEqual(1);
    expect(chain.errorChain.length).toEqual(0);
  });

  test('should not carry invalid values', () => {
    chain.use(() => {})
        .use(null)
        .use(false)
        .use(0);
    expect(chain.chain.length).toEqual(1);
    expect(chain.errorChain.length).toEqual(0);
  });

  test('should allow middleware insertion using arrays', () => {
    chain.use([
        () => {},
        function (e, i, o, n) {}
    ]).use(() => {});
    expect(chain.chain.length).toEqual(2);
    expect(chain.errorChain.length).toEqual(1);
  });

  test('should be able to trigger previously inserted middleware', () => {
    let i = 0;

    chain.use(function (input, output, next) {
      ++i;
      next();
    }).use(() => {
      ++i;
    });
    chain.handle({}, {});
    expect(i).toEqual(2);
  });

  test('should be able to transmit inputs and outputs', (done) => {
    chain
      .use((input, output, next) => {
        input.foo = 'bar';
        next();
      })
      .use((input, output, next) => {
        output.foo = 'bar';
        next();
      })
      .use((input, output, next) => {
        setTimeout(() => next(), 1 * 1000);
      })
      .use((input, output) => {
        expect(input).toEqual({ foo: 'bar' });
        expect(output).toEqual({ foo: 'bar' });
        done();
      });
    chain.handle({}, {});
  });

  test('should be able to allow asynchronous functions', (done) => {
    chain
      .use((input, output, next) => {
        input.foo = 'bar';
        next();
      })
      .use(async (input, output, next) => {
        output.foo = 'bar';
        next();
      })
      .use((input, output) => {
        expect(input).toEqual({ foo: 'bar' });
        expect(output).toEqual({ foo: 'bar' });
        done();
      });
    chain.handle({}, {});
  });

  test('should be able to gracefully handle errors', () => {
    let i = 0;

    chain.use(function (input, output, next) {
      ++i;
      next(new Error());
    }).use(() => {
      ++i;
    }).use(function (err, input, output, next) {
      ++i;
      next();
    }).use(function (err, input, output, next) {
      ++i;
    }).handle({}, {});
    expect(i).toEqual(3);
    expect(chain.errorChain.length).toEqual(2);
  });

  test('should be able to handle exceptions', () => {
    let i = 0;
    let error = null;

    chain.use(function (input, output, next) {
      ++i;
      throw new Error('foo');
    }).use(() => {
      ++i;
    }).use(function (err, input, output, next) {
      error = err;
      ++i;
      next();
    }).use(function (err, input, output, next) {
      ++i;
    }).handle({}, {});
    expect(i).toEqual(3);
    expect(error.message).toEqual('foo');
  });
});
