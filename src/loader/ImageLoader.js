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
        var REQUEST_FINISHED = 4;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imagePath, true);
        xhr.send();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === REQUEST_FINISHED) {
              console.log("Finished loading image path: " + imagePath);
          }
        };
    }
};

module.exports = ImageLoader;