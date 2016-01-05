HelpView.constructor = HelpView;
HelpView.prototype = Object.create(PIXI.Container.prototype);

HelpView.prototype.BACK_BUTTON = 0;

function HelpView() {
    PIXI.Container.call(this);
}

HelpView.prototype.setupViewElements = function() {
    this.helpText = new PIXI.Text("To play, blah blah blah...", {font: "20px Arial", fill: "#FFFFFF"});
    this.helpText.position.x = 400;
    this.helpText.position.y = 100;
    this.helpText.interactive = true;
    this.helpText.anchor.x = 0.5;
    this.helpText.anchor.y = 0.5;
    this.addChild(this.helpText);
    
    this.backButton = new PIXI.Sprite.fromImage('assets/back-button.jpg');
    this.backButton.position.x = 400;
    this.backButton.position.y = 400;
    this.backButton.anchor.x = 0.5;
    this.backButton.anchor.y = 0.5;
    this.backButton.interactive = true;
    this.addChild(this.backButton);
};

HelpView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};