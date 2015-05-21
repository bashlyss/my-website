'use strict';

/**
 * A function that creates and returns the scene graph classes and constants.
 */
function createSceneGraphModule() {

    // Part names. Use these to name your different nodes
    var CAR_PART = 'CAR_PART';
    var FRONT_AXLE_PART = 'FRONT_AXLE_PART';
    var BACK_AXLE_PART = 'BACK_AXLE_PART';
    var FRONT_LEFT_TIRE_PART = 'FRONT_LEFT_TIRE_PART';
    var FRONT_RIGHT_TIRE_PART = 'FRONT_RIGHT_TIRE_PART';
    var BACK_LEFT_TIRE_PART = 'BACK_LEFT_TIRE_PART';
    var BACK_RIGHT_TIRE_PART = 'BACK_RIGHT_TIRE_PART';

    var GraphNode = function() {
    };

    _.extend(GraphNode.prototype, {

        /**
         * Subclasses should call this function to initialize the object.
         *
         * @param startPositionTransform The transform that should be applied prior
         * to performing any rendering, so that the component can render in its own,
         * local, object-centric coordinate system.
         * @param nodeName The name of the node. Useful for debugging, but also used to uniquely identify each node
         */
        initGraphNode: function(startPositionTransform, nodeName) {

            this.nodeName = nodeName;

            // The transform that will position this object, relative
            // to its parent
            this.startPositionTransform = startPositionTransform;

            // Any additional transforms of this object after the previous transform
            // has been applied
            this.objectTransform = new AffineTransform();

            // Any child nodes of this node
            this.children = {};

            // Add any other properties you need, here
        },

        addChild: function(graphNode) {
            this.children[graphNode.nodeName] = graphNode;
        },

        /**
         * Swaps a graph node with a new graph node.
         * @param nodeName The name of the graph node
         * @param newNode The new graph node
         */
        replaceGraphNode: function(nodeName, newNode) {
            if (nodeName in this.children) {
                this.children[nodeName] = newNode;
            } else {
                _.each(
                    _.values(this.children),
                    function(child) {
                        child.replaceGraphNode(nodeName, newNode);
                    }
                );
            }
        },

        /**
         * Render this node using the graphics context provided.
         * Prior to doing any painting, the start_position_transform must be
         * applied, so the component can render itself in its local, object-centric
         * coordinate system. See the assignment specs for more details.
         *
         * This method should also call each child's render method.
         * @param context
         */
        render: function(context) {
            // TODO: Should be overridden by subclass
        },

        /**
         * Determines whether a point lies within this object. Be sure the point is
         * transformed correctly prior to performing the hit test.
         */
        pointInObject: function(point) {
            // TODO: There are ways to handle this query here, but you may find it easier to handle in subclasses
        },

        transformPoint: function (point, recursive) {
            var inverse = this.startPositionTransform.clone();
            if (this.nodeName === CAR_PART) {
                this.objectTransform = new AffineTransform();
                this.objectTransform.concatenate(this.translateTransform);
                this.objectTransform.concatenate(this.rotateTransform);
                if (!recursive) {
                    this.objectTransform.concatenate(this.scaleTransform);
                }
            }
            inverse.concatenate(this.objectTransform);
            inverse = inverse.createInverse();
            var newPoint = [];
            newPoint.push(point.x);
            newPoint.push(point.y);
            inverse.transform(newPoint, 0, newPoint, 0, 1);
            var finalPoint = {};
            finalPoint.x = newPoint[0];
            finalPoint.y = newPoint[1];
            return finalPoint;
        }

    });

    var CarNode = function() {
        this.initGraphNode(new AffineTransform(), CAR_PART);
        this.rotateTransform = new AffineTransform();
        this.scaleTransform = new AffineTransform();
        this.translateTransform = new AffineTransform();

        this.translateTransform.translate(400, 300);
        this.rotateTransform.rotate(Math.atan2(0,0), 0, 0);

    };

    _.extend(CarNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            context.clearRect(0, 0, 800, 600);
            context.save();
            context.transform(this.startPositionTransform.getScaleX(),
                this.startPositionTransform.getShearY(),
                this.startPositionTransform.getShearX(),
                this.startPositionTransform.getScaleY(),
                this.startPositionTransform.getTranslateX(),
                this.startPositionTransform.getTranslateY());
            this.objectTransform = new AffineTransform();
            this.objectTransform.concatenate(this.translateTransform);
            this.objectTransform.concatenate(this.rotateTransform);
            context.transform(this.objectTransform.getScaleX(),
                this.objectTransform.getShearY(),
                this.objectTransform.getShearX(),
                this.objectTransform.getScaleY(),
                this.objectTransform.getTranslateX(),
                this.objectTransform.getTranslateY());
            _.each(
                _.values(this.children),
                function(child) {
                    child.render(context);
                }
            );
            var scaleX = this.scaleTransform.getScaleX();
            var scaleY = this.scaleTransform.getScaleY();
            context.transform(scaleX,0,0,scaleY,0,0);
            // body
            context.fillStyle = "red";
            context.fillRect(-25,-50,50,100);
            // bumpers
            context.strokeStyle = "grey";
            context.rect(-25,-50,50,100);
            context.rect(-24,-49,48,98);
            context.rect(-23,-48,46,96);
            context.rect(-22,-47,44,94);
            context.stroke();
            // headlights
            context.strokeStyle = "black";
            context.transform(1/scaleX,0,0,1/scaleY,0,0);
            context.beginPath();
            context.arc((-23*scaleX)+13,(-50*scaleY)+15,5,0,2*Math.PI);
            context.fillStyle = "black";
            context.fill();
            context.stroke();
            context.beginPath();
            context.arc((23*scaleX)-13,(-50*scaleY)+15,5,0,2*Math.PI);
            context.fill();
            context.stroke();
            // headlights
            context.strokeStyle = "yellow";
            context.beginPath();
            context.arc((-23*scaleX)+13,(50*scaleY)-15,5,0,2*Math.PI);
            context.fillStyle = "yellow";
            context.fill();
            context.stroke();
            context.beginPath();
            context.arc((23*scaleX)-13,(50*scaleY)-15,5,0,2*Math.PI);
            context.fill();
            context.stroke();
            //windshield
            context.strokeStyle = "white";
            context.fillStyle = "white";
            context.fillRect((-23*scaleX)+8,(-50*scaleY)+25,(46*scaleX)-16,15);
            context.fillRect((-23*scaleX)+8,(50*scaleY)-40,(46*scaleX)-16,15);

            context.restore();
        },

        // Overrides parent method
        pointInObject: function(point) {
            if (Math.abs(point.x) <= 25 && Math.abs(point.y) <= 50) {
                if (clickEvent) {
                    if (point.x < -20) {
                        state = CAR_SCALE_LEFT;
                    } else if (point.x > 20) {
                        state = CAR_SCALE_RIGHT;
                    } else if (point.y > 45) {
                        state = CAR_SCALE_BOTTOM;
                    } else if (point.y < -45) {
                        state = CAR_SCALE_TOP;
                    } else if (point.y < -25) {
                        state = CAR_ROTATE_FRONT;
                    } else if (point.y > 25) {
                        state = CAR_ROTATE_BACK;
                    } else {
                        state = CAR_MOVE;
                    }
                }
                return true;
            } else {
                return false;
            }
        },

        move: function (point) {
            if (state === CAR_MOVE) {
                this.translateTransform.setToTranslation(point.x, point.y);
            }
        },

        rotate: function(point) {
            if (state === CAR_ROTATE_FRONT) {
                this.rotateTransform.setToRotation(-(Math.atan2(
                        point.x - this.objectTransform.getTranslateX(),
                        point.y - this.objectTransform.getTranslateY())+Math.PI),0,0);
            } else if (state === CAR_ROTATE_BACK) {
                this.rotateTransform.setToRotation(-(Math.atan2(
                    point.x - this.objectTransform.getTranslateX(),
                    point.y - this.objectTransform.getTranslateY())),0,0);
            }

        },

        scale: function(point) {
            var inverse = this.startPositionTransform.clone();
            this.objectTransform = new AffineTransform();
            this.objectTransform.concatenate(this.translateTransform);
            this.objectTransform.concatenate(this.rotateTransform);
            inverse.concatenate(this.objectTransform);
            inverse = inverse.createInverse();
            var newPoint = [];
            newPoint.push(point.x);
            newPoint.push(point.y);
            inverse.transform(newPoint, 0, newPoint, 0, 1);
            point.x = newPoint[0];
            point.y = newPoint[1];
            if (state === CAR_SCALE_BOTTOM) {
                this.scaleTransform.setToScale(this.scaleTransform.getScaleX(), Math.max(Math.min(point.y/50.0, 2), 0.5));
            } else if (state === CAR_SCALE_TOP) {
                this.scaleTransform.setToScale(this.scaleTransform.getScaleX(), Math.max(Math.min(-point.y/50.0, 2), 0.5));

            } else if (state === CAR_SCALE_LEFT) {
                var temp = this.scaleTransform.getScaleX();
                this.scaleTransform.setToScale(
                    Math.max(Math.min(-point.x/25.0, 3), 0.5), this.scaleTransform.getScaleY());
            } else if (state === CAR_SCALE_RIGHT) {
                var temp = this.scaleTransform.getScaleX();
                this.scaleTransform.setToScale(Math.max(Math.min(point.x/25.0, 3), 0.5), this.scaleTransform.getScaleY());
            }
            if (state === CAR_SCALE_TOP || state === CAR_SCALE_BOTTOM) {
                var axleDist = this.scaleTransform.getScaleY()*50-30;
                _.each(
                    _.values(this.children),
                    function(child) {
                        if (child.nodeName === BACK_AXLE_PART) {
                            child.axleDist = axleDist;
                            child.startPositionTransform.setToTranslation(0, axleDist);
                        } else if (child.nodeName === FRONT_AXLE_PART) {
                            child.axleDist = axleDist;
                            child.startPositionTransform.setToTranslation(0, -axleDist);
                        }
                    }
                );
            } else if (state === CAR_SCALE_RIGHT || state === CAR_SCALE_LEFT) {
                axleWidth = axleWidth + (this.scaleTransform.getScaleX()*50 - temp*50);
                _.each(
                    _.values(this.children),
                    function(child) {
                        _.each(
                            _.values(child.children),
                            function(grandchild) {
                                if (grandchild.nodeName === BACK_LEFT_TIRE_PART || grandchild.nodeName === FRONT_LEFT_TIRE_PART) {
                                    grandchild.offset = axleWidth/2;
                                    grandchild.startPositionTransform.setToRotation(Math.PI, 0, 0);
                                    grandchild.startPositionTransform.translate(grandchild.offset, 0);
                                } else if (grandchild.nodeName === BACK_RIGHT_TIRE_PART || grandchild.nodeName === FRONT_RIGHT_TIRE_PART) {
                                    grandchild.offset = axleWidth/2;
                                    grandchild.startPositionTransform.setToTranslation(grandchild.offset, 0);
                                }
                            }
                        )
                    }
                );
            }
        }
    });

    // Global variable denoting the width of the axles
    var axleWidth = 50;

    /**
     * @param axlePartName Which axle this node represents
     * @constructor
     */
    var AxleNode = function(axlePartName) {
        this.initGraphNode(new AffineTransform(), axlePartName);
        this.axleDist = 20;
        if (axlePartName === FRONT_AXLE_PART) {
            this.startPositionTransform.translate(0, -this.axleDist);
        } else if (axlePartName === BACK_AXLE_PART) {
            this.startPositionTransform.translate(0, this.axleDist);
        }
        this.translateTransform = new AffineTransform();
    };

    _.extend(AxleNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            context.save();
            context.transform(this.startPositionTransform.getScaleX(),
                this.startPositionTransform.getShearY(),
                this.startPositionTransform.getShearX(),
                this.startPositionTransform.getScaleY(),
                this.startPositionTransform.getTranslateX(),
                this.startPositionTransform.getTranslateY());
            context.transform(this.objectTransform.getScaleX(),
                this.objectTransform.getShearY(),
                this.objectTransform.getShearX(),
                this.objectTransform.getScaleY(),
                this.objectTransform.getTranslateX(),
                this.objectTransform.getTranslateY());
            _.each(
                _.values(this.children),
                function(child) {
                    child.render(context);
                }
            );
            // body
            context.fillStyle = "#000000";
            context.fillRect(-axleWidth/2,-2,axleWidth,4);
            context.restore();
        },

        // Overrides parent method
        pointInObject: function(point) {
            // User can't select axles
            return false;
        },

        scale: function(point, car) {
            var inverse = this.startPositionTransform.clone();
            inverse.concatenate(this.objectTransform);
            inverse = inverse.createInverse();
            var newPoint = [];
            newPoint.push(point.x);
            newPoint.push(point.y);
            inverse.transform(newPoint, 0, newPoint, 0, 1);
            point.x = newPoint[0];
            point.y = newPoint[1];
            var temp = this.translateTransform.getTranslateX();
            var carWidth = axleWidth/2 - this.translateTransform.getTranslateX();
            if (state === AXLE_SCALE_LEFT) {
                this.translateTransform.setToTranslation(
                    Math.max(Math.min(-point.x-carWidth, 75), 0), 0);
                axleWidth = axleWidth + (this.translateTransform.getTranslateX() - temp);
            } else if (state === AXLE_SCALE_RIGHT) {
                this.translateTransform.setToTranslation(
                    Math.max(Math.min(point.x-carWidth, 75), 0), 0);
                axleWidth = axleWidth + (this.translateTransform.getTranslateX() - temp);
            }
            if (state === AXLE_SCALE_RIGHT || state === AXLE_SCALE_LEFT) {
                _.each(
                    _.values(car.children),
                    function (child) {
                        _.each(
                            child.children,
                            function (grandchild) {
                                if (grandchild.nodeName === BACK_LEFT_TIRE_PART || grandchild.nodeName === FRONT_LEFT_TIRE_PART) {
                                    grandchild.offset = axleWidth / 2;
                                    grandchild.startPositionTransform.setToRotation(Math.PI, 0, 0);
                                    grandchild.startPositionTransform.translate(grandchild.offset, 0);
                                } else if (grandchild.nodeName === BACK_RIGHT_TIRE_PART || grandchild.nodeName === FRONT_RIGHT_TIRE_PART) {
                                    grandchild.offset = axleWidth / 2;
                                    grandchild.startPositionTransform.setToTranslation(grandchild.offset, 0);
                                }
                            }
                        )
                    }
                );
            }
        },

        rotate: function(point) {
            var inverse = this.startPositionTransform.clone();
            inverse.concatenate(this.objectTransform);
            inverse = inverse.createInverse();
            var newPoint = [];
            newPoint.push(point.x);
            newPoint.push(point.y);
            inverse.transform(newPoint, 0, newPoint, 0, 1);
            point.x = newPoint[0];
            point.y = newPoint[1];
            if (this.nodeName === FRONT_AXLE_PART) {
                var angle;
                _.each(
                    this.children,
                    function (child) {
                        var inverse = child.startPositionTransform.clone();
                        inverse = inverse.createInverse();
                        var newPoint = [];
                        newPoint.push(point.x);
                        newPoint.push(point.y);
                        inverse.transform(newPoint, 0, newPoint, 0, 1);
                        var finalPoint = {};
                        finalPoint.x = newPoint[0];
                        finalPoint.y = newPoint[1];
                        if (child.nodeName === rotatingTire) {
                            if (state === TIRE_ROTATE_FRONT) {
                                var angle1 = (-(Math.atan2(finalPoint.x, finalPoint.y))+Math.PI) % (2*Math.PI);
                                var angle2 = (-(Math.atan2(finalPoint.x, finalPoint.y))-Math.PI) % (2*Math.PI);
                                angle = Math.abs(angle1) < Math.abs(angle2) ? angle1 : angle2;
                            } else if (state === TIRE_ROTATE_BACK) {
                                angle = -(Math.atan2(finalPoint.x, finalPoint.y));
                            }
                        }
                    }
                );
                _.each(
                    this.children,
                    function (child) {
                        if (state === TIRE_ROTATE_FRONT || state === TIRE_ROTATE_BACK) {
                            child.objectTransform.setToRotation(Math.min(Math.max(angle, -Math.PI / 4), Math.PI / 4), 0, 0);
                        }
                    }
                );
            }
        }
    });

    /**
     * @param tirePartName Which tire this node represents
     * @constructor
     */
    var TireNode = function(tirePartName) {
        this.offset = axleWidth/2;
        this.initGraphNode(new AffineTransform(), tirePartName);
        if (tirePartName === BACK_LEFT_TIRE_PART || tirePartName === FRONT_LEFT_TIRE_PART) {
            this.startPositionTransform.rotate(Math.PI, 0, 0);
            this.startPositionTransform.translate(this.offset, 0);
        } else if (tirePartName === BACK_RIGHT_TIRE_PART || tirePartName === FRONT_RIGHT_TIRE_PART) {
            this.startPositionTransform.translate(this.offset, 0);
        }
    };

    _.extend(TireNode.prototype, GraphNode.prototype, {
        // Overrides parent method
        render: function(context) {
            context.save();
            context.transform(this.startPositionTransform.getScaleX(),
                this.startPositionTransform.getShearY(),
                this.startPositionTransform.getShearX(),
                this.startPositionTransform.getScaleY(),
                this.startPositionTransform.getTranslateX(),
                this.startPositionTransform.getTranslateY());
            context.transform(this.objectTransform.getScaleX(),
                this.objectTransform.getShearY(),
                this.objectTransform.getShearX(),
                this.objectTransform.getScaleY(),
                this.objectTransform.getTranslateX(),
                this.objectTransform.getTranslateY());
            _.each(
                _.values(this.children),
                function(child) {
                    child.render(context);
                }
            );
            // body
            context.fillStyle = "black";
            context.fillRect(-5,-12,10,24);
            context.restore();
        },

        // Overrides parent method
        pointInObject: function(point) {
            if (Math.abs(point.x) <= 5 && Math.abs(point.y) <= 12) {
                if (clickEvent) {
                    if (this.nodeName === FRONT_RIGHT_TIRE_PART || this.nodeName === BACK_RIGHT_TIRE_PART) {
                        state = AXLE_SCALE_RIGHT;
                    } else if (this.nodeName === FRONT_LEFT_TIRE_PART || this.nodeName === BACK_LEFT_TIRE_PART) {
                        state = AXLE_SCALE_LEFT;
                    }
                    if (this.nodeName === FRONT_LEFT_TIRE_PART || this.nodeName === FRONT_RIGHT_TIRE_PART) {
                        if (point.y < -6) {
                            state = TIRE_ROTATE_FRONT;
                            rotatingTire = this.nodeName;
                        } else if (point.y > 6) {
                            state = TIRE_ROTATE_BACK;
                            rotatingTire = this.nodeName;
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        }
    });

    // Return an object containing all of our classes and constants
    return {
        GraphNode: GraphNode,
        CarNode: CarNode,
        AxleNode: AxleNode,
        TireNode: TireNode,
        CAR_PART: CAR_PART,
        FRONT_AXLE_PART: FRONT_AXLE_PART,
        BACK_AXLE_PART: BACK_AXLE_PART,
        FRONT_LEFT_TIRE_PART: FRONT_LEFT_TIRE_PART,
        FRONT_RIGHT_TIRE_PART: FRONT_RIGHT_TIRE_PART,
        BACK_LEFT_TIRE_PART: BACK_LEFT_TIRE_PART,
        BACK_RIGHT_TIRE_PART: BACK_RIGHT_TIRE_PART
    };
}