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
        var viewLoader = new ViewLoader();
        var container = new PIXI.Container();
        setDependencies(viewLoader, container);
        appendGameToDOM();
        beginAnimation(viewLoader);
        beginGame();
    }
    
    function appendGameToDOM() {
        document.getElementById("game").appendChild(ViewLoader.prototype.renderer.view);
    }
    
    function setDependencies(viewLoader, container) {
        container.interactive = true;
        viewLoader.setContainer(container);
        viewLoader.setRenderer(new PIXI.autoDetectRenderer(Display.bucket.height, Display.bucket.width));
        Controller.setViewLoader(viewLoader);
    }
    
    function beginAnimation(viewLoader) {
        requestAnimationFrame(viewLoader.animate);
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