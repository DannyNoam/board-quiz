function Controller() {
    this.viewLoader = new ViewLoader();
}
Controller.prototype.registerListener = function(viewElement, action) {
    viewElement.touchend = viewElement.click = action;
};

module.exports = Controller;