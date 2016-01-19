DiceController.constructor = DiceController;
DiceController.prototype = Object.create(GameController.prototype);
DiceController.prototype.view = new DiceView();

DiceController.prototype.SOCKET_ON_DICE_NUMBER = 'dice-number';
DiceController.prototype.SOCKET_ROLL_DICE = 'roll-dice';

function DiceController() {
    Controller.call(this);
    this.registerSocketEvents();
}

DiceController.prototype.registerSocketEvents = function() {
    this.socket.on(this.SOCKET_ON_DICE_NUMBER, function(dice) {
        this.loadDice(dice.number);
    }.bind(this));
};

DiceController.prototype.rollDice = function() {
    if(this.isPlayer1()) {
        this.socket.emit(this.SOCKET_ROLL_DICE);
    }
};

DiceController.prototype.loadDice = function(diceNumber) {
    this.view.setupDice(diceNumber);
    this.setDiceNumber(diceNumber);
    this.viewLoader.loadView(this.view);
};

DiceController.prototype.cleanView = function() {
    this.viewLoader.removeView(this.view);
    this.view.cleanView();
};

module.exports = DiceController;