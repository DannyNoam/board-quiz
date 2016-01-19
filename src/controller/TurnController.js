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
    this.socket.on('init-new-turn', function(playerData) {
        if(playerData.player1Health === 0) {
            console.log("PLAYER 2 WINS!");
        } else if(playerData.player2Health === 0) {
            console.log("PLAYER 1 WINS!");
        } else {
            this.newTurn();
        }
    }.bind(this));
};

TurnController.prototype.newTurn = function() {
    this.diceController.cleanView();
    this.questionController.cleanView();
    this.diceController.rollDice();
    this.questionController.loadView();
};

TurnController.prototype.checkPlayersHealth = function() {
    this.socket.emit('get-players-health');
};

module.exports = TurnController;