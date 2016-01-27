GameFullController.constructor = GameFullController;
GameFullController.prototype = Object.create(Controller.prototype);
GameFullController.prototype.view = new GameFullView();

function GameFullController() {
    Controller.call(this);
}

GameFullController.prototype.loadView = function() {
    this.viewLoader.removeAllViews();
    this.view.cleanView();
    this.view.setupViewElements();
    this.viewLoader.loadView(this.view);
    this.setupListeners();
};

GameFullController.prototype.setupListeners = function() {
    var viewElements = this.view.getInteractiveViewElements();  
    var backButton = viewElements[this.view.BACK_BUTTON];
    
    this.registerListener(backButton, function() {
        var menuController = this.controllerStore.get('menuController');
        menuController.loadView();
    }.bind(this));
    
};

module.exports = GameFullController;