AvatarSelectionController.constructor = AvatarSelectionController;
AvatarSelectionController.prototype = Object.create(Controller.prototype);
AvatarSelectionController.prototype.view = new AvatarSelectionView();
AvatarSelectionController.prototype.selectedAvatarView = new AvatarView();
AvatarSelectionController.prototype.avatars = ['emojiAngel', 'emojiBigSmile', 'emojiCool', 'emojiGrin', 'emojiHappy', 'emojiKiss', 'emojiLaughing', 'emojiLove', 'emojiMonkey', 'emojiPoo', 'emojiScream', 'emojiSleep', 'emojiSmile', 'emojiSleep', 'emojiWink'];
AvatarSelectionController.prototype.currentAvatarIndex = 0;
AvatarSelectionController.prototype.amISet = "No";

function AvatarSelectionController() {
    Controller.call(this);
}

AvatarSelectionController.prototype.loadView = function() {
    this.cleanView();
    this.viewLoader.removeAllViews();
    this.view.setupViewElements();
    this.selectedAvatarView.createAvatar(this.avatars[this.currentAvatarIndex]);
    this.viewLoader.loadView(this.view);
    this.viewLoader.loadView(this.selectedAvatarView);
    this.setupListeners();
    console.log("View loaded");
};

AvatarSelectionController.prototype.setupListeners = function() {
    var viewElements = this.view.getInteractiveViewElements();  
    var backButton = viewElements[this.view.BACK_BUTTON];
    var selectUp = viewElements[this.view.SELECT_UP];
    var selectDown = viewElements[this.view.SELECT_DOWN];
    var findGame = viewElements[this.view.FIND_GAME];
    
    this.registerListener(backButton, function() {
        var menuController = ControllerStore.menuController;
        menuController.loadView();
    });
    
    this.registerListener(selectUp, function() {
        var UP = 1;
        this.setupNextAvatar(UP);
        this.viewLoader.removeView(this.selectedAvatarView);
        this.viewLoader.loadView(this.selectedAvatarView);
    }.bind(this));
    
    this.registerListener(selectDown, function() {
        var DOWN = -1;
        this.setupNextAvatar(DOWN);
        this.viewLoader.removeView(this.selectedAvatarView);
        this.viewLoader.loadView(this.selectedAvatarView);
    }.bind(this));
    
    this.registerListener(findGame, function() {
        var avatar = this.avatars[this.currentAvatarIndex];
        var findGameController = ControllerStore.findGameController;
        findGameController.loadView(avatar);
    }.bind(this));
};

AvatarSelectionController.prototype.setupNextAvatar = function(direction) {
    if(this.currentAvatarIndex >= (this.avatars.length - 1)) {
        this.currentAvatarIndex = 0;
    } else if (this.currentAvatarIndex + direction < 0) {
        this.currentAvatarIndex = (this.avatars.length - 1);
    } else {
        this.currentAvatarIndex = this.currentAvatarIndex + direction;
    }
   
    this.selectedAvatarView.createAvatar(this.avatars[this.currentAvatarIndex]);
};

AvatarSelectionController.prototype.cleanView = function() {
    this.viewLoader.removeView(this.view);
    this.view.cleanView();
};

module.exports = AvatarSelectionController;