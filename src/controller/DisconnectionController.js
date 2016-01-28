DisconnectionController.constructor = DisconnectionController;
DisconnectionController.prototype = Object.create(Controller.prototype);
DisconnectionController.prototype.view = new DisconnectionView();

function DisconnectionController() {
    Controller.call(this);
}

DisconnectionController.prototype.loadView = function() {
    this.viewLoader.removeAllViews();
    this.view.cleanView();
    this.view.setupViewElements();
    this.viewLoader.loadView(this.view);
};

module.exports = DisconnectionController;