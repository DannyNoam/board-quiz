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
    
    this.boardQuizText = new PIXI.Text(commonData.BOARD_QUIZ.text, {font: commonData.BOARD_QUIZ.size + "px " + commonData.BOARD_QUIZ.font, fill: commonData.BOARD_QUIZ.color});
    this.addElementToContainer(this.boardQuizText, commonData.BOARD_QUIZ);
    
    this.playButton = new PIXI.Sprite.fromImage(layoutData.PLAY_BUTTON.path);
    this.addElementToContainer(this.playButton, layoutData.PLAY_BUTTON);
    
    this.helpButton = new PIXI.Sprite.fromImage(layoutData.HELP_BUTTON.path);
    this.addElementToContainer(this.helpButton, layoutData.HELP_BUTTON);
};

MenuView.prototype.getInteractiveViewElements = function() {
    return [this.playButton, this.helpButton];
};

module.exports = MenuView;