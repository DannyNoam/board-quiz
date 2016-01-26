DiceView.constructor = DiceView;
DiceView.prototype = Object.create(View.prototype);

function DiceView() {
    PIXI.Container.call(this);
}

DiceView.prototype.setupDice = function(diceNumber) {
    this.createDiceElement(diceNumber);
};

DiceView.prototype.createDiceElement = function(diceNumber) {
    this.diceElement = this.createSpriteElement(Display.resourcePath + '/dice/dice-face-' + diceNumber + '.png');
    this.setElementPositionInPercent(this.diceElement, 50, 36);
    this.addElementToContainer(this.diceElement);
};

DiceView.prototype.cleanView = function() {
    this.removeAllElements();
};

module.exports = DiceView;