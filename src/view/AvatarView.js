AvatarView.constructor = AvatarView;
AvatarView.prototype = Object.create(PIXI.Container.prototype);

AvatarView.prototype.BACK_BUTTON = 0;

function AvatarView() {
    PIXI.Container.call(this);
}

AvatarView.prototype.setupViewElements = function(avatarName) {
    var layoutData = PIXI.Container.layoutData.AVATAR;
    var commonData = PIXI.Container.layoutData.COMMON;
    this.avatar = new PIXI.Sprite.fromImage(layoutData[avatarName].path);
    this.avatar.position.x = layoutData[avatarName].x;
    this.avatar.position.y = layoutData[avatarName].y;
    this.avatar.anchor.x = 0.5;
    this.avatar.anchor.y = 0.5;
    this.addChild(this.avatar);
};

module.exports = AvatarView;