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

module.exports = View;

