MenuController.constructor = MenuController;
MenuController.prototype = Object.create(Controller.prototype);

MenuController.prototype.view = new MenuView();

function MenuController() {
    Controller.call(this);
    this.viewLoader.removeAllViews();
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
    
    this.registerListener(playButton, function() {
        console.log("Play button clicked!");
    });
    
    this.registerListener(helpButton, function() {
        var helpController = new HelpController();
    });
}