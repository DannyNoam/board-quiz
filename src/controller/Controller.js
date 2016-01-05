function Controller() {}

Controller.prototype.viewLoader = new ViewLoader();

Controller.prototype.registerListener = function(viewElement, action) {
    viewElement.touchend = viewElement.click = action;
};

module.exports = Controller;