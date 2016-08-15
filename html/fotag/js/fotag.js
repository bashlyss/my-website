'use strict';

// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var modelModule = createModelModule();

    var imageCollectionModel = new modelModule.ImageCollectionModel();

    var viewModule = createViewModule();
    var appContainer = document.getElementById('app-container');

    var toolbar = new viewModule.Toolbar();
    appContainer.appendChild(toolbar.getElement());

    // Attach the file chooser to the page. You can choose to put this elsewhere, and style as desired
    var fileChooser = new viewModule.FileChooser();
    appContainer.appendChild(fileChooser.getElement());

    var imageCollectionView = new viewModule.ImageCollectionView();
    appContainer.appendChild(imageCollectionView.getElement());

    toolbar.addListener(function (toolbar, eventType, eventDate) {
        if (eventType === viewModule.LIST_VIEW || eventType === viewModule.GRID_VIEW) {
            imageCollectionView.setToView(eventType);
        } else if (eventType = viewModule.RATING_CHANGE) {
            imageCollectionView.filter(toolbar.getCurrentRatingFilter());
        }
    });

    // Demo that we can choose files and save to local storage. This can be replaced, later
    fileChooser.addListener(function(fileChooser, files, eventDate) {
        _.each(
            files,
            function(file) {
                imageCollectionModel.addImageModel(
                    new modelModule.ImageModel(
                        'images/' + file.name,
                        file.lastModifiedDate,
                        '',
                        0
                    ));
            }
        );
    });

    window.addEventListener('unload', function () {
        modelModule.storeImageCollectionModel(imageCollectionModel);
    });

    // Demo retrieval
    imageCollectionModel = modelModule.loadImageCollectionModel();
    console.log(imageCollectionModel);
    imageCollectionView.setImageCollectionModel(imageCollectionModel);

    toolbar.setToView(viewModule.GRID_VIEW);
});