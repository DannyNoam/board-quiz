AvatarSelectionView.constructor = AvatarSelectionView;
AvatarSelectionView.prototype = Object.create(View.prototype);

AvatarSelectionView.prototype.BACK_BUTTON = 0;
AvatarSelectionView.prototype.SELECT_UP = 1;
AvatarSelectionView.prototype.SELECT_DOWN = 2;
AvatarSelectionView.prototype.FIND_GAME = 3;


function AvatarSelectionView() {
    PIXI.Container.call(this);
}

AvatarSelectionView.prototype.setupViewElements = function(callback, context) {
    var layoutData = PIXI.Container.layoutData.AVATAR_SELECTION;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.createBoardQuizText(commonData.BOARD_QUIZ);
    this.createBackButton(commonData.BACK_BUTTON);
    this.createSelectDownButton(layoutData.SELECT_DOWN);
    this.createSelectUpButton(layoutData.SELECT_UP);
    this.createFindGameButton(layoutData.FIND_GAME);
    callback.apply(context);
};

AvatarSelectionView.prototype.createBoardQuizText = function (data) {
    var boardQuizText = this.createTextElement(data);
    this.addElementToContainer(boardQuizText, data);
};

AvatarSelectionView.prototype.createBackButton = function (data) {
    this.backButton = this.createSpriteElement(data);
    this.addElementToContainer(this.backButton, data);
};

AvatarSelectionView.prototype.createSelectDownButton = function (data) {
    this.selectDownButton = this.createSpriteElement(data);
    this.addElementToContainer(this.selectDownButton, data);
};

AvatarSelectionView.prototype.createSelectUpButton = function (data) {
    this.selectUpButton = this.createSpriteElement(data);
    this.addElementToContainer(this.selectUpButton, data);
};

AvatarSelectionView.prototype.createFindGameButton = function (data) {
    this.findGameButton = this.createSpriteElement(data);
    this.addElementToContainer(this.findGameButton, data);
};

AvatarSelectionView.prototype.getInteractiveViewElements = function() {
    return [this.backButton, this.selectUpButton, this.selectDownButton, this.findGameButton];
};

AvatarSelectionView.prototype.cleanView = function() {
    this.removeAllElements();
};

module.exports = AvatarSelectionView;