'use strict';

var expect = chai.expect;
var assert = chai.assert;

describe('Provided unit tests', function() {

    it('Listener unit test for ImageCollectionModel', function() {
        var modelModule = createModelModule();
        var imageCollectionModel = new modelModule.ImageCollectionModel();
        var firstListener = sinon.spy();
        var imageModel = new modelModule.ImageModel(
            'images/some_image.gif',
            new Date(),
            '',
            0);

        imageCollectionModel.addListener(firstListener);
        imageCollectionModel.addImageModel(imageModel);

        expect(firstListener.called, 'ImageCollectionModel listener should be called').to.be.ok;
        expect(firstListener.calledWith(modelModule.IMAGE_ADDED_TO_COLLECTION_EVENT, sinon.match.any, imageModel), 'ImageCollectionModel argument verification').to.be.true;

        var secondListener = sinon.spy();
        imageCollectionModel.addListener(secondListener);
        imageCollectionModel.addImageModel(imageModel);
        expect(firstListener.callCount, 'ImageCollectionModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "ImageCollectionModel second listener should have been called").to.be.ok;
    });

    it('Listener unit test for ImageModel', function() {
        var modelModule = createModelModule();
        var imageModel = new modelModule.ImageModel(
            'images/some_image.gif',
            new Date(),
            '',
            0);

        var firstListener = sinon.spy();

        imageModel.addListener(firstListener);
        imageModel.setRating(5);

        expect(firstListener.called, 'ImageModel listener should be called').to.be.ok;
        expect(firstListener.calledWith(imageModel, sinon.match.any), 'ImageModel argument verification').to.be.true;

        var secondListener = sinon.spy();
        imageModel.addListener(secondListener);
        imageModel.setCaption('some-caption');
        expect(firstListener.callCount, 'ImageModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "ImageModel second listener should have been called").to.be.ok;
    });

    it('Validate ImageModel input for setRating', function () {
        var modelModule = createModelModule();
        var imageModel = new modelModule.ImageModel(
            'image',
            new Date(),
            '',
            0
        );

        try {
            imageModel.setRating('string is invalid');
            expect(1, 'ImageModel.setRating should throw error on string input').to.equal(0);
        } catch (e) {
            expect(e.message, 'ImageModel.setRating should not allow string input').to.equal("Invalid arguments to ImageModel.setRating: {\"0\":\"string is invalid\"}");
        }

        try {
            imageModel.setRating(-1);
            expect(1, 'ImageModel.setRating should throw error on negative input').to.equal(0);
        } catch (e) {
            expect(e.message, 'ImageModel.setRating should not allow negative value input').to.equal("Invalid arguments to ImageModel.setRating: {\"0\":-1}");
        }

        try {
            imageModel.setRating(6);
            expect(1, 'ImageModel.setRating should throw error on input above 5').to.equal(0);
        } catch (e) {
            expect(e.message, 'ImageModel.setRating should not allow input above 5').to.equal("Invalid arguments to ImageModel.setRating: {\"0\":6}");
        }
    });

    it('Validate ImageModel input for setCaption', function () {
        var modelModule = createModelModule();
        var imageModel = new modelModule.ImageModel(
            'image',
            new Date(),
            '',
            0
        );

        try {
            imageModel.setCaption(1);
            expect(1, 'ImageModel.setCaption should throw error on numeric input').to.equal(0);
        } catch (e) {
            expect(e.message, 'ImageModel.setCaption should not allow numeric input').to.equal("Invalid arguments to ImageModel.setCaption: {\"0\":1}");
        }
    });

    it('Validate ImageModel constructor validation', function () {
        var modelModule = createModelModule();

        try {
            new modelModule.ImageModel(
                0,
                new Date(),
                '',
                0
            );
            expect(1, "new ImageModel() should not allow numeric value for path").to.equal(0);
        } catch (e) {
            assert(e.message.indexOf('Invalid arguments supplied to ImageModel: ') != -1, "ImageModel needs to validate arguments");
        }

        try {
            new modelModule.ImageModel(
                'image',
                'date string',
                '',
                0
            );
            expect(1, "new ImageModel() should not allow string value for date").to.equal(0);
        } catch (e) {
            assert(e.message.indexOf('Invalid arguments supplied to ImageModel: ') != -1, "ImageModel needs to validate arguments");
        }

        try {
            new modelModule.ImageModel(
                'image',
                0,
                '',
                0
            );
            expect(1, "new ImageModel() should not allow numeric value for date").to.equal(0);
        } catch (e) {
            assert(e.message.indexOf('Invalid arguments supplied to ImageModel: ') != -1, "ImageModel needs to validate arguments");
        }

        try {
            new modelModule.ImageModel(
                'image',
                new Date(),
                0,
                0
            );
            expect(1, "new ImageModel() should not allow numeric value for caption").to.equal(0);
        } catch (e) {
            assert(e.message.indexOf('Invalid arguments supplied to ImageModel: ') != -1, "ImageModel needs to validate arguments");
        }

        try {
            new modelModule.ImageModel(
                'image',
                new Date(),
                '',
                ""
            );
            expect(1, "new ImageModel() should not allow string value for rating").to.equal(0);
        } catch (e) {
            assert(e.message.indexOf('Invalid arguments supplied to ImageModel: ') != -1, "ImageModel needs to validate arguments");
        }

        try {
            new modelModule.ImageModel(
                'image',
                new Date(),
                '',
                -1
            );
            expect(1, "new ImageModel() should not allow negative value for rating").to.equal(0);
        } catch (e) {
            assert(e.message.indexOf('Invalid arguments supplied to ImageModel: ') != -1, "ImageModel needs to validate arguments");
        }

        try {
            new modelModule.ImageModel(
                'image',
                new Date(),
                '',
                6
            );
            expect(1, "new ImageModel() should not allow values greater than 5 for rating").to.equal(0);
        } catch (e) {
            assert(e.message.indexOf('Invalid arguments supplied to ImageModel: ') != -1, "ImageModel needs to validate arguments");
        }
    })
});
