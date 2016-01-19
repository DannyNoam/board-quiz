PlayerController.constructor = PlayerController;
PlayerController.prototype = Object.create(Controller.prototype);
PlayerController.prototype.view = new PlayerView();

function PlayerController() {
    Controller.call(this);
}

PlayerController.prototype.loadView = function() {
    this.view.setPlayerData(this.playerData);
    this.view.setupViewElements();
    this.updatePlayersHealth();
    this.viewLoader.loadView(this.view);
};

PlayerController.prototype.updatePlayersHealth = function() {
    this.socket.emit('get-players-health');

    this.socket.on('players-health', function(playerData) {
        this.view.setPlayer1Health(playerData.player1Health);
        this.view.setPlayer2Health(playerData.player2Health);
    }.bind(this));
};

module.exports = PlayerController;