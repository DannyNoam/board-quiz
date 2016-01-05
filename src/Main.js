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
    
    (function() {
        new BucketLoader(startRendering, bucketLoadingFailedMessage);
    })();
     
    function startRendering() {
        var container = new PIXI.Container();
        container.interactive = true;
        ViewLoader.prototype.setContainer(container);
        ViewLoader.prototype.setRenderer(new PIXI.autoDetectRenderer(Display.bucket.height, Display.bucket.width));
        document.getElementById("game").appendChild(ViewLoader.prototype.renderer.view);
        requestAnimationFrame(ViewLoader.prototype.animate);
        beginGame();
    }
    
    function beginGame() {
        var menuController = new MenuController(); 
    }
        
    function bucketLoadingFailedMessage() {
        Display.bucket.height = 320;
        Display.bucket.width = 480;
        Display.scale = 1;
        Display.resourcePath = "480x320";
    }
};