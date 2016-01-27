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
ControllerStore = require('./store/ControllerStore');
SpriteStore = require('./store/SpriteStore');

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
        var spriteStore = new SpriteStore();
        View.prototype.spriteStore = spriteStore;
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
        var menuController = ControllerStore.menuController;
        menuController.loadView();
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
},{"./SoundManager":2,"./constant/SocketConstants":3,"./controller/AvatarSelectionController":4,"./controller/Controller":5,"./controller/FindGameController":6,"./controller/GameController":7,"./controller/HelpController":8,"./controller/MenuController":9,"./controller/TurnController":10,"./controller/subcontroller/DiceController":11,"./controller/subcontroller/PlayerController":12,"./controller/subcontroller/QuestionController":13,"./loader/BucketLoader":14,"./loader/ImageLoader":15,"./loader/JsonLoader":16,"./loader/ViewLoader":17,"./store/ControllerStore":18,"./store/SpriteStore":19,"./util/Display":20,"./view/AvatarSelectionView":21,"./view/FindGameView":22,"./view/HelpView":23,"./view/LoadingView":24,"./view/MenuView":25,"./view/View":26,"./view/subview/AvatarView":27,"./view/subview/DiceView":28,"./view/subview/PlayerView":29,"./view/subview/QuestionView":30,"./view/subview/WinView":31}],2:[function(require,module,exports){
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

function FindGameController() {
    Controller.call(this);
    this.registerSocketEvents();
}

FindGameController.prototype.loadView = function(avatar) {
    this.avatar = avatar;
    this.cleanView();
    this.viewLoader.removeAllViews();
    this.view.setupViewElements(this.avatar);
    this.viewLoader.loadView(this.view);
    this.socket.emit(SocketConstants.emit.FINDING_GAME, {avatar: this.avatar});
};

FindGameController.prototype.registerSocketEvents = function() {
    this.socket.on(SocketConstants.on.GAME_FOUND, function(playerData) {
        this.assignAvatars(playerData);
        this.view.createGameFoundCaption();
        setTimeout(function() {
            this.viewLoader.removeAllViews();
            var playerController = ControllerStore.playerController;
            playerController.setPlayerData(playerData);
            var diceController = ControllerStore.diceController;
            var questionController = ControllerStore.questionController;
            questionController.setPlayerController(playerController);
            var turnController = ControllerStore.turnController;
            turnController.setControllerDependencies(playerController, diceController, questionController);
            turnController.initiate();
        }.bind(this), this.TRANSITION_TO_GAME_TIME);
    }.bind(this));
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
        var menuController = ControllerStore.menuController;
        menuController.loadView();
    });
    
};

module.exports = HelpController;
},{}],9:[function(require,module,exports){
MenuController.constructor = MenuController;
MenuController.prototype = Object.create(Controller.prototype);
MenuController.prototype.view = new MenuView();

function MenuController() {
    Controller.call(this);
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
        var avatarSelectionController = ControllerStore.avatarSelectionController;
        avatarSelectionController.loadView();
    });
    
    this.registerListener(helpButton, function() {
        var helpController = ControllerStore.helpController;
        helpController.loadView();
    });
};

module.exports = MenuController;
},{}],10:[function(require,module,exports){
TurnController.constructor = TurnController;
TurnController.prototype = Object.create(GameController.prototype);

function TurnController() {
    Controller.call(this);
    this.registerSocketEvents();
}

TurnController.prototype.initiate = function() {
    this.winView = new WinView();
    this.cleanControllerView();
    this.setupListeners();
    this.playerController.loadView();
    this.newTurn();
};

TurnController.prototype.setControllerDependencies = function(playerController, diceController, questionController) {
    this.playerController = playerController;
    this.diceController = diceController;
    this.questionController = questionController;
};

TurnController.prototype.registerSocketEvents = function() {
    this.socket.on(SocketConstants.on.INIT_NEW_TURN, function(playerData) {
        if(playerData.player1Health === 0) {
            if(this.isPlayer1()) {
                this.socket.emit(SocketConstants.emit.GAME_ENDED, {winner: "PLAYER_2"});
            }
        } else if(playerData.player2Health === 0) {
            if(this.isPlayer1()) {
                this.socket.emit(SocketConstants.emit.GAME_ENDED, {winner: "PLAYER_1"});
            }
        } else {
            setTimeout(function() {
                this.newTurn();
            }.bind(this), 1500);
        }
    }.bind(this));
    
    this.socket.on(SocketConstants.on.GAME_STATS, function(data) {
        this.loadWinView(data.winner, data);
    }.bind(this));
};

TurnController.prototype.loadWinView = function(player, data) {
    this.diceController.cleanView();
    this.questionController.cleanView();
    this.winView.cleanView();
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
        var avatarSelectionController = ControllerStore.avatarSelectionController;
        avatarSelectionController.loadView();
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

TurnController.prototype.cleanControllerView = function() {
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

function PlayerController() {
    Controller.call(this);
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
            this.view.flashPlayer1Health(playerData.player1Health);
        }
        if(playerData.player2Health <= this.DANGEROUS_LEVEL_HEALTH) {
            this.view.flashPlayer2Health(playerData.player2Health);
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

function QuestionController() {
    Controller.call(this);
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

QuestionController.prototype.setPlayerController = function(playerController) {
    this.playerController = playerController;
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
        if(scale === 2) {
            scale = 1.5;
        }
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
},{}],19:[function(require,module,exports){
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
        sprites.player1emojiAngel = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-angel.png');
        sprites.player1emojiBigSmile = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-big-smile.png');
        sprites.player1emojiCool = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-cool.png');
        sprites.player1emojiGrin = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-grin.png');
        sprites.player1emojiHappy = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-happy.png');
        sprites.player1emojiKiss = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-kiss.png');
        sprites.player1emojiLaughing = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-laughing.png');
        sprites.player1emojiLove = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-love.png');
        sprites.player1emojiMonkey = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-monkey.png');
        sprites.player1emojiPoo = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-poo.png');
        sprites.player1emojiScream = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-scream.png');
        sprites.player1emojiSleep = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-sleep.png');
        sprites.player1emojiSmile = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-smile.png');
        sprites.player1emojiSleep = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-sleep.png');
        sprites.player1emojiWink = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-wink.png');
        sprites.player2emojiAngel = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-angel.png');
        sprites.player2emojiBigSmile = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-big-smile.png');
        sprites.player2emojiCool = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-cool.png');
        sprites.player2emojiGrin = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-grin.png');
        sprites.player2emojiHappy = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-happy.png');
        sprites.player2emojiKiss = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-kiss.png');
        sprites.player2emojiLaughing = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-laughing.png');
        sprites.player2emojiLove = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-love.png');
        sprites.player2emojiMonkey = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-monkey.png');
        sprites.player2emojiPoo = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-poo.png');
        sprites.player2emojiScream = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-scream.png');
        sprites.player2emojiSleep = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-sleep.png');
        sprites.player2emojiSmile = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-smile.png');
        sprites.player2emojiSleep = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-sleep.png');
        sprites.player2emojiWink = new PIXI.Sprite.fromImage(Display.resourcePath + '/avatar/emoji-wink.png');
        sprites.questionMark = new PIXI.Sprite.fromImage(Display.resourcePath + '/question-mark.png');
        sprites.diceFace1 = new PIXI.Sprite.fromImage(Display.resourcePath + '/dice/dice-face-1.png');
        sprites.diceFace2 = new PIXI.Sprite.fromImage(Display.resourcePath + '/dice/dice-face-2.png');
        sprites.diceFace3 = new PIXI.Sprite.fromImage(Display.resourcePath + '/dice/dice-face-3.png');
        sprites.diceFace4 = new PIXI.Sprite.fromImage(Display.resourcePath + '/dice/dice-face-4.png');
        sprites.diceFace5 = new PIXI.Sprite.fromImage(Display.resourcePath + '/dice/dice-face-5.png');
        sprites.diceFace6 = new PIXI.Sprite.fromImage(Display.resourcePath + '/dice/dice-face-6.png');
        sprites.playAgain = new PIXI.Sprite.fromImage(Display.resourcePath + '/play-again.png');
    })();
    
    return {
        get: function(spriteName) {
            return sprites[spriteName];
        }
    };
};

module.exports = SpriteStore;
},{}],20:[function(require,module,exports){
var Display = {
    bucket: null,
    scale: null,
    resourcePath: null,
    orientation: null
};

module.exports = Display;
},{}],21:[function(require,module,exports){
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
    var logo = this.spriteStore.get('logo');
    this.setElementPositionInPercent(logo, 50, 10);
    this.addElementToContainer(logo);
};

AvatarSelectionView.prototype.createBackButton = function (data) {
    this.backButton = this.spriteStore.get('backButton');
    this.setElementPositionInPercent(this.backButton, 69, 80);
    this.addElementToContainer(this.backButton);
};

AvatarSelectionView.prototype.createSelectDownButton = function (data) {
    this.selectDownButton = this.spriteStore.get('downTriangle');
    this.setElementPositionInPercent(this.selectDownButton, 24, 85);
    this.addElementToContainer(this.selectDownButton);
};

AvatarSelectionView.prototype.createSelectUpButton = function (data) {
    this.selectUpButton = this.spriteStore.get('upTriangle');
    this.setElementPositionInPercent(this.selectUpButton, 24, 35);
    this.addElementToContainer(this.selectUpButton);
};

AvatarSelectionView.prototype.createFindGameButton = function (data) {
    this.findGameButton = this.spriteStore.get('findGame');
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
},{}],22:[function(require,module,exports){
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
    this.player1Avatar = this.spriteStore.get('player1' + avatar);
    this.setElementPositionInPercent(this.player1Avatar, 25, 50);
    this.addElementToContainer(this.player1Avatar);
};

FindGameView.prototype.createVersusText = function (data) {
    var versus = this.createTextElement(data);
    this.setElementPositionInPercent(versus, 50, 50);
    this.addElementToContainer(versus);
};

FindGameView.prototype.createPlayer2UnknownAvatar = function () {
    var player2UnknownAvatar = this.spriteStore.get('questionMark');
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
    var player2ActualAvatar = this.spriteStore.get('player2' + avatar);
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
},{}],23:[function(require,module,exports){
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
    this.backButton = this.spriteStore.get('backButton');
    console.log("BACK BUTTON");
    console.log(this.spriteStore);
    this.setElementPositionInPercent(this.backButton, 50, 50);
    this.addElementToContainer(this.backButton);
};

HelpView.prototype.getInteractiveViewElements = function() {
    return [this.backButton];
};

module.exports = HelpView;
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
    var logo = this.spriteStore.get('logo');
    this.setElementPositionInPercent(logo, 50, 10);
    this.addElementToContainer(logo);
};

MenuView.prototype.createPlayButton = function (data) {
    this.playButton = this.spriteStore.get('playButton');
    this.setElementPositionInPercent(this.playButton, 50, 50);
    this.addElementToContainer(this.playButton);
};

MenuView.prototype.createHelpButton = function (data) {
    this.helpButton = this.spriteStore.get('helpButton');
    this.setElementPositionInPercent(this.helpButton, 50, 80);
    this.addElementToContainer(this.helpButton);
};

MenuView.prototype.getInteractiveViewElements = function() {
    return [this.playButton, this.helpButton];
};

module.exports = MenuView;
},{}],26:[function(require,module,exports){
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


},{}],27:[function(require,module,exports){
AvatarView.constructor = AvatarView;
AvatarView.prototype = Object.create(View.prototype);

AvatarView.prototype.BACK_BUTTON = 0;

function AvatarView() {
    PIXI.Container.call(this);
}

AvatarView.prototype.createAvatar = function (avatar) {
    this.removeElement(this.avatar);
    this.avatar = this.spriteStore.get('player1' + avatar);
    this.setElementPositionInPercent(this.avatar, 24, 60);
    this.addElementToContainer(this.avatar);
};

module.exports = AvatarView;
},{}],28:[function(require,module,exports){
DiceView.constructor = DiceView;
DiceView.prototype = Object.create(View.prototype);

function DiceView() {
    PIXI.Container.call(this);
}

DiceView.prototype.setupDice = function(diceNumber) {
    this.createDiceElement(diceNumber);
};

DiceView.prototype.createDiceElement = function(diceNumber) {
    this.diceElement = this.spriteStore.get('diceFace' + diceNumber);
    this.setElementPositionInPercent(this.diceElement, 50, 42);
    this.addElementToContainer(this.diceElement);
};

DiceView.prototype.cleanView = function() {
    this.removeAllElements();
};

module.exports = DiceView;
},{}],29:[function(require,module,exports){
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
    
    this.createLogo();
};

PlayerView.prototype.createLogo = function () {
    var logo = this.spriteStore.get('logo');
    this.setElementPositionInPercent(logo, 50, 10);
    this.addElementToContainer(logo);
};

PlayerView.prototype.createPlayer1Avatar = function(avatar) {
    this.player1Avatar = this.spriteStore.get('player1' + avatar);
    this.setElementPositionInPercent(this.player1Avatar, 25, 36);
    this.addElementToContainer(this.player1Avatar);
};

PlayerView.prototype.createPlayer2Avatar = function(avatar) {
    this.player2Avatar = this.spriteStore.get('player2' + avatar);
    this.setElementPositionInPercent(this.player2Avatar, 75, 36);
    this.addElementToContainer(this.player2Avatar);
};

PlayerView.prototype.createPlayer1Health = function(healthData) {
    this.player1HealthText = this.createTextElement(healthData);
    this.setElementPositionInPercent(this.player1HealthText, 25, 56);
    this.addElementToContainer(this.player1HealthText, healthData);
};

PlayerView.prototype.createPlayer2Health = function(healthData) {
    this.player2HealthText = this.createTextElement(healthData);
    this.setElementPositionInPercent(this.player2HealthText, 75, 56);
    this.addElementToContainer(this.player2HealthText, healthData);
};

PlayerView.prototype.createPlayer1Text = function(playerData) {
    this.player1Text = this.createTextElement(playerData);
    this.setElementPositionInPercent(this.player1Text, 25, 53);
    this.addElementToContainer(this.player1Text, playerData);
};

PlayerView.prototype.createPlayer2Text = function(playerData) {
    this.player2Text = this.createTextElement(playerData);
    this.setElementPositionInPercent(this.player2Text, 75, 53);
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

PlayerView.prototype.flashPlayer1Health = function(health) {
    var playerLayoutData = PIXI.Container.layoutData.PLAYER;
    var removed = false;
    this.player2HealthIntervalId = setInterval(function() {
        if(!removed) {
            this.removeElement(this.player1HealthText);
        } else {
            this.createPlayer1Health(playerLayoutData.PLAYER_1_HEALTH);
            this.setPlayer1Health(health);
        }
        removed = !removed;
    }.bind(this), 200);
};

PlayerView.prototype.flashPlayer2Health = function(health) {
    var playerLayoutData = PIXI.Container.layoutData.PLAYER;
    var removed = false;
    this.player1HealthIntervalId = setInterval(function() {
        if(!removed) {
            this.removeElement(this.player2HealthText);
        } else {
            this.createPlayer2Health(playerLayoutData.PLAYER_2_HEALTH);
            this.setPlayer2Health(health);
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
};

module.exports = PlayerView;
},{}],30:[function(require,module,exports){
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

QuestionView.prototype.getAnswerPosition = function(indice) {
    if(indice === 1) {
        return {
            widthPercentage: 33,
            heightPercentage: 81
        };
    }
    if(indice === 2) {
        return {
            widthPercentage: 67,
            heightPercentage: 81
        };
    }
    
    if(indice === 3) {
        return {
            widthPercentage: 33,
            heightPercentage: 89
        };
    }
    
    if(indice === 4) {
        return {
            widthPercentage: 67,
            heightPercentage: 89
        };
    }
};

QuestionView.prototype.setAnswerIndices = function(answerIndices) {
    this.answerIndices = answerIndices;
};

QuestionView.prototype.createCategoryElement = function(category, categoryData) {
    categoryData.text = category;
    this.categoryElement = this.createTextElement(categoryData);
    this.setElementPositionInPercent(this.categoryElement, 50, 69);
    this.addElementToContainer(this.categoryElement, categoryData);
};

QuestionView.prototype.createQuestionElement = function(question, questionData) {
    questionData.text = question;
    this.questionElement = this.createTextElement(questionData);
    this.setElementPositionInPercent(this.questionElement, 50, 74);
    this.addElementToContainer(this.questionElement, questionData);
};

QuestionView.prototype.createAnswerElement1 = function(answer, answerData) {
    answerData.text = answer;
    this.answerElement1 = this.createTextElement(answerData);
    var answerPosition = this.getAnswerPosition(this.answerIndices[0]);
    this.setElementPositionInPercent(this.answerElement1, answerPosition.widthPercentage, answerPosition.heightPercentage);
    this.addElementToContainer(this.answerElement1, answerData);
};

QuestionView.prototype.createAnswerElement2 = function(answer, answerData) {
    answerData.text = answer;
    this.answerElement2 = this.createTextElement(answerData);
    var answerPosition = this.getAnswerPosition(this.answerIndices[1]);
    this.setElementPositionInPercent(this.answerElement2, answerPosition.widthPercentage, answerPosition.heightPercentage);
    this.addElementToContainer(this.answerElement2, answerData);
};

QuestionView.prototype.createAnswerElement3 = function(answer, answerData) {
    answerData.text = answer;
    this.answerElement3 = this.createTextElement(answerData);
    var answerPosition = this.getAnswerPosition(this.answerIndices[2]);
    this.setElementPositionInPercent(this.answerElement3, answerPosition.widthPercentage, answerPosition.heightPercentage);
    this.addElementToContainer(this.answerElement3, answerData);
};

QuestionView.prototype.createAnswerElement4 = function(answer, answerData) {
    answerData.text = answer;
    this.answerElement4 = this.createTextElement(answerData);
    var answerPosition = this.getAnswerPosition(this.answerIndices[3]);
    this.setElementPositionInPercent(this.answerElement4, answerPosition.widthPercentage, answerPosition.heightPercentage);
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
    console.log("Answer:");
    console.log(answer);
    var answerOnScreen = (answer.slice(-1) - 1);
    this.playerWhoAnsweredElement = this.createTextElement(questionData[player + this.ANSWERED_SUFFIX]);
    this.setElementPositionInPercent(this.playerWhoAnsweredElement, questionData[this.ANSWERED_PREFIX + this.answerIndices[(answerOnScreen)]].widthPercentage, questionData[this.ANSWERED_PREFIX + this.answerIndices[(answerOnScreen)]].heightPercentage);
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
},{}],31:[function(require,module,exports){
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
    this.winText = this.createTextElement(data);
    this.setElementPositionInPercent(this.winText, 50, 66);
    this.addElementToContainer(this.winText, positionData);
};

WinView.prototype.createPlayerStatsText = function(layoutData, statData) {
    var correctP1AnswerPercentageDefaultText = layoutData.PLAYER_1_CORRECT_PERCENTAGE.text;
    layoutData.PLAYER_1_CORRECT_PERCENTAGE.text = layoutData.PLAYER_1_CORRECT_PERCENTAGE.text + statData.player1CorrectAnswerPercentage;
    this.player1CorrectAnswerPercentageText = this.createTextElement(layoutData.PLAYER_1_CORRECT_PERCENTAGE);
    this.setElementPositionInPercent(this.player1CorrectAnswerPercentageText, 25, 72);
    this.addElementToContainer(this.player1CorrectAnswerPercentageText, layoutData.PLAYER_1_CORRECT_PERCENTAGE);
    layoutData.PLAYER_1_CORRECT_PERCENTAGE.text = correctP1AnswerPercentageDefaultText;
    
    var correctP2AnswerPercentageDefaultText = layoutData.PLAYER_2_CORRECT_PERCENTAGE.text;
    layoutData.PLAYER_2_CORRECT_PERCENTAGE.text = layoutData.PLAYER_2_CORRECT_PERCENTAGE.text + statData.player2CorrectAnswerPercentage;
    this.player2CorrectAnswerPercentageText = this.createTextElement(layoutData.PLAYER_2_CORRECT_PERCENTAGE);
    this.setElementPositionInPercent(this.player2CorrectAnswerPercentageText, 75, 72);
    this.addElementToContainer(this.player2CorrectAnswerPercentageText, layoutData.PLAYER_2_CORRECT_PERCENTAGE);
    layoutData.PLAYER_2_CORRECT_PERCENTAGE.text = correctP2AnswerPercentageDefaultText;
};

WinView.prototype.createPlayAgainButton = function () {
    this.playAgainButton = this.createSpriteElement(Display.resourcePath + '/play-again.png');
    this.setElementPositionInPercent(this.playAgainButton, 50, 80);
    this.addElementToContainer(this.playAgainButton);
};

WinView.prototype.getInteractiveViewElements = function() {
    return [this.playAgainButton];
};

WinView.prototype.cleanView = function() {
    this.removeElement(this.player1CorrectAnswerPercentageText);
    this.removeElement(this.player2CorrectAnswerPercentageText);
    this.removeElement(this.winText);
};

module.exports = WinView;
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi5qcyIsInNyYy9Tb3VuZE1hbmFnZXIuanMiLCJzcmMvY29uc3RhbnQvU29ja2V0Q29uc3RhbnRzLmpzIiwic3JjL2NvbnRyb2xsZXIvQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0NvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9GaW5kR2FtZUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9HYW1lQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0hlbHBDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvTWVudUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9UdXJuQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvRGljZUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9zdWJjb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9zdWJjb250cm9sbGVyL1F1ZXN0aW9uQ29udHJvbGxlci5qcyIsInNyYy9sb2FkZXIvQnVja2V0TG9hZGVyLmpzIiwic3JjL2xvYWRlci9JbWFnZUxvYWRlci5qcyIsInNyYy9sb2FkZXIvSnNvbkxvYWRlci5qcyIsInNyYy9sb2FkZXIvVmlld0xvYWRlci5qcyIsInNyYy9zdG9yZS9Db250cm9sbGVyU3RvcmUuanMiLCJzcmMvc3RvcmUvU3ByaXRlU3RvcmUuanMiLCJzcmMvdXRpbC9EaXNwbGF5LmpzIiwic3JjL3ZpZXcvQXZhdGFyU2VsZWN0aW9uVmlldy5qcyIsInNyYy92aWV3L0ZpbmRHYW1lVmlldy5qcyIsInNyYy92aWV3L0hlbHBWaWV3LmpzIiwic3JjL3ZpZXcvTG9hZGluZ1ZpZXcuanMiLCJzcmMvdmlldy9NZW51Vmlldy5qcyIsInNyYy92aWV3L1ZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L0F2YXRhclZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L0RpY2VWaWV3LmpzIiwic3JjL3ZpZXcvc3Vidmlldy9QbGF5ZXJWaWV3LmpzIiwic3JjL3ZpZXcvc3Vidmlldy9RdWVzdGlvblZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1dpblZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJEaXNwbGF5ID0gcmVxdWlyZSgnLi91dGlsL0Rpc3BsYXknKTtcblNvY2tldENvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnQvU29ja2V0Q29uc3RhbnRzJyk7XG5WaWV3ID0gcmVxdWlyZSgnLi92aWV3L1ZpZXcnKTtcbkxvYWRpbmdWaWV3ID0gcmVxdWlyZSgnLi92aWV3L0xvYWRpbmdWaWV3Jyk7XG5CdWNrZXRMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9CdWNrZXRMb2FkZXInKTtcbkpzb25Mb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9Kc29uTG9hZGVyJyk7XG5JbWFnZUxvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL0ltYWdlTG9hZGVyJyk7XG5WaWV3TG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvVmlld0xvYWRlcicpO1xuQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9Db250cm9sbGVyJyk7XG5IZWxwVmlldyA9IHJlcXVpcmUoJy4vdmlldy9IZWxwVmlldycpO1xuSGVscENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvSGVscENvbnRyb2xsZXInKTtcbk1lbnVWaWV3ID0gcmVxdWlyZSgnLi92aWV3L01lbnVWaWV3Jyk7XG5NZW51Q29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9NZW51Q29udHJvbGxlcicpO1xuQXZhdGFyU2VsZWN0aW9uVmlldyA9IHJlcXVpcmUoJy4vdmlldy9BdmF0YXJTZWxlY3Rpb25WaWV3Jyk7XG5BdmF0YXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvQXZhdGFyVmlldycpO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyJyk7XG5GaW5kR2FtZVZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvRmluZEdhbWVWaWV3Jyk7XG5GaW5kR2FtZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvRmluZEdhbWVDb250cm9sbGVyJyk7XG5Tb3VuZE1hbmFnZXIgPSByZXF1aXJlKCcuL1NvdW5kTWFuYWdlcicpO1xuR2FtZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvR2FtZUNvbnRyb2xsZXInKTtcbkRpY2VWaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvRGljZVZpZXcnKTtcbkRpY2VDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvRGljZUNvbnRyb2xsZXInKTtcblF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L1F1ZXN0aW9uVmlldycpO1xuUXVlc3Rpb25Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUXVlc3Rpb25Db250cm9sbGVyJyk7XG5QbGF5ZXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvUGxheWVyVmlldycpO1xuUGxheWVyQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9zdWJjb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXInKTtcbldpblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9XaW5WaWV3Jyk7XG5UdXJuQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9UdXJuQ29udHJvbGxlcicpO1xuQ29udHJvbGxlclN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZS9Db250cm9sbGVyU3RvcmUnKTtcblNwcml0ZVN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZS9TcHJpdGVTdG9yZScpO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgdmFyIERFRkFVTFRfV0lEVEggPSA0ODA7XG4gICAgdmFyIERFRkFVTFRfSEVJR0hUID0gMzIwO1xuICAgIHZhciBSRU5ERVJFUl9CQUNLR1JPVU5EX0NPTE9VUiA9IDB4MDAwMDAwO1xuICAgIHZhciBESVZfSUQgPSBcImdhbWVcIjtcbiAgICBcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhdGVkIGJ1Y2tldCBsb2FkZXIuXCIpO1xuICAgICAgICBuZXcgQnVja2V0TG9hZGVyKGxvYWRMYXlvdXQsIGJ1Y2tldExvYWRpbmdGYWlsZWRNZXNzYWdlKTtcbiAgICB9KSgpO1xuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRMYXlvdXQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyBsYXlvdXRcIik7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKCcuL3Jlc291cmNlLycgKyBEaXNwbGF5LmJ1Y2tldC53aWR0aCArICd4JyArIERpc3BsYXkuYnVja2V0LmhlaWdodCArICcvbGF5b3V0Lmpzb24nLCBzZXRMYXlvdXREYXRhSW5QSVhJKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0TGF5b3V0RGF0YUluUElYSShsYXlvdXREYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2V0dGluZyBsYXlvdXQuXCIpO1xuICAgICAgICBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhID0gbGF5b3V0RGF0YTtcbiAgICAgICAgdmFyIHNwcml0ZVN0b3JlID0gbmV3IFNwcml0ZVN0b3JlKCk7XG4gICAgICAgIFZpZXcucHJvdG90eXBlLnNwcml0ZVN0b3JlID0gc3ByaXRlU3RvcmU7XG4gICAgICAgIHN0YXJ0UmVuZGVyaW5nKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHN0YXJ0UmVuZGVyaW5nKCkge1xuICAgICAgICB2YXIgcmVuZGVyZXJPcHRpb25zID0ge1xuICAgICAgICAgICAgYW50aWFsaWFzaW5nOmZhbHNlLFxuICAgICAgICAgICAgcmVzb2x1dGlvbjoxLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOlJFTkRFUkVSX0JBQ0tHUk9VTkRfQ09MT1VSXG4gICAgICAgIH07XG4gICAgICAgIHZhciB2aWV3TG9hZGVyID0gbmV3IFZpZXdMb2FkZXIoKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICAgICAgICBjb250YWluZXIuaW50ZXJhY3RpdmUgPSB0cnVlO1xuICAgICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIod2luZG93LmlubmVyV2lkdGggKiBEaXNwbGF5LnNjYWxlLCB3aW5kb3cuaW5uZXJIZWlnaHQgKiBEaXNwbGF5LnNjYWxlLCByZW5kZXJlck9wdGlvbnMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlc291cmNlIHBhdGg6IFwiICsgRGlzcGxheS5yZXNvdXJjZVBhdGgpO1xuICAgICAgICByZW5kZXJlci5yb3VuZFBpeGVscyA9IHRydWU7XG4gICAgICAgIHNldERlcGVuZGVuY2llcyh2aWV3TG9hZGVyLCBjb250YWluZXIsIHJlbmRlcmVyKTtcbiAgICAgICAgYXBwZW5kR2FtZVRvRE9NKHJlbmRlcmVyKTtcbiAgICAgICAgYmVnaW5BbmltYXRpb24odmlld0xvYWRlcik7XG4gICAgICAgIGFkZExvYWRpbmdWaWV3VG9TY3JlZW4odmlld0xvYWRlcik7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKCcuL3Jlc291cmNlL3F1ZXN0aW9ucy5qc29uJywgc2V0UXVlc3Rpb25EYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXRRdWVzdGlvbkRhdGFJblF1ZXN0aW9uQ29udHJvbGxlcihxdWVzdGlvbkRhdGEpIHtcbiAgICAgICAgUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5xdWVzdGlvbkRhdGEgPSBxdWVzdGlvbkRhdGE7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKCcuL3Jlc291cmNlL2NhdGVnb3JpZXMuanNvbicsIHNldENhdGVnb3J5RGF0YUluUXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0Q2F0ZWdvcnlEYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIoY2F0ZWdvcnlEYXRhKSB7XG4gICAgICAgIFF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY2F0ZWdvcnlEYXRhID0gY2F0ZWdvcnlEYXRhO1xuICAgICAgICBsb2FkSW1hZ2VzKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZXMoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzcGxheSByZXNvdXJjZSBwYXRoOiBcIiArIERpc3BsYXkucmVzb3VyY2VQYXRoKTtcbiAgICAgICAgbmV3IEltYWdlTG9hZGVyKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9pbWFnZXMuanNvbicsIGJlZ2luR2FtZSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFwcGVuZEdhbWVUb0RPTShyZW5kZXJlcikge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChESVZfSUQpLmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXREZXBlbmRlbmNpZXModmlld0xvYWRlciwgY29udGFpbmVyLCByZW5kZXJlcikge1xuICAgICAgICB2aWV3TG9hZGVyLnNldENvbnRhaW5lcihjb250YWluZXIpO1xuICAgICAgICB2aWV3TG9hZGVyLnNldFJlbmRlcmVyKHJlbmRlcmVyKTtcbiAgICAgICAgQ29udHJvbGxlci5zZXRWaWV3TG9hZGVyKHZpZXdMb2FkZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBiZWdpbkFuaW1hdGlvbih2aWV3TG9hZGVyKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh2aWV3TG9hZGVyLmFuaW1hdGUpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBiZWdpbkdhbWUoKSB7XG4gICAgICAgIHZhciBtZW51Q29udHJvbGxlciA9IENvbnRyb2xsZXJTdG9yZS5tZW51Q29udHJvbGxlcjtcbiAgICAgICAgbWVudUNvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYWRkTG9hZGluZ1ZpZXdUb1NjcmVlbih2aWV3TG9hZGVyKSB7XG4gICAgICAgIHZhciBsb2FkaW5nVmlldyA9IG5ldyBMb2FkaW5nVmlldygpO1xuICAgICAgICBsb2FkaW5nVmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgICAgICB2aWV3TG9hZGVyLmxvYWRWaWV3KGxvYWRpbmdWaWV3KTtcbiAgICB9XG4gICAgICAgIFxuICAgIGZ1bmN0aW9uIGJ1Y2tldExvYWRpbmdGYWlsZWRNZXNzYWdlKCkge1xuICAgICAgICBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQgPSBERUZBVUxUX0hFSUdIVDtcbiAgICAgICAgRGlzcGxheS5idWNrZXQud2lkdGggPSBERUZBVUxUX1dJRFRIO1xuICAgICAgICBEaXNwbGF5LnNjYWxlID0gMTtcbiAgICAgICAgRGlzcGxheS5yZXNvdXJjZVBhdGggPSBERUZBVUxUX1dJRFRIICsgJ3gnICsgREVGQVVMVF9IRUlHSFQ7XG4gICAgfVxufTsiLCJmdW5jdGlvbiBTb3VuZE1hbmFnZXIoKSB7XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvcnJlY3RBbnN3ZXJTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC9jb3JyZWN0LWFuc3dlci5tcDNcIl19KTtcbiAgICAgICAgdGhpcy53cm9uZ0Fuc3dlclNvdW5kID0gbmV3IEhvd2woe3VybHM6IFtcInJlc291cmNlL3NvdW5kL3dyb25nLWFuc3dlci5tcDNcIl19KTtcbiAgICAgICAgdGhpcy5yb2xsRGljZVNvdW5kID0gbmV3IEhvd2woe3VybHM6IFtcInJlc291cmNlL3NvdW5kL3JvbGwtZGljZS5tcDNcIl19KTtcbiAgICAgICAgdGhpcy50aWNrU291bmQgPSBuZXcgSG93bCh7dXJsczogW1wicmVzb3VyY2Uvc291bmQvdGljay5tcDNcIl19KTtcbiAgICB9LmJpbmQodGhpcykpKCk7XG4gICAgXG4gICAgdGhpcy5wbGF5Q29ycmVjdEFuc3dlclNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdEFuc3dlclNvdW5kLnBsYXkoKTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMucGxheVdyb25nQW5zd2VyU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy53cm9uZ0Fuc3dlclNvdW5kLnBsYXkoKTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMucGxheVJvbGxEaWNlU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yb2xsRGljZVNvdW5kLnBsYXkoKTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMucGxheVRpY2tTb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnRpY2tTb3VuZC5wbGF5KCk7XG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZE1hbmFnZXI7IiwidmFyIFNvY2tldENvbnN0YW50cyA9IHtcbiAgICAnb24nIDoge1xuICAgICAgICAnUExBWUVSU19IRUFMVEgnIDogJ3BsYXllcnMtaGVhbHRoJyxcbiAgICAgICAgJ0RJQ0VfTlVNQkVSJyA6ICdkaWNlLW51bWJlcicsXG4gICAgICAgICdSQU5ET01fUVVFU1RJT04nIDogJ3JhbmRvbS1xdWVzdGlvbicsXG4gICAgICAgICdJTklUX05FV19UVVJOJyA6ICdpbml0LW5ldy10dXJuJyxcbiAgICAgICAgJ0RBTUFHRV9ERUFMVCcgOiAnZGFtYWdlLWRlYWx0JyxcbiAgICAgICAgJ1NIVUZGTEVEX0FOU1dFUl9JTkRJQ0VTJyA6ICdzaHVmZmxlZC1hbnN3ZXItaW5kaWNlcycsXG4gICAgICAgICdHQU1FX0ZPVU5EJyA6ICdnYW1lLWZvdW5kJyxcbiAgICAgICAgJ0dBTUVfU1RBVFMnIDogJ2dhbWUtc3RhdHMnXG4gICAgfSxcbiAgICBcbiAgICAnZW1pdCcgOiB7XG4gICAgICAgICdDT05ORUNUSU9OJyA6ICdjb25uZWN0aW9uJyxcbiAgICAgICAgJ0ZJTkRJTkdfR0FNRScgOiAnZmluZGluZy1nYW1lJyxcbiAgICAgICAgJ0dFVF9QTEFZRVJTX0hFQUxUSCcgOiAnZ2V0LXBsYXllcnMtaGVhbHRoJyxcbiAgICAgICAgJ0RJU0NPTk5FQ1QnIDogJ2Rpc2Nvbm5lY3QnLFxuICAgICAgICAnUk9MTF9ESUNFJyA6ICdyb2xsLWRpY2UnLFxuICAgICAgICAnR0VUX1JBTkRPTV9RVUVTVElPTicgOiAnZ2V0LXJhbmRvbS1xdWVzdGlvbicsXG4gICAgICAgICdORVdfVFVSTicgOiAnbmV3LXR1cm4nLFxuICAgICAgICAnREVBTF9EQU1BR0UnIDogJ2RlYWwtZGFtYWdlJyxcbiAgICAgICAgJ1NIVUZGTEVfQU5TV0VSX0lORElDRVMnIDogJ3NodWZmbGUtYW5zd2VyLWluZGljZXMnLFxuICAgICAgICAnR0FNRV9FTkRFRCcgOiAnZ2FtZS1lbmRlZCdcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvY2tldENvbnN0YW50czsiLCJBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcjtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEF2YXRhclNlbGVjdGlvblZpZXcoKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNlbGVjdGVkQXZhdGFyVmlldyA9IG5ldyBBdmF0YXJWaWV3KCk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5hdmF0YXJzID0gWydlbW9qaUFuZ2VsJywgJ2Vtb2ppQmlnU21pbGUnLCAnZW1vamlDb29sJywgJ2Vtb2ppR3JpbicsICdlbW9qaUhhcHB5JywgJ2Vtb2ppS2lzcycsICdlbW9qaUxhdWdoaW5nJywgJ2Vtb2ppTG92ZScsICdlbW9qaU1vbmtleScsICdlbW9qaVBvbycsICdlbW9qaVNjcmVhbScsICdlbW9qaVNsZWVwJywgJ2Vtb2ppU21pbGUnLCAnZW1vamlTbGVlcCcsICdlbW9qaVdpbmsnXTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmN1cnJlbnRBdmF0YXJJbmRleCA9IDA7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5hbUlTZXQgPSBcIk5vXCI7XG5cbmZ1bmN0aW9uIEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xufVxuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKCk7XG4gICAgdGhpcy5zZWxlY3RlZEF2YXRhclZpZXcuY3JlYXRlQXZhdGFyKHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF0pO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xuICAgIGNvbnNvbGUubG9nKFwiVmlldyBsb2FkZWRcIik7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBiYWNrQnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5CQUNLX0JVVFRPTl07XG4gICAgdmFyIHNlbGVjdFVwID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5TRUxFQ1RfVVBdO1xuICAgIHZhciBzZWxlY3REb3duID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5TRUxFQ1RfRE9XTl07XG4gICAgdmFyIGZpbmRHYW1lID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5GSU5EX0dBTUVdO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gQ29udHJvbGxlclN0b3JlLm1lbnVDb250cm9sbGVyO1xuICAgICAgICBtZW51Q29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihzZWxlY3RVcCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBVUCA9IDE7XG4gICAgICAgIHRoaXMuc2V0dXBOZXh0QXZhdGFyKFVQKTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHNlbGVjdERvd24sIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgRE9XTiA9IC0xO1xuICAgICAgICB0aGlzLnNldHVwTmV4dEF2YXRhcihET1dOKTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGZpbmRHYW1lLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF2YXRhciA9IHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF07XG4gICAgICAgIHZhciBmaW5kR2FtZUNvbnRyb2xsZXIgPSBDb250cm9sbGVyU3RvcmUuZmluZEdhbWVDb250cm9sbGVyO1xuICAgICAgICBmaW5kR2FtZUNvbnRyb2xsZXIubG9hZFZpZXcoYXZhdGFyKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBOZXh0QXZhdGFyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgaWYodGhpcy5jdXJyZW50QXZhdGFySW5kZXggPj0gKHRoaXMuYXZhdGFycy5sZW5ndGggLSAxKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCA9IDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCArIGRpcmVjdGlvbiA8IDApIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXZhdGFySW5kZXggPSAodGhpcy5hdmF0YXJzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3VycmVudEF2YXRhckluZGV4ID0gdGhpcy5jdXJyZW50QXZhdGFySW5kZXggKyBkaXJlY3Rpb247XG4gICAgfVxuICAgXG4gICAgdGhpcy5zZWxlY3RlZEF2YXRhclZpZXcuY3JlYXRlQXZhdGFyKHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF0pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gQ29udHJvbGxlcigpIHt9XG5cbkNvbnRyb2xsZXIuc2V0Vmlld0xvYWRlciA9IGZ1bmN0aW9uKHZpZXdMb2FkZXIpIHtcbiAgICBDb250cm9sbGVyLnByb3RvdHlwZS52aWV3TG9hZGVyID0gdmlld0xvYWRlcjtcbn07XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnNvY2tldCA9IGlvKCk7XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTGlzdGVuZXIgPSBmdW5jdGlvbih2aWV3RWxlbWVudCwgYWN0aW9uKSB7XG4gICAgdmlld0VsZW1lbnQudG91Y2hlbmQgPSB2aWV3RWxlbWVudC5jbGljayA9IGFjdGlvbjtcbn07XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTXVsdGlwbGVMaXN0ZW5lcnMgPSBmdW5jdGlvbih2aWV3RWxlbWVudHMsIGFjdGlvbikge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2aWV3RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHZpZXdFbGVtZW50c1tpXSwgYWN0aW9uKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7IiwiRmluZEdhbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gRmluZEdhbWVDb250cm9sbGVyO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEZpbmRHYW1lVmlldygpO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5hdmF0YXIgPSBudWxsO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5UUkFOU0lUSU9OX1RPX0dBTUVfVElNRSA9IDMwMDA7XG5cbmZ1bmN0aW9uIEZpbmRHYW1lQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgdGhpcy5hdmF0YXIgPSBhdmF0YXI7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHModGhpcy5hdmF0YXIpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuRklORElOR19HQU1FLCB7YXZhdGFyOiB0aGlzLmF2YXRhcn0pO1xufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5yZWdpc3RlclNvY2tldEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5HQU1FX0ZPVU5ELCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuYXNzaWduQXZhdGFycyhwbGF5ZXJEYXRhKTtcbiAgICAgICAgdGhpcy52aWV3LmNyZWF0ZUdhbWVGb3VuZENhcHRpb24oKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgICAgICAgICAgdmFyIHBsYXllckNvbnRyb2xsZXIgPSBDb250cm9sbGVyU3RvcmUucGxheWVyQ29udHJvbGxlcjtcbiAgICAgICAgICAgIHBsYXllckNvbnRyb2xsZXIuc2V0UGxheWVyRGF0YShwbGF5ZXJEYXRhKTtcbiAgICAgICAgICAgIHZhciBkaWNlQ29udHJvbGxlciA9IENvbnRyb2xsZXJTdG9yZS5kaWNlQ29udHJvbGxlcjtcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbkNvbnRyb2xsZXIgPSBDb250cm9sbGVyU3RvcmUucXVlc3Rpb25Db250cm9sbGVyO1xuICAgICAgICAgICAgcXVlc3Rpb25Db250cm9sbGVyLnNldFBsYXllckNvbnRyb2xsZXIocGxheWVyQ29udHJvbGxlcik7XG4gICAgICAgICAgICB2YXIgdHVybkNvbnRyb2xsZXIgPSBDb250cm9sbGVyU3RvcmUudHVybkNvbnRyb2xsZXI7XG4gICAgICAgICAgICB0dXJuQ29udHJvbGxlci5zZXRDb250cm9sbGVyRGVwZW5kZW5jaWVzKHBsYXllckNvbnRyb2xsZXIsIGRpY2VDb250cm9sbGVyLCBxdWVzdGlvbkNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgdHVybkNvbnRyb2xsZXIuaW5pdGlhdGUoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCB0aGlzLlRSQU5TSVRJT05fVE9fR0FNRV9USU1FKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5hc3NpZ25BdmF0YXJzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBzb2NrZXRJZFByZWZpeCA9IFwiLyNcIjtcbiAgICB2YXIgc29ja2V0SWQgPSBzb2NrZXRJZFByZWZpeCArIHRoaXMuc29ja2V0LmlkO1xuICAgIGlmKGRhdGEucGxheWVyMUlkID09PSBzb2NrZXRJZCkge1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhcihkYXRhLnBsYXllcjJBdmF0YXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldy5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyKGRhdGEucGxheWVyMUF2YXRhcik7XG4gICAgfVxufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmluZEdhbWVDb250cm9sbGVyOyIsIkdhbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gR2FtZUNvbnRyb2xsZXI7XG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gR2FtZUNvbnRyb2xsZXIocGxheWVyRGF0YSkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbn1cblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldFBsYXllckRhdGEgPSBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXllckRhdGEgPSBwbGF5ZXJEYXRhO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldERpY2VOdW1iZXIgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmRpY2VOdW1iZXIgPSBkaWNlTnVtYmVyO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmlzUGxheWVyMSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzb2NrZXRQcmVmaXggPSBcIi8jXCI7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyRGF0YS5wbGF5ZXIxSWQgPT09IChzb2NrZXRQcmVmaXggKyBHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc29ja2V0LmlkKTtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5nZXRQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pc1BsYXllcjEodGhpcy5wbGF5ZXJEYXRhKSA/IFwiUExBWUVSXzFcIiA6IFwiUExBWUVSXzJcIjtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5nZXRPcHBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlzUGxheWVyMSh0aGlzLnBsYXllckRhdGEpID8gXCJQTEFZRVJfMlwiIDogXCJQTEFZRVJfMVwiO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNvdW5kTWFuYWdlciA9IG5ldyBTb3VuZE1hbmFnZXIoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lQ29udHJvbGxlcjsiLCJIZWxwQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEhlbHBDb250cm9sbGVyO1xuSGVscENvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBIZWxwVmlldygpO1xuXG5mdW5jdGlvbiBIZWxwQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG59XG5cbkhlbHBDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbn07XG5cbkhlbHBDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBiYWNrQnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5CQUNLX0JVVFRPTl07XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGJhY2tCdXR0b24sIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWVudUNvbnRyb2xsZXIgPSBDb250cm9sbGVyU3RvcmUubWVudUNvbnRyb2xsZXI7XG4gICAgICAgIG1lbnVDb250cm9sbGVyLmxvYWRWaWV3KCk7XG4gICAgfSk7XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBDb250cm9sbGVyOyIsIk1lbnVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gTWVudUNvbnRyb2xsZXI7XG5NZW51Q29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IE1lbnVWaWV3KCk7XG5cbmZ1bmN0aW9uIE1lbnVDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbn1cblxuTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKCk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xufTtcblxuTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZXdFbGVtZW50cyA9IHRoaXMudmlldy5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cygpOyAgXG4gICAgdmFyIHBsYXlCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlBMQVlfQlVUVE9OXTtcbiAgICB2YXIgaGVscEJ1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuSEVMUF9CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihwbGF5QnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSBDb250cm9sbGVyU3RvcmUuYXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcjtcbiAgICAgICAgYXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihoZWxwQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhlbHBDb250cm9sbGVyID0gQ29udHJvbGxlclN0b3JlLmhlbHBDb250cm9sbGVyO1xuICAgICAgICBoZWxwQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51Q29udHJvbGxlcjsiLCJUdXJuQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IFR1cm5Db250cm9sbGVyO1xuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBUdXJuQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLndpblZpZXcgPSBuZXcgV2luVmlldygpO1xuICAgIHRoaXMuY2xlYW5Db250cm9sbGVyVmlldygpO1xuICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB0aGlzLm5ld1R1cm4oKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5zZXRDb250cm9sbGVyRGVwZW5kZW5jaWVzID0gZnVuY3Rpb24ocGxheWVyQ29udHJvbGxlciwgZGljZUNvbnRyb2xsZXIsIHF1ZXN0aW9uQ29udHJvbGxlcikge1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlciA9IGRpY2VDb250cm9sbGVyO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyID0gcXVlc3Rpb25Db250cm9sbGVyO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLklOSVRfTkVXX1RVUk4sIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgaWYocGxheWVyRGF0YS5wbGF5ZXIxSGVhbHRoID09PSAwKSB7XG4gICAgICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HQU1FX0VOREVELCB7d2lubmVyOiBcIlBMQVlFUl8yXCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKHBsYXllckRhdGEucGxheWVyMkhlYWx0aCA9PT0gMCkge1xuICAgICAgICAgICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuR0FNRV9FTkRFRCwge3dpbm5lcjogXCJQTEFZRVJfMVwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMubmV3VHVybigpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAxNTAwKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkdBTUVfU1RBVFMsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy5sb2FkV2luVmlldyhkYXRhLndpbm5lciwgZGF0YSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5sb2FkV2luVmlldyA9IGZ1bmN0aW9uKHBsYXllciwgZGF0YSkge1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy53aW5WaWV3LmNsZWFuVmlldygpO1xuICAgIHRoaXMud2luVmlldy5jcmVhdGVXaW5uZXJUZXh0KHBsYXllciwgZGF0YSk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMud2luVmlldyk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy53aW5WaWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgcGxheUFnYWluQnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMud2luVmlldy5QTEFZX0FHQUlOX0JVVFRPTl07XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHBsYXlBZ2FpbkJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGxheWVyQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICAgICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgICAgIHZhciBhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gQ29udHJvbGxlclN0b3JlLmF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI7XG4gICAgICAgIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLm5ld1R1cm4gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmRpY2VDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZGljZUNvbnRyb2xsZXIucm9sbERpY2UoKTtcbiAgICB9LmJpbmQodGhpcyksIDIwMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmxvYWRWaWV3KCk7XG4gICAgfS5iaW5kKHRoaXMpLCAzMDAwKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5jbGVhbkNvbnRyb2xsZXJWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuY2hlY2tQbGF5ZXJzSGVhbHRoID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUExBWUVSU19IRUFMVEgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUdXJuQ29udHJvbGxlcjsiLCJEaWNlQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IERpY2VDb250cm9sbGVyO1xuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgRGljZVZpZXcoKTtcblxuZnVuY3Rpb24gRGljZUNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkRJQ0VfTlVNQkVSLCBmdW5jdGlvbihkaWNlKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlSb2xsRGljZVNvdW5kKCk7XG4gICAgICAgIHRoaXMubG9hZERpY2UoZGljZS5udW1iZXIpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUucm9sbERpY2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuUk9MTF9ESUNFKTtcbiAgICB9XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUubG9hZERpY2UgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgdGhpcy52aWV3LnNldHVwRGljZShkaWNlTnVtYmVyKTtcbiAgICB0aGlzLnNldERpY2VOdW1iZXIoZGljZU51bWJlcik7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpY2VDb250cm9sbGVyOyIsIlBsYXllckNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBQbGF5ZXJDb250cm9sbGVyO1xuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IFBsYXllclZpZXcoKTtcblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLkRBTkdFUk9VU19MRVZFTF9IRUFMVEggPSA2O1xuXG5mdW5jdGlvbiBQbGF5ZXJDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG59XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3LnNldFBsYXllckRhdGEodGhpcy5wbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBsYXllcnNIZWFsdGgoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlBMQVlFUlNfSEVBTFRILCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuY2xlYXJJbnRlcnZhbHMoKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFBsYXllcjFIZWFsdGgocGxheWVyRGF0YS5wbGF5ZXIxSGVhbHRoKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFBsYXllcjJIZWFsdGgocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoKTtcbiAgICAgICAgaWYocGxheWVyRGF0YS5wbGF5ZXIxSGVhbHRoIDw9IHRoaXMuREFOR0VST1VTX0xFVkVMX0hFQUxUSCkge1xuICAgICAgICAgICAgdGhpcy52aWV3LmZsYXNoUGxheWVyMUhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHBsYXllckRhdGEucGxheWVyMkhlYWx0aCA8PSB0aGlzLkRBTkdFUk9VU19MRVZFTF9IRUFMVEgpIHtcbiAgICAgICAgICAgIHRoaXMudmlldy5mbGFzaFBsYXllcjJIZWFsdGgocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS51cGRhdGVQbGF5ZXJzSGVhbHRoID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUExBWUVSU19IRUFMVEgpO1xufTtcblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhckludGVydmFscyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlldy5jbGVhckludGVydmFscygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJDb250cm9sbGVyOyIsIlF1ZXN0aW9uQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IFF1ZXN0aW9uQ29udHJvbGxlcjtcblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgUXVlc3Rpb25WaWV3KCk7XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuQU5TV0VSRURfMSA9ICdBTlNXRVJFRF8xJztcblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuQU5TV0VSRURfMiA9ICdBTlNXRVJFRF8yJztcblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuQU5TV0VSRURfMyA9ICdBTlNXRVJFRF8zJztcblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuQU5TV0VSRURfNCA9ICdBTlNXRVJFRF80JztcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5USU1FX1RPX0FOU1dFUl9RVUVTVElPTiA9IDEwO1xuXG5mdW5jdGlvbiBRdWVzdGlvbkNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5yZWdpc3RlclNvY2tldEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5SQU5ET01fUVVFU1RJT04sIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IGRhdGEucXVlc3Rpb247XG4gICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBkYXRhLmNhdGVnb3J5O1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uREFNQUdFX0RFQUxULCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJUb0NvbG91cih0aGlzLmFuc3dlcnNbcGxheWVyRGF0YS5hbnN3ZXJdLCBwbGF5ZXJEYXRhLmFuc3dlcik7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJUb0NvbG91cih0aGlzLmFuc3dlcnNbdGhpcy5BTlNXRVJFRF8xXSwgdGhpcy5BTlNXRVJFRF8xKTtcbiAgICAgICAgdGhpcy52aWV3LnNldFdob0Fuc3dlcmVkUXVlc3Rpb24odGhpcy5hbnN3ZXJzW3BsYXllckRhdGEuYW5zd2VyXSwgcGxheWVyRGF0YS5hbnN3ZXIsIHBsYXllckRhdGEucGxheWVyX3dob19hbnN3ZXJlZCk7XG4gICAgICAgIHRoaXMudmlldy50dXJuT2ZmSW50ZXJhY3Rpdml0eUZvckFuc3dlckVsZW1lbnRzKCk7XG4gICAgICAgIHRoaXMucGxheWVyQ29udHJvbGxlci51cGRhdGVQbGF5ZXJzSGVhbHRoKCk7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lckludGVydmFsSWQpO1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ORVdfVFVSTik7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlNIVUZGTEVEX0FOU1dFUl9JTkRJQ0VTLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJJbmRpY2VzKGRhdGEpO1xuICAgICAgICB0aGlzLnZpZXcuZGlzcGxheUNhdGVnb3J5QW5kUXVlc3Rpb24odGhpcy5jYXRlZ29yeSwgdGhpcy5xdWVzdGlvbik7XG4gICAgICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0UGxheWVyQ29udHJvbGxlciA9IGZ1bmN0aW9uKHBsYXllckNvbnRyb2xsZXIpIHtcbiAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIgPSBwbGF5ZXJDb250cm9sbGVyO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lckludGVydmFsSWQpO1xuICAgIHRoaXMuZ2V0UmFuZG9tUXVlc3Rpb24oKTtcbiAgICB0aGlzLnNodWZmbGVBbnN3ZXJJbmRpY2VzKCk7XG4gICAgdGhpcy51cGRhdGVUaW1lcigpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS51cGRhdGVUaW1lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aW1lUmVtYWluaW5nID0gMTA7XG4gICAgdmFyIHRpbWVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRpbWVSZW1haW5pbmcgPj0gMCkge1xuICAgICAgICAgICAgdGhpcy52aWV3LnVwZGF0ZVF1ZXN0aW9uVGltZXIodGltZVJlbWFpbmluZyk7XG4gICAgICAgICAgICB0aW1lUmVtYWluaW5nLS07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ORVdfVFVSTik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJbnRlcnZhbElkKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcbiAgICB0aGlzLnRpbWVySW50ZXJ2YWxJZCA9IHNldEludGVydmFsKHRpbWVyLCAxMDAwKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0UmFuZG9tUXVlc3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgIHZhciBjYXRlZ29yaWVzID0gdGhpcy5jYXRlZ29yeURhdGEuQ0FURUdPUklFUztcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMucXVlc3Rpb25EYXRhLkNBVEVHT1JJRVM7XG4gICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuR0VUX1JBTkRPTV9RVUVTVElPTiwge2NhdGVnb3JpZXM6IGNhdGVnb3JpZXMsIHF1ZXN0aW9uczogcXVlc3Rpb25zfSk7XG4gICAgfVxufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbnN3ZXJzID0gdGhpcy5nZXRWaWV3QW5zd2VycygpO1xuICAgIHRoaXMuc2V0UmlnaHRBbnN3ZXJMaXN0ZW5lcihhbnN3ZXJzKTtcbiAgICB0aGlzLnNldFdyb25nQW5zd2VyTGlzdGVuZXJzKGFuc3dlcnMpO1xuICAgIHRoaXMuc2V0QW5zd2VyVXBkYXRlTGlzdGVuZXIoYW5zd2Vycyk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmdldFZpZXdBbnN3ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZXdFbGVtZW50cyA9IHRoaXMudmlldy5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cygpO1xuICAgIHZhciBhbnN3ZXJzID0ge307XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8xID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5SSUdIVF9BTlNXRVJdO1xuICAgIGFuc3dlcnMuQU5TV0VSRURfMiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuV1JPTkdfQU5TV0VSXzFdO1xuICAgIGFuc3dlcnMuQU5TV0VSRURfMyA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuV1JPTkdfQU5TV0VSXzJdO1xuICAgIGFuc3dlcnMuQU5TV0VSRURfNCA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuV1JPTkdfQU5TV0VSXzNdO1xuICAgIHJldHVybiBhbnN3ZXJzO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXRSaWdodEFuc3dlckxpc3RlbmVyID0gZnVuY3Rpb24oYW5zd2Vycykge1xuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzEsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5Q29ycmVjdEFuc3dlclNvdW5kKCk7XG4gICAgICAgIHRoaXMuZW1pdERlYWxEYW1hZ2VUb09wcG9uZW50VG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8xKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXRXcm9uZ0Fuc3dlckxpc3RlbmVycyA9IGZ1bmN0aW9uKGFuc3dlcnMpIHtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF8yLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zb3VuZE1hbmFnZXIucGxheVdyb25nQW5zd2VyU291bmQoKTtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0KHRoaXMuQU5TV0VSRURfMik7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF8zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zb3VuZE1hbmFnZXIucGxheVdyb25nQW5zd2VyU291bmQoKTtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0KHRoaXMuQU5TV0VSRURfMyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF80LCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zb3VuZE1hbmFnZXIucGxheVdyb25nQW5zd2VyU291bmQoKTtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0KHRoaXMuQU5TV0VSRURfNCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2h1ZmZsZUFuc3dlckluZGljZXMgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5TSFVGRkxFX0FOU1dFUl9JTkRJQ0VTLCB7aW5kaWNlczogWzEsMiwzLDRdfSk7XG4gICAgfVxufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXRBbnN3ZXJVcGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uKGFuc3dlcnMpIHtcbiAgICB0aGlzLmFuc3dlcnMgPSBhbnN3ZXJzO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5lbWl0RGVhbERhbWFnZVRvT3Bwb25lbnRUb1NvY2tldCA9IGZ1bmN0aW9uKGFuc3dlcikge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuREVBTF9EQU1BR0UsIHtwbGF5ZXJfd2hvX2Fuc3dlcmVkOiB0aGlzLmdldFBsYXllcigpLCBwbGF5ZXJfdG9fZGFtYWdlOiB0aGlzLmdldE9wcG9uZW50KCksIGRhbWFnZTogdGhpcy5kaWNlTnVtYmVyLCBhbnN3ZXI6IGFuc3dlciwgYW5zd2VyU3RhdHVzOiAnY29ycmVjdCcsIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5fSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQgPSBmdW5jdGlvbihhbnN3ZXIpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkRFQUxfREFNQUdFLCB7cGxheWVyX3dob19hbnN3ZXJlZDogdGhpcy5nZXRQbGF5ZXIoKSwgcGxheWVyX3RvX2RhbWFnZTogdGhpcy5nZXRQbGF5ZXIoKSwgZGFtYWdlOiB0aGlzLmRpY2VOdW1iZXIsIGFuc3dlcjogYW5zd2VyLCBhbnN3ZXJTdGF0dXM6ICdpbmNvcnJlY3QnLCBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeX0pO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25Db250cm9sbGVyOyIsImZ1bmN0aW9uIEJ1Y2tldExvYWRlciAoY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgUE9SVFJBSVQgPSBcInBvcnRyYWl0XCIsXG4gICAgICAgIExBTkRTQ0FQRSA9IFwibGFuZHNjYXBlXCIsXG4gICAgICAgIEJVQ0tFVF9TSVpFX0pTT05fUEFUSCA9IFwicmVzb3VyY2UvYnVja2V0X3NpemVzLmpzb25cIjtcblxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKEJVQ0tFVF9TSVpFX0pTT05fUEFUSCwgY2FsY3VsYXRlQmVzdEJ1Y2tldCk7XG4gICAgfSkoKTtcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVNjYWxlICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGguZmxvb3Iod2luZG93LmRldmljZVBpeGVsUmF0aW8pLCAyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVCZXN0QnVja2V0IChidWNrZXREYXRhKSB7XG4gICAgICAgIHZhciBvcmllbnRhdGlvbiA9IGNhbGN1bGF0ZU9yaWVudGF0aW9uKCk7XG4gICAgICAgIHZhciBzY2FsZSA9IGNhbGN1bGF0ZVNjYWxlKCk7XG4gICAgICAgIGlmKHNjYWxlID09PSAyKSB7XG4gICAgICAgICAgICBzY2FsZSA9IDEuNTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIk9yaWVudGF0aW9uIGlzIFwiICsgb3JpZW50YXRpb24pO1xuICAgICAgICBidWNrZXREYXRhW29yaWVudGF0aW9uXS5mb3JFYWNoKGZ1bmN0aW9uIChidWNrZXQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQnVja2V0IGhlaWdodDogXCIgKyBidWNrZXQuaGVpZ2h0ICogc2NhbGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJXaW5kb3cgaGVpZ2h0OiBcIiArIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgICAgICBpZiAoYnVja2V0LmhlaWdodCAqIHNjYWxlIDw9IHdpbmRvdy5pbm5lckhlaWdodCApIHtcbiAgICAgICAgICAgICAgICBEaXNwbGF5LmJ1Y2tldCA9IGJ1Y2tldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBEaXNwbGF5LnNjYWxlID0gY2FsY3VsYXRlU2NhbGUod2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgICBEaXNwbGF5LnJlc291cmNlUGF0aCA9ICcuL3Jlc291cmNlLycgKyBEaXNwbGF5LmJ1Y2tldC53aWR0aCArICd4JyArIERpc3BsYXkuYnVja2V0LmhlaWdodCArICcvc2NhbGUtJyArIERpc3BsYXkuc2NhbGU7XG4gICAgICAgIERpc3BsYXkub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcbiAgICAgICAgZXhlY3V0ZUNhbGxiYWNrKCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU9yaWVudGF0aW9uICgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XG4gICAgICAgICAgICByZXR1cm4gUE9SVFJBSVQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTEFORFNDQVBFO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhlY3V0ZUNhbGxiYWNrICgpIHtcbiAgICAgICAgaWYgKERpc3BsYXkuYnVja2V0ID09PSBudWxsKSB7XG4gICAgICAgICAgICBlcnJvckNhbGxiYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1Y2tldExvYWRlcjsiLCJ2YXIgSW1hZ2VMb2FkZXIgPSBmdW5jdGlvbihpbWFnZUpzb25QYXRoLCBjYWxsYmFjaykge1xuICAgIHZhciBqc29uTG9hZGVyID0gbmV3IEpzb25Mb2FkZXIoaW1hZ2VKc29uUGF0aCwgbG9hZEltYWdlcyk7XG4gICAgdmFyIGltYWdlc0xvYWRlZCA9IDA7XG4gICAgdmFyIHRvdGFsSW1hZ2VzID0gMDtcbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKGltYWdlRGF0YSkge1xuICAgICAgICB2YXIgaW1hZ2VzID0gaW1hZ2VEYXRhLklNQUdFUztcbiAgICAgICAgY291bnROdW1iZXJPZkltYWdlcyhpbWFnZXMpO1xuICAgICAgICBmb3IodmFyIGltYWdlIGluIGltYWdlcykge1xuICAgICAgICAgICAgbG9hZEltYWdlKGltYWdlc1tpbWFnZV0ucGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlKGltYWdlUGF0aCkge1xuICAgICAgICB2YXIgUkVRVUVTVF9GSU5JU0hFRCA9IDQ7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGltYWdlUGF0aCwgdHJ1ZSk7XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSBSRVFVRVNUX0ZJTklTSEVEKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmluaXNoZWQgbG9hZGluZyBpbWFnZSBwYXRoOiBcIiArIGltYWdlUGF0aCk7XG4gICAgICAgICAgICAgIGltYWdlc0xvYWRlZCsrO1xuICAgICAgICAgICAgICBjaGVja0lmQWxsSW1hZ2VzTG9hZGVkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjb3VudE51bWJlck9mSW1hZ2VzKGltYWdlcykge1xuICAgICAgICBmb3IodmFyIGltYWdlIGluIGltYWdlcykge1xuICAgICAgICAgICAgdG90YWxJbWFnZXMrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjaGVja0lmQWxsSW1hZ2VzTG9hZGVkKCkge1xuICAgICAgICBpZihpbWFnZXNMb2FkZWQgPT09IHRvdGFsSW1hZ2VzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFsbCBpbWFnZXMgbG9hZGVkIVwiKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9ubHkgXCIgKyBpbWFnZXNMb2FkZWQgKyBcIiBhcmUgbG9hZGVkLlwiKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VMb2FkZXI7IiwidmFyIEpzb25Mb2FkZXIgPSBmdW5jdGlvbiAocGF0aCwgY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgIFJFUVVFU1RfRklOSVNIRUQgPSA0O1xuICAgIChmdW5jdGlvbiBsb2FkSnNvbigpIHtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIub3BlbignR0VUJywgcGF0aCwgdHJ1ZSk7XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSBSRVFVRVNUX0ZJTklTSEVEKSB7XG4gICAgICAgICAgICB0aGF0LmRhdGEgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgY2FsbGJhY2sodGhhdC5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSkoKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGF0LmRhdGE7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBKc29uTG9hZGVyO1xuIiwiZnVuY3Rpb24gVmlld0xvYWRlcigpIHt9XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24odmlldykge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIuYWRkQ2hpbGQodmlldyk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5yZW1vdmVBbGxWaWV3cyA9IGZ1bmN0aW9uKCkge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIucmVtb3ZlQ2hpbGRyZW4oKTtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnJlbW92ZVZpZXcgPSBmdW5jdGlvbih2aWV3KSB7XG4gICAgVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lci5yZW1vdmVDaGlsZCh2aWV3KTtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnNldFJlbmRlcmVyID0gZnVuY3Rpb24ocmVuZGVyZXIpIHtcbiAgICBWaWV3TG9hZGVyLnByb3RvdHlwZS5yZW5kZXJlciA9IHJlbmRlcmVyO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUuc2V0Q29udGFpbmVyID0gZnVuY3Rpb24oY29udGFpbmVyKSB7XG4gICAgVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lciA9IGNvbnRhaW5lcjtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbigpIHtcbiAgICBWaWV3TG9hZGVyLnByb3RvdHlwZS5yZW5kZXJlci5yZW5kZXIoVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lcik7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKFZpZXdMb2FkZXIucHJvdG90eXBlLmFuaW1hdGUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TG9hZGVyOyIsInZhciBDb250cm9sbGVyU3RvcmUgPSB7XG4gICAgbWVudUNvbnRyb2xsZXI6IG5ldyBNZW51Q29udHJvbGxlcigpLFxuICAgIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI6IG5ldyBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyKCksXG4gICAgaGVscENvbnRyb2xsZXI6IG5ldyBIZWxwQ29udHJvbGxlcigpLFxuICAgIGZpbmRHYW1lQ29udHJvbGxlcjogbmV3IEZpbmRHYW1lQ29udHJvbGxlcigpLFxuICAgIGRpY2VDb250cm9sbGVyOiBuZXcgRGljZUNvbnRyb2xsZXIoKSxcbiAgICBwbGF5ZXJDb250cm9sbGVyOiBuZXcgUGxheWVyQ29udHJvbGxlcigpLFxuICAgIHF1ZXN0aW9uQ29udHJvbGxlcjogbmV3IFF1ZXN0aW9uQ29udHJvbGxlcigpLFxuICAgIHR1cm5Db250cm9sbGVyOiBuZXcgVHVybkNvbnRyb2xsZXIoKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyU3RvcmU7IiwidmFyIFNwcml0ZVN0b3JlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNwcml0ZXMgPSBbXTtcbiAgICBcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNwcml0ZXMubG9nbyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2xvZ28uanBnJyk7XG4gICAgICAgIHNwcml0ZXMucGxheUJ1dHRvbiA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL3BsYXktYnV0dG9uLmpwZycpO1xuICAgICAgICBzcHJpdGVzLmhlbHBCdXR0b24gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9oZWxwLWJ1dHRvbi5qcGcnKTtcbiAgICAgICAgc3ByaXRlcy5iYWNrQnV0dG9uID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYmFjay1idXR0b24uanBnJyk7XG4gICAgICAgIHNwcml0ZXMuZG93blRyaWFuZ2xlID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZG93bi10cmlhbmdsZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy51cFRyaWFuZ2xlID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvdXAtdHJpYW5nbGUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZmluZEdhbWUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9maW5kLWdhbWUuanBnJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppQW5nZWwgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktYW5nZWwucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppQmlnU21pbGUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktYmlnLXNtaWxlLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaUNvb2wgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktY29vbC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlHcmluID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWdyaW4ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppSGFwcHkgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktaGFwcHkucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppS2lzcyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1raXNzLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaUxhdWdoaW5nID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWxhdWdoaW5nLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaUxvdmUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktbG92ZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlNb25rZXkgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktbW9ua2V5LnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaVBvbyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1wb28ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppU2NyZWFtID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLXNjcmVhbS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlTbGVlcCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbGVlcC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlTbWlsZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbWlsZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlTbGVlcCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbGVlcC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlXaW5rID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLXdpbmsucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppQW5nZWwgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktYW5nZWwucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppQmlnU21pbGUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktYmlnLXNtaWxlLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaUNvb2wgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktY29vbC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlHcmluID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWdyaW4ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppSGFwcHkgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktaGFwcHkucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppS2lzcyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1raXNzLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaUxhdWdoaW5nID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWxhdWdoaW5nLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaUxvdmUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktbG92ZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlNb25rZXkgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktbW9ua2V5LnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaVBvbyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1wb28ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppU2NyZWFtID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLXNjcmVhbS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlTbGVlcCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbGVlcC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlTbWlsZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbWlsZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlTbGVlcCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbGVlcC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlXaW5rID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLXdpbmsucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucXVlc3Rpb25NYXJrID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvcXVlc3Rpb24tbWFyay5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5kaWNlRmFjZTEgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9kaWNlL2RpY2UtZmFjZS0xLnBuZycpO1xuICAgICAgICBzcHJpdGVzLmRpY2VGYWNlMiA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2RpY2UvZGljZS1mYWNlLTIucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZGljZUZhY2UzID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZGljZS9kaWNlLWZhY2UtMy5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5kaWNlRmFjZTQgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9kaWNlL2RpY2UtZmFjZS00LnBuZycpO1xuICAgICAgICBzcHJpdGVzLmRpY2VGYWNlNSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2RpY2UvZGljZS1mYWNlLTUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZGljZUZhY2U2ID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZGljZS9kaWNlLWZhY2UtNi5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5QWdhaW4gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9wbGF5LWFnYWluLnBuZycpO1xuICAgIH0pKCk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihzcHJpdGVOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gc3ByaXRlc1tzcHJpdGVOYW1lXTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZVN0b3JlOyIsInZhciBEaXNwbGF5ID0ge1xuICAgIGJ1Y2tldDogbnVsbCxcbiAgICBzY2FsZTogbnVsbCxcbiAgICByZXNvdXJjZVBhdGg6IG51bGwsXG4gICAgb3JpZW50YXRpb246IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGxheTsiLCJBdmF0YXJTZWxlY3Rpb25WaWV3LmNvbnN0cnVjdG9yID0gQXZhdGFyU2VsZWN0aW9uVmlldztcbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLkJBQ0tfQlVUVE9OID0gMDtcbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLlNFTEVDVF9VUCA9IDE7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5TRUxFQ1RfRE9XTiA9IDI7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5GSU5EX0dBTUUgPSAzO1xuXG5cbmZ1bmN0aW9uIEF2YXRhclNlbGVjdGlvblZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZUxvZ28oKTtcbiAgICB0aGlzLmNyZWF0ZUJhY2tCdXR0b24oKTtcbiAgICB0aGlzLmNyZWF0ZVNlbGVjdERvd25CdXR0b24oKTtcbiAgICB0aGlzLmNyZWF0ZVNlbGVjdFVwQnV0dG9uKCk7XG4gICAgdGhpcy5jcmVhdGVGaW5kR2FtZUJ1dHRvbigpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlTG9nbyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGxvZ28gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnbG9nbycpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGxvZ28sIDUwLCAxMCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIobG9nbyk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVCYWNrQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmJhY2tCdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnYmFja0J1dHRvbicpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYmFja0J1dHRvbiwgNjksIDgwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmJhY2tCdXR0b24pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlU2VsZWN0RG93bkJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5zZWxlY3REb3duQnV0dG9uID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2Rvd25UcmlhbmdsZScpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuc2VsZWN0RG93bkJ1dHRvbiwgMjQsIDg1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnNlbGVjdERvd25CdXR0b24pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlU2VsZWN0VXBCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuc2VsZWN0VXBCdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgndXBUcmlhbmdsZScpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuc2VsZWN0VXBCdXR0b24sIDI0LCAzNSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5zZWxlY3RVcEJ1dHRvbik7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVGaW5kR2FtZUJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5maW5kR2FtZUJ1dHRvbiA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdmaW5kR2FtZScpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuZmluZEdhbWVCdXR0b24sIDY5LCA0OCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5maW5kR2FtZUJ1dHRvbik7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5iYWNrQnV0dG9uLCB0aGlzLnNlbGVjdFVwQnV0dG9uLCB0aGlzLnNlbGVjdERvd25CdXR0b24sIHRoaXMuZmluZEdhbWVCdXR0b25dO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdmF0YXJTZWxlY3Rpb25WaWV3OyIsIkZpbmRHYW1lVmlldy5jb25zdHJ1Y3RvciA9IEZpbmRHYW1lVmlldztcbkZpbmRHYW1lVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gRmluZEdhbWVWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICB2YXIgbGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRklORF9HQU1FO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlRmluZEdhbWVDYXB0aW9uKGxheW91dERhdGEuQ0FQVElPTik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxQXZhdGFyKGF2YXRhcik7XG4gICAgdGhpcy5jcmVhdGVWZXJzdXNUZXh0KGxheW91dERhdGEuVkVSU1VTKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJVbmtub3duQXZhdGFyKCk7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxVGV4dChsYXlvdXREYXRhLlBMQVlFUl8xKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJUZXh0KGxheW91dERhdGEuUExBWUVSXzIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVGaW5kR2FtZUNhcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuZmluZEdhbWVDYXB0aW9uID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmZpbmRHYW1lQ2FwdGlvbiwgNTAsIDE1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmZpbmRHYW1lQ2FwdGlvbik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFBdmF0YXIgPSBmdW5jdGlvbiAoYXZhdGFyKSB7XG4gICAgdGhpcy5wbGF5ZXIxQXZhdGFyID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ3BsYXllcjEnICsgYXZhdGFyKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjFBdmF0YXIsIDI1LCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxQXZhdGFyKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlVmVyc3VzVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHZlcnN1cyA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodmVyc3VzLCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHZlcnN1cyk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJVbmtub3duQXZhdGFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwbGF5ZXIyVW5rbm93bkF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdxdWVzdGlvbk1hcmsnKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIyVW5rbm93bkF2YXRhciwgNzUsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyVW5rbm93bkF2YXRhcik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgcGxheWVyMSA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMSwgMjUsIDc0KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIxKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMlRleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBwbGF5ZXIyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIyLCA3NSwgNzQpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyID0gZnVuY3Rpb24gKGF2YXRhcikge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjJVbmtub3duQXZhdGFyKTtcbiAgICB2YXIgcGxheWVyMkFjdHVhbEF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5ZXIyJyArIGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMkFjdHVhbEF2YXRhciwgNzUsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyQWN0dWFsQXZhdGFyKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlR2FtZUZvdW5kQ2FwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5maW5kR2FtZUNhcHRpb24pO1xuICAgIHZhciBmb3VuZEdhbWVDYXB0aW9uID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkZJTkRfR0FNRS5GT1VORF9HQU1FX0NBUFRJT04pO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGZvdW5kR2FtZUNhcHRpb24sIDUwLCAxNSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoZm91bmRHYW1lQ2FwdGlvbik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmluZEdhbWVWaWV3OyIsIkhlbHBWaWV3LmNvbnN0cnVjdG9yID0gSGVscFZpZXc7XG5IZWxwVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuSGVscFZpZXcucHJvdG90eXBlLkJBQ0tfQlVUVE9OID0gMDtcblxuZnVuY3Rpb24gSGVscFZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuSGVscFZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkhFTFA7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVIZWxwVGV4dChsYXlvdXREYXRhLklORk8pO1xuICAgIHRoaXMuY3JlYXRlQmFja0J1dHRvbigpO1xufTtcblxuSGVscFZpZXcucHJvdG90eXBlLmNyZWF0ZUhlbHBUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgaGVscFRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGhlbHBUZXh0KTtcbn07XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5jcmVhdGVCYWNrQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmJhY2tCdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnYmFja0J1dHRvbicpO1xuICAgIGNvbnNvbGUubG9nKFwiQkFDSyBCVVRUT05cIik7XG4gICAgY29uc29sZS5sb2codGhpcy5zcHJpdGVTdG9yZSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5iYWNrQnV0dG9uLCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYmFja0J1dHRvbik7XG59O1xuXG5IZWxwVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuYmFja0J1dHRvbl07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBWaWV3OyIsIkxvYWRpbmdWaWV3LmNvbnN0cnVjdG9yID0gTG9hZGluZ1ZpZXc7XG5Mb2FkaW5nVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gTG9hZGluZ1ZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuTG9hZGluZ1ZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkxPQURJTkc7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVMb2FkaW5nVGV4dChsYXlvdXREYXRhLkxPQURJTkdfVEVYVCk7XG59O1xuXG5Mb2FkaW5nVmlldy5wcm90b3R5cGUuY3JlYXRlTG9hZGluZ1RleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBsb2FkaW5nVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQobG9hZGluZ1RleHQsIDUwLCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIobG9hZGluZ1RleHQsIGRhdGEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nVmlldzsiLCJNZW51Vmlldy5jb25zdHJ1Y3RvciA9IE1lbnVWaWV3O1xuTWVudVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5QTEFZX0JVVFRPTiA9IDA7XG5NZW51Vmlldy5wcm90b3R5cGUuSEVMUF9CVVRUT04gPSAxO1xuXG5mdW5jdGlvbiBNZW51VmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5NZW51Vmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZUxvZ28oKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgICB0aGlzLmNyZWF0ZUhlbHBCdXR0b24oKTtcbn07XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5jcmVhdGVMb2dvID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2dvID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2xvZ28nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChsb2dvLCA1MCwgMTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGxvZ28pO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXlCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMucGxheUJ1dHRvbiA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5QnV0dG9uJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5QnV0dG9uLCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheUJ1dHRvbik7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlSGVscEJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5oZWxwQnV0dG9uID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2hlbHBCdXR0b24nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmhlbHBCdXR0b24sIDUwLCA4MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5oZWxwQnV0dG9uKTtcbn07XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5wbGF5QnV0dG9uLCB0aGlzLmhlbHBCdXR0b25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51VmlldzsiLCJWaWV3LmNvbnN0cnVjdG9yID0gVmlldztcblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuVmlldy5wcm90b3R5cGUuSU5URVJBQ1RJVkUgPSB0cnVlO1xuVmlldy5wcm90b3R5cGUuQ0VOVEVSX0FOQ0hPUiA9IDAuNTtcblxuZnVuY3Rpb24gVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5WaWV3LnByb3RvdHlwZS5hZGRFbGVtZW50VG9Db250YWluZXIgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgZWxlbWVudC5hbmNob3IueCA9IHRoaXMuQ0VOVEVSX0FOQ0hPUjtcbiAgICBlbGVtZW50LmFuY2hvci55ID0gdGhpcy5DRU5URVJfQU5DSE9SO1xuICAgIGVsZW1lbnQuaW50ZXJhY3RpdmUgPSB0aGlzLklOVEVSQUNUSVZFO1xuICAgIHRoaXMuYWRkQ2hpbGQoZWxlbWVudCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVUZXh0RWxlbWVudCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IFBJWEkuVGV4dChkYXRhLnRleHQsIHtmb250OiBkYXRhLnNpemUgKyBcInB4IFwiICsgZGF0YS5mb250LCBmaWxsOiBkYXRhLmNvbG9yfSk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVTcHJpdGVFbGVtZW50ID0gZnVuY3Rpb24ocGF0aCkge1xuICAgIHJldHVybiBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKHBhdGgpO1xufTtcblxuVmlldy5wcm90b3R5cGUucmVtb3ZlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIHRoaXMuYWRkQ2hpbGQoZWxlbWVudCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5yZW1vdmVBbGxFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcbn07XG5cblZpZXcucHJvdG90eXBlLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCA9IGZ1bmN0aW9uKGVsZW1lbnQsIHdpZHRoUGVyY2VudGFnZSwgaGVpZ2h0UGVyY2VudGFnZSkge1xuICAgIGVsZW1lbnQueCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDEwMCkgKiB3aWR0aFBlcmNlbnRhZ2U7XG4gICAgZWxlbWVudC55ID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDEwMCkgKiBoZWlnaHRQZXJjZW50YWdlOyAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xuXG4iLCJBdmF0YXJWaWV3LmNvbnN0cnVjdG9yID0gQXZhdGFyVmlldztcbkF2YXRhclZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbkF2YXRhclZpZXcucHJvdG90eXBlLkJBQ0tfQlVUVE9OID0gMDtcblxuZnVuY3Rpb24gQXZhdGFyVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5BdmF0YXJWaWV3LnByb3RvdHlwZS5jcmVhdGVBdmF0YXIgPSBmdW5jdGlvbiAoYXZhdGFyKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuYXZhdGFyKTtcbiAgICB0aGlzLmF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5ZXIxJyArIGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5hdmF0YXIsIDI0LCA2MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hdmF0YXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdmF0YXJWaWV3OyIsIkRpY2VWaWV3LmNvbnN0cnVjdG9yID0gRGljZVZpZXc7XG5EaWNlVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gRGljZVZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuRGljZVZpZXcucHJvdG90eXBlLnNldHVwRGljZSA9IGZ1bmN0aW9uKGRpY2VOdW1iZXIpIHtcbiAgICB0aGlzLmNyZWF0ZURpY2VFbGVtZW50KGRpY2VOdW1iZXIpO1xufTtcblxuRGljZVZpZXcucHJvdG90eXBlLmNyZWF0ZURpY2VFbGVtZW50ID0gZnVuY3Rpb24oZGljZU51bWJlcikge1xuICAgIHRoaXMuZGljZUVsZW1lbnQgPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnZGljZUZhY2UnICsgZGljZU51bWJlcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5kaWNlRWxlbWVudCwgNTAsIDQyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmRpY2VFbGVtZW50KTtcbn07XG5cbkRpY2VWaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpY2VWaWV3OyIsIlBsYXllclZpZXcuY29uc3RydWN0b3IgPSBQbGF5ZXJWaWV3O1xuUGxheWVyVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gUGxheWVyVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5zZXRQbGF5ZXJEYXRhID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIHRoaXMucGxheWVyRGF0YSA9IHBsYXllckRhdGE7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5ZXJMYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5QTEFZRVI7XG4gICAgdmFyIGF2YXRhckRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkFWQVRBUjtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFBdmF0YXIodGhpcy5wbGF5ZXJEYXRhLnBsYXllcjFBdmF0YXIpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMUhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX0hFQUxUSCk7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIyQXZhdGFyKHRoaXMucGxheWVyRGF0YS5wbGF5ZXIyQXZhdGFyKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMl9IRUFMVEgpO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlUGxheWVyMVRleHQocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9URVhUKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJUZXh0KHBsYXllckxheW91dERhdGEuUExBWUVSXzJfVEVYVCk7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVMb2dvKCk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVMb2dvID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2dvID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2xvZ28nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChsb2dvLCA1MCwgMTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGxvZ28pO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMUF2YXRhciA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHRoaXMucGxheWVyMUF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5ZXIxJyArIGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIxQXZhdGFyLCAyNSwgMzYpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMUF2YXRhcik7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyQXZhdGFyID0gZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgdGhpcy5wbGF5ZXIyQXZhdGFyID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ3BsYXllcjInICsgYXZhdGFyKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjJBdmF0YXIsIDc1LCAzNik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIyQXZhdGFyKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFIZWFsdGggPSBmdW5jdGlvbihoZWFsdGhEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoaGVhbHRoRGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCwgMjUsIDU2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFIZWFsdGhUZXh0LCBoZWFsdGhEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJIZWFsdGggPSBmdW5jdGlvbihoZWFsdGhEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIySGVhbHRoVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoaGVhbHRoRGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIySGVhbHRoVGV4dCwgNzUsIDU2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJIZWFsdGhUZXh0LCBoZWFsdGhEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFUZXh0ID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIHRoaXMucGxheWVyMVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHBsYXllckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMVRleHQsIDI1LCA1Myk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxVGV4dCwgcGxheWVyRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyVGV4dCA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllcjJUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjJUZXh0LCA3NSwgNTMpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMlRleHQsIHBsYXllckRhdGEpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMUhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIxSGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8xX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjFIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIxSGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMkhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIySGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8yX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjJIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIySGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuZmxhc2hQbGF5ZXIxSGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoKSB7XG4gICAgdmFyIHBsYXllckxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUjtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyMkhlYWx0aEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXJlbW92ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjFIZWFsdGhUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyMUhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX0hFQUxUSCk7XG4gICAgICAgICAgICB0aGlzLnNldFBsYXllcjFIZWFsdGgoaGVhbHRoKTtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVkID0gIXJlbW92ZWQ7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDApO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuZmxhc2hQbGF5ZXIySGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoKSB7XG4gICAgdmFyIHBsYXllckxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUjtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyMUhlYWx0aEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXJlbW92ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjJIZWFsdGhUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyMkhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX0hFQUxUSCk7XG4gICAgICAgICAgICB0aGlzLnNldFBsYXllcjJIZWFsdGgoaGVhbHRoKTtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVkID0gIXJlbW92ZWQ7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDApO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY2xlYXJJbnRlcnZhbHMgPSBmdW5jdGlvbigpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMucGxheWVyMUhlYWx0aEludGVydmFsSWQpO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5wbGF5ZXIySGVhbHRoSW50ZXJ2YWxJZCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclZpZXc7IiwiUXVlc3Rpb25WaWV3LmNvbnN0cnVjdG9yID0gUXVlc3Rpb25WaWV3O1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLlJJR0hUX0FOU1dFUiA9IDA7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLldST05HX0FOU1dFUl8xID0gMTtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuV1JPTkdfQU5TV0VSXzIgPSAyO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5XUk9OR19BTlNXRVJfMyA9IDM7XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSX1BSRUZJWCA9IFwiQU5TV0VSX1wiO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5BTlNXRVJFRF9QUkVGSVggPSBcIkFOU1dFUkVEX1wiO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5BTlNXRVJFRF9TVUZGSVggPSBcIl9BTlNXRVJFRFwiO1xuXG5mdW5jdGlvbiBRdWVzdGlvblZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5kaXNwbGF5Q2F0ZWdvcnlBbmRRdWVzdGlvbiA9IGZ1bmN0aW9uKGNhdGVnb3J5LCBxdWVzdGlvbikge1xuICAgIHZhciBxdWVzdGlvbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OO1xuICAgIHZhciBhbnN3ZXJUZXh0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT04uQU5TV0VSO1xuICAgIHRoaXMuY3JlYXRlQ2F0ZWdvcnlFbGVtZW50KGNhdGVnb3J5LCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLkNBVEVHT1JZKTtcbiAgICB0aGlzLmNyZWF0ZVF1ZXN0aW9uRWxlbWVudChxdWVzdGlvbi50ZXh0LCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLlFVRVNUSU9OX1BPU0lUSU9OKTtcbiAgICB0aGlzLmNyZWF0ZUFuc3dlckVsZW1lbnQxKHF1ZXN0aW9uLnJpZ2h0X2Fuc3dlciwgYW5zd2VyVGV4dERhdGEpO1xuICAgIHRoaXMuY3JlYXRlQW5zd2VyRWxlbWVudDIocXVlc3Rpb24ud3JvbmdfYW5zd2VyXzEsIGFuc3dlclRleHREYXRhKTtcbiAgICB0aGlzLmNyZWF0ZUFuc3dlckVsZW1lbnQzKHF1ZXN0aW9uLndyb25nX2Fuc3dlcl8yLCBhbnN3ZXJUZXh0RGF0YSk7XG4gICAgdGhpcy5jcmVhdGVBbnN3ZXJFbGVtZW50NChxdWVzdGlvbi53cm9uZ19hbnN3ZXJfMywgYW5zd2VyVGV4dERhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5nZXRBbnN3ZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKGluZGljZSkge1xuICAgIGlmKGluZGljZSA9PT0gMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiAzMyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDgxXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmKGluZGljZSA9PT0gMikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiA2NyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDgxXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGlmKGluZGljZSA9PT0gMykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiAzMyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDg5XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGlmKGluZGljZSA9PT0gNCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiA2NyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDg5XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRBbnN3ZXJJbmRpY2VzID0gZnVuY3Rpb24oYW5zd2VySW5kaWNlcykge1xuICAgIHRoaXMuYW5zd2VySW5kaWNlcyA9IGFuc3dlckluZGljZXM7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUNhdGVnb3J5RWxlbWVudCA9IGZ1bmN0aW9uKGNhdGVnb3J5LCBjYXRlZ29yeURhdGEpIHtcbiAgICBjYXRlZ29yeURhdGEudGV4dCA9IGNhdGVnb3J5O1xuICAgIHRoaXMuY2F0ZWdvcnlFbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChjYXRlZ29yeURhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuY2F0ZWdvcnlFbGVtZW50LCA1MCwgNjkpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuY2F0ZWdvcnlFbGVtZW50LCBjYXRlZ29yeURhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVRdWVzdGlvbkVsZW1lbnQgPSBmdW5jdGlvbihxdWVzdGlvbiwgcXVlc3Rpb25EYXRhKSB7XG4gICAgcXVlc3Rpb25EYXRhLnRleHQgPSBxdWVzdGlvbjtcbiAgICB0aGlzLnF1ZXN0aW9uRWxlbWVudCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQocXVlc3Rpb25EYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnF1ZXN0aW9uRWxlbWVudCwgNTAsIDc0KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnF1ZXN0aW9uRWxlbWVudCwgcXVlc3Rpb25EYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQW5zd2VyRWxlbWVudDEgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50MSA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdmFyIGFuc3dlclBvc2l0aW9uID0gdGhpcy5nZXRBbnN3ZXJQb3NpdGlvbih0aGlzLmFuc3dlckluZGljZXNbMF0pO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDEsIGFuc3dlclBvc2l0aW9uLndpZHRoUGVyY2VudGFnZSwgYW5zd2VyUG9zaXRpb24uaGVpZ2h0UGVyY2VudGFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50MSwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUFuc3dlckVsZW1lbnQyID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDIgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHZhciBhbnN3ZXJQb3NpdGlvbiA9IHRoaXMuZ2V0QW5zd2VyUG9zaXRpb24odGhpcy5hbnN3ZXJJbmRpY2VzWzFdKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmFuc3dlckVsZW1lbnQyLCBhbnN3ZXJQb3NpdGlvbi53aWR0aFBlcmNlbnRhZ2UsIGFuc3dlclBvc2l0aW9uLmhlaWdodFBlcmNlbnRhZ2UpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYW5zd2VyRWxlbWVudDIsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVBbnN3ZXJFbGVtZW50MyA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQzID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB2YXIgYW5zd2VyUG9zaXRpb24gPSB0aGlzLmdldEFuc3dlclBvc2l0aW9uKHRoaXMuYW5zd2VySW5kaWNlc1syXSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5hbnN3ZXJFbGVtZW50MywgYW5zd2VyUG9zaXRpb24ud2lkdGhQZXJjZW50YWdlLCBhbnN3ZXJQb3NpdGlvbi5oZWlnaHRQZXJjZW50YWdlKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmFuc3dlckVsZW1lbnQzLCBhbnN3ZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQW5zd2VyRWxlbWVudDQgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50NCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdmFyIGFuc3dlclBvc2l0aW9uID0gdGhpcy5nZXRBbnN3ZXJQb3NpdGlvbih0aGlzLmFuc3dlckluZGljZXNbM10pO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDQsIGFuc3dlclBvc2l0aW9uLndpZHRoUGVyY2VudGFnZSwgYW5zd2VyUG9zaXRpb24uaGVpZ2h0UGVyY2VudGFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50NCwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnNldEFuc3dlclRvQ29sb3VyID0gZnVuY3Rpb24oYW5zd2VyRWxlbWVudCwgYW5zd2VyKSB7XG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT047XG4gICAgdmFyIGNvbG91cnMgPSB7fTtcbiAgICBmb3IodmFyIGkgPSAyOyBpIDw9IDQ7IGkrKykge1xuICAgICAgICBjb2xvdXJzW3RoaXMuQU5TV0VSRURfUFJFRklYICsgaV0gPSBxdWVzdGlvbkRhdGEuV1JPTkdfQU5TV0VSX0NPTE9VUjtcbiAgICB9XG4gICAgY29sb3Vycy5BTlNXRVJFRF8xID0gcXVlc3Rpb25EYXRhLlJJR0hUX0FOU1dFUl9DT0xPVVI7XG4gICAgdmFyIGFuc3dlckNvbG91ciA9IGNvbG91cnNbYW5zd2VyXTtcbiAgICBhbnN3ZXJFbGVtZW50LnNldFN0eWxlKHtmb250OiBhbnN3ZXJFbGVtZW50LnN0eWxlLmZvbnQsIGZpbGw6IGFuc3dlckNvbG91cn0pO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRXaG9BbnN3ZXJlZFF1ZXN0aW9uID0gZnVuY3Rpb24oYW5zd2VyRWxlbWVudCwgYW5zd2VyLCBwbGF5ZXIpIHtcbiAgICB2YXIgcXVlc3Rpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTjtcbiAgICBjb25zb2xlLmxvZyhcIkFuc3dlcjpcIik7XG4gICAgY29uc29sZS5sb2coYW5zd2VyKTtcbiAgICB2YXIgYW5zd2VyT25TY3JlZW4gPSAoYW5zd2VyLnNsaWNlKC0xKSAtIDEpO1xuICAgIHRoaXMucGxheWVyV2hvQW5zd2VyZWRFbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChxdWVzdGlvbkRhdGFbcGxheWVyICsgdGhpcy5BTlNXRVJFRF9TVUZGSVhdKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcldob0Fuc3dlcmVkRWxlbWVudCwgcXVlc3Rpb25EYXRhW3RoaXMuQU5TV0VSRURfUFJFRklYICsgdGhpcy5hbnN3ZXJJbmRpY2VzWyhhbnN3ZXJPblNjcmVlbildXS53aWR0aFBlcmNlbnRhZ2UsIHF1ZXN0aW9uRGF0YVt0aGlzLkFOU1dFUkVEX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1soYW5zd2VyT25TY3JlZW4pXV0uaGVpZ2h0UGVyY2VudGFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXJXaG9BbnN3ZXJlZEVsZW1lbnQsIHF1ZXN0aW9uRGF0YVt0aGlzLkFOU1dFUkVEX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1thbnN3ZXJPblNjcmVlbl1dKTsgXG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnVwZGF0ZVF1ZXN0aW9uVGltZXIgPSBmdW5jdGlvbih0aW1lUmVtYWluaW5nKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMudGltZXIpO1xuICAgIHZhciB0aW1lckRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLlRJTUVSO1xuICAgIHRpbWVyRGF0YS50ZXh0ID0gdGltZVJlbWFpbmluZztcbiAgICB0aGlzLnRpbWVyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudCh0aW1lckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMudGltZXIsIDk3LCAzKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnRpbWVyLCB0aW1lckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS50dXJuT2ZmSW50ZXJhY3Rpdml0eUZvckFuc3dlckVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50MS5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDIuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQzLmludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50NC5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5hbnN3ZXJFbGVtZW50MSwgdGhpcy5hbnN3ZXJFbGVtZW50MiwgdGhpcy5hbnN3ZXJFbGVtZW50MywgdGhpcy5hbnN3ZXJFbGVtZW50NF07XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25WaWV3OyIsIldpblZpZXcuY29uc3RydWN0b3IgPSBXaW5WaWV3O1xuV2luVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuV2luVmlldy5wcm90b3R5cGUuUExBWV9BR0FJTl9CVVRUT04gPSAwO1xuXG5mdW5jdGlvbiBXaW5WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5zZXR1cFZpZXdFbGVtZW50cygpO1xufVxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlV2lubmVyVGV4dCA9IGZ1bmN0aW9uKHBsYXllcldob1dvbiwgc3RhdERhdGEpIHtcbiAgICB2YXIgd2luRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuV0lOO1xuICAgIHRoaXMuY3JlYXRlV2luVGV4dCh3aW5EYXRhW3BsYXllcldob1dvbiArIFwiX1dJTlNcIl0sIHdpbkRhdGEuV0lOX1RFWFRfUE9TSVRJT04pO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyU3RhdHNUZXh0KHdpbkRhdGEsIHN0YXREYXRhKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24ocGxheWVyV2hvV29uKSB7XG4gICAgdmFyIHdpbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLldJTjtcbiAgICB0aGlzLmNyZWF0ZVBsYXlBZ2FpbkJ1dHRvbih3aW5EYXRhLlBMQVlfQUdBSU4pO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlV2luVGV4dCA9IGZ1bmN0aW9uIChkYXRhLCBwb3NpdGlvbkRhdGEpIHtcbiAgICB0aGlzLndpblRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMud2luVGV4dCwgNTAsIDY2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLndpblRleHQsIHBvc2l0aW9uRGF0YSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXJTdGF0c1RleHQgPSBmdW5jdGlvbihsYXlvdXREYXRhLCBzdGF0RGF0YSkge1xuICAgIHZhciBjb3JyZWN0UDFBbnN3ZXJQZXJjZW50YWdlRGVmYXVsdFRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0O1xuICAgIGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ICsgc3RhdERhdGEucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlO1xuICAgIHRoaXMucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgMjUsIDcyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ID0gY29ycmVjdFAxQW5zd2VyUGVyY2VudGFnZURlZmF1bHRUZXh0O1xuICAgIFxuICAgIHZhciBjb3JyZWN0UDJBbnN3ZXJQZXJjZW50YWdlRGVmYXVsdFRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0O1xuICAgIGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ICsgc3RhdERhdGEucGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlO1xuICAgIHRoaXMucGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgNzUsIDcyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ID0gY29ycmVjdFAyQW5zd2VyUGVyY2VudGFnZURlZmF1bHRUZXh0O1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheUFnYWluQnV0dG9uID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucGxheUFnYWluQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9wbGF5LWFnYWluLnBuZycpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheUFnYWluQnV0dG9uLCA1MCwgODApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheUFnYWluQnV0dG9uKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLnBsYXlBZ2FpbkJ1dHRvbl07XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIxQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0KTtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIyQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0KTtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy53aW5UZXh0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luVmlldzsiXX0=
