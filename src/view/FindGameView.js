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
    
    this.findGameCaption = new PIXI.Text(layoutData.CAPTION.text, {font: layoutData.CAPTION.size + "px " + layoutData.CAPTION.font, fill: layoutData.CAPTION.color});
    this.addElementToContainer(this.findGameCaption, layoutData.CAPTION);
    
    this.player1Avatar = new PIXI.Sprite.fromImage(avatarData[avatar].path);
    this.addElementToContainer(this.player1Avatar, layoutData.PLAYER_1_AVATAR);
    
    this.versus = new PIXI.Text(layoutData.VERSUS.text, {font: layoutData.VERSUS.size + "px " + layoutData.VERSUS.font, fill:   layoutData.VERSUS.color});
    this.addElementToContainer(this.versus, layoutData.VERSUS);
    
    this.player2UnknownAvatar = new PIXI.Sprite.fromImage(avatarData.PLAYER_2_UNKNOWN.path);
    this.addElementToContainer(this.player2UnknownAvatar, layoutData.PLAYER_2_UNKNOWN);
    
    this.backButton = new PIXI.Sprite.fromImage(commonData.BACK_BUTTON.path);
    this.addElementToContainer(this.backButton, commonData.BACK_BUTTON);
    
    this.player1 = new PIXI.Text(layoutData.PLAYER_1.text, {font: layoutData.PLAYER_1.size + "px " + layoutData.PLAYER_1.font, fill:   layoutData.PLAYER_1.color});
    this.addElementToContainer(this.player1, layoutData.PLAYER_1);
    
    this.player2 = new PIXI.Text(layoutData.PLAYER_2.text, {font: layoutData.PLAYER_2.size + "px " + layoutData.PLAYER_2.font, fill:   layoutData.PLAYER_2.color});
    this.addElementToContainer(this.player2, layoutData.PLAYER_2);
};

FindGameView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

module.exports = FindGameView;