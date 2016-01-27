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
    var player1Avatar = this.spriteStore.get(avatar);
    this.setElementPositionInPercent(player1Avatar, 25, 50);
    this.addElementToContainer(player1Avatar);
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
    var player2ActualAvatar = this.spriteStore.get(avatar);
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
    this.avatar = this.spriteStore.get(avatar);
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
    this.diceElement = this.createSpriteElement(Display.resourcePath + '/dice/dice-face-' + diceNumber + '.png');
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
    var logo = this.createSpriteElement(Display.resourcePath + '/logo.jpg');
    this.setElementPositionInPercent(logo, 50, 10);
    this.addElementToContainer(logo);
};

PlayerView.prototype.createPlayer1Avatar = function(avatar) {
    this.player1Avatar = this.createSpriteElement(Display.resourcePath + '/avatar/' + avatar);
    this.setElementPositionInPercent(this.player1Avatar, 25, 36);
    this.addElementToContainer(this.player1Avatar);
};

PlayerView.prototype.createPlayer2Avatar = function(avatar) {
    this.player2Avatar = this.createSpriteElement(Display.resourcePath + '/avatar/' + avatar);
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
    console.log("Intervals cleared.");
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
    layoutData.PLAYER_1_CORRECT_PERCENTAGE.text = layoutData.PLAYER_1_CORRECT_PERCENTAGE.text + statData.player1CorrectAnswerPercentage;
    this.player1CorrectAnswerPercentageText = this.createTextElement(layoutData.PLAYER_1_CORRECT_PERCENTAGE);
    this.setElementPositionInPercent(this.player1CorrectAnswerPercentageText, 25, 72);
    this.addElementToContainer(this.player1CorrectAnswerPercentageText, layoutData.PLAYER_1_CORRECT_PERCENTAGE);
    
    layoutData.PLAYER_2_CORRECT_PERCENTAGE.text = layoutData.PLAYER_2_CORRECT_PERCENTAGE.text + statData.player2CorrectAnswerPercentage;
    this.player2CorrectAnswerPercentageText = this.createTextElement(layoutData.PLAYER_2_CORRECT_PERCENTAGE);
    this.setElementPositionInPercent(this.player2CorrectAnswerPercentageText, 75, 72);
    this.addElementToContainer(this.player2CorrectAnswerPercentageText, layoutData.PLAYER_2_CORRECT_PERCENTAGE);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi5qcyIsInNyYy9Tb3VuZE1hbmFnZXIuanMiLCJzcmMvY29uc3RhbnQvU29ja2V0Q29uc3RhbnRzLmpzIiwic3JjL2NvbnRyb2xsZXIvQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0NvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9GaW5kR2FtZUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9HYW1lQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0hlbHBDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvTWVudUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9UdXJuQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvRGljZUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9zdWJjb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9zdWJjb250cm9sbGVyL1F1ZXN0aW9uQ29udHJvbGxlci5qcyIsInNyYy9sb2FkZXIvQnVja2V0TG9hZGVyLmpzIiwic3JjL2xvYWRlci9JbWFnZUxvYWRlci5qcyIsInNyYy9sb2FkZXIvSnNvbkxvYWRlci5qcyIsInNyYy9sb2FkZXIvVmlld0xvYWRlci5qcyIsInNyYy9zdG9yZS9Db250cm9sbGVyU3RvcmUuanMiLCJzcmMvc3RvcmUvU3ByaXRlU3RvcmUuanMiLCJzcmMvdXRpbC9EaXNwbGF5LmpzIiwic3JjL3ZpZXcvQXZhdGFyU2VsZWN0aW9uVmlldy5qcyIsInNyYy92aWV3L0ZpbmRHYW1lVmlldy5qcyIsInNyYy92aWV3L0hlbHBWaWV3LmpzIiwic3JjL3ZpZXcvTG9hZGluZ1ZpZXcuanMiLCJzcmMvdmlldy9NZW51Vmlldy5qcyIsInNyYy92aWV3L1ZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L0F2YXRhclZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L0RpY2VWaWV3LmpzIiwic3JjL3ZpZXcvc3Vidmlldy9QbGF5ZXJWaWV3LmpzIiwic3JjL3ZpZXcvc3Vidmlldy9RdWVzdGlvblZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1dpblZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRGlzcGxheSA9IHJlcXVpcmUoJy4vdXRpbC9EaXNwbGF5Jyk7XG5Tb2NrZXRDb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50L1NvY2tldENvbnN0YW50cycpO1xuVmlldyA9IHJlcXVpcmUoJy4vdmlldy9WaWV3Jyk7XG5Mb2FkaW5nVmlldyA9IHJlcXVpcmUoJy4vdmlldy9Mb2FkaW5nVmlldycpO1xuQnVja2V0TG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvQnVja2V0TG9hZGVyJyk7XG5Kc29uTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvSnNvbkxvYWRlcicpO1xuSW1hZ2VMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9JbWFnZUxvYWRlcicpO1xuVmlld0xvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL1ZpZXdMb2FkZXInKTtcbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvQ29udHJvbGxlcicpO1xuSGVscFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvSGVscFZpZXcnKTtcbkhlbHBDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0hlbHBDb250cm9sbGVyJyk7XG5NZW51VmlldyA9IHJlcXVpcmUoJy4vdmlldy9NZW51VmlldycpO1xuTWVudUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvTWVudUNvbnRyb2xsZXInKTtcbkF2YXRhclNlbGVjdGlvblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvQXZhdGFyU2VsZWN0aW9uVmlldycpO1xuQXZhdGFyVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L0F2YXRhclZpZXcnKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcicpO1xuRmluZEdhbWVWaWV3ID0gcmVxdWlyZSgnLi92aWV3L0ZpbmRHYW1lVmlldycpO1xuRmluZEdhbWVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0ZpbmRHYW1lQ29udHJvbGxlcicpO1xuU291bmRNYW5hZ2VyID0gcmVxdWlyZSgnLi9Tb3VuZE1hbmFnZXInKTtcbkdhbWVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0dhbWVDb250cm9sbGVyJyk7XG5EaWNlVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L0RpY2VWaWV3Jyk7XG5EaWNlQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9zdWJjb250cm9sbGVyL0RpY2VDb250cm9sbGVyJyk7XG5RdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9RdWVzdGlvblZpZXcnKTtcblF1ZXN0aW9uQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9zdWJjb250cm9sbGVyL1F1ZXN0aW9uQ29udHJvbGxlcicpO1xuUGxheWVyVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L1BsYXllclZpZXcnKTtcblBsYXllckNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9QbGF5ZXJDb250cm9sbGVyJyk7XG5XaW5WaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvV2luVmlldycpO1xuVHVybkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvVHVybkNvbnRyb2xsZXInKTtcbkNvbnRyb2xsZXJTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmUvQ29udHJvbGxlclN0b3JlJyk7XG5TcHJpdGVTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmUvU3ByaXRlU3RvcmUnKTtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIHZhciBERUZBVUxUX1dJRFRIID0gNDgwO1xuICAgIHZhciBERUZBVUxUX0hFSUdIVCA9IDMyMDtcbiAgICB2YXIgUkVOREVSRVJfQkFDS0dST1VORF9DT0xPVVIgPSAweDAwMDAwMDtcbiAgICB2YXIgRElWX0lEID0gXCJnYW1lXCI7XG4gICAgXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYXRlZCBidWNrZXQgbG9hZGVyLlwiKTtcbiAgICAgICAgbmV3IEJ1Y2tldExvYWRlcihsb2FkTGF5b3V0LCBidWNrZXRMb2FkaW5nRmFpbGVkTWVzc2FnZSk7XG4gICAgfSkoKTtcbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkTGF5b3V0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbGF5b3V0XCIpO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS8nICsgRGlzcGxheS5idWNrZXQud2lkdGggKyAneCcgKyBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQgKyAnL2xheW91dC5qc29uJywgc2V0TGF5b3V0RGF0YUluUElYSSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldExheW91dERhdGFJblBJWEkobGF5b3V0RGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNldHRpbmcgbGF5b3V0LlwiKTtcbiAgICAgICAgUElYSS5Db250YWluZXIubGF5b3V0RGF0YSA9IGxheW91dERhdGE7XG4gICAgICAgIHZhciBzcHJpdGVTdG9yZSA9IG5ldyBTcHJpdGVTdG9yZSgpO1xuICAgICAgICBWaWV3LnByb3RvdHlwZS5zcHJpdGVTdG9yZSA9IHNwcml0ZVN0b3JlO1xuICAgICAgICBzdGFydFJlbmRlcmluZygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzdGFydFJlbmRlcmluZygpIHtcbiAgICAgICAgdmFyIHJlbmRlcmVyT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGFudGlhbGlhc2luZzpmYWxzZSxcbiAgICAgICAgICAgIHJlc29sdXRpb246MSxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjpSRU5ERVJFUl9CQUNLR1JPVU5EX0NPTE9VUlxuICAgICAgICB9O1xuICAgICAgICB2YXIgdmlld0xvYWRlciA9IG5ldyBWaWV3TG9hZGVyKCk7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgICAgICAgY29udGFpbmVyLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdmFyIHJlbmRlcmVyID0gbmV3IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpbmRvdy5pbm5lcldpZHRoICogRGlzcGxheS5zY2FsZSwgd2luZG93LmlubmVySGVpZ2h0ICogRGlzcGxheS5zY2FsZSwgcmVuZGVyZXJPcHRpb25zKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXNvdXJjZSBwYXRoOiBcIiArIERpc3BsYXkucmVzb3VyY2VQYXRoKTtcbiAgICAgICAgcmVuZGVyZXIucm91bmRQaXhlbHMgPSB0cnVlO1xuICAgICAgICBzZXREZXBlbmRlbmNpZXModmlld0xvYWRlciwgY29udGFpbmVyLCByZW5kZXJlcik7XG4gICAgICAgIGFwcGVuZEdhbWVUb0RPTShyZW5kZXJlcik7XG4gICAgICAgIGJlZ2luQW5pbWF0aW9uKHZpZXdMb2FkZXIpO1xuICAgICAgICBhZGRMb2FkaW5nVmlld1RvU2NyZWVuKHZpZXdMb2FkZXIpO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS9xdWVzdGlvbnMuanNvbicsIHNldFF1ZXN0aW9uRGF0YUluUXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0UXVlc3Rpb25EYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIocXVlc3Rpb25EYXRhKSB7XG4gICAgICAgIFF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUucXVlc3Rpb25EYXRhID0gcXVlc3Rpb25EYXRhO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS9jYXRlZ29yaWVzLmpzb24nLCBzZXRDYXRlZ29yeURhdGFJblF1ZXN0aW9uQ29udHJvbGxlcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldENhdGVnb3J5RGF0YUluUXVlc3Rpb25Db250cm9sbGVyKGNhdGVnb3J5RGF0YSkge1xuICAgICAgICBRdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNhdGVnb3J5RGF0YSA9IGNhdGVnb3J5RGF0YTtcbiAgICAgICAgbG9hZEltYWdlcygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc3BsYXkgcmVzb3VyY2UgcGF0aDogXCIgKyBEaXNwbGF5LnJlc291cmNlUGF0aCk7XG4gICAgICAgIG5ldyBJbWFnZUxvYWRlcihEaXNwbGF5LnJlc291cmNlUGF0aCArICcvaW1hZ2VzLmpzb24nLCBiZWdpbkdhbWUpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBhcHBlbmRHYW1lVG9ET00ocmVuZGVyZXIpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRElWX0lEKS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0RGVwZW5kZW5jaWVzKHZpZXdMb2FkZXIsIGNvbnRhaW5lciwgcmVuZGVyZXIpIHtcbiAgICAgICAgdmlld0xvYWRlci5zZXRDb250YWluZXIoY29udGFpbmVyKTtcbiAgICAgICAgdmlld0xvYWRlci5zZXRSZW5kZXJlcihyZW5kZXJlcik7XG4gICAgICAgIENvbnRyb2xsZXIuc2V0Vmlld0xvYWRlcih2aWV3TG9hZGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYmVnaW5BbmltYXRpb24odmlld0xvYWRlcikge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodmlld0xvYWRlci5hbmltYXRlKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYmVnaW5HYW1lKCkge1xuICAgICAgICB2YXIgbWVudUNvbnRyb2xsZXIgPSBDb250cm9sbGVyU3RvcmUubWVudUNvbnRyb2xsZXI7XG4gICAgICAgIG1lbnVDb250cm9sbGVyLmxvYWRWaWV3KCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFkZExvYWRpbmdWaWV3VG9TY3JlZW4odmlld0xvYWRlcikge1xuICAgICAgICB2YXIgbG9hZGluZ1ZpZXcgPSBuZXcgTG9hZGluZ1ZpZXcoKTtcbiAgICAgICAgbG9hZGluZ1ZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICAgICAgdmlld0xvYWRlci5sb2FkVmlldyhsb2FkaW5nVmlldyk7XG4gICAgfVxuICAgICAgICBcbiAgICBmdW5jdGlvbiBidWNrZXRMb2FkaW5nRmFpbGVkTWVzc2FnZSgpIHtcbiAgICAgICAgRGlzcGxheS5idWNrZXQuaGVpZ2h0ID0gREVGQVVMVF9IRUlHSFQ7XG4gICAgICAgIERpc3BsYXkuYnVja2V0LndpZHRoID0gREVGQVVMVF9XSURUSDtcbiAgICAgICAgRGlzcGxheS5zY2FsZSA9IDE7XG4gICAgICAgIERpc3BsYXkucmVzb3VyY2VQYXRoID0gREVGQVVMVF9XSURUSCArICd4JyArIERFRkFVTFRfSEVJR0hUO1xuICAgIH1cbn07IiwiZnVuY3Rpb24gU291bmRNYW5hZ2VyKCkge1xuICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jb3JyZWN0QW5zd2VyU291bmQgPSBuZXcgSG93bCh7dXJsczogW1wicmVzb3VyY2Uvc291bmQvY29ycmVjdC1hbnN3ZXIubXAzXCJdfSk7XG4gICAgICAgIHRoaXMud3JvbmdBbnN3ZXJTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC93cm9uZy1hbnN3ZXIubXAzXCJdfSk7XG4gICAgICAgIHRoaXMucm9sbERpY2VTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC9yb2xsLWRpY2UubXAzXCJdfSk7XG4gICAgICAgIHRoaXMudGlja1NvdW5kID0gbmV3IEhvd2woe3VybHM6IFtcInJlc291cmNlL3NvdW5kL3RpY2subXAzXCJdfSk7XG4gICAgfS5iaW5kKHRoaXMpKSgpO1xuICAgIFxuICAgIHRoaXMucGxheUNvcnJlY3RBbnN3ZXJTb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvcnJlY3RBbnN3ZXJTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlXcm9uZ0Fuc3dlclNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMud3JvbmdBbnN3ZXJTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlSb2xsRGljZVNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucm9sbERpY2VTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlUaWNrU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50aWNrU291bmQucGxheSgpO1xuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmRNYW5hZ2VyOyIsInZhciBTb2NrZXRDb25zdGFudHMgPSB7XG4gICAgJ29uJyA6IHtcbiAgICAgICAgJ1BMQVlFUlNfSEVBTFRIJyA6ICdwbGF5ZXJzLWhlYWx0aCcsXG4gICAgICAgICdESUNFX05VTUJFUicgOiAnZGljZS1udW1iZXInLFxuICAgICAgICAnUkFORE9NX1FVRVNUSU9OJyA6ICdyYW5kb20tcXVlc3Rpb24nLFxuICAgICAgICAnSU5JVF9ORVdfVFVSTicgOiAnaW5pdC1uZXctdHVybicsXG4gICAgICAgICdEQU1BR0VfREVBTFQnIDogJ2RhbWFnZS1kZWFsdCcsXG4gICAgICAgICdTSFVGRkxFRF9BTlNXRVJfSU5ESUNFUycgOiAnc2h1ZmZsZWQtYW5zd2VyLWluZGljZXMnLFxuICAgICAgICAnR0FNRV9GT1VORCcgOiAnZ2FtZS1mb3VuZCcsXG4gICAgICAgICdHQU1FX1NUQVRTJyA6ICdnYW1lLXN0YXRzJ1xuICAgIH0sXG4gICAgXG4gICAgJ2VtaXQnIDoge1xuICAgICAgICAnQ09OTkVDVElPTicgOiAnY29ubmVjdGlvbicsXG4gICAgICAgICdGSU5ESU5HX0dBTUUnIDogJ2ZpbmRpbmctZ2FtZScsXG4gICAgICAgICdHRVRfUExBWUVSU19IRUFMVEgnIDogJ2dldC1wbGF5ZXJzLWhlYWx0aCcsXG4gICAgICAgICdESVNDT05ORUNUJyA6ICdkaXNjb25uZWN0JyxcbiAgICAgICAgJ1JPTExfRElDRScgOiAncm9sbC1kaWNlJyxcbiAgICAgICAgJ0dFVF9SQU5ET01fUVVFU1RJT04nIDogJ2dldC1yYW5kb20tcXVlc3Rpb24nLFxuICAgICAgICAnTkVXX1RVUk4nIDogJ25ldy10dXJuJyxcbiAgICAgICAgJ0RFQUxfREFNQUdFJyA6ICdkZWFsLWRhbWFnZScsXG4gICAgICAgICdTSFVGRkxFX0FOU1dFUl9JTkRJQ0VTJyA6ICdzaHVmZmxlLWFuc3dlci1pbmRpY2VzJyxcbiAgICAgICAgJ0dBTUVfRU5ERUQnIDogJ2dhbWUtZW5kZWQnXG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb2NrZXRDb25zdGFudHM7IiwiQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBBdmF0YXJTZWxlY3Rpb25WaWV3KCk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZWxlY3RlZEF2YXRhclZpZXcgPSBuZXcgQXZhdGFyVmlldygpO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuYXZhdGFycyA9IFsnZW1vamlBbmdlbCcsICdlbW9qaUJpZ1NtaWxlJywgJ2Vtb2ppQ29vbCcsICdlbW9qaUdyaW4nLCAnZW1vamlIYXBweScsICdlbW9qaUtpc3MnLCAnZW1vamlMYXVnaGluZycsICdlbW9qaUxvdmUnLCAnZW1vamlNb25rZXknLCAnZW1vamlQb28nLCAnZW1vamlTY3JlYW0nLCAnZW1vamlTbGVlcCcsICdlbW9qaVNtaWxlJywgJ2Vtb2ppU2xlZXAnLCAnZW1vamlXaW5rJ107XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5jdXJyZW50QXZhdGFySW5kZXggPSAwO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuYW1JU2V0ID0gXCJOb1wiO1xuXG5mdW5jdGlvbiBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbn1cblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNsZWFuVmlldygpO1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3LmNyZWF0ZUF2YXRhcih0aGlzLmF2YXRhcnNbdGhpcy5jdXJyZW50QXZhdGFySW5kZXhdKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICBjb25zb2xlLmxvZyhcIlZpZXcgbG9hZGVkXCIpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgYmFja0J1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuQkFDS19CVVRUT05dO1xuICAgIHZhciBzZWxlY3RVcCA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuU0VMRUNUX1VQXTtcbiAgICB2YXIgc2VsZWN0RG93biA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuU0VMRUNUX0RPV05dO1xuICAgIHZhciBmaW5kR2FtZSA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuRklORF9HQU1FXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYmFja0J1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZW51Q29udHJvbGxlciA9IENvbnRyb2xsZXJTdG9yZS5tZW51Q29udHJvbGxlcjtcbiAgICAgICAgbWVudUNvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoc2VsZWN0VXAsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgVVAgPSAxO1xuICAgICAgICB0aGlzLnNldHVwTmV4dEF2YXRhcihVUCk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3KTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihzZWxlY3REb3duLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIERPV04gPSAtMTtcbiAgICAgICAgdGhpcy5zZXR1cE5leHRBdmF0YXIoRE9XTik7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3KTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihmaW5kR2FtZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdmF0YXIgPSB0aGlzLmF2YXRhcnNbdGhpcy5jdXJyZW50QXZhdGFySW5kZXhdO1xuICAgICAgICB2YXIgZmluZEdhbWVDb250cm9sbGVyID0gQ29udHJvbGxlclN0b3JlLmZpbmRHYW1lQ29udHJvbGxlcjtcbiAgICAgICAgZmluZEdhbWVDb250cm9sbGVyLmxvYWRWaWV3KGF2YXRhcik7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTmV4dEF2YXRhciA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuICAgIGlmKHRoaXMuY3VycmVudEF2YXRhckluZGV4ID49ICh0aGlzLmF2YXRhcnMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXZhdGFySW5kZXggPSAwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50QXZhdGFySW5kZXggKyBkaXJlY3Rpb24gPCAwKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEF2YXRhckluZGV4ID0gKHRoaXMuYXZhdGFycy5sZW5ndGggLSAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCA9IHRoaXMuY3VycmVudEF2YXRhckluZGV4ICsgZGlyZWN0aW9uO1xuICAgIH1cbiAgIFxuICAgIHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3LmNyZWF0ZUF2YXRhcih0aGlzLmF2YXRhcnNbdGhpcy5jdXJyZW50QXZhdGFySW5kZXhdKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyOyIsImZ1bmN0aW9uIENvbnRyb2xsZXIoKSB7fVxuXG5Db250cm9sbGVyLnNldFZpZXdMb2FkZXIgPSBmdW5jdGlvbih2aWV3TG9hZGVyKSB7XG4gICAgQ29udHJvbGxlci5wcm90b3R5cGUudmlld0xvYWRlciA9IHZpZXdMb2FkZXI7XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5zb2NrZXQgPSBpbygpO1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZWdpc3Rlckxpc3RlbmVyID0gZnVuY3Rpb24odmlld0VsZW1lbnQsIGFjdGlvbikge1xuICAgIHZpZXdFbGVtZW50LnRvdWNoZW5kID0gdmlld0VsZW1lbnQuY2xpY2sgPSBhY3Rpb247XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZWdpc3Rlck11bHRpcGxlTGlzdGVuZXJzID0gZnVuY3Rpb24odmlld0VsZW1lbnRzLCBhY3Rpb24pIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdmlld0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcih2aWV3RWxlbWVudHNbaV0sIGFjdGlvbik7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyOyIsIkZpbmRHYW1lQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEZpbmRHYW1lQ29udHJvbGxlcjtcbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBGaW5kR2FtZVZpZXcoKTtcbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuYXZhdGFyID0gbnVsbDtcbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuVFJBTlNJVElPTl9UT19HQU1FX1RJTUUgPSAzMDAwO1xuXG5mdW5jdGlvbiBGaW5kR2FtZUNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHRoaXMuYXZhdGFyID0gYXZhdGFyO1xuICAgIHRoaXMuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKHRoaXMuYXZhdGFyKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkZJTkRJTkdfR0FNRSwge2F2YXRhcjogdGhpcy5hdmF0YXJ9KTtcbn07XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uR0FNRV9GT1VORCwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLmFzc2lnbkF2YXRhcnMocGxheWVyRGF0YSk7XG4gICAgICAgIHRoaXMudmlldy5jcmVhdGVHYW1lRm91bmRDYXB0aW9uKCk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICAgICAgICAgIHZhciBwbGF5ZXJDb250cm9sbGVyID0gQ29udHJvbGxlclN0b3JlLnBsYXllckNvbnRyb2xsZXI7XG4gICAgICAgICAgICBwbGF5ZXJDb250cm9sbGVyLnNldFBsYXllckRhdGEocGxheWVyRGF0YSk7XG4gICAgICAgICAgICB2YXIgZGljZUNvbnRyb2xsZXIgPSBDb250cm9sbGVyU3RvcmUuZGljZUNvbnRyb2xsZXI7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25Db250cm9sbGVyID0gQ29udHJvbGxlclN0b3JlLnF1ZXN0aW9uQ29udHJvbGxlcjtcbiAgICAgICAgICAgIHF1ZXN0aW9uQ29udHJvbGxlci5zZXRQbGF5ZXJDb250cm9sbGVyKHBsYXllckNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgdmFyIHR1cm5Db250cm9sbGVyID0gQ29udHJvbGxlclN0b3JlLnR1cm5Db250cm9sbGVyO1xuICAgICAgICAgICAgdHVybkNvbnRyb2xsZXIuc2V0Q29udHJvbGxlckRlcGVuZGVuY2llcyhwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICAgICAgICAgIHR1cm5Db250cm9sbGVyLmluaXRpYXRlKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5UUkFOU0lUSU9OX1RPX0dBTUVfVElNRSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuYXNzaWduQXZhdGFycyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgc29ja2V0SWRQcmVmaXggPSBcIi8jXCI7XG4gICAgdmFyIHNvY2tldElkID0gc29ja2V0SWRQcmVmaXggKyB0aGlzLnNvY2tldC5pZDtcbiAgICBpZihkYXRhLnBsYXllcjFJZCA9PT0gc29ja2V0SWQpIHtcbiAgICAgICAgdGhpcy52aWV3LmNyZWF0ZVBsYXllcjJBY3R1YWxBdmF0YXIoZGF0YS5wbGF5ZXIyQXZhdGFyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhcihkYXRhLnBsYXllcjFBdmF0YXIpO1xuICAgIH1cbn07XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbmRHYW1lQ29udHJvbGxlcjsiLCJHYW1lQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEdhbWVDb250cm9sbGVyO1xuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIEdhbWVDb250cm9sbGVyKHBsYXllckRhdGEpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG59XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zZXRQbGF5ZXJEYXRhID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5wbGF5ZXJEYXRhID0gcGxheWVyRGF0YTtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zZXREaWNlTnVtYmVyID0gZnVuY3Rpb24oZGljZU51bWJlcikge1xuICAgIEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5kaWNlTnVtYmVyID0gZGljZU51bWJlcjtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5pc1BsYXllcjEgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc29ja2V0UHJlZml4ID0gXCIvI1wiO1xuICAgIHJldHVybiB0aGlzLnBsYXllckRhdGEucGxheWVyMUlkID09PSAoc29ja2V0UHJlZml4ICsgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNvY2tldC5pZCk7XG59O1xuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0UGxheWVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNQbGF5ZXIxKHRoaXMucGxheWVyRGF0YSkgPyBcIlBMQVlFUl8xXCIgOiBcIlBMQVlFUl8yXCI7XG59O1xuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0T3Bwb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pc1BsYXllcjEodGhpcy5wbGF5ZXJEYXRhKSA/IFwiUExBWUVSXzJcIiA6IFwiUExBWUVSXzFcIjtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zb3VuZE1hbmFnZXIgPSBuZXcgU291bmRNYW5hZ2VyKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUNvbnRyb2xsZXI7IiwiSGVscENvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBIZWxwQ29udHJvbGxlcjtcbkhlbHBDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuSGVscENvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgSGVscFZpZXcoKTtcblxuZnVuY3Rpb24gSGVscENvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xufVxuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgYmFja0J1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuQkFDS19CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gQ29udHJvbGxlclN0b3JlLm1lbnVDb250cm9sbGVyO1xuICAgICAgICBtZW51Q29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0pO1xuICAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZWxwQ29udHJvbGxlcjsiLCJNZW51Q29udHJvbGxlci5jb25zdHJ1Y3RvciA9IE1lbnVDb250cm9sbGVyO1xuTWVudUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5NZW51Q29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBNZW51VmlldygpO1xuXG5mdW5jdGlvbiBNZW51Q29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG59XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbn07XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBwbGF5QnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5QTEFZX0JVVFRPTl07XG4gICAgdmFyIGhlbHBCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LkhFTFBfQlVUVE9OXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIocGxheUJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gQ29udHJvbGxlclN0b3JlLmF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI7XG4gICAgICAgIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoaGVscEJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWxwQ29udHJvbGxlciA9IENvbnRyb2xsZXJTdG9yZS5oZWxwQ29udHJvbGxlcjtcbiAgICAgICAgaGVscENvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudUNvbnRyb2xsZXI7IiwiVHVybkNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBUdXJuQ29udHJvbGxlcjtcblR1cm5Db250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gVHVybkNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXRpYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy53aW5WaWV3ID0gbmV3IFdpblZpZXcoKTtcbiAgICB0aGlzLmNsZWFuQ29udHJvbGxlclZpZXcoKTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmxvYWRWaWV3KCk7XG4gICAgdGhpcy5uZXdUdXJuKCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0Q29udHJvbGxlckRlcGVuZGVuY2llcyA9IGZ1bmN0aW9uKHBsYXllckNvbnRyb2xsZXIsIGRpY2VDb250cm9sbGVyLCBxdWVzdGlvbkNvbnRyb2xsZXIpIHtcbiAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIgPSBwbGF5ZXJDb250cm9sbGVyO1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIgPSBkaWNlQ29udHJvbGxlcjtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlciA9IHF1ZXN0aW9uQ29udHJvbGxlcjtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5yZWdpc3RlclNvY2tldEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5JTklUX05FV19UVVJOLCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGlmKHBsYXllckRhdGEucGxheWVyMUhlYWx0aCA9PT0gMCkge1xuICAgICAgICAgICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuR0FNRV9FTkRFRCwge3dpbm5lcjogXCJQTEFZRVJfMlwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZihwbGF5ZXJEYXRhLnBsYXllcjJIZWFsdGggPT09IDApIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdBTUVfRU5ERUQsIHt3aW5uZXI6IFwiUExBWUVSXzFcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1R1cm4oKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMTUwMCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5HQU1FX1NUQVRTLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMubG9hZFdpblZpZXcoZGF0YS53aW5uZXIsIGRhdGEpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFdpblZpZXcgPSBmdW5jdGlvbihwbGF5ZXIsIGRhdGEpIHtcbiAgICB0aGlzLmRpY2VDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMud2luVmlldy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLndpblZpZXcuY3JlYXRlV2lubmVyVGV4dChwbGF5ZXIsIGRhdGEpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLndpblZpZXcpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZXdFbGVtZW50cyA9IHRoaXMud2luVmlldy5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cygpOyAgXG4gICAgdmFyIHBsYXlBZ2FpbkJ1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLndpblZpZXcuUExBWV9BR0FJTl9CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihwbGF5QWdhaW5CdXR0b24sIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB2YXIgYXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlciA9IENvbnRyb2xsZXJTdG9yZS5hdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyO1xuICAgICAgICBhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLmxvYWRWaWV3KCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5uZXdUdXJuID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmRpY2VDb250cm9sbGVyLnJvbGxEaWNlKCk7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0uYmluZCh0aGlzKSwgMzAwMCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5Db250cm9sbGVyVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLmRpY2VDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmNsZWFuVmlldygpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLmNoZWNrUGxheWVyc0hlYWx0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuR0VUX1BMQVlFUlNfSEVBTFRIKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHVybkNvbnRyb2xsZXI7IiwiRGljZUNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBEaWNlQ29udHJvbGxlcjtcbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlKTtcbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IERpY2VWaWV3KCk7XG5cbmZ1bmN0aW9uIERpY2VDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG59XG5cbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS5yZWdpc3RlclNvY2tldEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5ESUNFX05VTUJFUiwgZnVuY3Rpb24oZGljZSkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5Um9sbERpY2VTb3VuZCgpO1xuICAgICAgICB0aGlzLmxvYWREaWNlKGRpY2UubnVtYmVyKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnJvbGxEaWNlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LlJPTExfRElDRSk7XG4gICAgfVxufTtcblxuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWREaWNlID0gZnVuY3Rpb24oZGljZU51bWJlcikge1xuICAgIHRoaXMudmlldy5zZXR1cERpY2UoZGljZU51bWJlcik7XG4gICAgdGhpcy5zZXREaWNlTnVtYmVyKGRpY2VOdW1iZXIpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xufTtcblxuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaWNlQ29udHJvbGxlcjsiLCJQbGF5ZXJDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gUGxheWVyQ29udHJvbGxlcjtcblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBQbGF5ZXJWaWV3KCk7XG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5EQU5HRVJPVVNfTEVWRUxfSEVBTFRIID0gNjtcblxuZnVuY3Rpb24gUGxheWVyQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlldy5zZXRQbGF5ZXJEYXRhKHRoaXMucGxheWVyRGF0YSk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJzSGVhbHRoKCk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5yZWdpc3RlclNvY2tldEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5QTEFZRVJTX0hFQUxUSCwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLmNsZWFySW50ZXJ2YWxzKCk7XG4gICAgICAgIHRoaXMudmlldy5zZXRQbGF5ZXIxSGVhbHRoKHBsYXllckRhdGEucGxheWVyMUhlYWx0aCk7XG4gICAgICAgIHRoaXMudmlldy5zZXRQbGF5ZXIySGVhbHRoKHBsYXllckRhdGEucGxheWVyMkhlYWx0aCk7XG4gICAgICAgIGlmKHBsYXllckRhdGEucGxheWVyMUhlYWx0aCA8PSB0aGlzLkRBTkdFUk9VU19MRVZFTF9IRUFMVEgpIHtcbiAgICAgICAgICAgIHRoaXMudmlldy5mbGFzaFBsYXllcjFIZWFsdGgocGxheWVyRGF0YS5wbGF5ZXIxSGVhbHRoKTtcbiAgICAgICAgfVxuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjJIZWFsdGggPD0gdGhpcy5EQU5HRVJPVVNfTEVWRUxfSEVBTFRIKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuZmxhc2hQbGF5ZXIySGVhbHRoKHBsYXllckRhdGEucGxheWVyMkhlYWx0aCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlUGxheWVyc0hlYWx0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuR0VUX1BMQVlFUlNfSEVBTFRIKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYXJJbnRlcnZhbHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXcuY2xlYXJJbnRlcnZhbHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyQ29udHJvbGxlcjsiLCJRdWVzdGlvbkNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBRdWVzdGlvbkNvbnRyb2xsZXI7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IFF1ZXN0aW9uVmlldygpO1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzEgPSAnQU5TV0VSRURfMSc7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzIgPSAnQU5TV0VSRURfMic7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzMgPSAnQU5TV0VSRURfMyc7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzQgPSAnQU5TV0VSRURfNCc7XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuVElNRV9UT19BTlNXRVJfUVVFU1RJT04gPSAxMDtcblxuZnVuY3Rpb24gUXVlc3Rpb25Db250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG59XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uUkFORE9NX1FVRVNUSU9OLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBkYXRhLnF1ZXN0aW9uO1xuICAgICAgICB0aGlzLmNhdGVnb3J5ID0gZGF0YS5jYXRlZ29yeTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkRBTUFHRV9ERUFMVCwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLnZpZXcuc2V0QW5zd2VyVG9Db2xvdXIodGhpcy5hbnN3ZXJzW3BsYXllckRhdGEuYW5zd2VyXSwgcGxheWVyRGF0YS5hbnN3ZXIpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0QW5zd2VyVG9Db2xvdXIodGhpcy5hbnN3ZXJzW3RoaXMuQU5TV0VSRURfMV0sIHRoaXMuQU5TV0VSRURfMSk7XG4gICAgICAgIHRoaXMudmlldy5zZXRXaG9BbnN3ZXJlZFF1ZXN0aW9uKHRoaXMuYW5zd2Vyc1twbGF5ZXJEYXRhLmFuc3dlcl0sIHBsYXllckRhdGEuYW5zd2VyLCBwbGF5ZXJEYXRhLnBsYXllcl93aG9fYW5zd2VyZWQpO1xuICAgICAgICB0aGlzLnZpZXcudHVybk9mZkludGVyYWN0aXZpdHlGb3JBbnN3ZXJFbGVtZW50cygpO1xuICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIudXBkYXRlUGxheWVyc0hlYWx0aCgpO1xuICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJbnRlcnZhbElkKTtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuTkVXX1RVUk4pO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5TSFVGRkxFRF9BTlNXRVJfSU5ESUNFUywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnZpZXcuc2V0QW5zd2VySW5kaWNlcyhkYXRhKTtcbiAgICAgICAgdGhpcy52aWV3LmRpc3BsYXlDYXRlZ29yeUFuZFF1ZXN0aW9uKHRoaXMuY2F0ZWdvcnksIHRoaXMucXVlc3Rpb24pO1xuICAgICAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFBsYXllckNvbnRyb2xsZXIgPSBmdW5jdGlvbihwbGF5ZXJDb250cm9sbGVyKSB7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyID0gcGxheWVyQ29udHJvbGxlcjtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJbnRlcnZhbElkKTtcbiAgICB0aGlzLmdldFJhbmRvbVF1ZXN0aW9uKCk7XG4gICAgdGhpcy5zaHVmZmxlQW5zd2VySW5kaWNlcygpO1xuICAgIHRoaXMudXBkYXRlVGltZXIoKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlVGltZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGltZVJlbWFpbmluZyA9IDEwO1xuICAgIHZhciB0aW1lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aW1lUmVtYWluaW5nID49IDApIHtcbiAgICAgICAgICAgIHRoaXMudmlldy51cGRhdGVRdWVzdGlvblRpbWVyKHRpbWVSZW1haW5pbmcpO1xuICAgICAgICAgICAgdGltZVJlbWFpbmluZy0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuTkVXX1RVUk4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySW50ZXJ2YWxJZCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcyk7XG4gICAgdGhpcy50aW1lckludGVydmFsSWQgPSBzZXRJbnRlcnZhbCh0aW1lciwgMTAwMCk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmdldFJhbmRvbVF1ZXN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICB2YXIgY2F0ZWdvcmllcyA9IHRoaXMuY2F0ZWdvcnlEYXRhLkNBVEVHT1JJRVM7XG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLnF1ZXN0aW9uRGF0YS5DQVRFR09SSUVTO1xuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9SQU5ET01fUVVFU1RJT04sIHtjYXRlZ29yaWVzOiBjYXRlZ29yaWVzLCBxdWVzdGlvbnM6IHF1ZXN0aW9uc30pO1xuICAgIH1cbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYW5zd2VycyA9IHRoaXMuZ2V0Vmlld0Fuc3dlcnMoKTtcbiAgICB0aGlzLnNldFJpZ2h0QW5zd2VyTGlzdGVuZXIoYW5zd2Vycyk7XG4gICAgdGhpcy5zZXRXcm9uZ0Fuc3dlckxpc3RlbmVycyhhbnN3ZXJzKTtcbiAgICB0aGlzLnNldEFuc3dlclVwZGF0ZUxpc3RlbmVyKGFuc3dlcnMpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5nZXRWaWV3QW5zd2VycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTtcbiAgICB2YXIgYW5zd2VycyA9IHt9O1xuICAgIGFuc3dlcnMuQU5TV0VSRURfMSA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuUklHSFRfQU5TV0VSXTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzIgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LldST05HX0FOU1dFUl8xXTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzMgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LldST05HX0FOU1dFUl8yXTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzQgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LldST05HX0FOU1dFUl8zXTtcbiAgICByZXR1cm4gYW5zd2Vycztcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0UmlnaHRBbnN3ZXJMaXN0ZW5lciA9IGZ1bmN0aW9uKGFuc3dlcnMpIHtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF8xLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zb3VuZE1hbmFnZXIucGxheUNvcnJlY3RBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9PcHBvbmVudFRvU29ja2V0KHRoaXMuQU5TV0VSRURfMSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0V3JvbmdBbnN3ZXJMaXN0ZW5lcnMgPSBmdW5jdGlvbihhbnN3ZXJzKSB7XG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfMiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlXcm9uZ0Fuc3dlclNvdW5kKCk7XG4gICAgICAgIHRoaXMuZW1pdERlYWxEYW1hZ2VUb1NlbGZUb1NvY2tldCh0aGlzLkFOU1dFUkVEXzIpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfMywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlXcm9uZ0Fuc3dlclNvdW5kKCk7XG4gICAgICAgIHRoaXMuZW1pdERlYWxEYW1hZ2VUb1NlbGZUb1NvY2tldCh0aGlzLkFOU1dFUkVEXzMpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfNCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlXcm9uZ0Fuc3dlclNvdW5kKCk7XG4gICAgICAgIHRoaXMuZW1pdERlYWxEYW1hZ2VUb1NlbGZUb1NvY2tldCh0aGlzLkFOU1dFUkVEXzQpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNodWZmbGVBbnN3ZXJJbmRpY2VzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuU0hVRkZMRV9BTlNXRVJfSU5ESUNFUywge2luZGljZXM6IFsxLDIsMyw0XX0pO1xuICAgIH1cbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0QW5zd2VyVXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbihhbnN3ZXJzKSB7XG4gICAgdGhpcy5hbnN3ZXJzID0gYW5zd2Vycztcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZW1pdERlYWxEYW1hZ2VUb09wcG9uZW50VG9Tb2NrZXQgPSBmdW5jdGlvbihhbnN3ZXIpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkRFQUxfREFNQUdFLCB7cGxheWVyX3dob19hbnN3ZXJlZDogdGhpcy5nZXRQbGF5ZXIoKSwgcGxheWVyX3RvX2RhbWFnZTogdGhpcy5nZXRPcHBvbmVudCgpLCBkYW1hZ2U6IHRoaXMuZGljZU51bWJlciwgYW5zd2VyOiBhbnN3ZXIsIGFuc3dlclN0YXR1czogJ2NvcnJlY3QnLCBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeX0pO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0ID0gZnVuY3Rpb24oYW5zd2VyKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ERUFMX0RBTUFHRSwge3BsYXllcl93aG9fYW5zd2VyZWQ6IHRoaXMuZ2V0UGxheWVyKCksIHBsYXllcl90b19kYW1hZ2U6IHRoaXMuZ2V0UGxheWVyKCksIGRhbWFnZTogdGhpcy5kaWNlTnVtYmVyLCBhbnN3ZXI6IGFuc3dlciwgYW5zd2VyU3RhdHVzOiAnaW5jb3JyZWN0JywgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnl9KTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uQ29udHJvbGxlcjsiLCJmdW5jdGlvbiBCdWNrZXRMb2FkZXIgKGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIFBPUlRSQUlUID0gXCJwb3J0cmFpdFwiLFxuICAgICAgICBMQU5EU0NBUEUgPSBcImxhbmRzY2FwZVwiLFxuICAgICAgICBCVUNLRVRfU0laRV9KU09OX1BBVEggPSBcInJlc291cmNlL2J1Y2tldF9zaXplcy5qc29uXCI7XG5cbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICBuZXcgSnNvbkxvYWRlcihCVUNLRVRfU0laRV9KU09OX1BBVEgsIGNhbGN1bGF0ZUJlc3RCdWNrZXQpO1xuICAgIH0pKCk7XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVTY2FsZSAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLmZsb29yKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSwgMik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlQmVzdEJ1Y2tldCAoYnVja2V0RGF0YSkge1xuICAgICAgICB2YXIgb3JpZW50YXRpb24gPSBjYWxjdWxhdGVPcmllbnRhdGlvbigpO1xuICAgICAgICB2YXIgc2NhbGUgPSBjYWxjdWxhdGVTY2FsZSgpO1xuICAgICAgICBpZihzY2FsZSA9PT0gMikge1xuICAgICAgICAgICAgc2NhbGUgPSAxLjU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJPcmllbnRhdGlvbiBpcyBcIiArIG9yaWVudGF0aW9uKTtcbiAgICAgICAgYnVja2V0RGF0YVtvcmllbnRhdGlvbl0uZm9yRWFjaChmdW5jdGlvbiAoYnVja2V0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJ1Y2tldCBoZWlnaHQ6IFwiICsgYnVja2V0LmhlaWdodCAqIHNjYWxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2luZG93IGhlaWdodDogXCIgKyB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICAgICAgaWYgKGJ1Y2tldC5oZWlnaHQgKiBzY2FsZSA8PSB3aW5kb3cuaW5uZXJIZWlnaHQgKSB7XG4gICAgICAgICAgICAgICAgRGlzcGxheS5idWNrZXQgPSBidWNrZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgRGlzcGxheS5zY2FsZSA9IGNhbGN1bGF0ZVNjYWxlKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgRGlzcGxheS5yZXNvdXJjZVBhdGggPSAnLi9yZXNvdXJjZS8nICsgRGlzcGxheS5idWNrZXQud2lkdGggKyAneCcgKyBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQgKyAnL3NjYWxlLScgKyBEaXNwbGF5LnNjYWxlO1xuICAgICAgICBEaXNwbGF5Lm9yaWVudGF0aW9uID0gb3JpZW50YXRpb247XG4gICAgICAgIGV4ZWN1dGVDYWxsYmFjaygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVPcmllbnRhdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFBPUlRSQUlUO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIExBTkRTQ0FQRTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWN1dGVDYWxsYmFjayAoKSB7XG4gICAgICAgIGlmIChEaXNwbGF5LmJ1Y2tldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWNrZXRMb2FkZXI7IiwidmFyIEltYWdlTG9hZGVyID0gZnVuY3Rpb24oaW1hZ2VKc29uUGF0aCwgY2FsbGJhY2spIHtcbiAgICB2YXIganNvbkxvYWRlciA9IG5ldyBKc29uTG9hZGVyKGltYWdlSnNvblBhdGgsIGxvYWRJbWFnZXMpO1xuICAgIHZhciBpbWFnZXNMb2FkZWQgPSAwO1xuICAgIHZhciB0b3RhbEltYWdlcyA9IDA7XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlcyhpbWFnZURhdGEpIHtcbiAgICAgICAgdmFyIGltYWdlcyA9IGltYWdlRGF0YS5JTUFHRVM7XG4gICAgICAgIGNvdW50TnVtYmVyT2ZJbWFnZXMoaW1hZ2VzKTtcbiAgICAgICAgZm9yKHZhciBpbWFnZSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIGxvYWRJbWFnZShpbWFnZXNbaW1hZ2VdLnBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZShpbWFnZVBhdGgpIHtcbiAgICAgICAgdmFyIFJFUVVFU1RfRklOSVNIRUQgPSA0O1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBpbWFnZVBhdGgsIHRydWUpO1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gUkVRVUVTVF9GSU5JU0hFRCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbmlzaGVkIGxvYWRpbmcgaW1hZ2UgcGF0aDogXCIgKyBpbWFnZVBhdGgpO1xuICAgICAgICAgICAgICBpbWFnZXNMb2FkZWQrKztcbiAgICAgICAgICAgICAgY2hlY2tJZkFsbEltYWdlc0xvYWRlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY291bnROdW1iZXJPZkltYWdlcyhpbWFnZXMpIHtcbiAgICAgICAgZm9yKHZhciBpbWFnZSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIHRvdGFsSW1hZ2VzKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY2hlY2tJZkFsbEltYWdlc0xvYWRlZCgpIHtcbiAgICAgICAgaWYoaW1hZ2VzTG9hZGVkID09PSB0b3RhbEltYWdlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbGwgaW1hZ2VzIGxvYWRlZCFcIik7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJPbmx5IFwiICsgaW1hZ2VzTG9hZGVkICsgXCIgYXJlIGxvYWRlZC5cIik7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlTG9hZGVyOyIsInZhciBKc29uTG9hZGVyID0gZnVuY3Rpb24gKHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICBSRVFVRVNUX0ZJTklTSEVEID0gNDtcbiAgICAoZnVuY3Rpb24gbG9hZEpzb24oKSB7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm92ZXJyaWRlTWltZVR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpO1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gUkVRVUVTVF9GSU5JU0hFRCkge1xuICAgICAgICAgICAgdGhhdC5kYXRhID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIGNhbGxiYWNrKHRoYXQuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhhdC5kYXRhO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSnNvbkxvYWRlcjtcbiIsImZ1bmN0aW9uIFZpZXdMb2FkZXIoKSB7fVxuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyLmFkZENoaWxkKHZpZXcpO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUucmVtb3ZlQWxsVmlld3MgPSBmdW5jdGlvbigpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyLnJlbW92ZUNoaWxkcmVuKCk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5yZW1vdmVWaWV3ID0gZnVuY3Rpb24odmlldykge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIucmVtb3ZlQ2hpbGQodmlldyk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5zZXRSZW5kZXJlciA9IGZ1bmN0aW9uKHJlbmRlcmVyKSB7XG4gICAgVmlld0xvYWRlci5wcm90b3R5cGUucmVuZGVyZXIgPSByZW5kZXJlcjtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnNldENvbnRhaW5lciA9IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIgPSBjb250YWluZXI7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgVmlld0xvYWRlci5wcm90b3R5cGUucmVuZGVyZXIucmVuZGVyKFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShWaWV3TG9hZGVyLnByb3RvdHlwZS5hbmltYXRlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlld0xvYWRlcjsiLCJ2YXIgQ29udHJvbGxlclN0b3JlID0ge1xuICAgIG1lbnVDb250cm9sbGVyOiBuZXcgTWVudUNvbnRyb2xsZXIoKSxcbiAgICBhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyOiBuZXcgQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcigpLFxuICAgIGhlbHBDb250cm9sbGVyOiBuZXcgSGVscENvbnRyb2xsZXIoKSxcbiAgICBmaW5kR2FtZUNvbnRyb2xsZXI6IG5ldyBGaW5kR2FtZUNvbnRyb2xsZXIoKSxcbiAgICBkaWNlQ29udHJvbGxlcjogbmV3IERpY2VDb250cm9sbGVyKCksXG4gICAgcGxheWVyQ29udHJvbGxlcjogbmV3IFBsYXllckNvbnRyb2xsZXIoKSxcbiAgICBxdWVzdGlvbkNvbnRyb2xsZXI6IG5ldyBRdWVzdGlvbkNvbnRyb2xsZXIoKSxcbiAgICB0dXJuQ29udHJvbGxlcjogbmV3IFR1cm5Db250cm9sbGVyKClcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlclN0b3JlOyIsInZhciBTcHJpdGVTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzcHJpdGVzID0gW107XG4gICAgXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICBzcHJpdGVzLmxvZ28gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9sb2dvLmpwZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXlCdXR0b24gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9wbGF5LWJ1dHRvbi5qcGcnKTtcbiAgICAgICAgc3ByaXRlcy5oZWxwQnV0dG9uID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvaGVscC1idXR0b24uanBnJyk7XG4gICAgICAgIHNwcml0ZXMuYmFja0J1dHRvbiA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2JhY2stYnV0dG9uLmpwZycpO1xuICAgICAgICBzcHJpdGVzLmRvd25UcmlhbmdsZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2Rvd24tdHJpYW5nbGUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMudXBUcmlhbmdsZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL3VwLXRyaWFuZ2xlLnBuZycpO1xuICAgICAgICBzcHJpdGVzLmZpbmRHYW1lID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZmluZC1nYW1lLmpwZycpO1xuICAgICAgICBzcHJpdGVzLmVtb2ppQW5nZWwgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktYW5nZWwucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZW1vamlCaWdTbWlsZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1iaWctc21pbGUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZW1vamlDb29sID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWNvb2wucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZW1vamlHcmluID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWdyaW4ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZW1vamlIYXBweSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1oYXBweS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5lbW9qaUtpc3MgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamkta2lzcy5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5lbW9qaUxhdWdoaW5nID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWxhdWdoaW5nLnBuZycpO1xuICAgICAgICBzcHJpdGVzLmVtb2ppTG92ZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1sb3ZlLnBuZycpO1xuICAgICAgICBzcHJpdGVzLmVtb2ppTW9ua2V5ID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLW1vbmtleS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5lbW9qaVBvbyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1wb28ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZW1vamlTY3JlYW0gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktc2NyZWFtLnBuZycpO1xuICAgICAgICBzcHJpdGVzLmVtb2ppU2xlZXAgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktc2xlZXAucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZW1vamlTbWlsZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbWlsZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5lbW9qaVNsZWVwID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLXNsZWVwLnBuZycpO1xuICAgICAgICBzcHJpdGVzLmVtb2ppV2luayA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS13aW5rLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnF1ZXN0aW9uTWFyayA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL3F1ZXN0aW9uLW1hcmsucG5nJyk7XG4gICAgfSkoKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKHNwcml0ZU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBzcHJpdGVzW3Nwcml0ZU5hbWVdO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlU3RvcmU7IiwidmFyIERpc3BsYXkgPSB7XG4gICAgYnVja2V0OiBudWxsLFxuICAgIHNjYWxlOiBudWxsLFxuICAgIHJlc291cmNlUGF0aDogbnVsbCxcbiAgICBvcmllbnRhdGlvbjogbnVsbFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwbGF5OyIsIkF2YXRhclNlbGVjdGlvblZpZXcuY29uc3RydWN0b3IgPSBBdmF0YXJTZWxlY3Rpb25WaWV3O1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuQkFDS19CVVRUT04gPSAwO1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuU0VMRUNUX1VQID0gMTtcbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLlNFTEVDVF9ET1dOID0gMjtcbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLkZJTkRfR0FNRSA9IDM7XG5cblxuZnVuY3Rpb24gQXZhdGFyU2VsZWN0aW9uVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY3JlYXRlTG9nbygpO1xuICAgIHRoaXMuY3JlYXRlQmFja0J1dHRvbigpO1xuICAgIHRoaXMuY3JlYXRlU2VsZWN0RG93bkJ1dHRvbigpO1xuICAgIHRoaXMuY3JlYXRlU2VsZWN0VXBCdXR0b24oKTtcbiAgICB0aGlzLmNyZWF0ZUZpbmRHYW1lQnV0dG9uKCk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVMb2dvID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgbG9nbyA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdsb2dvJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQobG9nbywgNTAsIDEwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihsb2dvKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUJhY2tCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuYmFja0J1dHRvbiA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdiYWNrQnV0dG9uJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5iYWNrQnV0dG9uLCA2OSwgODApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYmFja0J1dHRvbik7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVTZWxlY3REb3duQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnNlbGVjdERvd25CdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnZG93blRyaWFuZ2xlJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5zZWxlY3REb3duQnV0dG9uLCAyNCwgODUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuc2VsZWN0RG93bkJ1dHRvbik7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVTZWxlY3RVcEJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5zZWxlY3RVcEJ1dHRvbiA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCd1cFRyaWFuZ2xlJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5zZWxlY3RVcEJ1dHRvbiwgMjQsIDM1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnNlbGVjdFVwQnV0dG9uKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUZpbmRHYW1lQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmZpbmRHYW1lQnV0dG9uID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2ZpbmRHYW1lJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5maW5kR2FtZUJ1dHRvbiwgNjksIDQ4KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmZpbmRHYW1lQnV0dG9uKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLmJhY2tCdXR0b24sIHRoaXMuc2VsZWN0VXBCdXR0b24sIHRoaXMuc2VsZWN0RG93bkJ1dHRvbiwgdGhpcy5maW5kR2FtZUJ1dHRvbl07XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclNlbGVjdGlvblZpZXc7IiwiRmluZEdhbWVWaWV3LmNvbnN0cnVjdG9yID0gRmluZEdhbWVWaWV3O1xuRmluZEdhbWVWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBGaW5kR2FtZVZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5GSU5EX0dBTUU7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVGaW5kR2FtZUNhcHRpb24obGF5b3V0RGF0YS5DQVBUSU9OKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFBdmF0YXIoYXZhdGFyKTtcbiAgICB0aGlzLmNyZWF0ZVZlcnN1c1RleHQobGF5b3V0RGF0YS5WRVJTVVMpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMlVua25vd25BdmF0YXIoKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFUZXh0KGxheW91dERhdGEuUExBWUVSXzEpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMlRleHQobGF5b3V0RGF0YS5QTEFZRVJfMik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZUZpbmRHYW1lQ2FwdGlvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5maW5kR2FtZUNhcHRpb24gPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuZmluZEdhbWVDYXB0aW9uLCA1MCwgMTUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuZmluZEdhbWVDYXB0aW9uKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMUF2YXRhciA9IGZ1bmN0aW9uIChhdmF0YXIpIHtcbiAgICB2YXIgcGxheWVyMUF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMUF2YXRhciwgMjUsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIxQXZhdGFyKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlVmVyc3VzVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHZlcnN1cyA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodmVyc3VzLCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHZlcnN1cyk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJVbmtub3duQXZhdGFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwbGF5ZXIyVW5rbm93bkF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdxdWVzdGlvbk1hcmsnKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIyVW5rbm93bkF2YXRhciwgNzUsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyVW5rbm93bkF2YXRhcik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgcGxheWVyMSA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMSwgMjUsIDc0KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIxKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMlRleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBwbGF5ZXIyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIyLCA3NSwgNzQpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyID0gZnVuY3Rpb24gKGF2YXRhcikge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjJVbmtub3duQXZhdGFyKTtcbiAgICB2YXIgcGxheWVyMkFjdHVhbEF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMkFjdHVhbEF2YXRhciwgNzUsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyQWN0dWFsQXZhdGFyKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlR2FtZUZvdW5kQ2FwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5maW5kR2FtZUNhcHRpb24pO1xuICAgIHZhciBmb3VuZEdhbWVDYXB0aW9uID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkZJTkRfR0FNRS5GT1VORF9HQU1FX0NBUFRJT04pO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGZvdW5kR2FtZUNhcHRpb24sIDUwLCAxNSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoZm91bmRHYW1lQ2FwdGlvbik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmluZEdhbWVWaWV3OyIsIkhlbHBWaWV3LmNvbnN0cnVjdG9yID0gSGVscFZpZXc7XG5IZWxwVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuSGVscFZpZXcucHJvdG90eXBlLkJBQ0tfQlVUVE9OID0gMDtcblxuZnVuY3Rpb24gSGVscFZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuSGVscFZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkhFTFA7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVIZWxwVGV4dChsYXlvdXREYXRhLklORk8pO1xuICAgIHRoaXMuY3JlYXRlQmFja0J1dHRvbigpO1xufTtcblxuSGVscFZpZXcucHJvdG90eXBlLmNyZWF0ZUhlbHBUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgaGVscFRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGhlbHBUZXh0KTtcbn07XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5jcmVhdGVCYWNrQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmJhY2tCdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnYmFja0J1dHRvbicpO1xuICAgIGNvbnNvbGUubG9nKFwiQkFDSyBCVVRUT05cIik7XG4gICAgY29uc29sZS5sb2codGhpcy5zcHJpdGVTdG9yZSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5iYWNrQnV0dG9uLCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYmFja0J1dHRvbik7XG59O1xuXG5IZWxwVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuYmFja0J1dHRvbl07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBWaWV3OyIsIkxvYWRpbmdWaWV3LmNvbnN0cnVjdG9yID0gTG9hZGluZ1ZpZXc7XG5Mb2FkaW5nVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gTG9hZGluZ1ZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuTG9hZGluZ1ZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkxPQURJTkc7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVMb2FkaW5nVGV4dChsYXlvdXREYXRhLkxPQURJTkdfVEVYVCk7XG59O1xuXG5Mb2FkaW5nVmlldy5wcm90b3R5cGUuY3JlYXRlTG9hZGluZ1RleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBsb2FkaW5nVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQobG9hZGluZ1RleHQsIDUwLCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIobG9hZGluZ1RleHQsIGRhdGEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nVmlldzsiLCJNZW51Vmlldy5jb25zdHJ1Y3RvciA9IE1lbnVWaWV3O1xuTWVudVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5QTEFZX0JVVFRPTiA9IDA7XG5NZW51Vmlldy5wcm90b3R5cGUuSEVMUF9CVVRUT04gPSAxO1xuXG5mdW5jdGlvbiBNZW51VmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5NZW51Vmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZUxvZ28oKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgICB0aGlzLmNyZWF0ZUhlbHBCdXR0b24oKTtcbn07XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5jcmVhdGVMb2dvID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2dvID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2xvZ28nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChsb2dvLCA1MCwgMTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGxvZ28pO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXlCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMucGxheUJ1dHRvbiA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5QnV0dG9uJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5QnV0dG9uLCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheUJ1dHRvbik7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlSGVscEJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5oZWxwQnV0dG9uID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2hlbHBCdXR0b24nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmhlbHBCdXR0b24sIDUwLCA4MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5oZWxwQnV0dG9uKTtcbn07XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5wbGF5QnV0dG9uLCB0aGlzLmhlbHBCdXR0b25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51VmlldzsiLCJWaWV3LmNvbnN0cnVjdG9yID0gVmlldztcblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuVmlldy5wcm90b3R5cGUuSU5URVJBQ1RJVkUgPSB0cnVlO1xuVmlldy5wcm90b3R5cGUuQ0VOVEVSX0FOQ0hPUiA9IDAuNTtcblxuZnVuY3Rpb24gVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5WaWV3LnByb3RvdHlwZS5hZGRFbGVtZW50VG9Db250YWluZXIgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgZWxlbWVudC5hbmNob3IueCA9IHRoaXMuQ0VOVEVSX0FOQ0hPUjtcbiAgICBlbGVtZW50LmFuY2hvci55ID0gdGhpcy5DRU5URVJfQU5DSE9SO1xuICAgIGVsZW1lbnQuaW50ZXJhY3RpdmUgPSB0aGlzLklOVEVSQUNUSVZFO1xuICAgIHRoaXMuYWRkQ2hpbGQoZWxlbWVudCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVUZXh0RWxlbWVudCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IFBJWEkuVGV4dChkYXRhLnRleHQsIHtmb250OiBkYXRhLnNpemUgKyBcInB4IFwiICsgZGF0YS5mb250LCBmaWxsOiBkYXRhLmNvbG9yfSk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVTcHJpdGVFbGVtZW50ID0gZnVuY3Rpb24ocGF0aCkge1xuICAgIHJldHVybiBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKHBhdGgpO1xufTtcblxuVmlldy5wcm90b3R5cGUucmVtb3ZlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIHRoaXMuYWRkQ2hpbGQoZWxlbWVudCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5yZW1vdmVBbGxFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcbn07XG5cblZpZXcucHJvdG90eXBlLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCA9IGZ1bmN0aW9uKGVsZW1lbnQsIHdpZHRoUGVyY2VudGFnZSwgaGVpZ2h0UGVyY2VudGFnZSkge1xuICAgIGVsZW1lbnQueCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDEwMCkgKiB3aWR0aFBlcmNlbnRhZ2U7XG4gICAgZWxlbWVudC55ID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDEwMCkgKiBoZWlnaHRQZXJjZW50YWdlOyAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xuXG4iLCJBdmF0YXJWaWV3LmNvbnN0cnVjdG9yID0gQXZhdGFyVmlldztcbkF2YXRhclZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbkF2YXRhclZpZXcucHJvdG90eXBlLkJBQ0tfQlVUVE9OID0gMDtcblxuZnVuY3Rpb24gQXZhdGFyVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5BdmF0YXJWaWV3LnByb3RvdHlwZS5jcmVhdGVBdmF0YXIgPSBmdW5jdGlvbiAoYXZhdGFyKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuYXZhdGFyKTtcbiAgICB0aGlzLmF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5hdmF0YXIsIDI0LCA2MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hdmF0YXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdmF0YXJWaWV3OyIsIkRpY2VWaWV3LmNvbnN0cnVjdG9yID0gRGljZVZpZXc7XG5EaWNlVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gRGljZVZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuRGljZVZpZXcucHJvdG90eXBlLnNldHVwRGljZSA9IGZ1bmN0aW9uKGRpY2VOdW1iZXIpIHtcbiAgICB0aGlzLmNyZWF0ZURpY2VFbGVtZW50KGRpY2VOdW1iZXIpO1xufTtcblxuRGljZVZpZXcucHJvdG90eXBlLmNyZWF0ZURpY2VFbGVtZW50ID0gZnVuY3Rpb24oZGljZU51bWJlcikge1xuICAgIHRoaXMuZGljZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2RpY2UvZGljZS1mYWNlLScgKyBkaWNlTnVtYmVyICsgJy5wbmcnKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmRpY2VFbGVtZW50LCA1MCwgNDIpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuZGljZUVsZW1lbnQpO1xufTtcblxuRGljZVZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGljZVZpZXc7IiwiUGxheWVyVmlldy5jb25zdHJ1Y3RvciA9IFBsYXllclZpZXc7XG5QbGF5ZXJWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBQbGF5ZXJWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cblBsYXllclZpZXcucHJvdG90eXBlLnNldFBsYXllckRhdGEgPSBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXJEYXRhID0gcGxheWVyRGF0YTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXllckxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUjtcbiAgICB2YXIgYXZhdGFyRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQVZBVEFSO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlUGxheWVyMUF2YXRhcih0aGlzLnBsYXllckRhdGEucGxheWVyMUF2YXRhcik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxSGVhbHRoKHBsYXllckxheW91dERhdGEuUExBWUVSXzFfSEVBTFRIKTtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJBdmF0YXIodGhpcy5wbGF5ZXJEYXRhLnBsYXllcjJBdmF0YXIpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMkhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX0hFQUxUSCk7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxVGV4dChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX1RFWFQpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMlRleHQocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMl9URVhUKTtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZUxvZ28oKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZUxvZ28gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvZ28gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2xvZ28uanBnJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQobG9nbywgNTAsIDEwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihsb2dvKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFBdmF0YXIgPSBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICB0aGlzLnBsYXllcjFBdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci8nICsgYXZhdGFyKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjFBdmF0YXIsIDI1LCAzNik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxQXZhdGFyKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJBdmF0YXIgPSBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICB0aGlzLnBsYXllcjJBdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci8nICsgYXZhdGFyKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjJBdmF0YXIsIDc1LCAzNik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIyQXZhdGFyKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFIZWFsdGggPSBmdW5jdGlvbihoZWFsdGhEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoaGVhbHRoRGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCwgMjUsIDU2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFIZWFsdGhUZXh0LCBoZWFsdGhEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJIZWFsdGggPSBmdW5jdGlvbihoZWFsdGhEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIySGVhbHRoVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoaGVhbHRoRGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIySGVhbHRoVGV4dCwgNzUsIDU2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJIZWFsdGhUZXh0LCBoZWFsdGhEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFUZXh0ID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIHRoaXMucGxheWVyMVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHBsYXllckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMVRleHQsIDI1LCA1Myk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxVGV4dCwgcGxheWVyRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyVGV4dCA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllcjJUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjJUZXh0LCA3NSwgNTMpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMlRleHQsIHBsYXllckRhdGEpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMUhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIxSGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8xX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjFIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIxSGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMkhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIySGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8yX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjJIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIySGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuZmxhc2hQbGF5ZXIxSGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoKSB7XG4gICAgdmFyIHBsYXllckxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUjtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyMkhlYWx0aEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXJlbW92ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjFIZWFsdGhUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyMUhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX0hFQUxUSCk7XG4gICAgICAgICAgICB0aGlzLnNldFBsYXllcjFIZWFsdGgoaGVhbHRoKTtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVkID0gIXJlbW92ZWQ7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDApO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuZmxhc2hQbGF5ZXIySGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoKSB7XG4gICAgdmFyIHBsYXllckxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUjtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyMUhlYWx0aEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXJlbW92ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjJIZWFsdGhUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyMkhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX0hFQUxUSCk7XG4gICAgICAgICAgICB0aGlzLnNldFBsYXllcjJIZWFsdGgoaGVhbHRoKTtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVkID0gIXJlbW92ZWQ7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDApO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY2xlYXJJbnRlcnZhbHMgPSBmdW5jdGlvbigpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMucGxheWVyMUhlYWx0aEludGVydmFsSWQpO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5wbGF5ZXIySGVhbHRoSW50ZXJ2YWxJZCk7XG4gICAgY29uc29sZS5sb2coXCJJbnRlcnZhbHMgY2xlYXJlZC5cIik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclZpZXc7IiwiUXVlc3Rpb25WaWV3LmNvbnN0cnVjdG9yID0gUXVlc3Rpb25WaWV3O1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLlJJR0hUX0FOU1dFUiA9IDA7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLldST05HX0FOU1dFUl8xID0gMTtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuV1JPTkdfQU5TV0VSXzIgPSAyO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5XUk9OR19BTlNXRVJfMyA9IDM7XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSX1BSRUZJWCA9IFwiQU5TV0VSX1wiO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5BTlNXRVJFRF9QUkVGSVggPSBcIkFOU1dFUkVEX1wiO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5BTlNXRVJFRF9TVUZGSVggPSBcIl9BTlNXRVJFRFwiO1xuXG5mdW5jdGlvbiBRdWVzdGlvblZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5kaXNwbGF5Q2F0ZWdvcnlBbmRRdWVzdGlvbiA9IGZ1bmN0aW9uKGNhdGVnb3J5LCBxdWVzdGlvbikge1xuICAgIHZhciBxdWVzdGlvbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OO1xuICAgIHZhciBhbnN3ZXJUZXh0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT04uQU5TV0VSO1xuICAgIHRoaXMuY3JlYXRlQ2F0ZWdvcnlFbGVtZW50KGNhdGVnb3J5LCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLkNBVEVHT1JZKTtcbiAgICB0aGlzLmNyZWF0ZVF1ZXN0aW9uRWxlbWVudChxdWVzdGlvbi50ZXh0LCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLlFVRVNUSU9OX1BPU0lUSU9OKTtcbiAgICB0aGlzLmNyZWF0ZUFuc3dlckVsZW1lbnQxKHF1ZXN0aW9uLnJpZ2h0X2Fuc3dlciwgYW5zd2VyVGV4dERhdGEpO1xuICAgIHRoaXMuY3JlYXRlQW5zd2VyRWxlbWVudDIocXVlc3Rpb24ud3JvbmdfYW5zd2VyXzEsIGFuc3dlclRleHREYXRhKTtcbiAgICB0aGlzLmNyZWF0ZUFuc3dlckVsZW1lbnQzKHF1ZXN0aW9uLndyb25nX2Fuc3dlcl8yLCBhbnN3ZXJUZXh0RGF0YSk7XG4gICAgdGhpcy5jcmVhdGVBbnN3ZXJFbGVtZW50NChxdWVzdGlvbi53cm9uZ19hbnN3ZXJfMywgYW5zd2VyVGV4dERhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5nZXRBbnN3ZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKGluZGljZSkge1xuICAgIGlmKGluZGljZSA9PT0gMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiAzMyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDgxXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmKGluZGljZSA9PT0gMikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiA2NyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDgxXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGlmKGluZGljZSA9PT0gMykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiAzMyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDg5XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGlmKGluZGljZSA9PT0gNCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiA2NyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDg5XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRBbnN3ZXJJbmRpY2VzID0gZnVuY3Rpb24oYW5zd2VySW5kaWNlcykge1xuICAgIHRoaXMuYW5zd2VySW5kaWNlcyA9IGFuc3dlckluZGljZXM7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUNhdGVnb3J5RWxlbWVudCA9IGZ1bmN0aW9uKGNhdGVnb3J5LCBjYXRlZ29yeURhdGEpIHtcbiAgICBjYXRlZ29yeURhdGEudGV4dCA9IGNhdGVnb3J5O1xuICAgIHRoaXMuY2F0ZWdvcnlFbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChjYXRlZ29yeURhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuY2F0ZWdvcnlFbGVtZW50LCA1MCwgNjkpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuY2F0ZWdvcnlFbGVtZW50LCBjYXRlZ29yeURhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVRdWVzdGlvbkVsZW1lbnQgPSBmdW5jdGlvbihxdWVzdGlvbiwgcXVlc3Rpb25EYXRhKSB7XG4gICAgcXVlc3Rpb25EYXRhLnRleHQgPSBxdWVzdGlvbjtcbiAgICB0aGlzLnF1ZXN0aW9uRWxlbWVudCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQocXVlc3Rpb25EYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnF1ZXN0aW9uRWxlbWVudCwgNTAsIDc0KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnF1ZXN0aW9uRWxlbWVudCwgcXVlc3Rpb25EYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQW5zd2VyRWxlbWVudDEgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50MSA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdmFyIGFuc3dlclBvc2l0aW9uID0gdGhpcy5nZXRBbnN3ZXJQb3NpdGlvbih0aGlzLmFuc3dlckluZGljZXNbMF0pO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDEsIGFuc3dlclBvc2l0aW9uLndpZHRoUGVyY2VudGFnZSwgYW5zd2VyUG9zaXRpb24uaGVpZ2h0UGVyY2VudGFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50MSwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUFuc3dlckVsZW1lbnQyID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDIgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHZhciBhbnN3ZXJQb3NpdGlvbiA9IHRoaXMuZ2V0QW5zd2VyUG9zaXRpb24odGhpcy5hbnN3ZXJJbmRpY2VzWzFdKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmFuc3dlckVsZW1lbnQyLCBhbnN3ZXJQb3NpdGlvbi53aWR0aFBlcmNlbnRhZ2UsIGFuc3dlclBvc2l0aW9uLmhlaWdodFBlcmNlbnRhZ2UpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYW5zd2VyRWxlbWVudDIsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVBbnN3ZXJFbGVtZW50MyA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQzID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB2YXIgYW5zd2VyUG9zaXRpb24gPSB0aGlzLmdldEFuc3dlclBvc2l0aW9uKHRoaXMuYW5zd2VySW5kaWNlc1syXSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5hbnN3ZXJFbGVtZW50MywgYW5zd2VyUG9zaXRpb24ud2lkdGhQZXJjZW50YWdlLCBhbnN3ZXJQb3NpdGlvbi5oZWlnaHRQZXJjZW50YWdlKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmFuc3dlckVsZW1lbnQzLCBhbnN3ZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQW5zd2VyRWxlbWVudDQgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50NCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdmFyIGFuc3dlclBvc2l0aW9uID0gdGhpcy5nZXRBbnN3ZXJQb3NpdGlvbih0aGlzLmFuc3dlckluZGljZXNbM10pO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDQsIGFuc3dlclBvc2l0aW9uLndpZHRoUGVyY2VudGFnZSwgYW5zd2VyUG9zaXRpb24uaGVpZ2h0UGVyY2VudGFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50NCwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnNldEFuc3dlclRvQ29sb3VyID0gZnVuY3Rpb24oYW5zd2VyRWxlbWVudCwgYW5zd2VyKSB7XG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT047XG4gICAgdmFyIGNvbG91cnMgPSB7fTtcbiAgICBmb3IodmFyIGkgPSAyOyBpIDw9IDQ7IGkrKykge1xuICAgICAgICBjb2xvdXJzW3RoaXMuQU5TV0VSRURfUFJFRklYICsgaV0gPSBxdWVzdGlvbkRhdGEuV1JPTkdfQU5TV0VSX0NPTE9VUjtcbiAgICB9XG4gICAgY29sb3Vycy5BTlNXRVJFRF8xID0gcXVlc3Rpb25EYXRhLlJJR0hUX0FOU1dFUl9DT0xPVVI7XG4gICAgdmFyIGFuc3dlckNvbG91ciA9IGNvbG91cnNbYW5zd2VyXTtcbiAgICBhbnN3ZXJFbGVtZW50LnNldFN0eWxlKHtmb250OiBhbnN3ZXJFbGVtZW50LnN0eWxlLmZvbnQsIGZpbGw6IGFuc3dlckNvbG91cn0pO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRXaG9BbnN3ZXJlZFF1ZXN0aW9uID0gZnVuY3Rpb24oYW5zd2VyRWxlbWVudCwgYW5zd2VyLCBwbGF5ZXIpIHtcbiAgICB2YXIgcXVlc3Rpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTjtcbiAgICBjb25zb2xlLmxvZyhcIkFuc3dlcjpcIik7XG4gICAgY29uc29sZS5sb2coYW5zd2VyKTtcbiAgICB2YXIgYW5zd2VyT25TY3JlZW4gPSAoYW5zd2VyLnNsaWNlKC0xKSAtIDEpO1xuICAgIHRoaXMucGxheWVyV2hvQW5zd2VyZWRFbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChxdWVzdGlvbkRhdGFbcGxheWVyICsgdGhpcy5BTlNXRVJFRF9TVUZGSVhdKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcldob0Fuc3dlcmVkRWxlbWVudCwgcXVlc3Rpb25EYXRhW3RoaXMuQU5TV0VSRURfUFJFRklYICsgdGhpcy5hbnN3ZXJJbmRpY2VzWyhhbnN3ZXJPblNjcmVlbildXS53aWR0aFBlcmNlbnRhZ2UsIHF1ZXN0aW9uRGF0YVt0aGlzLkFOU1dFUkVEX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1soYW5zd2VyT25TY3JlZW4pXV0uaGVpZ2h0UGVyY2VudGFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXJXaG9BbnN3ZXJlZEVsZW1lbnQsIHF1ZXN0aW9uRGF0YVt0aGlzLkFOU1dFUkVEX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1thbnN3ZXJPblNjcmVlbl1dKTsgXG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnVwZGF0ZVF1ZXN0aW9uVGltZXIgPSBmdW5jdGlvbih0aW1lUmVtYWluaW5nKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMudGltZXIpO1xuICAgIHZhciB0aW1lckRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLlRJTUVSO1xuICAgIHRpbWVyRGF0YS50ZXh0ID0gdGltZVJlbWFpbmluZztcbiAgICB0aGlzLnRpbWVyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudCh0aW1lckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMudGltZXIsIDk3LCAzKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnRpbWVyLCB0aW1lckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS50dXJuT2ZmSW50ZXJhY3Rpdml0eUZvckFuc3dlckVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50MS5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDIuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQzLmludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50NC5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5hbnN3ZXJFbGVtZW50MSwgdGhpcy5hbnN3ZXJFbGVtZW50MiwgdGhpcy5hbnN3ZXJFbGVtZW50MywgdGhpcy5hbnN3ZXJFbGVtZW50NF07XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25WaWV3OyIsIldpblZpZXcuY29uc3RydWN0b3IgPSBXaW5WaWV3O1xuV2luVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuV2luVmlldy5wcm90b3R5cGUuUExBWV9BR0FJTl9CVVRUT04gPSAwO1xuXG5mdW5jdGlvbiBXaW5WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5zZXR1cFZpZXdFbGVtZW50cygpO1xufVxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlV2lubmVyVGV4dCA9IGZ1bmN0aW9uKHBsYXllcldob1dvbiwgc3RhdERhdGEpIHtcbiAgICB2YXIgd2luRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuV0lOO1xuICAgIHRoaXMuY3JlYXRlV2luVGV4dCh3aW5EYXRhW3BsYXllcldob1dvbiArIFwiX1dJTlNcIl0sIHdpbkRhdGEuV0lOX1RFWFRfUE9TSVRJT04pO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyU3RhdHNUZXh0KHdpbkRhdGEsIHN0YXREYXRhKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24ocGxheWVyV2hvV29uKSB7XG4gICAgdmFyIHdpbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLldJTjtcbiAgICB0aGlzLmNyZWF0ZVBsYXlBZ2FpbkJ1dHRvbih3aW5EYXRhLlBMQVlfQUdBSU4pO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlV2luVGV4dCA9IGZ1bmN0aW9uIChkYXRhLCBwb3NpdGlvbkRhdGEpIHtcbiAgICB0aGlzLndpblRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMud2luVGV4dCwgNTAsIDY2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLndpblRleHQsIHBvc2l0aW9uRGF0YSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXJTdGF0c1RleHQgPSBmdW5jdGlvbihsYXlvdXREYXRhLCBzdGF0RGF0YSkge1xuICAgIGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ICsgc3RhdERhdGEucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlO1xuICAgIHRoaXMucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgMjUsIDcyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICBcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ID0gbGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCArIHN0YXREYXRhLnBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZTtcbiAgICB0aGlzLnBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIDc1LCA3Mik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIyQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0LCBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5QWdhaW5CdXR0b24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wbGF5QWdhaW5CdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL3BsYXktYWdhaW4ucG5nJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5QWdhaW5CdXR0b24sIDUwLCA4MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5QWdhaW5CdXR0b24pO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMucGxheUFnYWluQnV0dG9uXTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQpO1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQpO1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLndpblRleHQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaW5WaWV3OyJdfQ==
