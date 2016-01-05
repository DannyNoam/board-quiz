HelpController.constructor = HelpController;
HelpController.prototype = Object.create(Controller.prototype);

HelpController.prototype.view = new HelpView();

function HelpController() {
    Controller.call(this);
    this.viewLoader.removeAllViews();
    this.loadView();
    this.setupListeners();
}

HelpController.prototype.loadView = function() {
    this.view.setupViewElements();
    this.viewLoader.loadView(this.view);
};

HelpController.prototype.setupListeners = function() {
    var viewElements = this.view.getInteractiveViewElements();  
    var backButton = viewElements[this.view.BACK_BUTTON];
    
    this.registerListener(backButton, function() {
        var menuController = new MenuController();
    });
    
};