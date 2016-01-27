var ControllerStore = function() {
    
    var controllers = [];
    
    (function() {
        controllers.menuController = new MenuController();
        controllers.avatarSelectionController = new AvatarSelectionController();
        controllers.helpController = new HelpController();
        controllers.findGameController = new FindGameController();
        controllers.diceController = new DiceController();
        controllers.playerController = new PlayerController();
        controllers.questionController = new QuestionController();
        controllers.turnController = new TurnController();
    })();
    
    return {
        get: function(controllerName) {
            return controllers[controllerName];
        }
    };
};

module.exports = ControllerStore;