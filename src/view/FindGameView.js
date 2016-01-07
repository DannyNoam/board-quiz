FindGameView.constructor = FindGameView;
FindGameView.prototype = Object.create(View.prototype);

FindGameView.prototype.BACK_BUTTON = 0;

function FindGameView() {
    PIXI.Container.call(this);
}

FindGameView.prototype.setupViewElements = function(avatar) {
    var layoutData = PIXI.Container.layoutData.FIND_GAME;
    var commonData = PIXI.Container.layoutData.COMMON;
    var avatarData = PIXI.Container.layoutData.AVATAR;
    
    this.createFindGameCaption(layoutData.CAPTION);
    this.createPlayer1Avatar(avatarData[avatar], layoutData.PLAYER_1_AVATAR);
    this.createVersusText(layoutData.VERSUS);
    this.createPlayer2UnknownAvatar(avatarData.PLAYER_2_UNKNOWN, layoutData.PLAYER_2_UNKNOWN);
    this.createBackButton(commonData.BACK_BUTTON);
    this.createPlayer1Text(layoutData.PLAYER_1);
    this.createPlayer2Text(layoutData.PLAYER_2);
};

FindGameView.prototype.createFindGameCaption = function (data) {
    var findGameCaption = this.createTextElement(data);
    this.addElementToContainer(findGameCaption, data);
};

FindGameView.prototype.createPlayer1Avatar = function (avatar, data) {
    var player1Avatar = this.createSpriteElement(avatar);
    this.addElementToContainer(player1Avatar, data);
};

FindGameView.prototype.createVersusText = function (data) {
    var versus = this.createTextElement(data);
    this.addElementToContainer(versus, data);
};

FindGameView.prototype.createPlayer2UnknownAvatar = function (avatar, data) {
    var player2UnknownAvatar = this.createSpriteElement(avatar);
    this.addElementToContainer(player2UnknownAvatar, data);
};

FindGameView.prototype.createBackButton = function (data) {
    this.backButton = this.createSpriteElement(data);
    this.addElementToContainer(this.backButton, data);
};

FindGameView.prototype.createPlayer1Text = function (data) {
    var player1 = this.createTextElement(data);
    this.addElementToContainer(player1, data);
};

FindGameView.prototype.createPlayer2Text = function (data) {
    var player2 = this.createTextElement(data);
    this.addElementToContainer(player2, data);
};

FindGameView.prototype.getInteractiveViewElements = function () {
    return [this.backButton];
};

module.exports = FindGameView;