var ControllerStore = {
    menuController: new MenuController(),
    avatarSelectionController: new AvatarSelectionController(),
    helpController: new HelpController(),
    findGameController: new FindGameController(),
    diceController: new DiceController(),
    playerController: new PlayerController(),
    questionController: new QuestionController(),
    turnController: new TurnController()
};

module.exports = ControllerStore;