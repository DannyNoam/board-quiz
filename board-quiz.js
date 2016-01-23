(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Display = require('./util/Display');
SocketConstants = require('./SocketConstants');
View = require('./view/View');
BucketLoader = require('./loader/BucketLoader');
JsonLoader = require('./loader/JsonLoader');
ImageLoader = require('./loader/ImageLoader');
ViewLoader = require('./loader/ViewLoader');
Controller = require('./controller/Controller');
HelpView = require('./view/HelpView');
HelpController = require('./controller/HelpController');
MenuView = require('./view/MenuView');
MenuController = require('./controller/MenuController');
AvatarSelectionView = require('./view/AvatarSelectionView');
AvatarView = require('./view/subview/AvatarView');
AvatarSelectionController = require('./controller/AvatarSelectionController');
FindGameView = require('./view/FindGameView');
FindGameController = require('./controller/FindGameController');
GameController = require('./controller/GameController');
DiceView = require('./view/subview/DiceView');
DiceController = require('./controller/subcontroller/DiceController');
QuestionView = require('./view/subview/QuestionView');
QuestionController = require('./controller/subcontroller/QuestionController');
PlayerView = require('./view/subview/PlayerView');
PlayerController = require('./controller/subcontroller/PlayerController');
WinView = require('./view/subview/WinView');
TurnController = require('./controller/TurnController');

window.onload = function() {
    
    var DEFAULT_WIDTH = 480;
    var DEFAULT_HEIGHT = 320;
    var RENDERER_BACKGROUND_COLOUR = 0x333333;
    var DIV_ID = "game";
    
    (function() {
        new BucketLoader(loadLayout, bucketLoadingFailedMessage);
    })();
     
    function loadLayout() {
        new JsonLoader('./resource/' + Display.bucket.width + 'x' + Display.bucket.height + '/layout.json', setLayoutDataInPIXI);
    }
    
    function setLayoutDataInPIXI(layoutData) {
        PIXI.Container.layoutData = layoutData;
        new JsonLoader('./resource/questions.json', setQuestionDataInQuestionController);
    }
    
    function setQuestionDataInQuestionController(questionData) {
        QuestionController.prototype.questionData = questionData;
        new JsonLoader('./resource/categories.json', setCategoryDataInQuestionController);
    }
    
    function setCategoryDataInQuestionController(categoryData) {
        QuestionController.prototype.categoryData = categoryData;
        loadImages();
    }
    
    function loadImages() {
        new ImageLoader('./resource/images.json', startRendering);
    }
    
    function startRendering() {
        var viewLoader = new ViewLoader();
        var container = new PIXI.Container();
        container.interactive = true;
        var renderer = new PIXI.autoDetectRenderer(Display.bucket.width, Display.bucket.height);
        renderer.backgroundColor = RENDERER_BACKGROUND_COLOUR;
        setDependencies(viewLoader, container, renderer);
        appendGameToDOM(renderer);
        beginAnimation(viewLoader);
        beginGame();
    }
    
    function appendGameToDOM(renderer) {
        document.getElementById(DIV_ID).appendChild(renderer.view);
    }
    
    function setDependencies(viewLoader, container, renderer) {
        viewLoader.setContainer(container);
        viewLoader.setRenderer(renderer);
        Controller.setViewLoader(viewLoader);
    }
    
    function beginAnimation(viewLoader) {
        requestAnimationFrame(viewLoader.animate);
    }
    
    function beginGame() {
        var menuController = new MenuController(); 
    }
        
    function bucketLoadingFailedMessage() {
        Display.bucket.height = DEFAULT_HEIGHT;
        Display.bucket.width = DEFAULT_WIDTH;
        Display.scale = 1;
        Display.resourcePath = DEFAULT_WIDTH + 'x' + DEFAULT_HEIGHT;
    }
};
},{"./SocketConstants":2,"./controller/AvatarSelectionController":3,"./controller/Controller":4,"./controller/FindGameController":5,"./controller/GameController":6,"./controller/HelpController":7,"./controller/MenuController":8,"./controller/TurnController":9,"./controller/subcontroller/DiceController":10,"./controller/subcontroller/PlayerController":11,"./controller/subcontroller/QuestionController":12,"./loader/BucketLoader":13,"./loader/ImageLoader":14,"./loader/JsonLoader":15,"./loader/ViewLoader":16,"./util/Display":17,"./view/AvatarSelectionView":18,"./view/FindGameView":19,"./view/HelpView":20,"./view/MenuView":21,"./view/View":22,"./view/subview/AvatarView":23,"./view/subview/DiceView":24,"./view/subview/PlayerView":25,"./view/subview/QuestionView":26,"./view/subview/WinView":27}],2:[function(require,module,exports){
var SocketConstants = {
    'on' : {
        'PLAYERS_HEALTH' : 'players-health',
        'DICE_NUMBER' : 'dice-number',
        'RANDOM_QUESTION' : 'random-question',
        'INIT_NEW_TURN' : 'init-new-turn',
        'DAMAGE_DEALT' : 'damage-dealt',
        'SHUFFLED_ANSWER_INDICES' : 'shuffled-answer-indices',
        'GAME_FOUND' : 'game-found',
        'GAME_STATS' : 'game-stats'
    },
    
    'emit' : {
        'CONNECTION' : 'connection',
        'FINDING_GAME' : 'finding-game',
        'GET_PLAYERS_HEALTH' : 'get-players-health',
        'DISCONNECT' : 'disconnect',
        'ROLL_DICE' : 'roll-dice',
        'GET_RANDOM_QUESTION' : 'get-random-question',
        'NEW_TURN' : 'new-turn',
        'DEAL_DAMAGE' : 'deal-damage',
        'SHUFFLE_ANSWER_INDICES' : 'shuffle-answer-indices',
        'GAME_ENDED' : 'game-ended'
    }
};

module.exports = SocketConstants;
},{}],3:[function(require,module,exports){
AvatarSelectionController.constructor = AvatarSelectionController;
AvatarSelectionController.prototype = Object.create(Controller.prototype);
AvatarSelectionController.prototype.view = new AvatarSelectionView();
AvatarSelectionController.prototype.selectedAvatarView = new AvatarView();
AvatarSelectionController.prototype.avatars = ['EMOJI_CRY', 'EMOJI_ANGRY'];
AvatarSelectionController.prototype.currentAvatarIndex = 0;

function AvatarSelectionController() {
    Controller.call(this);
    this.cleanView();
    this.loadView();
}

AvatarSelectionController.prototype.loadView = function() {
    this.viewLoader.removeAllViews();
    this.view.setupViewElements();
    this.selectedAvatarView.setupViewElements(this.avatars[this.currentAvatarIndex]);
    this.viewLoader.loadView(this.view);
    this.viewLoader.loadView(this.selectedAvatarView);
    this.setupListeners();
};

AvatarSelectionController.prototype.setupListeners = function() {
    var viewElements = this.view.getInteractiveViewElements();  
    var backButton = viewElements[this.view.BACK_BUTTON];
    var selectUp = viewElements[this.view.SELECT_UP];
    var selectDown = viewElements[this.view.SELECT_DOWN];
    var findGame = viewElements[this.view.FIND_GAME];
    
    this.registerListener(backButton, function() {
        var menuController = new MenuController();
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
        var findGameController = new FindGameController(avatar);
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
    this.selectedAvatarView.setupViewElements(this.avatars[this.currentAvatarIndex]);
};

AvatarSelectionController.prototype.cleanView = function() {
    this.viewLoader.removeView(this.view);
    this.view.cleanView();
};

module.exports = AvatarSelectionController;
},{}],4:[function(require,module,exports){
function Controller() {}

Controller.setViewLoader = function(viewLoader) {
    Controller.prototype.viewLoader = viewLoader;
};

Controller.prototype.socket = io();

Controller.prototype.registerListener = function(viewElement, action) {
    viewElement.touchend = viewElement.click = action;
};

Controller.prototype.registerMultipleListeners = function(viewElements, action) {
    for(var i = 0; i < viewElements.length; i++) {
        this.registerListener(viewElements[i], action);
    }
};

module.exports = Controller;
},{}],5:[function(require,module,exports){
FindGameController.constructor = FindGameController;
FindGameController.prototype = Object.create(Controller.prototype);
FindGameController.prototype.view = new FindGameView();
FindGameController.prototype.avatar = null;
FindGameController.prototype.TRANSITION_TO_GAME_TIME = 3000;

function FindGameController(avatar) {
    Controller.call(this);
    this.cleanView();
    this.avatar = avatar;
    this.loadView();
}

FindGameController.prototype.loadView = function() {
    this.viewLoader.removeAllViews();
    this.view.setupViewElements(this.avatar);
    this.viewLoader.loadView(this.view);
    this.setupServerInteraction();
};

FindGameController.prototype.setupServerInteraction = function() {
    this.socket.on(SocketConstants.on.GAME_FOUND, function(playerData) {
        this.assignAvatars(playerData);
        this.view.createGameFoundCaption();
        setTimeout(function() {
            this.viewLoader.removeAllViews();
            var playerController = new PlayerController(playerData);
            var diceController = new DiceController();
            var questionController = new QuestionController(playerController);
            var turnController = new TurnController(playerController, diceController, questionController);
        }.bind(this), this.TRANSITION_TO_GAME_TIME);
    }.bind(this));
    this.socket.emit(SocketConstants.emit.FINDING_GAME, {avatar: this.avatar});
};

FindGameController.prototype.assignAvatars = function(data) {
    var socketIdPrefix = "/#";
    var socketId = socketIdPrefix + this.socket.id;
    if(data.player1Id === socketId) {
        this.view.createPlayer2ActualAvatar(data.player2Avatar);
    } else {
        this.view.createPlayer2ActualAvatar(data.player1Avatar);
    }
};

FindGameController.prototype.cleanView = function() {
    this.viewLoader.removeView(this.view);
    this.view.cleanView();
};

module.exports = FindGameController;
},{}],6:[function(require,module,exports){
GameController.constructor = GameController;
GameController.prototype = Object.create(Controller.prototype);

function GameController(playerData) {
    Controller.call(this);
}

GameController.prototype.setPlayerData = function(playerData) {
    GameController.prototype.playerData = playerData;
};

GameController.prototype.setDiceNumber = function(diceNumber) {
    GameController.prototype.diceNumber = diceNumber;
};

GameController.prototype.isPlayer1 = function() {
    var socketPrefix = "/#";
    return this.playerData.player1Id === (socketPrefix + GameController.prototype.socket.id);
};

GameController.prototype.getPlayer = function() {
    return this.isPlayer1(this.playerData) ? "PLAYER_1" : "PLAYER_2";
};

GameController.prototype.getOpponent = function() {
    return this.isPlayer1(this.playerData) ? "PLAYER_2" : "PLAYER_1";
};

module.exports = GameController;
},{}],7:[function(require,module,exports){
HelpController.constructor = HelpController;
HelpController.prototype = Object.create(Controller.prototype);
HelpController.prototype.view = new HelpView();

function HelpController() {
    Controller.call(this);
    this.loadView();
}

HelpController.prototype.loadView = function() {
    this.viewLoader.removeAllViews();
    this.view.setupViewElements();
    this.viewLoader.loadView(this.view);
    this.setupListeners();
};

HelpController.prototype.setupListeners = function() {
    var viewElements = this.view.getInteractiveViewElements();  
    var backButton = viewElements[this.view.BACK_BUTTON];
    
    this.registerListener(backButton, function() {
        var menuController = new MenuController();
    });
    
};

module.exports = HelpController;
},{}],8:[function(require,module,exports){
MenuController.constructor = MenuController;
MenuController.prototype = Object.create(Controller.prototype);
MenuController.prototype.view = new MenuView();

function MenuController() {
    Controller.call(this);
    this.loadView();
}

MenuController.prototype.loadView = function() {
    this.viewLoader.removeAllViews();
    this.view.setupViewElements();
    this.viewLoader.loadView(this.view);
    this.setupListeners();
};

MenuController.prototype.setupListeners = function() {
    var viewElements = this.view.getInteractiveViewElements();  
    var playButton = viewElements[this.view.PLAY_BUTTON];
    var helpButton = viewElements[this.view.HELP_BUTTON];
    
    this.registerListener(playButton, function() {
        var avatarSelectionController = new AvatarSelectionController();
    });
    
    this.registerListener(helpButton, function() {
        var helpController = new HelpController();
    });
};

module.exports = MenuController;
},{}],9:[function(require,module,exports){
TurnController.constructor = TurnController;
TurnController.prototype = Object.create(GameController.prototype);

function TurnController(playerController, diceController, questionController) {
    Controller.call(this);
    this.playerController = playerController;
    this.diceController = diceController;
    this.questionController = questionController;
    this.winView = new WinView();
    this.cleanView();
    this.registerSocketEvents();
    this.setupListeners();
    this.playerController.loadView();
    this.newTurn();
}

TurnController.prototype.registerSocketEvents = function() {
    this.socket.on(SocketConstants.on.INIT_NEW_TURN, function(playerData) {
        if(playerData.player1Health === 0) {
            if(this.isPlayer1()) {
                this.socket.emit(SocketConstants.emit.GAME_ENDED);
                this.socket.on(SocketConstants.on.GAME_STATS, function(data) {
                    this.loadWinView("PLAYER_2", data);
                }.bind(this));
            }
        } else if(playerData.player2Health === 0) {
            if(this.isPlayer1()) {
                this.socket.emit(SocketConstants.emit.GAME_ENDED);
                this.socket.on(SocketConstants.on.GAME_STATS, function(data) {
                    this.loadWinView("PLAYER_1", data);
                }.bind(this));
            }
        } else {
            this.newTurn();
        }
    }.bind(this));
};

TurnController.prototype.loadWinView = function(player, data) {
    this.diceController.cleanView();
    this.questionController.cleanView();
    this.winView.createWinnerText(player, data);
    this.viewLoader.loadView(this.winView);
};

TurnController.prototype.setupListeners = function() {
    var viewElements = this.winView.getInteractiveViewElements();  
    var playAgainButton = viewElements[this.winView.PLAY_AGAIN_BUTTON];
    
    this.registerListener(playAgainButton, function() {
        this.playerController.cleanView();
        this.diceController.cleanView();
        this.questionController.cleanView();
        var avatarSelectionController = new AvatarSelectionController();
    }.bind(this));
};

TurnController.prototype.newTurn = function() {
    this.diceController.cleanView();
    this.questionController.cleanView();
    this.diceController.rollDice();
    this.questionController.loadView();
};

TurnController.prototype.cleanView = function() {
    this.playerController.cleanView();
    this.diceController.cleanView();
    this.questionController.cleanView();
};

TurnController.prototype.checkPlayersHealth = function() {
    this.socket.emit(SocketConstants.emit.GET_PLAYERS_HEALTH);
};

module.exports = TurnController;
},{}],10:[function(require,module,exports){
DiceController.constructor = DiceController;
DiceController.prototype = Object.create(GameController.prototype);
DiceController.prototype.view = new DiceView();

function DiceController() {
    Controller.call(this);
    this.registerSocketEvents();
}

DiceController.prototype.registerSocketEvents = function() {
    this.socket.on(SocketConstants.on.DICE_NUMBER, function(dice) {
        this.loadDice(dice.number);
    }.bind(this));
};

DiceController.prototype.rollDice = function() {
    if(this.isPlayer1()) {
        this.socket.emit(SocketConstants.emit.ROLL_DICE);
    }
};

DiceController.prototype.loadDice = function(diceNumber) {
    this.view.setupDice(diceNumber);
    this.setDiceNumber(diceNumber);
    this.viewLoader.loadView(this.view);
};

DiceController.prototype.cleanView = function() {
    this.viewLoader.removeView(this.view);
    this.view.cleanView();
};

module.exports = DiceController;
},{}],11:[function(require,module,exports){
PlayerController.constructor = PlayerController;
PlayerController.prototype = Object.create(GameController.prototype);
PlayerController.prototype.view = new PlayerView();

function PlayerController(playerData) {
    Controller.call(this);
    this.setPlayerData(playerData);
    this.registerSocketEvents();
}

PlayerController.prototype.loadView = function() {
    this.view.setPlayerData(this.playerData);
    this.view.setupViewElements();
    this.updatePlayersHealth();
    this.viewLoader.loadView(this.view);
};

PlayerController.prototype.registerSocketEvents = function() {
    this.socket.on(SocketConstants.on.PLAYERS_HEALTH, function(playerData) {
        this.view.setPlayer1Health(playerData.player1Health);
        this.view.setPlayer2Health(playerData.player2Health);
    }.bind(this));
};

PlayerController.prototype.updatePlayersHealth = function() {
    this.socket.emit(SocketConstants.emit.GET_PLAYERS_HEALTH);
};

PlayerController.prototype.cleanView = function() {
    this.viewLoader.removeView(this.view);
    this.view.cleanView();
};

module.exports = PlayerController;
},{}],12:[function(require,module,exports){
QuestionController.constructor = QuestionController;
QuestionController.prototype = Object.create(GameController.prototype);
QuestionController.prototype.view = new QuestionView();

QuestionController.prototype.ANSWERED_1 = 'ANSWERED_1';
QuestionController.prototype.ANSWERED_2 = 'ANSWERED_2';
QuestionController.prototype.ANSWERED_3 = 'ANSWERED_3';
QuestionController.prototype.ANSWERED_4 = 'ANSWERED_4';

function QuestionController(playerController) {
    Controller.call(this);
    this.playerController = playerController;
    this.registerSocketEvents();
}

QuestionController.prototype.registerSocketEvents = function() {
    this.socket.on(SocketConstants.on.RANDOM_QUESTION, function(data) {
        this.question = data.question;
        this.category = data.category;
    }.bind(this));
    
    this.socket.on(SocketConstants.on.DAMAGE_DEALT, function(playerData) {
        this.view.setAnswerToColour(this.answers[playerData.answer], playerData.answer);
        this.view.setWhoAnsweredQuestion(this.answers[playerData.answer], playerData.answer, playerData.player_who_answered);
        this.view.turnOffInteractivityForAnswerElements();
        this.playerController.updatePlayersHealth();
        if(this.isPlayer1()) {
            this.socket.emit(SocketConstants.emit.NEW_TURN);
        }
    }.bind(this));
    
    this.socket.on(SocketConstants.on.SHUFFLED_ANSWER_INDICES, function(data) {
        this.view.setAnswerIndices(data);
        this.view.displayCategoryAndQuestion(this.category, this.question);
        this.setupListeners();
        this.viewLoader.loadView(this.view);
    }.bind(this));
};

QuestionController.prototype.loadView = function() {
    this.getRandomQuestion();
    this.shuffleAnswerIndices();
};

QuestionController.prototype.getRandomQuestion = function() {
    if(this.isPlayer1()) {
        var categories = this.categoryData.CATEGORIES;
        var questions = this.questionData.CATEGORIES;
        this.socket.emit(SocketConstants.emit.GET_RANDOM_QUESTION, {categories: categories, questions: questions});
    }
};

QuestionController.prototype.setupListeners = function() {
    var answers = this.getViewAnswers();
    this.setRightAnswerListener(answers);
    this.setWrongAnswerListeners(answers);
    this.setAnswerUpdateListener(answers);
};

QuestionController.prototype.getViewAnswers = function() {
    var viewElements = this.view.getInteractiveViewElements();
    var answers = {};
    answers.ANSWERED_1 = viewElements[this.view.RIGHT_ANSWER];
    answers.ANSWERED_2 = viewElements[this.view.WRONG_ANSWER_1];
    answers.ANSWERED_3 = viewElements[this.view.WRONG_ANSWER_2];
    answers.ANSWERED_4 = viewElements[this.view.WRONG_ANSWER_3];
    return answers;
};

QuestionController.prototype.setRightAnswerListener = function(answers) {
    this.registerListener(answers.ANSWERED_1, function() {
        this.emitDealDamageToOpponentToSocket(this.ANSWERED_1);
    }.bind(this));
};

QuestionController.prototype.setWrongAnswerListeners = function(answers) {
    this.registerListener(answers.ANSWERED_2, function() {
        this.emitDealDamageToSelfToSocket(this.ANSWERED_2);
    }.bind(this));
    
    this.registerListener(answers.ANSWERED_3, function() {
        this.emitDealDamageToSelfToSocket(this.ANSWERED_3);
    }.bind(this));
    
    this.registerListener(answers.ANSWERED_4, function() {
        this.emitDealDamageToSelfToSocket(this.ANSWERED_4);
    }.bind(this));
};

QuestionController.prototype.shuffleAnswerIndices = function(callback) {
    if(this.isPlayer1()) {
        this.socket.emit(SocketConstants.emit.SHUFFLE_ANSWER_INDICES, {indices: [1,2,3,4]});
    }
};

QuestionController.prototype.setAnswerUpdateListener = function(answers) {
    this.answers = answers;
};

QuestionController.prototype.emitDealDamageToOpponentToSocket = function(answer) {
    this.socket.emit(SocketConstants.emit.DEAL_DAMAGE, {player_who_answered: this.getPlayer(), player_to_damage: this.getOpponent(), damage: this.diceNumber, answer: answer, answerStatus: 'correct', category: this.category});
};

QuestionController.prototype.emitDealDamageToSelfToSocket = function(answer) {
    this.socket.emit(SocketConstants.emit.DEAL_DAMAGE, {player_who_answered: this.getPlayer(), player_to_damage: this.getPlayer(), damage: this.diceNumber, answer: answer, answerStatus: 'incorrect', category: this.category});
};

QuestionController.prototype.cleanView = function() {
    this.viewLoader.removeView(this.view);
    this.view.cleanView();
};

module.exports = QuestionController;
},{}],13:[function(require,module,exports){
function BucketLoader (callback, errorCallback, context) {
    var PORTRAIT = "portrait",
        LANDSCAPE = "landscape",
        BUCKET_SIZE_JSON_PATH = "resource/bucket_sizes.json";

    (function () {
        new JsonLoader(BUCKET_SIZE_JSON_PATH, calculateBestBucket);
    })();

    function calculateScale () {
        return Math.min(Math.floor(window.devicePixelRatio), 2);
    }

    function calculateBestBucket (bucketData) {
        var orientation = calculateOrientation();
        bucketData[orientation].forEach(function (bucket) {
            if (bucket.height <= window.innerHeight) {
                Display.bucket = bucket;
            }
        });

        Display.scale = calculateScale(window.devicePixelRatio);
        Display.resourcePath = Display.bucket.width + 'x' + Display.bucket.height;
        executeCallback();
    }
    
    function calculateOrientation () {
        if (window.innerHeight > window.innerWidth) {
            return PORTRAIT;
        } else {
            return LANDSCAPE;
        }
    }

    function executeCallback () {
        if (Display.bucket === null) {
            errorCallback();
        } else {
            callback();
        }
    }
}

module.exports = BucketLoader;
},{}],14:[function(require,module,exports){
var ImageLoader = function(imageJsonPath, callback) {
    var jsonLoader = new JsonLoader(imageJsonPath, loadImages);
    var imagesLoaded = 0;
    var totalImages = 0;
    
    function loadImages(imageData) {
        var images = imageData.IMAGES;
        countNumberOfImages(images);
        for(var image in images) {
            loadImage(images[image].path);
        }
    }
    
    function loadImage(imagePath) {
        var REQUEST_FINISHED = 4;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imagePath, true);
        xhr.send();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === REQUEST_FINISHED) {
              console.log("Finished loading image path: " + imagePath);
              imagesLoaded++;
              checkIfAllImagesLoaded();
          }
        };
    }
    
    function countNumberOfImages(images) {
        for(var image in images) {
            totalImages++;
        }
    }
    
    function checkIfAllImagesLoaded() {
        if(imagesLoaded === totalImages) {
            console.log("All images loaded!");
            callback();
        } else {
            console.log("Only " + imagesLoaded + " are loaded.");
        }
    }
};

module.exports = ImageLoader;
},{}],15:[function(require,module,exports){
var JsonLoader = function (path, callback) {
    var that = this,
        REQUEST_FINISHED = 4;
    (function loadJson() {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.open('GET', path, true);
        xhr.send();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === REQUEST_FINISHED) {
            that.data = JSON.parse(xhr.responseText);
            callback(that.data);
          }
        };
    })();

    return {
        getData: function () {
            return that.data;
        }
    };
};

module.exports = JsonLoader;

},{}],16:[function(require,module,exports){
function ViewLoader() {}

ViewLoader.prototype.loadView = function(view) {
    ViewLoader.topLevelContainer.addChild(view);
    console.log(view);
};

ViewLoader.prototype.removeAllViews = function() {
    ViewLoader.topLevelContainer.removeChildren();
};

ViewLoader.prototype.removeView = function(view) {
    ViewLoader.topLevelContainer.removeChild(view);
};

ViewLoader.prototype.setRenderer = function(renderer) {
    ViewLoader.prototype.renderer = renderer;
};

ViewLoader.prototype.setContainer = function(container) {
    ViewLoader.topLevelContainer = container;
};

ViewLoader.prototype.animate = function() {
    ViewLoader.prototype.renderer.render(ViewLoader.topLevelContainer);
    requestAnimationFrame(ViewLoader.prototype.animate);
};

module.exports = ViewLoader;
},{}],17:[function(require,module,exports){
var Display = {
    bucket: null,
    scale: null,
    resourcePath: null
};

module.exports = Display;
},{}],18:[function(require,module,exports){
AvatarSelectionView.constructor = AvatarSelectionView;
AvatarSelectionView.prototype = Object.create(View.prototype);

AvatarSelectionView.prototype.BACK_BUTTON = 0;
AvatarSelectionView.prototype.SELECT_UP = 1;
AvatarSelectionView.prototype.SELECT_DOWN = 2;
AvatarSelectionView.prototype.FIND_GAME = 3;


function AvatarSelectionView() {
    PIXI.Container.call(this);
}

AvatarSelectionView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.AVATAR_SELECTION;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.createBoardQuizText(commonData.BOARD_QUIZ);
    this.createBackButton(commonData.BACK_BUTTON);
    this.createSelectDownButton(layoutData.SELECT_DOWN);
    this.createSelectUpButton(layoutData.SELECT_UP);
    this.createFindGameButton(layoutData.FIND_GAME);
};

AvatarSelectionView.prototype.createBoardQuizText = function (data) {
    var boardQuizText = this.createTextElement(data);
    this.addElementToContainer(boardQuizText, data);
};

AvatarSelectionView.prototype.createBackButton = function (data) {
    this.backButton = this.createSpriteElement(data);
    this.addElementToContainer(this.backButton, data);
};

AvatarSelectionView.prototype.createSelectDownButton = function (data) {
    this.selectDownButton = this.createSpriteElement(data);
    this.addElementToContainer(this.selectDownButton, data);
};

AvatarSelectionView.prototype.createSelectUpButton = function (data) {
    this.selectUpButton = this.createSpriteElement(data);
    this.addElementToContainer(this.selectUpButton, data);
};

AvatarSelectionView.prototype.createFindGameButton = function (data) {
    this.findGameButton = this.createSpriteElement(data);
    this.addElementToContainer(this.findGameButton, data);
};

AvatarSelectionView.prototype.getInteractiveViewElements = function() {
    return [this.backButton, this.selectUpButton, this.selectDownButton, this.findGameButton];
};

AvatarSelectionView.prototype.cleanView = function() {
    this.removeAllElements();
};

module.exports = AvatarSelectionView;
},{}],19:[function(require,module,exports){
FindGameView.constructor = FindGameView;
FindGameView.prototype = Object.create(View.prototype);

function FindGameView() {
    PIXI.Container.call(this);
}

FindGameView.prototype.setupViewElements = function(avatar) {
    var layoutData = PIXI.Container.layoutData.FIND_GAME;
    var avatarData = PIXI.Container.layoutData.AVATAR;
    
    this.createFindGameCaption(layoutData.CAPTION);
    this.createPlayer1Avatar(avatarData[avatar], layoutData.PLAYER_1_AVATAR);
    this.createVersusText(layoutData.VERSUS);
    this.createPlayer2UnknownAvatar(avatarData.PLAYER_2_UNKNOWN, layoutData.PLAYER_2_AVATAR);
    this.createPlayer1Text(layoutData.PLAYER_1);
    this.createPlayer2Text(layoutData.PLAYER_2);
};

FindGameView.prototype.createFindGameCaption = function (data) {
    this.findGameCaption = this.createTextElement(data);
    this.addElementToContainer(this.findGameCaption, data);
};

FindGameView.prototype.createPlayer1Avatar = function (avatar, data) {
    var player1Avatar = this.createSpriteElement(avatar);
    this.addElementToContainer(player1Avatar, data);
};

FindGameView.prototype.createVersusText = function (data) {
    var versus = this.createTextElement(data);
    this.addElementToContainer(versus, data);
};

FindGameView.prototype.createPlayer2UnknownAvatar = function (avatar, data) {
    this.player2UnknownAvatar = this.createSpriteElement(avatar);
    this.addElementToContainer(this.player2UnknownAvatar, data);
};

FindGameView.prototype.createPlayer1Text = function (data) {
    var player1 = this.createTextElement(data);
    this.addElementToContainer(player1, data);
};

FindGameView.prototype.createPlayer2Text = function (data) {
    var player2 = this.createTextElement(data);
    this.addElementToContainer(player2, data);
};

FindGameView.prototype.createPlayer2ActualAvatar = function (avatar) {
    this.removeElement(this.player2UnknownAvatar);
    var player2UnknownAvatar = this.createSpriteElement(PIXI.Container.layoutData.AVATAR[avatar]);
    this.addElementToContainer(player2UnknownAvatar, PIXI.Container.layoutData.FIND_GAME.PLAYER_2_AVATAR);
};

FindGameView.prototype.createGameFoundCaption = function () {
    this.removeElement(this.findGameCaption);
    var foundGameCaption = this.createTextElement(PIXI.Container.layoutData.FIND_GAME.FOUND_GAME_CAPTION);
    this.addElementToContainer(foundGameCaption, PIXI.Container.layoutData.FIND_GAME.FOUND_GAME_CAPTION);
};

FindGameView.prototype.cleanView = function() {
    this.removeAllElements();
};

module.exports = FindGameView;
},{}],20:[function(require,module,exports){
HelpView.constructor = HelpView;
HelpView.prototype = Object.create(View.prototype);

HelpView.prototype.BACK_BUTTON = 0;

function HelpView() {
    PIXI.Container.call(this);
}

HelpView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.HELP;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.createHelpText(layoutData.INFO);
    this.createBackButton(commonData.BACK_BUTTON);
};

HelpView.prototype.createHelpText = function (data) {
    var helpText = this.createTextElement(data);
    this.addElementToContainer(helpText, data);
};

HelpView.prototype.createBackButton = function (data) {
    this.backButton = this.createSpriteElement(data);
    this.addElementToContainer(this.backButton, data);
};

HelpView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

module.exports = HelpView;
},{}],21:[function(require,module,exports){
MenuView.constructor = MenuView;
MenuView.prototype = Object.create(View.prototype);

MenuView.prototype.PLAY_BUTTON = 0;
MenuView.prototype.HELP_BUTTON = 1;

function MenuView() {
    PIXI.Container.call(this);
}

MenuView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.MENU;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.createBoardQuizText(commonData.BOARD_QUIZ);
    this.createPlayButton(layoutData.PLAY_BUTTON);
    this.createHelpButton(layoutData.HELP_BUTTON);
};

MenuView.prototype.createBoardQuizText = function (data) {
    var boardQuizText = this.createTextElement(data);
    this.addElementToContainer(boardQuizText, data);
};

MenuView.prototype.createPlayButton = function (data) {
    this.playButton = this.createSpriteElement(data);
    this.addElementToContainer(this.playButton, data);
};

MenuView.prototype.createHelpButton = function (data) {
    this.helpButton = this.createSpriteElement(data);
    this.addElementToContainer(this.helpButton, data);
};

MenuView.prototype.getInteractiveViewElements = function() {
    return [this.playButton, this.helpButton];
};

module.exports = MenuView;
},{}],22:[function(require,module,exports){
View.constructor = View;
View.prototype = Object.create(PIXI.Container.prototype);
View.prototype.INTERACTIVE = true;
View.prototype.CENTER_ANCHOR = 0.5;

function View() {
    PIXI.Container.call(this);
}

View.prototype.addElementToContainer = function(element, positionData) {
    this.setElementPosition(element, positionData);
    element.anchor.x = this.CENTER_ANCHOR;
    element.anchor.y = this.CENTER_ANCHOR;
    element.interactive = this.INTERACTIVE;
    this.addChild(element);
};

View.prototype.setElementPosition = function(element, positionData) {
    element.position.x = positionData.x;
    element.position.y = positionData.y;
};

View.prototype.createTextElement = function(data) {
    return new PIXI.Text(data.text, {font: data.size + "px " + data.font, fill: data.color});
};

View.prototype.createSpriteElement = function(data) {
    return new PIXI.Sprite.fromImage(data.path);
};

View.prototype.removeElement = function(element) {
    this.removeChild(element);
};

View.prototype.updateElement = function(element) {
    this.removeChild(element);
    this.addChild(element);
};

View.prototype.removeAllElements = function() {
    this.removeChildren();
};

module.exports = View;


},{}],23:[function(require,module,exports){
AvatarView.constructor = AvatarView;
AvatarView.prototype = Object.create(View.prototype);

AvatarView.prototype.BACK_BUTTON = 0;

function AvatarView() {
    PIXI.Container.call(this);
}

AvatarView.prototype.setupViewElements = function(avatarName) {
    var layoutData = PIXI.Container.layoutData.AVATAR;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.createAvatar(layoutData[avatarName]);
};

AvatarView.prototype.createAvatar = function (data) {
    var avatar = this.createSpriteElement(data);
    this.addElementToContainer(avatar, data);
};

module.exports = AvatarView;
},{}],24:[function(require,module,exports){
DiceView.constructor = DiceView;
DiceView.prototype = Object.create(View.prototype);

function DiceView() {
    PIXI.Container.call(this);
}

DiceView.prototype.setupDice = function(diceNumber) {
    var diceImage = PIXI.Container.layoutData.DICE[diceNumber];
    var dicePositionData = PIXI.Container.layoutData.DICE.COORDS;
    
    this.createDiceElement(diceImage, dicePositionData);
};

DiceView.prototype.createDiceElement = function(diceImage, dicePositionData) {
    this.diceElement = this.createSpriteElement(diceImage);
    this.addElementToContainer(this.diceElement, dicePositionData);
};

DiceView.prototype.cleanView = function() {
    this.removeAllElements();
};

module.exports = DiceView;
},{}],25:[function(require,module,exports){
PlayerView.constructor = PlayerView;
PlayerView.prototype = Object.create(View.prototype);

function PlayerView() {
    PIXI.Container.call(this);
}

PlayerView.prototype.setPlayerData = function(playerData) {
    this.playerData = playerData;
};

PlayerView.prototype.setupViewElements = function() {
    var playerLayoutData = PIXI.Container.layoutData.PLAYER;
    var avatarData = PIXI.Container.layoutData.AVATAR;
    
    this.createPlayer1Avatar(avatarData[this.playerData.player1Avatar], playerLayoutData.PLAYER_1_AVATAR);
    this.createPlayer1Health(playerLayoutData.PLAYER_1_HEALTH);
    
    this.createPlayer2Avatar(avatarData[this.playerData.player2Avatar], playerLayoutData.PLAYER_2_AVATAR);
    this.createPlayer2Health(playerLayoutData.PLAYER_2_HEALTH);
    
    this.createPlayer1Text(playerLayoutData.PLAYER_1_TEXT);
    this.createPlayer2Text(playerLayoutData.PLAYER_2_TEXT);
};

PlayerView.prototype.createPlayer1Avatar = function(avatar, avatarPosition) {
    this.player1Avatar = this.createSpriteElement(avatar);
    this.addElementToContainer(this.player1Avatar, avatarPosition);
};

PlayerView.prototype.createPlayer2Avatar = function(avatar, avatarPosition) {
    this.player1Avatar = this.createSpriteElement(avatar);
    this.addElementToContainer(this.player1Avatar, avatarPosition);
};

PlayerView.prototype.createPlayer1Health = function(healthData) {
    this.player1HealthText = this.createTextElement(healthData);
    this.addElementToContainer(this.player1HealthText, healthData);
};

PlayerView.prototype.createPlayer2Health = function(healthData) {
    this.player2HealthText = this.createTextElement(healthData);
    this.addElementToContainer(this.player2HealthText, healthData);
};

PlayerView.prototype.createPlayer1Text = function(playerData) {
    this.player1Text = this.createTextElement(playerData);
    this.addElementToContainer(this.player1Text, playerData);
};

PlayerView.prototype.createPlayer2Text = function(playerData) {
    this.player2Text = this.createTextElement(playerData);
    this.addElementToContainer(this.player2Text, playerData);
};

PlayerView.prototype.setPlayer1Health = function(health) {
    var player1HealthData = PIXI.Container.layoutData.PLAYER.PLAYER_1_HEALTH;
    this.player1HealthText.text = player1HealthData.text + health;
};

PlayerView.prototype.setPlayer2Health = function(health) {
    var player2HealthData = PIXI.Container.layoutData.PLAYER.PLAYER_2_HEALTH;
    this.player2HealthText.text = player2HealthData.text + health;
};

PlayerView.prototype.cleanView = function() {
    this.removeAllElements();
};

module.exports = PlayerView;
},{}],26:[function(require,module,exports){
QuestionView.constructor = QuestionView;
QuestionView.prototype = Object.create(View.prototype);

QuestionView.prototype.RIGHT_ANSWER = 0;
QuestionView.prototype.WRONG_ANSWER_1 = 1;
QuestionView.prototype.WRONG_ANSWER_2 = 2;
QuestionView.prototype.WRONG_ANSWER_3 = 3;

QuestionView.prototype.ANSWER_PREFIX = "ANSWER_";
QuestionView.prototype.ANSWERED_PREFIX = "ANSWERED_";
QuestionView.prototype.ANSWERED_SUFFIX = "_ANSWERED";

function QuestionView() {
    PIXI.Container.call(this);
}

QuestionView.prototype.displayCategoryAndQuestion = function(category, question) {
    var questionData = PIXI.Container.layoutData.QUESTION;
    this.createCategoryElement(category, PIXI.Container.layoutData.QUESTION.CATEGORY);
    this.createQuestionElement(question.text, PIXI.Container.layoutData.QUESTION.QUESTION_POSITION);
    this.createRightAnswerElement(question.right_answer, PIXI.Container.layoutData.QUESTION[this.ANSWER_PREFIX + this.answerIndices[0]]);
    this.createWrongAnswerElement1(question.wrong_answer_1, PIXI.Container.layoutData.QUESTION[this.ANSWER_PREFIX + this.answerIndices[1]]);
    this.createWrongAnswerElement2(question.wrong_answer_2, PIXI.Container.layoutData.QUESTION[this.ANSWER_PREFIX + this.answerIndices[2]]);
    this.createWrongAnswerElement3(question.wrong_answer_3, PIXI.Container.layoutData.QUESTION[this.ANSWER_PREFIX + this.answerIndices[3]]);
};

QuestionView.prototype.setAnswerIndices = function(answerIndices) {
    this.answerIndices = answerIndices;
};

QuestionView.prototype.createCategoryElement = function(category, categoryData) {
    categoryData.text = category;
    this.categoryElement = this.createTextElement(categoryData);
    this.addElementToContainer(this.categoryElement, categoryData);
};

QuestionView.prototype.createQuestionElement = function(question, questionData) {
    questionData.text = question;
    this.questionElement = this.createTextElement(questionData);
    this.addElementToContainer(this.questionElement, questionData);
};

QuestionView.prototype.createRightAnswerElement = function(answer, answerData) {
    answerData.text = answer;
    this.rightAnswer = this.createTextElement(answerData);
    this.addElementToContainer(this.rightAnswer, answerData);
};

QuestionView.prototype.createWrongAnswerElement1 = function(answer, answerData) {
    answerData.text = answer;
    this.wrongAnswer1 = this.createTextElement(answerData);
    this.addElementToContainer(this.wrongAnswer1, answerData);
};

QuestionView.prototype.createWrongAnswerElement2 = function(answer, answerData) {
    answerData.text = answer;
    this.wrongAnswer2 = this.createTextElement(answerData);
    this.addElementToContainer(this.wrongAnswer2, answerData);
};

QuestionView.prototype.createWrongAnswerElement3 = function(answer, answerData) {
    answerData.text = answer;
    this.wrongAnswer3 = this.createTextElement(answerData);
    this.addElementToContainer(this.wrongAnswer3, answerData);
};

QuestionView.prototype.setAnswerToColour = function(answerElement, answer) {
    var questionData = PIXI.Container.layoutData.QUESTION;
    var colours = {};
    for(var i = 2; i <= 4; i++) {
        colours[this.ANSWERED_PREFIX + i] = questionData.WRONG_ANSWER_COLOUR;
    }
    colours.ANSWERED_1 = questionData.RIGHT_ANSWER_COLOUR;
    var answerColour = colours[answer];
    answerElement.setStyle({font: answerElement.style.font, fill: answerColour});
};

QuestionView.prototype.setWhoAnsweredQuestion = function(answerElement, answer, player) {
    var questionData = PIXI.Container.layoutData.QUESTION;
    var answerOnScreen = (answer.slice(-1) - 1);
    this.playerWhoAnsweredElement = this.createTextElement(questionData[player + this.ANSWERED_SUFFIX]);
    this.addElementToContainer(this.playerWhoAnsweredElement, questionData[this.ANSWERED_PREFIX + this.answerIndices[answerOnScreen]]); 
};

QuestionView.prototype.turnOffInteractivityForAnswerElements = function() {
    this.rightAnswer.interactive = false;
    this.wrongAnswer1.interactive = false;
    this.wrongAnswer2.interactive = false;
    this.wrongAnswer3.interactive = false;
};

QuestionView.prototype.getInteractiveViewElements = function() {
    return [this.rightAnswer, this.wrongAnswer1, this.wrongAnswer2, this.wrongAnswer3];
};

QuestionView.prototype.cleanView = function() {
    this.removeAllElements();
};

module.exports = QuestionView;
},{}],27:[function(require,module,exports){
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
    var winText = this.createTextElement(data);
    this.addElementToContainer(winText, positionData);
};

WinView.prototype.createPlayerStatsText = function(layoutData, statData) {
    layoutData.PLAYER_1_CORRECT_PERCENTAGE.text = layoutData.PLAYER_1_CORRECT_PERCENTAGE.text + statData.player1CorrectAnswerPercentage;
    var player1CorrectAnswerPercentageText = this.createTextElement(layoutData.PLAYER_1_CORRECT_PERCENTAGE);
    this.addElementToContainer(player1CorrectAnswerPercentageText, layoutData.PLAYER_1_CORRECT_PERCENTAGE);
    
        layoutData.PLAYER_2_CORRECT_PERCENTAGE.text = layoutData.PLAYER_2_CORRECT_PERCENTAGE.text + statData.player2CorrectAnswerPercentage;
    var player2CorrectAnswerPercentageText = this.createTextElement(layoutData.PLAYER_2_CORRECT_PERCENTAGE);
    this.addElementToContainer(player2CorrectAnswerPercentageText, layoutData.PLAYER_2_CORRECT_PERCENTAGE);
};

WinView.prototype.createPlayAgainButton = function (data) {
    this.playAgainButton = this.createSpriteElement(data);
    this.addElementToContainer(this.playAgainButton, data);
};

WinView.prototype.getInteractiveViewElements = function() {
    return [this.playAgainButton];
};

module.exports = WinView;
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi5qcyIsInNyYy9Tb2NrZXRDb25zdGFudHMuanMiLCJzcmMvY29udHJvbGxlci9BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0ZpbmRHYW1lQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0dhbWVDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvSGVscENvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9NZW51Q29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1R1cm5Db250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9EaWNlQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUXVlc3Rpb25Db250cm9sbGVyLmpzIiwic3JjL2xvYWRlci9CdWNrZXRMb2FkZXIuanMiLCJzcmMvbG9hZGVyL0ltYWdlTG9hZGVyLmpzIiwic3JjL2xvYWRlci9Kc29uTG9hZGVyLmpzIiwic3JjL2xvYWRlci9WaWV3TG9hZGVyLmpzIiwic3JjL3V0aWwvRGlzcGxheS5qcyIsInNyYy92aWV3L0F2YXRhclNlbGVjdGlvblZpZXcuanMiLCJzcmMvdmlldy9GaW5kR2FtZVZpZXcuanMiLCJzcmMvdmlldy9IZWxwVmlldy5qcyIsInNyYy92aWV3L01lbnVWaWV3LmpzIiwic3JjL3ZpZXcvVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvQXZhdGFyVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvRGljZVZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1BsYXllclZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1F1ZXN0aW9uVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvV2luVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkRpc3BsYXkgPSByZXF1aXJlKCcuL3V0aWwvRGlzcGxheScpO1xuU29ja2V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9Tb2NrZXRDb25zdGFudHMnKTtcblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvVmlldycpO1xuQnVja2V0TG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvQnVja2V0TG9hZGVyJyk7XG5Kc29uTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvSnNvbkxvYWRlcicpO1xuSW1hZ2VMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9JbWFnZUxvYWRlcicpO1xuVmlld0xvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL1ZpZXdMb2FkZXInKTtcbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvQ29udHJvbGxlcicpO1xuSGVscFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvSGVscFZpZXcnKTtcbkhlbHBDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0hlbHBDb250cm9sbGVyJyk7XG5NZW51VmlldyA9IHJlcXVpcmUoJy4vdmlldy9NZW51VmlldycpO1xuTWVudUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvTWVudUNvbnRyb2xsZXInKTtcbkF2YXRhclNlbGVjdGlvblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvQXZhdGFyU2VsZWN0aW9uVmlldycpO1xuQXZhdGFyVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L0F2YXRhclZpZXcnKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcicpO1xuRmluZEdhbWVWaWV3ID0gcmVxdWlyZSgnLi92aWV3L0ZpbmRHYW1lVmlldycpO1xuRmluZEdhbWVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0ZpbmRHYW1lQ29udHJvbGxlcicpO1xuR2FtZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvR2FtZUNvbnRyb2xsZXInKTtcbkRpY2VWaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvRGljZVZpZXcnKTtcbkRpY2VDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvRGljZUNvbnRyb2xsZXInKTtcblF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L1F1ZXN0aW9uVmlldycpO1xuUXVlc3Rpb25Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUXVlc3Rpb25Db250cm9sbGVyJyk7XG5QbGF5ZXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvUGxheWVyVmlldycpO1xuUGxheWVyQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9zdWJjb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXInKTtcbldpblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9XaW5WaWV3Jyk7XG5UdXJuQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9UdXJuQ29udHJvbGxlcicpO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgdmFyIERFRkFVTFRfV0lEVEggPSA0ODA7XG4gICAgdmFyIERFRkFVTFRfSEVJR0hUID0gMzIwO1xuICAgIHZhciBSRU5ERVJFUl9CQUNLR1JPVU5EX0NPTE9VUiA9IDB4MzMzMzMzO1xuICAgIHZhciBESVZfSUQgPSBcImdhbWVcIjtcbiAgICBcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIG5ldyBCdWNrZXRMb2FkZXIobG9hZExheW91dCwgYnVja2V0TG9hZGluZ0ZhaWxlZE1lc3NhZ2UpO1xuICAgIH0pKCk7XG4gICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRMYXlvdXQoKSB7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKCcuL3Jlc291cmNlLycgKyBEaXNwbGF5LmJ1Y2tldC53aWR0aCArICd4JyArIERpc3BsYXkuYnVja2V0LmhlaWdodCArICcvbGF5b3V0Lmpzb24nLCBzZXRMYXlvdXREYXRhSW5QSVhJKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0TGF5b3V0RGF0YUluUElYSShsYXlvdXREYXRhKSB7XG4gICAgICAgIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEgPSBsYXlvdXREYXRhO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS9xdWVzdGlvbnMuanNvbicsIHNldFF1ZXN0aW9uRGF0YUluUXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0UXVlc3Rpb25EYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIocXVlc3Rpb25EYXRhKSB7XG4gICAgICAgIFF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUucXVlc3Rpb25EYXRhID0gcXVlc3Rpb25EYXRhO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS9jYXRlZ29yaWVzLmpzb24nLCBzZXRDYXRlZ29yeURhdGFJblF1ZXN0aW9uQ29udHJvbGxlcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldENhdGVnb3J5RGF0YUluUXVlc3Rpb25Db250cm9sbGVyKGNhdGVnb3J5RGF0YSkge1xuICAgICAgICBRdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNhdGVnb3J5RGF0YSA9IGNhdGVnb3J5RGF0YTtcbiAgICAgICAgbG9hZEltYWdlcygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKCkge1xuICAgICAgICBuZXcgSW1hZ2VMb2FkZXIoJy4vcmVzb3VyY2UvaW1hZ2VzLmpzb24nLCBzdGFydFJlbmRlcmluZyk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHN0YXJ0UmVuZGVyaW5nKCkge1xuICAgICAgICB2YXIgdmlld0xvYWRlciA9IG5ldyBWaWV3TG9hZGVyKCk7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgICAgICAgY29udGFpbmVyLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdmFyIHJlbmRlcmVyID0gbmV3IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKERpc3BsYXkuYnVja2V0LndpZHRoLCBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5iYWNrZ3JvdW5kQ29sb3IgPSBSRU5ERVJFUl9CQUNLR1JPVU5EX0NPTE9VUjtcbiAgICAgICAgc2V0RGVwZW5kZW5jaWVzKHZpZXdMb2FkZXIsIGNvbnRhaW5lciwgcmVuZGVyZXIpO1xuICAgICAgICBhcHBlbmRHYW1lVG9ET00ocmVuZGVyZXIpO1xuICAgICAgICBiZWdpbkFuaW1hdGlvbih2aWV3TG9hZGVyKTtcbiAgICAgICAgYmVnaW5HYW1lKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFwcGVuZEdhbWVUb0RPTShyZW5kZXJlcikge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChESVZfSUQpLmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXREZXBlbmRlbmNpZXModmlld0xvYWRlciwgY29udGFpbmVyLCByZW5kZXJlcikge1xuICAgICAgICB2aWV3TG9hZGVyLnNldENvbnRhaW5lcihjb250YWluZXIpO1xuICAgICAgICB2aWV3TG9hZGVyLnNldFJlbmRlcmVyKHJlbmRlcmVyKTtcbiAgICAgICAgQ29udHJvbGxlci5zZXRWaWV3TG9hZGVyKHZpZXdMb2FkZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBiZWdpbkFuaW1hdGlvbih2aWV3TG9hZGVyKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh2aWV3TG9hZGVyLmFuaW1hdGUpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBiZWdpbkdhbWUoKSB7XG4gICAgICAgIHZhciBtZW51Q29udHJvbGxlciA9IG5ldyBNZW51Q29udHJvbGxlcigpOyBcbiAgICB9XG4gICAgICAgIFxuICAgIGZ1bmN0aW9uIGJ1Y2tldExvYWRpbmdGYWlsZWRNZXNzYWdlKCkge1xuICAgICAgICBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQgPSBERUZBVUxUX0hFSUdIVDtcbiAgICAgICAgRGlzcGxheS5idWNrZXQud2lkdGggPSBERUZBVUxUX1dJRFRIO1xuICAgICAgICBEaXNwbGF5LnNjYWxlID0gMTtcbiAgICAgICAgRGlzcGxheS5yZXNvdXJjZVBhdGggPSBERUZBVUxUX1dJRFRIICsgJ3gnICsgREVGQVVMVF9IRUlHSFQ7XG4gICAgfVxufTsiLCJ2YXIgU29ja2V0Q29uc3RhbnRzID0ge1xuICAgICdvbicgOiB7XG4gICAgICAgICdQTEFZRVJTX0hFQUxUSCcgOiAncGxheWVycy1oZWFsdGgnLFxuICAgICAgICAnRElDRV9OVU1CRVInIDogJ2RpY2UtbnVtYmVyJyxcbiAgICAgICAgJ1JBTkRPTV9RVUVTVElPTicgOiAncmFuZG9tLXF1ZXN0aW9uJyxcbiAgICAgICAgJ0lOSVRfTkVXX1RVUk4nIDogJ2luaXQtbmV3LXR1cm4nLFxuICAgICAgICAnREFNQUdFX0RFQUxUJyA6ICdkYW1hZ2UtZGVhbHQnLFxuICAgICAgICAnU0hVRkZMRURfQU5TV0VSX0lORElDRVMnIDogJ3NodWZmbGVkLWFuc3dlci1pbmRpY2VzJyxcbiAgICAgICAgJ0dBTUVfRk9VTkQnIDogJ2dhbWUtZm91bmQnLFxuICAgICAgICAnR0FNRV9TVEFUUycgOiAnZ2FtZS1zdGF0cydcbiAgICB9LFxuICAgIFxuICAgICdlbWl0JyA6IHtcbiAgICAgICAgJ0NPTk5FQ1RJT04nIDogJ2Nvbm5lY3Rpb24nLFxuICAgICAgICAnRklORElOR19HQU1FJyA6ICdmaW5kaW5nLWdhbWUnLFxuICAgICAgICAnR0VUX1BMQVlFUlNfSEVBTFRIJyA6ICdnZXQtcGxheWVycy1oZWFsdGgnLFxuICAgICAgICAnRElTQ09OTkVDVCcgOiAnZGlzY29ubmVjdCcsXG4gICAgICAgICdST0xMX0RJQ0UnIDogJ3JvbGwtZGljZScsXG4gICAgICAgICdHRVRfUkFORE9NX1FVRVNUSU9OJyA6ICdnZXQtcmFuZG9tLXF1ZXN0aW9uJyxcbiAgICAgICAgJ05FV19UVVJOJyA6ICduZXctdHVybicsXG4gICAgICAgICdERUFMX0RBTUFHRScgOiAnZGVhbC1kYW1hZ2UnLFxuICAgICAgICAnU0hVRkZMRV9BTlNXRVJfSU5ESUNFUycgOiAnc2h1ZmZsZS1hbnN3ZXItaW5kaWNlcycsXG4gICAgICAgICdHQU1FX0VOREVEJyA6ICdnYW1lLWVuZGVkJ1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU29ja2V0Q29uc3RhbnRzOyIsIkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgQXZhdGFyU2VsZWN0aW9uVmlldygpO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2VsZWN0ZWRBdmF0YXJWaWV3ID0gbmV3IEF2YXRhclZpZXcoKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmF2YXRhcnMgPSBbJ0VNT0pJX0NSWScsICdFTU9KSV9BTkdSWSddO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY3VycmVudEF2YXRhckluZGV4ID0gMDtcblxuZnVuY3Rpb24gQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLmxvYWRWaWV3KCk7XG59XG5cbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKCk7XG4gICAgdGhpcy5zZWxlY3RlZEF2YXRhclZpZXcuc2V0dXBWaWV3RWxlbWVudHModGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XSk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3KTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBiYWNrQnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5CQUNLX0JVVFRPTl07XG4gICAgdmFyIHNlbGVjdFVwID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5TRUxFQ1RfVVBdO1xuICAgIHZhciBzZWxlY3REb3duID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5TRUxFQ1RfRE9XTl07XG4gICAgdmFyIGZpbmRHYW1lID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5GSU5EX0dBTUVdO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gbmV3IE1lbnVDb250cm9sbGVyKCk7XG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHNlbGVjdFVwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIFVQID0gMTtcbiAgICAgICAgdGhpcy5zZXR1cE5leHRBdmF0YXIoVVApO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoc2VsZWN0RG93biwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBET1dOID0gLTE7XG4gICAgICAgIHRoaXMuc2V0dXBOZXh0QXZhdGFyKERPV04pO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoZmluZEdhbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXZhdGFyID0gdGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XTtcbiAgICAgICAgdmFyIGZpbmRHYW1lQ29udHJvbGxlciA9IG5ldyBGaW5kR2FtZUNvbnRyb2xsZXIoYXZhdGFyKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBOZXh0QXZhdGFyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgaWYodGhpcy5jdXJyZW50QXZhdGFySW5kZXggPj0gKHRoaXMuYXZhdGFycy5sZW5ndGggLSAxKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCA9IDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCArIGRpcmVjdGlvbiA8IDApIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXZhdGFySW5kZXggPSAodGhpcy5hdmF0YXJzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3VycmVudEF2YXRhckluZGV4ID0gdGhpcy5jdXJyZW50QXZhdGFySW5kZXggKyBkaXJlY3Rpb247XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3LnNldHVwVmlld0VsZW1lbnRzKHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF0pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gQ29udHJvbGxlcigpIHt9XG5cbkNvbnRyb2xsZXIuc2V0Vmlld0xvYWRlciA9IGZ1bmN0aW9uKHZpZXdMb2FkZXIpIHtcbiAgICBDb250cm9sbGVyLnByb3RvdHlwZS52aWV3TG9hZGVyID0gdmlld0xvYWRlcjtcbn07XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnNvY2tldCA9IGlvKCk7XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTGlzdGVuZXIgPSBmdW5jdGlvbih2aWV3RWxlbWVudCwgYWN0aW9uKSB7XG4gICAgdmlld0VsZW1lbnQudG91Y2hlbmQgPSB2aWV3RWxlbWVudC5jbGljayA9IGFjdGlvbjtcbn07XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTXVsdGlwbGVMaXN0ZW5lcnMgPSBmdW5jdGlvbih2aWV3RWxlbWVudHMsIGFjdGlvbikge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2aWV3RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHZpZXdFbGVtZW50c1tpXSwgYWN0aW9uKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7IiwiRmluZEdhbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gRmluZEdhbWVDb250cm9sbGVyO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEZpbmRHYW1lVmlldygpO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5hdmF0YXIgPSBudWxsO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5UUkFOU0lUSU9OX1RPX0dBTUVfVElNRSA9IDMwMDA7XG5cbmZ1bmN0aW9uIEZpbmRHYW1lQ29udHJvbGxlcihhdmF0YXIpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLmF2YXRhciA9IGF2YXRhcjtcbiAgICB0aGlzLmxvYWRWaWV3KCk7XG59XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHModGhpcy5hdmF0YXIpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBTZXJ2ZXJJbnRlcmFjdGlvbigpO1xufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cFNlcnZlckludGVyYWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkdBTUVfRk9VTkQsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5hc3NpZ25BdmF0YXJzKHBsYXllckRhdGEpO1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlR2FtZUZvdW5kQ2FwdGlvbigpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgICAgICAgICB2YXIgcGxheWVyQ29udHJvbGxlciA9IG5ldyBQbGF5ZXJDb250cm9sbGVyKHBsYXllckRhdGEpO1xuICAgICAgICAgICAgdmFyIGRpY2VDb250cm9sbGVyID0gbmV3IERpY2VDb250cm9sbGVyKCk7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25Db250cm9sbGVyID0gbmV3IFF1ZXN0aW9uQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyKTtcbiAgICAgICAgICAgIHZhciB0dXJuQ29udHJvbGxlciA9IG5ldyBUdXJuQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCB0aGlzLlRSQU5TSVRJT05fVE9fR0FNRV9USU1FKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuRklORElOR19HQU1FLCB7YXZhdGFyOiB0aGlzLmF2YXRhcn0pO1xufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5hc3NpZ25BdmF0YXJzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBzb2NrZXRJZFByZWZpeCA9IFwiLyNcIjtcbiAgICB2YXIgc29ja2V0SWQgPSBzb2NrZXRJZFByZWZpeCArIHRoaXMuc29ja2V0LmlkO1xuICAgIGlmKGRhdGEucGxheWVyMUlkID09PSBzb2NrZXRJZCkge1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhcihkYXRhLnBsYXllcjJBdmF0YXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldy5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyKGRhdGEucGxheWVyMUF2YXRhcik7XG4gICAgfVxufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmluZEdhbWVDb250cm9sbGVyOyIsIkdhbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gR2FtZUNvbnRyb2xsZXI7XG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gR2FtZUNvbnRyb2xsZXIocGxheWVyRGF0YSkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbn1cblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldFBsYXllckRhdGEgPSBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXllckRhdGEgPSBwbGF5ZXJEYXRhO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldERpY2VOdW1iZXIgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmRpY2VOdW1iZXIgPSBkaWNlTnVtYmVyO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmlzUGxheWVyMSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzb2NrZXRQcmVmaXggPSBcIi8jXCI7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyRGF0YS5wbGF5ZXIxSWQgPT09IChzb2NrZXRQcmVmaXggKyBHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc29ja2V0LmlkKTtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5nZXRQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pc1BsYXllcjEodGhpcy5wbGF5ZXJEYXRhKSA/IFwiUExBWUVSXzFcIiA6IFwiUExBWUVSXzJcIjtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5nZXRPcHBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlzUGxheWVyMSh0aGlzLnBsYXllckRhdGEpID8gXCJQTEFZRVJfMlwiIDogXCJQTEFZRVJfMVwiO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lQ29udHJvbGxlcjsiLCJIZWxwQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEhlbHBDb250cm9sbGVyO1xuSGVscENvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBIZWxwVmlldygpO1xuXG5mdW5jdGlvbiBIZWxwQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5sb2FkVmlldygpO1xufVxuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgYmFja0J1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuQkFDS19CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gbmV3IE1lbnVDb250cm9sbGVyKCk7XG4gICAgfSk7XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBDb250cm9sbGVyOyIsIk1lbnVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gTWVudUNvbnRyb2xsZXI7XG5NZW51Q29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IE1lbnVWaWV3KCk7XG5cbmZ1bmN0aW9uIE1lbnVDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmxvYWRWaWV3KCk7XG59XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbn07XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBwbGF5QnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5QTEFZX0JVVFRPTl07XG4gICAgdmFyIGhlbHBCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LkhFTFBfQlVUVE9OXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIocGxheUJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gbmV3IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIoKTtcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoaGVscEJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWxwQ29udHJvbGxlciA9IG5ldyBIZWxwQ29udHJvbGxlcigpO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51Q29udHJvbGxlcjsiLCJUdXJuQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IFR1cm5Db250cm9sbGVyO1xuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBUdXJuQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlciA9IGRpY2VDb250cm9sbGVyO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyID0gcXVlc3Rpb25Db250cm9sbGVyO1xuICAgIHRoaXMud2luVmlldyA9IG5ldyBXaW5WaWV3KCk7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIHRoaXMubmV3VHVybigpO1xufVxuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uSU5JVF9ORVdfVFVSTiwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGggPT09IDApIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdBTUVfRU5ERUQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5HQU1FX1NUQVRTLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFdpblZpZXcoXCJQTEFZRVJfMlwiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoID09PSAwKSB7XG4gICAgICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HQU1FX0VOREVEKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uR0FNRV9TVEFUUywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRXaW5WaWV3KFwiUExBWUVSXzFcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubmV3VHVybigpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5sb2FkV2luVmlldyA9IGZ1bmN0aW9uKHBsYXllciwgZGF0YSkge1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy53aW5WaWV3LmNyZWF0ZVdpbm5lclRleHQocGxheWVyLCBkYXRhKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy53aW5WaWV3KTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLndpblZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBwbGF5QWdhaW5CdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy53aW5WaWV3LlBMQVlfQUdBSU5fQlVUVE9OXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIocGxheUFnYWluQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB0aGlzLmRpY2VDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICAgICAgdmFyIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSBuZXcgQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcigpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUubmV3VHVybiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5yb2xsRGljZSgpO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmxvYWRWaWV3KCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuY2hlY2tQbGF5ZXJzSGVhbHRoID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUExBWUVSU19IRUFMVEgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUdXJuQ29udHJvbGxlcjsiLCJEaWNlQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IERpY2VDb250cm9sbGVyO1xuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgRGljZVZpZXcoKTtcblxuZnVuY3Rpb24gRGljZUNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkRJQ0VfTlVNQkVSLCBmdW5jdGlvbihkaWNlKSB7XG4gICAgICAgIHRoaXMubG9hZERpY2UoZGljZS5udW1iZXIpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUucm9sbERpY2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuUk9MTF9ESUNFKTtcbiAgICB9XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUubG9hZERpY2UgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgdGhpcy52aWV3LnNldHVwRGljZShkaWNlTnVtYmVyKTtcbiAgICB0aGlzLnNldERpY2VOdW1iZXIoZGljZU51bWJlcik7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpY2VDb250cm9sbGVyOyIsIlBsYXllckNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBQbGF5ZXJDb250cm9sbGVyO1xuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IFBsYXllclZpZXcoKTtcblxuZnVuY3Rpb24gUGxheWVyQ29udHJvbGxlcihwbGF5ZXJEYXRhKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuc2V0UGxheWVyRGF0YShwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG59XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3LnNldFBsYXllckRhdGEodGhpcy5wbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBsYXllcnNIZWFsdGgoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlBMQVlFUlNfSEVBTFRILCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRQbGF5ZXIxSGVhbHRoKHBsYXllckRhdGEucGxheWVyMUhlYWx0aCk7XG4gICAgICAgIHRoaXMudmlldy5zZXRQbGF5ZXIySGVhbHRoKHBsYXllckRhdGEucGxheWVyMkhlYWx0aCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVBsYXllcnNIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9QTEFZRVJTX0hFQUxUSCk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyQ29udHJvbGxlcjsiLCJRdWVzdGlvbkNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBRdWVzdGlvbkNvbnRyb2xsZXI7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IFF1ZXN0aW9uVmlldygpO1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzEgPSAnQU5TV0VSRURfMSc7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzIgPSAnQU5TV0VSRURfMic7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzMgPSAnQU5TV0VSRURfMyc7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzQgPSAnQU5TV0VSRURfNCc7XG5cbmZ1bmN0aW9uIFF1ZXN0aW9uQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlJBTkRPTV9RVUVTVElPTiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gZGF0YS5xdWVzdGlvbjtcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGRhdGEuY2F0ZWdvcnk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uREFNQUdFX0RFQUxULCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJUb0NvbG91cih0aGlzLmFuc3dlcnNbcGxheWVyRGF0YS5hbnN3ZXJdLCBwbGF5ZXJEYXRhLmFuc3dlcik7XG4gICAgICAgIHRoaXMudmlldy5zZXRXaG9BbnN3ZXJlZFF1ZXN0aW9uKHRoaXMuYW5zd2Vyc1twbGF5ZXJEYXRhLmFuc3dlcl0sIHBsYXllckRhdGEuYW5zd2VyLCBwbGF5ZXJEYXRhLnBsYXllcl93aG9fYW5zd2VyZWQpO1xuICAgICAgICB0aGlzLnZpZXcudHVybk9mZkludGVyYWN0aXZpdHlGb3JBbnN3ZXJFbGVtZW50cygpO1xuICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIudXBkYXRlUGxheWVyc0hlYWx0aCgpO1xuICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0Lk5FV19UVVJOKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlNIVUZGTEVEX0FOU1dFUl9JTkRJQ0VTLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJJbmRpY2VzKGRhdGEpO1xuICAgICAgICB0aGlzLnZpZXcuZGlzcGxheUNhdGVnb3J5QW5kUXVlc3Rpb24odGhpcy5jYXRlZ29yeSwgdGhpcy5xdWVzdGlvbik7XG4gICAgICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdldFJhbmRvbVF1ZXN0aW9uKCk7XG4gICAgdGhpcy5zaHVmZmxlQW5zd2VySW5kaWNlcygpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5nZXRSYW5kb21RdWVzdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdmFyIGNhdGVnb3JpZXMgPSB0aGlzLmNhdGVnb3J5RGF0YS5DQVRFR09SSUVTO1xuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5xdWVzdGlvbkRhdGEuQ0FURUdPUklFUztcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUkFORE9NX1FVRVNUSU9OLCB7Y2F0ZWdvcmllczogY2F0ZWdvcmllcywgcXVlc3Rpb25zOiBxdWVzdGlvbnN9KTtcbiAgICB9XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuc3dlcnMgPSB0aGlzLmdldFZpZXdBbnN3ZXJzKCk7XG4gICAgdGhpcy5zZXRSaWdodEFuc3dlckxpc3RlbmVyKGFuc3dlcnMpO1xuICAgIHRoaXMuc2V0V3JvbmdBbnN3ZXJMaXN0ZW5lcnMoYW5zd2Vycyk7XG4gICAgdGhpcy5zZXRBbnN3ZXJVcGRhdGVMaXN0ZW5lcihhbnN3ZXJzKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0Vmlld0Fuc3dlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7XG4gICAgdmFyIGFuc3dlcnMgPSB7fTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzEgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlJJR0hUX0FOU1dFUl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8yID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMV07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8zID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF80ID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfM107XG4gICAgcmV0dXJuIGFuc3dlcnM7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFJpZ2h0QW5zd2VyTGlzdGVuZXIgPSBmdW5jdGlvbihhbnN3ZXJzKSB7XG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfMSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZW1pdERlYWxEYW1hZ2VUb09wcG9uZW50VG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8xKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXRXcm9uZ0Fuc3dlckxpc3RlbmVycyA9IGZ1bmN0aW9uKGFuc3dlcnMpIHtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF8yLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0KHRoaXMuQU5TV0VSRURfMik7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF8zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0KHRoaXMuQU5TV0VSRURfMyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF80LCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0KHRoaXMuQU5TV0VSRURfNCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2h1ZmZsZUFuc3dlckluZGljZXMgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5TSFVGRkxFX0FOU1dFUl9JTkRJQ0VTLCB7aW5kaWNlczogWzEsMiwzLDRdfSk7XG4gICAgfVxufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXRBbnN3ZXJVcGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uKGFuc3dlcnMpIHtcbiAgICB0aGlzLmFuc3dlcnMgPSBhbnN3ZXJzO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5lbWl0RGVhbERhbWFnZVRvT3Bwb25lbnRUb1NvY2tldCA9IGZ1bmN0aW9uKGFuc3dlcikge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuREVBTF9EQU1BR0UsIHtwbGF5ZXJfd2hvX2Fuc3dlcmVkOiB0aGlzLmdldFBsYXllcigpLCBwbGF5ZXJfdG9fZGFtYWdlOiB0aGlzLmdldE9wcG9uZW50KCksIGRhbWFnZTogdGhpcy5kaWNlTnVtYmVyLCBhbnN3ZXI6IGFuc3dlciwgYW5zd2VyU3RhdHVzOiAnY29ycmVjdCcsIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5fSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQgPSBmdW5jdGlvbihhbnN3ZXIpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkRFQUxfREFNQUdFLCB7cGxheWVyX3dob19hbnN3ZXJlZDogdGhpcy5nZXRQbGF5ZXIoKSwgcGxheWVyX3RvX2RhbWFnZTogdGhpcy5nZXRQbGF5ZXIoKSwgZGFtYWdlOiB0aGlzLmRpY2VOdW1iZXIsIGFuc3dlcjogYW5zd2VyLCBhbnN3ZXJTdGF0dXM6ICdpbmNvcnJlY3QnLCBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeX0pO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25Db250cm9sbGVyOyIsImZ1bmN0aW9uIEJ1Y2tldExvYWRlciAoY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgUE9SVFJBSVQgPSBcInBvcnRyYWl0XCIsXG4gICAgICAgIExBTkRTQ0FQRSA9IFwibGFuZHNjYXBlXCIsXG4gICAgICAgIEJVQ0tFVF9TSVpFX0pTT05fUEFUSCA9IFwicmVzb3VyY2UvYnVja2V0X3NpemVzLmpzb25cIjtcblxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKEJVQ0tFVF9TSVpFX0pTT05fUEFUSCwgY2FsY3VsYXRlQmVzdEJ1Y2tldCk7XG4gICAgfSkoKTtcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVNjYWxlICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGguZmxvb3Iod2luZG93LmRldmljZVBpeGVsUmF0aW8pLCAyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVCZXN0QnVja2V0IChidWNrZXREYXRhKSB7XG4gICAgICAgIHZhciBvcmllbnRhdGlvbiA9IGNhbGN1bGF0ZU9yaWVudGF0aW9uKCk7XG4gICAgICAgIGJ1Y2tldERhdGFbb3JpZW50YXRpb25dLmZvckVhY2goZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgICAgICAgICAgaWYgKGJ1Y2tldC5oZWlnaHQgPD0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgRGlzcGxheS5idWNrZXQgPSBidWNrZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIERpc3BsYXkuc2NhbGUgPSBjYWxjdWxhdGVTY2FsZSh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgIERpc3BsYXkucmVzb3VyY2VQYXRoID0gRGlzcGxheS5idWNrZXQud2lkdGggKyAneCcgKyBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQ7XG4gICAgICAgIGV4ZWN1dGVDYWxsYmFjaygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVPcmllbnRhdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFBPUlRSQUlUO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIExBTkRTQ0FQRTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWN1dGVDYWxsYmFjayAoKSB7XG4gICAgICAgIGlmIChEaXNwbGF5LmJ1Y2tldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWNrZXRMb2FkZXI7IiwidmFyIEltYWdlTG9hZGVyID0gZnVuY3Rpb24oaW1hZ2VKc29uUGF0aCwgY2FsbGJhY2spIHtcbiAgICB2YXIganNvbkxvYWRlciA9IG5ldyBKc29uTG9hZGVyKGltYWdlSnNvblBhdGgsIGxvYWRJbWFnZXMpO1xuICAgIHZhciBpbWFnZXNMb2FkZWQgPSAwO1xuICAgIHZhciB0b3RhbEltYWdlcyA9IDA7XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlcyhpbWFnZURhdGEpIHtcbiAgICAgICAgdmFyIGltYWdlcyA9IGltYWdlRGF0YS5JTUFHRVM7XG4gICAgICAgIGNvdW50TnVtYmVyT2ZJbWFnZXMoaW1hZ2VzKTtcbiAgICAgICAgZm9yKHZhciBpbWFnZSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIGxvYWRJbWFnZShpbWFnZXNbaW1hZ2VdLnBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZShpbWFnZVBhdGgpIHtcbiAgICAgICAgdmFyIFJFUVVFU1RfRklOSVNIRUQgPSA0O1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBpbWFnZVBhdGgsIHRydWUpO1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gUkVRVUVTVF9GSU5JU0hFRCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbmlzaGVkIGxvYWRpbmcgaW1hZ2UgcGF0aDogXCIgKyBpbWFnZVBhdGgpO1xuICAgICAgICAgICAgICBpbWFnZXNMb2FkZWQrKztcbiAgICAgICAgICAgICAgY2hlY2tJZkFsbEltYWdlc0xvYWRlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY291bnROdW1iZXJPZkltYWdlcyhpbWFnZXMpIHtcbiAgICAgICAgZm9yKHZhciBpbWFnZSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIHRvdGFsSW1hZ2VzKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY2hlY2tJZkFsbEltYWdlc0xvYWRlZCgpIHtcbiAgICAgICAgaWYoaW1hZ2VzTG9hZGVkID09PSB0b3RhbEltYWdlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbGwgaW1hZ2VzIGxvYWRlZCFcIik7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJPbmx5IFwiICsgaW1hZ2VzTG9hZGVkICsgXCIgYXJlIGxvYWRlZC5cIik7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlTG9hZGVyOyIsInZhciBKc29uTG9hZGVyID0gZnVuY3Rpb24gKHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICBSRVFVRVNUX0ZJTklTSEVEID0gNDtcbiAgICAoZnVuY3Rpb24gbG9hZEpzb24oKSB7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm92ZXJyaWRlTWltZVR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpO1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gUkVRVUVTVF9GSU5JU0hFRCkge1xuICAgICAgICAgICAgdGhhdC5kYXRhID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIGNhbGxiYWNrKHRoYXQuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhhdC5kYXRhO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSnNvbkxvYWRlcjtcbiIsImZ1bmN0aW9uIFZpZXdMb2FkZXIoKSB7fVxuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyLmFkZENoaWxkKHZpZXcpO1xuICAgIGNvbnNvbGUubG9nKHZpZXcpO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUucmVtb3ZlQWxsVmlld3MgPSBmdW5jdGlvbigpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyLnJlbW92ZUNoaWxkcmVuKCk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5yZW1vdmVWaWV3ID0gZnVuY3Rpb24odmlldykge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIucmVtb3ZlQ2hpbGQodmlldyk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5zZXRSZW5kZXJlciA9IGZ1bmN0aW9uKHJlbmRlcmVyKSB7XG4gICAgVmlld0xvYWRlci5wcm90b3R5cGUucmVuZGVyZXIgPSByZW5kZXJlcjtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnNldENvbnRhaW5lciA9IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIgPSBjb250YWluZXI7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgVmlld0xvYWRlci5wcm90b3R5cGUucmVuZGVyZXIucmVuZGVyKFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShWaWV3TG9hZGVyLnByb3RvdHlwZS5hbmltYXRlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlld0xvYWRlcjsiLCJ2YXIgRGlzcGxheSA9IHtcbiAgICBidWNrZXQ6IG51bGwsXG4gICAgc2NhbGU6IG51bGwsXG4gICAgcmVzb3VyY2VQYXRoOiBudWxsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BsYXk7IiwiQXZhdGFyU2VsZWN0aW9uVmlldy5jb25zdHJ1Y3RvciA9IEF2YXRhclNlbGVjdGlvblZpZXc7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5TRUxFQ1RfVVAgPSAxO1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuU0VMRUNUX0RPV04gPSAyO1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuRklORF9HQU1FID0gMztcblxuXG5mdW5jdGlvbiBBdmF0YXJTZWxlY3Rpb25WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkFWQVRBUl9TRUxFQ1RJT047XG4gICAgdmFyIGNvbW1vbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkNPTU1PTjtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZUJvYXJkUXVpelRleHQoY29tbW9uRGF0YS5CT0FSRF9RVUlaKTtcbiAgICB0aGlzLmNyZWF0ZUJhY2tCdXR0b24oY29tbW9uRGF0YS5CQUNLX0JVVFRPTik7XG4gICAgdGhpcy5jcmVhdGVTZWxlY3REb3duQnV0dG9uKGxheW91dERhdGEuU0VMRUNUX0RPV04pO1xuICAgIHRoaXMuY3JlYXRlU2VsZWN0VXBCdXR0b24obGF5b3V0RGF0YS5TRUxFQ1RfVVApO1xuICAgIHRoaXMuY3JlYXRlRmluZEdhbWVCdXR0b24obGF5b3V0RGF0YS5GSU5EX0dBTUUpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQm9hcmRRdWl6VGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGJvYXJkUXVpelRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGJvYXJkUXVpelRleHQsIGRhdGEpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQmFja0J1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5iYWNrQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYmFja0J1dHRvbiwgZGF0YSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVTZWxlY3REb3duQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnNlbGVjdERvd25CdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5zZWxlY3REb3duQnV0dG9uLCBkYXRhKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZVNlbGVjdFVwQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnNlbGVjdFVwQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuc2VsZWN0VXBCdXR0b24sIGRhdGEpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlRmluZEdhbWVCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuZmluZEdhbWVCdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5maW5kR2FtZUJ1dHRvbiwgZGF0YSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5iYWNrQnV0dG9uLCB0aGlzLnNlbGVjdFVwQnV0dG9uLCB0aGlzLnNlbGVjdERvd25CdXR0b24sIHRoaXMuZmluZEdhbWVCdXR0b25dO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdmF0YXJTZWxlY3Rpb25WaWV3OyIsIkZpbmRHYW1lVmlldy5jb25zdHJ1Y3RvciA9IEZpbmRHYW1lVmlldztcbkZpbmRHYW1lVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gRmluZEdhbWVWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICB2YXIgbGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRklORF9HQU1FO1xuICAgIHZhciBhdmF0YXJEYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5BVkFUQVI7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVGaW5kR2FtZUNhcHRpb24obGF5b3V0RGF0YS5DQVBUSU9OKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFBdmF0YXIoYXZhdGFyRGF0YVthdmF0YXJdLCBsYXlvdXREYXRhLlBMQVlFUl8xX0FWQVRBUik7XG4gICAgdGhpcy5jcmVhdGVWZXJzdXNUZXh0KGxheW91dERhdGEuVkVSU1VTKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJVbmtub3duQXZhdGFyKGF2YXRhckRhdGEuUExBWUVSXzJfVU5LTk9XTiwgbGF5b3V0RGF0YS5QTEFZRVJfMl9BVkFUQVIpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMVRleHQobGF5b3V0RGF0YS5QTEFZRVJfMSk7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIyVGV4dChsYXlvdXREYXRhLlBMQVlFUl8yKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlRmluZEdhbWVDYXB0aW9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmZpbmRHYW1lQ2FwdGlvbiA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5maW5kR2FtZUNhcHRpb24sIGRhdGEpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxQXZhdGFyID0gZnVuY3Rpb24gKGF2YXRhciwgZGF0YSkge1xuICAgIHZhciBwbGF5ZXIxQXZhdGFyID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGF2YXRhcik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMUF2YXRhciwgZGF0YSk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVZlcnN1c1RleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciB2ZXJzdXMgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHZlcnN1cywgZGF0YSk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJVbmtub3duQXZhdGFyID0gZnVuY3Rpb24gKGF2YXRhciwgZGF0YSkge1xuICAgIHRoaXMucGxheWVyMlVua25vd25BdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoYXZhdGFyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJVbmtub3duQXZhdGFyLCBkYXRhKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMVRleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBwbGF5ZXIxID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIxLCBkYXRhKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMlRleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBwbGF5ZXIyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyLCBkYXRhKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhciA9IGZ1bmN0aW9uIChhdmF0YXIpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIyVW5rbm93bkF2YXRhcik7XG4gICAgdmFyIHBsYXllcjJVbmtub3duQXZhdGFyID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQVZBVEFSW2F2YXRhcl0pO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjJVbmtub3duQXZhdGFyLCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkZJTkRfR0FNRS5QTEFZRVJfMl9BVkFUQVIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVHYW1lRm91bmRDYXB0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLmZpbmRHYW1lQ2FwdGlvbik7XG4gICAgdmFyIGZvdW5kR2FtZUNhcHRpb24gPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRklORF9HQU1FLkZPVU5EX0dBTUVfQ0FQVElPTik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoZm91bmRHYW1lQ2FwdGlvbiwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5GSU5EX0dBTUUuRk9VTkRfR0FNRV9DQVBUSU9OKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaW5kR2FtZVZpZXc7IiwiSGVscFZpZXcuY29uc3RydWN0b3IgPSBIZWxwVmlldztcbkhlbHBWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5IZWxwVmlldy5wcm90b3R5cGUuQkFDS19CVVRUT04gPSAwO1xuXG5mdW5jdGlvbiBIZWxwVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5IZWxwVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuSEVMUDtcbiAgICB2YXIgY29tbW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQ09NTU9OO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlSGVscFRleHQobGF5b3V0RGF0YS5JTkZPKTtcbiAgICB0aGlzLmNyZWF0ZUJhY2tCdXR0b24oY29tbW9uRGF0YS5CQUNLX0JVVFRPTik7XG59O1xuXG5IZWxwVmlldy5wcm90b3R5cGUuY3JlYXRlSGVscFRleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBoZWxwVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoaGVscFRleHQsIGRhdGEpO1xufTtcblxuSGVscFZpZXcucHJvdG90eXBlLmNyZWF0ZUJhY2tCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuYmFja0J1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmJhY2tCdXR0b24sIGRhdGEpO1xufTtcblxuSGVscFZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLmJhY2tCdXR0b25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZWxwVmlldzsiLCJNZW51Vmlldy5jb25zdHJ1Y3RvciA9IE1lbnVWaWV3O1xuTWVudVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5QTEFZX0JVVFRPTiA9IDA7XG5NZW51Vmlldy5wcm90b3R5cGUuSEVMUF9CVVRUT04gPSAxO1xuXG5mdW5jdGlvbiBNZW51VmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5NZW51Vmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuTUVOVTtcbiAgICB2YXIgY29tbW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQ09NTU9OO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlQm9hcmRRdWl6VGV4dChjb21tb25EYXRhLkJPQVJEX1FVSVopO1xuICAgIHRoaXMuY3JlYXRlUGxheUJ1dHRvbihsYXlvdXREYXRhLlBMQVlfQlVUVE9OKTtcbiAgICB0aGlzLmNyZWF0ZUhlbHBCdXR0b24obGF5b3V0RGF0YS5IRUxQX0JVVFRPTik7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlQm9hcmRRdWl6VGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGJvYXJkUXVpelRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGJvYXJkUXVpelRleHQsIGRhdGEpO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXlCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMucGxheUJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXlCdXR0b24sIGRhdGEpO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmNyZWF0ZUhlbHBCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuaGVscEJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmhlbHBCdXR0b24sIGRhdGEpO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLnBsYXlCdXR0b24sIHRoaXMuaGVscEJ1dHRvbl07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVWaWV3OyIsIlZpZXcuY29uc3RydWN0b3IgPSBWaWV3O1xuVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5WaWV3LnByb3RvdHlwZS5JTlRFUkFDVElWRSA9IHRydWU7XG5WaWV3LnByb3RvdHlwZS5DRU5URVJfQU5DSE9SID0gMC41O1xuXG5mdW5jdGlvbiBWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cblZpZXcucHJvdG90eXBlLmFkZEVsZW1lbnRUb0NvbnRhaW5lciA9IGZ1bmN0aW9uKGVsZW1lbnQsIHBvc2l0aW9uRGF0YSkge1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uKGVsZW1lbnQsIHBvc2l0aW9uRGF0YSk7XG4gICAgZWxlbWVudC5hbmNob3IueCA9IHRoaXMuQ0VOVEVSX0FOQ0hPUjtcbiAgICBlbGVtZW50LmFuY2hvci55ID0gdGhpcy5DRU5URVJfQU5DSE9SO1xuICAgIGVsZW1lbnQuaW50ZXJhY3RpdmUgPSB0aGlzLklOVEVSQUNUSVZFO1xuICAgIHRoaXMuYWRkQ2hpbGQoZWxlbWVudCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5zZXRFbGVtZW50UG9zaXRpb24gPSBmdW5jdGlvbihlbGVtZW50LCBwb3NpdGlvbkRhdGEpIHtcbiAgICBlbGVtZW50LnBvc2l0aW9uLnggPSBwb3NpdGlvbkRhdGEueDtcbiAgICBlbGVtZW50LnBvc2l0aW9uLnkgPSBwb3NpdGlvbkRhdGEueTtcbn07XG5cblZpZXcucHJvdG90eXBlLmNyZWF0ZVRleHRFbGVtZW50ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHJldHVybiBuZXcgUElYSS5UZXh0KGRhdGEudGV4dCwge2ZvbnQ6IGRhdGEuc2l6ZSArIFwicHggXCIgKyBkYXRhLmZvbnQsIGZpbGw6IGRhdGEuY29sb3J9KTtcbn07XG5cblZpZXcucHJvdG90eXBlLmNyZWF0ZVNwcml0ZUVsZW1lbnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoZGF0YS5wYXRoKTtcbn07XG5cblZpZXcucHJvdG90eXBlLnJlbW92ZUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdGhpcy5yZW1vdmVDaGlsZChlbGVtZW50KTtcbn07XG5cblZpZXcucHJvdG90eXBlLnVwZGF0ZUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdGhpcy5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICB0aGlzLmFkZENoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUucmVtb3ZlQWxsRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG5cbiIsIkF2YXRhclZpZXcuY29uc3RydWN0b3IgPSBBdmF0YXJWaWV3O1xuQXZhdGFyVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuQXZhdGFyVmlldy5wcm90b3R5cGUuQkFDS19CVVRUT04gPSAwO1xuXG5mdW5jdGlvbiBBdmF0YXJWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkF2YXRhclZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oYXZhdGFyTmFtZSkge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5BVkFUQVI7XG4gICAgdmFyIGNvbW1vbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkNPTU1PTjtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZUF2YXRhcihsYXlvdXREYXRhW2F2YXRhck5hbWVdKTtcbn07XG5cbkF2YXRhclZpZXcucHJvdG90eXBlLmNyZWF0ZUF2YXRhciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGF2YXRhciA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihhdmF0YXIsIGRhdGEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdmF0YXJWaWV3OyIsIkRpY2VWaWV3LmNvbnN0cnVjdG9yID0gRGljZVZpZXc7XG5EaWNlVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gRGljZVZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuRGljZVZpZXcucHJvdG90eXBlLnNldHVwRGljZSA9IGZ1bmN0aW9uKGRpY2VOdW1iZXIpIHtcbiAgICB2YXIgZGljZUltYWdlID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5ESUNFW2RpY2VOdW1iZXJdO1xuICAgIHZhciBkaWNlUG9zaXRpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5ESUNFLkNPT1JEUztcbiAgICBcbiAgICB0aGlzLmNyZWF0ZURpY2VFbGVtZW50KGRpY2VJbWFnZSwgZGljZVBvc2l0aW9uRGF0YSk7XG59O1xuXG5EaWNlVmlldy5wcm90b3R5cGUuY3JlYXRlRGljZUVsZW1lbnQgPSBmdW5jdGlvbihkaWNlSW1hZ2UsIGRpY2VQb3NpdGlvbkRhdGEpIHtcbiAgICB0aGlzLmRpY2VFbGVtZW50ID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRpY2VJbWFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5kaWNlRWxlbWVudCwgZGljZVBvc2l0aW9uRGF0YSk7XG59O1xuXG5EaWNlVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaWNlVmlldzsiLCJQbGF5ZXJWaWV3LmNvbnN0cnVjdG9yID0gUGxheWVyVmlldztcblBsYXllclZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIFBsYXllclZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyRGF0YSA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllckRhdGEgPSBwbGF5ZXJEYXRhO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVyTGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSO1xuICAgIHZhciBhdmF0YXJEYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5BVkFUQVI7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxQXZhdGFyKGF2YXRhckRhdGFbdGhpcy5wbGF5ZXJEYXRhLnBsYXllcjFBdmF0YXJdLCBwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX0FWQVRBUik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxSGVhbHRoKHBsYXllckxheW91dERhdGEuUExBWUVSXzFfSEVBTFRIKTtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJBdmF0YXIoYXZhdGFyRGF0YVt0aGlzLnBsYXllckRhdGEucGxheWVyMkF2YXRhcl0sIHBsYXllckxheW91dERhdGEuUExBWUVSXzJfQVZBVEFSKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMl9IRUFMVEgpO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlUGxheWVyMVRleHQocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9URVhUKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJUZXh0KHBsYXllckxheW91dERhdGEuUExBWUVSXzJfVEVYVCk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxQXZhdGFyID0gZnVuY3Rpb24oYXZhdGFyLCBhdmF0YXJQb3NpdGlvbikge1xuICAgIHRoaXMucGxheWVyMUF2YXRhciA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChhdmF0YXIpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMUF2YXRhciwgYXZhdGFyUG9zaXRpb24pO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMkF2YXRhciA9IGZ1bmN0aW9uKGF2YXRhciwgYXZhdGFyUG9zaXRpb24pIHtcbiAgICB0aGlzLnBsYXllcjFBdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoYXZhdGFyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFBdmF0YXIsIGF2YXRhclBvc2l0aW9uKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFIZWFsdGggPSBmdW5jdGlvbihoZWFsdGhEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoaGVhbHRoRGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCwgaGVhbHRoRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIySGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoRGF0YSkge1xuICAgIHRoaXMucGxheWVyMkhlYWx0aFRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGhlYWx0aERhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMkhlYWx0aFRleHQsIGhlYWx0aERhdGEpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMVRleHQgPSBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIxVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQocGxheWVyRGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxVGV4dCwgcGxheWVyRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyVGV4dCA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllcjJUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJUZXh0LCBwbGF5ZXJEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLnNldFBsYXllcjFIZWFsdGggPSBmdW5jdGlvbihoZWFsdGgpIHtcbiAgICB2YXIgcGxheWVyMUhlYWx0aERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUi5QTEFZRVJfMV9IRUFMVEg7XG4gICAgdGhpcy5wbGF5ZXIxSGVhbHRoVGV4dC50ZXh0ID0gcGxheWVyMUhlYWx0aERhdGEudGV4dCArIGhlYWx0aDtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLnNldFBsYXllcjJIZWFsdGggPSBmdW5jdGlvbihoZWFsdGgpIHtcbiAgICB2YXIgcGxheWVyMkhlYWx0aERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUi5QTEFZRVJfMl9IRUFMVEg7XG4gICAgdGhpcy5wbGF5ZXIySGVhbHRoVGV4dC50ZXh0ID0gcGxheWVyMkhlYWx0aERhdGEudGV4dCArIGhlYWx0aDtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyVmlldzsiLCJRdWVzdGlvblZpZXcuY29uc3RydWN0b3IgPSBRdWVzdGlvblZpZXc7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuUklHSFRfQU5TV0VSID0gMDtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuV1JPTkdfQU5TV0VSXzEgPSAxO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5XUk9OR19BTlNXRVJfMiA9IDI7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLldST05HX0FOU1dFUl8zID0gMztcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5BTlNXRVJfUFJFRklYID0gXCJBTlNXRVJfXCI7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLkFOU1dFUkVEX1BSRUZJWCA9IFwiQU5TV0VSRURfXCI7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLkFOU1dFUkVEX1NVRkZJWCA9IFwiX0FOU1dFUkVEXCI7XG5cbmZ1bmN0aW9uIFF1ZXN0aW9uVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmRpc3BsYXlDYXRlZ29yeUFuZFF1ZXN0aW9uID0gZnVuY3Rpb24oY2F0ZWdvcnksIHF1ZXN0aW9uKSB7XG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT047XG4gICAgdGhpcy5jcmVhdGVDYXRlZ29yeUVsZW1lbnQoY2F0ZWdvcnksIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT04uQ0FURUdPUlkpO1xuICAgIHRoaXMuY3JlYXRlUXVlc3Rpb25FbGVtZW50KHF1ZXN0aW9uLnRleHQsIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT04uUVVFU1RJT05fUE9TSVRJT04pO1xuICAgIHRoaXMuY3JlYXRlUmlnaHRBbnN3ZXJFbGVtZW50KHF1ZXN0aW9uLnJpZ2h0X2Fuc3dlciwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTlt0aGlzLkFOU1dFUl9QUkVGSVggKyB0aGlzLmFuc3dlckluZGljZXNbMF1dKTtcbiAgICB0aGlzLmNyZWF0ZVdyb25nQW5zd2VyRWxlbWVudDEocXVlc3Rpb24ud3JvbmdfYW5zd2VyXzEsIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT05bdGhpcy5BTlNXRVJfUFJFRklYICsgdGhpcy5hbnN3ZXJJbmRpY2VzWzFdXSk7XG4gICAgdGhpcy5jcmVhdGVXcm9uZ0Fuc3dlckVsZW1lbnQyKHF1ZXN0aW9uLndyb25nX2Fuc3dlcl8yLCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OW3RoaXMuQU5TV0VSX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1syXV0pO1xuICAgIHRoaXMuY3JlYXRlV3JvbmdBbnN3ZXJFbGVtZW50MyhxdWVzdGlvbi53cm9uZ19hbnN3ZXJfMywgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTlt0aGlzLkFOU1dFUl9QUkVGSVggKyB0aGlzLmFuc3dlckluZGljZXNbM11dKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuc2V0QW5zd2VySW5kaWNlcyA9IGZ1bmN0aW9uKGFuc3dlckluZGljZXMpIHtcbiAgICB0aGlzLmFuc3dlckluZGljZXMgPSBhbnN3ZXJJbmRpY2VzO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVDYXRlZ29yeUVsZW1lbnQgPSBmdW5jdGlvbihjYXRlZ29yeSwgY2F0ZWdvcnlEYXRhKSB7XG4gICAgY2F0ZWdvcnlEYXRhLnRleHQgPSBjYXRlZ29yeTtcbiAgICB0aGlzLmNhdGVnb3J5RWxlbWVudCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoY2F0ZWdvcnlEYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmNhdGVnb3J5RWxlbWVudCwgY2F0ZWdvcnlEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlUXVlc3Rpb25FbGVtZW50ID0gZnVuY3Rpb24ocXVlc3Rpb24sIHF1ZXN0aW9uRGF0YSkge1xuICAgIHF1ZXN0aW9uRGF0YS50ZXh0ID0gcXVlc3Rpb247XG4gICAgdGhpcy5xdWVzdGlvbkVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHF1ZXN0aW9uRGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5xdWVzdGlvbkVsZW1lbnQsIHF1ZXN0aW9uRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZVJpZ2h0QW5zd2VyRWxlbWVudCA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLnJpZ2h0QW5zd2VyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnJpZ2h0QW5zd2VyLCBhbnN3ZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlV3JvbmdBbnN3ZXJFbGVtZW50MSA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLndyb25nQW5zd2VyMSA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy53cm9uZ0Fuc3dlcjEsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVXcm9uZ0Fuc3dlckVsZW1lbnQyID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMud3JvbmdBbnN3ZXIyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLndyb25nQW5zd2VyMiwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZVdyb25nQW5zd2VyRWxlbWVudDMgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy53cm9uZ0Fuc3dlcjMgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMud3JvbmdBbnN3ZXIzLCBhbnN3ZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuc2V0QW5zd2VyVG9Db2xvdXIgPSBmdW5jdGlvbihhbnN3ZXJFbGVtZW50LCBhbnN3ZXIpIHtcbiAgICB2YXIgcXVlc3Rpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTjtcbiAgICB2YXIgY29sb3VycyA9IHt9O1xuICAgIGZvcih2YXIgaSA9IDI7IGkgPD0gNDsgaSsrKSB7XG4gICAgICAgIGNvbG91cnNbdGhpcy5BTlNXRVJFRF9QUkVGSVggKyBpXSA9IHF1ZXN0aW9uRGF0YS5XUk9OR19BTlNXRVJfQ09MT1VSO1xuICAgIH1cbiAgICBjb2xvdXJzLkFOU1dFUkVEXzEgPSBxdWVzdGlvbkRhdGEuUklHSFRfQU5TV0VSX0NPTE9VUjtcbiAgICB2YXIgYW5zd2VyQ29sb3VyID0gY29sb3Vyc1thbnN3ZXJdO1xuICAgIGFuc3dlckVsZW1lbnQuc2V0U3R5bGUoe2ZvbnQ6IGFuc3dlckVsZW1lbnQuc3R5bGUuZm9udCwgZmlsbDogYW5zd2VyQ29sb3VyfSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnNldFdob0Fuc3dlcmVkUXVlc3Rpb24gPSBmdW5jdGlvbihhbnN3ZXJFbGVtZW50LCBhbnN3ZXIsIHBsYXllcikge1xuICAgIHZhciBxdWVzdGlvbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OO1xuICAgIHZhciBhbnN3ZXJPblNjcmVlbiA9IChhbnN3ZXIuc2xpY2UoLTEpIC0gMSk7XG4gICAgdGhpcy5wbGF5ZXJXaG9BbnN3ZXJlZEVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHF1ZXN0aW9uRGF0YVtwbGF5ZXIgKyB0aGlzLkFOU1dFUkVEX1NVRkZJWF0pO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyV2hvQW5zd2VyZWRFbGVtZW50LCBxdWVzdGlvbkRhdGFbdGhpcy5BTlNXRVJFRF9QUkVGSVggKyB0aGlzLmFuc3dlckluZGljZXNbYW5zd2VyT25TY3JlZW5dXSk7IFxufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS50dXJuT2ZmSW50ZXJhY3Rpdml0eUZvckFuc3dlckVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yaWdodEFuc3dlci5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMud3JvbmdBbnN3ZXIxLmludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy53cm9uZ0Fuc3dlcjIuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLndyb25nQW5zd2VyMy5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5yaWdodEFuc3dlciwgdGhpcy53cm9uZ0Fuc3dlcjEsIHRoaXMud3JvbmdBbnN3ZXIyLCB0aGlzLndyb25nQW5zd2VyM107XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25WaWV3OyIsIldpblZpZXcuY29uc3RydWN0b3IgPSBXaW5WaWV3O1xuV2luVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuV2luVmlldy5wcm90b3R5cGUuUExBWV9BR0FJTl9CVVRUT04gPSAwO1xuXG5mdW5jdGlvbiBXaW5WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5zZXR1cFZpZXdFbGVtZW50cygpO1xufVxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlV2lubmVyVGV4dCA9IGZ1bmN0aW9uKHBsYXllcldob1dvbiwgc3RhdERhdGEpIHtcbiAgICB2YXIgd2luRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuV0lOO1xuICAgIHRoaXMuY3JlYXRlV2luVGV4dCh3aW5EYXRhW3BsYXllcldob1dvbiArIFwiX1dJTlNcIl0sIHdpbkRhdGEuV0lOX1RFWFRfUE9TSVRJT04pO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyU3RhdHNUZXh0KHdpbkRhdGEsIHN0YXREYXRhKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24ocGxheWVyV2hvV29uKSB7XG4gICAgdmFyIHdpbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLldJTjtcbiAgICB0aGlzLmNyZWF0ZVBsYXlBZ2FpbkJ1dHRvbih3aW5EYXRhLlBMQVlfQUdBSU4pO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlV2luVGV4dCA9IGZ1bmN0aW9uIChkYXRhLCBwb3NpdGlvbkRhdGEpIHtcbiAgICB2YXIgd2luVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIod2luVGV4dCwgcG9zaXRpb25EYXRhKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllclN0YXRzVGV4dCA9IGZ1bmN0aW9uKGxheW91dERhdGEsIHN0YXREYXRhKSB7XG4gICAgbGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCA9IGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgKyBzdGF0RGF0YS5wbGF5ZXIxQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2U7XG4gICAgdmFyIHBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIxQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0LCBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRSk7XG4gICAgXG4gICAgICAgIGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ICsgc3RhdERhdGEucGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlO1xuICAgIHZhciBwbGF5ZXIyQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgbGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UpO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheUFnYWluQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnBsYXlBZ2FpbkJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXlBZ2FpbkJ1dHRvbiwgZGF0YSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5wbGF5QWdhaW5CdXR0b25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaW5WaWV3OyJdfQ==
