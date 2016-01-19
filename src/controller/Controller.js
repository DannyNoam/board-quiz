function Controller() {}

Controller.setViewLoader = function(viewLoader) {
    Controller.prototype.viewLoader = viewLoader;
};

Controller.prototype.socket = io();

Controller.prototype.registerListener = function(viewElement, action) {
    viewElement.touchend = viewElement.click = action;
};

Controller.prototype.registerMultipleListeners = function(viewElements, action) {
    for(var i = 0; i < viewElements.length; i++) {
        this.registerListener(viewElements[i], action);
    }
};

Controller.prototype.setPlayerData = function(playerData) {
    Controller.prototype.playerData = playerData;
};

Controller.prototype.isPlayer1 = function() {
    var socketPrefix = "/#";
    return this.playerData.player1Id === (socketPrefix + Controller.prototype.socket.id);
};

Controller.prototype.getPlayer = function() {
    return this.isPlayer1(this.playerData) ? "PLAYER_1" : "PLAYER_2";
};

Controller.prototype.getOpponent = function() {
    return this.isPlayer1(this.playerData) ? "PLAYER_2" : "PLAYER_1";
};

Controller.prototype.setDiceNumber = function(diceNumber) {
    Controller.prototype.diceNumber = diceNumber;
};

module.exports = Controller;