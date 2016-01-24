MenuView.constructor = MenuView;
MenuView.prototype = Object.create(View.prototype);

MenuView.prototype.PLAY_BUTTON = 0;
MenuView.prototype.HELP_BUTTON = 1;

function MenuView() {
    PIXI.Container.call(this);
}

MenuView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.MENU;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.createLogo(commonData.LOGO);
    this.createPlayButton(layoutData.PLAY_BUTTON);
    this.createHelpButton(layoutData.HELP_BUTTON);
};

MenuView.prototype.createLogo = function (data) {
    var logo = this.createSpriteElement(data);
    this.addElementToContainer(logo, data);
};

MenuView.prototype.createPlayButton = function (data) {
    this.playButton = this.createSpriteElement(data);
    this.addElementToContainer(this.playButton, data);
};

MenuView.prototype.createHelpButton = function (data) {
    this.helpButton = this.createSpriteElement(data);
    this.addElementToContainer(this.helpButton, data);
};

MenuView.prototype.getInteractiveViewElements = function() {
    return [this.playButton, this.helpButton];
};

module.exports = MenuView;