FindGameView.constructor = FindGameView;
FindGameView.prototype = Object.create(PIXI.Container.prototype);

FindGameView.prototype.BACK_BUTTON = 0;

function FindGameView() {
    PIXI.Container.call(this);
}

FindGameView.prototype.setupViewElements = function(avatar) {
    var layoutData = PIXI.Container.layoutData.FIND_GAME;
    var commonData = PIXI.Container.layoutData.COMMON;
    var avatarData = PIXI.Container.layoutData.AVATAR;
    
    this.findGameCaption = new PIXI.Text(layoutData.CAPTION.text, {font: layoutData.CAPTION.size + "px " + layoutData.CAPTION.font, fill: layoutData.CAPTION.color});
    this.findGameCaption.position.x = layoutData.CAPTION.x;
    this.findGameCaption.position.y = layoutData.CAPTION.y;
    this.findGameCaption.interactive = true;
    this.findGameCaption.anchor.x = 0.5;
    this.findGameCaption.anchor.y = 0.5;
    this.addChild(this.findGameCaption);
    
    this.player1Avatar = new PIXI.Sprite.fromImage(avatarData[avatar].path);
    this.player1Avatar.position.x = layoutData.PLAYER_1_AVATAR.x;
    this.player1Avatar.position.y = layoutData.PLAYER_1_AVATAR.y;
    this.player1Avatar.interactive = true;
    this.player1Avatar.anchor.x = 0.5;
    this.player1Avatar.anchor.y = 0.5;
    this.addChild(this.player1Avatar);
    
    this.versus = new PIXI.Text(layoutData.VERSUS.text, {font: layoutData.VERSUS.size + "px " + layoutData.VERSUS.font, fill:   layoutData.VERSUS.color});
    this.versus.position.x = layoutData.VERSUS.x;
    this.versus.position.y = layoutData.VERSUS.y;
    this.versus.interactive = true;
    this.versus.anchor.x = 0.5;
    this.versus.anchor.y = 0.5;
    this.addChild(this.versus);
    
    this.player2UnknownAvatar = new PIXI.Sprite.fromImage(avatarData.PLAYER_2_UNKNOWN.path);
    this.player2UnknownAvatar.position.x = layoutData.PLAYER_2_UNKNOWN.x;
    this.player2UnknownAvatar.position.y = layoutData.PLAYER_2_UNKNOWN.y;
    this.player2UnknownAvatar.interactive = true;
    this.player2UnknownAvatar.anchor.x = 0.5;
    this.player2UnknownAvatar.anchor.y = 0.5;
    this.addChild(this.player2UnknownAvatar);
    
    this.backButton = new PIXI.Sprite.fromImage(commonData.BACK_BUTTON.path);
    this.backButton.position.x = commonData.BACK_BUTTON.x;
    this.backButton.position.y = commonData.BACK_BUTTON.y;
    this.backButton.anchor.x = 0.5;
    this.backButton.anchor.y = 0.5;
    this.backButton.interactive = true;
    this.addChild(this.backButton);
    
    this.player1 = new PIXI.Text(layoutData.PLAYER_1.text, {font: layoutData.PLAYER_1.size + "px " + layoutData.PLAYER_1.font, fill:   layoutData.PLAYER_1.color});
    this.player1.position.x = layoutData.PLAYER_1.x;
    this.player1.position.y = layoutData.PLAYER_1.y;
    this.player1.interactive = true;
    this.player1.anchor.x = 0.5;
    this.player1.anchor.y = 0.5;
    this.addChild(this.player1);
    
    this.player2 = new PIXI.Text(layoutData.PLAYER_2.text, {font: layoutData.PLAYER_2.size + "px " + layoutData.PLAYER_2.font, fill:   layoutData.PLAYER_2.color});
    this.player2.position.x = layoutData.PLAYER_2.x;
    this.player2.position.y = layoutData.PLAYER_2.y;
    this.player2.interactive = true;
    this.player2.anchor.x = 0.5;
    this.player2.anchor.y = 0.5;
    this.addChild(this.player2);
};

FindGameView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

module.exports = FindGameView;