(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Display = require('./util/Display');
SocketConstants = require('./constant/SocketConstants');
View = require('./view/View');
LoadingView = require('./view/LoadingView');
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
SoundManager = require('./SoundManager');
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
    var RENDERER_BACKGROUND_COLOUR = 0x000000;
    var DIV_ID = "game";
    
    (function() {
        console.log("Initiated bucket loader.");
        new BucketLoader(loadLayout, bucketLoadingFailedMessage);
    })();
    
    function loadLayout() {
        console.log("Loading layout");
        new JsonLoader('./resource/' + Display.bucket.width + 'x' + Display.bucket.height + '/layout.json', setLayoutDataInPIXI);
    }
    
    function setLayoutDataInPIXI(layoutData) {
        console.log("Setting layout.");
        PIXI.Container.layoutData = layoutData;
        startRendering();
    }
    
    function startRendering() {
        var viewLoader = new ViewLoader();
        var container = new PIXI.Container();
        container.interactive = true;
        var renderer = new PIXI.autoDetectRenderer(Display.bucket.width, Display.bucket.height);
        console.log("Scale is " + Display.scale);
        renderer.backgroundColor = RENDERER_BACKGROUND_COLOUR;
        renderer.roundPixels = true;
        setDependencies(viewLoader, container, renderer);
        appendGameToDOM(renderer);
        beginAnimation(viewLoader);
        addLoadingViewToScreen(viewLoader);
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
        console.log("Display resource path: " + Display.resourcePath);
        new ImageLoader('./resource/' + Display.resourcePath + '/images.json', beginGame);
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
    
    function addLoadingViewToScreen(viewLoader) {
        var loadingView = new LoadingView();
        loadingView.setupViewElements();
        viewLoader.loadView(loadingView);
    }
        
    function bucketLoadingFailedMessage() {
        Display.bucket.height = DEFAULT_HEIGHT;
        Display.bucket.width = DEFAULT_WIDTH;
        Display.scale = 1;
        Display.resourcePath = DEFAULT_WIDTH + 'x' + DEFAULT_HEIGHT;
    }
};
},{"./SoundManager":2,"./constant/SocketConstants":3,"./controller/AvatarSelectionController":4,"./controller/Controller":5,"./controller/FindGameController":6,"./controller/GameController":7,"./controller/HelpController":8,"./controller/MenuController":9,"./controller/TurnController":10,"./controller/subcontroller/DiceController":11,"./controller/subcontroller/PlayerController":12,"./controller/subcontroller/QuestionController":13,"./loader/BucketLoader":14,"./loader/ImageLoader":15,"./loader/JsonLoader":16,"./loader/ViewLoader":17,"./util/Display":18,"./view/AvatarSelectionView":19,"./view/FindGameView":20,"./view/HelpView":21,"./view/LoadingView":22,"./view/MenuView":23,"./view/View":24,"./view/subview/AvatarView":25,"./view/subview/DiceView":26,"./view/subview/PlayerView":27,"./view/subview/QuestionView":28,"./view/subview/WinView":29}],2:[function(require,module,exports){
function SoundManager() {
    (function() {
        this.correctAnswerSound = new Howl({urls: ["resource/sound/correct-answer.mp3"]});
        this.wrongAnswerSound = new Howl({urls: ["resource/sound/wrong-answer.mp3"]});
        this.rollDiceSound = new Howl({urls: ["resource/sound/roll-dice.mp3"]});
        this.tickSound = new Howl({urls: ["resource/sound/tick.mp3"]});
    }.bind(this))();
    
    this.playCorrectAnswerSound = function() {
        this.correctAnswerSound.play();
    };
    
    this.playWrongAnswerSound = function() {
        this.wrongAnswerSound.play();
    };
    
    this.playRollDiceSound = function() {
        this.rollDiceSound.play();
    };
    
    this.playTickSound = function() {
        this.tickSound.play();
    };
}

module.exports = SoundManager;
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
AvatarSelectionController.constructor = AvatarSelectionController;
AvatarSelectionController.prototype = Object.create(Controller.prototype);
AvatarSelectionController.prototype.view = new AvatarSelectionView();
AvatarSelectionController.prototype.selectedAvatarView = new AvatarView();
AvatarSelectionController.prototype.avatars = ['EMOJI_ANGEL', 'EMOJI_BIG_SMILE', 'EMOJI_COOL', 'EMOJI_GRIN', 'EMOJI_HAPPY', 'EMOJI_KISS', 'EMOJI_LAUGHING', 'EMOJI_LOVE', 'EMOJI_MONKEY', 'EMOJI_POO', 'EMOJI_SCREAM', 'EMOJI_SLEEP', 'EMOJI_SMILE', 'EMOJI_SWEET', 'EMOJI_WINK'];
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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

GameController.prototype.soundManager = new SoundManager();

module.exports = GameController;
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
                console.log("Emitted player 2 as winner!");
                this.socket.emit(SocketConstants.emit.GAME_ENDED, {winner: "PLAYER_2"});
            }
        } else if(playerData.player2Health === 0) {
            if(this.isPlayer1()) {
                console.log("Emitted player 1 as winner!");
                this.socket.emit(SocketConstants.emit.GAME_ENDED, {winner: "PLAYER_1"});
            }
        } else {
            setTimeout(function() {
                this.newTurn();
            }.bind(this), 1500);
        }
    }.bind(this));
    
    this.socket.on(SocketConstants.on.GAME_STATS, function(data) {
        console.log("Loading win view!");
        this.loadWinView(data.winner, data);
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
    setTimeout(function() {
        this.diceController.rollDice();
    }.bind(this), 2000);
    setTimeout(function() {
        this.questionController.loadView();
    }.bind(this), 3000);
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
},{}],11:[function(require,module,exports){
DiceController.constructor = DiceController;
DiceController.prototype = Object.create(GameController.prototype);
DiceController.prototype.view = new DiceView();

function DiceController() {
    Controller.call(this);
    this.registerSocketEvents();
}

DiceController.prototype.registerSocketEvents = function() {
    this.socket.on(SocketConstants.on.DICE_NUMBER, function(dice) {
        this.soundManager.playRollDiceSound();
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
},{}],12:[function(require,module,exports){
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
        this.clearIntervals();
        this.view.setPlayer1Health(playerData.player1Health);
        this.view.setPlayer2Health(playerData.player2Health);
        if(playerData.player1Health <= 5) {
            this.view.flashPlayer1Health();
        }
        if(playerData.player2Health <= 5) {
            this.view.flashPlayer2Health();
        }
    }.bind(this));
};

PlayerController.prototype.updatePlayersHealth = function() {
    this.socket.emit(SocketConstants.emit.GET_PLAYERS_HEALTH);
};

PlayerController.prototype.cleanView = function() {
    this.viewLoader.removeView(this.view);
    this.view.cleanView();
};

PlayerController.prototype.clearIntervals = function() {
    this.view.clearIntervals();
};

module.exports = PlayerController;
},{}],13:[function(require,module,exports){
QuestionController.constructor = QuestionController;
QuestionController.prototype = Object.create(GameController.prototype);
QuestionController.prototype.view = new QuestionView();

QuestionController.prototype.ANSWERED_1 = 'ANSWERED_1';
QuestionController.prototype.ANSWERED_2 = 'ANSWERED_2';
QuestionController.prototype.ANSWERED_3 = 'ANSWERED_3';
QuestionController.prototype.ANSWERED_4 = 'ANSWERED_4';

QuestionController.prototype.TIME_TO_ANSWER_QUESTION = 10;

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
        this.view.setAnswerToColour(this.answers[this.ANSWERED_1], this.ANSWERED_1);
        this.view.setWhoAnsweredQuestion(this.answers[playerData.answer], playerData.answer, playerData.player_who_answered);
        this.view.turnOffInteractivityForAnswerElements();
        this.playerController.updatePlayersHealth();
        if(this.isPlayer1()) {
            clearInterval(this.timerIntervalId);
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
    clearInterval(this.timerIntervalId);
    this.getRandomQuestion();
    this.shuffleAnswerIndices();
    this.updateTimer();
};

QuestionController.prototype.updateTimer = function() {
    var timeRemaining = 10;
    var timer = function() {
        if(timeRemaining >= 0) {
            this.view.updateQuestionTimer(timeRemaining);
            this.soundManager.playTickSound();
            timeRemaining--;
        } else {
            if(this.isPlayer1()) {
                this.socket.emit(SocketConstants.emit.NEW_TURN);
            }
            clearInterval(this.timerIntervalId);
        }
    }.bind(this);
    this.timerIntervalId = setInterval(timer, 1000);
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
        this.soundManager.playCorrectAnswerSound();
        this.emitDealDamageToOpponentToSocket(this.ANSWERED_1);
    }.bind(this));
};

QuestionController.prototype.setWrongAnswerListeners = function(answers) {
    this.registerListener(answers.ANSWERED_2, function() {
        this.soundManager.playWrongAnswerSound();
        this.emitDealDamageToSelfToSocket(this.ANSWERED_2);
    }.bind(this));
    
    this.registerListener(answers.ANSWERED_3, function() {
        this.soundManager.playWrongAnswerSound();
        this.emitDealDamageToSelfToSocket(this.ANSWERED_3);
    }.bind(this));
    
    this.registerListener(answers.ANSWERED_4, function() {
        this.soundManager.playWrongAnswerSound();
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
},{}],14:[function(require,module,exports){
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
        console.log("Orientation is " + orientation);
        bucketData[orientation].forEach(function (bucket) {
            console.log("Bucket height: " + bucket.height);
            console.log("Window height: " + window.innerHeight);
            if (bucket.height <= window.innerHeight) {
                Display.bucket = bucket;
            }
        });
        
        console.log("Chosen bucket is ");
        console.log(Display.bucket);
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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
function ViewLoader() {}

ViewLoader.prototype.loadView = function(view) {
    ViewLoader.topLevelContainer.addChild(view);
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
},{}],18:[function(require,module,exports){
var Display = {
    bucket: null,
    scale: null,
    resourcePath: null
};

module.exports = Display;
},{}],19:[function(require,module,exports){
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
    
    this.createLogo(commonData.LOGO);
    this.createBackButton(layoutData.BACK_BUTTON);
    this.createSelectDownButton(layoutData.SELECT_DOWN);
    this.createSelectUpButton(layoutData.SELECT_UP);
    this.createFindGameButton(layoutData.FIND_GAME);
};

AvatarSelectionView.prototype.createLogo = function (data) {
    var logo = this.createSpriteElement(data);
    this.addElementToContainer(logo, data);
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
},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
HelpView.constructor = HelpView;
HelpView.prototype = Object.create(View.prototype);

HelpView.prototype.BACK_BUTTON = 0;

function HelpView() {
    PIXI.Container.call(this);
}

HelpView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.HELP;
    
    this.createHelpText(layoutData.INFO);
    this.createBackButton(layoutData.BACK_BUTTON);
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
},{}],22:[function(require,module,exports){
LoadingView.constructor = LoadingView;
LoadingView.prototype = Object.create(View.prototype);

function LoadingView() {
    PIXI.Container.call(this);
}

LoadingView.prototype.setupViewElements = function() {
    var layoutData = PIXI.Container.layoutData.LOADING;
    
    this.createLoadingText(layoutData.LOADING_TEXT);
};

LoadingView.prototype.createLoadingText = function (data) {
    console.log("Creating loading text...");
    var loadingText = this.createTextElement(data);
    this.addElementToContainer(loadingText, data);
};

module.exports = LoadingView;
},{}],23:[function(require,module,exports){
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
    
    this.createLogo(commonData.LOGO);
    this.createPlayButton(layoutData.PLAY_BUTTON);
    this.createHelpButton(layoutData.HELP_BUTTON);
};

MenuView.prototype.createLogo = function (data) {
    var logo = this.createSpriteElement(data);
    this.addElementToContainer(logo, data);
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
},{}],24:[function(require,module,exports){
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


},{}],25:[function(require,module,exports){
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
    this.removeElement(this.avatar);
    this.avatar = this.createSpriteElement(data);
    this.addElementToContainer(this.avatar, data);
};

module.exports = AvatarView;
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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

PlayerView.prototype.flashPlayer1Health = function() {
    var playerLayoutData = PIXI.Container.layoutData.PLAYER;
    var player1Health = this.player1HealthText.text.slice(-1);
    var removed = false;
    this.player2HealthIntervalId = setInterval(function() {
        if(!removed) {
            this.removeElement(this.player1HealthText);
        } else {
            this.createPlayer1Health(playerLayoutData.PLAYER_1_HEALTH);
            this.setPlayer1Health(player1Health);
        }
        removed = !removed;
    }.bind(this), 200);
};

PlayerView.prototype.flashPlayer2Health = function() {
    var playerLayoutData = PIXI.Container.layoutData.PLAYER;
    var player2Health = this.player1HealthText.text.slice(-1);
    var removed = false;
    this.player1HealthIntervalId = setInterval(function() {
        if(!removed) {
            this.removeElement(this.player2HealthText);
        } else {
            this.createPlayer2Health(playerLayoutData.PLAYER_2_HEALTH);
            this.setPlayer2Health(player2Health);
        }
        removed = !removed;
    }.bind(this), 200);
};

PlayerView.prototype.cleanView = function() {
    this.removeAllElements();
};

PlayerView.prototype.clearIntervals = function() {
    clearInterval(this.player1HealthIntervalId);
    clearInterval(this.player2HealthIntervalId);
    console.log("Intervals cleared.");
};

module.exports = PlayerView;
},{}],28:[function(require,module,exports){
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

QuestionView.prototype.updateQuestionTimer = function(timeRemaining) {
    this.removeElement(this.timer);
    var timerData = PIXI.Container.layoutData.QUESTION.TIMER;
    timerData.text = timeRemaining;
    this.timer = this.createTextElement(timerData);
    this.addElementToContainer(this.timer, timerData);
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
},{}],29:[function(require,module,exports){
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
    
    layoutData.PLAYER_1_BEST_CATEGORY.text = layoutData.PLAYER_1_BEST_CATEGORY.text + statData.player1BestCategory + "(" + statData.player1BestCategoryPercentage + "%)";
    var player1BestCategoryText = this.createTextElement(layoutData.PLAYER_1_BEST_CATEGORY);
    this.addElementToContainer(player1BestCategoryText, layoutData.PLAYER_1_BEST_CATEGORY);
    
    layoutData.PLAYER_2_BEST_CATEGORY.text = layoutData.PLAYER_2_BEST_CATEGORY.text + statData.player2BestCategory + "(" + statData.player2BestCategoryPercentage + "%)";
    var player2BestCategoryText = this.createTextElement(layoutData.PLAYER_2_BEST_CATEGORY);
    this.addElementToContainer(player2BestCategoryText, layoutData.PLAYER_2_BEST_CATEGORY);
};

WinView.prototype.createPlayAgainButton = function (data) {
    this.playAgainButton = this.createSpriteElement(data);
    this.addElementToContainer(this.playAgainButton, data);
};

WinView.prototype.getInteractiveViewElements = function() {
    return [this.playAgainButton];
};

module.exports = WinView;
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi5qcyIsInNyYy9Tb3VuZE1hbmFnZXIuanMiLCJzcmMvY29uc3RhbnQvU29ja2V0Q29uc3RhbnRzLmpzIiwic3JjL2NvbnRyb2xsZXIvQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0NvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9GaW5kR2FtZUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9HYW1lQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0hlbHBDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvTWVudUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9UdXJuQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvRGljZUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9zdWJjb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9zdWJjb250cm9sbGVyL1F1ZXN0aW9uQ29udHJvbGxlci5qcyIsInNyYy9sb2FkZXIvQnVja2V0TG9hZGVyLmpzIiwic3JjL2xvYWRlci9JbWFnZUxvYWRlci5qcyIsInNyYy9sb2FkZXIvSnNvbkxvYWRlci5qcyIsInNyYy9sb2FkZXIvVmlld0xvYWRlci5qcyIsInNyYy91dGlsL0Rpc3BsYXkuanMiLCJzcmMvdmlldy9BdmF0YXJTZWxlY3Rpb25WaWV3LmpzIiwic3JjL3ZpZXcvRmluZEdhbWVWaWV3LmpzIiwic3JjL3ZpZXcvSGVscFZpZXcuanMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy5qcyIsInNyYy92aWV3L01lbnVWaWV3LmpzIiwic3JjL3ZpZXcvVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvQXZhdGFyVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvRGljZVZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1BsYXllclZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1F1ZXN0aW9uVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvV2luVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkRpc3BsYXkgPSByZXF1aXJlKCcuL3V0aWwvRGlzcGxheScpO1xuU29ja2V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudC9Tb2NrZXRDb25zdGFudHMnKTtcblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvVmlldycpO1xuTG9hZGluZ1ZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvTG9hZGluZ1ZpZXcnKTtcbkJ1Y2tldExvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL0J1Y2tldExvYWRlcicpO1xuSnNvbkxvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL0pzb25Mb2FkZXInKTtcbkltYWdlTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvSW1hZ2VMb2FkZXInKTtcblZpZXdMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9WaWV3TG9hZGVyJyk7XG5Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0NvbnRyb2xsZXInKTtcbkhlbHBWaWV3ID0gcmVxdWlyZSgnLi92aWV3L0hlbHBWaWV3Jyk7XG5IZWxwQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9IZWxwQ29udHJvbGxlcicpO1xuTWVudVZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvTWVudVZpZXcnKTtcbk1lbnVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL01lbnVDb250cm9sbGVyJyk7XG5BdmF0YXJTZWxlY3Rpb25WaWV3ID0gcmVxdWlyZSgnLi92aWV3L0F2YXRhclNlbGVjdGlvblZpZXcnKTtcbkF2YXRhclZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9BdmF0YXJWaWV3Jyk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0F2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXInKTtcbkZpbmRHYW1lVmlldyA9IHJlcXVpcmUoJy4vdmlldy9GaW5kR2FtZVZpZXcnKTtcbkZpbmRHYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9GaW5kR2FtZUNvbnRyb2xsZXInKTtcblNvdW5kTWFuYWdlciA9IHJlcXVpcmUoJy4vU291bmRNYW5hZ2VyJyk7XG5HYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9HYW1lQ29udHJvbGxlcicpO1xuRGljZVZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9EaWNlVmlldycpO1xuRGljZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9EaWNlQ29udHJvbGxlcicpO1xuUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvUXVlc3Rpb25WaWV3Jyk7XG5RdWVzdGlvbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9RdWVzdGlvbkNvbnRyb2xsZXInKTtcblBsYXllclZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9QbGF5ZXJWaWV3Jyk7XG5QbGF5ZXJDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlcicpO1xuV2luVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L1dpblZpZXcnKTtcblR1cm5Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL1R1cm5Db250cm9sbGVyJyk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBcbiAgICB2YXIgREVGQVVMVF9XSURUSCA9IDQ4MDtcbiAgICB2YXIgREVGQVVMVF9IRUlHSFQgPSAzMjA7XG4gICAgdmFyIFJFTkRFUkVSX0JBQ0tHUk9VTkRfQ09MT1VSID0gMHgwMDAwMDA7XG4gICAgdmFyIERJVl9JRCA9IFwiZ2FtZVwiO1xuICAgIFxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWF0ZWQgYnVja2V0IGxvYWRlci5cIik7XG4gICAgICAgIG5ldyBCdWNrZXRMb2FkZXIobG9hZExheW91dCwgYnVja2V0TG9hZGluZ0ZhaWxlZE1lc3NhZ2UpO1xuICAgIH0pKCk7XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZExheW91dCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIGxheW91dFwiKTtcbiAgICAgICAgbmV3IEpzb25Mb2FkZXIoJy4vcmVzb3VyY2UvJyArIERpc3BsYXkuYnVja2V0LndpZHRoICsgJ3gnICsgRGlzcGxheS5idWNrZXQuaGVpZ2h0ICsgJy9sYXlvdXQuanNvbicsIHNldExheW91dERhdGFJblBJWEkpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXRMYXlvdXREYXRhSW5QSVhJKGxheW91dERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTZXR0aW5nIGxheW91dC5cIik7XG4gICAgICAgIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEgPSBsYXlvdXREYXRhO1xuICAgICAgICBzdGFydFJlbmRlcmluZygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzdGFydFJlbmRlcmluZygpIHtcbiAgICAgICAgdmFyIHZpZXdMb2FkZXIgPSBuZXcgVmlld0xvYWRlcigpO1xuICAgICAgICB2YXIgY29udGFpbmVyID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gICAgICAgIGNvbnRhaW5lci5pbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHZhciByZW5kZXJlciA9IG5ldyBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcihEaXNwbGF5LmJ1Y2tldC53aWR0aCwgRGlzcGxheS5idWNrZXQuaGVpZ2h0KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJTY2FsZSBpcyBcIiArIERpc3BsYXkuc2NhbGUpO1xuICAgICAgICByZW5kZXJlci5iYWNrZ3JvdW5kQ29sb3IgPSBSRU5ERVJFUl9CQUNLR1JPVU5EX0NPTE9VUjtcbiAgICAgICAgcmVuZGVyZXIucm91bmRQaXhlbHMgPSB0cnVlO1xuICAgICAgICBzZXREZXBlbmRlbmNpZXModmlld0xvYWRlciwgY29udGFpbmVyLCByZW5kZXJlcik7XG4gICAgICAgIGFwcGVuZEdhbWVUb0RPTShyZW5kZXJlcik7XG4gICAgICAgIGJlZ2luQW5pbWF0aW9uKHZpZXdMb2FkZXIpO1xuICAgICAgICBhZGRMb2FkaW5nVmlld1RvU2NyZWVuKHZpZXdMb2FkZXIpO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS9xdWVzdGlvbnMuanNvbicsIHNldFF1ZXN0aW9uRGF0YUluUXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0UXVlc3Rpb25EYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIocXVlc3Rpb25EYXRhKSB7XG4gICAgICAgIFF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUucXVlc3Rpb25EYXRhID0gcXVlc3Rpb25EYXRhO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS9jYXRlZ29yaWVzLmpzb24nLCBzZXRDYXRlZ29yeURhdGFJblF1ZXN0aW9uQ29udHJvbGxlcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldENhdGVnb3J5RGF0YUluUXVlc3Rpb25Db250cm9sbGVyKGNhdGVnb3J5RGF0YSkge1xuICAgICAgICBRdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNhdGVnb3J5RGF0YSA9IGNhdGVnb3J5RGF0YTtcbiAgICAgICAgbG9hZEltYWdlcygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc3BsYXkgcmVzb3VyY2UgcGF0aDogXCIgKyBEaXNwbGF5LnJlc291cmNlUGF0aCk7XG4gICAgICAgIG5ldyBJbWFnZUxvYWRlcignLi9yZXNvdXJjZS8nICsgRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2ltYWdlcy5qc29uJywgYmVnaW5HYW1lKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYXBwZW5kR2FtZVRvRE9NKHJlbmRlcmVyKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKERJVl9JRCkuYXBwZW5kQ2hpbGQocmVuZGVyZXIudmlldyk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldERlcGVuZGVuY2llcyh2aWV3TG9hZGVyLCBjb250YWluZXIsIHJlbmRlcmVyKSB7XG4gICAgICAgIHZpZXdMb2FkZXIuc2V0Q29udGFpbmVyKGNvbnRhaW5lcik7XG4gICAgICAgIHZpZXdMb2FkZXIuc2V0UmVuZGVyZXIocmVuZGVyZXIpO1xuICAgICAgICBDb250cm9sbGVyLnNldFZpZXdMb2FkZXIodmlld0xvYWRlcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGJlZ2luQW5pbWF0aW9uKHZpZXdMb2FkZXIpIHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHZpZXdMb2FkZXIuYW5pbWF0ZSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGJlZ2luR2FtZSgpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gbmV3IE1lbnVDb250cm9sbGVyKCk7IFxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBhZGRMb2FkaW5nVmlld1RvU2NyZWVuKHZpZXdMb2FkZXIpIHtcbiAgICAgICAgdmFyIGxvYWRpbmdWaWV3ID0gbmV3IExvYWRpbmdWaWV3KCk7XG4gICAgICAgIGxvYWRpbmdWaWV3LnNldHVwVmlld0VsZW1lbnRzKCk7XG4gICAgICAgIHZpZXdMb2FkZXIubG9hZFZpZXcobG9hZGluZ1ZpZXcpO1xuICAgIH1cbiAgICAgICAgXG4gICAgZnVuY3Rpb24gYnVja2V0TG9hZGluZ0ZhaWxlZE1lc3NhZ2UoKSB7XG4gICAgICAgIERpc3BsYXkuYnVja2V0LmhlaWdodCA9IERFRkFVTFRfSEVJR0hUO1xuICAgICAgICBEaXNwbGF5LmJ1Y2tldC53aWR0aCA9IERFRkFVTFRfV0lEVEg7XG4gICAgICAgIERpc3BsYXkuc2NhbGUgPSAxO1xuICAgICAgICBEaXNwbGF5LnJlc291cmNlUGF0aCA9IERFRkFVTFRfV0lEVEggKyAneCcgKyBERUZBVUxUX0hFSUdIVDtcbiAgICB9XG59OyIsImZ1bmN0aW9uIFNvdW5kTWFuYWdlcigpIHtcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdEFuc3dlclNvdW5kID0gbmV3IEhvd2woe3VybHM6IFtcInJlc291cmNlL3NvdW5kL2NvcnJlY3QtYW5zd2VyLm1wM1wiXX0pO1xuICAgICAgICB0aGlzLndyb25nQW5zd2VyU291bmQgPSBuZXcgSG93bCh7dXJsczogW1wicmVzb3VyY2Uvc291bmQvd3JvbmctYW5zd2VyLm1wM1wiXX0pO1xuICAgICAgICB0aGlzLnJvbGxEaWNlU291bmQgPSBuZXcgSG93bCh7dXJsczogW1wicmVzb3VyY2Uvc291bmQvcm9sbC1kaWNlLm1wM1wiXX0pO1xuICAgICAgICB0aGlzLnRpY2tTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC90aWNrLm1wM1wiXX0pO1xuICAgIH0uYmluZCh0aGlzKSkoKTtcbiAgICBcbiAgICB0aGlzLnBsYXlDb3JyZWN0QW5zd2VyU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jb3JyZWN0QW5zd2VyU291bmQucGxheSgpO1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5wbGF5V3JvbmdBbnN3ZXJTb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLndyb25nQW5zd2VyU291bmQucGxheSgpO1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5wbGF5Um9sbERpY2VTb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJvbGxEaWNlU291bmQucGxheSgpO1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5wbGF5VGlja1NvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudGlja1NvdW5kLnBsYXkoKTtcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvdW5kTWFuYWdlcjsiLCJ2YXIgU29ja2V0Q29uc3RhbnRzID0ge1xuICAgICdvbicgOiB7XG4gICAgICAgICdQTEFZRVJTX0hFQUxUSCcgOiAncGxheWVycy1oZWFsdGgnLFxuICAgICAgICAnRElDRV9OVU1CRVInIDogJ2RpY2UtbnVtYmVyJyxcbiAgICAgICAgJ1JBTkRPTV9RVUVTVElPTicgOiAncmFuZG9tLXF1ZXN0aW9uJyxcbiAgICAgICAgJ0lOSVRfTkVXX1RVUk4nIDogJ2luaXQtbmV3LXR1cm4nLFxuICAgICAgICAnREFNQUdFX0RFQUxUJyA6ICdkYW1hZ2UtZGVhbHQnLFxuICAgICAgICAnU0hVRkZMRURfQU5TV0VSX0lORElDRVMnIDogJ3NodWZmbGVkLWFuc3dlci1pbmRpY2VzJyxcbiAgICAgICAgJ0dBTUVfRk9VTkQnIDogJ2dhbWUtZm91bmQnLFxuICAgICAgICAnR0FNRV9TVEFUUycgOiAnZ2FtZS1zdGF0cydcbiAgICB9LFxuICAgIFxuICAgICdlbWl0JyA6IHtcbiAgICAgICAgJ0NPTk5FQ1RJT04nIDogJ2Nvbm5lY3Rpb24nLFxuICAgICAgICAnRklORElOR19HQU1FJyA6ICdmaW5kaW5nLWdhbWUnLFxuICAgICAgICAnR0VUX1BMQVlFUlNfSEVBTFRIJyA6ICdnZXQtcGxheWVycy1oZWFsdGgnLFxuICAgICAgICAnRElTQ09OTkVDVCcgOiAnZGlzY29ubmVjdCcsXG4gICAgICAgICdST0xMX0RJQ0UnIDogJ3JvbGwtZGljZScsXG4gICAgICAgICdHRVRfUkFORE9NX1FVRVNUSU9OJyA6ICdnZXQtcmFuZG9tLXF1ZXN0aW9uJyxcbiAgICAgICAgJ05FV19UVVJOJyA6ICduZXctdHVybicsXG4gICAgICAgICdERUFMX0RBTUFHRScgOiAnZGVhbC1kYW1hZ2UnLFxuICAgICAgICAnU0hVRkZMRV9BTlNXRVJfSU5ESUNFUycgOiAnc2h1ZmZsZS1hbnN3ZXItaW5kaWNlcycsXG4gICAgICAgICdHQU1FX0VOREVEJyA6ICdnYW1lLWVuZGVkJ1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU29ja2V0Q29uc3RhbnRzOyIsIkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgQXZhdGFyU2VsZWN0aW9uVmlldygpO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2VsZWN0ZWRBdmF0YXJWaWV3ID0gbmV3IEF2YXRhclZpZXcoKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmF2YXRhcnMgPSBbJ0VNT0pJX0FOR0VMJywgJ0VNT0pJX0JJR19TTUlMRScsICdFTU9KSV9DT09MJywgJ0VNT0pJX0dSSU4nLCAnRU1PSklfSEFQUFknLCAnRU1PSklfS0lTUycsICdFTU9KSV9MQVVHSElORycsICdFTU9KSV9MT1ZFJywgJ0VNT0pJX01PTktFWScsICdFTU9KSV9QT08nLCAnRU1PSklfU0NSRUFNJywgJ0VNT0pJX1NMRUVQJywgJ0VNT0pJX1NNSUxFJywgJ0VNT0pJX1NXRUVUJywgJ0VNT0pJX1dJTksnXTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmN1cnJlbnRBdmF0YXJJbmRleCA9IDA7XG5cbmZ1bmN0aW9uIEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5sb2FkVmlldygpO1xufVxuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3LnNldHVwVmlld0VsZW1lbnRzKHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF0pO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgYmFja0J1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuQkFDS19CVVRUT05dO1xuICAgIHZhciBzZWxlY3RVcCA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuU0VMRUNUX1VQXTtcbiAgICB2YXIgc2VsZWN0RG93biA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuU0VMRUNUX0RPV05dO1xuICAgIHZhciBmaW5kR2FtZSA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuRklORF9HQU1FXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYmFja0J1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZW51Q29udHJvbGxlciA9IG5ldyBNZW51Q29udHJvbGxlcigpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihzZWxlY3RVcCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBVUCA9IDE7XG4gICAgICAgIHRoaXMuc2V0dXBOZXh0QXZhdGFyKFVQKTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHNlbGVjdERvd24sIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgRE9XTiA9IC0xO1xuICAgICAgICB0aGlzLnNldHVwTmV4dEF2YXRhcihET1dOKTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGZpbmRHYW1lLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF2YXRhciA9IHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF07XG4gICAgICAgIHZhciBmaW5kR2FtZUNvbnRyb2xsZXIgPSBuZXcgRmluZEdhbWVDb250cm9sbGVyKGF2YXRhcik7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTmV4dEF2YXRhciA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuICAgIGlmKHRoaXMuY3VycmVudEF2YXRhckluZGV4ID49ICh0aGlzLmF2YXRhcnMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXZhdGFySW5kZXggPSAwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50QXZhdGFySW5kZXggKyBkaXJlY3Rpb24gPCAwKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEF2YXRhckluZGV4ID0gKHRoaXMuYXZhdGFycy5sZW5ndGggLSAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCA9IHRoaXMuY3VycmVudEF2YXRhckluZGV4ICsgZGlyZWN0aW9uO1xuICAgIH1cbiAgIFxuICAgIHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3LnNldHVwVmlld0VsZW1lbnRzKHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF0pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gQ29udHJvbGxlcigpIHt9XG5cbkNvbnRyb2xsZXIuc2V0Vmlld0xvYWRlciA9IGZ1bmN0aW9uKHZpZXdMb2FkZXIpIHtcbiAgICBDb250cm9sbGVyLnByb3RvdHlwZS52aWV3TG9hZGVyID0gdmlld0xvYWRlcjtcbn07XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnNvY2tldCA9IGlvKCk7XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTGlzdGVuZXIgPSBmdW5jdGlvbih2aWV3RWxlbWVudCwgYWN0aW9uKSB7XG4gICAgdmlld0VsZW1lbnQudG91Y2hlbmQgPSB2aWV3RWxlbWVudC5jbGljayA9IGFjdGlvbjtcbn07XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTXVsdGlwbGVMaXN0ZW5lcnMgPSBmdW5jdGlvbih2aWV3RWxlbWVudHMsIGFjdGlvbikge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2aWV3RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHZpZXdFbGVtZW50c1tpXSwgYWN0aW9uKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7IiwiRmluZEdhbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gRmluZEdhbWVDb250cm9sbGVyO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEZpbmRHYW1lVmlldygpO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5hdmF0YXIgPSBudWxsO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5UUkFOU0lUSU9OX1RPX0dBTUVfVElNRSA9IDMwMDA7XG5cbmZ1bmN0aW9uIEZpbmRHYW1lQ29udHJvbGxlcihhdmF0YXIpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLmF2YXRhciA9IGF2YXRhcjtcbiAgICB0aGlzLmxvYWRWaWV3KCk7XG59XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHModGhpcy5hdmF0YXIpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBTZXJ2ZXJJbnRlcmFjdGlvbigpO1xufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cFNlcnZlckludGVyYWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkdBTUVfRk9VTkQsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5hc3NpZ25BdmF0YXJzKHBsYXllckRhdGEpO1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlR2FtZUZvdW5kQ2FwdGlvbigpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgICAgICAgICB2YXIgcGxheWVyQ29udHJvbGxlciA9IG5ldyBQbGF5ZXJDb250cm9sbGVyKHBsYXllckRhdGEpO1xuICAgICAgICAgICAgdmFyIGRpY2VDb250cm9sbGVyID0gbmV3IERpY2VDb250cm9sbGVyKCk7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25Db250cm9sbGVyID0gbmV3IFF1ZXN0aW9uQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyKTtcbiAgICAgICAgICAgIHZhciB0dXJuQ29udHJvbGxlciA9IG5ldyBUdXJuQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCB0aGlzLlRSQU5TSVRJT05fVE9fR0FNRV9USU1FKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuRklORElOR19HQU1FLCB7YXZhdGFyOiB0aGlzLmF2YXRhcn0pO1xufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5hc3NpZ25BdmF0YXJzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBzb2NrZXRJZFByZWZpeCA9IFwiLyNcIjtcbiAgICB2YXIgc29ja2V0SWQgPSBzb2NrZXRJZFByZWZpeCArIHRoaXMuc29ja2V0LmlkO1xuICAgIGlmKGRhdGEucGxheWVyMUlkID09PSBzb2NrZXRJZCkge1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhcihkYXRhLnBsYXllcjJBdmF0YXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldy5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyKGRhdGEucGxheWVyMUF2YXRhcik7XG4gICAgfVxufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmluZEdhbWVDb250cm9sbGVyOyIsIkdhbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gR2FtZUNvbnRyb2xsZXI7XG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gR2FtZUNvbnRyb2xsZXIocGxheWVyRGF0YSkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbn1cblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldFBsYXllckRhdGEgPSBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXllckRhdGEgPSBwbGF5ZXJEYXRhO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldERpY2VOdW1iZXIgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmRpY2VOdW1iZXIgPSBkaWNlTnVtYmVyO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmlzUGxheWVyMSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzb2NrZXRQcmVmaXggPSBcIi8jXCI7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyRGF0YS5wbGF5ZXIxSWQgPT09IChzb2NrZXRQcmVmaXggKyBHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc29ja2V0LmlkKTtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5nZXRQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pc1BsYXllcjEodGhpcy5wbGF5ZXJEYXRhKSA/IFwiUExBWUVSXzFcIiA6IFwiUExBWUVSXzJcIjtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5nZXRPcHBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlzUGxheWVyMSh0aGlzLnBsYXllckRhdGEpID8gXCJQTEFZRVJfMlwiIDogXCJQTEFZRVJfMVwiO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNvdW5kTWFuYWdlciA9IG5ldyBTb3VuZE1hbmFnZXIoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lQ29udHJvbGxlcjsiLCJIZWxwQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEhlbHBDb250cm9sbGVyO1xuSGVscENvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBIZWxwVmlldygpO1xuXG5mdW5jdGlvbiBIZWxwQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5sb2FkVmlldygpO1xufVxuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgYmFja0J1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuQkFDS19CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gbmV3IE1lbnVDb250cm9sbGVyKCk7XG4gICAgfSk7XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBDb250cm9sbGVyOyIsIk1lbnVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gTWVudUNvbnRyb2xsZXI7XG5NZW51Q29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IE1lbnVWaWV3KCk7XG5cbmZ1bmN0aW9uIE1lbnVDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmxvYWRWaWV3KCk7XG59XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbn07XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBwbGF5QnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5QTEFZX0JVVFRPTl07XG4gICAgdmFyIGhlbHBCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LkhFTFBfQlVUVE9OXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIocGxheUJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gbmV3IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIoKTtcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoaGVscEJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWxwQ29udHJvbGxlciA9IG5ldyBIZWxwQ29udHJvbGxlcigpO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51Q29udHJvbGxlcjsiLCJUdXJuQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IFR1cm5Db250cm9sbGVyO1xuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBUdXJuQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlciA9IGRpY2VDb250cm9sbGVyO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyID0gcXVlc3Rpb25Db250cm9sbGVyO1xuICAgIHRoaXMud2luVmlldyA9IG5ldyBXaW5WaWV3KCk7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIHRoaXMubmV3VHVybigpO1xufVxuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uSU5JVF9ORVdfVFVSTiwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGggPT09IDApIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtaXR0ZWQgcGxheWVyIDIgYXMgd2lubmVyIVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdBTUVfRU5ERUQsIHt3aW5uZXI6IFwiUExBWUVSXzJcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoID09PSAwKSB7XG4gICAgICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWl0dGVkIHBsYXllciAxIGFzIHdpbm5lciFcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HQU1FX0VOREVELCB7d2lubmVyOiBcIlBMQVlFUl8xXCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdUdXJuKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDE1MDApO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uR0FNRV9TVEFUUywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgd2luIHZpZXchXCIpO1xuICAgICAgICB0aGlzLmxvYWRXaW5WaWV3KGRhdGEud2lubmVyLCBkYXRhKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRXaW5WaWV3ID0gZnVuY3Rpb24ocGxheWVyLCBkYXRhKSB7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLndpblZpZXcuY3JlYXRlV2lubmVyVGV4dChwbGF5ZXIsIGRhdGEpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLndpblZpZXcpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZXdFbGVtZW50cyA9IHRoaXMud2luVmlldy5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cygpOyAgXG4gICAgdmFyIHBsYXlBZ2FpbkJ1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLndpblZpZXcuUExBWV9BR0FJTl9CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihwbGF5QWdhaW5CdXR0b24sIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB2YXIgYXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlciA9IG5ldyBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyKCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5uZXdUdXJuID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmRpY2VDb250cm9sbGVyLnJvbGxEaWNlKCk7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0uYmluZCh0aGlzKSwgMzAwMCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuY2hlY2tQbGF5ZXJzSGVhbHRoID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUExBWUVSU19IRUFMVEgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUdXJuQ29udHJvbGxlcjsiLCJEaWNlQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IERpY2VDb250cm9sbGVyO1xuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgRGljZVZpZXcoKTtcblxuZnVuY3Rpb24gRGljZUNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkRJQ0VfTlVNQkVSLCBmdW5jdGlvbihkaWNlKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlSb2xsRGljZVNvdW5kKCk7XG4gICAgICAgIHRoaXMubG9hZERpY2UoZGljZS5udW1iZXIpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUucm9sbERpY2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuUk9MTF9ESUNFKTtcbiAgICB9XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUubG9hZERpY2UgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgdGhpcy52aWV3LnNldHVwRGljZShkaWNlTnVtYmVyKTtcbiAgICB0aGlzLnNldERpY2VOdW1iZXIoZGljZU51bWJlcik7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpY2VDb250cm9sbGVyOyIsIlBsYXllckNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBQbGF5ZXJDb250cm9sbGVyO1xuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IFBsYXllclZpZXcoKTtcblxuZnVuY3Rpb24gUGxheWVyQ29udHJvbGxlcihwbGF5ZXJEYXRhKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuc2V0UGxheWVyRGF0YShwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG59XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3LnNldFBsYXllckRhdGEodGhpcy5wbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBsYXllcnNIZWFsdGgoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlBMQVlFUlNfSEVBTFRILCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuY2xlYXJJbnRlcnZhbHMoKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFBsYXllcjFIZWFsdGgocGxheWVyRGF0YS5wbGF5ZXIxSGVhbHRoKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFBsYXllcjJIZWFsdGgocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoKTtcbiAgICAgICAgaWYocGxheWVyRGF0YS5wbGF5ZXIxSGVhbHRoIDw9IDUpIHtcbiAgICAgICAgICAgIHRoaXMudmlldy5mbGFzaFBsYXllcjFIZWFsdGgoKTtcbiAgICAgICAgfVxuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjJIZWFsdGggPD0gNSkge1xuICAgICAgICAgICAgdGhpcy52aWV3LmZsYXNoUGxheWVyMkhlYWx0aCgpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVBsYXllcnNIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9QTEFZRVJTX0hFQUxUSCk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFySW50ZXJ2YWxzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3LmNsZWFySW50ZXJ2YWxzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllckNvbnRyb2xsZXI7IiwiUXVlc3Rpb25Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gUXVlc3Rpb25Db250cm9sbGVyO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlKTtcblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBRdWVzdGlvblZpZXcoKTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8xID0gJ0FOU1dFUkVEXzEnO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8yID0gJ0FOU1dFUkVEXzInO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8zID0gJ0FOU1dFUkVEXzMnO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF80ID0gJ0FOU1dFUkVEXzQnO1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLlRJTUVfVE9fQU5TV0VSX1FVRVNUSU9OID0gMTA7XG5cbmZ1bmN0aW9uIFF1ZXN0aW9uQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlJBTkRPTV9RVUVTVElPTiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gZGF0YS5xdWVzdGlvbjtcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGRhdGEuY2F0ZWdvcnk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uREFNQUdFX0RFQUxULCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJUb0NvbG91cih0aGlzLmFuc3dlcnNbcGxheWVyRGF0YS5hbnN3ZXJdLCBwbGF5ZXJEYXRhLmFuc3dlcik7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJUb0NvbG91cih0aGlzLmFuc3dlcnNbdGhpcy5BTlNXRVJFRF8xXSwgdGhpcy5BTlNXRVJFRF8xKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFdob0Fuc3dlcmVkUXVlc3Rpb24odGhpcy5hbnN3ZXJzW3BsYXllckRhdGEuYW5zd2VyXSwgcGxheWVyRGF0YS5hbnN3ZXIsIHBsYXllckRhdGEucGxheWVyX3dob19hbnN3ZXJlZCk7XG4gICAgICAgIHRoaXMudmlldy50dXJuT2ZmSW50ZXJhY3Rpdml0eUZvckFuc3dlckVsZW1lbnRzKCk7XG4gICAgICAgIHRoaXMucGxheWVyQ29udHJvbGxlci51cGRhdGVQbGF5ZXJzSGVhbHRoKCk7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lckludGVydmFsSWQpO1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ORVdfVFVSTik7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5TSFVGRkxFRF9BTlNXRVJfSU5ESUNFUywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnZpZXcuc2V0QW5zd2VySW5kaWNlcyhkYXRhKTtcbiAgICAgICAgdGhpcy52aWV3LmRpc3BsYXlDYXRlZ29yeUFuZFF1ZXN0aW9uKHRoaXMuY2F0ZWdvcnksIHRoaXMucXVlc3Rpb24pO1xuICAgICAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySW50ZXJ2YWxJZCk7XG4gICAgdGhpcy5nZXRSYW5kb21RdWVzdGlvbigpO1xuICAgIHRoaXMuc2h1ZmZsZUFuc3dlckluZGljZXMoKTtcbiAgICB0aGlzLnVwZGF0ZVRpbWVyKCk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVRpbWVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRpbWVSZW1haW5pbmcgPSAxMDtcbiAgICB2YXIgdGltZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGltZVJlbWFpbmluZyA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlUXVlc3Rpb25UaW1lcih0aW1lUmVtYWluaW5nKTtcbiAgICAgICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlUaWNrU291bmQoKTtcbiAgICAgICAgICAgIHRpbWVSZW1haW5pbmctLTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0Lk5FV19UVVJOKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lckludGVydmFsSWQpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuICAgIHRoaXMudGltZXJJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwodGltZXIsIDEwMDApO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5nZXRSYW5kb21RdWVzdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdmFyIGNhdGVnb3JpZXMgPSB0aGlzLmNhdGVnb3J5RGF0YS5DQVRFR09SSUVTO1xuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5xdWVzdGlvbkRhdGEuQ0FURUdPUklFUztcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUkFORE9NX1FVRVNUSU9OLCB7Y2F0ZWdvcmllczogY2F0ZWdvcmllcywgcXVlc3Rpb25zOiBxdWVzdGlvbnN9KTtcbiAgICB9XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuc3dlcnMgPSB0aGlzLmdldFZpZXdBbnN3ZXJzKCk7XG4gICAgdGhpcy5zZXRSaWdodEFuc3dlckxpc3RlbmVyKGFuc3dlcnMpO1xuICAgIHRoaXMuc2V0V3JvbmdBbnN3ZXJMaXN0ZW5lcnMoYW5zd2Vycyk7XG4gICAgdGhpcy5zZXRBbnN3ZXJVcGRhdGVMaXN0ZW5lcihhbnN3ZXJzKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0Vmlld0Fuc3dlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7XG4gICAgdmFyIGFuc3dlcnMgPSB7fTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzEgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlJJR0hUX0FOU1dFUl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8yID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMV07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8zID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF80ID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfM107XG4gICAgcmV0dXJuIGFuc3dlcnM7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFJpZ2h0QW5zd2VyTGlzdGVuZXIgPSBmdW5jdGlvbihhbnN3ZXJzKSB7XG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfMSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlDb3JyZWN0QW5zd2VyU291bmQoKTtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvT3Bwb25lbnRUb1NvY2tldCh0aGlzLkFOU1dFUkVEXzEpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFdyb25nQW5zd2VyTGlzdGVuZXJzID0gZnVuY3Rpb24oYW5zd2Vycykge1xuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8yKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzMsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8zKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF80KTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zaHVmZmxlQW5zd2VySW5kaWNlcyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LlNIVUZGTEVfQU5TV0VSX0lORElDRVMsIHtpbmRpY2VzOiBbMSwyLDMsNF19KTtcbiAgICB9XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldEFuc3dlclVwZGF0ZUxpc3RlbmVyID0gZnVuY3Rpb24oYW5zd2Vycykge1xuICAgIHRoaXMuYW5zd2VycyA9IGFuc3dlcnM7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmVtaXREZWFsRGFtYWdlVG9PcHBvbmVudFRvU29ja2V0ID0gZnVuY3Rpb24oYW5zd2VyKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ERUFMX0RBTUFHRSwge3BsYXllcl93aG9fYW5zd2VyZWQ6IHRoaXMuZ2V0UGxheWVyKCksIHBsYXllcl90b19kYW1hZ2U6IHRoaXMuZ2V0T3Bwb25lbnQoKSwgZGFtYWdlOiB0aGlzLmRpY2VOdW1iZXIsIGFuc3dlcjogYW5zd2VyLCBhbnN3ZXJTdGF0dXM6ICdjb3JyZWN0JywgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnl9KTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZW1pdERlYWxEYW1hZ2VUb1NlbGZUb1NvY2tldCA9IGZ1bmN0aW9uKGFuc3dlcikge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuREVBTF9EQU1BR0UsIHtwbGF5ZXJfd2hvX2Fuc3dlcmVkOiB0aGlzLmdldFBsYXllcigpLCBwbGF5ZXJfdG9fZGFtYWdlOiB0aGlzLmdldFBsYXllcigpLCBkYW1hZ2U6IHRoaXMuZGljZU51bWJlciwgYW5zd2VyOiBhbnN3ZXIsIGFuc3dlclN0YXR1czogJ2luY29ycmVjdCcsIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5fSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbkNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gQnVja2V0TG9hZGVyIChjYWxsYmFjaywgZXJyb3JDYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBQT1JUUkFJVCA9IFwicG9ydHJhaXRcIixcbiAgICAgICAgTEFORFNDQVBFID0gXCJsYW5kc2NhcGVcIixcbiAgICAgICAgQlVDS0VUX1NJWkVfSlNPTl9QQVRIID0gXCJyZXNvdXJjZS9idWNrZXRfc2l6ZXMuanNvblwiO1xuXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbmV3IEpzb25Mb2FkZXIoQlVDS0VUX1NJWkVfSlNPTl9QQVRILCBjYWxjdWxhdGVCZXN0QnVja2V0KTtcbiAgICB9KSgpO1xuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlU2NhbGUgKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5mbG9vcih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyksIDIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUJlc3RCdWNrZXQgKGJ1Y2tldERhdGEpIHtcbiAgICAgICAgdmFyIG9yaWVudGF0aW9uID0gY2FsY3VsYXRlT3JpZW50YXRpb24oKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJPcmllbnRhdGlvbiBpcyBcIiArIG9yaWVudGF0aW9uKTtcbiAgICAgICAgYnVja2V0RGF0YVtvcmllbnRhdGlvbl0uZm9yRWFjaChmdW5jdGlvbiAoYnVja2V0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJ1Y2tldCBoZWlnaHQ6IFwiICsgYnVja2V0LmhlaWdodCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldpbmRvdyBoZWlnaHQ6IFwiICsgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIGlmIChidWNrZXQuaGVpZ2h0IDw9IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgICAgICAgIERpc3BsYXkuYnVja2V0ID0gYnVja2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2hvc2VuIGJ1Y2tldCBpcyBcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKERpc3BsYXkuYnVja2V0KTtcbiAgICAgICAgRGlzcGxheS5zY2FsZSA9IGNhbGN1bGF0ZVNjYWxlKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgRGlzcGxheS5yZXNvdXJjZVBhdGggPSBEaXNwbGF5LmJ1Y2tldC53aWR0aCArICd4JyArIERpc3BsYXkuYnVja2V0LmhlaWdodDtcbiAgICAgICAgZXhlY3V0ZUNhbGxiYWNrKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU9yaWVudGF0aW9uICgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XG4gICAgICAgICAgICByZXR1cm4gUE9SVFJBSVQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTEFORFNDQVBFO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhlY3V0ZUNhbGxiYWNrICgpIHtcbiAgICAgICAgaWYgKERpc3BsYXkuYnVja2V0ID09PSBudWxsKSB7XG4gICAgICAgICAgICBlcnJvckNhbGxiYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1Y2tldExvYWRlcjsiLCJ2YXIgSW1hZ2VMb2FkZXIgPSBmdW5jdGlvbihpbWFnZUpzb25QYXRoLCBjYWxsYmFjaykge1xuICAgIHZhciBqc29uTG9hZGVyID0gbmV3IEpzb25Mb2FkZXIoaW1hZ2VKc29uUGF0aCwgbG9hZEltYWdlcyk7XG4gICAgdmFyIGltYWdlc0xvYWRlZCA9IDA7XG4gICAgdmFyIHRvdGFsSW1hZ2VzID0gMDtcbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKGltYWdlRGF0YSkge1xuICAgICAgICB2YXIgaW1hZ2VzID0gaW1hZ2VEYXRhLklNQUdFUztcbiAgICAgICAgY291bnROdW1iZXJPZkltYWdlcyhpbWFnZXMpO1xuICAgICAgICBmb3IodmFyIGltYWdlIGluIGltYWdlcykge1xuICAgICAgICAgICAgbG9hZEltYWdlKGltYWdlc1tpbWFnZV0ucGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlKGltYWdlUGF0aCkge1xuICAgICAgICB2YXIgUkVRVUVTVF9GSU5JU0hFRCA9IDQ7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGltYWdlUGF0aCwgdHJ1ZSk7XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSBSRVFVRVNUX0ZJTklTSEVEKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmluaXNoZWQgbG9hZGluZyBpbWFnZSBwYXRoOiBcIiArIGltYWdlUGF0aCk7XG4gICAgICAgICAgICAgIGltYWdlc0xvYWRlZCsrO1xuICAgICAgICAgICAgICBjaGVja0lmQWxsSW1hZ2VzTG9hZGVkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjb3VudE51bWJlck9mSW1hZ2VzKGltYWdlcykge1xuICAgICAgICBmb3IodmFyIGltYWdlIGluIGltYWdlcykge1xuICAgICAgICAgICAgdG90YWxJbWFnZXMrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjaGVja0lmQWxsSW1hZ2VzTG9hZGVkKCkge1xuICAgICAgICBpZihpbWFnZXNMb2FkZWQgPT09IHRvdGFsSW1hZ2VzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFsbCBpbWFnZXMgbG9hZGVkIVwiKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9ubHkgXCIgKyBpbWFnZXNMb2FkZWQgKyBcIiBhcmUgbG9hZGVkLlwiKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VMb2FkZXI7IiwidmFyIEpzb25Mb2FkZXIgPSBmdW5jdGlvbiAocGF0aCwgY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgIFJFUVVFU1RfRklOSVNIRUQgPSA0O1xuICAgIChmdW5jdGlvbiBsb2FkSnNvbigpIHtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIub3BlbignR0VUJywgcGF0aCwgdHJ1ZSk7XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSBSRVFVRVNUX0ZJTklTSEVEKSB7XG4gICAgICAgICAgICB0aGF0LmRhdGEgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgY2FsbGJhY2sodGhhdC5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSkoKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGF0LmRhdGE7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBKc29uTG9hZGVyO1xuIiwiZnVuY3Rpb24gVmlld0xvYWRlcigpIHt9XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24odmlldykge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIuYWRkQ2hpbGQodmlldyk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5yZW1vdmVBbGxWaWV3cyA9IGZ1bmN0aW9uKCkge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIucmVtb3ZlQ2hpbGRyZW4oKTtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnJlbW92ZVZpZXcgPSBmdW5jdGlvbih2aWV3KSB7XG4gICAgVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lci5yZW1vdmVDaGlsZCh2aWV3KTtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnNldFJlbmRlcmVyID0gZnVuY3Rpb24ocmVuZGVyZXIpIHtcbiAgICBWaWV3TG9hZGVyLnByb3RvdHlwZS5yZW5kZXJlciA9IHJlbmRlcmVyO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUuc2V0Q29udGFpbmVyID0gZnVuY3Rpb24oY29udGFpbmVyKSB7XG4gICAgVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lciA9IGNvbnRhaW5lcjtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbigpIHtcbiAgICBWaWV3TG9hZGVyLnByb3RvdHlwZS5yZW5kZXJlci5yZW5kZXIoVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lcik7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKFZpZXdMb2FkZXIucHJvdG90eXBlLmFuaW1hdGUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TG9hZGVyOyIsInZhciBEaXNwbGF5ID0ge1xuICAgIGJ1Y2tldDogbnVsbCxcbiAgICBzY2FsZTogbnVsbCxcbiAgICByZXNvdXJjZVBhdGg6IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGxheTsiLCJBdmF0YXJTZWxlY3Rpb25WaWV3LmNvbnN0cnVjdG9yID0gQXZhdGFyU2VsZWN0aW9uVmlldztcbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLkJBQ0tfQlVUVE9OID0gMDtcbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLlNFTEVDVF9VUCA9IDE7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5TRUxFQ1RfRE9XTiA9IDI7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5GSU5EX0dBTUUgPSAzO1xuXG5cbmZ1bmN0aW9uIEF2YXRhclNlbGVjdGlvblZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQVZBVEFSX1NFTEVDVElPTjtcbiAgICB2YXIgY29tbW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQ09NTU9OO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlTG9nbyhjb21tb25EYXRhLkxPR08pO1xuICAgIHRoaXMuY3JlYXRlQmFja0J1dHRvbihsYXlvdXREYXRhLkJBQ0tfQlVUVE9OKTtcbiAgICB0aGlzLmNyZWF0ZVNlbGVjdERvd25CdXR0b24obGF5b3V0RGF0YS5TRUxFQ1RfRE9XTik7XG4gICAgdGhpcy5jcmVhdGVTZWxlY3RVcEJ1dHRvbihsYXlvdXREYXRhLlNFTEVDVF9VUCk7XG4gICAgdGhpcy5jcmVhdGVGaW5kR2FtZUJ1dHRvbihsYXlvdXREYXRhLkZJTkRfR0FNRSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVMb2dvID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgbG9nbyA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihsb2dvLCBkYXRhKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUJhY2tCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuYmFja0J1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmJhY2tCdXR0b24sIGRhdGEpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlU2VsZWN0RG93bkJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5zZWxlY3REb3duQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuc2VsZWN0RG93bkJ1dHRvbiwgZGF0YSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVTZWxlY3RVcEJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5zZWxlY3RVcEJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnNlbGVjdFVwQnV0dG9uLCBkYXRhKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUZpbmRHYW1lQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmZpbmRHYW1lQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuZmluZEdhbWVCdXR0b24sIGRhdGEpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuYmFja0J1dHRvbiwgdGhpcy5zZWxlY3RVcEJ1dHRvbiwgdGhpcy5zZWxlY3REb3duQnV0dG9uLCB0aGlzLmZpbmRHYW1lQnV0dG9uXTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXZhdGFyU2VsZWN0aW9uVmlldzsiLCJGaW5kR2FtZVZpZXcuY29uc3RydWN0b3IgPSBGaW5kR2FtZVZpZXc7XG5GaW5kR2FtZVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIEZpbmRHYW1lVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkZJTkRfR0FNRTtcbiAgICB2YXIgYXZhdGFyRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQVZBVEFSO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlRmluZEdhbWVDYXB0aW9uKGxheW91dERhdGEuQ0FQVElPTik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxQXZhdGFyKGF2YXRhckRhdGFbYXZhdGFyXSwgbGF5b3V0RGF0YS5QTEFZRVJfMV9BVkFUQVIpO1xuICAgIHRoaXMuY3JlYXRlVmVyc3VzVGV4dChsYXlvdXREYXRhLlZFUlNVUyk7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIyVW5rbm93bkF2YXRhcihhdmF0YXJEYXRhLlBMQVlFUl8yX1VOS05PV04sIGxheW91dERhdGEuUExBWUVSXzJfQVZBVEFSKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFUZXh0KGxheW91dERhdGEuUExBWUVSXzEpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMlRleHQobGF5b3V0RGF0YS5QTEFZRVJfMik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZUZpbmRHYW1lQ2FwdGlvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5maW5kR2FtZUNhcHRpb24gPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuZmluZEdhbWVDYXB0aW9uLCBkYXRhKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMUF2YXRhciA9IGZ1bmN0aW9uIChhdmF0YXIsIGRhdGEpIHtcbiAgICB2YXIgcGxheWVyMUF2YXRhciA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChhdmF0YXIpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjFBdmF0YXIsIGRhdGEpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVWZXJzdXNUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgdmVyc3VzID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih2ZXJzdXMsIGRhdGEpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyVW5rbm93bkF2YXRhciA9IGZ1bmN0aW9uIChhdmF0YXIsIGRhdGEpIHtcbiAgICB0aGlzLnBsYXllcjJVbmtub3duQXZhdGFyID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGF2YXRhcik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIyVW5rbm93bkF2YXRhciwgZGF0YSk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgcGxheWVyMSA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMSwgZGF0YSk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgcGxheWVyMiA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMiwgZGF0YSk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJBY3R1YWxBdmF0YXIgPSBmdW5jdGlvbiAoYXZhdGFyKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMucGxheWVyMlVua25vd25BdmF0YXIpO1xuICAgIHZhciBwbGF5ZXIyVW5rbm93bkF2YXRhciA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkFWQVRBUlthdmF0YXJdKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyVW5rbm93bkF2YXRhciwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5GSU5EX0dBTUUuUExBWUVSXzJfQVZBVEFSKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlR2FtZUZvdW5kQ2FwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5maW5kR2FtZUNhcHRpb24pO1xuICAgIHZhciBmb3VuZEdhbWVDYXB0aW9uID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkZJTkRfR0FNRS5GT1VORF9HQU1FX0NBUFRJT04pO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGZvdW5kR2FtZUNhcHRpb24sIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRklORF9HQU1FLkZPVU5EX0dBTUVfQ0FQVElPTik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmluZEdhbWVWaWV3OyIsIkhlbHBWaWV3LmNvbnN0cnVjdG9yID0gSGVscFZpZXc7XG5IZWxwVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuSGVscFZpZXcucHJvdG90eXBlLkJBQ0tfQlVUVE9OID0gMDtcblxuZnVuY3Rpb24gSGVscFZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuSGVscFZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkhFTFA7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVIZWxwVGV4dChsYXlvdXREYXRhLklORk8pO1xuICAgIHRoaXMuY3JlYXRlQmFja0J1dHRvbihsYXlvdXREYXRhLkJBQ0tfQlVUVE9OKTtcbn07XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5jcmVhdGVIZWxwVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGhlbHBUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihoZWxwVGV4dCwgZGF0YSk7XG59O1xuXG5IZWxwVmlldy5wcm90b3R5cGUuY3JlYXRlQmFja0J1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5iYWNrQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYmFja0J1dHRvbiwgZGF0YSk7XG59O1xuXG5IZWxwVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuYmFja0J1dHRvbl07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBWaWV3OyIsIkxvYWRpbmdWaWV3LmNvbnN0cnVjdG9yID0gTG9hZGluZ1ZpZXc7XG5Mb2FkaW5nVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gTG9hZGluZ1ZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuTG9hZGluZ1ZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkxPQURJTkc7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVMb2FkaW5nVGV4dChsYXlvdXREYXRhLkxPQURJTkdfVEVYVCk7XG59O1xuXG5Mb2FkaW5nVmlldy5wcm90b3R5cGUuY3JlYXRlTG9hZGluZ1RleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgbG9hZGluZyB0ZXh0Li4uXCIpO1xuICAgIHZhciBsb2FkaW5nVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIobG9hZGluZ1RleHQsIGRhdGEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nVmlldzsiLCJNZW51Vmlldy5jb25zdHJ1Y3RvciA9IE1lbnVWaWV3O1xuTWVudVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5QTEFZX0JVVFRPTiA9IDA7XG5NZW51Vmlldy5wcm90b3R5cGUuSEVMUF9CVVRUT04gPSAxO1xuXG5mdW5jdGlvbiBNZW51VmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5NZW51Vmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuTUVOVTtcbiAgICB2YXIgY29tbW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQ09NTU9OO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlTG9nbyhjb21tb25EYXRhLkxPR08pO1xuICAgIHRoaXMuY3JlYXRlUGxheUJ1dHRvbihsYXlvdXREYXRhLlBMQVlfQlVUVE9OKTtcbiAgICB0aGlzLmNyZWF0ZUhlbHBCdXR0b24obGF5b3V0RGF0YS5IRUxQX0JVVFRPTik7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlTG9nbyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGxvZ28gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIobG9nbywgZGF0YSk7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlUGxheUJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5wbGF5QnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheUJ1dHRvbiwgZGF0YSk7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlSGVscEJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5oZWxwQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuaGVscEJ1dHRvbiwgZGF0YSk7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMucGxheUJ1dHRvbiwgdGhpcy5oZWxwQnV0dG9uXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXc7IiwiVmlldy5jb25zdHJ1Y3RvciA9IFZpZXc7XG5WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblZpZXcucHJvdG90eXBlLklOVEVSQUNUSVZFID0gdHJ1ZTtcblZpZXcucHJvdG90eXBlLkNFTlRFUl9BTkNIT1IgPSAwLjU7XG5cbmZ1bmN0aW9uIFZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuVmlldy5wcm90b3R5cGUuYWRkRWxlbWVudFRvQ29udGFpbmVyID0gZnVuY3Rpb24oZWxlbWVudCwgcG9zaXRpb25EYXRhKSB7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb24oZWxlbWVudCwgcG9zaXRpb25EYXRhKTtcbiAgICBlbGVtZW50LmFuY2hvci54ID0gdGhpcy5DRU5URVJfQU5DSE9SO1xuICAgIGVsZW1lbnQuYW5jaG9yLnkgPSB0aGlzLkNFTlRFUl9BTkNIT1I7XG4gICAgZWxlbWVudC5pbnRlcmFjdGl2ZSA9IHRoaXMuSU5URVJBQ1RJVkU7XG4gICAgdGhpcy5hZGRDaGlsZChlbGVtZW50KTtcbn07XG5cblZpZXcucHJvdG90eXBlLnNldEVsZW1lbnRQb3NpdGlvbiA9IGZ1bmN0aW9uKGVsZW1lbnQsIHBvc2l0aW9uRGF0YSkge1xuICAgIGVsZW1lbnQucG9zaXRpb24ueCA9IHBvc2l0aW9uRGF0YS54O1xuICAgIGVsZW1lbnQucG9zaXRpb24ueSA9IHBvc2l0aW9uRGF0YS55O1xufTtcblxuVmlldy5wcm90b3R5cGUuY3JlYXRlVGV4dEVsZW1lbnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQSVhJLlRleHQoZGF0YS50ZXh0LCB7Zm9udDogZGF0YS5zaXplICsgXCJweCBcIiArIGRhdGEuZm9udCwgZmlsbDogZGF0YS5jb2xvcn0pO1xufTtcblxuVmlldy5wcm90b3R5cGUuY3JlYXRlU3ByaXRlRWxlbWVudCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShkYXRhLnBhdGgpO1xufTtcblxuVmlldy5wcm90b3R5cGUucmVtb3ZlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIHRoaXMuYWRkQ2hpbGQoZWxlbWVudCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5yZW1vdmVBbGxFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcblxuIiwiQXZhdGFyVmlldy5jb25zdHJ1Y3RvciA9IEF2YXRhclZpZXc7XG5BdmF0YXJWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5BdmF0YXJWaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5cbmZ1bmN0aW9uIEF2YXRhclZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuQXZhdGFyVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbihhdmF0YXJOYW1lKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkFWQVRBUjtcbiAgICB2YXIgY29tbW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQ09NTU9OO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlQXZhdGFyKGxheW91dERhdGFbYXZhdGFyTmFtZV0pO1xufTtcblxuQXZhdGFyVmlldy5wcm90b3R5cGUuY3JlYXRlQXZhdGFyID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5hdmF0YXIpO1xuICAgIHRoaXMuYXZhdGFyID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYXZhdGFyLCBkYXRhKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXZhdGFyVmlldzsiLCJEaWNlVmlldy5jb25zdHJ1Y3RvciA9IERpY2VWaWV3O1xuRGljZVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIERpY2VWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkRpY2VWaWV3LnByb3RvdHlwZS5zZXR1cERpY2UgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgdmFyIGRpY2VJbWFnZSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRElDRVtkaWNlTnVtYmVyXTtcbiAgICB2YXIgZGljZVBvc2l0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRElDRS5DT09SRFM7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVEaWNlRWxlbWVudChkaWNlSW1hZ2UsIGRpY2VQb3NpdGlvbkRhdGEpO1xufTtcblxuRGljZVZpZXcucHJvdG90eXBlLmNyZWF0ZURpY2VFbGVtZW50ID0gZnVuY3Rpb24oZGljZUltYWdlLCBkaWNlUG9zaXRpb25EYXRhKSB7XG4gICAgdGhpcy5kaWNlRWxlbWVudCA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkaWNlSW1hZ2UpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuZGljZUVsZW1lbnQsIGRpY2VQb3NpdGlvbkRhdGEpO1xufTtcblxuRGljZVZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGljZVZpZXc7IiwiUGxheWVyVmlldy5jb25zdHJ1Y3RvciA9IFBsYXllclZpZXc7XG5QbGF5ZXJWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBQbGF5ZXJWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cblBsYXllclZpZXcucHJvdG90eXBlLnNldFBsYXllckRhdGEgPSBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXJEYXRhID0gcGxheWVyRGF0YTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXllckxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUjtcbiAgICB2YXIgYXZhdGFyRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQVZBVEFSO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlUGxheWVyMUF2YXRhcihhdmF0YXJEYXRhW3RoaXMucGxheWVyRGF0YS5wbGF5ZXIxQXZhdGFyXSwgcGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9BVkFUQVIpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMUhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX0hFQUxUSCk7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIyQXZhdGFyKGF2YXRhckRhdGFbdGhpcy5wbGF5ZXJEYXRhLnBsYXllcjJBdmF0YXJdLCBwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX0FWQVRBUik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIySGVhbHRoKHBsYXllckxheW91dERhdGEuUExBWUVSXzJfSEVBTFRIKTtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFUZXh0KHBsYXllckxheW91dERhdGEuUExBWUVSXzFfVEVYVCk7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIyVGV4dChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX1RFWFQpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMUF2YXRhciA9IGZ1bmN0aW9uKGF2YXRhciwgYXZhdGFyUG9zaXRpb24pIHtcbiAgICB0aGlzLnBsYXllcjFBdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoYXZhdGFyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFBdmF0YXIsIGF2YXRhclBvc2l0aW9uKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJBdmF0YXIgPSBmdW5jdGlvbihhdmF0YXIsIGF2YXRhclBvc2l0aW9uKSB7XG4gICAgdGhpcy5wbGF5ZXIxQXZhdGFyID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGF2YXRhcik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxQXZhdGFyLCBhdmF0YXJQb3NpdGlvbik7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxSGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoRGF0YSkge1xuICAgIHRoaXMucGxheWVyMUhlYWx0aFRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGhlYWx0aERhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMUhlYWx0aFRleHQsIGhlYWx0aERhdGEpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMkhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aERhdGEpIHtcbiAgICB0aGlzLnBsYXllcjJIZWFsdGhUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChoZWFsdGhEYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJIZWFsdGhUZXh0LCBoZWFsdGhEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFUZXh0ID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIHRoaXMucGxheWVyMVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHBsYXllckRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMVRleHQsIHBsYXllckRhdGEpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMlRleHQgPSBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIyVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQocGxheWVyRGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIyVGV4dCwgcGxheWVyRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5zZXRQbGF5ZXIxSGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoKSB7XG4gICAgdmFyIHBsYXllcjFIZWFsdGhEYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5QTEFZRVIuUExBWUVSXzFfSEVBTFRIO1xuICAgIHRoaXMucGxheWVyMUhlYWx0aFRleHQudGV4dCA9IHBsYXllcjFIZWFsdGhEYXRhLnRleHQgKyBoZWFsdGg7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5zZXRQbGF5ZXIySGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoKSB7XG4gICAgdmFyIHBsYXllcjJIZWFsdGhEYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5QTEFZRVIuUExBWUVSXzJfSEVBTFRIO1xuICAgIHRoaXMucGxheWVyMkhlYWx0aFRleHQudGV4dCA9IHBsYXllcjJIZWFsdGhEYXRhLnRleHQgKyBoZWFsdGg7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5mbGFzaFBsYXllcjFIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVyTGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSO1xuICAgIHZhciBwbGF5ZXIxSGVhbHRoID0gdGhpcy5wbGF5ZXIxSGVhbHRoVGV4dC50ZXh0LnNsaWNlKC0xKTtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyMkhlYWx0aEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXJlbW92ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjFIZWFsdGhUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyMUhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX0hFQUxUSCk7XG4gICAgICAgICAgICB0aGlzLnNldFBsYXllcjFIZWFsdGgocGxheWVyMUhlYWx0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlZCA9ICFyZW1vdmVkO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmZsYXNoUGxheWVyMkhlYWx0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5ZXJMYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5QTEFZRVI7XG4gICAgdmFyIHBsYXllcjJIZWFsdGggPSB0aGlzLnBsYXllcjFIZWFsdGhUZXh0LnRleHQuc2xpY2UoLTEpO1xuICAgIHZhciByZW1vdmVkID0gZmFsc2U7XG4gICAgdGhpcy5wbGF5ZXIxSGVhbHRoSW50ZXJ2YWxJZCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZighcmVtb3ZlZCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMucGxheWVyMkhlYWx0aFRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVQbGF5ZXIySGVhbHRoKHBsYXllckxheW91dERhdGEuUExBWUVSXzJfSEVBTFRIKTtcbiAgICAgICAgICAgIHRoaXMuc2V0UGxheWVyMkhlYWx0aChwbGF5ZXIySGVhbHRoKTtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVkID0gIXJlbW92ZWQ7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDApO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY2xlYXJJbnRlcnZhbHMgPSBmdW5jdGlvbigpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMucGxheWVyMUhlYWx0aEludGVydmFsSWQpO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5wbGF5ZXIySGVhbHRoSW50ZXJ2YWxJZCk7XG4gICAgY29uc29sZS5sb2coXCJJbnRlcnZhbHMgY2xlYXJlZC5cIik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclZpZXc7IiwiUXVlc3Rpb25WaWV3LmNvbnN0cnVjdG9yID0gUXVlc3Rpb25WaWV3O1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLlJJR0hUX0FOU1dFUiA9IDA7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLldST05HX0FOU1dFUl8xID0gMTtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuV1JPTkdfQU5TV0VSXzIgPSAyO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5XUk9OR19BTlNXRVJfMyA9IDM7XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSX1BSRUZJWCA9IFwiQU5TV0VSX1wiO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5BTlNXRVJFRF9QUkVGSVggPSBcIkFOU1dFUkVEX1wiO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5BTlNXRVJFRF9TVUZGSVggPSBcIl9BTlNXRVJFRFwiO1xuXG5mdW5jdGlvbiBRdWVzdGlvblZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5kaXNwbGF5Q2F0ZWdvcnlBbmRRdWVzdGlvbiA9IGZ1bmN0aW9uKGNhdGVnb3J5LCBxdWVzdGlvbikge1xuICAgIHZhciBxdWVzdGlvbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OO1xuICAgIHRoaXMuY3JlYXRlQ2F0ZWdvcnlFbGVtZW50KGNhdGVnb3J5LCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLkNBVEVHT1JZKTtcbiAgICB0aGlzLmNyZWF0ZVF1ZXN0aW9uRWxlbWVudChxdWVzdGlvbi50ZXh0LCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLlFVRVNUSU9OX1BPU0lUSU9OKTtcbiAgICB0aGlzLmNyZWF0ZVJpZ2h0QW5zd2VyRWxlbWVudChxdWVzdGlvbi5yaWdodF9hbnN3ZXIsIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT05bdGhpcy5BTlNXRVJfUFJFRklYICsgdGhpcy5hbnN3ZXJJbmRpY2VzWzBdXSk7XG4gICAgdGhpcy5jcmVhdGVXcm9uZ0Fuc3dlckVsZW1lbnQxKHF1ZXN0aW9uLndyb25nX2Fuc3dlcl8xLCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OW3RoaXMuQU5TV0VSX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1sxXV0pO1xuICAgIHRoaXMuY3JlYXRlV3JvbmdBbnN3ZXJFbGVtZW50MihxdWVzdGlvbi53cm9uZ19hbnN3ZXJfMiwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTlt0aGlzLkFOU1dFUl9QUkVGSVggKyB0aGlzLmFuc3dlckluZGljZXNbMl1dKTtcbiAgICB0aGlzLmNyZWF0ZVdyb25nQW5zd2VyRWxlbWVudDMocXVlc3Rpb24ud3JvbmdfYW5zd2VyXzMsIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT05bdGhpcy5BTlNXRVJfUFJFRklYICsgdGhpcy5hbnN3ZXJJbmRpY2VzWzNdXSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnNldEFuc3dlckluZGljZXMgPSBmdW5jdGlvbihhbnN3ZXJJbmRpY2VzKSB7XG4gICAgdGhpcy5hbnN3ZXJJbmRpY2VzID0gYW5zd2VySW5kaWNlcztcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQ2F0ZWdvcnlFbGVtZW50ID0gZnVuY3Rpb24oY2F0ZWdvcnksIGNhdGVnb3J5RGF0YSkge1xuICAgIGNhdGVnb3J5RGF0YS50ZXh0ID0gY2F0ZWdvcnk7XG4gICAgdGhpcy5jYXRlZ29yeUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGNhdGVnb3J5RGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5jYXRlZ29yeUVsZW1lbnQsIGNhdGVnb3J5RGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZVF1ZXN0aW9uRWxlbWVudCA9IGZ1bmN0aW9uKHF1ZXN0aW9uLCBxdWVzdGlvbkRhdGEpIHtcbiAgICBxdWVzdGlvbkRhdGEudGV4dCA9IHF1ZXN0aW9uO1xuICAgIHRoaXMucXVlc3Rpb25FbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChxdWVzdGlvbkRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucXVlc3Rpb25FbGVtZW50LCBxdWVzdGlvbkRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVSaWdodEFuc3dlckVsZW1lbnQgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy5yaWdodEFuc3dlciA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5yaWdodEFuc3dlciwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZVdyb25nQW5zd2VyRWxlbWVudDEgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy53cm9uZ0Fuc3dlcjEgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMud3JvbmdBbnN3ZXIxLCBhbnN3ZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlV3JvbmdBbnN3ZXJFbGVtZW50MiA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLndyb25nQW5zd2VyMiA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy53cm9uZ0Fuc3dlcjIsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVXcm9uZ0Fuc3dlckVsZW1lbnQzID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMud3JvbmdBbnN3ZXIzID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLndyb25nQW5zd2VyMywgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnNldEFuc3dlclRvQ29sb3VyID0gZnVuY3Rpb24oYW5zd2VyRWxlbWVudCwgYW5zd2VyKSB7XG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT047XG4gICAgdmFyIGNvbG91cnMgPSB7fTtcbiAgICBmb3IodmFyIGkgPSAyOyBpIDw9IDQ7IGkrKykge1xuICAgICAgICBjb2xvdXJzW3RoaXMuQU5TV0VSRURfUFJFRklYICsgaV0gPSBxdWVzdGlvbkRhdGEuV1JPTkdfQU5TV0VSX0NPTE9VUjtcbiAgICB9XG4gICAgY29sb3Vycy5BTlNXRVJFRF8xID0gcXVlc3Rpb25EYXRhLlJJR0hUX0FOU1dFUl9DT0xPVVI7XG4gICAgdmFyIGFuc3dlckNvbG91ciA9IGNvbG91cnNbYW5zd2VyXTtcbiAgICBhbnN3ZXJFbGVtZW50LnNldFN0eWxlKHtmb250OiBhbnN3ZXJFbGVtZW50LnN0eWxlLmZvbnQsIGZpbGw6IGFuc3dlckNvbG91cn0pO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRXaG9BbnN3ZXJlZFF1ZXN0aW9uID0gZnVuY3Rpb24oYW5zd2VyRWxlbWVudCwgYW5zd2VyLCBwbGF5ZXIpIHtcbiAgICB2YXIgcXVlc3Rpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTjtcbiAgICB2YXIgYW5zd2VyT25TY3JlZW4gPSAoYW5zd2VyLnNsaWNlKC0xKSAtIDEpO1xuICAgIHRoaXMucGxheWVyV2hvQW5zd2VyZWRFbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChxdWVzdGlvbkRhdGFbcGxheWVyICsgdGhpcy5BTlNXRVJFRF9TVUZGSVhdKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcldob0Fuc3dlcmVkRWxlbWVudCwgcXVlc3Rpb25EYXRhW3RoaXMuQU5TV0VSRURfUFJFRklYICsgdGhpcy5hbnN3ZXJJbmRpY2VzW2Fuc3dlck9uU2NyZWVuXV0pOyBcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUudXBkYXRlUXVlc3Rpb25UaW1lciA9IGZ1bmN0aW9uKHRpbWVSZW1haW5pbmcpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy50aW1lcik7XG4gICAgdmFyIHRpbWVyRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT04uVElNRVI7XG4gICAgdGltZXJEYXRhLnRleHQgPSB0aW1lUmVtYWluaW5nO1xuICAgIHRoaXMudGltZXIgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHRpbWVyRGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy50aW1lciwgdGltZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUudHVybk9mZkludGVyYWN0aXZpdHlGb3JBbnN3ZXJFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmlnaHRBbnN3ZXIuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLndyb25nQW5zd2VyMS5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMud3JvbmdBbnN3ZXIyLmludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy53cm9uZ0Fuc3dlcjMuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMucmlnaHRBbnN3ZXIsIHRoaXMud3JvbmdBbnN3ZXIxLCB0aGlzLndyb25nQW5zd2VyMiwgdGhpcy53cm9uZ0Fuc3dlcjNdO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uVmlldzsiLCJXaW5WaWV3LmNvbnN0cnVjdG9yID0gV2luVmlldztcbldpblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbldpblZpZXcucHJvdG90eXBlLlBMQVlfQUdBSU5fQlVUVE9OID0gMDtcblxuZnVuY3Rpb24gV2luVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuc2V0dXBWaWV3RWxlbWVudHMoKTtcbn1cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVdpbm5lclRleHQgPSBmdW5jdGlvbihwbGF5ZXJXaG9Xb24sIHN0YXREYXRhKSB7XG4gICAgdmFyIHdpbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLldJTjtcbiAgICB0aGlzLmNyZWF0ZVdpblRleHQod2luRGF0YVtwbGF5ZXJXaG9Xb24gKyBcIl9XSU5TXCJdLCB3aW5EYXRhLldJTl9URVhUX1BPU0lUSU9OKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllclN0YXRzVGV4dCh3aW5EYXRhLCBzdGF0RGF0YSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKHBsYXllcldob1dvbikge1xuICAgIHZhciB3aW5EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5XSU47XG4gICAgdGhpcy5jcmVhdGVQbGF5QWdhaW5CdXR0b24od2luRGF0YS5QTEFZX0FHQUlOKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVdpblRleHQgPSBmdW5jdGlvbiAoZGF0YSwgcG9zaXRpb25EYXRhKSB7XG4gICAgdmFyIHdpblRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHdpblRleHQsIHBvc2l0aW9uRGF0YSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXJTdGF0c1RleHQgPSBmdW5jdGlvbihsYXlvdXREYXRhLCBzdGF0RGF0YSkge1xuICAgIGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ICsgc3RhdERhdGEucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlO1xuICAgIHZhciBwbGF5ZXIxQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgbGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIFxuICAgIGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ICsgc3RhdERhdGEucGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlO1xuICAgIHZhciBwbGF5ZXIyQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgbGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIFxuICAgIGxheW91dERhdGEuUExBWUVSXzFfQkVTVF9DQVRFR09SWS50ZXh0ID0gbGF5b3V0RGF0YS5QTEFZRVJfMV9CRVNUX0NBVEVHT1JZLnRleHQgKyBzdGF0RGF0YS5wbGF5ZXIxQmVzdENhdGVnb3J5ICsgXCIoXCIgKyBzdGF0RGF0YS5wbGF5ZXIxQmVzdENhdGVnb3J5UGVyY2VudGFnZSArIFwiJSlcIjtcbiAgICB2YXIgcGxheWVyMUJlc3RDYXRlZ29yeVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGxheW91dERhdGEuUExBWUVSXzFfQkVTVF9DQVRFR09SWSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMUJlc3RDYXRlZ29yeVRleHQsIGxheW91dERhdGEuUExBWUVSXzFfQkVTVF9DQVRFR09SWSk7XG4gICAgXG4gICAgbGF5b3V0RGF0YS5QTEFZRVJfMl9CRVNUX0NBVEVHT1JZLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8yX0JFU1RfQ0FURUdPUlkudGV4dCArIHN0YXREYXRhLnBsYXllcjJCZXN0Q2F0ZWdvcnkgKyBcIihcIiArIHN0YXREYXRhLnBsYXllcjJCZXN0Q2F0ZWdvcnlQZXJjZW50YWdlICsgXCIlKVwiO1xuICAgIHZhciBwbGF5ZXIyQmVzdENhdGVnb3J5VGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMl9CRVNUX0NBVEVHT1JZKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyQmVzdENhdGVnb3J5VGV4dCwgbGF5b3V0RGF0YS5QTEFZRVJfMl9CRVNUX0NBVEVHT1JZKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXlBZ2FpbkJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5wbGF5QWdhaW5CdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5QWdhaW5CdXR0b24sIGRhdGEpO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMucGxheUFnYWluQnV0dG9uXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luVmlldzsiXX0=
