MenuView.constructor = MenuView;
MenuView.prototype = Object.create(PIXI.Container.prototype);

MenuView.prototype.PLAY_BUTTON = 0;
MenuView.prototype.HELP_BUTTON = 1;

function MenuView() {
    PIXI.Container.call(this);
}

MenuView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData;
    this.boardQuizText = new PIXI.Text(layoutData.BOARD_QUIZ.text, {font: layoutData.BOARD_QUIZ.size + "px " + layoutData.BOARD_QUIZ.font, fill: layoutData.BOARD_QUIZ.color});
    this.boardQuizText.position.x = 400;
    this.boardQuizText.position.y = 100;
    this.boardQuizText.interactive = true;
    this.boardQuizText.anchor.x = 0.5;
    this.boardQuizText.anchor.y = 0.5;
    this.addChild(this.boardQuizText);
    
    this.playButton = new PIXI.Sprite.fromImage('assets/play-button.gif');
    this.playButton.position.x = 400;
    this.playButton.position.y = 200;
    this.playButton.anchor.x = 0.5;
    this.playButton.anchor.y = 0.5;
    this.playButton.interactive = true;
    this.addChild(this.playButton);
    
    this.helpButton = new PIXI.Sprite.fromImage('assets/help.gif');
    this.helpButton.position.x = 400;
    this.helpButton.position.y = 420;
    this.helpButton.anchor.x = 0.5;
    this.helpButton.anchor.y = 0.5;
    this.helpButton.interactive = true;
    this.addChild(this.helpButton);
    console.log(PIXI.Container.layoutData);
};

MenuView.prototype.getInteractiveViewElements = function() {
    return [this.playButton, this.helpButton];
};

module.exports = MenuView;