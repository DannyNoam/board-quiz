HelpView.constructor = HelpView;
HelpView.prototype = Object.create(PIXI.Container.prototype);

HelpView.prototype.BACK_BUTTON = 0;

function HelpView() {
    PIXI.Container.call(this);
}

HelpView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.HELP_VIEW;
    this.helpText = new PIXI.Text(layoutData.HELP_INFO.text, {font: layoutData.HELP_INFO.size + "px " + layoutData.HELP_INFO.font, fill: layoutData.HELP_INFO.color});
    this.helpText.position.x = layoutData.HELP_INFO.x;
    this.helpText.position.y = layoutData.HELP_INFO.y;
    this.helpText.interactive = true;
    this.helpText.anchor.x = 0.5;
    this.helpText.anchor.y = 0.5;
    this.addChild(this.helpText);
    
    this.backButton = new PIXI.Sprite.fromImage(layoutData.BACK_BUTTON.path);
    this.backButton.position.x = layoutData.BACK_BUTTON.x;
    this.backButton.position.y = layoutData.BACK_BUTTON.y;
    this.backButton.anchor.x = 0.5;
    this.backButton.anchor.y = 0.5;
    this.backButton.interactive = true;
    this.addChild(this.backButton);
};

HelpView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

module.exports = HelpView;