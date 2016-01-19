GameController.constructor = GameController;
GameController.prototype = Object.create(Controller.prototype);
GameController.prototype.playerController = new PlayerController();
GameController.prototype.diceController = new DiceController();
GameController.prototype.questionController = new QuestionController();

function GameController(playerData) {
    Controller.call(this);
    this.registerSocketEvents();
    this.setPlayerData(playerData);
    this.viewLoader.removeAllViews();
    this.startGame();
}

GameController.prototype.registerSocketEvents = function() {
    this.socket.on('init-new-turn', function() {
        this.newTurn();
    }.bind(this));
};

GameController.prototype.startGame = function() {
    this.playerController.loadView();
    this.diceController.loadView();
    this.questionController.getQuestionAndCategory(this.playerController);
};

GameController.prototype.newTurn = function() {
    // Only proceed if they're both above 30
    console.log("Initiating new turn..");
    this.diceController.cleanView();
    this.questionController.cleanView();
    this.diceController.loadView();
    this.questionController.getQuestionAndCategory(this.playerController);
};


module.exports = GameController;