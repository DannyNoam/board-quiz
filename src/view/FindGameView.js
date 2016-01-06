FindGameView.constructor = FindGameView;
FindGameView.prototype = Object.create(PIXI.Container.prototype);

FindGameView.prototype.BACK_BUTTON = 0;

function FindGameView() {
    PIXI.Container.call(this);
}

FindGameView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.FIND_GAME;
    var commonData = PIXI.Container.layoutData.COMMON;
    this.findGameCaption = new PIXI.Text(layoutData.CAPTION.text, {font: layoutData.CAPTION.size + "px " + layoutData.CAPTION.font, fill: layoutData.CAPTION.color});
    this.findGameCaption.position.x = layoutData.CAPTION.x;
    this.findGameCaption.position.y = layoutData.CAPTION.y;
    this.findGameCaption.interactive = true;
    this.findGameCaption.anchor.x = 0.5;
    this.findGameCaption.anchor.y = 0.5;
    this.addChild(this.findGameCaption);
    
    this.backButton = new PIXI.Sprite.fromImage(commonData.BACK_BUTTON.path);
    this.backButton.position.x = commonData.BACK_BUTTON.x;
    this.backButton.position.y = commonData.BACK_BUTTON.y;
    this.backButton.anchor.x = 0.5;
    this.backButton.anchor.y = 0.5;
    this.backButton.interactive = true;
    this.addChild(this.backButton);
};

FindGameView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

module.exports = FindGameView;