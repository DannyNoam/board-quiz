function ViewLoader() {
    ViewLoader.renderer = new PIXI.autoDetectRenderer(800, 600);
    document.getElementById("game").appendChild(ViewLoader.renderer.view);
    ViewLoader.topLevelContainer.interactive = true;
    requestAnimationFrame(this.animate);
}

ViewLoader.topLevelContainer = new PIXI.Container();

ViewLoader.renderer = new PIXI.autoDetectRenderer(800, 600);

ViewLoader.prototype.loadView = function(view) {
    ViewLoader.topLevelContainer.addChild(view);
};

ViewLoader.prototype.removeAllViews = function() {
    ViewLoader.topLevelContainer.removeChildren();
};

ViewLoader.prototype.removeView = function(view) {
    ViewLoader.topLevelContainer.removeChild(view);
};

ViewLoader.prototype.animate = function() {
    ViewLoader.renderer.render(ViewLoader.topLevelContainer);
    requestAnimationFrame(ViewLoader.prototype.animate);
};

module.exports = ViewLoader;