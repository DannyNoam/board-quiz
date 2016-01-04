MenuController.constructor = MenuController;
MenuController.prototype = Object.create(Controller.prototype);

MenuController.prototype.view = new MenuView();

function MenuController() {
    Controller.call(this);
    this.loadView();
    this.setupListeners();
}

MenuController.prototype.loadView = function() {
    this.view.setupViewElements();
    this.viewLoader.loadView(this.view);
}

MenuController.prototype.setupListeners = function() {
    var viewElements = this.view.getInteractiveViewElements();  
    var playButton = viewElements[this.view.PLAY_BUTTON];
    var helpButton = viewElements[this.view.HELP_BUTTON];
    
    playButton.touchend = playButton.click = function(mouseData) {
        console.log("Play button clicked!");
    }
    
    helpButton.touchend = helpButton.click = function(mouseData) {
        console.log("Help button clicked!");
    }
    
}