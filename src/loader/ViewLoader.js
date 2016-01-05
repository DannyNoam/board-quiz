function ViewLoader() {}

ViewLoader.prototype.loadView = function(view) {
    ViewLoader.topLevelContainer.addChild(view);
};

ViewLoader.prototype.removeAllViews = function() {
    ViewLoader.topLevelContainer.removeChildren();
};

ViewLoader.prototype.removeView = function(view) {
    ViewLoader.topLevelContainer.removeChild(view);
};

ViewLoader.prototype.setRenderer = function(renderer) {
    ViewLoader.prototype.renderer = renderer;
};

ViewLoader.prototype.setContainer = function(container) {
    ViewLoader.topLevelContainer = container;
};

ViewLoader.prototype.animate = function() {
    console.log("Height: " + ViewLoader.prototype.renderer.height + " Width: " + ViewLoader.prototype.renderer.width);
    ViewLoader.prototype.renderer.render(ViewLoader.topLevelContainer);
    requestAnimationFrame(ViewLoader.prototype.animate);
};

module.exports = ViewLoader;