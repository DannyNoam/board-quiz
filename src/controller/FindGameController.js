FindGameController.constructor = FindGameController;
FindGameController.prototype = Object.create(Controller.prototype);
FindGameController.prototype.view = new FindGameView();

function FindGameController(avatar) {
    Controller.call(this);
    this.loadView(avatar);
}

FindGameController.prototype.loadView = function(avatar) {
    this.viewLoader.removeAllViews();
    this.view.setupViewElements(avatar);
    this.viewLoader.loadView(this.view);
    this.setupListeners();
};

FindGameController.prototype.setupListeners = function() {
    var viewElements = this.view.getInteractiveViewElements();  
    var backButton = viewElements[this.view.BACK_BUTTON];
    
    this.registerListener(backButton, function() {
        var menuController = new AvatarSelectionController();
    });
    
};

module.exports = FindGameController;