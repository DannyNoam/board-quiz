DisconnectionView.constructor = DisconnectionView;
DisconnectionView.prototype = Object.create(View.prototype);

DisconnectionView.prototype.BACK_BUTTON = 0;

function DisconnectionView() {
    PIXI.Container.call(this);
}

DisconnectionView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.DISCONNECTION;
    
    this.createLogo();
    this.createGameFullText(layoutData.DISCONNECTION_TEXT);
};

DisconnectionView.prototype.createLogo = function () {
    var logo = this.spriteStore.get('logo');
    this.setElementPositionInPercent(logo, 50, 10);
    this.addElementToContainer(logo);
};

DisconnectionView.prototype.createGameFullText = function (data) {
    var disconnectionText = this.createTextElement(data);
    this.setElementPositionInPercent(disconnectionText, 50, 50);
    this.addElementToContainer(disconnectionText);
};

DisconnectionView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

DisconnectionView.prototype.cleanView = function() {
    this.removeAllElements();
};

module.exports = DisconnectionView;