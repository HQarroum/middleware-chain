var should = require('should');
var Chain = require('../lib');

describe('The middleware chain', function () {
  var chain;

  /**
   * On each test, we create a new chain.
   */
  beforeEach(function () {
    chain = new Chain();
  });

  it('should present a coherent state at instantiation', function () {
    chain.chain.should.be.empty();
    chain.errorChain.should.be.empty();
  });

  it('should be able to carry new middleware', function () {
    chain.use(function () {});
    chain.chain.length.should.be.exactly(1);
    chain.errorChain.should.be.empty();
  });

  it('should not carry invalid values', function () {
    chain.use(function () {})
        .use(null)
        .use(false)
        .use(0);
    chain.chain.length.should.be.exactly(1);
    chain.errorChain.should.be.empty();
  });

  it('should allow middleware insertion using arrays', function () {
    chain.use([
        function () {},
        function (e, i, o, n) {}
    ]).use(function () {});
    chain.chain.length.should.be.exactly(2);
    chain.errorChain.length.should.be.exactly(1);
  });

  it('should be able to trigger previously inserted middleware', function () {
    var i = 0;

    chain.use(function (input, output, next) {
      ++i;
      next();
    }).use(function () {
      ++i;
    });
    chain.handle({}, {});
    i.should.be.exactly(2);
  });

  it('should be able to break the chain', function () {
    var i = 0;

    chain.use(function (input, output, next) {
      ++i;
      next('middleware');
    }).use(function () {
      ++i;
    });
    chain.handle({}, {});
    i.should.be.exactly(1);
  });

  it('should be able to gracefully handle errors', function () {
    var i = 0;

    chain.use(function (input, output, next) {
      ++i;
      next(new Error());
    }).use(function () {
      ++i;
    }).use(function (err, input, output, next) {
      ++i;
      next();
    }).use(function (err, input, output, next) {
      ++i;
    }).handle({}, {});
    i.should.be.exactly(3);
    chain.errorChain.length.should.be.exactly(2);
  });
});