var SpriteStore = function() {
    var sprites = [];
    
    (function() {
        sprites.logo = new PIXI.Sprite.fromImage(Display.resourcePath + '/logo.jpg');
        sprites.playButton = new PIXI.Sprite.fromImage(Display.resourcePath + '/play-button.jpg');
        sprites.helpButton = new PIXI.Sprite.fromImage(Display.resourcePath + '/help-button.jpg');
        sprites.backButton = new PIXI.Sprite.fromImage(Display.resourcePath + '/back-button.jpg');
        sprites.downTriangle = new PIXI.Sprite.fromImage(Display.resourcePath + '/down-triangle.png');
        sprites.upTriangle = new PIXI.Sprite.fromImage(Display.resourcePath + '/up-triangle.png');
        sprites.findGame = new PIXI.Sprite.fromImage(Display.resourcePath + '/find-game.jpg');
        sprites.emojiAngel = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-angel.png');
        sprites.emojiBigSmile = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-big-smile.png');
        sprites.emojiCool = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-cool.png');
        sprites.emojiGrin = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-grin.png');
        sprites.emojiHappy = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-happy.png');
        sprites.emojiKiss = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-kiss.png');
        sprites.emojiLaughing = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-laughing.png');
        sprites.emojiLove = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-love.png');
        sprites.emojiMonkey = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-monkey.png');
        sprites.emojiPoo = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-poo.png');
        sprites.emojiScream = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-scream.png');
        sprites.emojiSleep = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-sleep.png');
        sprites.emojiSmile = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-smile.png');
        sprites.emojiSleep = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-sleep.png');
        sprites.emojiWink = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-wink.png');
        sprites.questionMark = new PIXI.Sprite.fromImage(Display.resourcePath + '/question-mark.png');
    })();
    
    return {
        get: function(spriteName) {
            return sprites[spriteName];
        }
    };
};

module.exports = SpriteStore;