WinView.constructor = WinView;
WinView.prototype = Object.create(View.prototype);

WinView.prototype.PLAY_AGAIN_BUTTON = 0;

function WinView() {
    PIXI.Container.call(this);
    this.setupViewElements();
}
WinView.prototype.createWinnerText = function(playerWhoWon, statData) {
    var winData = PIXI.Container.layoutData.WIN;
    this.createWinText(winData[playerWhoWon + "_WINS"], winData.WIN_TEXT_POSITION);
    this.createPlayerStatsText(winData, statData);
};

WinView.prototype.setupViewElements = function(playerWhoWon) {
    var winData = PIXI.Container.layoutData.WIN;
    this.createPlayAgainButton(winData.PLAY_AGAIN);
};

WinView.prototype.createWinText = function (data, positionData) {
    this.winText = this.createTextElement(data);
    this.setElementPositionInPercent(this.winText, 50, 66);
    this.addElementToContainer(this.winText, positionData);
};

WinView.prototype.createPlayerStatsText = function(layoutData, statData) {
    var correctP1AnswerPercentageDefaultText = layoutData.PLAYER_1_CORRECT_PERCENTAGE.text;
    layoutData.PLAYER_1_CORRECT_PERCENTAGE.text = layoutData.PLAYER_1_CORRECT_PERCENTAGE.text + statData.player1CorrectAnswerPercentage;
    this.player1CorrectAnswerPercentageText = this.createTextElement(layoutData.PLAYER_1_CORRECT_PERCENTAGE);
    this.setElementPositionInPercent(this.player1CorrectAnswerPercentageText, 25, 72);
    this.addElementToContainer(this.player1CorrectAnswerPercentageText, layoutData.PLAYER_1_CORRECT_PERCENTAGE);
    layoutData.PLAYER_1_CORRECT_PERCENTAGE.text = correctP1AnswerPercentageDefaultText;
    
    var correctP2AnswerPercentageDefaultText = layoutData.PLAYER_2_CORRECT_PERCENTAGE.text;
    layoutData.PLAYER_2_CORRECT_PERCENTAGE.text = layoutData.PLAYER_2_CORRECT_PERCENTAGE.text + statData.player2CorrectAnswerPercentage;
    this.player2CorrectAnswerPercentageText = this.createTextElement(layoutData.PLAYER_2_CORRECT_PERCENTAGE);
    this.setElementPositionInPercent(this.player2CorrectAnswerPercentageText, 75, 72);
    this.addElementToContainer(this.player2CorrectAnswerPercentageText, layoutData.PLAYER_2_CORRECT_PERCENTAGE);
    layoutData.PLAYER_2_CORRECT_PERCENTAGE.text = correctP2AnswerPercentageDefaultText;
};

WinView.prototype.createPlayAgainButton = function () {
    this.playAgainButton = this.createSpriteElement(Display.resourcePath + '/play-again.png');
    this.setElementPositionInPercent(this.playAgainButton, 50, 80);
    this.addElementToContainer(this.playAgainButton);
};

WinView.prototype.getInteractiveViewElements = function() {
    return [this.playAgainButton];
};

WinView.prototype.cleanView = function() {
    this.removeElement(this.player1CorrectAnswerPercentageText);
    this.removeElement(this.player2CorrectAnswerPercentageText);
    this.removeElement(this.winText);
};

module.exports = WinView;