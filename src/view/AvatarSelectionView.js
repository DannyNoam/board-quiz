AvatarSelectionView.constructor = AvatarSelectionView;
AvatarSelectionView.prototype = Object.create(View.prototype);

AvatarSelectionView.prototype.BACK_BUTTON = 0;
AvatarSelectionView.prototype.SELECT_UP = 1;
AvatarSelectionView.prototype.SELECT_DOWN = 2;
AvatarSelectionView.prototype.FIND_GAME = 3;


function AvatarSelectionView() {
    PIXI.Container.call(this);
}

AvatarSelectionView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.AVATAR_SELECTION;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.boardQuizText = new PIXI.Text(commonData.BOARD_QUIZ.text, {font: commonData.BOARD_QUIZ.size + "px " + commonData.BOARD_QUIZ.font, fill: commonData.BOARD_QUIZ.color});
    this.addElementToContainer(this.boardQuizText, commonData.BOARD_QUIZ);
    
    this.backButton = new PIXI.Sprite.fromImage(commonData.BACK_BUTTON.path);
    this.addElementToContainer(this.backButton, commonData.BACK_BUTTON);
    
    this.selectUp = new PIXI.Sprite.fromImage(layoutData.SELECT_UP.path);
    this.addElementToContainer(this.selectUp, layoutData.SELECT_UP);
    
    this.selectDown = new PIXI.Sprite.fromImage(layoutData.SELECT_DOWN.path);
    this.addElementToContainer(this.selectDown, layoutData.SELECT_DOWN);
    
    this.findGame = new PIXI.Sprite.fromImage(layoutData.FIND_GAME.path);
    this.addElementToContainer(this.findGame, layoutData.FIND_GAME);
};

AvatarSelectionView.prototype.getInteractiveViewElements = function() {
    return [this.backButton, this.selectUp, this.selectDown, this.findGame];
};

module.exports = AvatarSelectionView;