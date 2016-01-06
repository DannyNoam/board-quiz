MenuView.constructor = MenuView;
MenuView.prototype = Object.create(PIXI.Container.prototype);

MenuView.prototype.PLAY_BUTTON = 0;
MenuView.prototype.HELP_BUTTON = 1;

function MenuView() {
    PIXI.Container.call(this);
}

MenuView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.MENU;
    var commonData = PIXI.Container.layoutData.COMMON;
    this.boardQuizText = new PIXI.Text(commonData.BOARD_QUIZ.text, {font: commonData.BOARD_QUIZ.size + "px " + commonData.BOARD_QUIZ.font, fill: commonData.BOARD_QUIZ.color});
    this.boardQuizText.position.x = commonData.BOARD_QUIZ.x;
    this.boardQuizText.position.y = commonData.BOARD_QUIZ.y;
    this.boardQuizText.interactive = true;
    this.boardQuizText.anchor.x = 0.5;
    this.boardQuizText.anchor.y = 0.5;
    this.addChild(this.boardQuizText);
    
    this.playButton = new PIXI.Sprite.fromImage(layoutData.PLAY_BUTTON.path);
    this.playButton.position.x = layoutData.PLAY_BUTTON.x;
    this.playButton.position.y = layoutData.PLAY_BUTTON.y;
    this.playButton.anchor.x = 0.5;
    this.playButton.anchor.y = 0.5;
    this.playButton.interactive = true;
    this.addChild(this.playButton);
    
    this.helpButton = new PIXI.Sprite.fromImage(layoutData.HELP_BUTTON.path);
    this.helpButton.position.x = layoutData.HELP_BUTTON.x;
    this.helpButton.position.y = layoutData.HELP_BUTTON.y;
    this.helpButton.anchor.x = 0.5;
    this.helpButton.anchor.y = 0.5;
    this.helpButton.interactive = true;
    this.addChild(this.helpButton);
};

MenuView.prototype.getInteractiveViewElements = function() {
    return [this.playButton, this.helpButton];
};

module.exports = MenuView;