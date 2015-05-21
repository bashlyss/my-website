'use strict';

var expect = chai.expect;
var assert = chai.assert;

describe('Provided unit tests', function() {
    it("Verify car calls point in object properly", function () {
        var sceneGraphModule = createSceneGraphModule();
        var car = new sceneGraphModule.CarNode();
        var point = {};
        point.x = 0;
        point.y = 0;
        assert.isTrue(car.pointInObject(point), "Point (0,0) should be in car");
        point.x = 25;
        point.y = 50;
        assert.isTrue(car.pointInObject(point), "Point (25,50) should be in car");
        point.x = -25;
        point.y = 50;
        assert.isTrue(car.pointInObject(point), "Point (-25,50) should be in car");
        point.x = 25;
        point.y = -50;
        assert.isTrue(car.pointInObject(point), "Point (25,-50) should be in car");
        point.x = -25;
        point.y = -50;
        assert.isTrue(car.pointInObject(point), "Point (-25,-50) should be in car");
        point.x = 26;
        point.y = 50;
        assert.isFalse(car.pointInObject(point), "Point (26,50) should not be in car");
        point.x = -25;
        point.y = 51;
        assert.isFalse(car.pointInObject(point), "Point (-25,51) should not be in car");
        point.x = 25;
        point.y = -51;
        assert.isFalse(car.pointInObject(point), "Point (25,-51) should not be in car");
        point.x = -26;
        point.y = -50;
        assert.isFalse(car.pointInObject(point), "Point (-26,-50) should not be in car");
    });

    it("Verify tire calls pointInObject properly", function () {
        var sceneGraphModule = createSceneGraphModule();
        var tire = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_LEFT_TIRE_PART);
        var point = {};
        point.x = 0;
        point.y = 0;
        assert.isTrue(tire.pointInObject(point), "Point (0,0) should be in tire");
        point.x = 5;
        point.y = 12;
        assert.isTrue(tire.pointInObject(point), "Point (5,12) should be in tire");
        point.x = -5;
        point.y = 12;
        assert.isTrue(tire.pointInObject(point), "Point (-5,12) should be in tire");
        point.x = 5;
        point.y = -12;
        assert.isTrue(tire.pointInObject(point), "Point (5,-12) should be in tire");
        point.x = -5;
        point.y = -12;
        assert.isTrue(tire.pointInObject(point), "Point (-5,-12) should be in tire");
        point.x = 6;
        point.y = 12;
        assert.isFalse(tire.pointInObject(point), "Point (6,12) should not be in tire");
        point.x = -5;
        point.y = 13;
        assert.isFalse(tire.pointInObject(point), "Point (-5,13) should not be in tire");
        point.x = 5;
        point.y = -13;
        assert.isFalse(tire.pointInObject(point), "Point (5,-13) should not be in tire");
        point.x = -6;
        point.y = -12;
        assert.isFalse(tire.pointInObject(point), "Point (-6,-12) should not be in tire");
    });

    it("Test car movement", function () {
        var sceneGraphModule = createSceneGraphModule();
        var car = new sceneGraphModule.CarNode();
        var point = {};
        point.x = 400;
        point.y = 200;
        state = CAR_MOVE;
        car.move(point);
        expect(car.translateTransform.getTranslateX(), "X translation should be 400").to.equal(400);
        expect(car.translateTransform.getTranslateY(), "Y translation should be 200").to.equal(200);
    });

    it("Test car scaling", function () {
        var sceneGraphModule = createSceneGraphModule();
        var car = new sceneGraphModule.CarNode();
        var point = {};
        // initialize location
        point.x = 400;
        point.y = 200;
        state = CAR_MOVE;
        car.move(point);

        // vertical scale
        point.x = 600;
        point.y = 100;
        state = CAR_SCALE_TOP;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 1").to.equal(1);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 2").to.equal(2);
        point.y = 175;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 1").to.equal(1);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 0.5").to.equal(0.5);
        point.y = 150;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 1").to.equal(1);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 1").to.equal(1);
        point.y = 300;
        state = CAR_SCALE_BOTTOM;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 1").to.equal(1);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 2").to.equal(2);
        point.y = 225;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 1").to.equal(1);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 0.5").to.equal(0.5);
        point.y = 250;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 1").to.equal(1);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 1").to.equal(1);

        // horizontal scale
        point.x = 325;
        state = CAR_SCALE_LEFT;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 3").to.equal(3);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 1").to.equal(1);
        point.x = 350;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 2").to.equal(2);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 1").to.equal(1);
        point.x = 388
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 0.5").to.equal(0.5);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 1").to.equal(1);
        point.x = 375;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 1").to.equal(1);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 1").to.equal(1);
        point.x = 475;
        state = CAR_SCALE_RIGHT;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 3").to.equal(3);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 1").to.equal(1);
        point.x = 412;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 0.5").to.equal(0.5);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 1").to.equal(1);
        point.x = 425;
        car.scale(point);
        expect(car.scaleTransform.getScaleX(), "X scale should be 1").to.equal(1);
        expect(car.scaleTransform.getScaleY(), "Y scale should be 1").to.equal(1);
    });

    it("Test car rotation", function () {
        var sceneGraphModule = createSceneGraphModule();
        var car = new sceneGraphModule.CarNode();
        var point = {};

        // top rotation
        point.x = 100;
        point.y = 0;
        state = CAR_ROTATE_FRONT;
        car.rotate(point);
        expect(car.rotateTransform.equals(AffineTransform.getRotateInstance(-3*Math.PI/2,0,0)), "Should be rotated -3PI/2 radians").to.be.true;
        point.x = -100;
        car.rotate(point);
        expect(car.rotateTransform.equals(AffineTransform.getRotateInstance(-Math.PI/2,0,0)), "Should be rotated -PI/2 radians").to.be.true;
        point.x = 0;
        point.y = 100;
        car.rotate(point);
        expect(car.rotateTransform.equals(AffineTransform.getRotateInstance(-Math.PI,0,0)), "Should be rotated -PI radians").to.be.true;
        point.y = -100;
        car.rotate(point);
        expect(car.rotateTransform.equals(AffineTransform.getRotateInstance(-2*Math.PI,0,0)), "Should be rotated 0 radians").to.be.true;
        state = CAR_ROTATE_BACK;
        point.x = 100;
        point.y = 0;
        car.rotate(point);
        expect(car.rotateTransform.equals(AffineTransform.getRotateInstance(-Math.PI/2,0,0)), "Should be rotated PI/2 radians").to.be.true;
        point.x = -100;
        car.rotate(point);
        expect(car.rotateTransform.equals(AffineTransform.getRotateInstance(Math.PI/2,0,0)), "Should be rotated 0PI/2 radians").to.be.true;
        point.x = 0;
        point.y = 100;
        car.rotate(point);
        expect(car.rotateTransform.equals(AffineTransform.getRotateInstance(0,0,0)), "Should be rotated 0 radians").to.be.true;
        point.y = -100;
        car.rotate(point);
        expect(car.rotateTransform.equals(AffineTransform.getRotateInstance(-Math.PI,0,0)), "Should be rotated -PI radians").to.be.true;
    });
});
