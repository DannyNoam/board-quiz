TurnController.constructor = TurnController;
TurnController.prototype = Object.create(Controller.prototype);

function TurnController(playerController, diceController, questionController) {
    Controller.call(this);
    this.playerController = playerController;
    this.diceController = diceController;
    this.questionController = questionController;
    this.registerSocketEvents();
    this.playerController.loadView();
    this.newTurn();
}

TurnController.prototype.registerSocketEvents = function() {
    this.socket.on('init-new-turn', function() {
        this.newTurn();
    }.bind(this));
};

TurnController.prototype.newTurn = function() {
    // Only proceed if they're both above 30
    console.log("Initiating new turn..");
    this.diceController.cleanView();
    this.questionController.cleanView();
    this.diceController.rollDice();
    this.questionController.loadView();
};

module.exports = TurnController;