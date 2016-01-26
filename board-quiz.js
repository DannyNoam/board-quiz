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
        var rendererOptions = {
            antialiasing:false,
            resolution:1,
            backgroundColor:RENDERER_BACKGROUND_COLOUR
        };
        var viewLoader = new ViewLoader();
        var container = new PIXI.Container();
        container.interactive = true;
        var renderer = new PIXI.autoDetectRenderer(window.innerWidth * Display.scale, window.innerHeight * Display.scale, rendererOptions);
        console.log("Resource path: " + Display.resourcePath);
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
        new ImageLoader(Display.resourcePath + '/images.json', beginGame);
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
AvatarSelectionController.prototype.avatars = ['emoji-angel.png', 'emoji-big-smile.png', 'emoji-cool.png', 'emoji-grin.png', 'emoji-happy.png', 'emoji-kiss.png', 'emoji-laughing.png', 'emoji-love.png', 'emoji-monkey.png', 'emoji-poo.png', 'emoji-scream.png', 'emoji-sleep.png', 'emoji-smile.png', 'emoji-sleep.png', 'emoji-wink.png'];
AvatarSelectionController.prototype.currentAvatarIndex = 0;

function AvatarSelectionController() {
    Controller.call(this);
    this.cleanView();
    this.loadView();
}

AvatarSelectionController.prototype.loadView = function() {
    this.viewLoader.removeAllViews();
    this.view.setupViewElements();
    this.selectedAvatarView.createAvatar(this.avatars[this.currentAvatarIndex]);
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
   
    this.selectedAvatarView.createAvatar(this.avatars[this.currentAvatarIndex]);
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
PlayerController.prototype.DANGEROUS_LEVEL_HEALTH = 6;

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
        if(playerData.player1Health <= this.DANGEROUS_LEVEL_HEALTH) {
            this.view.flashPlayer1Health();
        }
        if(playerData.player2Health <= this.DANGEROUS_LEVEL_HEALTH) {
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
        var scale = calculateScale();
        console.log("Orientation is " + orientation);
        bucketData[orientation].forEach(function (bucket) {
            console.log("Bucket height: " + bucket.height * scale);
            console.log("Window height: " + window.innerHeight);
            if (bucket.height * scale <= window.innerHeight ) {
                Display.bucket = bucket;
            }
        });
        
        Display.scale = calculateScale(window.devicePixelRatio);
        Display.resourcePath = './resource/' + Display.bucket.width + 'x' + Display.bucket.height + '/scale-' + Display.scale;
        Display.orientation = orientation;
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
    resourcePath: null,
    orientation: null
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
    this.createLogo();
    this.createBackButton();
    this.createSelectDownButton();
    this.createSelectUpButton();
    this.createFindGameButton();
};

AvatarSelectionView.prototype.createLogo = function (data) {
    var logo = this.createSpriteElement(Display.resourcePath + '/logo.jpg');
    this.setElementPositionInPercent(logo, 50, 10);
    this.addElementToContainer(logo);
};

AvatarSelectionView.prototype.createBackButton = function (data) {
    this.backButton = this.createSpriteElement(Display.resourcePath + '/go-back.png');
    this.setElementPositionInPercent(this.backButton, 69, 80);
    this.addElementToContainer(this.backButton);
};

AvatarSelectionView.prototype.createSelectDownButton = function (data) {
    this.selectDownButton = this.createSpriteElement(Display.resourcePath + '/down-triangle.png');
    this.setElementPositionInPercent(this.selectDownButton, 24, 85);
    this.addElementToContainer(this.selectDownButton);
};

AvatarSelectionView.prototype.createSelectUpButton = function (data) {
    this.selectUpButton = this.createSpriteElement(Display.resourcePath + '/up-triangle.png');
    this.setElementPositionInPercent(this.selectUpButton, 24, 35);
    this.addElementToContainer(this.selectUpButton);
};

AvatarSelectionView.prototype.createFindGameButton = function (data) {
    this.findGameButton = this.createSpriteElement(Display.resourcePath + '/find-game.png');
    this.setElementPositionInPercent(this.findGameButton, 69, 48);
    this.addElementToContainer(this.findGameButton);
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
    
    this.createFindGameCaption(layoutData.CAPTION);
    this.createPlayer1Avatar(avatar);
    this.createVersusText(layoutData.VERSUS);
    this.createPlayer2UnknownAvatar();
    this.createPlayer1Text(layoutData.PLAYER_1);
    this.createPlayer2Text(layoutData.PLAYER_2);
};

FindGameView.prototype.createFindGameCaption = function (data) {
    this.findGameCaption = this.createTextElement(data);
    this.setElementPositionInPercent(this.findGameCaption, 50, 15);
    this.addElementToContainer(this.findGameCaption);
};

FindGameView.prototype.createPlayer1Avatar = function (avatar) {
    var player1Avatar = this.createSpriteElement(Display.resourcePath + '/avatar/' + avatar);
    this.setElementPositionInPercent(player1Avatar, 25, 50);
    this.addElementToContainer(player1Avatar);
};

FindGameView.prototype.createVersusText = function (data) {
    var versus = this.createTextElement(data);
    this.setElementPositionInPercent(versus, 50, 50);
    this.addElementToContainer(versus);
};

FindGameView.prototype.createPlayer2UnknownAvatar = function () {
    var player2UnknownAvatar = this.createSpriteElement(Display.resourcePath + '/question-mark.png');
    this.setElementPositionInPercent(player2UnknownAvatar, 75, 50);
    this.addElementToContainer(player2UnknownAvatar);
};

FindGameView.prototype.createPlayer1Text = function (data) {
    var player1 = this.createTextElement(data);
    this.setElementPositionInPercent(player1, 25, 74);
    this.addElementToContainer(player1);
};

FindGameView.prototype.createPlayer2Text = function (data) {
    var player2 = this.createTextElement(data);
    this.setElementPositionInPercent(player2, 75, 74);
    this.addElementToContainer(player2);
};

FindGameView.prototype.createPlayer2ActualAvatar = function (avatar) {
    this.removeElement(this.player2UnknownAvatar);
    var player2ActualAvatar = this.createSpriteElement(Display.resourcePath + '/avatar/' + avatar);
    this.setElementPositionInPercent(player2ActualAvatar, 75, 50);
    this.addElementToContainer(player2ActualAvatar);
};

FindGameView.prototype.createGameFoundCaption = function () {
    this.removeElement(this.findGameCaption);
    var foundGameCaption = this.createTextElement(PIXI.Container.layoutData.FIND_GAME.FOUND_GAME_CAPTION);
    this.setElementPositionInPercent(foundGameCaption, 50, 15);
    this.addElementToContainer(foundGameCaption);
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
    this.createBackButton();
};

HelpView.prototype.createHelpText = function (data) {
    var helpText = this.createTextElement(data);
    this.addElementToContainer(helpText);
};

HelpView.prototype.createBackButton = function (data) {
    this.backButton = this.createSpriteElement(Display.resourcePath + '/go-back.png');
    this.setElementPositionInPercent(this.backButton, 50, 50);
    this.addElementToContainer(this.backButton);
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
    var loadingText = this.createTextElement(data);
    this.setElementPositionInPercent(loadingText, 50, 50);
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
    this.createLogo();
    this.createPlayButton();
    this.createHelpButton();
};

MenuView.prototype.createLogo = function () {
    var logo = this.createSpriteElement(Display.resourcePath + '/logo.jpg');
    this.setElementPositionInPercent(logo, 50, 15);
    this.addElementToContainer(logo);
};

MenuView.prototype.createPlayButton = function (data) {
    this.playButton = this.createSpriteElement(Display.resourcePath + '/play-button.jpg');
    this.setElementPositionInPercent(this.playButton, 50, 50);
    this.addElementToContainer(this.playButton);
};

MenuView.prototype.createHelpButton = function (data) {
    this.helpButton = this.createSpriteElement(Display.resourcePath + '/help-button.jpg');
    this.setElementPositionInPercent(this.helpButton, 50, 80);
    this.addElementToContainer(this.helpButton);
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

View.prototype.addElementToContainer = function(element) {
    element.anchor.x = this.CENTER_ANCHOR;
    element.anchor.y = this.CENTER_ANCHOR;
    element.interactive = this.INTERACTIVE;
    this.addChild(element);
};

View.prototype.createTextElement = function(data) {
    return new PIXI.Text(data.text, {font: data.size + "px " + data.font, fill: data.color});
};

View.prototype.createSpriteElement = function(path) {
    return new PIXI.Sprite.fromImage(path);
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

View.prototype.setElementPositionInPercent = function(element, widthPercentage, heightPercentage) {
    element.x = (window.innerWidth / 100) * widthPercentage;
    element.y = (window.innerHeight / 100) * heightPercentage;   
};

module.exports = View;


},{}],25:[function(require,module,exports){
AvatarView.constructor = AvatarView;
AvatarView.prototype = Object.create(View.prototype);

AvatarView.prototype.BACK_BUTTON = 0;

function AvatarView() {
    PIXI.Container.call(this);
}

AvatarView.prototype.createAvatar = function (avatar) {
    this.removeElement(this.avatar);
    this.avatar = this.createSpriteElement(Display.resourcePath + '/avatar/' + avatar);
    this.setElementPositionInPercent(this.avatar, 24, 60);
    this.addElementToContainer(this.avatar);
};

module.exports = AvatarView;
},{}],26:[function(require,module,exports){
DiceView.constructor = DiceView;
DiceView.prototype = Object.create(View.prototype);

function DiceView() {
    PIXI.Container.call(this);
}

DiceView.prototype.setupDice = function(diceNumber) {
    this.createDiceElement(diceNumber);
};

DiceView.prototype.createDiceElement = function(diceNumber) {
    this.diceElement = this.createSpriteElement(Display.resourcePath + '/dice/dice-face-' + diceNumber + '.png');
    this.setElementPositionInPercent(this.diceElement, 50, 36);
    this.addElementToContainer(this.diceElement);
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
    
    this.createPlayer1Avatar(this.playerData.player1Avatar);
    this.createPlayer1Health(playerLayoutData.PLAYER_1_HEALTH);
    
    this.createPlayer2Avatar(this.playerData.player2Avatar);
    this.createPlayer2Health(playerLayoutData.PLAYER_2_HEALTH);
    
    this.createPlayer1Text(playerLayoutData.PLAYER_1_TEXT);
    this.createPlayer2Text(playerLayoutData.PLAYER_2_TEXT);
};

PlayerView.prototype.createPlayer1Avatar = function(avatar) {
    this.player1Avatar = this.createSpriteElement(Display.resourcePath + '/avatar/' + avatar);
    this.setElementPositionInPercent(this.player1Avatar, 25, 25);
    this.addElementToContainer(this.player1Avatar);
};

PlayerView.prototype.createPlayer2Avatar = function(avatar) {
    this.player2Avatar = this.createSpriteElement(Display.resourcePath + '/avatar/' + avatar);
    this.setElementPositionInPercent(this.player2Avatar, 75, 25);
    this.addElementToContainer(this.player2Avatar);
};

PlayerView.prototype.createPlayer1Health = function(healthData) {
    this.player1HealthText = this.createTextElement(healthData);
    this.setElementPositionInPercent(this.player1HealthText, 25, 7);
    this.addElementToContainer(this.player1HealthText, healthData);
};

PlayerView.prototype.createPlayer2Health = function(healthData) {
    this.player2HealthText = this.createTextElement(healthData);
    this.setElementPositionInPercent(this.player2HealthText, 75, 7);
    this.addElementToContainer(this.player2HealthText, healthData);
};

PlayerView.prototype.createPlayer1Text = function(playerData) {
    this.player1Text = this.createTextElement(playerData);
    this.setElementPositionInPercent(this.player1Text, 25, 44);
    this.addElementToContainer(this.player1Text, playerData);
};

PlayerView.prototype.createPlayer2Text = function(playerData) {
    this.player2Text = this.createTextElement(playerData);
    this.setElementPositionInPercent(this.player2Text, 75, 44);
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
    var answerTextData = PIXI.Container.layoutData.QUESTION.ANSWER;
    this.createCategoryElement(category, PIXI.Container.layoutData.QUESTION.CATEGORY);
    this.createQuestionElement(question.text, PIXI.Container.layoutData.QUESTION.QUESTION_POSITION);
    this.createAnswerElement1(question.right_answer, answerTextData);
    this.createAnswerElement2(question.wrong_answer_1, answerTextData);
    this.createAnswerElement3(question.wrong_answer_2, answerTextData);
    this.createAnswerElement4(question.wrong_answer_3, answerTextData);
};

QuestionView.prototype.setAnswerIndices = function(answerIndices) {
    this.answerIndices = answerIndices;
};

QuestionView.prototype.createCategoryElement = function(category, categoryData) {
    categoryData.text = category;
    this.categoryElement = this.createTextElement(categoryData);
    this.setElementPositionInPercent(this.categoryElement, 50, 63);
    this.addElementToContainer(this.categoryElement, categoryData);
};

QuestionView.prototype.createQuestionElement = function(question, questionData) {
    questionData.text = question;
    this.questionElement = this.createTextElement(questionData);
    this.setElementPositionInPercent(this.questionElement, 50, 68);
    this.addElementToContainer(this.questionElement, questionData);
};

QuestionView.prototype.createAnswerElement1 = function(answer, answerData) {
    answerData.text = answer;
    this.answerElement1 = this.createTextElement(answerData);
    this.setElementPositionInPercent(this.answerElement1, 33, 75);
    this.addElementToContainer(this.answerElement1, answerData);
};

QuestionView.prototype.createAnswerElement2 = function(answer, answerData) {
    answerData.text = answer;
    this.answerElement2 = this.createTextElement(answerData);
    this.setElementPositionInPercent(this.answerElement2, 67, 75);
    this.addElementToContainer(this.answerElement2, answerData);
};

QuestionView.prototype.createAnswerElement3 = function(answer, answerData) {
    answerData.text = answer;
    this.answerElement3 = this.createTextElement(answerData);
    this.setElementPositionInPercent(this.answerElement3, 33, 83);
    this.addElementToContainer(this.answerElement3, answerData);
};

QuestionView.prototype.createAnswerElement4 = function(answer, answerData) {
    answerData.text = answer;
    this.answerElement4 = this.createTextElement(answerData);
    this.setElementPositionInPercent(this.answerElement4, 67, 83);
    this.addElementToContainer(this.answerElement4, answerData);
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
    this.setElementPositionInPercent(this.playerWhoAnsweredElement, questionData[this.ANSWERED_PREFIX + (answerOnScreen + 1)].widthPercentage, questionData[this.ANSWERED_PREFIX + (answerOnScreen + 1)].heightPercentage);
    this.addElementToContainer(this.playerWhoAnsweredElement, questionData[this.ANSWERED_PREFIX + this.answerIndices[answerOnScreen]]); 
};

QuestionView.prototype.updateQuestionTimer = function(timeRemaining) {
    this.removeElement(this.timer);
    var timerData = PIXI.Container.layoutData.QUESTION.TIMER;
    timerData.text = timeRemaining;
    this.timer = this.createTextElement(timerData);
    this.setElementPositionInPercent(this.timer, 97, 3);
    this.addElementToContainer(this.timer, timerData);
};

QuestionView.prototype.turnOffInteractivityForAnswerElements = function() {
    this.answerElement1.interactive = false;
    this.answerElement2.interactive = false;
    this.answerElement3.interactive = false;
    this.answerElement4.interactive = false;
};

QuestionView.prototype.getInteractiveViewElements = function() {
    return [this.answerElement1, this.answerElement2, this.answerElement3, this.answerElement4];
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
    this.setElementPositionInPercent(winText, 50, 66);
    this.addElementToContainer(winText, positionData);
};

WinView.prototype.createPlayerStatsText = function(layoutData, statData) {
    layoutData.PLAYER_1_CORRECT_PERCENTAGE.text = layoutData.PLAYER_1_CORRECT_PERCENTAGE.text + statData.player1CorrectAnswerPercentage;
    var player1CorrectAnswerPercentageText = this.createTextElement(layoutData.PLAYER_1_CORRECT_PERCENTAGE);
    this.setElementPositionInPercent(player1CorrectAnswerPercentageText, 25, 72);
    this.addElementToContainer(player1CorrectAnswerPercentageText, layoutData.PLAYER_1_CORRECT_PERCENTAGE);
    
    layoutData.PLAYER_2_CORRECT_PERCENTAGE.text = layoutData.PLAYER_2_CORRECT_PERCENTAGE.text + statData.player2CorrectAnswerPercentage;
    var player2CorrectAnswerPercentageText = this.createTextElement(layoutData.PLAYER_2_CORRECT_PERCENTAGE);
    this.setElementPositionInPercent(player2CorrectAnswerPercentageText, 75, 72);
    this.addElementToContainer(player2CorrectAnswerPercentageText, layoutData.PLAYER_2_CORRECT_PERCENTAGE);
    
    layoutData.PLAYER_1_BEST_CATEGORY.text = layoutData.PLAYER_1_BEST_CATEGORY.text + statData.player1BestCategory + "(" + statData.player1BestCategoryPercentage + "%)";
    var player1BestCategoryText = this.createTextElement(layoutData.PLAYER_1_BEST_CATEGORY);
    this.setElementPositionInPercent(player1BestCategoryText, 25, 77);
    this.addElementToContainer(player1BestCategoryText, layoutData.PLAYER_1_BEST_CATEGORY);
    
    layoutData.PLAYER_2_BEST_CATEGORY.text = layoutData.PLAYER_2_BEST_CATEGORY.text + statData.player2BestCategory + "(" + statData.player2BestCategoryPercentage + "%)";
    var player2BestCategoryText = this.createTextElement(layoutData.PLAYER_2_BEST_CATEGORY);
    this.setElementPositionInPercent(player2BestCategoryText, 75, 77);
    this.addElementToContainer(player2BestCategoryText, layoutData.PLAYER_2_BEST_CATEGORY);
};

WinView.prototype.createPlayAgainButton = function () {
    this.playAgainButton = this.createSpriteElement(Display.resourcePath + '/play-again.png');
    this.setElementPositionInPercent(this.playAgainButton, 50, 47);
    this.addElementToContainer(this.playAgainButton);
};

WinView.prototype.getInteractiveViewElements = function() {
    return [this.playAgainButton];
};

module.exports = WinView;
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi5qcyIsInNyYy9Tb3VuZE1hbmFnZXIuanMiLCJzcmMvY29uc3RhbnQvU29ja2V0Q29uc3RhbnRzLmpzIiwic3JjL2NvbnRyb2xsZXIvQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0NvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9GaW5kR2FtZUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9HYW1lQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0hlbHBDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvTWVudUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9UdXJuQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvRGljZUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9zdWJjb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9zdWJjb250cm9sbGVyL1F1ZXN0aW9uQ29udHJvbGxlci5qcyIsInNyYy9sb2FkZXIvQnVja2V0TG9hZGVyLmpzIiwic3JjL2xvYWRlci9JbWFnZUxvYWRlci5qcyIsInNyYy9sb2FkZXIvSnNvbkxvYWRlci5qcyIsInNyYy9sb2FkZXIvVmlld0xvYWRlci5qcyIsInNyYy91dGlsL0Rpc3BsYXkuanMiLCJzcmMvdmlldy9BdmF0YXJTZWxlY3Rpb25WaWV3LmpzIiwic3JjL3ZpZXcvRmluZEdhbWVWaWV3LmpzIiwic3JjL3ZpZXcvSGVscFZpZXcuanMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy5qcyIsInNyYy92aWV3L01lbnVWaWV3LmpzIiwic3JjL3ZpZXcvVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvQXZhdGFyVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvRGljZVZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1BsYXllclZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1F1ZXN0aW9uVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvV2luVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRGlzcGxheSA9IHJlcXVpcmUoJy4vdXRpbC9EaXNwbGF5Jyk7XG5Tb2NrZXRDb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50L1NvY2tldENvbnN0YW50cycpO1xuVmlldyA9IHJlcXVpcmUoJy4vdmlldy9WaWV3Jyk7XG5Mb2FkaW5nVmlldyA9IHJlcXVpcmUoJy4vdmlldy9Mb2FkaW5nVmlldycpO1xuQnVja2V0TG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvQnVja2V0TG9hZGVyJyk7XG5Kc29uTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvSnNvbkxvYWRlcicpO1xuSW1hZ2VMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9JbWFnZUxvYWRlcicpO1xuVmlld0xvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL1ZpZXdMb2FkZXInKTtcbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvQ29udHJvbGxlcicpO1xuSGVscFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvSGVscFZpZXcnKTtcbkhlbHBDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0hlbHBDb250cm9sbGVyJyk7XG5NZW51VmlldyA9IHJlcXVpcmUoJy4vdmlldy9NZW51VmlldycpO1xuTWVudUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvTWVudUNvbnRyb2xsZXInKTtcbkF2YXRhclNlbGVjdGlvblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvQXZhdGFyU2VsZWN0aW9uVmlldycpO1xuQXZhdGFyVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L0F2YXRhclZpZXcnKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcicpO1xuRmluZEdhbWVWaWV3ID0gcmVxdWlyZSgnLi92aWV3L0ZpbmRHYW1lVmlldycpO1xuRmluZEdhbWVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0ZpbmRHYW1lQ29udHJvbGxlcicpO1xuU291bmRNYW5hZ2VyID0gcmVxdWlyZSgnLi9Tb3VuZE1hbmFnZXInKTtcbkdhbWVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0dhbWVDb250cm9sbGVyJyk7XG5EaWNlVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L0RpY2VWaWV3Jyk7XG5EaWNlQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9zdWJjb250cm9sbGVyL0RpY2VDb250cm9sbGVyJyk7XG5RdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9RdWVzdGlvblZpZXcnKTtcblF1ZXN0aW9uQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9zdWJjb250cm9sbGVyL1F1ZXN0aW9uQ29udHJvbGxlcicpO1xuUGxheWVyVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L1BsYXllclZpZXcnKTtcblBsYXllckNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9QbGF5ZXJDb250cm9sbGVyJyk7XG5XaW5WaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvV2luVmlldycpO1xuVHVybkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvVHVybkNvbnRyb2xsZXInKTtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIHZhciBERUZBVUxUX1dJRFRIID0gNDgwO1xuICAgIHZhciBERUZBVUxUX0hFSUdIVCA9IDMyMDtcbiAgICB2YXIgUkVOREVSRVJfQkFDS0dST1VORF9DT0xPVVIgPSAweDAwMDAwMDtcbiAgICB2YXIgRElWX0lEID0gXCJnYW1lXCI7XG4gICAgXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYXRlZCBidWNrZXQgbG9hZGVyLlwiKTtcbiAgICAgICAgbmV3IEJ1Y2tldExvYWRlcihsb2FkTGF5b3V0LCBidWNrZXRMb2FkaW5nRmFpbGVkTWVzc2FnZSk7XG4gICAgfSkoKTtcbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkTGF5b3V0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbGF5b3V0XCIpO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS8nICsgRGlzcGxheS5idWNrZXQud2lkdGggKyAneCcgKyBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQgKyAnL2xheW91dC5qc29uJywgc2V0TGF5b3V0RGF0YUluUElYSSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldExheW91dERhdGFJblBJWEkobGF5b3V0RGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNldHRpbmcgbGF5b3V0LlwiKTtcbiAgICAgICAgUElYSS5Db250YWluZXIubGF5b3V0RGF0YSA9IGxheW91dERhdGE7XG4gICAgICAgIHN0YXJ0UmVuZGVyaW5nKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHN0YXJ0UmVuZGVyaW5nKCkge1xuICAgICAgICB2YXIgcmVuZGVyZXJPcHRpb25zID0ge1xuICAgICAgICAgICAgYW50aWFsaWFzaW5nOmZhbHNlLFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoxLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOlJFTkRFUkVSX0JBQ0tHUk9VTkRfQ09MT1VSXG4gICAgICAgIH07XG4gICAgICAgIHZhciB2aWV3TG9hZGVyID0gbmV3IFZpZXdMb2FkZXIoKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICAgICAgICBjb250YWluZXIuaW50ZXJhY3RpdmUgPSB0cnVlO1xuICAgICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2luZG93LmlubmVyV2lkdGggKiBEaXNwbGF5LnNjYWxlLCB3aW5kb3cuaW5uZXJIZWlnaHQgKiBEaXNwbGF5LnNjYWxlLCByZW5kZXJlck9wdGlvbnMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlc291cmNlIHBhdGg6IFwiICsgRGlzcGxheS5yZXNvdXJjZVBhdGgpO1xuICAgICAgICByZW5kZXJlci5yb3VuZFBpeGVscyA9IHRydWU7XG4gICAgICAgIHNldERlcGVuZGVuY2llcyh2aWV3TG9hZGVyLCBjb250YWluZXIsIHJlbmRlcmVyKTtcbiAgICAgICAgYXBwZW5kR2FtZVRvRE9NKHJlbmRlcmVyKTtcbiAgICAgICAgYmVnaW5BbmltYXRpb24odmlld0xvYWRlcik7XG4gICAgICAgIGFkZExvYWRpbmdWaWV3VG9TY3JlZW4odmlld0xvYWRlcik7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKCcuL3Jlc291cmNlL3F1ZXN0aW9ucy5qc29uJywgc2V0UXVlc3Rpb25EYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXRRdWVzdGlvbkRhdGFJblF1ZXN0aW9uQ29udHJvbGxlcihxdWVzdGlvbkRhdGEpIHtcbiAgICAgICAgUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5xdWVzdGlvbkRhdGEgPSBxdWVzdGlvbkRhdGE7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKCcuL3Jlc291cmNlL2NhdGVnb3JpZXMuanNvbicsIHNldENhdGVnb3J5RGF0YUluUXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0Q2F0ZWdvcnlEYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIoY2F0ZWdvcnlEYXRhKSB7XG4gICAgICAgIFF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY2F0ZWdvcnlEYXRhID0gY2F0ZWdvcnlEYXRhO1xuICAgICAgICBsb2FkSW1hZ2VzKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZXMoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzcGxheSByZXNvdXJjZSBwYXRoOiBcIiArIERpc3BsYXkucmVzb3VyY2VQYXRoKTtcbiAgICAgICAgbmV3IEltYWdlTG9hZGVyKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9pbWFnZXMuanNvbicsIGJlZ2luR2FtZSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFwcGVuZEdhbWVUb0RPTShyZW5kZXJlcikge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChESVZfSUQpLmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXREZXBlbmRlbmNpZXModmlld0xvYWRlciwgY29udGFpbmVyLCByZW5kZXJlcikge1xuICAgICAgICB2aWV3TG9hZGVyLnNldENvbnRhaW5lcihjb250YWluZXIpO1xuICAgICAgICB2aWV3TG9hZGVyLnNldFJlbmRlcmVyKHJlbmRlcmVyKTtcbiAgICAgICAgQ29udHJvbGxlci5zZXRWaWV3TG9hZGVyKHZpZXdMb2FkZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBiZWdpbkFuaW1hdGlvbih2aWV3TG9hZGVyKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh2aWV3TG9hZGVyLmFuaW1hdGUpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBiZWdpbkdhbWUoKSB7XG4gICAgICAgIHZhciBtZW51Q29udHJvbGxlciA9IG5ldyBNZW51Q29udHJvbGxlcigpOyBcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYWRkTG9hZGluZ1ZpZXdUb1NjcmVlbih2aWV3TG9hZGVyKSB7XG4gICAgICAgIHZhciBsb2FkaW5nVmlldyA9IG5ldyBMb2FkaW5nVmlldygpO1xuICAgICAgICBsb2FkaW5nVmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgICAgICB2aWV3TG9hZGVyLmxvYWRWaWV3KGxvYWRpbmdWaWV3KTtcbiAgICB9XG4gICAgICAgIFxuICAgIGZ1bmN0aW9uIGJ1Y2tldExvYWRpbmdGYWlsZWRNZXNzYWdlKCkge1xuICAgICAgICBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQgPSBERUZBVUxUX0hFSUdIVDtcbiAgICAgICAgRGlzcGxheS5idWNrZXQud2lkdGggPSBERUZBVUxUX1dJRFRIO1xuICAgICAgICBEaXNwbGF5LnNjYWxlID0gMTtcbiAgICAgICAgRGlzcGxheS5yZXNvdXJjZVBhdGggPSBERUZBVUxUX1dJRFRIICsgJ3gnICsgREVGQVVMVF9IRUlHSFQ7XG4gICAgfVxufTsiLCJmdW5jdGlvbiBTb3VuZE1hbmFnZXIoKSB7XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvcnJlY3RBbnN3ZXJTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC9jb3JyZWN0LWFuc3dlci5tcDNcIl19KTtcbiAgICAgICAgdGhpcy53cm9uZ0Fuc3dlclNvdW5kID0gbmV3IEhvd2woe3VybHM6IFtcInJlc291cmNlL3NvdW5kL3dyb25nLWFuc3dlci5tcDNcIl19KTtcbiAgICAgICAgdGhpcy5yb2xsRGljZVNvdW5kID0gbmV3IEhvd2woe3VybHM6IFtcInJlc291cmNlL3NvdW5kL3JvbGwtZGljZS5tcDNcIl19KTtcbiAgICAgICAgdGhpcy50aWNrU291bmQgPSBuZXcgSG93bCh7dXJsczogW1wicmVzb3VyY2Uvc291bmQvdGljay5tcDNcIl19KTtcbiAgICB9LmJpbmQodGhpcykpKCk7XG4gICAgXG4gICAgdGhpcy5wbGF5Q29ycmVjdEFuc3dlclNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdEFuc3dlclNvdW5kLnBsYXkoKTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMucGxheVdyb25nQW5zd2VyU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy53cm9uZ0Fuc3dlclNvdW5kLnBsYXkoKTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMucGxheVJvbGxEaWNlU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yb2xsRGljZVNvdW5kLnBsYXkoKTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMucGxheVRpY2tTb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnRpY2tTb3VuZC5wbGF5KCk7XG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZE1hbmFnZXI7IiwidmFyIFNvY2tldENvbnN0YW50cyA9IHtcbiAgICAnb24nIDoge1xuICAgICAgICAnUExBWUVSU19IRUFMVEgnIDogJ3BsYXllcnMtaGVhbHRoJyxcbiAgICAgICAgJ0RJQ0VfTlVNQkVSJyA6ICdkaWNlLW51bWJlcicsXG4gICAgICAgICdSQU5ET01fUVVFU1RJT04nIDogJ3JhbmRvbS1xdWVzdGlvbicsXG4gICAgICAgICdJTklUX05FV19UVVJOJyA6ICdpbml0LW5ldy10dXJuJyxcbiAgICAgICAgJ0RBTUFHRV9ERUFMVCcgOiAnZGFtYWdlLWRlYWx0JyxcbiAgICAgICAgJ1NIVUZGTEVEX0FOU1dFUl9JTkRJQ0VTJyA6ICdzaHVmZmxlZC1hbnN3ZXItaW5kaWNlcycsXG4gICAgICAgICdHQU1FX0ZPVU5EJyA6ICdnYW1lLWZvdW5kJyxcbiAgICAgICAgJ0dBTUVfU1RBVFMnIDogJ2dhbWUtc3RhdHMnXG4gICAgfSxcbiAgICBcbiAgICAnZW1pdCcgOiB7XG4gICAgICAgICdDT05ORUNUSU9OJyA6ICdjb25uZWN0aW9uJyxcbiAgICAgICAgJ0ZJTkRJTkdfR0FNRScgOiAnZmluZGluZy1nYW1lJyxcbiAgICAgICAgJ0dFVF9QTEFZRVJTX0hFQUxUSCcgOiAnZ2V0LXBsYXllcnMtaGVhbHRoJyxcbiAgICAgICAgJ0RJU0NPTk5FQ1QnIDogJ2Rpc2Nvbm5lY3QnLFxuICAgICAgICAnUk9MTF9ESUNFJyA6ICdyb2xsLWRpY2UnLFxuICAgICAgICAnR0VUX1JBTkRPTV9RVUVTVElPTicgOiAnZ2V0LXJhbmRvbS1xdWVzdGlvbicsXG4gICAgICAgICdORVdfVFVSTicgOiAnbmV3LXR1cm4nLFxuICAgICAgICAnREVBTF9EQU1BR0UnIDogJ2RlYWwtZGFtYWdlJyxcbiAgICAgICAgJ1NIVUZGTEVfQU5TV0VSX0lORElDRVMnIDogJ3NodWZmbGUtYW5zd2VyLWluZGljZXMnLFxuICAgICAgICAnR0FNRV9FTkRFRCcgOiAnZ2FtZS1lbmRlZCdcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvY2tldENvbnN0YW50czsiLCJBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcjtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEF2YXRhclNlbGVjdGlvblZpZXcoKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNlbGVjdGVkQXZhdGFyVmlldyA9IG5ldyBBdmF0YXJWaWV3KCk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5hdmF0YXJzID0gWydlbW9qaS1hbmdlbC5wbmcnLCAnZW1vamktYmlnLXNtaWxlLnBuZycsICdlbW9qaS1jb29sLnBuZycsICdlbW9qaS1ncmluLnBuZycsICdlbW9qaS1oYXBweS5wbmcnLCAnZW1vamkta2lzcy5wbmcnLCAnZW1vamktbGF1Z2hpbmcucG5nJywgJ2Vtb2ppLWxvdmUucG5nJywgJ2Vtb2ppLW1vbmtleS5wbmcnLCAnZW1vamktcG9vLnBuZycsICdlbW9qaS1zY3JlYW0ucG5nJywgJ2Vtb2ppLXNsZWVwLnBuZycsICdlbW9qaS1zbWlsZS5wbmcnLCAnZW1vamktc2xlZXAucG5nJywgJ2Vtb2ppLXdpbmsucG5nJ107XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5jdXJyZW50QXZhdGFySW5kZXggPSAwO1xuXG5mdW5jdGlvbiBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmNsZWFuVmlldygpO1xuICAgIHRoaXMubG9hZFZpZXcoKTtcbn1cblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnNlbGVjdGVkQXZhdGFyVmlldy5jcmVhdGVBdmF0YXIodGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XSk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3KTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBiYWNrQnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5CQUNLX0JVVFRPTl07XG4gICAgdmFyIHNlbGVjdFVwID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5TRUxFQ1RfVVBdO1xuICAgIHZhciBzZWxlY3REb3duID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5TRUxFQ1RfRE9XTl07XG4gICAgdmFyIGZpbmRHYW1lID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5GSU5EX0dBTUVdO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gbmV3IE1lbnVDb250cm9sbGVyKCk7XG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHNlbGVjdFVwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIFVQID0gMTtcbiAgICAgICAgdGhpcy5zZXR1cE5leHRBdmF0YXIoVVApO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoc2VsZWN0RG93biwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBET1dOID0gLTE7XG4gICAgICAgIHRoaXMuc2V0dXBOZXh0QXZhdGFyKERPV04pO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoZmluZEdhbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXZhdGFyID0gdGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XTtcbiAgICAgICAgdmFyIGZpbmRHYW1lQ29udHJvbGxlciA9IG5ldyBGaW5kR2FtZUNvbnRyb2xsZXIoYXZhdGFyKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBOZXh0QXZhdGFyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgaWYodGhpcy5jdXJyZW50QXZhdGFySW5kZXggPj0gKHRoaXMuYXZhdGFycy5sZW5ndGggLSAxKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCA9IDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCArIGRpcmVjdGlvbiA8IDApIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXZhdGFySW5kZXggPSAodGhpcy5hdmF0YXJzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3VycmVudEF2YXRhckluZGV4ID0gdGhpcy5jdXJyZW50QXZhdGFySW5kZXggKyBkaXJlY3Rpb247XG4gICAgfVxuICAgXG4gICAgdGhpcy5zZWxlY3RlZEF2YXRhclZpZXcuY3JlYXRlQXZhdGFyKHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF0pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gQ29udHJvbGxlcigpIHt9XG5cbkNvbnRyb2xsZXIuc2V0Vmlld0xvYWRlciA9IGZ1bmN0aW9uKHZpZXdMb2FkZXIpIHtcbiAgICBDb250cm9sbGVyLnByb3RvdHlwZS52aWV3TG9hZGVyID0gdmlld0xvYWRlcjtcbn07XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnNvY2tldCA9IGlvKCk7XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTGlzdGVuZXIgPSBmdW5jdGlvbih2aWV3RWxlbWVudCwgYWN0aW9uKSB7XG4gICAgdmlld0VsZW1lbnQudG91Y2hlbmQgPSB2aWV3RWxlbWVudC5jbGljayA9IGFjdGlvbjtcbn07XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTXVsdGlwbGVMaXN0ZW5lcnMgPSBmdW5jdGlvbih2aWV3RWxlbWVudHMsIGFjdGlvbikge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2aWV3RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHZpZXdFbGVtZW50c1tpXSwgYWN0aW9uKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7IiwiRmluZEdhbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gRmluZEdhbWVDb250cm9sbGVyO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEZpbmRHYW1lVmlldygpO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5hdmF0YXIgPSBudWxsO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5UUkFOU0lUSU9OX1RPX0dBTUVfVElNRSA9IDMwMDA7XG5cbmZ1bmN0aW9uIEZpbmRHYW1lQ29udHJvbGxlcihhdmF0YXIpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLmF2YXRhciA9IGF2YXRhcjtcbiAgICB0aGlzLmxvYWRWaWV3KCk7XG59XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHModGhpcy5hdmF0YXIpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBTZXJ2ZXJJbnRlcmFjdGlvbigpO1xufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cFNlcnZlckludGVyYWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkdBTUVfRk9VTkQsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5hc3NpZ25BdmF0YXJzKHBsYXllckRhdGEpO1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlR2FtZUZvdW5kQ2FwdGlvbigpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgICAgICAgICB2YXIgcGxheWVyQ29udHJvbGxlciA9IG5ldyBQbGF5ZXJDb250cm9sbGVyKHBsYXllckRhdGEpO1xuICAgICAgICAgICAgdmFyIGRpY2VDb250cm9sbGVyID0gbmV3IERpY2VDb250cm9sbGVyKCk7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25Db250cm9sbGVyID0gbmV3IFF1ZXN0aW9uQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyKTtcbiAgICAgICAgICAgIHZhciB0dXJuQ29udHJvbGxlciA9IG5ldyBUdXJuQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCB0aGlzLlRSQU5TSVRJT05fVE9fR0FNRV9USU1FKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuRklORElOR19HQU1FLCB7YXZhdGFyOiB0aGlzLmF2YXRhcn0pO1xufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5hc3NpZ25BdmF0YXJzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBzb2NrZXRJZFByZWZpeCA9IFwiLyNcIjtcbiAgICB2YXIgc29ja2V0SWQgPSBzb2NrZXRJZFByZWZpeCArIHRoaXMuc29ja2V0LmlkO1xuICAgIGlmKGRhdGEucGxheWVyMUlkID09PSBzb2NrZXRJZCkge1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhcihkYXRhLnBsYXllcjJBdmF0YXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldy5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyKGRhdGEucGxheWVyMUF2YXRhcik7XG4gICAgfVxufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmluZEdhbWVDb250cm9sbGVyOyIsIkdhbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gR2FtZUNvbnRyb2xsZXI7XG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gR2FtZUNvbnRyb2xsZXIocGxheWVyRGF0YSkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbn1cblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldFBsYXllckRhdGEgPSBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXllckRhdGEgPSBwbGF5ZXJEYXRhO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldERpY2VOdW1iZXIgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmRpY2VOdW1iZXIgPSBkaWNlTnVtYmVyO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmlzUGxheWVyMSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzb2NrZXRQcmVmaXggPSBcIi8jXCI7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyRGF0YS5wbGF5ZXIxSWQgPT09IChzb2NrZXRQcmVmaXggKyBHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc29ja2V0LmlkKTtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5nZXRQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pc1BsYXllcjEodGhpcy5wbGF5ZXJEYXRhKSA/IFwiUExBWUVSXzFcIiA6IFwiUExBWUVSXzJcIjtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5nZXRPcHBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlzUGxheWVyMSh0aGlzLnBsYXllckRhdGEpID8gXCJQTEFZRVJfMlwiIDogXCJQTEFZRVJfMVwiO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNvdW5kTWFuYWdlciA9IG5ldyBTb3VuZE1hbmFnZXIoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lQ29udHJvbGxlcjsiLCJIZWxwQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEhlbHBDb250cm9sbGVyO1xuSGVscENvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBIZWxwVmlldygpO1xuXG5mdW5jdGlvbiBIZWxwQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5sb2FkVmlldygpO1xufVxuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgYmFja0J1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuQkFDS19CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gbmV3IE1lbnVDb250cm9sbGVyKCk7XG4gICAgfSk7XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBDb250cm9sbGVyOyIsIk1lbnVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gTWVudUNvbnRyb2xsZXI7XG5NZW51Q29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IE1lbnVWaWV3KCk7XG5cbmZ1bmN0aW9uIE1lbnVDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmxvYWRWaWV3KCk7XG59XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbn07XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBwbGF5QnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5QTEFZX0JVVFRPTl07XG4gICAgdmFyIGhlbHBCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LkhFTFBfQlVUVE9OXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIocGxheUJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gbmV3IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIoKTtcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoaGVscEJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWxwQ29udHJvbGxlciA9IG5ldyBIZWxwQ29udHJvbGxlcigpO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51Q29udHJvbGxlcjsiLCJUdXJuQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IFR1cm5Db250cm9sbGVyO1xuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBUdXJuQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlciA9IGRpY2VDb250cm9sbGVyO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyID0gcXVlc3Rpb25Db250cm9sbGVyO1xuICAgIHRoaXMud2luVmlldyA9IG5ldyBXaW5WaWV3KCk7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIHRoaXMubmV3VHVybigpO1xufVxuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uSU5JVF9ORVdfVFVSTiwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGggPT09IDApIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtaXR0ZWQgcGxheWVyIDIgYXMgd2lubmVyIVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdBTUVfRU5ERUQsIHt3aW5uZXI6IFwiUExBWUVSXzJcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoID09PSAwKSB7XG4gICAgICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWl0dGVkIHBsYXllciAxIGFzIHdpbm5lciFcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HQU1FX0VOREVELCB7d2lubmVyOiBcIlBMQVlFUl8xXCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdUdXJuKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDE1MDApO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uR0FNRV9TVEFUUywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgd2luIHZpZXchXCIpO1xuICAgICAgICB0aGlzLmxvYWRXaW5WaWV3KGRhdGEud2lubmVyLCBkYXRhKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRXaW5WaWV3ID0gZnVuY3Rpb24ocGxheWVyLCBkYXRhKSB7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLndpblZpZXcuY3JlYXRlV2lubmVyVGV4dChwbGF5ZXIsIGRhdGEpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLndpblZpZXcpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZXdFbGVtZW50cyA9IHRoaXMud2luVmlldy5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cygpOyAgXG4gICAgdmFyIHBsYXlBZ2FpbkJ1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLndpblZpZXcuUExBWV9BR0FJTl9CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihwbGF5QWdhaW5CdXR0b24sIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB2YXIgYXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlciA9IG5ldyBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyKCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5uZXdUdXJuID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmRpY2VDb250cm9sbGVyLnJvbGxEaWNlKCk7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0uYmluZCh0aGlzKSwgMzAwMCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuY2hlY2tQbGF5ZXJzSGVhbHRoID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUExBWUVSU19IRUFMVEgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUdXJuQ29udHJvbGxlcjsiLCJEaWNlQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IERpY2VDb250cm9sbGVyO1xuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgRGljZVZpZXcoKTtcblxuZnVuY3Rpb24gRGljZUNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkRJQ0VfTlVNQkVSLCBmdW5jdGlvbihkaWNlKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlSb2xsRGljZVNvdW5kKCk7XG4gICAgICAgIHRoaXMubG9hZERpY2UoZGljZS5udW1iZXIpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUucm9sbERpY2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuUk9MTF9ESUNFKTtcbiAgICB9XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUubG9hZERpY2UgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgdGhpcy52aWV3LnNldHVwRGljZShkaWNlTnVtYmVyKTtcbiAgICB0aGlzLnNldERpY2VOdW1iZXIoZGljZU51bWJlcik7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpY2VDb250cm9sbGVyOyIsIlBsYXllckNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBQbGF5ZXJDb250cm9sbGVyO1xuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IFBsYXllclZpZXcoKTtcblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLkRBTkdFUk9VU19MRVZFTF9IRUFMVEggPSA2O1xuXG5mdW5jdGlvbiBQbGF5ZXJDb250cm9sbGVyKHBsYXllckRhdGEpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5zZXRQbGF5ZXJEYXRhKHBsYXllckRhdGEpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXcuc2V0UGxheWVyRGF0YSh0aGlzLnBsYXllckRhdGEpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudXBkYXRlUGxheWVyc0hlYWx0aCgpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xufTtcblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uUExBWUVSU19IRUFMVEgsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5jbGVhckludGVydmFscygpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0UGxheWVyMUhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGgpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0UGxheWVyMkhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjJIZWFsdGgpO1xuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGggPD0gdGhpcy5EQU5HRVJPVVNfTEVWRUxfSEVBTFRIKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuZmxhc2hQbGF5ZXIxSGVhbHRoKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoIDw9IHRoaXMuREFOR0VST1VTX0xFVkVMX0hFQUxUSCkge1xuICAgICAgICAgICAgdGhpcy52aWV3LmZsYXNoUGxheWVyMkhlYWx0aCgpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVBsYXllcnNIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9QTEFZRVJTX0hFQUxUSCk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFySW50ZXJ2YWxzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3LmNsZWFySW50ZXJ2YWxzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllckNvbnRyb2xsZXI7IiwiUXVlc3Rpb25Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gUXVlc3Rpb25Db250cm9sbGVyO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlKTtcblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBRdWVzdGlvblZpZXcoKTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8xID0gJ0FOU1dFUkVEXzEnO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8yID0gJ0FOU1dFUkVEXzInO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8zID0gJ0FOU1dFUkVEXzMnO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF80ID0gJ0FOU1dFUkVEXzQnO1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLlRJTUVfVE9fQU5TV0VSX1FVRVNUSU9OID0gMTA7XG5cbmZ1bmN0aW9uIFF1ZXN0aW9uQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlJBTkRPTV9RVUVTVElPTiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gZGF0YS5xdWVzdGlvbjtcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGRhdGEuY2F0ZWdvcnk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uREFNQUdFX0RFQUxULCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJUb0NvbG91cih0aGlzLmFuc3dlcnNbcGxheWVyRGF0YS5hbnN3ZXJdLCBwbGF5ZXJEYXRhLmFuc3dlcik7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJUb0NvbG91cih0aGlzLmFuc3dlcnNbdGhpcy5BTlNXRVJFRF8xXSwgdGhpcy5BTlNXRVJFRF8xKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFdob0Fuc3dlcmVkUXVlc3Rpb24odGhpcy5hbnN3ZXJzW3BsYXllckRhdGEuYW5zd2VyXSwgcGxheWVyRGF0YS5hbnN3ZXIsIHBsYXllckRhdGEucGxheWVyX3dob19hbnN3ZXJlZCk7XG4gICAgICAgIHRoaXMudmlldy50dXJuT2ZmSW50ZXJhY3Rpdml0eUZvckFuc3dlckVsZW1lbnRzKCk7XG4gICAgICAgIHRoaXMucGxheWVyQ29udHJvbGxlci51cGRhdGVQbGF5ZXJzSGVhbHRoKCk7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lckludGVydmFsSWQpO1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ORVdfVFVSTik7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5TSFVGRkxFRF9BTlNXRVJfSU5ESUNFUywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnZpZXcuc2V0QW5zd2VySW5kaWNlcyhkYXRhKTtcbiAgICAgICAgdGhpcy52aWV3LmRpc3BsYXlDYXRlZ29yeUFuZFF1ZXN0aW9uKHRoaXMuY2F0ZWdvcnksIHRoaXMucXVlc3Rpb24pO1xuICAgICAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySW50ZXJ2YWxJZCk7XG4gICAgdGhpcy5nZXRSYW5kb21RdWVzdGlvbigpO1xuICAgIHRoaXMuc2h1ZmZsZUFuc3dlckluZGljZXMoKTtcbiAgICB0aGlzLnVwZGF0ZVRpbWVyKCk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVRpbWVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRpbWVSZW1haW5pbmcgPSAxMDtcbiAgICB2YXIgdGltZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGltZVJlbWFpbmluZyA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlUXVlc3Rpb25UaW1lcih0aW1lUmVtYWluaW5nKTtcbiAgICAgICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlUaWNrU291bmQoKTtcbiAgICAgICAgICAgIHRpbWVSZW1haW5pbmctLTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0Lk5FV19UVVJOKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lckludGVydmFsSWQpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuICAgIHRoaXMudGltZXJJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwodGltZXIsIDEwMDApO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5nZXRSYW5kb21RdWVzdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdmFyIGNhdGVnb3JpZXMgPSB0aGlzLmNhdGVnb3J5RGF0YS5DQVRFR09SSUVTO1xuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5xdWVzdGlvbkRhdGEuQ0FURUdPUklFUztcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUkFORE9NX1FVRVNUSU9OLCB7Y2F0ZWdvcmllczogY2F0ZWdvcmllcywgcXVlc3Rpb25zOiBxdWVzdGlvbnN9KTtcbiAgICB9XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuc3dlcnMgPSB0aGlzLmdldFZpZXdBbnN3ZXJzKCk7XG4gICAgdGhpcy5zZXRSaWdodEFuc3dlckxpc3RlbmVyKGFuc3dlcnMpO1xuICAgIHRoaXMuc2V0V3JvbmdBbnN3ZXJMaXN0ZW5lcnMoYW5zd2Vycyk7XG4gICAgdGhpcy5zZXRBbnN3ZXJVcGRhdGVMaXN0ZW5lcihhbnN3ZXJzKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0Vmlld0Fuc3dlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7XG4gICAgdmFyIGFuc3dlcnMgPSB7fTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzEgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlJJR0hUX0FOU1dFUl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8yID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMV07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8zID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF80ID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfM107XG4gICAgcmV0dXJuIGFuc3dlcnM7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFJpZ2h0QW5zd2VyTGlzdGVuZXIgPSBmdW5jdGlvbihhbnN3ZXJzKSB7XG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfMSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlDb3JyZWN0QW5zd2VyU291bmQoKTtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvT3Bwb25lbnRUb1NvY2tldCh0aGlzLkFOU1dFUkVEXzEpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFdyb25nQW5zd2VyTGlzdGVuZXJzID0gZnVuY3Rpb24oYW5zd2Vycykge1xuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8yKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzMsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8zKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF80KTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zaHVmZmxlQW5zd2VySW5kaWNlcyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LlNIVUZGTEVfQU5TV0VSX0lORElDRVMsIHtpbmRpY2VzOiBbMSwyLDMsNF19KTtcbiAgICB9XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldEFuc3dlclVwZGF0ZUxpc3RlbmVyID0gZnVuY3Rpb24oYW5zd2Vycykge1xuICAgIHRoaXMuYW5zd2VycyA9IGFuc3dlcnM7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmVtaXREZWFsRGFtYWdlVG9PcHBvbmVudFRvU29ja2V0ID0gZnVuY3Rpb24oYW5zd2VyKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ERUFMX0RBTUFHRSwge3BsYXllcl93aG9fYW5zd2VyZWQ6IHRoaXMuZ2V0UGxheWVyKCksIHBsYXllcl90b19kYW1hZ2U6IHRoaXMuZ2V0T3Bwb25lbnQoKSwgZGFtYWdlOiB0aGlzLmRpY2VOdW1iZXIsIGFuc3dlcjogYW5zd2VyLCBhbnN3ZXJTdGF0dXM6ICdjb3JyZWN0JywgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnl9KTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZW1pdERlYWxEYW1hZ2VUb1NlbGZUb1NvY2tldCA9IGZ1bmN0aW9uKGFuc3dlcikge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuREVBTF9EQU1BR0UsIHtwbGF5ZXJfd2hvX2Fuc3dlcmVkOiB0aGlzLmdldFBsYXllcigpLCBwbGF5ZXJfdG9fZGFtYWdlOiB0aGlzLmdldFBsYXllcigpLCBkYW1hZ2U6IHRoaXMuZGljZU51bWJlciwgYW5zd2VyOiBhbnN3ZXIsIGFuc3dlclN0YXR1czogJ2luY29ycmVjdCcsIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5fSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbkNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gQnVja2V0TG9hZGVyIChjYWxsYmFjaywgZXJyb3JDYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBQT1JUUkFJVCA9IFwicG9ydHJhaXRcIixcbiAgICAgICAgTEFORFNDQVBFID0gXCJsYW5kc2NhcGVcIixcbiAgICAgICAgQlVDS0VUX1NJWkVfSlNPTl9QQVRIID0gXCJyZXNvdXJjZS9idWNrZXRfc2l6ZXMuanNvblwiO1xuXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbmV3IEpzb25Mb2FkZXIoQlVDS0VUX1NJWkVfSlNPTl9QQVRILCBjYWxjdWxhdGVCZXN0QnVja2V0KTtcbiAgICB9KSgpO1xuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlU2NhbGUgKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5mbG9vcih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyksIDIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUJlc3RCdWNrZXQgKGJ1Y2tldERhdGEpIHtcbiAgICAgICAgdmFyIG9yaWVudGF0aW9uID0gY2FsY3VsYXRlT3JpZW50YXRpb24oKTtcbiAgICAgICAgdmFyIHNjYWxlID0gY2FsY3VsYXRlU2NhbGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJPcmllbnRhdGlvbiBpcyBcIiArIG9yaWVudGF0aW9uKTtcbiAgICAgICAgYnVja2V0RGF0YVtvcmllbnRhdGlvbl0uZm9yRWFjaChmdW5jdGlvbiAoYnVja2V0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJ1Y2tldCBoZWlnaHQ6IFwiICsgYnVja2V0LmhlaWdodCAqIHNjYWxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2luZG93IGhlaWdodDogXCIgKyB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICAgICAgaWYgKGJ1Y2tldC5oZWlnaHQgKiBzY2FsZSA8PSB3aW5kb3cuaW5uZXJIZWlnaHQgKSB7XG4gICAgICAgICAgICAgICAgRGlzcGxheS5idWNrZXQgPSBidWNrZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgRGlzcGxheS5zY2FsZSA9IGNhbGN1bGF0ZVNjYWxlKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgRGlzcGxheS5yZXNvdXJjZVBhdGggPSAnLi9yZXNvdXJjZS8nICsgRGlzcGxheS5idWNrZXQud2lkdGggKyAneCcgKyBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQgKyAnL3NjYWxlLScgKyBEaXNwbGF5LnNjYWxlO1xuICAgICAgICBEaXNwbGF5Lm9yaWVudGF0aW9uID0gb3JpZW50YXRpb247XG4gICAgICAgIGV4ZWN1dGVDYWxsYmFjaygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVPcmllbnRhdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFBPUlRSQUlUO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIExBTkRTQ0FQRTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWN1dGVDYWxsYmFjayAoKSB7XG4gICAgICAgIGlmIChEaXNwbGF5LmJ1Y2tldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWNrZXRMb2FkZXI7IiwidmFyIEltYWdlTG9hZGVyID0gZnVuY3Rpb24oaW1hZ2VKc29uUGF0aCwgY2FsbGJhY2spIHtcbiAgICB2YXIganNvbkxvYWRlciA9IG5ldyBKc29uTG9hZGVyKGltYWdlSnNvblBhdGgsIGxvYWRJbWFnZXMpO1xuICAgIHZhciBpbWFnZXNMb2FkZWQgPSAwO1xuICAgIHZhciB0b3RhbEltYWdlcyA9IDA7XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlcyhpbWFnZURhdGEpIHtcbiAgICAgICAgdmFyIGltYWdlcyA9IGltYWdlRGF0YS5JTUFHRVM7XG4gICAgICAgIGNvdW50TnVtYmVyT2ZJbWFnZXMoaW1hZ2VzKTtcbiAgICAgICAgZm9yKHZhciBpbWFnZSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIGxvYWRJbWFnZShpbWFnZXNbaW1hZ2VdLnBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZShpbWFnZVBhdGgpIHtcbiAgICAgICAgdmFyIFJFUVVFU1RfRklOSVNIRUQgPSA0O1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBpbWFnZVBhdGgsIHRydWUpO1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gUkVRVUVTVF9GSU5JU0hFRCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbmlzaGVkIGxvYWRpbmcgaW1hZ2UgcGF0aDogXCIgKyBpbWFnZVBhdGgpO1xuICAgICAgICAgICAgICBpbWFnZXNMb2FkZWQrKztcbiAgICAgICAgICAgICAgY2hlY2tJZkFsbEltYWdlc0xvYWRlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY291bnROdW1iZXJPZkltYWdlcyhpbWFnZXMpIHtcbiAgICAgICAgZm9yKHZhciBpbWFnZSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIHRvdGFsSW1hZ2VzKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY2hlY2tJZkFsbEltYWdlc0xvYWRlZCgpIHtcbiAgICAgICAgaWYoaW1hZ2VzTG9hZGVkID09PSB0b3RhbEltYWdlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbGwgaW1hZ2VzIGxvYWRlZCFcIik7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJPbmx5IFwiICsgaW1hZ2VzTG9hZGVkICsgXCIgYXJlIGxvYWRlZC5cIik7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlTG9hZGVyOyIsInZhciBKc29uTG9hZGVyID0gZnVuY3Rpb24gKHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICBSRVFVRVNUX0ZJTklTSEVEID0gNDtcbiAgICAoZnVuY3Rpb24gbG9hZEpzb24oKSB7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm92ZXJyaWRlTWltZVR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpO1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gUkVRVUVTVF9GSU5JU0hFRCkge1xuICAgICAgICAgICAgdGhhdC5kYXRhID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIGNhbGxiYWNrKHRoYXQuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhhdC5kYXRhO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSnNvbkxvYWRlcjtcbiIsImZ1bmN0aW9uIFZpZXdMb2FkZXIoKSB7fVxuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyLmFkZENoaWxkKHZpZXcpO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUucmVtb3ZlQWxsVmlld3MgPSBmdW5jdGlvbigpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyLnJlbW92ZUNoaWxkcmVuKCk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5yZW1vdmVWaWV3ID0gZnVuY3Rpb24odmlldykge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIucmVtb3ZlQ2hpbGQodmlldyk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5zZXRSZW5kZXJlciA9IGZ1bmN0aW9uKHJlbmRlcmVyKSB7XG4gICAgVmlld0xvYWRlci5wcm90b3R5cGUucmVuZGVyZXIgPSByZW5kZXJlcjtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnNldENvbnRhaW5lciA9IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIgPSBjb250YWluZXI7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgVmlld0xvYWRlci5wcm90b3R5cGUucmVuZGVyZXIucmVuZGVyKFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShWaWV3TG9hZGVyLnByb3RvdHlwZS5hbmltYXRlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlld0xvYWRlcjsiLCJ2YXIgRGlzcGxheSA9IHtcbiAgICBidWNrZXQ6IG51bGwsXG4gICAgc2NhbGU6IG51bGwsXG4gICAgcmVzb3VyY2VQYXRoOiBudWxsLFxuICAgIG9yaWVudGF0aW9uOiBudWxsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BsYXk7IiwiQXZhdGFyU2VsZWN0aW9uVmlldy5jb25zdHJ1Y3RvciA9IEF2YXRhclNlbGVjdGlvblZpZXc7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5TRUxFQ1RfVVAgPSAxO1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuU0VMRUNUX0RPV04gPSAyO1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuRklORF9HQU1FID0gMztcblxuXG5mdW5jdGlvbiBBdmF0YXJTZWxlY3Rpb25WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jcmVhdGVMb2dvKCk7XG4gICAgdGhpcy5jcmVhdGVCYWNrQnV0dG9uKCk7XG4gICAgdGhpcy5jcmVhdGVTZWxlY3REb3duQnV0dG9uKCk7XG4gICAgdGhpcy5jcmVhdGVTZWxlY3RVcEJ1dHRvbigpO1xuICAgIHRoaXMuY3JlYXRlRmluZEdhbWVCdXR0b24oKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUxvZ28gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBsb2dvID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9sb2dvLmpwZycpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGxvZ28sIDUwLCAxMCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIobG9nbyk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVCYWNrQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmJhY2tCdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2dvLWJhY2sucG5nJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5iYWNrQnV0dG9uLCA2OSwgODApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYmFja0J1dHRvbik7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVTZWxlY3REb3duQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnNlbGVjdERvd25CdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2Rvd24tdHJpYW5nbGUucG5nJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5zZWxlY3REb3duQnV0dG9uLCAyNCwgODUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuc2VsZWN0RG93bkJ1dHRvbik7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVTZWxlY3RVcEJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5zZWxlY3RVcEJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChEaXNwbGF5LnJlc291cmNlUGF0aCArICcvdXAtdHJpYW5nbGUucG5nJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5zZWxlY3RVcEJ1dHRvbiwgMjQsIDM1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnNlbGVjdFVwQnV0dG9uKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUZpbmRHYW1lQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmZpbmRHYW1lQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9maW5kLWdhbWUucG5nJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5maW5kR2FtZUJ1dHRvbiwgNjksIDQ4KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmZpbmRHYW1lQnV0dG9uKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLmJhY2tCdXR0b24sIHRoaXMuc2VsZWN0VXBCdXR0b24sIHRoaXMuc2VsZWN0RG93bkJ1dHRvbiwgdGhpcy5maW5kR2FtZUJ1dHRvbl07XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclNlbGVjdGlvblZpZXc7IiwiRmluZEdhbWVWaWV3LmNvbnN0cnVjdG9yID0gRmluZEdhbWVWaWV3O1xuRmluZEdhbWVWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBGaW5kR2FtZVZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5GSU5EX0dBTUU7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVGaW5kR2FtZUNhcHRpb24obGF5b3V0RGF0YS5DQVBUSU9OKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFBdmF0YXIoYXZhdGFyKTtcbiAgICB0aGlzLmNyZWF0ZVZlcnN1c1RleHQobGF5b3V0RGF0YS5WRVJTVVMpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMlVua25vd25BdmF0YXIoKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFUZXh0KGxheW91dERhdGEuUExBWUVSXzEpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMlRleHQobGF5b3V0RGF0YS5QTEFZRVJfMik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZUZpbmRHYW1lQ2FwdGlvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5maW5kR2FtZUNhcHRpb24gPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuZmluZEdhbWVDYXB0aW9uLCA1MCwgMTUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuZmluZEdhbWVDYXB0aW9uKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMUF2YXRhciA9IGZ1bmN0aW9uIChhdmF0YXIpIHtcbiAgICB2YXIgcGxheWVyMUF2YXRhciA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyLycgKyBhdmF0YXIpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHBsYXllcjFBdmF0YXIsIDI1LCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMUF2YXRhcik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVZlcnN1c1RleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciB2ZXJzdXMgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHZlcnN1cywgNTAsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih2ZXJzdXMpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyVW5rbm93bkF2YXRhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGxheWVyMlVua25vd25BdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL3F1ZXN0aW9uLW1hcmsucG5nJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMlVua25vd25BdmF0YXIsIDc1LCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMlVua25vd25BdmF0YXIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHBsYXllcjEgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHBsYXllcjEsIDI1LCA3NCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMSk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgcGxheWVyMiA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMiwgNzUsIDc0KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhciA9IGZ1bmN0aW9uIChhdmF0YXIpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIyVW5rbm93bkF2YXRhcik7XG4gICAgdmFyIHBsYXllcjJBY3R1YWxBdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci8nICsgYXZhdGFyKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIyQWN0dWFsQXZhdGFyLCA3NSwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjJBY3R1YWxBdmF0YXIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVHYW1lRm91bmRDYXB0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLmZpbmRHYW1lQ2FwdGlvbik7XG4gICAgdmFyIGZvdW5kR2FtZUNhcHRpb24gPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRklORF9HQU1FLkZPVU5EX0dBTUVfQ0FQVElPTik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQoZm91bmRHYW1lQ2FwdGlvbiwgNTAsIDE1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihmb3VuZEdhbWVDYXB0aW9uKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaW5kR2FtZVZpZXc7IiwiSGVscFZpZXcuY29uc3RydWN0b3IgPSBIZWxwVmlldztcbkhlbHBWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5IZWxwVmlldy5wcm90b3R5cGUuQkFDS19CVVRUT04gPSAwO1xuXG5mdW5jdGlvbiBIZWxwVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5IZWxwVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuSEVMUDtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZUhlbHBUZXh0KGxheW91dERhdGEuSU5GTyk7XG4gICAgdGhpcy5jcmVhdGVCYWNrQnV0dG9uKCk7XG59O1xuXG5IZWxwVmlldy5wcm90b3R5cGUuY3JlYXRlSGVscFRleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBoZWxwVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoaGVscFRleHQpO1xufTtcblxuSGVscFZpZXcucHJvdG90eXBlLmNyZWF0ZUJhY2tCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuYmFja0J1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZ28tYmFjay5wbmcnKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmJhY2tCdXR0b24sIDUwLCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5iYWNrQnV0dG9uKTtcbn07XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5iYWNrQnV0dG9uXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSGVscFZpZXc7IiwiTG9hZGluZ1ZpZXcuY29uc3RydWN0b3IgPSBMb2FkaW5nVmlldztcbkxvYWRpbmdWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBMb2FkaW5nVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5Mb2FkaW5nVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuTE9BRElORztcbiAgICBcbiAgICB0aGlzLmNyZWF0ZUxvYWRpbmdUZXh0KGxheW91dERhdGEuTE9BRElOR19URVhUKTtcbn07XG5cbkxvYWRpbmdWaWV3LnByb3RvdHlwZS5jcmVhdGVMb2FkaW5nVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGxvYWRpbmdUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChsb2FkaW5nVGV4dCwgNTAsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihsb2FkaW5nVGV4dCwgZGF0YSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRpbmdWaWV3OyIsIk1lbnVWaWV3LmNvbnN0cnVjdG9yID0gTWVudVZpZXc7XG5NZW51Vmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuTWVudVZpZXcucHJvdG90eXBlLlBMQVlfQlVUVE9OID0gMDtcbk1lbnVWaWV3LnByb3RvdHlwZS5IRUxQX0JVVFRPTiA9IDE7XG5cbmZ1bmN0aW9uIE1lbnVWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY3JlYXRlTG9nbygpO1xuICAgIHRoaXMuY3JlYXRlUGxheUJ1dHRvbigpO1xuICAgIHRoaXMuY3JlYXRlSGVscEJ1dHRvbigpO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmNyZWF0ZUxvZ28gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvZ28gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2xvZ28uanBnJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQobG9nbywgNTAsIDE1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihsb2dvKTtcbn07XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5QnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnBsYXlCdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL3BsYXktYnV0dG9uLmpwZycpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheUJ1dHRvbiwgNTAsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXlCdXR0b24pO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmNyZWF0ZUhlbHBCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuaGVscEJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChEaXNwbGF5LnJlc291cmNlUGF0aCArICcvaGVscC1idXR0b24uanBnJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5oZWxwQnV0dG9uLCA1MCwgODApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuaGVscEJ1dHRvbik7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMucGxheUJ1dHRvbiwgdGhpcy5oZWxwQnV0dG9uXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXc7IiwiVmlldy5jb25zdHJ1Y3RvciA9IFZpZXc7XG5WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblZpZXcucHJvdG90eXBlLklOVEVSQUNUSVZFID0gdHJ1ZTtcblZpZXcucHJvdG90eXBlLkNFTlRFUl9BTkNIT1IgPSAwLjU7XG5cbmZ1bmN0aW9uIFZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuVmlldy5wcm90b3R5cGUuYWRkRWxlbWVudFRvQ29udGFpbmVyID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGVsZW1lbnQuYW5jaG9yLnggPSB0aGlzLkNFTlRFUl9BTkNIT1I7XG4gICAgZWxlbWVudC5hbmNob3IueSA9IHRoaXMuQ0VOVEVSX0FOQ0hPUjtcbiAgICBlbGVtZW50LmludGVyYWN0aXZlID0gdGhpcy5JTlRFUkFDVElWRTtcbiAgICB0aGlzLmFkZENoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUuY3JlYXRlVGV4dEVsZW1lbnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQSVhJLlRleHQoZGF0YS50ZXh0LCB7Zm9udDogZGF0YS5zaXplICsgXCJweCBcIiArIGRhdGEuZm9udCwgZmlsbDogZGF0YS5jb2xvcn0pO1xufTtcblxuVmlldy5wcm90b3R5cGUuY3JlYXRlU3ByaXRlRWxlbWVudCA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICByZXR1cm4gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShwYXRoKTtcbn07XG5cblZpZXcucHJvdG90eXBlLnJlbW92ZUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdGhpcy5yZW1vdmVDaGlsZChlbGVtZW50KTtcbn07XG5cblZpZXcucHJvdG90eXBlLnVwZGF0ZUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdGhpcy5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICB0aGlzLmFkZENoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUucmVtb3ZlQWxsRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQgPSBmdW5jdGlvbihlbGVtZW50LCB3aWR0aFBlcmNlbnRhZ2UsIGhlaWdodFBlcmNlbnRhZ2UpIHtcbiAgICBlbGVtZW50LnggPSAod2luZG93LmlubmVyV2lkdGggLyAxMDApICogd2lkdGhQZXJjZW50YWdlO1xuICAgIGVsZW1lbnQueSA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAxMDApICogaGVpZ2h0UGVyY2VudGFnZTsgICBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcblxuIiwiQXZhdGFyVmlldy5jb25zdHJ1Y3RvciA9IEF2YXRhclZpZXc7XG5BdmF0YXJWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5BdmF0YXJWaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5cbmZ1bmN0aW9uIEF2YXRhclZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuQXZhdGFyVmlldy5wcm90b3R5cGUuY3JlYXRlQXZhdGFyID0gZnVuY3Rpb24gKGF2YXRhcikge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLmF2YXRhcik7XG4gICAgdGhpcy5hdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci8nICsgYXZhdGFyKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmF2YXRhciwgMjQsIDYwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmF2YXRhcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclZpZXc7IiwiRGljZVZpZXcuY29uc3RydWN0b3IgPSBEaWNlVmlldztcbkRpY2VWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBEaWNlVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5EaWNlVmlldy5wcm90b3R5cGUuc2V0dXBEaWNlID0gZnVuY3Rpb24oZGljZU51bWJlcikge1xuICAgIHRoaXMuY3JlYXRlRGljZUVsZW1lbnQoZGljZU51bWJlcik7XG59O1xuXG5EaWNlVmlldy5wcm90b3R5cGUuY3JlYXRlRGljZUVsZW1lbnQgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgdGhpcy5kaWNlRWxlbWVudCA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZGljZS9kaWNlLWZhY2UtJyArIGRpY2VOdW1iZXIgKyAnLnBuZycpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuZGljZUVsZW1lbnQsIDUwLCAzNik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5kaWNlRWxlbWVudCk7XG59O1xuXG5EaWNlVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaWNlVmlldzsiLCJQbGF5ZXJWaWV3LmNvbnN0cnVjdG9yID0gUGxheWVyVmlldztcblBsYXllclZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIFBsYXllclZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyRGF0YSA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllckRhdGEgPSBwbGF5ZXJEYXRhO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVyTGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSO1xuICAgIHZhciBhdmF0YXJEYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5BVkFUQVI7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxQXZhdGFyKHRoaXMucGxheWVyRGF0YS5wbGF5ZXIxQXZhdGFyKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9IRUFMVEgpO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlUGxheWVyMkF2YXRhcih0aGlzLnBsYXllckRhdGEucGxheWVyMkF2YXRhcik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIySGVhbHRoKHBsYXllckxheW91dERhdGEuUExBWUVSXzJfSEVBTFRIKTtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFUZXh0KHBsYXllckxheW91dERhdGEuUExBWUVSXzFfVEVYVCk7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIyVGV4dChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX1RFWFQpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMUF2YXRhciA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHRoaXMucGxheWVyMUF2YXRhciA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyLycgKyBhdmF0YXIpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMUF2YXRhciwgMjUsIDI1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFBdmF0YXIpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMkF2YXRhciA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHRoaXMucGxheWVyMkF2YXRhciA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyLycgKyBhdmF0YXIpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMkF2YXRhciwgNzUsIDI1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJBdmF0YXIpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMUhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aERhdGEpIHtcbiAgICB0aGlzLnBsYXllcjFIZWFsdGhUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChoZWFsdGhEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjFIZWFsdGhUZXh0LCAyNSwgNyk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCwgaGVhbHRoRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIySGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoRGF0YSkge1xuICAgIHRoaXMucGxheWVyMkhlYWx0aFRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGhlYWx0aERhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMkhlYWx0aFRleHQsIDc1LCA3KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJIZWFsdGhUZXh0LCBoZWFsdGhEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFUZXh0ID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIHRoaXMucGxheWVyMVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHBsYXllckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMVRleHQsIDI1LCA0NCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxVGV4dCwgcGxheWVyRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyVGV4dCA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllcjJUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjJUZXh0LCA3NSwgNDQpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMlRleHQsIHBsYXllckRhdGEpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMUhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIxSGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8xX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjFIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIxSGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMkhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIySGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8yX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjJIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIySGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuZmxhc2hQbGF5ZXIxSGVhbHRoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXllckxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUjtcbiAgICB2YXIgcGxheWVyMUhlYWx0aCA9IHRoaXMucGxheWVyMUhlYWx0aFRleHQudGV4dC5zbGljZSgtMSk7XG4gICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBsYXllcjJIZWFsdGhJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCFyZW1vdmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBsYXllcjFIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9IRUFMVEgpO1xuICAgICAgICAgICAgdGhpcy5zZXRQbGF5ZXIxSGVhbHRoKHBsYXllcjFIZWFsdGgpO1xuICAgICAgICB9XG4gICAgICAgIHJlbW92ZWQgPSAhcmVtb3ZlZDtcbiAgICB9LmJpbmQodGhpcyksIDIwMCk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5mbGFzaFBsYXllcjJIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVyTGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSO1xuICAgIHZhciBwbGF5ZXIySGVhbHRoID0gdGhpcy5wbGF5ZXIxSGVhbHRoVGV4dC50ZXh0LnNsaWNlKC0xKTtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyMUhlYWx0aEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXJlbW92ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjJIZWFsdGhUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyMkhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX0hFQUxUSCk7XG4gICAgICAgICAgICB0aGlzLnNldFBsYXllcjJIZWFsdGgocGxheWVyMkhlYWx0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlZCA9ICFyZW1vdmVkO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNsZWFySW50ZXJ2YWxzID0gZnVuY3Rpb24oKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnBsYXllcjFIZWFsdGhJbnRlcnZhbElkKTtcbiAgICBjbGVhckludGVydmFsKHRoaXMucGxheWVyMkhlYWx0aEludGVydmFsSWQpO1xuICAgIGNvbnNvbGUubG9nKFwiSW50ZXJ2YWxzIGNsZWFyZWQuXCIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJWaWV3OyIsIlF1ZXN0aW9uVmlldy5jb25zdHJ1Y3RvciA9IFF1ZXN0aW9uVmlldztcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5SSUdIVF9BTlNXRVIgPSAwO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5XUk9OR19BTlNXRVJfMSA9IDE7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLldST05HX0FOU1dFUl8yID0gMjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuV1JPTkdfQU5TV0VSXzMgPSAzO1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLkFOU1dFUl9QUkVGSVggPSBcIkFOU1dFUl9cIjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSRURfUFJFRklYID0gXCJBTlNXRVJFRF9cIjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSRURfU1VGRklYID0gXCJfQU5TV0VSRURcIjtcblxuZnVuY3Rpb24gUXVlc3Rpb25WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuZGlzcGxheUNhdGVnb3J5QW5kUXVlc3Rpb24gPSBmdW5jdGlvbihjYXRlZ29yeSwgcXVlc3Rpb24pIHtcbiAgICB2YXIgcXVlc3Rpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTjtcbiAgICB2YXIgYW5zd2VyVGV4dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLkFOU1dFUjtcbiAgICB0aGlzLmNyZWF0ZUNhdGVnb3J5RWxlbWVudChjYXRlZ29yeSwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTi5DQVRFR09SWSk7XG4gICAgdGhpcy5jcmVhdGVRdWVzdGlvbkVsZW1lbnQocXVlc3Rpb24udGV4dCwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTi5RVUVTVElPTl9QT1NJVElPTik7XG4gICAgdGhpcy5jcmVhdGVBbnN3ZXJFbGVtZW50MShxdWVzdGlvbi5yaWdodF9hbnN3ZXIsIGFuc3dlclRleHREYXRhKTtcbiAgICB0aGlzLmNyZWF0ZUFuc3dlckVsZW1lbnQyKHF1ZXN0aW9uLndyb25nX2Fuc3dlcl8xLCBhbnN3ZXJUZXh0RGF0YSk7XG4gICAgdGhpcy5jcmVhdGVBbnN3ZXJFbGVtZW50MyhxdWVzdGlvbi53cm9uZ19hbnN3ZXJfMiwgYW5zd2VyVGV4dERhdGEpO1xuICAgIHRoaXMuY3JlYXRlQW5zd2VyRWxlbWVudDQocXVlc3Rpb24ud3JvbmdfYW5zd2VyXzMsIGFuc3dlclRleHREYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuc2V0QW5zd2VySW5kaWNlcyA9IGZ1bmN0aW9uKGFuc3dlckluZGljZXMpIHtcbiAgICB0aGlzLmFuc3dlckluZGljZXMgPSBhbnN3ZXJJbmRpY2VzO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVDYXRlZ29yeUVsZW1lbnQgPSBmdW5jdGlvbihjYXRlZ29yeSwgY2F0ZWdvcnlEYXRhKSB7XG4gICAgY2F0ZWdvcnlEYXRhLnRleHQgPSBjYXRlZ29yeTtcbiAgICB0aGlzLmNhdGVnb3J5RWxlbWVudCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoY2F0ZWdvcnlEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmNhdGVnb3J5RWxlbWVudCwgNTAsIDYzKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmNhdGVnb3J5RWxlbWVudCwgY2F0ZWdvcnlEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlUXVlc3Rpb25FbGVtZW50ID0gZnVuY3Rpb24ocXVlc3Rpb24sIHF1ZXN0aW9uRGF0YSkge1xuICAgIHF1ZXN0aW9uRGF0YS50ZXh0ID0gcXVlc3Rpb247XG4gICAgdGhpcy5xdWVzdGlvbkVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHF1ZXN0aW9uRGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5xdWVzdGlvbkVsZW1lbnQsIDUwLCA2OCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5xdWVzdGlvbkVsZW1lbnQsIHF1ZXN0aW9uRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUFuc3dlckVsZW1lbnQxID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDEgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDEsIDMzLCA3NSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50MSwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUFuc3dlckVsZW1lbnQyID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDIgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDIsIDY3LCA3NSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50MiwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUFuc3dlckVsZW1lbnQzID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDMgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDMsIDMzLCA4Myk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50MywgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUFuc3dlckVsZW1lbnQ0ID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDQsIDY3LCA4Myk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50NCwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnNldEFuc3dlclRvQ29sb3VyID0gZnVuY3Rpb24oYW5zd2VyRWxlbWVudCwgYW5zd2VyKSB7XG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT047XG4gICAgdmFyIGNvbG91cnMgPSB7fTtcbiAgICBmb3IodmFyIGkgPSAyOyBpIDw9IDQ7IGkrKykge1xuICAgICAgICBjb2xvdXJzW3RoaXMuQU5TV0VSRURfUFJFRklYICsgaV0gPSBxdWVzdGlvbkRhdGEuV1JPTkdfQU5TV0VSX0NPTE9VUjtcbiAgICB9XG4gICAgY29sb3Vycy5BTlNXRVJFRF8xID0gcXVlc3Rpb25EYXRhLlJJR0hUX0FOU1dFUl9DT0xPVVI7XG4gICAgdmFyIGFuc3dlckNvbG91ciA9IGNvbG91cnNbYW5zd2VyXTtcbiAgICBhbnN3ZXJFbGVtZW50LnNldFN0eWxlKHtmb250OiBhbnN3ZXJFbGVtZW50LnN0eWxlLmZvbnQsIGZpbGw6IGFuc3dlckNvbG91cn0pO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRXaG9BbnN3ZXJlZFF1ZXN0aW9uID0gZnVuY3Rpb24oYW5zd2VyRWxlbWVudCwgYW5zd2VyLCBwbGF5ZXIpIHtcbiAgICB2YXIgcXVlc3Rpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTjtcbiAgICB2YXIgYW5zd2VyT25TY3JlZW4gPSAoYW5zd2VyLnNsaWNlKC0xKSAtIDEpO1xuICAgIHRoaXMucGxheWVyV2hvQW5zd2VyZWRFbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChxdWVzdGlvbkRhdGFbcGxheWVyICsgdGhpcy5BTlNXRVJFRF9TVUZGSVhdKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcldob0Fuc3dlcmVkRWxlbWVudCwgcXVlc3Rpb25EYXRhW3RoaXMuQU5TV0VSRURfUFJFRklYICsgKGFuc3dlck9uU2NyZWVuICsgMSldLndpZHRoUGVyY2VudGFnZSwgcXVlc3Rpb25EYXRhW3RoaXMuQU5TV0VSRURfUFJFRklYICsgKGFuc3dlck9uU2NyZWVuICsgMSldLmhlaWdodFBlcmNlbnRhZ2UpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyV2hvQW5zd2VyZWRFbGVtZW50LCBxdWVzdGlvbkRhdGFbdGhpcy5BTlNXRVJFRF9QUkVGSVggKyB0aGlzLmFuc3dlckluZGljZXNbYW5zd2VyT25TY3JlZW5dXSk7IFxufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS51cGRhdGVRdWVzdGlvblRpbWVyID0gZnVuY3Rpb24odGltZVJlbWFpbmluZykge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnRpbWVyKTtcbiAgICB2YXIgdGltZXJEYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTi5USU1FUjtcbiAgICB0aW1lckRhdGEudGV4dCA9IHRpbWVSZW1haW5pbmc7XG4gICAgdGhpcy50aW1lciA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQodGltZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnRpbWVyLCA5NywgMyk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy50aW1lciwgdGltZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUudHVybk9mZkludGVyYWN0aXZpdHlGb3JBbnN3ZXJFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDEuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQyLmludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50My5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDQuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuYW5zd2VyRWxlbWVudDEsIHRoaXMuYW5zd2VyRWxlbWVudDIsIHRoaXMuYW5zd2VyRWxlbWVudDMsIHRoaXMuYW5zd2VyRWxlbWVudDRdO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uVmlldzsiLCJXaW5WaWV3LmNvbnN0cnVjdG9yID0gV2luVmlldztcbldpblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbldpblZpZXcucHJvdG90eXBlLlBMQVlfQUdBSU5fQlVUVE9OID0gMDtcblxuZnVuY3Rpb24gV2luVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuc2V0dXBWaWV3RWxlbWVudHMoKTtcbn1cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVdpbm5lclRleHQgPSBmdW5jdGlvbihwbGF5ZXJXaG9Xb24sIHN0YXREYXRhKSB7XG4gICAgdmFyIHdpbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLldJTjtcbiAgICB0aGlzLmNyZWF0ZVdpblRleHQod2luRGF0YVtwbGF5ZXJXaG9Xb24gKyBcIl9XSU5TXCJdLCB3aW5EYXRhLldJTl9URVhUX1BPU0lUSU9OKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllclN0YXRzVGV4dCh3aW5EYXRhLCBzdGF0RGF0YSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKHBsYXllcldob1dvbikge1xuICAgIHZhciB3aW5EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5XSU47XG4gICAgdGhpcy5jcmVhdGVQbGF5QWdhaW5CdXR0b24od2luRGF0YS5QTEFZX0FHQUlOKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVdpblRleHQgPSBmdW5jdGlvbiAoZGF0YSwgcG9zaXRpb25EYXRhKSB7XG4gICAgdmFyIHdpblRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHdpblRleHQsIDUwLCA2Nik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIod2luVGV4dCwgcG9zaXRpb25EYXRhKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllclN0YXRzVGV4dCA9IGZ1bmN0aW9uKGxheW91dERhdGEsIHN0YXREYXRhKSB7XG4gICAgbGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCA9IGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgKyBzdGF0RGF0YS5wbGF5ZXIxQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2U7XG4gICAgdmFyIHBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIxQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0LCAyNSwgNzIpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICBcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ID0gbGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCArIHN0YXREYXRhLnBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZTtcbiAgICB2YXIgcGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIDc1LCA3Mik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgbGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIFxuICAgIGxheW91dERhdGEuUExBWUVSXzFfQkVTVF9DQVRFR09SWS50ZXh0ID0gbGF5b3V0RGF0YS5QTEFZRVJfMV9CRVNUX0NBVEVHT1JZLnRleHQgKyBzdGF0RGF0YS5wbGF5ZXIxQmVzdENhdGVnb3J5ICsgXCIoXCIgKyBzdGF0RGF0YS5wbGF5ZXIxQmVzdENhdGVnb3J5UGVyY2VudGFnZSArIFwiJSlcIjtcbiAgICB2YXIgcGxheWVyMUJlc3RDYXRlZ29yeVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGxheW91dERhdGEuUExBWUVSXzFfQkVTVF9DQVRFR09SWSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMUJlc3RDYXRlZ29yeVRleHQsIDI1LCA3Nyk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMUJlc3RDYXRlZ29yeVRleHQsIGxheW91dERhdGEuUExBWUVSXzFfQkVTVF9DQVRFR09SWSk7XG4gICAgXG4gICAgbGF5b3V0RGF0YS5QTEFZRVJfMl9CRVNUX0NBVEVHT1JZLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8yX0JFU1RfQ0FURUdPUlkudGV4dCArIHN0YXREYXRhLnBsYXllcjJCZXN0Q2F0ZWdvcnkgKyBcIihcIiArIHN0YXREYXRhLnBsYXllcjJCZXN0Q2F0ZWdvcnlQZXJjZW50YWdlICsgXCIlKVwiO1xuICAgIHZhciBwbGF5ZXIyQmVzdENhdGVnb3J5VGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMl9CRVNUX0NBVEVHT1JZKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIyQmVzdENhdGVnb3J5VGV4dCwgNzUsIDc3KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyQmVzdENhdGVnb3J5VGV4dCwgbGF5b3V0RGF0YS5QTEFZRVJfMl9CRVNUX0NBVEVHT1JZKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXlBZ2FpbkJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBsYXlBZ2FpbkJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChEaXNwbGF5LnJlc291cmNlUGF0aCArICcvcGxheS1hZ2Fpbi5wbmcnKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXlBZ2FpbkJ1dHRvbiwgNTAsIDQ3KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXlBZ2FpbkJ1dHRvbik7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5wbGF5QWdhaW5CdXR0b25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaW5WaWV3OyJdfQ==
