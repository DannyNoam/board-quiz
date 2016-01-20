TurnController.constructor = TurnController;
TurnController.prototype = Object.create(Controller.prototype);

function TurnController(playerController, diceController, questionController) {
    Controller.call(this);
    this.playerController = playerController;
    this.diceController = diceController;
    this.questionController = questionController;
    this.winView = new WinView();
    this.cleanView();
    this.registerSocketEvents();
    this.setupListeners();
    this.playerController.loadView();
    this.newTurn();
}

TurnController.prototype.registerSocketEvents = function() {
    this.socket.on('init-new-turn', function(playerData) {
        if(playerData.player1Health === 0) {
            this.diceController.cleanView();
            this.questionController.cleanView();
            this.winView.createWinnerText("PLAYER_2");
            this.viewLoader.loadView(this.winView);
        } else if(playerData.player2Health === 0) {
            this.diceController.cleanView();
            this.questionController.cleanView();
            this.winView.createWinnerText("PLAYER_1");
            this.viewLoader.loadView(this.winView);
        } else {
            this.newTurn();
        }
    }.bind(this));
};

TurnController.prototype.setupListeners = function() {
    var viewElements = this.winView.getInteractiveViewElements();  
    var playAgainButton = viewElements[this.winView.PLAY_AGAIN_BUTTON];
    
    this.registerListener(playAgainButton, function() {
        this.playerController.cleanView();
        this.diceController.cleanView();
        this.questionController.cleanView();
        var avatarSelectionController = new AvatarSelectionController();
    }.bind(this));
};

TurnController.prototype.newTurn = function() {
    this.diceController.cleanView();
    this.questionController.cleanView();
    this.diceController.rollDice();
    this.questionController.loadView();
};

TurnController.prototype.cleanView = function() {
    this.playerController.cleanView();
    this.diceController.cleanView();
    this.questionController.cleanView();
};

TurnController.prototype.checkPlayersHealth = function() {
    this.socket.emit('get-players-health');
};

module.exports = TurnController;