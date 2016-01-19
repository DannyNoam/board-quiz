FindGameController.constructor = FindGameController;
FindGameController.prototype = Object.create(Controller.prototype);
FindGameController.prototype.view = new FindGameView();
FindGameController.prototype.avatar = null;
FindGameController.prototype.TRANSITION_TO_GAME_TIME = 3000;
FindGameController.prototype.GAME_FOUND = 'game-found';
FindGameController.prototype.FINDING_GAME = 'finding-game';

function FindGameController(avatar) {
    Controller.call(this);
    this.avatar = avatar;
    this.loadView();
}

FindGameController.prototype.loadView = function() {
    this.viewLoader.removeAllViews();
    this.view.setupViewElements(this.avatar);
    this.viewLoader.loadView(this.view);
    this.setupServerInteraction();
};

FindGameController.prototype.setupServerInteraction = function() {
    this.socket.on(this.GAME_FOUND, function(playerData) {
        this.assignAvatars(playerData);
        this.view.createGameFoundCaption();
        setTimeout(function() {
            var gameController = new GameController(playerData);
        }.bind(this), this.TRANSITION_TO_GAME_TIME);
    }.bind(this));
    this.socket.emit(this.FINDING_GAME, {avatar: this.avatar});
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

module.exports = FindGameController;