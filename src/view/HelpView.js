HelpView.constructor = HelpView;
HelpView.prototype = Object.create(PIXI.Container.prototype);

HelpView.prototype.BACK_BUTTON = 0;

function HelpView() {
    PIXI.Container.call(this);
}

HelpView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.HELP;
    var commonData = PIXI.Container.layoutData.COMMON;
    this.helpText = new PIXI.Text(layoutData.INFO.text, {font: layoutData.INFO.size + "px " + layoutData.INFO.font, fill: layoutData.INFO.color});
    this.helpText.position.x = layoutData.INFO.x;
    this.helpText.position.y = layoutData.INFO.y;
    this.helpText.interactive = true;
    this.helpText.anchor.x = 0.5;
    this.helpText.anchor.y = 0.5;
    this.addChild(this.helpText);
    
    this.backButton = new PIXI.Sprite.fromImage(commonData.BACK_BUTTON.path);
    this.backButton.position.x = commonData.BACK_BUTTON.x;
    this.backButton.position.y = commonData.BACK_BUTTON.y;
    this.backButton.anchor.x = 0.5;
    this.backButton.anchor.y = 0.5;
    this.backButton.interactive = true;
    this.addChild(this.backButton);
};

HelpView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

module.exports = HelpView;