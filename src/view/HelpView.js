HelpView.constructor = HelpView;
HelpView.prototype = Object.create(View.prototype);

HelpView.prototype.BACK_BUTTON = 0;

function HelpView() {
    PIXI.Container.call(this);
}

HelpView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.HELP;
    var commonData = PIXI.Container.layoutData.COMMON;
    this.helpText = new PIXI.Text(layoutData.INFO.text, {font: layoutData.INFO.size + "px " + layoutData.INFO.font, fill: layoutData.INFO.color});
    this.setElementPosition(this.helpText, layoutData.INFO);
    this.addElementToContainer(this.helpText);
    
    this.backButton = new PIXI.Sprite.fromImage(commonData.BACK_BUTTON.path);
    this.addElementToContainer(this.backButton, commonData.BACK_BUTTON);
};

HelpView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

module.exports = HelpView;