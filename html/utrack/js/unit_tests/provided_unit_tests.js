'use strict';

var expect = chai.expect;
describe('First unit test', function() {

    it('Some tests', function() {
        /*
         We're using Mocha and Chai to do unit testing.

         Mocha is what sets up the tests (the "describe" and "it" portions), while
         Chai does the assertion/expectation checking.

         Links:
         Mocha: http://mochajs.org
         Chai: http://chaijs.com

         Note: This is a bunch of tests in one it; you'll probably want to separate them
         out into separate groups to make debugging easier. It's also more satisfying
         to see a bunch of unit tests pass on the results page :)
        */

        // Here is the most basic test you could think of:
        expect(1==1, '1==1').to.be.ok;

        // You can also for equality:
        expect(1, '1 should equal 1').to.equal(1);

        // JavaScript can be tricky with equality tests
        expect(1=='1', "1 should == '1'").to.be.true;

        // Make sure you understand the differences between == and ===
        expect(1==='1', "1 shouldn't === '1'").to.be.false;

        // Use eql for deep comparisons
        expect([1] == [1], "[1] == [1] should be false because they are different objects").to.be.false;

        expect([1], "[1] eqls [1] should be true").to.eql([1]);
    });

    it('Callback demo unit test', function() {
        /*
        Suppose you have a function or object that accepts a callback function,
        which should be called at some point in time (like, for example, a model
        that will notify listeners when an event occurs). Here's how you can test
        whether the callback is ever called.
         */

        // First, we'll create a function that takes a callback, which the function will
        // later call with a single argument. In tests below, we'll use models that
        // take listeners that will be later called
        var functionThatTakesCallback = function(callbackFn) {
            return function(arg) {
                callbackFn(arg);
            };
        };

        // Now we want to test if the function will ever call the callbackFn when called.
        // To do so, we'll use Sinon's spy capability (http://sinonjs.org/)
        var spyCallbackFn = sinon.spy();

        // Now we'll create the function with the callback
        var instantiatedFn = functionThatTakesCallback(spyCallbackFn);

        // This instantiated function should take a single argument and call the callbackFn with it:
        instantiatedFn("foo");

        // Now we can check that it was called:
        expect(spyCallbackFn.called, 'Callback function should be called').to.be.ok;

        // We can check the number of times called:
        expect(spyCallbackFn.callCount, 'Number of times called').to.equal(1);

        // And we can check that it got its argument correctly:
        expect(spyCallbackFn.calledWith('foo'), 'Argument verification').to.be.true;

        // Or, equivalently, get the first argument of the first call:
        expect(spyCallbackFn.args[0][0], 'Argument verification 2').to.equal('foo');

        // This should help you understand the listener testing code below
    });

    it('Listener unit test for GraphModel', function() {
        var graphModel = new GraphModel();
        var firstListener = sinon.spy();

        graphModel.addListener(firstListener);
        graphModel.selectGraph("scatterplot");

        expect(firstListener.called, 'GraphModel listener should be called').to.be.ok;
        expect(firstListener.calledWith(GRAPH_SELECTED_EVENT, sinon.match.any, "scatterplot"), 'GraphModel argument verification').to.be.true;

        var secondListener = sinon.spy();
        graphModel.addListener(secondListener);
        graphModel.selectGraph("table summary");
        expect(firstListener.callCount, 'GraphModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "GraphModel second listener should have been called").to.be.ok;
    });

    it('Verify GraphModel does not notify listener when setting active view to be the currently active one', function () {
        var graphModel = new GraphModel();
        var firstListener = sinon.spy();

        graphModel.addListener(firstListener);
        graphModel.selectGraph("scatterplot");

        expect(firstListener.called, 'GraphModel listener should be called').to.be.ok;
        expect(firstListener.calledWith(GRAPH_SELECTED_EVENT, sinon.match.any, "scatterplot"), 'GraphModel argument verification').to.be.true;

        var secondListener = sinon.spy();
        graphModel.addListener(secondListener);
        graphModel.selectGraph("scatterplot");
        expect(firstListener.callCount, 'GraphModel first listener should have been called only once').to.equal(1);
        expect(secondListener.called, "GraphModel second listener should not have been called").to.not.be.ok;
    });

    it('Verify GraphModel sets selected graph to be active', function () {
        var graphModel = new GraphModel();

        graphModel.selectGraph("scatterplot");

        expect(graphModel.getNameOfCurrentlySelectedGraph(), "GraphModel should set selected graph to be active").to.equal("scatterplot");
    });

    it('Listener unit test for ActivityStoreModel', function() {
        var activityStoreModel = new ActivityStoreModel();
        var firstListener = sinon.spy();
        var activityData = new ActivityData();

        activityStoreModel.addListener(firstListener);
        activityStoreModel.addActivityDataPoint(activityData);

        expect(firstListener.called, 'ActivityStoreModel listener should be called').to.be.ok;
        expect(firstListener.calledWith(ACTIVITY_DATA_ADDED_EVENT, sinon.match.any, activityData), 'ActivityStoreModel argument verification').to.be.true;

        var secondListener = sinon.spy();
        activityStoreModel.addListener(secondListener);
        activityStoreModel.addActivityDataPoint(activityData);
        expect(firstListener.callCount, 'ActivityStoreModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "ActivityStoreModel second listener should have been called").to.be.ok;
    });

    it('Modifying data test for ActivityStoreModel', function () {
        var activityStoreModel = new ActivityStoreModel();
        var activityData = new ActivityData();

        activityStoreModel.addActivityDataPoint(activityData);

        expect(activityStoreModel.getActivityDataPoints().length, "ActivityStoreModel should contain 1 data point").to.equal(1);

        activityStoreModel.removeActivityDataPoint(activityData);

        expect(activityStoreModel.getActivityDataPoints().length, "ActivityStoreModel should remove data point").to.equal(0);
    });

    it('Verify getIntValueById works properly', function () {
        var input = document.createElement('input');
        input.id = 'testIntValueId';
        input.style.display = 'none';
        input.name = 'fail expected';

        var mock = sinon.mock(document);
        // getElementById is called twice when an exception is thrown by the method.
        mock.expects("getElementById").withArgs('testIntValueId').exactly(6).returns(input);

        input.value = '1a';
        try {
            getIntValueById('testIntValueId');
            // This line will not be run if test passes
            expect(1, 'getIntValueById should throw error for value 1a').to.equal(0);
        } catch (value) {
            expect(value, 'getIntValueById should throw element name').to.equal('fail expected');
        }

        input.value = '1.1';
        try {
            var result = getIntValueById('testIntValueId');
            expect(result, 'getIntValueById should return input value for value 1.1').to.equal(1.1);
        } catch (value) {
            // This line will not be run if test passes
            expect(1, 'getIntValueById should not throw error for valid input').to.equal(0);
        }

        input.value = '';
        try {
            getIntValueById('testIntValueId');
            // This line will not be run if test passes
            expect(1, 'getIntValueById should throw error for value empty string').to.equal(0);
        } catch (value) {
            console.log(value);
            expect(value, 'getIntValueById should throw element name').to.equal('fail expected');
        }

        input.value = '1';
        try {
            var result = getIntValueById('testIntValueId');
            expect(result, 'getIntValueById should return input value for value 1').to.equal(1);
        } catch (value) {
            // This line will not be run if test passes
            expect(1, 'getIntValueById should not throw error for valid input').to.equal(0);
        }

        mock.verify();

    });

});
