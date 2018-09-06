var assert = require('assert');
var myModule = require('../index.js');
describe('myModule', function() {
    describe('myFunction', function() {
        it('should be a function', function() {
            assert.equal(typeof myModule.myFunction, 'function');
        });
        it('should return \'It Works!\'', function() {
            assert.equal(myModule.myFunction(), 'It Works!');
        });
    });
    describe.skip('More Tests', function() {
        it('should skip this test until more code/tests are implemented', function() {
            assert.equal(1,2);
        });
    });
});
