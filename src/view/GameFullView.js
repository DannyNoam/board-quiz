GameFullView.constructor = GameFullView;
GameFullView.prototype = Object.create(View.prototype);

GameFullView.prototype.BACK_BUTTON = 0;

function GameFullView() {
    PIXI.Container.call(this);
}

GameFullView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.GAME_FULL;
    
    this.createLogo();
    this.createGameFullText(layoutData.GAME_FULL_TEXT);
    this.createBackButton();
};

GameFullView.prototype.createLogo = function () {
    var logo = this.spriteStore.get('logo');
    this.setElementPositionInPercent(logo, 50, 10);
    this.addElementToContainer(logo);
};

GameFullView.prototype.createGameFullText = function (data) {
    var gameFullText = this.createTextElement(data);
    this.setElementPositionInPercent(gameFullText, 50, 25);
    this.addElementToContainer(gameFullText);
};

GameFullView.prototype.createBackButton = function (data) {
    this.backButton = this.spriteStore.get('backButton');
    this.setElementPositionInPercent(this.backButton, 50, 50);
    this.addElementToContainer(this.backButton);
};

GameFullView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

GameFullView.prototype.cleanView = function() {
    this.removeAllElements();
};

module.exports = GameFullView;