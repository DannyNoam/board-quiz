AvatarSelectionView.constructor = AvatarSelectionView;
AvatarSelectionView.prototype = Object.create(PIXI.Container.prototype);

AvatarSelectionView.prototype.BACK_BUTTON = 0;
AvatarSelectionView.prototype.SELECT_UP = 1;
AvatarSelectionView.prototype.SELECT_DOWN = 2;


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
    
    this.selectUp = new PIXI.Sprite.fromImage(layoutData.SELECT_UP.path);
    this.selectUp.position.x = layoutData.SELECT_UP.x;
    this.selectUp.position.y = layoutData.SELECT_UP.y;
    this.selectUp.anchor.x = 0.5;
    this.selectUp.anchor.y = 0.5;
    this.selectUp.interactive = true;
    this.addChild(this.selectUp);
    
    this.selectDown = new PIXI.Sprite.fromImage(layoutData.SELECT_DOWN.path);
    this.selectDown.position.x = layoutData.SELECT_DOWN.x;
    this.selectDown.position.y = layoutData.SELECT_DOWN.y;
    this.selectDown.anchor.x = 0.5;
    this.selectDown.anchor.y = 0.5;
    this.selectDown.interactive = true;
    this.addChild(this.selectDown);
};

AvatarSelectionView.prototype.getInteractiveViewElements = function() {
    return [this.backButton, this.selectUp, this.selectDown];
};

module.exports = AvatarSelectionView;