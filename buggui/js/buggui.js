'use strict';

// This should be your main point of entry for your app

var CAR_SCALE_TOP = 'CAR_SCALE_TOP';
var CAR_SCALE_BOTTOM = 'CAR_SCALE_BOTTOM';
var CAR_SCALE_LEFT = 'CAR_SCALE_LEFT';
var CAR_SCALE_RIGHT = 'CAR_SCALE_RIGHT';
var CAR_ROTATE_FRONT = 'CAR_ROTATE_FRONT';
var CAR_ROTATE_BACK = 'CAR_ROTATE_BACK';
var CAR_MOVE = 'CAR_MOVE';
var AXLE_SCALE_LEFT = 'AXLE_SCALE_LEFT';
var AXLE_SCALE_RIGHT = 'AXLE_SCALE_RIGHT';
var TIRE_ROTATE_FRONT = 'TIRE_ROTATE_FRONT';
var TIRE_ROTATE_BACK = 'TIRE_ROTATE_BACK';

var clickEvent = false;
var state = '';
var rotatingTire = '';

window.addEventListener('load', function() {
    var sceneGraphModule = createSceneGraphModule();
    var appContainer = document.getElementById('app-container');
    var canvas = document.createElement('canvas');
    canvas.id = 'car-canvas';
    canvas.width = 800;
    canvas.height = 600;
    appContainer.appendChild(canvas);
    var context = canvas.getContext("2d");

    var car = new sceneGraphModule.CarNode();
    var frontAxle = new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_AXLE_PART);
    car.addChild(frontAxle);
    var backAxle = new sceneGraphModule.AxleNode(sceneGraphModule.BACK_AXLE_PART);
    car.addChild(backAxle);
    var frontLeftTire = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_LEFT_TIRE_PART);
    frontAxle.addChild(frontLeftTire);
    var frontRightTire = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_RIGHT_TIRE_PART);
    frontAxle.addChild(frontRightTire);
    var backLeftTire = new sceneGraphModule.TireNode(sceneGraphModule.BACK_LEFT_TIRE_PART);
    backAxle.addChild(backLeftTire);
    var backRightTire = new sceneGraphModule.TireNode(sceneGraphModule.BACK_RIGHT_TIRE_PART);
    backAxle.addChild(backRightTire);
    car.render(context);

    canvas.addEventListener("mousedown", function (evt) {
        var point = {};
        point.x = evt.offsetX;
        point.y = evt.offsetY;
        clickEvent = true;

        var carPoint = car.transformPoint(point, false);
        car.pointInObject(carPoint);
        var carPointNoScale = car.transformPoint(point, true);
        var frontAxlePoint = frontAxle.transformPoint(carPointNoScale);
        var backAxlePoint = backAxle.transformPoint(carPointNoScale);
        frontLeftTire.pointInObject(frontLeftTire.transformPoint(frontAxlePoint));
        frontRightTire.pointInObject(frontRightTire.transformPoint(frontAxlePoint));
        backLeftTire.pointInObject(backLeftTire.transformPoint(backAxlePoint));
        backRightTire.pointInObject(backRightTire.transformPoint(backAxlePoint));

        clickEvent = false;
    });

    canvas.addEventListener("mousemove", function (evt) {
        var point = {};
        point.x = evt.offsetX;
        point.y = evt.offsetY;

        if (state === CAR_MOVE) {
            car.move(point);
        } else if (state === CAR_ROTATE_FRONT || state === CAR_ROTATE_BACK) {
            car.rotate(point);
        } else if (state === CAR_SCALE_LEFT || state === CAR_SCALE_RIGHT || state === CAR_SCALE_TOP || state === CAR_SCALE_BOTTOM) {
            car.scale(point);
        } else if (state === AXLE_SCALE_LEFT || state === AXLE_SCALE_RIGHT) {
            var pointCar = car.transformPoint(point, true);
            frontAxle.scale(pointCar, car);
        } else if (state === TIRE_ROTATE_FRONT || state === TIRE_ROTATE_BACK) {
            var pointCar = car.transformPoint(point, true);
            frontAxle.rotate(pointCar);
        }
        if (state != '') {
            car.render(context);
        }
    });

    canvas.addEventListener("mouseup", function (evt) {
       state = '';
    });
});