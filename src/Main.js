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
    
    var DEFAULT_WIDTH = 480;
    var DEFAULT_HEIGHT = 320;
    
    (function() {
        new BucketLoader(loadLayout, bucketLoadingFailedMessage);
    })();
     
    function loadLayout() {
        new JsonLoader('../resource/' + Display.bucket.width + 'x' + Display.bucket.height + '/layout.json', setLayoutDataInPIXI);
    }
    
    function setLayoutDataInPIXI(layoutData) {
        PIXI.Container.layoutData = layoutData;
        startRendering();
    }
    
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
        viewLoader.setRenderer(new PIXI.autoDetectRenderer(Display.bucket.width, Display.bucket.height));
        Controller.setViewLoader(viewLoader);
    }
    
    function beginAnimation(viewLoader) {
        requestAnimationFrame(viewLoader.animate);
    }
    
    function beginGame() {
        var menuController = new MenuController(); 
    }
        
    function bucketLoadingFailedMessage() {
        Display.bucket.height = DEFAULT_HEIGHT;
        Display.bucket.width = DEFAULT_WIDTH;
        Display.scale = 1;
        Display.resourcePath = DEFAULT_WIDTH + 'x' + DEFAULT_HEIGHT;
    }
};