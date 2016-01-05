Display = require('./util/Display');
BucketLoader = require('./loader/BucketLoader');
JsonLoader = require('./loader/JsonLoader');
ViewLoader = require('./loader/ViewLoader');
Controller = require('./controller/Controller');
HelpView = require('./view/HelpView');
HelpController = require('./controller/HelpController');
MenuView = require('./view/MenuView');
MenuController = require('./controller/MenuController');

window.onload = function() {
    console.log("Gonna load Buckets...");
    var bucketLoader = new BucketLoader(createMenuController, bucketLoadingFailedMessage);
    
    function createMenuController() {
        var menuController = new MenuController();
        ViewLoader.prototype.setRenderer(new PIXI.autoDetectRenderer(Display.bucket.height, Display.bucket.width));
        document.getElementById("game").appendChild(ViewLoader.prototype.renderer.view);
        requestAnimationFrame(ViewLoader.prototype.animate);
    }
    
    function bucketLoadingFailedMessage() {
        console.error("No buckets! :(");
    }
};