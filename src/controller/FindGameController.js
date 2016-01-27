FindGameController.constructor = FindGameController;
FindGameController.prototype = Object.create(Controller.prototype);
FindGameController.prototype.view = new FindGameView();
FindGameController.prototype.avatar = null;
FindGameController.prototype.TRANSITION_TO_GAME_TIME = 3000;

function FindGameController() {
    Controller.call(this);
    this.registerSocketEvents();
}

FindGameController.prototype.loadView = function(avatar) {
    this.avatar = avatar;
    this.cleanView();
    this.viewLoader.removeAllViews();
    this.view.setupViewElements(this.avatar);
    this.viewLoader.loadView(this.view);
    this.socket.emit(SocketConstants.emit.FINDING_GAME, {avatar: this.avatar});
};

FindGameController.prototype.registerSocketEvents = function() {
    this.socket.on(SocketConstants.on.GAME_FOUND, function(playerData) {
        this.assignAvatars(playerData);
        this.view.createGameFoundCaption();
        setTimeout(function() {
            this.viewLoader.removeAllViews();
            var playerController = ControllerStore.playerController;
            playerController.setPlayerData(playerData);
            var diceController = ControllerStore.diceController;
            var questionController = ControllerStore.questionController;
            questionController.setPlayerController(playerController);
            var turnController = ControllerStore.turnController;
            turnController.setControllerDependencies(playerController, diceController, questionController);
            turnController.initiate();
        }.bind(this), this.TRANSITION_TO_GAME_TIME);
    }.bind(this));
};

FindGameController.prototype.assignAvatars = function(data) {
    var socketIdPrefix = "/#";
    var socketId = socketIdPrefix + this.socket.id;
    if(data.player1Id === socketId) {
        this.view.createPlayer2ActualAvatar(data.player2Avatar);
    } else {
        this.view.createPlayer2ActualAvatar(data.player1Avatar);
    }
};

FindGameController.prototype.cleanView = function() {
    this.viewLoader.removeView(this.view);
    this.view.cleanView();
};

module.exports = FindGameController;