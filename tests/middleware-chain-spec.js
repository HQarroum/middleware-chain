var should = require('should');
var Chain  = require('../lib');

describe('The middleware chain', function () {
    
    var chain = undefined;
    
    beforeEach(function () {
	chain = new Chain();
    });
    
    it('should be able to be instantiated while keeping a coherent state', function () {
	chain.chain.should.be.empty();
	chain.errorChain.should.be.empty();
    });
    
    it('should be able to carry new middlewares', function () {
	chain.use(function () {});
	chain.chain.length.should.be.exactly(1);
	chain.errorChain.should.be.empty();
    });
    
    it('should be able to trigger previously inserted middlewares', function () {
	var i = 0;
	
	chain.use(function (input, output, next) { ++i, next(); });
	chain.use(function () { ++i });
	chain.handle({}, {});
	i.should.be.exactly(2);
    });
    
    it('should be able to break the chain', function () {
	var i = 0;
	
	chain.use(function (input, output, next) { ++i, next('middleware'); });
	chain.use(function () { ++i });
	chain.handle({}, {});
	i.should.be.exactly(1);
    });
    
    it('should be able to gracefully handle errors', function () {
	var i = 0;
	
	chain.use(function (input, output, next) { ++i, next(new Error()); });
	chain.use(function () { ++i });
	chain.use(function (err, input, output, next) { ++i, next(); });
	chain.use(function (err, input, output, next) { ++i });
	chain.handle({}, {});
	i.should.be.exactly(3);
	chain.errorChain.length.should.be.exactly(2);
    });
});