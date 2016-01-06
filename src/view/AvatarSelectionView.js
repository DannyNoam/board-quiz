AvatarSelectionView.constructor = AvatarSelectionView;
AvatarSelectionView.prototype = Object.create(PIXI.Container.prototype);

AvatarSelectionView.prototype.BACK_BUTTON = 0;

function AvatarSelectionView() {
    PIXI.Container.call(this);
}

AvatarSelectionView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.AVATAR_SELECTION;
    var commonData = PIXI.Container.layoutData.COMMON;
    this.boardQuizText = new PIXI.Text(commonData.BOARD_QUIZ.text, {font: commonData.BOARD_QUIZ.size + "px " + commonData.BOARD_QUIZ.font, fill: commonData.BOARD_QUIZ.color});
    this.boardQuizText.position.x = commonData.BOARD_QUIZ.x;
    this.boardQuizText.position.y = commonData.BOARD_QUIZ.y;
    this.boardQuizText.interactive = true;
    this.boardQuizText.anchor.x = 0.5;
    this.boardQuizText.anchor.y = 0.5;
    this.addChild(this.boardQuizText);
    
    this.backButton = new PIXI.Sprite.fromImage(commonData.BACK_BUTTON.path);
    this.backButton.position.x = commonData.BACK_BUTTON.x;
    this.backButton.position.y = commonData.BACK_BUTTON.y;
    this.backButton.anchor.x = 0.5;
    this.backButton.anchor.y = 0.5;
    this.backButton.interactive = true;
    this.addChild(this.backButton);
    
    this.upArrow = new PIXI.Sprite.fromImage(layoutData.UP_TRIANGLE.path);
    this.upArrow.position.x = layoutData.UP_TRIANGLE.x;
    this.upArrow.position.y = layoutData.UP_TRIANGLE.y;
    this.upArrow.anchor.x = 0.5;
    this.upArrow.anchor.y = 0.5;
    this.upArrow.interactive = true;
    this.addChild(this.upArrow);
    
    this.downArrow = new PIXI.Sprite.fromImage(layoutData.DOWN_TRIANGLE.path);
    this.downArrow.position.x = layoutData.DOWN_TRIANGLE.x;
    this.downArrow.position.y = layoutData.DOWN_TRIANGLE.y;
    this.downArrow.anchor.x = 0.5;
    this.downArrow.anchor.y = 0.5;
    this.downArrow.interactive = true;
    this.addChild(this.downArrow);
};

AvatarSelectionView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

module.exports = AvatarSelectionView;