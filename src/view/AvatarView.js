AvatarView.constructor = AvatarView;
AvatarView.prototype = Object.create(View.prototype);

AvatarView.prototype.BACK_BUTTON = 0;

function AvatarView() {
    PIXI.Container.call(this);
}

AvatarView.prototype.setupViewElements = function(avatarName) {
    var layoutData = PIXI.Container.layoutData.AVATAR;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.avatar = new PIXI.Sprite.fromImage(layoutData[avatarName].path);
    this.addElementToContainer(this.avatar, layoutData[avatarName]);
};

module.exports = AvatarView;