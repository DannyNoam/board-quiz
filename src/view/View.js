View.constructor = View;
View.prototype = Object.create(PIXI.Container.prototype);
View.prototype.INTERACTIVE = true;
View.prototype.CENTER_ANCHOR = 0.5;

function View() {
    PIXI.Container.call(this);
}

View.prototype.addElementToContainer = function(element) {
    element.anchor.x = this.CENTER_ANCHOR;
    element.anchor.y = this.CENTER_ANCHOR;
    element.interactive = this.INTERACTIVE;
    this.addChild(element);
};

View.prototype.createTextElement = function(data) {
    return new PIXI.Text(data.text, {font: data.size + "px " + data.font, fill: data.color});
};

View.prototype.createSpriteElement = function(path) {
    return new PIXI.Sprite.fromImage(path);
};

View.prototype.removeElement = function(element) {
    this.removeChild(element);
};

View.prototype.updateElement = function(element) {
    this.removeChild(element);
    this.addChild(element);
};

View.prototype.removeAllElements = function() {
    this.removeChildren();
};

View.prototype.setElementPositionInPercent = function(element, widthPercentage, heightPercentage) {
    element.x = (window.innerWidth / 100) * widthPercentage;
    element.y = (window.innerHeight / 100) * heightPercentage;   
};

module.exports = View;

