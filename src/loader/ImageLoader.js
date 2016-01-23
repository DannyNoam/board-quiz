var ImageLoader = function(imageJsonPath, callback) {
    var jsonLoader = new JsonLoader(imageJsonPath, loadImages);
    
    function loadImages(imageData) {
        var images = imageData.IMAGES;
        for(var imagePath in images) {
            loadImage(images[imagePath]);
        }
        callback();
    }
    
    function loadImage(imagePath) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imagePath, true);
        xhr.send();
    }
};

module.exports = ImageLoader;