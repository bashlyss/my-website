'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
  */
function createViewModule() {

    var LIST_VIEW = 'LIST_VIEW';
    var GRID_VIEW = 'GRID_VIEW';
    var RATING_CHANGE = 'RATING_CHANGE';

    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function(imageModel) {
        this.currentView = LIST_VIEW;
        this.container = document.createElement('div');
        this.container.style.height = '0%';
        var template = document.getElementById('image-renderer');
        this.container.appendChild(document.importNode(template.content, true));
        this.container.classList.add('float-none','image-container');

        this.imageModel = imageModel;
        var self = this;

        var img = this.container.querySelector('.image');
        img.addEventListener('click', function () {
            self.drawFullImg();
        });

        var imgRating = this.container.querySelector('.image-rating');
        this.ratingSelect = new RatingSelect(imageModel.getRating());
        this.ratingSelect.addListener(function (ratingElement, eventDate) {
            self.getImageModel().setRating(ratingElement.getRating());
        });
        imgRating.appendChild(this.ratingSelect.getElement());

        this.updateElement();
        imageModel.addListener(function (imageModel, eventTime) {
            self.updateElement();
        })
    };

    _.extend(ImageRenderer.prototype, {

        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement: function() {
            return this.container;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            return this.imageModel;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            this.imageModel = imageModel;
            this.updateElement();
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            if (viewType != LIST_VIEW && viewType != GRID_VIEW) {
                throw new Error("Invalid arguments to ImageCollectionView.setToView: " + JSON.stringify(arguments));
            }
            this.currentView = viewType;
            this.updateElement();
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
            return this.currentView;
        },

        /**
         * Updates the container variable to contain the appropriate values
         */
        updateElement: function () {
            var img = this.container.querySelector('.image');
            img.src = this.getImageModel().getPath();
            var imgName = this.container.querySelector('.image-name');
            var splitPath = this.getImageModel().getPath().split('/');
            imgName.innerText = splitPath[splitPath.length-1];
            var imgUpdated = this.container.querySelector('.image-updated-date');
            imgUpdated.innerText = this.getImageModel().getModificationDate().toDateString();
            var imgCaption = this.container.querySelector('.image-caption');
            imgCaption.innerText = this.getImageModel().getCaption();

            var imgDiv = this.container.querySelector('.image-div');
            var imgMetadata = this.container.querySelector('.image-metadata');
            if (this.getCurrentView() === GRID_VIEW) {
                imgUpdated.classList.add('float-left');
                imgDiv.classList.remove('list-view');
                imgDiv.classList.add('grid-view');
                imgMetadata.classList.remove('list-view');
                imgMetadata.classList.add('grid-view');
                this.container.classList.remove('float-none');
                this.container.classList.add('float-left');
            } else if (this.getCurrentView() === LIST_VIEW) {
                imgUpdated.classList.remove('float-left');
                imgDiv.classList.add('list-view');
                imgDiv.classList.remove('grid-view');
                imgMetadata.classList.remove('grid-view');
                imgMetadata.classList.add('list-view');
                this.container.classList.add('float-none');
                this.container.classList.remove('float-left');
            }
        },

        drawFullImg : function () {
            var popup = document.createElement('div');
            var template = document.getElementById('image-popup');
            popup.appendChild(document.importNode(template.content, true));
            popup.classList.add('image-popup');
            var image = popup.querySelector('.full-image');
            image.src = this.getImageModel().getPath();
            var appDiv = document.getElementById('app-container');
            appDiv.appendChild(popup);
            var fileChooser = document.querySelector('.file-chooser');
            fileChooser.style.display = 'none';
            var imageContainer = document.querySelector('.image-container');
            imageContainer.style.display = 'none';
        }
    });

    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function() {
    };

    _.extend(ImageRendererFactory.prototype, {

        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
        createImageRenderer: function(imageModel) {
            return new ImageRenderer(imageModel);
        }
    });

    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function() {
        this.imageRendererFactory = new ImageRendererFactory();
        this.imageRenderers = [];
        this.container = document.createElement('div');
        this.container.classList.add('image-container');
        this.imageCollectionModel = null;
        this.currentView = LIST_VIEW;
        var self = this;
        this.modelListener = function(eventType, imageModelCollection, imageModel, eventDate) {
            if (eventType === 'IMAGE_ADDED_TO_COLLECTION_EVENT') {
                var imageRenderer = self.imageRendererFactory.createImageRenderer(imageModel);
                imageRenderer.setToView(self.getCurrentView());
                self.imageRenderers.push(imageRenderer);
                self.container.appendChild(imageRenderer.getElement());
            } else if (eventType === 'IMAGE_REMOVED_FROM_COLLECTION_EVENT') {
                _.each(
                    self.imageRenderers,
                    function (imgRenderer) {
                        if (imgRenderer.getImageModel() === imageModel) {
                            self.imageRenderers = _.without(this.imageRenderers, imgRenderer);
                            self.container.removeChild(imgRenderer.getElement());
                        }
                    }
                )
            } else if (eventType == 'IMAGE_META_DATA_CHANGED_EVENT') {
                _.each(
                    self.imageRenderers,
                    function (imgRenderer) {
                        if (imgRenderer.getImageModel() === imageModel) {
                            imgRenderer.setImageModel(imageModel);
                        }
                    }
                )
            }
        };
    };

    _.extend(ImageCollectionView.prototype, {
        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */
        getElement: function() {
            return this.container;
        },

        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function() {
            return this.imageRendererFactory;
        },

        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function(imageRendererFactory) {
            this.imageRenderers = [];
            var self = this;
            _.each(
                self.imageCollectionModel.getImageModels(),
                function (imageModel) {
                    var imageRenderer = self.imageRendererFactory.createImageRenderer(imageModel);
                    self.imageRenderers.push(imageRenderer);
                    self.container.appendChild(imageRenderer.getElement());
                }
            )
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function() {
            return this.imageCollectionModel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function(imageCollectionModel) {
            if (this.imageCollectionModel) {
                this.imageCollectionModel.removeListener(this.modelListener);
            }
            this.imageCollectionModel = imageCollectionModel;
            this.imageCollectionModel.addListener(this.modelListener);

            this.setImageRendererFactory(this.getImageRendererFactory());
        },

        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function(viewType) {
            if (viewType != LIST_VIEW && viewType != GRID_VIEW) {
                throw new Error("Invalid arguments to ImageCollectionView.setToView: " + JSON.stringify(arguments));
            }
            this.currentView = viewType;

            _.each(
                this.imageRenderers,
                function (imageRenderer) {
                    imageRenderer.setToView(viewType);
                }
            );

            var self = this;
            _.each(
                this.listeners,
                function (listener_fn) {
                    listener_fn(self, viewType, new Date());
                }
            );
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function() {
            return this.currentView;
        },

        filter: function (ratingFilter) {
            _.each(
                this.imageRenderers,
                function (imageRenderer) {
                    if (imageRenderer.getImageModel().getRating() < ratingFilter) {
                        imageRenderer.getElement().style.display = 'none';
                    } else {
                        imageRenderer.getElement().style.display = 'block';
                    }
                }
            )
        }
    });

    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
    var Toolbar = function() {
        this.selectedView = LIST_VIEW;
        this.minRating = 0;
        this.listeners = [];

        var template = document.getElementById('toolbar');
        this.container = document.createElement('div');
        this.container.appendChild(document.importNode(template.content, true));
        this.container.classList.add('toolbar');
        var self = this;

        var ratingContainer = this.container.querySelector('.rating-select-container');
        var ratingSelector = new RatingSelect();
        ratingContainer.appendChild(ratingSelector.getElement());
        ratingSelector.addListener( function (ratingSelect, date) {
            self.setRatingFilter(ratingSelect.getRating());
        });

        var viewContainer = this.container.querySelector('.view-select-container');
        var gridViewSelector = new ViewSelect('images/grid-view-button.gif', GRID_VIEW, true);
        var listViewSelector = new ViewSelect('images/list-view-button.gif', LIST_VIEW, false);
        viewContainer.appendChild(gridViewSelector.getElement());
        viewContainer.appendChild(listViewSelector.getElement());
        gridViewSelector.addListener( function (viewSelect, date) {
            self.setToView(viewSelect.getSelectedView());
        });
        gridViewSelector.addListener( function (viewSelect, date) {
            listViewSelector.deselect();
        });
        listViewSelector.addListener( function (viewSelect, date) {
            self.setToView(viewSelect.getSelectedView());
        });
        listViewSelector.addListener( function (viewSelect, date) {
            gridViewSelector.deselect();
        });
    };

    _.extend(Toolbar.prototype, {
        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
        getElement: function() {
            return this.container;
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to Toolbar.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to Toolbar.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function(viewType) {
            if (viewType != LIST_VIEW && viewType != GRID_VIEW) {
                throw new Error("Invalid arguments to Toolbar.setToView: " + JSON.stringify(arguments));
            }
            this.selectedView = viewType;

            var self = this;
            var eventTime = new Date();
            _.each(
                this.listeners,
                function (listener_fn) {
                    listener_fn(self, viewType, eventTime);
                }
            );
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function() {
            return this.selectedView;
        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function() {
            return this.minRating;
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function(rating) {
            var intRating = parseInt(rating) || 0;
            if (intRating < 0 || intRating > 5) {
                throw new Error("Invalid arguments to Toolbar.setRatingFilter: " + JSON.stringify(arguments));
            }
            this.minRating = intRating;

            var self = this;
            _.each(
                this.listeners,
                function (listener_fn) {
                    listener_fn(self, RATING_CHANGE, new Date());
                }
            );
        }
    });

    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function() {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function() {
            var self = this;
            this.fileChooserDiv = document.createElement('div');
            this.fileChooserDiv.classList.add('float-none','file-chooser');
            var fileChooserTemplate = document.getElementById('file-chooser');
            this.fileChooserDiv.appendChild(document.importNode(fileChooserTemplate.content, true));
            var fileChooserInput = this.fileChooserDiv.querySelector('.files-input');
            fileChooserInput.addEventListener('change', function(evt) {
                var files = evt.target.files;
                var eventDate = new Date();
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, files, eventDate);
                    }
                );
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function() {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        }
    });

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE
    };
}

var RatingSelect = function (currentValue) {
    var self = this;

    var template = document.getElementById('star-rating');
    var container = document.createElement('div');
    container.appendChild(document.importNode(template.content, true));

    var starContainer = container.querySelector('.star-container');
    var starTemplate = document.getElementById('single-star');
    for (var i = 0; i < 5; i++) {
        starContainer.appendChild(document.importNode(starTemplate.content, true));
    }

    var rating = 0;
    var mouseDown = false;

    // Add listeners
    starContainer.addEventListener('mousedown', function(evt) {
        mouseDown = true;
        var starContainerPos = getPos(starContainer);
        var mouseX = evt.pageX - starContainerPos.x;

        self._updateRating(mouseX/starContainer.querySelector('.star').offsetWidth + 1);
    });
    starContainer.addEventListener('mouseup', function() {
        mouseDown = false;
    });
    starContainer.addEventListener('mousemove', function(evt) {
        if (mouseDown) {
            var starContainerPos = getPos(starContainer);
            var mouseX = evt.pageX - starContainerPos.x;

            self._updateRating(mouseX/starContainer.querySelector('.star').offsetWidth + 1);
        }
    });

    this._updateRating = function(newValue) {
        rating = Math.min(5, Math.max(0, parseInt(newValue)));
        for (var i = 0; i < 5; i++)
        {
            var star = starContainer.getElementsByClassName('star')[i];
            if (rating > i) {
                star.classList.remove('starWhite');
                star.classList.add('starYellow');
            }
            else {
                star.classList.remove('starYellow');
                star.classList.add('starWhite');
            }
        }

        var eventDate = new Date();
        _.each(
            listeners,
            function(listener_fn) {
                listener_fn(self, eventDate);
            }
        );
    };

    this._updateRating(currentValue);

    this.getRating = function () {
        return rating;
    };

    var listeners = [];

    this.addListener = function (listener_fn) {
        if (!_.isFunction(listener_fn)) {
            throw new Error("Invalid arguments to RatingSelect.addListener: " + JSON.stringify(arguments));
        }

        listeners.push(listener_fn);
    };

    this.removeListener = function(listener_fn) {
        if (!_.isFunction(listener_fn)) {
            throw new Error("Invalid arguments to RatingSelect.removeListener: " + JSON.stringify(arguments));
        }
        listeners = _.without(listeners, listener_fn);
    };

    this.getElement = function() {
        return container;
    };
};

var ViewSelect = function(image, viewType, defaultSelected) {
    var self = this;
    var view = viewType;

    var template = document.getElementById('view-select-button');
    var container = document.createElement('div');
    container.appendChild(document.importNode(template.content, true));
    container.classList.add('float-left');
    var gridButton = container.querySelector('.img-button');
    var img = document.createElement('img');
    img.src = image;
    if (!defaultSelected) {
        img.classList.add('deselected-img');
    }
    gridButton.appendChild(img);

    this.getSelectedView = function () {
        return view;
    };

    var selected = false;

    // Add listeners
    container.addEventListener('mousedown', function(evt) {
        selected = true;
        img.classList.remove('deselected-img');

        var eventDate = new Date();
        _.each(
            listeners,
            function(listener_fn) {
                listener_fn(self, eventDate);
            }
        );
    });

    this.deselect = function () {
        selected = false;
        img.classList.add('deselected-img');
    }

    var listeners = [];

    this.addListener = function (listener_fn) {
        if (!_.isFunction(listener_fn)) {
            throw new Error("Invalid arguments to RatingSelect.addListener: " + JSON.stringify(arguments));
        }

        listeners.push(listener_fn);
    };

    this.removeListener = function(listener_fn) {
        if (!_.isFunction(listener_fn)) {
            throw new Error("Invalid arguments to RatingSelect.removeListener: " + JSON.stringify(arguments));
        }
        listeners = _.without(listeners, listener_fn);
    };

    this.getElement = function() {
        return container;
    };
};

// Inspired from: http://stackoverflow.com/questions/160144/find-x-y-of-an-html-element-with-javascript
// This simply gets the position of an element in the page
function getPos(el, position) {
    if (!position) {
        position = {
            x: 0,
            y: 0
        };
    }
    position.x += el.offsetLeft;
    position.y += el.offsetTop;
    if (el.offsetParent) {
        return getPos(el.offsetParent, position);
    } else {
        return position;
    }
}

function closePopup() {
    var popup = document.querySelector('.image-popup');
    var appDiv = document.getElementById('app-container');
    appDiv.removeChild(popup);
    var fileChooser = document.querySelector('.file-chooser');
    fileChooser.style.display = '';
    var imageContainer = document.querySelector('.image-container');
    imageContainer.style.display = '';
}