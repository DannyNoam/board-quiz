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
        console.log("Scale is " + Display.scale);
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
        
        Display.scale = calculateScale(window.devicePixelRatio);
        Display.resourcePath = Display.bucket.width + 'x' + Display.bucket.height;
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
    this.setElementPositionInPercent(logo, 50, 10);
    this.addElementToContainer(logo);
};

AvatarSelectionView.prototype.createBackButton = function (data) {
    this.backButton = this.createSpriteElement(data);
    this.setElementPositionInPercent(this.backButton, 69, 80);
    this.addElementToContainer(this.backButton, data);
};

AvatarSelectionView.prototype.createSelectDownButton = function (data) {
    this.selectDownButton = this.createSpriteElement(data);
    this.setElementPositionInPercent(this.selectDownButton, 24, 85);
    this.addElementToContainer(this.selectDownButton, data);
};

AvatarSelectionView.prototype.createSelectUpButton = function (data) {
    this.selectUpButton = this.createSpriteElement(data);
    this.setElementPositionInPercent(this.selectUpButton, 24, 35);
    this.addElementToContainer(this.selectUpButton, data);
};

AvatarSelectionView.prototype.createFindGameButton = function (data) {
    this.findGameButton = this.createSpriteElement(data);
    this.setElementPositionInPercent(this.findGameButton, 69, 48);
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
    this.setElementPositionInPercent(this.findGameCaption, 50, 15);
    this.addElementToContainer(this.findGameCaption, data);
};

FindGameView.prototype.createPlayer1Avatar = function (avatar, data) {
    var player1Avatar = this.createSpriteElement(avatar);
    this.setElementPositionInPercent(player1Avatar, 25, 50);
    this.addElementToContainer(player1Avatar, data);
};

FindGameView.prototype.createVersusText = function (data) {
    var versus = this.createTextElement(data);
    this.setElementPositionInPercent(versus, 50, 50);
    this.addElementToContainer(versus, data);
};

FindGameView.prototype.createPlayer2UnknownAvatar = function (avatar, data) {
    var player2UnknownAvatar = this.createSpriteElement(avatar);
    this.setElementPositionInPercent(player2UnknownAvatar, 75, 50);
    this.addElementToContainer(player2UnknownAvatar, data);
};

FindGameView.prototype.createPlayer1Text = function (data) {
    var player1 = this.createTextElement(data);
    this.setElementPositionInPercent(player1, 25, 74);
    this.addElementToContainer(player1, data);
};

FindGameView.prototype.createPlayer2Text = function (data) {
    var player2 = this.createTextElement(data);
    this.setElementPositionInPercent(player2, 75, 74);
    this.addElementToContainer(player2, data);
};

FindGameView.prototype.createPlayer2ActualAvatar = function (avatar) {
    this.removeElement(this.player2UnknownAvatar);
    var player2ActualAvatar = this.createSpriteElement(PIXI.Container.layoutData.AVATAR[avatar]);
    this.setElementPositionInPercent(player2ActualAvatar, 75, 50);
    this.addElementToContainer(player2ActualAvatar, PIXI.Container.layoutData.FIND_GAME.PLAYER_2_AVATAR);
};

FindGameView.prototype.createGameFoundCaption = function () {
    this.removeElement(this.findGameCaption);
    var foundGameCaption = this.createTextElement(PIXI.Container.layoutData.FIND_GAME.FOUND_GAME_CAPTION);
    this.setElementPositionInPercent(foundGameCaption, 50, 15);
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
    var layoutData = PIXI.Container.layoutData.MENU;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.createLogo(commonData.LOGO);
    this.createPlayButton(layoutData.PLAY_BUTTON);
    this.createHelpButton(layoutData.HELP_BUTTON);
};

MenuView.prototype.createLogo = function (data) {
    var logo = this.createSpriteElement(data);
    this.setElementPositionInPercent(logo, 50,10);
    this.addElementToContainer(logo, data);
};

MenuView.prototype.createPlayButton = function (data) {
    this.playButton = this.createSpriteElement(data);
    this.setElementPositionInPercent(this.playButton, 50, 35);
    this.addElementToContainer(this.playButton, data);
};

MenuView.prototype.createHelpButton = function (data) {
    this.helpButton = this.createSpriteElement(data);
    this.setElementPositionInPercent(this.helpButton, 50, 63);
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

View.prototype.addElementToContainer = function(element) {
    element.anchor.x = this.CENTER_ANCHOR;
    element.anchor.y = this.CENTER_ANCHOR;
    element.interactive = this.INTERACTIVE;
    this.addChild(element);
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

AvatarView.prototype.setupViewElements = function(avatarName) {
    var layoutData = PIXI.Container.layoutData.AVATAR;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.createAvatar(layoutData[avatarName]);
};

AvatarView.prototype.createAvatar = function (data) {
    this.removeElement(this.avatar);
    this.avatar = this.createSpriteElement(data);
    this.setElementPositionInPercent(this.avatar, 24, 60);
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
    this.setElementPositionInPercent(this.diceElement, 50, 36);
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
    this.setElementPositionInPercent(this.player1Avatar, 25, 25);
    this.addElementToContainer(this.player1Avatar, avatarPosition);
};

PlayerView.prototype.createPlayer2Avatar = function(avatar, avatarPosition) {
    this.player2Avatar = this.createSpriteElement(avatar);
    this.setElementPositionInPercent(this.player2Avatar, 75, 25);
    this.addElementToContainer(this.player2Avatar, avatarPosition);
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
    this.createCategoryElement(category, PIXI.Container.layoutData.QUESTION.CATEGORY);
    this.createQuestionElement(question.text, PIXI.Container.layoutData.QUESTION.QUESTION_POSITION);
    this.createAnswerElement1(question.right_answer, PIXI.Container.layoutData.QUESTION[this.ANSWER_PREFIX + this.answerIndices[0]]);
    this.createAnswerElement2(question.wrong_answer_1, PIXI.Container.layoutData.QUESTION[this.ANSWER_PREFIX + this.answerIndices[1]]);
    this.createAnswerElement3(question.wrong_answer_2, PIXI.Container.layoutData.QUESTION[this.ANSWER_PREFIX + this.answerIndices[2]]);
    this.createAnswerElement4(question.wrong_answer_3, PIXI.Container.layoutData.QUESTION[this.ANSWER_PREFIX + this.answerIndices[3]]);
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
    this.setElementPositionInPercent(this.playerWhoAnsweredElement, questionData[this.ANSWERED_PREFIX + (answerOnScreen + 1)].x, questionData[this.ANSWERED_PREFIX + (answerOnScreen + 1)].y);
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

WinView.prototype.createPlayAgainButton = function (data) {
    this.playAgainButton = this.createSpriteElement(data);
    this.setElementPositionInPercent(this.playAgainButton, 50, 47);
    this.addElementToContainer(this.playAgainButton, data);
};

WinView.prototype.getInteractiveViewElements = function() {
    return [this.playAgainButton];
};

module.exports = WinView;
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi5qcyIsInNyYy9Tb3VuZE1hbmFnZXIuanMiLCJzcmMvY29uc3RhbnQvU29ja2V0Q29uc3RhbnRzLmpzIiwic3JjL2NvbnRyb2xsZXIvQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0NvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9GaW5kR2FtZUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9HYW1lQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0hlbHBDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvTWVudUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9UdXJuQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvRGljZUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9zdWJjb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9zdWJjb250cm9sbGVyL1F1ZXN0aW9uQ29udHJvbGxlci5qcyIsInNyYy9sb2FkZXIvQnVja2V0TG9hZGVyLmpzIiwic3JjL2xvYWRlci9JbWFnZUxvYWRlci5qcyIsInNyYy9sb2FkZXIvSnNvbkxvYWRlci5qcyIsInNyYy9sb2FkZXIvVmlld0xvYWRlci5qcyIsInNyYy91dGlsL0Rpc3BsYXkuanMiLCJzcmMvdmlldy9BdmF0YXJTZWxlY3Rpb25WaWV3LmpzIiwic3JjL3ZpZXcvRmluZEdhbWVWaWV3LmpzIiwic3JjL3ZpZXcvSGVscFZpZXcuanMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy5qcyIsInNyYy92aWV3L01lbnVWaWV3LmpzIiwic3JjL3ZpZXcvVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvQXZhdGFyVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvRGljZVZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1BsYXllclZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1F1ZXN0aW9uVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvV2luVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkRpc3BsYXkgPSByZXF1aXJlKCcuL3V0aWwvRGlzcGxheScpO1xuU29ja2V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudC9Tb2NrZXRDb25zdGFudHMnKTtcblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvVmlldycpO1xuTG9hZGluZ1ZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvTG9hZGluZ1ZpZXcnKTtcbkJ1Y2tldExvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL0J1Y2tldExvYWRlcicpO1xuSnNvbkxvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL0pzb25Mb2FkZXInKTtcbkltYWdlTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvSW1hZ2VMb2FkZXInKTtcblZpZXdMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9WaWV3TG9hZGVyJyk7XG5Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0NvbnRyb2xsZXInKTtcbkhlbHBWaWV3ID0gcmVxdWlyZSgnLi92aWV3L0hlbHBWaWV3Jyk7XG5IZWxwQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9IZWxwQ29udHJvbGxlcicpO1xuTWVudVZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvTWVudVZpZXcnKTtcbk1lbnVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL01lbnVDb250cm9sbGVyJyk7XG5BdmF0YXJTZWxlY3Rpb25WaWV3ID0gcmVxdWlyZSgnLi92aWV3L0F2YXRhclNlbGVjdGlvblZpZXcnKTtcbkF2YXRhclZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9BdmF0YXJWaWV3Jyk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0F2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXInKTtcbkZpbmRHYW1lVmlldyA9IHJlcXVpcmUoJy4vdmlldy9GaW5kR2FtZVZpZXcnKTtcbkZpbmRHYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9GaW5kR2FtZUNvbnRyb2xsZXInKTtcblNvdW5kTWFuYWdlciA9IHJlcXVpcmUoJy4vU291bmRNYW5hZ2VyJyk7XG5HYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9HYW1lQ29udHJvbGxlcicpO1xuRGljZVZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9EaWNlVmlldycpO1xuRGljZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9EaWNlQ29udHJvbGxlcicpO1xuUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvUXVlc3Rpb25WaWV3Jyk7XG5RdWVzdGlvbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9RdWVzdGlvbkNvbnRyb2xsZXInKTtcblBsYXllclZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9QbGF5ZXJWaWV3Jyk7XG5QbGF5ZXJDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlcicpO1xuV2luVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L1dpblZpZXcnKTtcblR1cm5Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL1R1cm5Db250cm9sbGVyJyk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBcbiAgICB2YXIgREVGQVVMVF9XSURUSCA9IDQ4MDtcbiAgICB2YXIgREVGQVVMVF9IRUlHSFQgPSAzMjA7XG4gICAgdmFyIFJFTkRFUkVSX0JBQ0tHUk9VTkRfQ09MT1VSID0gMHgwMDAwMDA7XG4gICAgdmFyIERJVl9JRCA9IFwiZ2FtZVwiO1xuICAgIFxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJJbml0aWF0ZWQgYnVja2V0IGxvYWRlci5cIik7XG4gICAgICAgIG5ldyBCdWNrZXRMb2FkZXIobG9hZExheW91dCwgYnVja2V0TG9hZGluZ0ZhaWxlZE1lc3NhZ2UpO1xuICAgIH0pKCk7XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZExheW91dCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIGxheW91dFwiKTtcbiAgICAgICAgbmV3IEpzb25Mb2FkZXIoJy4vcmVzb3VyY2UvJyArIERpc3BsYXkuYnVja2V0LndpZHRoICsgJ3gnICsgRGlzcGxheS5idWNrZXQuaGVpZ2h0ICsgJy9sYXlvdXQuanNvbicsIHNldExheW91dERhdGFJblBJWEkpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXRMYXlvdXREYXRhSW5QSVhJKGxheW91dERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTZXR0aW5nIGxheW91dC5cIik7XG4gICAgICAgIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEgPSBsYXlvdXREYXRhO1xuICAgICAgICBzdGFydFJlbmRlcmluZygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzdGFydFJlbmRlcmluZygpIHtcbiAgICAgICAgdmFyIHJlbmRlcmVyT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGFudGlhbGlhc2luZzpmYWxzZSxcbiAgICAgICAgICAgIHJlc29sdXRpb246MSxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjpSRU5ERVJFUl9CQUNLR1JPVU5EX0NPTE9VUlxuICAgICAgICB9O1xuICAgICAgICB2YXIgdmlld0xvYWRlciA9IG5ldyBWaWV3TG9hZGVyKCk7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgICAgICAgY29udGFpbmVyLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdmFyIHJlbmRlcmVyID0gbmV3IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpbmRvdy5pbm5lcldpZHRoICogRGlzcGxheS5zY2FsZSwgd2luZG93LmlubmVySGVpZ2h0ICogRGlzcGxheS5zY2FsZSwgcmVuZGVyZXJPcHRpb25zKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJTY2FsZSBpcyBcIiArIERpc3BsYXkuc2NhbGUpO1xuICAgICAgICByZW5kZXJlci5yb3VuZFBpeGVscyA9IHRydWU7XG4gICAgICAgIHNldERlcGVuZGVuY2llcyh2aWV3TG9hZGVyLCBjb250YWluZXIsIHJlbmRlcmVyKTtcbiAgICAgICAgYXBwZW5kR2FtZVRvRE9NKHJlbmRlcmVyKTtcbiAgICAgICAgYmVnaW5BbmltYXRpb24odmlld0xvYWRlcik7XG4gICAgICAgIGFkZExvYWRpbmdWaWV3VG9TY3JlZW4odmlld0xvYWRlcik7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKCcuL3Jlc291cmNlL3F1ZXN0aW9ucy5qc29uJywgc2V0UXVlc3Rpb25EYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXRRdWVzdGlvbkRhdGFJblF1ZXN0aW9uQ29udHJvbGxlcihxdWVzdGlvbkRhdGEpIHtcbiAgICAgICAgUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5xdWVzdGlvbkRhdGEgPSBxdWVzdGlvbkRhdGE7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKCcuL3Jlc291cmNlL2NhdGVnb3JpZXMuanNvbicsIHNldENhdGVnb3J5RGF0YUluUXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0Q2F0ZWdvcnlEYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIoY2F0ZWdvcnlEYXRhKSB7XG4gICAgICAgIFF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY2F0ZWdvcnlEYXRhID0gY2F0ZWdvcnlEYXRhO1xuICAgICAgICBsb2FkSW1hZ2VzKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZXMoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzcGxheSByZXNvdXJjZSBwYXRoOiBcIiArIERpc3BsYXkucmVzb3VyY2VQYXRoKTtcbiAgICAgICAgbmV3IEltYWdlTG9hZGVyKCcuL3Jlc291cmNlLycgKyBEaXNwbGF5LnJlc291cmNlUGF0aCArICcvaW1hZ2VzLmpzb24nLCBiZWdpbkdhbWUpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBhcHBlbmRHYW1lVG9ET00ocmVuZGVyZXIpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRElWX0lEKS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0RGVwZW5kZW5jaWVzKHZpZXdMb2FkZXIsIGNvbnRhaW5lciwgcmVuZGVyZXIpIHtcbiAgICAgICAgdmlld0xvYWRlci5zZXRDb250YWluZXIoY29udGFpbmVyKTtcbiAgICAgICAgdmlld0xvYWRlci5zZXRSZW5kZXJlcihyZW5kZXJlcik7XG4gICAgICAgIENvbnRyb2xsZXIuc2V0Vmlld0xvYWRlcih2aWV3TG9hZGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYmVnaW5BbmltYXRpb24odmlld0xvYWRlcikge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodmlld0xvYWRlci5hbmltYXRlKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYmVnaW5HYW1lKCkge1xuICAgICAgICB2YXIgbWVudUNvbnRyb2xsZXIgPSBuZXcgTWVudUNvbnRyb2xsZXIoKTsgXG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFkZExvYWRpbmdWaWV3VG9TY3JlZW4odmlld0xvYWRlcikge1xuICAgICAgICB2YXIgbG9hZGluZ1ZpZXcgPSBuZXcgTG9hZGluZ1ZpZXcoKTtcbiAgICAgICAgbG9hZGluZ1ZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICAgICAgdmlld0xvYWRlci5sb2FkVmlldyhsb2FkaW5nVmlldyk7XG4gICAgfVxuICAgICAgICBcbiAgICBmdW5jdGlvbiBidWNrZXRMb2FkaW5nRmFpbGVkTWVzc2FnZSgpIHtcbiAgICAgICAgRGlzcGxheS5idWNrZXQuaGVpZ2h0ID0gREVGQVVMVF9IRUlHSFQ7XG4gICAgICAgIERpc3BsYXkuYnVja2V0LndpZHRoID0gREVGQVVMVF9XSURUSDtcbiAgICAgICAgRGlzcGxheS5zY2FsZSA9IDE7XG4gICAgICAgIERpc3BsYXkucmVzb3VyY2VQYXRoID0gREVGQVVMVF9XSURUSCArICd4JyArIERFRkFVTFRfSEVJR0hUO1xuICAgIH1cbn07IiwiZnVuY3Rpb24gU291bmRNYW5hZ2VyKCkge1xuICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jb3JyZWN0QW5zd2VyU291bmQgPSBuZXcgSG93bCh7dXJsczogW1wicmVzb3VyY2Uvc291bmQvY29ycmVjdC1hbnN3ZXIubXAzXCJdfSk7XG4gICAgICAgIHRoaXMud3JvbmdBbnN3ZXJTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC93cm9uZy1hbnN3ZXIubXAzXCJdfSk7XG4gICAgICAgIHRoaXMucm9sbERpY2VTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC9yb2xsLWRpY2UubXAzXCJdfSk7XG4gICAgICAgIHRoaXMudGlja1NvdW5kID0gbmV3IEhvd2woe3VybHM6IFtcInJlc291cmNlL3NvdW5kL3RpY2subXAzXCJdfSk7XG4gICAgfS5iaW5kKHRoaXMpKSgpO1xuICAgIFxuICAgIHRoaXMucGxheUNvcnJlY3RBbnN3ZXJTb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvcnJlY3RBbnN3ZXJTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlXcm9uZ0Fuc3dlclNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMud3JvbmdBbnN3ZXJTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlSb2xsRGljZVNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucm9sbERpY2VTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlUaWNrU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50aWNrU291bmQucGxheSgpO1xuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmRNYW5hZ2VyOyIsInZhciBTb2NrZXRDb25zdGFudHMgPSB7XG4gICAgJ29uJyA6IHtcbiAgICAgICAgJ1BMQVlFUlNfSEVBTFRIJyA6ICdwbGF5ZXJzLWhlYWx0aCcsXG4gICAgICAgICdESUNFX05VTUJFUicgOiAnZGljZS1udW1iZXInLFxuICAgICAgICAnUkFORE9NX1FVRVNUSU9OJyA6ICdyYW5kb20tcXVlc3Rpb24nLFxuICAgICAgICAnSU5JVF9ORVdfVFVSTicgOiAnaW5pdC1uZXctdHVybicsXG4gICAgICAgICdEQU1BR0VfREVBTFQnIDogJ2RhbWFnZS1kZWFsdCcsXG4gICAgICAgICdTSFVGRkxFRF9BTlNXRVJfSU5ESUNFUycgOiAnc2h1ZmZsZWQtYW5zd2VyLWluZGljZXMnLFxuICAgICAgICAnR0FNRV9GT1VORCcgOiAnZ2FtZS1mb3VuZCcsXG4gICAgICAgICdHQU1FX1NUQVRTJyA6ICdnYW1lLXN0YXRzJ1xuICAgIH0sXG4gICAgXG4gICAgJ2VtaXQnIDoge1xuICAgICAgICAnQ09OTkVDVElPTicgOiAnY29ubmVjdGlvbicsXG4gICAgICAgICdGSU5ESU5HX0dBTUUnIDogJ2ZpbmRpbmctZ2FtZScsXG4gICAgICAgICdHRVRfUExBWUVSU19IRUFMVEgnIDogJ2dldC1wbGF5ZXJzLWhlYWx0aCcsXG4gICAgICAgICdESVNDT05ORUNUJyA6ICdkaXNjb25uZWN0JyxcbiAgICAgICAgJ1JPTExfRElDRScgOiAncm9sbC1kaWNlJyxcbiAgICAgICAgJ0dFVF9SQU5ET01fUVVFU1RJT04nIDogJ2dldC1yYW5kb20tcXVlc3Rpb24nLFxuICAgICAgICAnTkVXX1RVUk4nIDogJ25ldy10dXJuJyxcbiAgICAgICAgJ0RFQUxfREFNQUdFJyA6ICdkZWFsLWRhbWFnZScsXG4gICAgICAgICdTSFVGRkxFX0FOU1dFUl9JTkRJQ0VTJyA6ICdzaHVmZmxlLWFuc3dlci1pbmRpY2VzJyxcbiAgICAgICAgJ0dBTUVfRU5ERUQnIDogJ2dhbWUtZW5kZWQnXG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb2NrZXRDb25zdGFudHM7IiwiQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBBdmF0YXJTZWxlY3Rpb25WaWV3KCk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZWxlY3RlZEF2YXRhclZpZXcgPSBuZXcgQXZhdGFyVmlldygpO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuYXZhdGFycyA9IFsnRU1PSklfQU5HRUwnLCAnRU1PSklfQklHX1NNSUxFJywgJ0VNT0pJX0NPT0wnLCAnRU1PSklfR1JJTicsICdFTU9KSV9IQVBQWScsICdFTU9KSV9LSVNTJywgJ0VNT0pJX0xBVUdISU5HJywgJ0VNT0pJX0xPVkUnLCAnRU1PSklfTU9OS0VZJywgJ0VNT0pJX1BPTycsICdFTU9KSV9TQ1JFQU0nLCAnRU1PSklfU0xFRVAnLCAnRU1PSklfU01JTEUnLCAnRU1PSklfU1dFRVQnLCAnRU1PSklfV0lOSyddO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY3VycmVudEF2YXRhckluZGV4ID0gMDtcblxuZnVuY3Rpb24gQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLmxvYWRWaWV3KCk7XG59XG5cbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKCk7XG4gICAgdGhpcy5zZWxlY3RlZEF2YXRhclZpZXcuc2V0dXBWaWV3RWxlbWVudHModGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XSk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3KTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBiYWNrQnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5CQUNLX0JVVFRPTl07XG4gICAgdmFyIHNlbGVjdFVwID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5TRUxFQ1RfVVBdO1xuICAgIHZhciBzZWxlY3REb3duID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5TRUxFQ1RfRE9XTl07XG4gICAgdmFyIGZpbmRHYW1lID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5GSU5EX0dBTUVdO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gbmV3IE1lbnVDb250cm9sbGVyKCk7XG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHNlbGVjdFVwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIFVQID0gMTtcbiAgICAgICAgdGhpcy5zZXR1cE5leHRBdmF0YXIoVVApO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoc2VsZWN0RG93biwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBET1dOID0gLTE7XG4gICAgICAgIHRoaXMuc2V0dXBOZXh0QXZhdGFyKERPV04pO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoZmluZEdhbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXZhdGFyID0gdGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XTtcbiAgICAgICAgdmFyIGZpbmRHYW1lQ29udHJvbGxlciA9IG5ldyBGaW5kR2FtZUNvbnRyb2xsZXIoYXZhdGFyKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBOZXh0QXZhdGFyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgaWYodGhpcy5jdXJyZW50QXZhdGFySW5kZXggPj0gKHRoaXMuYXZhdGFycy5sZW5ndGggLSAxKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCA9IDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCArIGRpcmVjdGlvbiA8IDApIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXZhdGFySW5kZXggPSAodGhpcy5hdmF0YXJzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3VycmVudEF2YXRhckluZGV4ID0gdGhpcy5jdXJyZW50QXZhdGFySW5kZXggKyBkaXJlY3Rpb247XG4gICAgfVxuICAgXG4gICAgdGhpcy5zZWxlY3RlZEF2YXRhclZpZXcuc2V0dXBWaWV3RWxlbWVudHModGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcjsiLCJmdW5jdGlvbiBDb250cm9sbGVyKCkge31cblxuQ29udHJvbGxlci5zZXRWaWV3TG9hZGVyID0gZnVuY3Rpb24odmlld0xvYWRlcikge1xuICAgIENvbnRyb2xsZXIucHJvdG90eXBlLnZpZXdMb2FkZXIgPSB2aWV3TG9hZGVyO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuc29ja2V0ID0gaW8oKTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJMaXN0ZW5lciA9IGZ1bmN0aW9uKHZpZXdFbGVtZW50LCBhY3Rpb24pIHtcbiAgICB2aWV3RWxlbWVudC50b3VjaGVuZCA9IHZpZXdFbGVtZW50LmNsaWNrID0gYWN0aW9uO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJNdWx0aXBsZUxpc3RlbmVycyA9IGZ1bmN0aW9uKHZpZXdFbGVtZW50cywgYWN0aW9uKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHZpZXdFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIodmlld0VsZW1lbnRzW2ldLCBhY3Rpb24pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlcjsiLCJGaW5kR2FtZUNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBGaW5kR2FtZUNvbnRyb2xsZXI7XG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgRmluZEdhbWVWaWV3KCk7XG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmF2YXRhciA9IG51bGw7XG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLlRSQU5TSVRJT05fVE9fR0FNRV9USU1FID0gMzAwMDtcblxuZnVuY3Rpb24gRmluZEdhbWVDb250cm9sbGVyKGF2YXRhcikge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmNsZWFuVmlldygpO1xuICAgIHRoaXMuYXZhdGFyID0gYXZhdGFyO1xuICAgIHRoaXMubG9hZFZpZXcoKTtcbn1cblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cyh0aGlzLmF2YXRhcik7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy5zZXR1cFNlcnZlckludGVyYWN0aW9uKCk7XG59O1xuXG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwU2VydmVySW50ZXJhY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uR0FNRV9GT1VORCwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLmFzc2lnbkF2YXRhcnMocGxheWVyRGF0YSk7XG4gICAgICAgIHRoaXMudmlldy5jcmVhdGVHYW1lRm91bmRDYXB0aW9uKCk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICAgICAgICAgIHZhciBwbGF5ZXJDb250cm9sbGVyID0gbmV3IFBsYXllckNvbnRyb2xsZXIocGxheWVyRGF0YSk7XG4gICAgICAgICAgICB2YXIgZGljZUNvbnRyb2xsZXIgPSBuZXcgRGljZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbkNvbnRyb2xsZXIgPSBuZXcgUXVlc3Rpb25Db250cm9sbGVyKHBsYXllckNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgdmFyIHR1cm5Db250cm9sbGVyID0gbmV3IFR1cm5Db250cm9sbGVyKHBsYXllckNvbnRyb2xsZXIsIGRpY2VDb250cm9sbGVyLCBxdWVzdGlvbkNvbnRyb2xsZXIpO1xuICAgICAgICB9LmJpbmQodGhpcyksIHRoaXMuVFJBTlNJVElPTl9UT19HQU1FX1RJTUUpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5GSU5ESU5HX0dBTUUsIHthdmF0YXI6IHRoaXMuYXZhdGFyfSk7XG59O1xuXG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmFzc2lnbkF2YXRhcnMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHNvY2tldElkUHJlZml4ID0gXCIvI1wiO1xuICAgIHZhciBzb2NrZXRJZCA9IHNvY2tldElkUHJlZml4ICsgdGhpcy5zb2NrZXQuaWQ7XG4gICAgaWYoZGF0YS5wbGF5ZXIxSWQgPT09IHNvY2tldElkKSB7XG4gICAgICAgIHRoaXMudmlldy5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyKGRhdGEucGxheWVyMkF2YXRhcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52aWV3LmNyZWF0ZVBsYXllcjJBY3R1YWxBdmF0YXIoZGF0YS5wbGF5ZXIxQXZhdGFyKTtcbiAgICB9XG59O1xuXG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaW5kR2FtZUNvbnRyb2xsZXI7IiwiR2FtZUNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBHYW1lQ29udHJvbGxlcjtcbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBHYW1lQ29udHJvbGxlcihwbGF5ZXJEYXRhKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xufVxuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc2V0UGxheWVyRGF0YSA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICBHYW1lQ29udHJvbGxlci5wcm90b3R5cGUucGxheWVyRGF0YSA9IHBsYXllckRhdGE7XG59O1xuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc2V0RGljZU51bWJlciA9IGZ1bmN0aW9uKGRpY2VOdW1iZXIpIHtcbiAgICBHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuZGljZU51bWJlciA9IGRpY2VOdW1iZXI7XG59O1xuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuaXNQbGF5ZXIxID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNvY2tldFByZWZpeCA9IFwiLyNcIjtcbiAgICByZXR1cm4gdGhpcy5wbGF5ZXJEYXRhLnBsYXllcjFJZCA9PT0gKHNvY2tldFByZWZpeCArIEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zb2NrZXQuaWQpO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmdldFBsYXllciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlzUGxheWVyMSh0aGlzLnBsYXllckRhdGEpID8gXCJQTEFZRVJfMVwiIDogXCJQTEFZRVJfMlwiO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmdldE9wcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNQbGF5ZXIxKHRoaXMucGxheWVyRGF0YSkgPyBcIlBMQVlFUl8yXCIgOiBcIlBMQVlFUl8xXCI7XG59O1xuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc291bmRNYW5hZ2VyID0gbmV3IFNvdW5kTWFuYWdlcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVDb250cm9sbGVyOyIsIkhlbHBDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gSGVscENvbnRyb2xsZXI7XG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbkhlbHBDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEhlbHBWaWV3KCk7XG5cbmZ1bmN0aW9uIEhlbHBDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmxvYWRWaWV3KCk7XG59XG5cbkhlbHBDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbn07XG5cbkhlbHBDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBiYWNrQnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5CQUNLX0JVVFRPTl07XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGJhY2tCdXR0b24sIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWVudUNvbnRyb2xsZXIgPSBuZXcgTWVudUNvbnRyb2xsZXIoKTtcbiAgICB9KTtcbiAgICBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSGVscENvbnRyb2xsZXI7IiwiTWVudUNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBNZW51Q29udHJvbGxlcjtcbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgTWVudVZpZXcoKTtcblxuZnVuY3Rpb24gTWVudUNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMubG9hZFZpZXcoKTtcbn1cblxuTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKCk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xufTtcblxuTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZXdFbGVtZW50cyA9IHRoaXMudmlldy5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cygpOyAgXG4gICAgdmFyIHBsYXlCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlBMQVlfQlVUVE9OXTtcbiAgICB2YXIgaGVscEJ1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuSEVMUF9CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihwbGF5QnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSBuZXcgQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcigpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihoZWxwQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhlbHBDb250cm9sbGVyID0gbmV3IEhlbHBDb250cm9sbGVyKCk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVDb250cm9sbGVyOyIsIlR1cm5Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gVHVybkNvbnRyb2xsZXI7XG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIFR1cm5Db250cm9sbGVyKHBsYXllckNvbnRyb2xsZXIsIGRpY2VDb250cm9sbGVyLCBxdWVzdGlvbkNvbnRyb2xsZXIpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyID0gcGxheWVyQ29udHJvbGxlcjtcbiAgICB0aGlzLmRpY2VDb250cm9sbGVyID0gZGljZUNvbnRyb2xsZXI7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIgPSBxdWVzdGlvbkNvbnRyb2xsZXI7XG4gICAgdGhpcy53aW5WaWV3ID0gbmV3IFdpblZpZXcoKTtcbiAgICB0aGlzLmNsZWFuVmlldygpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmxvYWRWaWV3KCk7XG4gICAgdGhpcy5uZXdUdXJuKCk7XG59XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5yZWdpc3RlclNvY2tldEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5JTklUX05FV19UVVJOLCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGlmKHBsYXllckRhdGEucGxheWVyMUhlYWx0aCA9PT0gMCkge1xuICAgICAgICAgICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1pdHRlZCBwbGF5ZXIgMiBhcyB3aW5uZXIhXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuR0FNRV9FTkRFRCwge3dpbm5lcjogXCJQTEFZRVJfMlwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZihwbGF5ZXJEYXRhLnBsYXllcjJIZWFsdGggPT09IDApIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtaXR0ZWQgcGxheWVyIDEgYXMgd2lubmVyIVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdBTUVfRU5ERUQsIHt3aW5uZXI6IFwiUExBWUVSXzFcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1R1cm4oKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMTUwMCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5HQU1FX1NUQVRTLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyB3aW4gdmlldyFcIik7XG4gICAgICAgIHRoaXMubG9hZFdpblZpZXcoZGF0YS53aW5uZXIsIGRhdGEpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFdpblZpZXcgPSBmdW5jdGlvbihwbGF5ZXIsIGRhdGEpIHtcbiAgICB0aGlzLmRpY2VDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMud2luVmlldy5jcmVhdGVXaW5uZXJUZXh0KHBsYXllciwgZGF0YSk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMud2luVmlldyk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy53aW5WaWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgcGxheUFnYWluQnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMud2luVmlldy5QTEFZX0FHQUlOX0JVVFRPTl07XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHBsYXlBZ2FpbkJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGxheWVyQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICAgICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgICAgIHZhciBhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gbmV3IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIoKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLm5ld1R1cm4gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmRpY2VDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZGljZUNvbnRyb2xsZXIucm9sbERpY2UoKTtcbiAgICB9LmJpbmQodGhpcyksIDIwMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmxvYWRWaWV3KCk7XG4gICAgfS5iaW5kKHRoaXMpLCAzMDAwKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5jaGVja1BsYXllcnNIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9QTEFZRVJTX0hFQUxUSCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFR1cm5Db250cm9sbGVyOyIsIkRpY2VDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gRGljZUNvbnRyb2xsZXI7XG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBEaWNlVmlldygpO1xuXG5mdW5jdGlvbiBEaWNlQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uRElDRV9OVU1CRVIsIGZ1bmN0aW9uKGRpY2UpIHtcbiAgICAgICAgdGhpcy5zb3VuZE1hbmFnZXIucGxheVJvbGxEaWNlU291bmQoKTtcbiAgICAgICAgdGhpcy5sb2FkRGljZShkaWNlLm51bWJlcik7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS5yb2xsRGljZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ST0xMX0RJQ0UpO1xuICAgIH1cbn07XG5cbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkRGljZSA9IGZ1bmN0aW9uKGRpY2VOdW1iZXIpIHtcbiAgICB0aGlzLnZpZXcuc2V0dXBEaWNlKGRpY2VOdW1iZXIpO1xuICAgIHRoaXMuc2V0RGljZU51bWJlcihkaWNlTnVtYmVyKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbn07XG5cbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGljZUNvbnRyb2xsZXI7IiwiUGxheWVyQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IFBsYXllckNvbnRyb2xsZXI7XG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlKTtcblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgUGxheWVyVmlldygpO1xuXG5mdW5jdGlvbiBQbGF5ZXJDb250cm9sbGVyKHBsYXllckRhdGEpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5zZXRQbGF5ZXJEYXRhKHBsYXllckRhdGEpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXcuc2V0UGxheWVyRGF0YSh0aGlzLnBsYXllckRhdGEpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudXBkYXRlUGxheWVyc0hlYWx0aCgpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xufTtcblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uUExBWUVSU19IRUFMVEgsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5jbGVhckludGVydmFscygpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0UGxheWVyMUhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGgpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0UGxheWVyMkhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjJIZWFsdGgpO1xuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGggPD0gNSkge1xuICAgICAgICAgICAgdGhpcy52aWV3LmZsYXNoUGxheWVyMUhlYWx0aCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHBsYXllckRhdGEucGxheWVyMkhlYWx0aCA8PSA1KSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuZmxhc2hQbGF5ZXIySGVhbHRoKCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlUGxheWVyc0hlYWx0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuR0VUX1BMQVlFUlNfSEVBTFRIKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYXJJbnRlcnZhbHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXcuY2xlYXJJbnRlcnZhbHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyQ29udHJvbGxlcjsiLCJRdWVzdGlvbkNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBRdWVzdGlvbkNvbnRyb2xsZXI7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IFF1ZXN0aW9uVmlldygpO1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzEgPSAnQU5TV0VSRURfMSc7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzIgPSAnQU5TV0VSRURfMic7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzMgPSAnQU5TV0VSRURfMyc7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzQgPSAnQU5TV0VSRURfNCc7XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuVElNRV9UT19BTlNXRVJfUVVFU1RJT04gPSAxMDtcblxuZnVuY3Rpb24gUXVlc3Rpb25Db250cm9sbGVyKHBsYXllckNvbnRyb2xsZXIpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyID0gcGxheWVyQ29udHJvbGxlcjtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG59XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uUkFORE9NX1FVRVNUSU9OLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBkYXRhLnF1ZXN0aW9uO1xuICAgICAgICB0aGlzLmNhdGVnb3J5ID0gZGF0YS5jYXRlZ29yeTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5EQU1BR0VfREVBTFQsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy52aWV3LnNldEFuc3dlclRvQ29sb3VyKHRoaXMuYW5zd2Vyc1twbGF5ZXJEYXRhLmFuc3dlcl0sIHBsYXllckRhdGEuYW5zd2VyKTtcbiAgICAgICAgdGhpcy52aWV3LnNldEFuc3dlclRvQ29sb3VyKHRoaXMuYW5zd2Vyc1t0aGlzLkFOU1dFUkVEXzFdLCB0aGlzLkFOU1dFUkVEXzEpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0V2hvQW5zd2VyZWRRdWVzdGlvbih0aGlzLmFuc3dlcnNbcGxheWVyRGF0YS5hbnN3ZXJdLCBwbGF5ZXJEYXRhLmFuc3dlciwgcGxheWVyRGF0YS5wbGF5ZXJfd2hvX2Fuc3dlcmVkKTtcbiAgICAgICAgdGhpcy52aWV3LnR1cm5PZmZJbnRlcmFjdGl2aXR5Rm9yQW5zd2VyRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLnVwZGF0ZVBsYXllcnNIZWFsdGgoKTtcbiAgICAgICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySW50ZXJ2YWxJZCk7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0Lk5FV19UVVJOKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlNIVUZGTEVEX0FOU1dFUl9JTkRJQ0VTLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJJbmRpY2VzKGRhdGEpO1xuICAgICAgICB0aGlzLnZpZXcuZGlzcGxheUNhdGVnb3J5QW5kUXVlc3Rpb24odGhpcy5jYXRlZ29yeSwgdGhpcy5xdWVzdGlvbik7XG4gICAgICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJbnRlcnZhbElkKTtcbiAgICB0aGlzLmdldFJhbmRvbVF1ZXN0aW9uKCk7XG4gICAgdGhpcy5zaHVmZmxlQW5zd2VySW5kaWNlcygpO1xuICAgIHRoaXMudXBkYXRlVGltZXIoKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlVGltZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGltZVJlbWFpbmluZyA9IDEwO1xuICAgIHZhciB0aW1lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aW1lUmVtYWluaW5nID49IDApIHtcbiAgICAgICAgICAgIHRoaXMudmlldy51cGRhdGVRdWVzdGlvblRpbWVyKHRpbWVSZW1haW5pbmcpO1xuICAgICAgICAgICAgdGhpcy5zb3VuZE1hbmFnZXIucGxheVRpY2tTb3VuZCgpO1xuICAgICAgICAgICAgdGltZVJlbWFpbmluZy0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuTkVXX1RVUk4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySW50ZXJ2YWxJZCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcyk7XG4gICAgdGhpcy50aW1lckludGVydmFsSWQgPSBzZXRJbnRlcnZhbCh0aW1lciwgMTAwMCk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmdldFJhbmRvbVF1ZXN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICB2YXIgY2F0ZWdvcmllcyA9IHRoaXMuY2F0ZWdvcnlEYXRhLkNBVEVHT1JJRVM7XG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLnF1ZXN0aW9uRGF0YS5DQVRFR09SSUVTO1xuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9SQU5ET01fUVVFU1RJT04sIHtjYXRlZ29yaWVzOiBjYXRlZ29yaWVzLCBxdWVzdGlvbnM6IHF1ZXN0aW9uc30pO1xuICAgIH1cbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYW5zd2VycyA9IHRoaXMuZ2V0Vmlld0Fuc3dlcnMoKTtcbiAgICB0aGlzLnNldFJpZ2h0QW5zd2VyTGlzdGVuZXIoYW5zd2Vycyk7XG4gICAgdGhpcy5zZXRXcm9uZ0Fuc3dlckxpc3RlbmVycyhhbnN3ZXJzKTtcbiAgICB0aGlzLnNldEFuc3dlclVwZGF0ZUxpc3RlbmVyKGFuc3dlcnMpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5nZXRWaWV3QW5zd2VycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTtcbiAgICB2YXIgYW5zd2VycyA9IHt9O1xuICAgIGFuc3dlcnMuQU5TV0VSRURfMSA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuUklHSFRfQU5TV0VSXTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzIgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LldST05HX0FOU1dFUl8xXTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzMgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LldST05HX0FOU1dFUl8yXTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzQgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LldST05HX0FOU1dFUl8zXTtcbiAgICByZXR1cm4gYW5zd2Vycztcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0UmlnaHRBbnN3ZXJMaXN0ZW5lciA9IGZ1bmN0aW9uKGFuc3dlcnMpIHtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF8xLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zb3VuZE1hbmFnZXIucGxheUNvcnJlY3RBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9PcHBvbmVudFRvU29ja2V0KHRoaXMuQU5TV0VSRURfMSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0V3JvbmdBbnN3ZXJMaXN0ZW5lcnMgPSBmdW5jdGlvbihhbnN3ZXJzKSB7XG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfMiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlXcm9uZ0Fuc3dlclNvdW5kKCk7XG4gICAgICAgIHRoaXMuZW1pdERlYWxEYW1hZ2VUb1NlbGZUb1NvY2tldCh0aGlzLkFOU1dFUkVEXzIpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfMywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlXcm9uZ0Fuc3dlclNvdW5kKCk7XG4gICAgICAgIHRoaXMuZW1pdERlYWxEYW1hZ2VUb1NlbGZUb1NvY2tldCh0aGlzLkFOU1dFUkVEXzMpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfNCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlXcm9uZ0Fuc3dlclNvdW5kKCk7XG4gICAgICAgIHRoaXMuZW1pdERlYWxEYW1hZ2VUb1NlbGZUb1NvY2tldCh0aGlzLkFOU1dFUkVEXzQpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNodWZmbGVBbnN3ZXJJbmRpY2VzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuU0hVRkZMRV9BTlNXRVJfSU5ESUNFUywge2luZGljZXM6IFsxLDIsMyw0XX0pO1xuICAgIH1cbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0QW5zd2VyVXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbihhbnN3ZXJzKSB7XG4gICAgdGhpcy5hbnN3ZXJzID0gYW5zd2Vycztcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZW1pdERlYWxEYW1hZ2VUb09wcG9uZW50VG9Tb2NrZXQgPSBmdW5jdGlvbihhbnN3ZXIpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkRFQUxfREFNQUdFLCB7cGxheWVyX3dob19hbnN3ZXJlZDogdGhpcy5nZXRQbGF5ZXIoKSwgcGxheWVyX3RvX2RhbWFnZTogdGhpcy5nZXRPcHBvbmVudCgpLCBkYW1hZ2U6IHRoaXMuZGljZU51bWJlciwgYW5zd2VyOiBhbnN3ZXIsIGFuc3dlclN0YXR1czogJ2NvcnJlY3QnLCBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeX0pO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0ID0gZnVuY3Rpb24oYW5zd2VyKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ERUFMX0RBTUFHRSwge3BsYXllcl93aG9fYW5zd2VyZWQ6IHRoaXMuZ2V0UGxheWVyKCksIHBsYXllcl90b19kYW1hZ2U6IHRoaXMuZ2V0UGxheWVyKCksIGRhbWFnZTogdGhpcy5kaWNlTnVtYmVyLCBhbnN3ZXI6IGFuc3dlciwgYW5zd2VyU3RhdHVzOiAnaW5jb3JyZWN0JywgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnl9KTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uQ29udHJvbGxlcjsiLCJmdW5jdGlvbiBCdWNrZXRMb2FkZXIgKGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIFBPUlRSQUlUID0gXCJwb3J0cmFpdFwiLFxuICAgICAgICBMQU5EU0NBUEUgPSBcImxhbmRzY2FwZVwiLFxuICAgICAgICBCVUNLRVRfU0laRV9KU09OX1BBVEggPSBcInJlc291cmNlL2J1Y2tldF9zaXplcy5qc29uXCI7XG5cbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICBuZXcgSnNvbkxvYWRlcihCVUNLRVRfU0laRV9KU09OX1BBVEgsIGNhbGN1bGF0ZUJlc3RCdWNrZXQpO1xuICAgIH0pKCk7XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVTY2FsZSAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLmZsb29yKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSwgMik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlQmVzdEJ1Y2tldCAoYnVja2V0RGF0YSkge1xuICAgICAgICB2YXIgb3JpZW50YXRpb24gPSBjYWxjdWxhdGVPcmllbnRhdGlvbigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIk9yaWVudGF0aW9uIGlzIFwiICsgb3JpZW50YXRpb24pO1xuICAgICAgICBidWNrZXREYXRhW29yaWVudGF0aW9uXS5mb3JFYWNoKGZ1bmN0aW9uIChidWNrZXQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQnVja2V0IGhlaWdodDogXCIgKyBidWNrZXQuaGVpZ2h0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2luZG93IGhlaWdodDogXCIgKyB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICAgICAgaWYgKGJ1Y2tldC5oZWlnaHQgPD0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgRGlzcGxheS5idWNrZXQgPSBidWNrZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgRGlzcGxheS5zY2FsZSA9IGNhbGN1bGF0ZVNjYWxlKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgRGlzcGxheS5yZXNvdXJjZVBhdGggPSBEaXNwbGF5LmJ1Y2tldC53aWR0aCArICd4JyArIERpc3BsYXkuYnVja2V0LmhlaWdodDtcbiAgICAgICAgRGlzcGxheS5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICAgICAgICBleGVjdXRlQ2FsbGJhY2soKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlT3JpZW50YXRpb24gKCkge1xuICAgICAgICBpZiAod2luZG93LmlubmVySGVpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBQT1JUUkFJVDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBMQU5EU0NBUEU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleGVjdXRlQ2FsbGJhY2sgKCkge1xuICAgICAgICBpZiAoRGlzcGxheS5idWNrZXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnVja2V0TG9hZGVyOyIsInZhciBJbWFnZUxvYWRlciA9IGZ1bmN0aW9uKGltYWdlSnNvblBhdGgsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGpzb25Mb2FkZXIgPSBuZXcgSnNvbkxvYWRlcihpbWFnZUpzb25QYXRoLCBsb2FkSW1hZ2VzKTtcbiAgICB2YXIgaW1hZ2VzTG9hZGVkID0gMDtcbiAgICB2YXIgdG90YWxJbWFnZXMgPSAwO1xuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZXMoaW1hZ2VEYXRhKSB7XG4gICAgICAgIHZhciBpbWFnZXMgPSBpbWFnZURhdGEuSU1BR0VTO1xuICAgICAgICBjb3VudE51bWJlck9mSW1hZ2VzKGltYWdlcyk7XG4gICAgICAgIGZvcih2YXIgaW1hZ2UgaW4gaW1hZ2VzKSB7XG4gICAgICAgICAgICBsb2FkSW1hZ2UoaW1hZ2VzW2ltYWdlXS5wYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkSW1hZ2UoaW1hZ2VQYXRoKSB7XG4gICAgICAgIHZhciBSRVFVRVNUX0ZJTklTSEVEID0gNDtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignR0VUJywgaW1hZ2VQYXRoLCB0cnVlKTtcbiAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IFJFUVVFU1RfRklOSVNIRUQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGaW5pc2hlZCBsb2FkaW5nIGltYWdlIHBhdGg6IFwiICsgaW1hZ2VQYXRoKTtcbiAgICAgICAgICAgICAgaW1hZ2VzTG9hZGVkKys7XG4gICAgICAgICAgICAgIGNoZWNrSWZBbGxJbWFnZXNMb2FkZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGNvdW50TnVtYmVyT2ZJbWFnZXMoaW1hZ2VzKSB7XG4gICAgICAgIGZvcih2YXIgaW1hZ2UgaW4gaW1hZ2VzKSB7XG4gICAgICAgICAgICB0b3RhbEltYWdlcysrO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGNoZWNrSWZBbGxJbWFnZXNMb2FkZWQoKSB7XG4gICAgICAgIGlmKGltYWdlc0xvYWRlZCA9PT0gdG90YWxJbWFnZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWxsIGltYWdlcyBsb2FkZWQhXCIpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT25seSBcIiArIGltYWdlc0xvYWRlZCArIFwiIGFyZSBsb2FkZWQuXCIpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZUxvYWRlcjsiLCJ2YXIgSnNvbkxvYWRlciA9IGZ1bmN0aW9uIChwYXRoLCBjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgUkVRVUVTVF9GSU5JU0hFRCA9IDQ7XG4gICAgKGZ1bmN0aW9uIGxvYWRKc29uKCkge1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vdmVycmlkZU1pbWVUeXBlKCdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBwYXRoLCB0cnVlKTtcbiAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IFJFUVVFU1RfRklOSVNIRUQpIHtcbiAgICAgICAgICAgIHRoYXQuZGF0YSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICBjYWxsYmFjayh0aGF0LmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoYXQuZGF0YTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEpzb25Mb2FkZXI7XG4iLCJmdW5jdGlvbiBWaWV3TG9hZGVyKCkge31cblxuVmlld0xvYWRlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbih2aWV3KSB7XG4gICAgVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lci5hZGRDaGlsZCh2aWV3KTtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnJlbW92ZUFsbFZpZXdzID0gZnVuY3Rpb24oKSB7XG4gICAgVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lci5yZW1vdmVDaGlsZHJlbigpO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUucmVtb3ZlVmlldyA9IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyLnJlbW92ZUNoaWxkKHZpZXcpO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUuc2V0UmVuZGVyZXIgPSBmdW5jdGlvbihyZW5kZXJlcikge1xuICAgIFZpZXdMb2FkZXIucHJvdG90eXBlLnJlbmRlcmVyID0gcmVuZGVyZXI7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5zZXRDb250YWluZXIgPSBmdW5jdGlvbihjb250YWluZXIpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyID0gY29udGFpbmVyO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIFZpZXdMb2FkZXIucHJvdG90eXBlLnJlbmRlcmVyLnJlbmRlcihWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoVmlld0xvYWRlci5wcm90b3R5cGUuYW5pbWF0ZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdMb2FkZXI7IiwidmFyIERpc3BsYXkgPSB7XG4gICAgYnVja2V0OiBudWxsLFxuICAgIHNjYWxlOiBudWxsLFxuICAgIHJlc291cmNlUGF0aDogbnVsbCxcbiAgICBvcmllbnRhdGlvbjogbnVsbFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwbGF5OyIsIkF2YXRhclNlbGVjdGlvblZpZXcuY29uc3RydWN0b3IgPSBBdmF0YXJTZWxlY3Rpb25WaWV3O1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuQkFDS19CVVRUT04gPSAwO1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuU0VMRUNUX1VQID0gMTtcbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLlNFTEVDVF9ET1dOID0gMjtcbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLkZJTkRfR0FNRSA9IDM7XG5cblxuZnVuY3Rpb24gQXZhdGFyU2VsZWN0aW9uVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5BVkFUQVJfU0VMRUNUSU9OO1xuICAgIHZhciBjb21tb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5DT01NT047XG4gICAgXG4gICAgdGhpcy5jcmVhdGVMb2dvKGNvbW1vbkRhdGEuTE9HTyk7XG4gICAgdGhpcy5jcmVhdGVCYWNrQnV0dG9uKGxheW91dERhdGEuQkFDS19CVVRUT04pO1xuICAgIHRoaXMuY3JlYXRlU2VsZWN0RG93bkJ1dHRvbihsYXlvdXREYXRhLlNFTEVDVF9ET1dOKTtcbiAgICB0aGlzLmNyZWF0ZVNlbGVjdFVwQnV0dG9uKGxheW91dERhdGEuU0VMRUNUX1VQKTtcbiAgICB0aGlzLmNyZWF0ZUZpbmRHYW1lQnV0dG9uKGxheW91dERhdGEuRklORF9HQU1FKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUxvZ28gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBsb2dvID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGxvZ28sIDUwLCAxMCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIobG9nbyk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVCYWNrQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmJhY2tCdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5iYWNrQnV0dG9uLCA2OSwgODApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYmFja0J1dHRvbiwgZGF0YSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVTZWxlY3REb3duQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnNlbGVjdERvd25CdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5zZWxlY3REb3duQnV0dG9uLCAyNCwgODUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuc2VsZWN0RG93bkJ1dHRvbiwgZGF0YSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVTZWxlY3RVcEJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5zZWxlY3RVcEJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnNlbGVjdFVwQnV0dG9uLCAyNCwgMzUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuc2VsZWN0VXBCdXR0b24sIGRhdGEpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlRmluZEdhbWVCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuZmluZEdhbWVCdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5maW5kR2FtZUJ1dHRvbiwgNjksIDQ4KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmZpbmRHYW1lQnV0dG9uLCBkYXRhKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLmJhY2tCdXR0b24sIHRoaXMuc2VsZWN0VXBCdXR0b24sIHRoaXMuc2VsZWN0RG93bkJ1dHRvbiwgdGhpcy5maW5kR2FtZUJ1dHRvbl07XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclNlbGVjdGlvblZpZXc7IiwiRmluZEdhbWVWaWV3LmNvbnN0cnVjdG9yID0gRmluZEdhbWVWaWV3O1xuRmluZEdhbWVWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBGaW5kR2FtZVZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5GSU5EX0dBTUU7XG4gICAgdmFyIGF2YXRhckRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkFWQVRBUjtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZUZpbmRHYW1lQ2FwdGlvbihsYXlvdXREYXRhLkNBUFRJT04pO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMUF2YXRhcihhdmF0YXJEYXRhW2F2YXRhcl0sIGxheW91dERhdGEuUExBWUVSXzFfQVZBVEFSKTtcbiAgICB0aGlzLmNyZWF0ZVZlcnN1c1RleHQobGF5b3V0RGF0YS5WRVJTVVMpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMlVua25vd25BdmF0YXIoYXZhdGFyRGF0YS5QTEFZRVJfMl9VTktOT1dOLCBsYXlvdXREYXRhLlBMQVlFUl8yX0FWQVRBUik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxVGV4dChsYXlvdXREYXRhLlBMQVlFUl8xKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJUZXh0KGxheW91dERhdGEuUExBWUVSXzIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVGaW5kR2FtZUNhcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuZmluZEdhbWVDYXB0aW9uID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmZpbmRHYW1lQ2FwdGlvbiwgNTAsIDE1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmZpbmRHYW1lQ2FwdGlvbiwgZGF0YSk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFBdmF0YXIgPSBmdW5jdGlvbiAoYXZhdGFyLCBkYXRhKSB7XG4gICAgdmFyIHBsYXllcjFBdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoYXZhdGFyKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIxQXZhdGFyLCAyNSwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjFBdmF0YXIsIGRhdGEpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVWZXJzdXNUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgdmVyc3VzID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh2ZXJzdXMsIDUwLCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodmVyc3VzLCBkYXRhKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMlVua25vd25BdmF0YXIgPSBmdW5jdGlvbiAoYXZhdGFyLCBkYXRhKSB7XG4gICAgdmFyIHBsYXllcjJVbmtub3duQXZhdGFyID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMlVua25vd25BdmF0YXIsIDc1LCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMlVua25vd25BdmF0YXIsIGRhdGEpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHBsYXllcjEgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHBsYXllcjEsIDI1LCA3NCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMSwgZGF0YSk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgcGxheWVyMiA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMiwgNzUsIDc0KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyLCBkYXRhKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhciA9IGZ1bmN0aW9uIChhdmF0YXIpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIyVW5rbm93bkF2YXRhcik7XG4gICAgdmFyIHBsYXllcjJBY3R1YWxBdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5BVkFUQVJbYXZhdGFyXSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMkFjdHVhbEF2YXRhciwgNzUsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyQWN0dWFsQXZhdGFyLCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkZJTkRfR0FNRS5QTEFZRVJfMl9BVkFUQVIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVHYW1lRm91bmRDYXB0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLmZpbmRHYW1lQ2FwdGlvbik7XG4gICAgdmFyIGZvdW5kR2FtZUNhcHRpb24gPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRklORF9HQU1FLkZPVU5EX0dBTUVfQ0FQVElPTik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQoZm91bmRHYW1lQ2FwdGlvbiwgNTAsIDE1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihmb3VuZEdhbWVDYXB0aW9uLCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkZJTkRfR0FNRS5GT1VORF9HQU1FX0NBUFRJT04pO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbmRHYW1lVmlldzsiLCJIZWxwVmlldy5jb25zdHJ1Y3RvciA9IEhlbHBWaWV3O1xuSGVscFZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5cbmZ1bmN0aW9uIEhlbHBWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5IRUxQO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlSGVscFRleHQobGF5b3V0RGF0YS5JTkZPKTtcbiAgICB0aGlzLmNyZWF0ZUJhY2tCdXR0b24obGF5b3V0RGF0YS5CQUNLX0JVVFRPTik7XG59O1xuXG5IZWxwVmlldy5wcm90b3R5cGUuY3JlYXRlSGVscFRleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBoZWxwVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoaGVscFRleHQsIGRhdGEpO1xufTtcblxuSGVscFZpZXcucHJvdG90eXBlLmNyZWF0ZUJhY2tCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuYmFja0J1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmJhY2tCdXR0b24sIGRhdGEpO1xufTtcblxuSGVscFZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLmJhY2tCdXR0b25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZWxwVmlldzsiLCJMb2FkaW5nVmlldy5jb25zdHJ1Y3RvciA9IExvYWRpbmdWaWV3O1xuTG9hZGluZ1ZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIExvYWRpbmdWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkxvYWRpbmdWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5MT0FESU5HO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlTG9hZGluZ1RleHQobGF5b3V0RGF0YS5MT0FESU5HX1RFWFQpO1xufTtcblxuTG9hZGluZ1ZpZXcucHJvdG90eXBlLmNyZWF0ZUxvYWRpbmdUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGxvYWRpbmcgdGV4dC4uLlwiKTtcbiAgICB2YXIgbG9hZGluZ1RleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGxvYWRpbmdUZXh0LCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGxvYWRpbmdUZXh0LCBkYXRhKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZ1ZpZXc7IiwiTWVudVZpZXcuY29uc3RydWN0b3IgPSBNZW51Vmlldztcbk1lbnVWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5NZW51Vmlldy5wcm90b3R5cGUuUExBWV9CVVRUT04gPSAwO1xuTWVudVZpZXcucHJvdG90eXBlLkhFTFBfQlVUVE9OID0gMTtcblxuZnVuY3Rpb24gTWVudVZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuTWVudVZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLk1FTlU7XG4gICAgdmFyIGNvbW1vbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkNPTU1PTjtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZUxvZ28oY29tbW9uRGF0YS5MT0dPKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXlCdXR0b24obGF5b3V0RGF0YS5QTEFZX0JVVFRPTik7XG4gICAgdGhpcy5jcmVhdGVIZWxwQnV0dG9uKGxheW91dERhdGEuSEVMUF9CVVRUT04pO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmNyZWF0ZUxvZ28gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBsb2dvID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGxvZ28sIDUwLDEwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihsb2dvLCBkYXRhKTtcbn07XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5QnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnBsYXlCdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5QnV0dG9uLCA1MCwgMzUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheUJ1dHRvbiwgZGF0YSk7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlSGVscEJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5oZWxwQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuaGVscEJ1dHRvbiwgNTAsIDYzKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmhlbHBCdXR0b24sIGRhdGEpO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLnBsYXlCdXR0b24sIHRoaXMuaGVscEJ1dHRvbl07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVWaWV3OyIsIlZpZXcuY29uc3RydWN0b3IgPSBWaWV3O1xuVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5WaWV3LnByb3RvdHlwZS5JTlRFUkFDVElWRSA9IHRydWU7XG5WaWV3LnByb3RvdHlwZS5DRU5URVJfQU5DSE9SID0gMC41O1xuXG5mdW5jdGlvbiBWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cblZpZXcucHJvdG90eXBlLmFkZEVsZW1lbnRUb0NvbnRhaW5lciA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LmFuY2hvci54ID0gdGhpcy5DRU5URVJfQU5DSE9SO1xuICAgIGVsZW1lbnQuYW5jaG9yLnkgPSB0aGlzLkNFTlRFUl9BTkNIT1I7XG4gICAgZWxlbWVudC5pbnRlcmFjdGl2ZSA9IHRoaXMuSU5URVJBQ1RJVkU7XG4gICAgdGhpcy5hZGRDaGlsZChlbGVtZW50KTtcbn07XG5cblZpZXcucHJvdG90eXBlLmNyZWF0ZVRleHRFbGVtZW50ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHJldHVybiBuZXcgUElYSS5UZXh0KGRhdGEudGV4dCwge2ZvbnQ6IGRhdGEuc2l6ZSArIFwicHggXCIgKyBkYXRhLmZvbnQsIGZpbGw6IGRhdGEuY29sb3J9KTtcbn07XG5cblZpZXcucHJvdG90eXBlLmNyZWF0ZVNwcml0ZUVsZW1lbnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoZGF0YS5wYXRoKTtcbn07XG5cblZpZXcucHJvdG90eXBlLnJlbW92ZUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdGhpcy5yZW1vdmVDaGlsZChlbGVtZW50KTtcbn07XG5cblZpZXcucHJvdG90eXBlLnVwZGF0ZUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdGhpcy5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICB0aGlzLmFkZENoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUucmVtb3ZlQWxsRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQgPSBmdW5jdGlvbihlbGVtZW50LCB3aWR0aFBlcmNlbnRhZ2UsIGhlaWdodFBlcmNlbnRhZ2UpIHtcbiAgICBlbGVtZW50LnggPSAod2luZG93LmlubmVyV2lkdGggLyAxMDApICogd2lkdGhQZXJjZW50YWdlO1xuICAgIGVsZW1lbnQueSA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAxMDApICogaGVpZ2h0UGVyY2VudGFnZTsgICBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcblxuIiwiQXZhdGFyVmlldy5jb25zdHJ1Y3RvciA9IEF2YXRhclZpZXc7XG5BdmF0YXJWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5BdmF0YXJWaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5cbmZ1bmN0aW9uIEF2YXRhclZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuQXZhdGFyVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbihhdmF0YXJOYW1lKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkFWQVRBUjtcbiAgICB2YXIgY29tbW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQ09NTU9OO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlQXZhdGFyKGxheW91dERhdGFbYXZhdGFyTmFtZV0pO1xufTtcblxuQXZhdGFyVmlldy5wcm90b3R5cGUuY3JlYXRlQXZhdGFyID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5hdmF0YXIpO1xuICAgIHRoaXMuYXZhdGFyID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYXZhdGFyLCAyNCwgNjApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYXZhdGFyLCBkYXRhKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXZhdGFyVmlldzsiLCJEaWNlVmlldy5jb25zdHJ1Y3RvciA9IERpY2VWaWV3O1xuRGljZVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIERpY2VWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkRpY2VWaWV3LnByb3RvdHlwZS5zZXR1cERpY2UgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgdmFyIGRpY2VJbWFnZSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRElDRVtkaWNlTnVtYmVyXTtcbiAgICB2YXIgZGljZVBvc2l0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRElDRS5DT09SRFM7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVEaWNlRWxlbWVudChkaWNlSW1hZ2UsIGRpY2VQb3NpdGlvbkRhdGEpO1xufTtcblxuRGljZVZpZXcucHJvdG90eXBlLmNyZWF0ZURpY2VFbGVtZW50ID0gZnVuY3Rpb24oZGljZUltYWdlLCBkaWNlUG9zaXRpb25EYXRhKSB7XG4gICAgdGhpcy5kaWNlRWxlbWVudCA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkaWNlSW1hZ2UpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuZGljZUVsZW1lbnQsIDUwLCAzNik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5kaWNlRWxlbWVudCwgZGljZVBvc2l0aW9uRGF0YSk7XG59O1xuXG5EaWNlVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaWNlVmlldzsiLCJQbGF5ZXJWaWV3LmNvbnN0cnVjdG9yID0gUGxheWVyVmlldztcblBsYXllclZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIFBsYXllclZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyRGF0YSA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllckRhdGEgPSBwbGF5ZXJEYXRhO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVyTGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSO1xuICAgIHZhciBhdmF0YXJEYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5BVkFUQVI7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxQXZhdGFyKGF2YXRhckRhdGFbdGhpcy5wbGF5ZXJEYXRhLnBsYXllcjFBdmF0YXJdLCBwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX0FWQVRBUik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxSGVhbHRoKHBsYXllckxheW91dERhdGEuUExBWUVSXzFfSEVBTFRIKTtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJBdmF0YXIoYXZhdGFyRGF0YVt0aGlzLnBsYXllckRhdGEucGxheWVyMkF2YXRhcl0sIHBsYXllckxheW91dERhdGEuUExBWUVSXzJfQVZBVEFSKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMl9IRUFMVEgpO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlUGxheWVyMVRleHQocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9URVhUKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJUZXh0KHBsYXllckxheW91dERhdGEuUExBWUVSXzJfVEVYVCk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxQXZhdGFyID0gZnVuY3Rpb24oYXZhdGFyLCBhdmF0YXJQb3NpdGlvbikge1xuICAgIHRoaXMucGxheWVyMUF2YXRhciA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChhdmF0YXIpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMUF2YXRhciwgMjUsIDI1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFBdmF0YXIsIGF2YXRhclBvc2l0aW9uKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJBdmF0YXIgPSBmdW5jdGlvbihhdmF0YXIsIGF2YXRhclBvc2l0aW9uKSB7XG4gICAgdGhpcy5wbGF5ZXIyQXZhdGFyID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIyQXZhdGFyLCA3NSwgMjUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMkF2YXRhciwgYXZhdGFyUG9zaXRpb24pO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMUhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aERhdGEpIHtcbiAgICB0aGlzLnBsYXllcjFIZWFsdGhUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChoZWFsdGhEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjFIZWFsdGhUZXh0LCAyNSwgNyk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCwgaGVhbHRoRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIySGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoRGF0YSkge1xuICAgIHRoaXMucGxheWVyMkhlYWx0aFRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGhlYWx0aERhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMkhlYWx0aFRleHQsIDc1LCA3KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJIZWFsdGhUZXh0LCBoZWFsdGhEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFUZXh0ID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIHRoaXMucGxheWVyMVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHBsYXllckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMVRleHQsIDI1LCA0NCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxVGV4dCwgcGxheWVyRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyVGV4dCA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllcjJUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjJUZXh0LCA3NSwgNDQpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMlRleHQsIHBsYXllckRhdGEpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMUhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIxSGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8xX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjFIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIxSGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMkhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIySGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8yX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjJIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIySGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuZmxhc2hQbGF5ZXIxSGVhbHRoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXllckxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUjtcbiAgICB2YXIgcGxheWVyMUhlYWx0aCA9IHRoaXMucGxheWVyMUhlYWx0aFRleHQudGV4dC5zbGljZSgtMSk7XG4gICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBsYXllcjJIZWFsdGhJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCFyZW1vdmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBsYXllcjFIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9IRUFMVEgpO1xuICAgICAgICAgICAgdGhpcy5zZXRQbGF5ZXIxSGVhbHRoKHBsYXllcjFIZWFsdGgpO1xuICAgICAgICB9XG4gICAgICAgIHJlbW92ZWQgPSAhcmVtb3ZlZDtcbiAgICB9LmJpbmQodGhpcyksIDIwMCk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5mbGFzaFBsYXllcjJIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVyTGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSO1xuICAgIHZhciBwbGF5ZXIySGVhbHRoID0gdGhpcy5wbGF5ZXIxSGVhbHRoVGV4dC50ZXh0LnNsaWNlKC0xKTtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyMUhlYWx0aEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXJlbW92ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjJIZWFsdGhUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyMkhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX0hFQUxUSCk7XG4gICAgICAgICAgICB0aGlzLnNldFBsYXllcjJIZWFsdGgocGxheWVyMkhlYWx0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlZCA9ICFyZW1vdmVkO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNsZWFySW50ZXJ2YWxzID0gZnVuY3Rpb24oKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnBsYXllcjFIZWFsdGhJbnRlcnZhbElkKTtcbiAgICBjbGVhckludGVydmFsKHRoaXMucGxheWVyMkhlYWx0aEludGVydmFsSWQpO1xuICAgIGNvbnNvbGUubG9nKFwiSW50ZXJ2YWxzIGNsZWFyZWQuXCIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJWaWV3OyIsIlF1ZXN0aW9uVmlldy5jb25zdHJ1Y3RvciA9IFF1ZXN0aW9uVmlldztcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5SSUdIVF9BTlNXRVIgPSAwO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5XUk9OR19BTlNXRVJfMSA9IDE7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLldST05HX0FOU1dFUl8yID0gMjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuV1JPTkdfQU5TV0VSXzMgPSAzO1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLkFOU1dFUl9QUkVGSVggPSBcIkFOU1dFUl9cIjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSRURfUFJFRklYID0gXCJBTlNXRVJFRF9cIjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSRURfU1VGRklYID0gXCJfQU5TV0VSRURcIjtcblxuZnVuY3Rpb24gUXVlc3Rpb25WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuZGlzcGxheUNhdGVnb3J5QW5kUXVlc3Rpb24gPSBmdW5jdGlvbihjYXRlZ29yeSwgcXVlc3Rpb24pIHtcbiAgICB2YXIgcXVlc3Rpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTjtcbiAgICB0aGlzLmNyZWF0ZUNhdGVnb3J5RWxlbWVudChjYXRlZ29yeSwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTi5DQVRFR09SWSk7XG4gICAgdGhpcy5jcmVhdGVRdWVzdGlvbkVsZW1lbnQocXVlc3Rpb24udGV4dCwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTi5RVUVTVElPTl9QT1NJVElPTik7XG4gICAgdGhpcy5jcmVhdGVBbnN3ZXJFbGVtZW50MShxdWVzdGlvbi5yaWdodF9hbnN3ZXIsIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT05bdGhpcy5BTlNXRVJfUFJFRklYICsgdGhpcy5hbnN3ZXJJbmRpY2VzWzBdXSk7XG4gICAgdGhpcy5jcmVhdGVBbnN3ZXJFbGVtZW50MihxdWVzdGlvbi53cm9uZ19hbnN3ZXJfMSwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTlt0aGlzLkFOU1dFUl9QUkVGSVggKyB0aGlzLmFuc3dlckluZGljZXNbMV1dKTtcbiAgICB0aGlzLmNyZWF0ZUFuc3dlckVsZW1lbnQzKHF1ZXN0aW9uLndyb25nX2Fuc3dlcl8yLCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OW3RoaXMuQU5TV0VSX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1syXV0pO1xuICAgIHRoaXMuY3JlYXRlQW5zd2VyRWxlbWVudDQocXVlc3Rpb24ud3JvbmdfYW5zd2VyXzMsIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT05bdGhpcy5BTlNXRVJfUFJFRklYICsgdGhpcy5hbnN3ZXJJbmRpY2VzWzNdXSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnNldEFuc3dlckluZGljZXMgPSBmdW5jdGlvbihhbnN3ZXJJbmRpY2VzKSB7XG4gICAgdGhpcy5hbnN3ZXJJbmRpY2VzID0gYW5zd2VySW5kaWNlcztcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQ2F0ZWdvcnlFbGVtZW50ID0gZnVuY3Rpb24oY2F0ZWdvcnksIGNhdGVnb3J5RGF0YSkge1xuICAgIGNhdGVnb3J5RGF0YS50ZXh0ID0gY2F0ZWdvcnk7XG4gICAgdGhpcy5jYXRlZ29yeUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGNhdGVnb3J5RGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5jYXRlZ29yeUVsZW1lbnQsIDUwLCA2Myk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5jYXRlZ29yeUVsZW1lbnQsIGNhdGVnb3J5RGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZVF1ZXN0aW9uRWxlbWVudCA9IGZ1bmN0aW9uKHF1ZXN0aW9uLCBxdWVzdGlvbkRhdGEpIHtcbiAgICBxdWVzdGlvbkRhdGEudGV4dCA9IHF1ZXN0aW9uO1xuICAgIHRoaXMucXVlc3Rpb25FbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChxdWVzdGlvbkRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucXVlc3Rpb25FbGVtZW50LCA1MCwgNjgpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucXVlc3Rpb25FbGVtZW50LCBxdWVzdGlvbkRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVBbnN3ZXJFbGVtZW50MSA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQxID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmFuc3dlckVsZW1lbnQxLCAzMywgNzUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYW5zd2VyRWxlbWVudDEsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVBbnN3ZXJFbGVtZW50MiA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmFuc3dlckVsZW1lbnQyLCA2NywgNzUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYW5zd2VyRWxlbWVudDIsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVBbnN3ZXJFbGVtZW50MyA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQzID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmFuc3dlckVsZW1lbnQzLCAzMywgODMpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYW5zd2VyRWxlbWVudDMsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVBbnN3ZXJFbGVtZW50NCA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQ0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmFuc3dlckVsZW1lbnQ0LCA2NywgODMpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYW5zd2VyRWxlbWVudDQsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRBbnN3ZXJUb0NvbG91ciA9IGZ1bmN0aW9uKGFuc3dlckVsZW1lbnQsIGFuc3dlcikge1xuICAgIHZhciBxdWVzdGlvbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OO1xuICAgIHZhciBjb2xvdXJzID0ge307XG4gICAgZm9yKHZhciBpID0gMjsgaSA8PSA0OyBpKyspIHtcbiAgICAgICAgY29sb3Vyc1t0aGlzLkFOU1dFUkVEX1BSRUZJWCArIGldID0gcXVlc3Rpb25EYXRhLldST05HX0FOU1dFUl9DT0xPVVI7XG4gICAgfVxuICAgIGNvbG91cnMuQU5TV0VSRURfMSA9IHF1ZXN0aW9uRGF0YS5SSUdIVF9BTlNXRVJfQ09MT1VSO1xuICAgIHZhciBhbnN3ZXJDb2xvdXIgPSBjb2xvdXJzW2Fuc3dlcl07XG4gICAgYW5zd2VyRWxlbWVudC5zZXRTdHlsZSh7Zm9udDogYW5zd2VyRWxlbWVudC5zdHlsZS5mb250LCBmaWxsOiBhbnN3ZXJDb2xvdXJ9KTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuc2V0V2hvQW5zd2VyZWRRdWVzdGlvbiA9IGZ1bmN0aW9uKGFuc3dlckVsZW1lbnQsIGFuc3dlciwgcGxheWVyKSB7XG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT047XG4gICAgdmFyIGFuc3dlck9uU2NyZWVuID0gKGFuc3dlci5zbGljZSgtMSkgLSAxKTtcbiAgICB0aGlzLnBsYXllcldob0Fuc3dlcmVkRWxlbWVudCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQocXVlc3Rpb25EYXRhW3BsYXllciArIHRoaXMuQU5TV0VSRURfU1VGRklYXSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXJXaG9BbnN3ZXJlZEVsZW1lbnQsIHF1ZXN0aW9uRGF0YVt0aGlzLkFOU1dFUkVEX1BSRUZJWCArIChhbnN3ZXJPblNjcmVlbiArIDEpXS54LCBxdWVzdGlvbkRhdGFbdGhpcy5BTlNXRVJFRF9QUkVGSVggKyAoYW5zd2VyT25TY3JlZW4gKyAxKV0ueSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXJXaG9BbnN3ZXJlZEVsZW1lbnQsIHF1ZXN0aW9uRGF0YVt0aGlzLkFOU1dFUkVEX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1thbnN3ZXJPblNjcmVlbl1dKTsgXG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnVwZGF0ZVF1ZXN0aW9uVGltZXIgPSBmdW5jdGlvbih0aW1lUmVtYWluaW5nKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMudGltZXIpO1xuICAgIHZhciB0aW1lckRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLlRJTUVSO1xuICAgIHRpbWVyRGF0YS50ZXh0ID0gdGltZVJlbWFpbmluZztcbiAgICB0aGlzLnRpbWVyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudCh0aW1lckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMudGltZXIsIDk3LCAzKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnRpbWVyLCB0aW1lckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS50dXJuT2ZmSW50ZXJhY3Rpdml0eUZvckFuc3dlckVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50MS5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDIuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQzLmludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50NC5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5hbnN3ZXJFbGVtZW50MSwgdGhpcy5hbnN3ZXJFbGVtZW50MiwgdGhpcy5hbnN3ZXJFbGVtZW50MywgdGhpcy5hbnN3ZXJFbGVtZW50NF07XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25WaWV3OyIsIldpblZpZXcuY29uc3RydWN0b3IgPSBXaW5WaWV3O1xuV2luVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuV2luVmlldy5wcm90b3R5cGUuUExBWV9BR0FJTl9CVVRUT04gPSAwO1xuXG5mdW5jdGlvbiBXaW5WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5zZXR1cFZpZXdFbGVtZW50cygpO1xufVxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlV2lubmVyVGV4dCA9IGZ1bmN0aW9uKHBsYXllcldob1dvbiwgc3RhdERhdGEpIHtcbiAgICB2YXIgd2luRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuV0lOO1xuICAgIHRoaXMuY3JlYXRlV2luVGV4dCh3aW5EYXRhW3BsYXllcldob1dvbiArIFwiX1dJTlNcIl0sIHdpbkRhdGEuV0lOX1RFWFRfUE9TSVRJT04pO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyU3RhdHNUZXh0KHdpbkRhdGEsIHN0YXREYXRhKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24ocGxheWVyV2hvV29uKSB7XG4gICAgdmFyIHdpbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLldJTjtcbiAgICB0aGlzLmNyZWF0ZVBsYXlBZ2FpbkJ1dHRvbih3aW5EYXRhLlBMQVlfQUdBSU4pO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlV2luVGV4dCA9IGZ1bmN0aW9uIChkYXRhLCBwb3NpdGlvbkRhdGEpIHtcbiAgICB2YXIgd2luVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQod2luVGV4dCwgNTAsIDY2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih3aW5UZXh0LCBwb3NpdGlvbkRhdGEpO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyU3RhdHNUZXh0ID0gZnVuY3Rpb24obGF5b3V0RGF0YSwgc3RhdERhdGEpIHtcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ID0gbGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCArIHN0YXREYXRhLnBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZTtcbiAgICB2YXIgcGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIDI1LCA3Mik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgbGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIFxuICAgIGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ICsgc3RhdERhdGEucGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlO1xuICAgIHZhciBwbGF5ZXIyQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgNzUsIDcyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0LCBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRSk7XG4gICAgXG4gICAgbGF5b3V0RGF0YS5QTEFZRVJfMV9CRVNUX0NBVEVHT1JZLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8xX0JFU1RfQ0FURUdPUlkudGV4dCArIHN0YXREYXRhLnBsYXllcjFCZXN0Q2F0ZWdvcnkgKyBcIihcIiArIHN0YXREYXRhLnBsYXllcjFCZXN0Q2F0ZWdvcnlQZXJjZW50YWdlICsgXCIlKVwiO1xuICAgIHZhciBwbGF5ZXIxQmVzdENhdGVnb3J5VGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMV9CRVNUX0NBVEVHT1JZKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIxQmVzdENhdGVnb3J5VGV4dCwgMjUsIDc3KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIxQmVzdENhdGVnb3J5VGV4dCwgbGF5b3V0RGF0YS5QTEFZRVJfMV9CRVNUX0NBVEVHT1JZKTtcbiAgICBcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8yX0JFU1RfQ0FURUdPUlkudGV4dCA9IGxheW91dERhdGEuUExBWUVSXzJfQkVTVF9DQVRFR09SWS50ZXh0ICsgc3RhdERhdGEucGxheWVyMkJlc3RDYXRlZ29yeSArIFwiKFwiICsgc3RhdERhdGEucGxheWVyMkJlc3RDYXRlZ29yeVBlcmNlbnRhZ2UgKyBcIiUpXCI7XG4gICAgdmFyIHBsYXllcjJCZXN0Q2F0ZWdvcnlUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChsYXlvdXREYXRhLlBMQVlFUl8yX0JFU1RfQ0FURUdPUlkpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHBsYXllcjJCZXN0Q2F0ZWdvcnlUZXh0LCA3NSwgNzcpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjJCZXN0Q2F0ZWdvcnlUZXh0LCBsYXlvdXREYXRhLlBMQVlFUl8yX0JFU1RfQ0FURUdPUlkpO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheUFnYWluQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnBsYXlBZ2FpbkJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXlBZ2FpbkJ1dHRvbiwgNTAsIDQ3KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXlBZ2FpbkJ1dHRvbiwgZGF0YSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5wbGF5QWdhaW5CdXR0b25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaW5WaWV3OyJdfQ==
