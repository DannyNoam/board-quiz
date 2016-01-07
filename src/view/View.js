View.constructor = View;
View.prototype = Object.create(PIXI.Container.prototype);

function View() {
    PIXI.Container.call(this);
}

View.prototype.addElementToContainer = function(element, positionData) {
    this.setElementPosition(element, positionData);
    element.anchor.x = 0.5;
    element.anchor.y = 0.5;
    element.interactive = true;
    this.addChild(element);
};

View.prototype.setElementPosition = function(element, positionData) {
    element.position.x = positionData.x;
    element.position.y = positionData.y;
};

View.prototype.createTextElement = function(data) {
    return new PIXI.Text(data.text, {font: data.size + "px " + data.font, fill: data.color});
};

View.prototype.createSpriteElement = function(data) {
    return new PIXI.Sprite.fromImage(data.path);
};

module.exports = View;

