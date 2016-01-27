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
},{"./SoundManager":3,"./constant/SocketConstants":4,"./controller/AvatarSelectionController":5,"./controller/Controller":6,"./controller/FindGameController":7,"./controller/GameController":8,"./controller/HelpController":9,"./controller/MenuController":10,"./controller/TurnController":11,"./controller/subcontroller/DiceController":12,"./controller/subcontroller/PlayerController":13,"./controller/subcontroller/QuestionController":14,"./loader/BucketLoader":16,"./loader/ImageLoader":17,"./loader/JsonLoader":18,"./loader/ViewLoader":19,"./store/ControllerStore":20,"./store/SpriteStore":21,"./util/Display":22,"./view/AvatarSelectionView":23,"./view/FindGameView":24,"./view/HelpView":25,"./view/LoadingView":26,"./view/MenuView":27,"./view/View":28,"./view/subview/AvatarView":29,"./view/subview/DiceView":30,"./view/subview/PlayerView":31,"./view/subview/QuestionView":32,"./view/subview/WinView":33}],2:[function(require,module,exports){
Imports = require('./Imports');
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
        var controllerStore = new ControllerStore();
        Controller.prototype.controllerStore = controllerStore;
        var menuController = controllerStore.get('menuController');
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
},{"./Imports":1}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
};

AvatarSelectionController.prototype.setupListeners = function() {
    var viewElements = this.view.getInteractiveViewElements();  
    var backButton = viewElements[this.view.BACK_BUTTON];
    var selectUp = viewElements[this.view.SELECT_UP];
    var selectDown = viewElements[this.view.SELECT_DOWN];
    var findGame = viewElements[this.view.FIND_GAME];
    
    this.registerListener(backButton, function() {
        var menuController = this.controllerStore.get("menuController");
        menuController.loadView();
    }.bind(this));
    
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
        var findGameController = this.controllerStore.get("findGameController");
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
            var playerController = this.controllerStore.get('playerController');
            playerController.setPlayerData(playerData);
            var diceController = this.controllerStore.get('diceController');
            var questionController = this.controllerStore.get('questionController');
            questionController.setPlayerController(playerController);
            var turnController = this.controllerStore.get('turnController');
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
        var menuController = this.controllerStore.get('menuController');
        menuController.loadView();
    }.bind(this));
    
};

module.exports = HelpController;
},{}],10:[function(require,module,exports){
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
        var avatarSelectionController = this.controllerStore.get('avatarSelectionController');
        avatarSelectionController.loadView();
    }.bind(this));
    
    this.registerListener(helpButton, function() {
        var helpController = this.controllerStore.get('helpController');
        helpController.loadView();
    }.bind(this));
};

module.exports = MenuController;
},{}],11:[function(require,module,exports){
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
        var avatarSelectionController = this.controllerStore.get('avatarSelectionController');
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
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"./SoundManager":3,"./constant/SocketConstants":4,"./controller/AvatarSelectionController":5,"./controller/Controller":6,"./controller/FindGameController":7,"./controller/GameController":8,"./controller/HelpController":9,"./controller/MenuController":10,"./controller/TurnController":11,"./controller/subcontroller/DiceController":12,"./controller/subcontroller/PlayerController":13,"./controller/subcontroller/QuestionController":14,"./loader/BucketLoader":16,"./loader/ImageLoader":17,"./loader/JsonLoader":18,"./loader/ViewLoader":19,"./store/ControllerStore":20,"./store/SpriteStore":21,"./util/Display":22,"./view/AvatarSelectionView":23,"./view/FindGameView":24,"./view/HelpView":25,"./view/LoadingView":26,"./view/MenuView":27,"./view/View":28,"./view/subview/AvatarView":29,"./view/subview/DiceView":30,"./view/subview/PlayerView":31,"./view/subview/QuestionView":32,"./view/subview/WinView":33,"dup":1}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
var ControllerStore = function() {
    
    var controllers = [];
    
    (function() {
        controllers.menuController = new MenuController();
        controllers.avatarSelectionController = new AvatarSelectionController();
        controllers.helpController = new HelpController();
        controllers.findGameController = new FindGameController();
        controllers.diceController = new DiceController();
        controllers.playerController = new PlayerController();
        controllers.questionController = new QuestionController();
        controllers.turnController = new TurnController();
    })();
    
    return {
        get: function(controllerName) {
            return controllers[controllerName];
        }
    };
};

module.exports = ControllerStore;
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
var Display = {
    bucket: null,
    scale: null,
    resourcePath: null,
    orientation: null
};

module.exports = Display;
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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


},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
},{}],33:[function(require,module,exports){
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
},{}]},{},[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvSW1wb3J0cy5qcyIsInNyYy9NYWluLmpzIiwic3JjL1NvdW5kTWFuYWdlci5qcyIsInNyYy9jb25zdGFudC9Tb2NrZXRDb25zdGFudHMuanMiLCJzcmMvY29udHJvbGxlci9BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0ZpbmRHYW1lQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0dhbWVDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvSGVscENvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9NZW51Q29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1R1cm5Db250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9EaWNlQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUXVlc3Rpb25Db250cm9sbGVyLmpzIiwic3JjL2xvYWRlci9CdWNrZXRMb2FkZXIuanMiLCJzcmMvbG9hZGVyL0ltYWdlTG9hZGVyLmpzIiwic3JjL2xvYWRlci9Kc29uTG9hZGVyLmpzIiwic3JjL2xvYWRlci9WaWV3TG9hZGVyLmpzIiwic3JjL3N0b3JlL0NvbnRyb2xsZXJTdG9yZS5qcyIsInNyYy9zdG9yZS9TcHJpdGVTdG9yZS5qcyIsInNyYy91dGlsL0Rpc3BsYXkuanMiLCJzcmMvdmlldy9BdmF0YXJTZWxlY3Rpb25WaWV3LmpzIiwic3JjL3ZpZXcvRmluZEdhbWVWaWV3LmpzIiwic3JjL3ZpZXcvSGVscFZpZXcuanMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy5qcyIsInNyYy92aWV3L01lbnVWaWV3LmpzIiwic3JjL3ZpZXcvVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvQXZhdGFyVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvRGljZVZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1BsYXllclZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1F1ZXN0aW9uVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvV2luVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkRpc3BsYXkgPSByZXF1aXJlKCcuL3V0aWwvRGlzcGxheScpO1xuU29ja2V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudC9Tb2NrZXRDb25zdGFudHMnKTtcblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvVmlldycpO1xuTG9hZGluZ1ZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvTG9hZGluZ1ZpZXcnKTtcbkJ1Y2tldExvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL0J1Y2tldExvYWRlcicpO1xuSnNvbkxvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL0pzb25Mb2FkZXInKTtcbkltYWdlTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvSW1hZ2VMb2FkZXInKTtcblZpZXdMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9WaWV3TG9hZGVyJyk7XG5Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0NvbnRyb2xsZXInKTtcbkhlbHBWaWV3ID0gcmVxdWlyZSgnLi92aWV3L0hlbHBWaWV3Jyk7XG5IZWxwQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9IZWxwQ29udHJvbGxlcicpO1xuTWVudVZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvTWVudVZpZXcnKTtcbk1lbnVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL01lbnVDb250cm9sbGVyJyk7XG5BdmF0YXJTZWxlY3Rpb25WaWV3ID0gcmVxdWlyZSgnLi92aWV3L0F2YXRhclNlbGVjdGlvblZpZXcnKTtcbkF2YXRhclZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9BdmF0YXJWaWV3Jyk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0F2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXInKTtcbkZpbmRHYW1lVmlldyA9IHJlcXVpcmUoJy4vdmlldy9GaW5kR2FtZVZpZXcnKTtcbkZpbmRHYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9GaW5kR2FtZUNvbnRyb2xsZXInKTtcblNvdW5kTWFuYWdlciA9IHJlcXVpcmUoJy4vU291bmRNYW5hZ2VyJyk7XG5HYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9HYW1lQ29udHJvbGxlcicpO1xuRGljZVZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9EaWNlVmlldycpO1xuRGljZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9EaWNlQ29udHJvbGxlcicpO1xuUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvUXVlc3Rpb25WaWV3Jyk7XG5RdWVzdGlvbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9RdWVzdGlvbkNvbnRyb2xsZXInKTtcblBsYXllclZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9QbGF5ZXJWaWV3Jyk7XG5QbGF5ZXJDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlcicpO1xuV2luVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L1dpblZpZXcnKTtcblR1cm5Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL1R1cm5Db250cm9sbGVyJyk7XG5Db250cm9sbGVyU3RvcmUgPSByZXF1aXJlKCcuL3N0b3JlL0NvbnRyb2xsZXJTdG9yZScpO1xuU3ByaXRlU3RvcmUgPSByZXF1aXJlKCcuL3N0b3JlL1Nwcml0ZVN0b3JlJyk7IiwiSW1wb3J0cyA9IHJlcXVpcmUoJy4vSW1wb3J0cycpO1xud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIHZhciBERUZBVUxUX1dJRFRIID0gNDgwO1xuICAgIHZhciBERUZBVUxUX0hFSUdIVCA9IDMyMDtcbiAgICB2YXIgUkVOREVSRVJfQkFDS0dST1VORF9DT0xPVVIgPSAweDAwMDAwMDtcbiAgICB2YXIgRElWX0lEID0gXCJnYW1lXCI7XG4gICAgXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkluaXRpYXRlZCBidWNrZXQgbG9hZGVyLlwiKTtcbiAgICAgICAgbmV3IEJ1Y2tldExvYWRlcihsb2FkTGF5b3V0LCBidWNrZXRMb2FkaW5nRmFpbGVkTWVzc2FnZSk7XG4gICAgfSkoKTtcbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkTGF5b3V0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbGF5b3V0XCIpO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS8nICsgRGlzcGxheS5idWNrZXQud2lkdGggKyAneCcgKyBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQgKyAnL2xheW91dC5qc29uJywgc2V0TGF5b3V0RGF0YUluUElYSSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldExheW91dERhdGFJblBJWEkobGF5b3V0RGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNldHRpbmcgbGF5b3V0LlwiKTtcbiAgICAgICAgUElYSS5Db250YWluZXIubGF5b3V0RGF0YSA9IGxheW91dERhdGE7XG4gICAgICAgIHZhciBzcHJpdGVTdG9yZSA9IG5ldyBTcHJpdGVTdG9yZSgpO1xuICAgICAgICBWaWV3LnByb3RvdHlwZS5zcHJpdGVTdG9yZSA9IHNwcml0ZVN0b3JlO1xuICAgICAgICBzdGFydFJlbmRlcmluZygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzdGFydFJlbmRlcmluZygpIHtcbiAgICAgICAgdmFyIHJlbmRlcmVyT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGFudGlhbGlhc2luZzpmYWxzZSxcbiAgICAgICAgICAgIHJlc29sdXRpb246MSxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjpSRU5ERVJFUl9CQUNLR1JPVU5EX0NPTE9VUlxuICAgICAgICB9O1xuICAgICAgICB2YXIgdmlld0xvYWRlciA9IG5ldyBWaWV3TG9hZGVyKCk7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgICAgICAgY29udGFpbmVyLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdmFyIHJlbmRlcmVyID0gbmV3IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKHdpbmRvdy5pbm5lcldpZHRoICogRGlzcGxheS5zY2FsZSwgd2luZG93LmlubmVySGVpZ2h0ICogRGlzcGxheS5zY2FsZSwgcmVuZGVyZXJPcHRpb25zKTtcbiAgICAgICAgcmVuZGVyZXIucm91bmRQaXhlbHMgPSB0cnVlO1xuICAgICAgICBzZXREZXBlbmRlbmNpZXModmlld0xvYWRlciwgY29udGFpbmVyLCByZW5kZXJlcik7XG4gICAgICAgIGFwcGVuZEdhbWVUb0RPTShyZW5kZXJlcik7XG4gICAgICAgIGJlZ2luQW5pbWF0aW9uKHZpZXdMb2FkZXIpO1xuICAgICAgICBhZGRMb2FkaW5nVmlld1RvU2NyZWVuKHZpZXdMb2FkZXIpO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS9xdWVzdGlvbnMuanNvbicsIHNldFF1ZXN0aW9uRGF0YUluUXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0UXVlc3Rpb25EYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIocXVlc3Rpb25EYXRhKSB7XG4gICAgICAgIFF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUucXVlc3Rpb25EYXRhID0gcXVlc3Rpb25EYXRhO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS9jYXRlZ29yaWVzLmpzb24nLCBzZXRDYXRlZ29yeURhdGFJblF1ZXN0aW9uQ29udHJvbGxlcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldENhdGVnb3J5RGF0YUluUXVlc3Rpb25Db250cm9sbGVyKGNhdGVnb3J5RGF0YSkge1xuICAgICAgICBRdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNhdGVnb3J5RGF0YSA9IGNhdGVnb3J5RGF0YTtcbiAgICAgICAgbG9hZEltYWdlcygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc3BsYXkgcmVzb3VyY2UgcGF0aDogXCIgKyBEaXNwbGF5LnJlc291cmNlUGF0aCk7XG4gICAgICAgIG5ldyBJbWFnZUxvYWRlcihEaXNwbGF5LnJlc291cmNlUGF0aCArICcvaW1hZ2VzLmpzb24nLCBiZWdpbkdhbWUpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBhcHBlbmRHYW1lVG9ET00ocmVuZGVyZXIpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRElWX0lEKS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0RGVwZW5kZW5jaWVzKHZpZXdMb2FkZXIsIGNvbnRhaW5lciwgcmVuZGVyZXIpIHtcbiAgICAgICAgdmlld0xvYWRlci5zZXRDb250YWluZXIoY29udGFpbmVyKTtcbiAgICAgICAgdmlld0xvYWRlci5zZXRSZW5kZXJlcihyZW5kZXJlcik7XG4gICAgICAgIENvbnRyb2xsZXIuc2V0Vmlld0xvYWRlcih2aWV3TG9hZGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYmVnaW5BbmltYXRpb24odmlld0xvYWRlcikge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodmlld0xvYWRlci5hbmltYXRlKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYmVnaW5HYW1lKCkge1xuICAgICAgICB2YXIgY29udHJvbGxlclN0b3JlID0gbmV3IENvbnRyb2xsZXJTdG9yZSgpO1xuICAgICAgICBDb250cm9sbGVyLnByb3RvdHlwZS5jb250cm9sbGVyU3RvcmUgPSBjb250cm9sbGVyU3RvcmU7XG4gICAgICAgIHZhciBtZW51Q29udHJvbGxlciA9IGNvbnRyb2xsZXJTdG9yZS5nZXQoJ21lbnVDb250cm9sbGVyJyk7XG4gICAgICAgIG1lbnVDb250cm9sbGVyLmxvYWRWaWV3KCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFkZExvYWRpbmdWaWV3VG9TY3JlZW4odmlld0xvYWRlcikge1xuICAgICAgICB2YXIgbG9hZGluZ1ZpZXcgPSBuZXcgTG9hZGluZ1ZpZXcoKTtcbiAgICAgICAgbG9hZGluZ1ZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICAgICAgdmlld0xvYWRlci5sb2FkVmlldyhsb2FkaW5nVmlldyk7XG4gICAgfVxuICAgICAgICBcbiAgICBmdW5jdGlvbiBidWNrZXRMb2FkaW5nRmFpbGVkTWVzc2FnZSgpIHtcbiAgICAgICAgRGlzcGxheS5idWNrZXQuaGVpZ2h0ID0gREVGQVVMVF9IRUlHSFQ7XG4gICAgICAgIERpc3BsYXkuYnVja2V0LndpZHRoID0gREVGQVVMVF9XSURUSDtcbiAgICAgICAgRGlzcGxheS5zY2FsZSA9IDE7XG4gICAgICAgIERpc3BsYXkucmVzb3VyY2VQYXRoID0gREVGQVVMVF9XSURUSCArICd4JyArIERFRkFVTFRfSEVJR0hUO1xuICAgIH1cbn07IiwiZnVuY3Rpb24gU291bmRNYW5hZ2VyKCkge1xuICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jb3JyZWN0QW5zd2VyU291bmQgPSBuZXcgSG93bCh7dXJsczogW1wicmVzb3VyY2Uvc291bmQvY29ycmVjdC1hbnN3ZXIubXAzXCJdfSk7XG4gICAgICAgIHRoaXMud3JvbmdBbnN3ZXJTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC93cm9uZy1hbnN3ZXIubXAzXCJdfSk7XG4gICAgICAgIHRoaXMucm9sbERpY2VTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC9yb2xsLWRpY2UubXAzXCJdfSk7XG4gICAgICAgIHRoaXMudGlja1NvdW5kID0gbmV3IEhvd2woe3VybHM6IFtcInJlc291cmNlL3NvdW5kL3RpY2subXAzXCJdfSk7XG4gICAgfS5iaW5kKHRoaXMpKSgpO1xuICAgIFxuICAgIHRoaXMucGxheUNvcnJlY3RBbnN3ZXJTb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvcnJlY3RBbnN3ZXJTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlXcm9uZ0Fuc3dlclNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMud3JvbmdBbnN3ZXJTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlSb2xsRGljZVNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucm9sbERpY2VTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlUaWNrU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50aWNrU291bmQucGxheSgpO1xuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmRNYW5hZ2VyOyIsInZhciBTb2NrZXRDb25zdGFudHMgPSB7XG4gICAgJ29uJyA6IHtcbiAgICAgICAgJ1BMQVlFUlNfSEVBTFRIJyA6ICdwbGF5ZXJzLWhlYWx0aCcsXG4gICAgICAgICdESUNFX05VTUJFUicgOiAnZGljZS1udW1iZXInLFxuICAgICAgICAnUkFORE9NX1FVRVNUSU9OJyA6ICdyYW5kb20tcXVlc3Rpb24nLFxuICAgICAgICAnSU5JVF9ORVdfVFVSTicgOiAnaW5pdC1uZXctdHVybicsXG4gICAgICAgICdEQU1BR0VfREVBTFQnIDogJ2RhbWFnZS1kZWFsdCcsXG4gICAgICAgICdTSFVGRkxFRF9BTlNXRVJfSU5ESUNFUycgOiAnc2h1ZmZsZWQtYW5zd2VyLWluZGljZXMnLFxuICAgICAgICAnR0FNRV9GT1VORCcgOiAnZ2FtZS1mb3VuZCcsXG4gICAgICAgICdHQU1FX1NUQVRTJyA6ICdnYW1lLXN0YXRzJ1xuICAgIH0sXG4gICAgXG4gICAgJ2VtaXQnIDoge1xuICAgICAgICAnQ09OTkVDVElPTicgOiAnY29ubmVjdGlvbicsXG4gICAgICAgICdGSU5ESU5HX0dBTUUnIDogJ2ZpbmRpbmctZ2FtZScsXG4gICAgICAgICdHRVRfUExBWUVSU19IRUFMVEgnIDogJ2dldC1wbGF5ZXJzLWhlYWx0aCcsXG4gICAgICAgICdESVNDT05ORUNUJyA6ICdkaXNjb25uZWN0JyxcbiAgICAgICAgJ1JPTExfRElDRScgOiAncm9sbC1kaWNlJyxcbiAgICAgICAgJ0dFVF9SQU5ET01fUVVFU1RJT04nIDogJ2dldC1yYW5kb20tcXVlc3Rpb24nLFxuICAgICAgICAnTkVXX1RVUk4nIDogJ25ldy10dXJuJyxcbiAgICAgICAgJ0RFQUxfREFNQUdFJyA6ICdkZWFsLWRhbWFnZScsXG4gICAgICAgICdTSFVGRkxFX0FOU1dFUl9JTkRJQ0VTJyA6ICdzaHVmZmxlLWFuc3dlci1pbmRpY2VzJyxcbiAgICAgICAgJ0dBTUVfRU5ERUQnIDogJ2dhbWUtZW5kZWQnXG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb2NrZXRDb25zdGFudHM7IiwiQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBBdmF0YXJTZWxlY3Rpb25WaWV3KCk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZWxlY3RlZEF2YXRhclZpZXcgPSBuZXcgQXZhdGFyVmlldygpO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuYXZhdGFycyA9IFsnZW1vamlBbmdlbCcsICdlbW9qaUJpZ1NtaWxlJywgJ2Vtb2ppQ29vbCcsICdlbW9qaUdyaW4nLCAnZW1vamlIYXBweScsICdlbW9qaUtpc3MnLCAnZW1vamlMYXVnaGluZycsICdlbW9qaUxvdmUnLCAnZW1vamlNb25rZXknLCAnZW1vamlQb28nLCAnZW1vamlTY3JlYW0nLCAnZW1vamlTbGVlcCcsICdlbW9qaVNtaWxlJywgJ2Vtb2ppU2xlZXAnLCAnZW1vamlXaW5rJ107XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5jdXJyZW50QXZhdGFySW5kZXggPSAwO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuYW1JU2V0ID0gXCJOb1wiO1xuXG5mdW5jdGlvbiBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbn1cblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNsZWFuVmlldygpO1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3LmNyZWF0ZUF2YXRhcih0aGlzLmF2YXRhcnNbdGhpcy5jdXJyZW50QXZhdGFySW5kZXhdKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZXdFbGVtZW50cyA9IHRoaXMudmlldy5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cygpOyAgXG4gICAgdmFyIGJhY2tCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LkJBQ0tfQlVUVE9OXTtcbiAgICB2YXIgc2VsZWN0VXAgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlNFTEVDVF9VUF07XG4gICAgdmFyIHNlbGVjdERvd24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlNFTEVDVF9ET1dOXTtcbiAgICB2YXIgZmluZEdhbWUgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LkZJTkRfR0FNRV07XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGJhY2tCdXR0b24sIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWVudUNvbnRyb2xsZXIgPSB0aGlzLmNvbnRyb2xsZXJTdG9yZS5nZXQoXCJtZW51Q29udHJvbGxlclwiKTtcbiAgICAgICAgbWVudUNvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihzZWxlY3RVcCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBVUCA9IDE7XG4gICAgICAgIHRoaXMuc2V0dXBOZXh0QXZhdGFyKFVQKTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHNlbGVjdERvd24sIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgRE9XTiA9IC0xO1xuICAgICAgICB0aGlzLnNldHVwTmV4dEF2YXRhcihET1dOKTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy5zZWxlY3RlZEF2YXRhclZpZXcpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGZpbmRHYW1lLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF2YXRhciA9IHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF07XG4gICAgICAgIHZhciBmaW5kR2FtZUNvbnRyb2xsZXIgPSB0aGlzLmNvbnRyb2xsZXJTdG9yZS5nZXQoXCJmaW5kR2FtZUNvbnRyb2xsZXJcIik7XG4gICAgICAgIGZpbmRHYW1lQ29udHJvbGxlci5sb2FkVmlldyhhdmF0YXIpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cE5leHRBdmF0YXIgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcbiAgICBpZih0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCA+PSAodGhpcy5hdmF0YXJzLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEF2YXRhckluZGV4ID0gMDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudEF2YXRhckluZGV4ICsgZGlyZWN0aW9uIDwgMCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCA9ICh0aGlzLmF2YXRhcnMubGVuZ3RoIC0gMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXZhdGFySW5kZXggPSB0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCArIGRpcmVjdGlvbjtcbiAgICB9XG4gICBcbiAgICB0aGlzLnNlbGVjdGVkQXZhdGFyVmlldy5jcmVhdGVBdmF0YXIodGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcjsiLCJmdW5jdGlvbiBDb250cm9sbGVyKCkge31cblxuQ29udHJvbGxlci5zZXRWaWV3TG9hZGVyID0gZnVuY3Rpb24odmlld0xvYWRlcikge1xuICAgIENvbnRyb2xsZXIucHJvdG90eXBlLnZpZXdMb2FkZXIgPSB2aWV3TG9hZGVyO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuc29ja2V0ID0gaW8oKTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJMaXN0ZW5lciA9IGZ1bmN0aW9uKHZpZXdFbGVtZW50LCBhY3Rpb24pIHtcbiAgICB2aWV3RWxlbWVudC50b3VjaGVuZCA9IHZpZXdFbGVtZW50LmNsaWNrID0gYWN0aW9uO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJNdWx0aXBsZUxpc3RlbmVycyA9IGZ1bmN0aW9uKHZpZXdFbGVtZW50cywgYWN0aW9uKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHZpZXdFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIodmlld0VsZW1lbnRzW2ldLCBhY3Rpb24pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlcjsiLCJGaW5kR2FtZUNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBGaW5kR2FtZUNvbnRyb2xsZXI7XG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgRmluZEdhbWVWaWV3KCk7XG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmF2YXRhciA9IG51bGw7XG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLlRSQU5TSVRJT05fVE9fR0FNRV9USU1FID0gMzAwMDtcblxuZnVuY3Rpb24gRmluZEdhbWVDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG59XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICB0aGlzLmF2YXRhciA9IGF2YXRhcjtcbiAgICB0aGlzLmNsZWFuVmlldygpO1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cyh0aGlzLmF2YXRhcik7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5GSU5ESU5HX0dBTUUsIHthdmF0YXI6IHRoaXMuYXZhdGFyfSk7XG59O1xuXG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkdBTUVfRk9VTkQsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5hc3NpZ25BdmF0YXJzKHBsYXllckRhdGEpO1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlR2FtZUZvdW5kQ2FwdGlvbigpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgICAgICAgICB2YXIgcGxheWVyQ29udHJvbGxlciA9IHRoaXMuY29udHJvbGxlclN0b3JlLmdldCgncGxheWVyQ29udHJvbGxlcicpO1xuICAgICAgICAgICAgcGxheWVyQ29udHJvbGxlci5zZXRQbGF5ZXJEYXRhKHBsYXllckRhdGEpO1xuICAgICAgICAgICAgdmFyIGRpY2VDb250cm9sbGVyID0gdGhpcy5jb250cm9sbGVyU3RvcmUuZ2V0KCdkaWNlQ29udHJvbGxlcicpO1xuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uQ29udHJvbGxlciA9IHRoaXMuY29udHJvbGxlclN0b3JlLmdldCgncXVlc3Rpb25Db250cm9sbGVyJyk7XG4gICAgICAgICAgICBxdWVzdGlvbkNvbnRyb2xsZXIuc2V0UGxheWVyQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyKTtcbiAgICAgICAgICAgIHZhciB0dXJuQ29udHJvbGxlciA9IHRoaXMuY29udHJvbGxlclN0b3JlLmdldCgndHVybkNvbnRyb2xsZXInKTtcbiAgICAgICAgICAgIHR1cm5Db250cm9sbGVyLnNldENvbnRyb2xsZXJEZXBlbmRlbmNpZXMocGxheWVyQ29udHJvbGxlciwgZGljZUNvbnRyb2xsZXIsIHF1ZXN0aW9uQ29udHJvbGxlcik7XG4gICAgICAgICAgICB0dXJuQ29udHJvbGxlci5pbml0aWF0ZSgpO1xuICAgICAgICB9LmJpbmQodGhpcyksIHRoaXMuVFJBTlNJVElPTl9UT19HQU1FX1RJTUUpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmFzc2lnbkF2YXRhcnMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHNvY2tldElkUHJlZml4ID0gXCIvI1wiO1xuICAgIHZhciBzb2NrZXRJZCA9IHNvY2tldElkUHJlZml4ICsgdGhpcy5zb2NrZXQuaWQ7XG4gICAgaWYoZGF0YS5wbGF5ZXIxSWQgPT09IHNvY2tldElkKSB7XG4gICAgICAgIHRoaXMudmlldy5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyKGRhdGEucGxheWVyMkF2YXRhcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52aWV3LmNyZWF0ZVBsYXllcjJBY3R1YWxBdmF0YXIoZGF0YS5wbGF5ZXIxQXZhdGFyKTtcbiAgICB9XG59O1xuXG5GaW5kR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaW5kR2FtZUNvbnRyb2xsZXI7IiwiR2FtZUNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBHYW1lQ29udHJvbGxlcjtcbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBHYW1lQ29udHJvbGxlcihwbGF5ZXJEYXRhKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xufVxuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc2V0UGxheWVyRGF0YSA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICBHYW1lQ29udHJvbGxlci5wcm90b3R5cGUucGxheWVyRGF0YSA9IHBsYXllckRhdGE7XG59O1xuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc2V0RGljZU51bWJlciA9IGZ1bmN0aW9uKGRpY2VOdW1iZXIpIHtcbiAgICBHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuZGljZU51bWJlciA9IGRpY2VOdW1iZXI7XG59O1xuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuaXNQbGF5ZXIxID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNvY2tldFByZWZpeCA9IFwiLyNcIjtcbiAgICByZXR1cm4gdGhpcy5wbGF5ZXJEYXRhLnBsYXllcjFJZCA9PT0gKHNvY2tldFByZWZpeCArIEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zb2NrZXQuaWQpO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmdldFBsYXllciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlzUGxheWVyMSh0aGlzLnBsYXllckRhdGEpID8gXCJQTEFZRVJfMVwiIDogXCJQTEFZRVJfMlwiO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmdldE9wcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNQbGF5ZXIxKHRoaXMucGxheWVyRGF0YSkgPyBcIlBMQVlFUl8yXCIgOiBcIlBMQVlFUl8xXCI7XG59O1xuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc291bmRNYW5hZ2VyID0gbmV3IFNvdW5kTWFuYWdlcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVDb250cm9sbGVyOyIsIkhlbHBDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gSGVscENvbnRyb2xsZXI7XG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbkhlbHBDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEhlbHBWaWV3KCk7XG5cbmZ1bmN0aW9uIEhlbHBDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbn1cblxuSGVscENvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKCk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xufTtcblxuSGVscENvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZXdFbGVtZW50cyA9IHRoaXMudmlldy5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cygpOyAgXG4gICAgdmFyIGJhY2tCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LkJBQ0tfQlVUVE9OXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYmFja0J1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZW51Q29udHJvbGxlciA9IHRoaXMuY29udHJvbGxlclN0b3JlLmdldCgnbWVudUNvbnRyb2xsZXInKTtcbiAgICAgICAgbWVudUNvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZWxwQ29udHJvbGxlcjsiLCJNZW51Q29udHJvbGxlci5jb25zdHJ1Y3RvciA9IE1lbnVDb250cm9sbGVyO1xuTWVudUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5NZW51Q29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBNZW51VmlldygpO1xuXG5mdW5jdGlvbiBNZW51Q29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG59XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbn07XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBwbGF5QnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5QTEFZX0JVVFRPTl07XG4gICAgdmFyIGhlbHBCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LkhFTFBfQlVUVE9OXTtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIocGxheUJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gdGhpcy5jb250cm9sbGVyU3RvcmUuZ2V0KCdhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyJyk7XG4gICAgICAgIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihoZWxwQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhlbHBDb250cm9sbGVyID0gdGhpcy5jb250cm9sbGVyU3RvcmUuZ2V0KCdoZWxwQ29udHJvbGxlcicpO1xuICAgICAgICBoZWxwQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnVDb250cm9sbGVyOyIsIlR1cm5Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gVHVybkNvbnRyb2xsZXI7XG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIFR1cm5Db250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG59XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5pbml0aWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud2luVmlldyA9IG5ldyBXaW5WaWV3KCk7XG4gICAgdGhpcy5jbGVhbkNvbnRyb2xsZXJWaWV3KCk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIHRoaXMubmV3VHVybigpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLnNldENvbnRyb2xsZXJEZXBlbmRlbmNpZXMgPSBmdW5jdGlvbihwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKSB7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyID0gcGxheWVyQ29udHJvbGxlcjtcbiAgICB0aGlzLmRpY2VDb250cm9sbGVyID0gZGljZUNvbnRyb2xsZXI7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIgPSBxdWVzdGlvbkNvbnRyb2xsZXI7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uSU5JVF9ORVdfVFVSTiwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGggPT09IDApIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdBTUVfRU5ERUQsIHt3aW5uZXI6IFwiUExBWUVSXzJcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoID09PSAwKSB7XG4gICAgICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HQU1FX0VOREVELCB7d2lubmVyOiBcIlBMQVlFUl8xXCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdUdXJuKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDE1MDApO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uR0FNRV9TVEFUUywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLmxvYWRXaW5WaWV3KGRhdGEud2lubmVyLCBkYXRhKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRXaW5WaWV3ID0gZnVuY3Rpb24ocGxheWVyLCBkYXRhKSB7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLndpblZpZXcuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy53aW5WaWV3LmNyZWF0ZVdpbm5lclRleHQocGxheWVyLCBkYXRhKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy53aW5WaWV3KTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLndpblZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBwbGF5QWdhaW5CdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy53aW5WaWV3LlBMQVlfQUdBSU5fQlVUVE9OXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIocGxheUFnYWluQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB0aGlzLmRpY2VDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICAgICAgdmFyIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSB0aGlzLmNvbnRyb2xsZXJTdG9yZS5nZXQoJ2F2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXInKTtcbiAgICAgICAgYXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUubmV3VHVybiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5kaWNlQ29udHJvbGxlci5yb2xsRGljZSgpO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB9LmJpbmQodGhpcyksIDMwMDApO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuQ29udHJvbGxlclZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5jaGVja1BsYXllcnNIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9QTEFZRVJTX0hFQUxUSCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFR1cm5Db250cm9sbGVyOyIsIkRpY2VDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gRGljZUNvbnRyb2xsZXI7XG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBEaWNlVmlldygpO1xuXG5mdW5jdGlvbiBEaWNlQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uRElDRV9OVU1CRVIsIGZ1bmN0aW9uKGRpY2UpIHtcbiAgICAgICAgdGhpcy5zb3VuZE1hbmFnZXIucGxheVJvbGxEaWNlU291bmQoKTtcbiAgICAgICAgdGhpcy5sb2FkRGljZShkaWNlLm51bWJlcik7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS5yb2xsRGljZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ST0xMX0RJQ0UpO1xuICAgIH1cbn07XG5cbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkRGljZSA9IGZ1bmN0aW9uKGRpY2VOdW1iZXIpIHtcbiAgICB0aGlzLnZpZXcuc2V0dXBEaWNlKGRpY2VOdW1iZXIpO1xuICAgIHRoaXMuc2V0RGljZU51bWJlcihkaWNlTnVtYmVyKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbn07XG5cbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGljZUNvbnRyb2xsZXI7IiwiUGxheWVyQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IFBsYXllckNvbnRyb2xsZXI7XG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlKTtcblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgUGxheWVyVmlldygpO1xuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUuREFOR0VST1VTX0xFVkVMX0hFQUxUSCA9IDY7XG5cbmZ1bmN0aW9uIFBsYXllckNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXcuc2V0UGxheWVyRGF0YSh0aGlzLnBsYXllckRhdGEpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudXBkYXRlUGxheWVyc0hlYWx0aCgpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xufTtcblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uUExBWUVSU19IRUFMVEgsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5jbGVhckludGVydmFscygpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0UGxheWVyMUhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGgpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0UGxheWVyMkhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjJIZWFsdGgpO1xuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGggPD0gdGhpcy5EQU5HRVJPVVNfTEVWRUxfSEVBTFRIKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuZmxhc2hQbGF5ZXIxSGVhbHRoKHBsYXllckRhdGEucGxheWVyMUhlYWx0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoIDw9IHRoaXMuREFOR0VST1VTX0xFVkVMX0hFQUxUSCkge1xuICAgICAgICAgICAgdGhpcy52aWV3LmZsYXNoUGxheWVyMkhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjJIZWFsdGgpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVBsYXllcnNIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9QTEFZRVJTX0hFQUxUSCk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFySW50ZXJ2YWxzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3LmNsZWFySW50ZXJ2YWxzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllckNvbnRyb2xsZXI7IiwiUXVlc3Rpb25Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gUXVlc3Rpb25Db250cm9sbGVyO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlKTtcblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBRdWVzdGlvblZpZXcoKTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8xID0gJ0FOU1dFUkVEXzEnO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8yID0gJ0FOU1dFUkVEXzInO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8zID0gJ0FOU1dFUkVEXzMnO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF80ID0gJ0FOU1dFUkVEXzQnO1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLlRJTUVfVE9fQU5TV0VSX1FVRVNUSU9OID0gMTA7XG5cbmZ1bmN0aW9uIFF1ZXN0aW9uQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlJBTkRPTV9RVUVTVElPTiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gZGF0YS5xdWVzdGlvbjtcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGRhdGEuY2F0ZWdvcnk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5EQU1BR0VfREVBTFQsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy52aWV3LnNldEFuc3dlclRvQ29sb3VyKHRoaXMuYW5zd2Vyc1twbGF5ZXJEYXRhLmFuc3dlcl0sIHBsYXllckRhdGEuYW5zd2VyKTtcbiAgICAgICAgdGhpcy52aWV3LnNldEFuc3dlclRvQ29sb3VyKHRoaXMuYW5zd2Vyc1t0aGlzLkFOU1dFUkVEXzFdLCB0aGlzLkFOU1dFUkVEXzEpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0V2hvQW5zd2VyZWRRdWVzdGlvbih0aGlzLmFuc3dlcnNbcGxheWVyRGF0YS5hbnN3ZXJdLCBwbGF5ZXJEYXRhLmFuc3dlciwgcGxheWVyRGF0YS5wbGF5ZXJfd2hvX2Fuc3dlcmVkKTtcbiAgICAgICAgdGhpcy52aWV3LnR1cm5PZmZJbnRlcmFjdGl2aXR5Rm9yQW5zd2VyRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLnVwZGF0ZVBsYXllcnNIZWFsdGgoKTtcbiAgICAgICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySW50ZXJ2YWxJZCk7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0Lk5FV19UVVJOKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uU0hVRkZMRURfQU5TV0VSX0lORElDRVMsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy52aWV3LnNldEFuc3dlckluZGljZXMoZGF0YSk7XG4gICAgICAgIHRoaXMudmlldy5kaXNwbGF5Q2F0ZWdvcnlBbmRRdWVzdGlvbih0aGlzLmNhdGVnb3J5LCB0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXRQbGF5ZXJDb250cm9sbGVyID0gZnVuY3Rpb24ocGxheWVyQ29udHJvbGxlcikge1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySW50ZXJ2YWxJZCk7XG4gICAgdGhpcy5nZXRSYW5kb21RdWVzdGlvbigpO1xuICAgIHRoaXMuc2h1ZmZsZUFuc3dlckluZGljZXMoKTtcbiAgICB0aGlzLnVwZGF0ZVRpbWVyKCk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVRpbWVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRpbWVSZW1haW5pbmcgPSAxMDtcbiAgICB2YXIgdGltZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGltZVJlbWFpbmluZyA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlUXVlc3Rpb25UaW1lcih0aW1lUmVtYWluaW5nKTtcbiAgICAgICAgICAgIHRpbWVSZW1haW5pbmctLTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0Lk5FV19UVVJOKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lckludGVydmFsSWQpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuICAgIHRoaXMudGltZXJJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwodGltZXIsIDEwMDApO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5nZXRSYW5kb21RdWVzdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdmFyIGNhdGVnb3JpZXMgPSB0aGlzLmNhdGVnb3J5RGF0YS5DQVRFR09SSUVTO1xuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5xdWVzdGlvbkRhdGEuQ0FURUdPUklFUztcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUkFORE9NX1FVRVNUSU9OLCB7Y2F0ZWdvcmllczogY2F0ZWdvcmllcywgcXVlc3Rpb25zOiBxdWVzdGlvbnN9KTtcbiAgICB9XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuc3dlcnMgPSB0aGlzLmdldFZpZXdBbnN3ZXJzKCk7XG4gICAgdGhpcy5zZXRSaWdodEFuc3dlckxpc3RlbmVyKGFuc3dlcnMpO1xuICAgIHRoaXMuc2V0V3JvbmdBbnN3ZXJMaXN0ZW5lcnMoYW5zd2Vycyk7XG4gICAgdGhpcy5zZXRBbnN3ZXJVcGRhdGVMaXN0ZW5lcihhbnN3ZXJzKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0Vmlld0Fuc3dlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7XG4gICAgdmFyIGFuc3dlcnMgPSB7fTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzEgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlJJR0hUX0FOU1dFUl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8yID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMV07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8zID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF80ID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfM107XG4gICAgcmV0dXJuIGFuc3dlcnM7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFJpZ2h0QW5zd2VyTGlzdGVuZXIgPSBmdW5jdGlvbihhbnN3ZXJzKSB7XG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfMSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRNYW5hZ2VyLnBsYXlDb3JyZWN0QW5zd2VyU291bmQoKTtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvT3Bwb25lbnRUb1NvY2tldCh0aGlzLkFOU1dFUkVEXzEpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFdyb25nQW5zd2VyTGlzdGVuZXJzID0gZnVuY3Rpb24oYW5zd2Vycykge1xuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8yKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzMsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8zKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kTWFuYWdlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF80KTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zaHVmZmxlQW5zd2VySW5kaWNlcyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LlNIVUZGTEVfQU5TV0VSX0lORElDRVMsIHtpbmRpY2VzOiBbMSwyLDMsNF19KTtcbiAgICB9XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldEFuc3dlclVwZGF0ZUxpc3RlbmVyID0gZnVuY3Rpb24oYW5zd2Vycykge1xuICAgIHRoaXMuYW5zd2VycyA9IGFuc3dlcnM7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmVtaXREZWFsRGFtYWdlVG9PcHBvbmVudFRvU29ja2V0ID0gZnVuY3Rpb24oYW5zd2VyKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ERUFMX0RBTUFHRSwge3BsYXllcl93aG9fYW5zd2VyZWQ6IHRoaXMuZ2V0UGxheWVyKCksIHBsYXllcl90b19kYW1hZ2U6IHRoaXMuZ2V0T3Bwb25lbnQoKSwgZGFtYWdlOiB0aGlzLmRpY2VOdW1iZXIsIGFuc3dlcjogYW5zd2VyLCBhbnN3ZXJTdGF0dXM6ICdjb3JyZWN0JywgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnl9KTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZW1pdERlYWxEYW1hZ2VUb1NlbGZUb1NvY2tldCA9IGZ1bmN0aW9uKGFuc3dlcikge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuREVBTF9EQU1BR0UsIHtwbGF5ZXJfd2hvX2Fuc3dlcmVkOiB0aGlzLmdldFBsYXllcigpLCBwbGF5ZXJfdG9fZGFtYWdlOiB0aGlzLmdldFBsYXllcigpLCBkYW1hZ2U6IHRoaXMuZGljZU51bWJlciwgYW5zd2VyOiBhbnN3ZXIsIGFuc3dlclN0YXR1czogJ2luY29ycmVjdCcsIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5fSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbkNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gQnVja2V0TG9hZGVyIChjYWxsYmFjaywgZXJyb3JDYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBQT1JUUkFJVCA9IFwicG9ydHJhaXRcIixcbiAgICAgICAgTEFORFNDQVBFID0gXCJsYW5kc2NhcGVcIixcbiAgICAgICAgQlVDS0VUX1NJWkVfSlNPTl9QQVRIID0gXCJyZXNvdXJjZS9idWNrZXRfc2l6ZXMuanNvblwiO1xuXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbmV3IEpzb25Mb2FkZXIoQlVDS0VUX1NJWkVfSlNPTl9QQVRILCBjYWxjdWxhdGVCZXN0QnVja2V0KTtcbiAgICB9KSgpO1xuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlU2NhbGUgKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5mbG9vcih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyksIDIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUJlc3RCdWNrZXQgKGJ1Y2tldERhdGEpIHtcbiAgICAgICAgdmFyIG9yaWVudGF0aW9uID0gY2FsY3VsYXRlT3JpZW50YXRpb24oKTtcbiAgICAgICAgdmFyIHNjYWxlID0gY2FsY3VsYXRlU2NhbGUoKTtcbiAgICAgICAgaWYoc2NhbGUgPT09IDIpIHtcbiAgICAgICAgICAgIHNjYWxlID0gMS41O1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiT3JpZW50YXRpb24gaXMgXCIgKyBvcmllbnRhdGlvbik7XG4gICAgICAgIGJ1Y2tldERhdGFbb3JpZW50YXRpb25dLmZvckVhY2goZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJCdWNrZXQgaGVpZ2h0OiBcIiArIGJ1Y2tldC5oZWlnaHQgKiBzY2FsZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldpbmRvdyBoZWlnaHQ6IFwiICsgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICAgIGlmIChidWNrZXQuaGVpZ2h0ICogc2NhbGUgPD0gd2luZG93LmlubmVySGVpZ2h0ICkge1xuICAgICAgICAgICAgICAgIERpc3BsYXkuYnVja2V0ID0gYnVja2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIERpc3BsYXkuc2NhbGUgPSBjYWxjdWxhdGVTY2FsZSh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgIERpc3BsYXkucmVzb3VyY2VQYXRoID0gJy4vcmVzb3VyY2UvJyArIERpc3BsYXkuYnVja2V0LndpZHRoICsgJ3gnICsgRGlzcGxheS5idWNrZXQuaGVpZ2h0ICsgJy9zY2FsZS0nICsgRGlzcGxheS5zY2FsZTtcbiAgICAgICAgRGlzcGxheS5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICAgICAgICBleGVjdXRlQ2FsbGJhY2soKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlT3JpZW50YXRpb24gKCkge1xuICAgICAgICBpZiAod2luZG93LmlubmVySGVpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBQT1JUUkFJVDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBMQU5EU0NBUEU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleGVjdXRlQ2FsbGJhY2sgKCkge1xuICAgICAgICBpZiAoRGlzcGxheS5idWNrZXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnVja2V0TG9hZGVyOyIsInZhciBJbWFnZUxvYWRlciA9IGZ1bmN0aW9uKGltYWdlSnNvblBhdGgsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGpzb25Mb2FkZXIgPSBuZXcgSnNvbkxvYWRlcihpbWFnZUpzb25QYXRoLCBsb2FkSW1hZ2VzKTtcbiAgICB2YXIgaW1hZ2VzTG9hZGVkID0gMDtcbiAgICB2YXIgdG90YWxJbWFnZXMgPSAwO1xuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZXMoaW1hZ2VEYXRhKSB7XG4gICAgICAgIHZhciBpbWFnZXMgPSBpbWFnZURhdGEuSU1BR0VTO1xuICAgICAgICBjb3VudE51bWJlck9mSW1hZ2VzKGltYWdlcyk7XG4gICAgICAgIGZvcih2YXIgaW1hZ2UgaW4gaW1hZ2VzKSB7XG4gICAgICAgICAgICBsb2FkSW1hZ2UoaW1hZ2VzW2ltYWdlXS5wYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkSW1hZ2UoaW1hZ2VQYXRoKSB7XG4gICAgICAgIHZhciBSRVFVRVNUX0ZJTklTSEVEID0gNDtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignR0VUJywgaW1hZ2VQYXRoLCB0cnVlKTtcbiAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IFJFUVVFU1RfRklOSVNIRUQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGaW5pc2hlZCBsb2FkaW5nIGltYWdlIHBhdGg6IFwiICsgaW1hZ2VQYXRoKTtcbiAgICAgICAgICAgICAgaW1hZ2VzTG9hZGVkKys7XG4gICAgICAgICAgICAgIGNoZWNrSWZBbGxJbWFnZXNMb2FkZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGNvdW50TnVtYmVyT2ZJbWFnZXMoaW1hZ2VzKSB7XG4gICAgICAgIGZvcih2YXIgaW1hZ2UgaW4gaW1hZ2VzKSB7XG4gICAgICAgICAgICB0b3RhbEltYWdlcysrO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGNoZWNrSWZBbGxJbWFnZXNMb2FkZWQoKSB7XG4gICAgICAgIGlmKGltYWdlc0xvYWRlZCA9PT0gdG90YWxJbWFnZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWxsIGltYWdlcyBsb2FkZWQhXCIpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT25seSBcIiArIGltYWdlc0xvYWRlZCArIFwiIGFyZSBsb2FkZWQuXCIpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZUxvYWRlcjsiLCJ2YXIgSnNvbkxvYWRlciA9IGZ1bmN0aW9uIChwYXRoLCBjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgUkVRVUVTVF9GSU5JU0hFRCA9IDQ7XG4gICAgKGZ1bmN0aW9uIGxvYWRKc29uKCkge1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vdmVycmlkZU1pbWVUeXBlKCdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBwYXRoLCB0cnVlKTtcbiAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IFJFUVVFU1RfRklOSVNIRUQpIHtcbiAgICAgICAgICAgIHRoYXQuZGF0YSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICBjYWxsYmFjayh0aGF0LmRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoYXQuZGF0YTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEpzb25Mb2FkZXI7XG4iLCJmdW5jdGlvbiBWaWV3TG9hZGVyKCkge31cblxuVmlld0xvYWRlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbih2aWV3KSB7XG4gICAgVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lci5hZGRDaGlsZCh2aWV3KTtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnJlbW92ZUFsbFZpZXdzID0gZnVuY3Rpb24oKSB7XG4gICAgVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lci5yZW1vdmVDaGlsZHJlbigpO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUucmVtb3ZlVmlldyA9IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyLnJlbW92ZUNoaWxkKHZpZXcpO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUuc2V0UmVuZGVyZXIgPSBmdW5jdGlvbihyZW5kZXJlcikge1xuICAgIFZpZXdMb2FkZXIucHJvdG90eXBlLnJlbmRlcmVyID0gcmVuZGVyZXI7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5zZXRDb250YWluZXIgPSBmdW5jdGlvbihjb250YWluZXIpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyID0gY29udGFpbmVyO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIFZpZXdMb2FkZXIucHJvdG90eXBlLnJlbmRlcmVyLnJlbmRlcihWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoVmlld0xvYWRlci5wcm90b3R5cGUuYW5pbWF0ZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdMb2FkZXI7IiwidmFyIENvbnRyb2xsZXJTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIHZhciBjb250cm9sbGVycyA9IFtdO1xuICAgIFxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgY29udHJvbGxlcnMubWVudUNvbnRyb2xsZXIgPSBuZXcgTWVudUNvbnRyb2xsZXIoKTtcbiAgICAgICAgY29udHJvbGxlcnMuYXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlciA9IG5ldyBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyKCk7XG4gICAgICAgIGNvbnRyb2xsZXJzLmhlbHBDb250cm9sbGVyID0gbmV3IEhlbHBDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnRyb2xsZXJzLmZpbmRHYW1lQ29udHJvbGxlciA9IG5ldyBGaW5kR2FtZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgY29udHJvbGxlcnMuZGljZUNvbnRyb2xsZXIgPSBuZXcgRGljZUNvbnRyb2xsZXIoKTtcbiAgICAgICAgY29udHJvbGxlcnMucGxheWVyQ29udHJvbGxlciA9IG5ldyBQbGF5ZXJDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnRyb2xsZXJzLnF1ZXN0aW9uQ29udHJvbGxlciA9IG5ldyBRdWVzdGlvbkNvbnRyb2xsZXIoKTtcbiAgICAgICAgY29udHJvbGxlcnMudHVybkNvbnRyb2xsZXIgPSBuZXcgVHVybkNvbnRyb2xsZXIoKTtcbiAgICB9KSgpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oY29udHJvbGxlck5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBjb250cm9sbGVyc1tjb250cm9sbGVyTmFtZV07XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyU3RvcmU7IiwidmFyIFNwcml0ZVN0b3JlID0gZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgdmFyIHNwcml0ZXMgPSBbXTtcbiAgICBcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNwcml0ZXMubG9nbyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2xvZ28uanBnJyk7XG4gICAgICAgIHNwcml0ZXMucGxheUJ1dHRvbiA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL3BsYXktYnV0dG9uLmpwZycpO1xuICAgICAgICBzcHJpdGVzLmhlbHBCdXR0b24gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9oZWxwLWJ1dHRvbi5qcGcnKTtcbiAgICAgICAgc3ByaXRlcy5iYWNrQnV0dG9uID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYmFjay1idXR0b24uanBnJyk7XG4gICAgICAgIHNwcml0ZXMuZG93blRyaWFuZ2xlID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZG93bi10cmlhbmdsZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy51cFRyaWFuZ2xlID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvdXAtdHJpYW5nbGUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZmluZEdhbWUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9maW5kLWdhbWUuanBnJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppQW5nZWwgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktYW5nZWwucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppQmlnU21pbGUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktYmlnLXNtaWxlLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaUNvb2wgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktY29vbC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlHcmluID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWdyaW4ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppSGFwcHkgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktaGFwcHkucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppS2lzcyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1raXNzLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaUxhdWdoaW5nID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWxhdWdoaW5nLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaUxvdmUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktbG92ZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlNb25rZXkgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktbW9ua2V5LnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaVBvbyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1wb28ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppU2NyZWFtID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLXNjcmVhbS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlTbGVlcCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbGVlcC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlTbWlsZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbWlsZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlTbGVlcCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbGVlcC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlXaW5rID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLXdpbmsucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppQW5nZWwgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktYW5nZWwucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppQmlnU21pbGUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktYmlnLXNtaWxlLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaUNvb2wgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktY29vbC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlHcmluID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWdyaW4ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppSGFwcHkgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktaGFwcHkucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppS2lzcyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1raXNzLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaUxhdWdoaW5nID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWxhdWdoaW5nLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaUxvdmUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktbG92ZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlNb25rZXkgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktbW9ua2V5LnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaVBvbyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1wb28ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppU2NyZWFtID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLXNjcmVhbS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlTbGVlcCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbGVlcC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlTbWlsZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbWlsZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlTbGVlcCA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zbGVlcC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlXaW5rID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLXdpbmsucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucXVlc3Rpb25NYXJrID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvcXVlc3Rpb24tbWFyay5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5kaWNlRmFjZTEgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9kaWNlL2RpY2UtZmFjZS0xLnBuZycpO1xuICAgICAgICBzcHJpdGVzLmRpY2VGYWNlMiA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2RpY2UvZGljZS1mYWNlLTIucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZGljZUZhY2UzID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZGljZS9kaWNlLWZhY2UtMy5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5kaWNlRmFjZTQgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9kaWNlL2RpY2UtZmFjZS00LnBuZycpO1xuICAgICAgICBzcHJpdGVzLmRpY2VGYWNlNSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2RpY2UvZGljZS1mYWNlLTUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZGljZUZhY2U2ID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZGljZS9kaWNlLWZhY2UtNi5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5QWdhaW4gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9wbGF5LWFnYWluLnBuZycpO1xuICAgIH0pKCk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihzcHJpdGVOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gc3ByaXRlc1tzcHJpdGVOYW1lXTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwcml0ZVN0b3JlOyIsInZhciBEaXNwbGF5ID0ge1xuICAgIGJ1Y2tldDogbnVsbCxcbiAgICBzY2FsZTogbnVsbCxcbiAgICByZXNvdXJjZVBhdGg6IG51bGwsXG4gICAgb3JpZW50YXRpb246IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGxheTsiLCJBdmF0YXJTZWxlY3Rpb25WaWV3LmNvbnN0cnVjdG9yID0gQXZhdGFyU2VsZWN0aW9uVmlldztcbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLkJBQ0tfQlVUVE9OID0gMDtcbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLlNFTEVDVF9VUCA9IDE7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5TRUxFQ1RfRE9XTiA9IDI7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5GSU5EX0dBTUUgPSAzO1xuXG5cbmZ1bmN0aW9uIEF2YXRhclNlbGVjdGlvblZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZUxvZ28oKTtcbiAgICB0aGlzLmNyZWF0ZUJhY2tCdXR0b24oKTtcbiAgICB0aGlzLmNyZWF0ZVNlbGVjdERvd25CdXR0b24oKTtcbiAgICB0aGlzLmNyZWF0ZVNlbGVjdFVwQnV0dG9uKCk7XG4gICAgdGhpcy5jcmVhdGVGaW5kR2FtZUJ1dHRvbigpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlTG9nbyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGxvZ28gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnbG9nbycpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGxvZ28sIDUwLCAxMCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIobG9nbyk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVCYWNrQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmJhY2tCdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnYmFja0J1dHRvbicpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYmFja0J1dHRvbiwgNjksIDgwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmJhY2tCdXR0b24pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlU2VsZWN0RG93bkJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5zZWxlY3REb3duQnV0dG9uID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2Rvd25UcmlhbmdsZScpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuc2VsZWN0RG93bkJ1dHRvbiwgMjQsIDg1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnNlbGVjdERvd25CdXR0b24pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlU2VsZWN0VXBCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuc2VsZWN0VXBCdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgndXBUcmlhbmdsZScpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuc2VsZWN0VXBCdXR0b24sIDI0LCAzNSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5zZWxlY3RVcEJ1dHRvbik7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVGaW5kR2FtZUJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5maW5kR2FtZUJ1dHRvbiA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdmaW5kR2FtZScpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuZmluZEdhbWVCdXR0b24sIDY5LCA0OCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5maW5kR2FtZUJ1dHRvbik7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5iYWNrQnV0dG9uLCB0aGlzLnNlbGVjdFVwQnV0dG9uLCB0aGlzLnNlbGVjdERvd25CdXR0b24sIHRoaXMuZmluZEdhbWVCdXR0b25dO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdmF0YXJTZWxlY3Rpb25WaWV3OyIsIkZpbmRHYW1lVmlldy5jb25zdHJ1Y3RvciA9IEZpbmRHYW1lVmlldztcbkZpbmRHYW1lVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gRmluZEdhbWVWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICB2YXIgbGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRklORF9HQU1FO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlRmluZEdhbWVDYXB0aW9uKGxheW91dERhdGEuQ0FQVElPTik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxQXZhdGFyKGF2YXRhcik7XG4gICAgdGhpcy5jcmVhdGVWZXJzdXNUZXh0KGxheW91dERhdGEuVkVSU1VTKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJVbmtub3duQXZhdGFyKCk7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxVGV4dChsYXlvdXREYXRhLlBMQVlFUl8xKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJUZXh0KGxheW91dERhdGEuUExBWUVSXzIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVGaW5kR2FtZUNhcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuZmluZEdhbWVDYXB0aW9uID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmZpbmRHYW1lQ2FwdGlvbiwgNTAsIDE1KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmZpbmRHYW1lQ2FwdGlvbik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFBdmF0YXIgPSBmdW5jdGlvbiAoYXZhdGFyKSB7XG4gICAgdGhpcy5wbGF5ZXIxQXZhdGFyID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ3BsYXllcjEnICsgYXZhdGFyKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjFBdmF0YXIsIDI1LCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxQXZhdGFyKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlVmVyc3VzVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHZlcnN1cyA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodmVyc3VzLCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHZlcnN1cyk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJVbmtub3duQXZhdGFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwbGF5ZXIyVW5rbm93bkF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdxdWVzdGlvbk1hcmsnKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIyVW5rbm93bkF2YXRhciwgNzUsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyVW5rbm93bkF2YXRhcik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgcGxheWVyMSA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMSwgMjUsIDc0KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIxKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMlRleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBwbGF5ZXIyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChwbGF5ZXIyLCA3NSwgNzQpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyID0gZnVuY3Rpb24gKGF2YXRhcikge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjJVbmtub3duQXZhdGFyKTtcbiAgICB2YXIgcGxheWVyMkFjdHVhbEF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5ZXIyJyArIGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMkFjdHVhbEF2YXRhciwgNzUsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyQWN0dWFsQXZhdGFyKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlR2FtZUZvdW5kQ2FwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5maW5kR2FtZUNhcHRpb24pO1xuICAgIHZhciBmb3VuZEdhbWVDYXB0aW9uID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkZJTkRfR0FNRS5GT1VORF9HQU1FX0NBUFRJT04pO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGZvdW5kR2FtZUNhcHRpb24sIDUwLCAxNSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoZm91bmRHYW1lQ2FwdGlvbik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmluZEdhbWVWaWV3OyIsIkhlbHBWaWV3LmNvbnN0cnVjdG9yID0gSGVscFZpZXc7XG5IZWxwVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuSGVscFZpZXcucHJvdG90eXBlLkJBQ0tfQlVUVE9OID0gMDtcblxuZnVuY3Rpb24gSGVscFZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuSGVscFZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkhFTFA7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVIZWxwVGV4dChsYXlvdXREYXRhLklORk8pO1xuICAgIHRoaXMuY3JlYXRlQmFja0J1dHRvbigpO1xufTtcblxuSGVscFZpZXcucHJvdG90eXBlLmNyZWF0ZUhlbHBUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgaGVscFRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGhlbHBUZXh0KTtcbn07XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5jcmVhdGVCYWNrQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmJhY2tCdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnYmFja0J1dHRvbicpO1xuICAgIGNvbnNvbGUubG9nKFwiQkFDSyBCVVRUT05cIik7XG4gICAgY29uc29sZS5sb2codGhpcy5zcHJpdGVTdG9yZSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5iYWNrQnV0dG9uLCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYmFja0J1dHRvbik7XG59O1xuXG5IZWxwVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuYmFja0J1dHRvbl07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBWaWV3OyIsIkxvYWRpbmdWaWV3LmNvbnN0cnVjdG9yID0gTG9hZGluZ1ZpZXc7XG5Mb2FkaW5nVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gTG9hZGluZ1ZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuTG9hZGluZ1ZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkxPQURJTkc7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVMb2FkaW5nVGV4dChsYXlvdXREYXRhLkxPQURJTkdfVEVYVCk7XG59O1xuXG5Mb2FkaW5nVmlldy5wcm90b3R5cGUuY3JlYXRlTG9hZGluZ1RleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBsb2FkaW5nVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQobG9hZGluZ1RleHQsIDUwLCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIobG9hZGluZ1RleHQsIGRhdGEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nVmlldzsiLCJNZW51Vmlldy5jb25zdHJ1Y3RvciA9IE1lbnVWaWV3O1xuTWVudVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5QTEFZX0JVVFRPTiA9IDA7XG5NZW51Vmlldy5wcm90b3R5cGUuSEVMUF9CVVRUT04gPSAxO1xuXG5mdW5jdGlvbiBNZW51VmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5NZW51Vmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZUxvZ28oKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgICB0aGlzLmNyZWF0ZUhlbHBCdXR0b24oKTtcbn07XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5jcmVhdGVMb2dvID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2dvID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2xvZ28nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChsb2dvLCA1MCwgMTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGxvZ28pO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXlCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMucGxheUJ1dHRvbiA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5QnV0dG9uJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5QnV0dG9uLCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheUJ1dHRvbik7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlSGVscEJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5oZWxwQnV0dG9uID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2hlbHBCdXR0b24nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmhlbHBCdXR0b24sIDUwLCA4MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5oZWxwQnV0dG9uKTtcbn07XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5wbGF5QnV0dG9uLCB0aGlzLmhlbHBCdXR0b25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51VmlldzsiLCJWaWV3LmNvbnN0cnVjdG9yID0gVmlldztcblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQSVhJLkNvbnRhaW5lci5wcm90b3R5cGUpO1xuVmlldy5wcm90b3R5cGUuSU5URVJBQ1RJVkUgPSB0cnVlO1xuVmlldy5wcm90b3R5cGUuQ0VOVEVSX0FOQ0hPUiA9IDAuNTtcblxuZnVuY3Rpb24gVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5WaWV3LnByb3RvdHlwZS5hZGRFbGVtZW50VG9Db250YWluZXIgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgZWxlbWVudC5hbmNob3IueCA9IHRoaXMuQ0VOVEVSX0FOQ0hPUjtcbiAgICBlbGVtZW50LmFuY2hvci55ID0gdGhpcy5DRU5URVJfQU5DSE9SO1xuICAgIGVsZW1lbnQuaW50ZXJhY3RpdmUgPSB0aGlzLklOVEVSQUNUSVZFO1xuICAgIHRoaXMuYWRkQ2hpbGQoZWxlbWVudCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVUZXh0RWxlbWVudCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IFBJWEkuVGV4dChkYXRhLnRleHQsIHtmb250OiBkYXRhLnNpemUgKyBcInB4IFwiICsgZGF0YS5mb250LCBmaWxsOiBkYXRhLmNvbG9yfSk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVTcHJpdGVFbGVtZW50ID0gZnVuY3Rpb24ocGF0aCkge1xuICAgIHJldHVybiBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKHBhdGgpO1xufTtcblxuVmlldy5wcm90b3R5cGUucmVtb3ZlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIHRoaXMuYWRkQ2hpbGQoZWxlbWVudCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5yZW1vdmVBbGxFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcbn07XG5cblZpZXcucHJvdG90eXBlLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCA9IGZ1bmN0aW9uKGVsZW1lbnQsIHdpZHRoUGVyY2VudGFnZSwgaGVpZ2h0UGVyY2VudGFnZSkge1xuICAgIGVsZW1lbnQueCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDEwMCkgKiB3aWR0aFBlcmNlbnRhZ2U7XG4gICAgZWxlbWVudC55ID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDEwMCkgKiBoZWlnaHRQZXJjZW50YWdlOyAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xuXG4iLCJBdmF0YXJWaWV3LmNvbnN0cnVjdG9yID0gQXZhdGFyVmlldztcbkF2YXRhclZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbkF2YXRhclZpZXcucHJvdG90eXBlLkJBQ0tfQlVUVE9OID0gMDtcblxuZnVuY3Rpb24gQXZhdGFyVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5BdmF0YXJWaWV3LnByb3RvdHlwZS5jcmVhdGVBdmF0YXIgPSBmdW5jdGlvbiAoYXZhdGFyKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuYXZhdGFyKTtcbiAgICB0aGlzLmF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5ZXIxJyArIGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5hdmF0YXIsIDI0LCA2MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hdmF0YXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdmF0YXJWaWV3OyIsIkRpY2VWaWV3LmNvbnN0cnVjdG9yID0gRGljZVZpZXc7XG5EaWNlVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gRGljZVZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuRGljZVZpZXcucHJvdG90eXBlLnNldHVwRGljZSA9IGZ1bmN0aW9uKGRpY2VOdW1iZXIpIHtcbiAgICB0aGlzLmNyZWF0ZURpY2VFbGVtZW50KGRpY2VOdW1iZXIpO1xufTtcblxuRGljZVZpZXcucHJvdG90eXBlLmNyZWF0ZURpY2VFbGVtZW50ID0gZnVuY3Rpb24oZGljZU51bWJlcikge1xuICAgIHRoaXMuZGljZUVsZW1lbnQgPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnZGljZUZhY2UnICsgZGljZU51bWJlcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5kaWNlRWxlbWVudCwgNTAsIDQyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmRpY2VFbGVtZW50KTtcbn07XG5cbkRpY2VWaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpY2VWaWV3OyIsIlBsYXllclZpZXcuY29uc3RydWN0b3IgPSBQbGF5ZXJWaWV3O1xuUGxheWVyVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gUGxheWVyVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5zZXRQbGF5ZXJEYXRhID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIHRoaXMucGxheWVyRGF0YSA9IHBsYXllckRhdGE7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5ZXJMYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5QTEFZRVI7XG4gICAgdmFyIGF2YXRhckRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkFWQVRBUjtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFBdmF0YXIodGhpcy5wbGF5ZXJEYXRhLnBsYXllcjFBdmF0YXIpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMUhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX0hFQUxUSCk7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIyQXZhdGFyKHRoaXMucGxheWVyRGF0YS5wbGF5ZXIyQXZhdGFyKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMl9IRUFMVEgpO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlUGxheWVyMVRleHQocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9URVhUKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJUZXh0KHBsYXllckxheW91dERhdGEuUExBWUVSXzJfVEVYVCk7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVMb2dvKCk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVMb2dvID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2dvID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2xvZ28nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChsb2dvLCA1MCwgMTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGxvZ28pO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMUF2YXRhciA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHRoaXMucGxheWVyMUF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5ZXIxJyArIGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIxQXZhdGFyLCAyNSwgMzYpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMUF2YXRhcik7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyQXZhdGFyID0gZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgdGhpcy5wbGF5ZXIyQXZhdGFyID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ3BsYXllcjInICsgYXZhdGFyKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjJBdmF0YXIsIDc1LCAzNik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIyQXZhdGFyKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFIZWFsdGggPSBmdW5jdGlvbihoZWFsdGhEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoaGVhbHRoRGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCwgMjUsIDU2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFIZWFsdGhUZXh0LCBoZWFsdGhEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJIZWFsdGggPSBmdW5jdGlvbihoZWFsdGhEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIySGVhbHRoVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoaGVhbHRoRGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIySGVhbHRoVGV4dCwgNzUsIDU2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJIZWFsdGhUZXh0LCBoZWFsdGhEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFUZXh0ID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIHRoaXMucGxheWVyMVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHBsYXllckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMVRleHQsIDI1LCA1Myk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxVGV4dCwgcGxheWVyRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyVGV4dCA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllcjJUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjJUZXh0LCA3NSwgNTMpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMlRleHQsIHBsYXllckRhdGEpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMUhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIxSGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8xX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjFIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIxSGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMkhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIySGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8yX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjJIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIySGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuZmxhc2hQbGF5ZXIxSGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoKSB7XG4gICAgdmFyIHBsYXllckxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUjtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyMkhlYWx0aEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXJlbW92ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjFIZWFsdGhUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyMUhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX0hFQUxUSCk7XG4gICAgICAgICAgICB0aGlzLnNldFBsYXllcjFIZWFsdGgoaGVhbHRoKTtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVkID0gIXJlbW92ZWQ7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDApO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuZmxhc2hQbGF5ZXIySGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoKSB7XG4gICAgdmFyIHBsYXllckxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUjtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyMUhlYWx0aEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIXJlbW92ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjJIZWFsdGhUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyMkhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX0hFQUxUSCk7XG4gICAgICAgICAgICB0aGlzLnNldFBsYXllcjJIZWFsdGgoaGVhbHRoKTtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVkID0gIXJlbW92ZWQ7XG4gICAgfS5iaW5kKHRoaXMpLCAyMDApO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY2xlYXJJbnRlcnZhbHMgPSBmdW5jdGlvbigpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMucGxheWVyMUhlYWx0aEludGVydmFsSWQpO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5wbGF5ZXIySGVhbHRoSW50ZXJ2YWxJZCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclZpZXc7IiwiUXVlc3Rpb25WaWV3LmNvbnN0cnVjdG9yID0gUXVlc3Rpb25WaWV3O1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLlJJR0hUX0FOU1dFUiA9IDA7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLldST05HX0FOU1dFUl8xID0gMTtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuV1JPTkdfQU5TV0VSXzIgPSAyO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5XUk9OR19BTlNXRVJfMyA9IDM7XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSX1BSRUZJWCA9IFwiQU5TV0VSX1wiO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5BTlNXRVJFRF9QUkVGSVggPSBcIkFOU1dFUkVEX1wiO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5BTlNXRVJFRF9TVUZGSVggPSBcIl9BTlNXRVJFRFwiO1xuXG5mdW5jdGlvbiBRdWVzdGlvblZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5kaXNwbGF5Q2F0ZWdvcnlBbmRRdWVzdGlvbiA9IGZ1bmN0aW9uKGNhdGVnb3J5LCBxdWVzdGlvbikge1xuICAgIHZhciBxdWVzdGlvbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OO1xuICAgIHZhciBhbnN3ZXJUZXh0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT04uQU5TV0VSO1xuICAgIHRoaXMuY3JlYXRlQ2F0ZWdvcnlFbGVtZW50KGNhdGVnb3J5LCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLkNBVEVHT1JZKTtcbiAgICB0aGlzLmNyZWF0ZVF1ZXN0aW9uRWxlbWVudChxdWVzdGlvbi50ZXh0LCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLlFVRVNUSU9OX1BPU0lUSU9OKTtcbiAgICB0aGlzLmNyZWF0ZUFuc3dlckVsZW1lbnQxKHF1ZXN0aW9uLnJpZ2h0X2Fuc3dlciwgYW5zd2VyVGV4dERhdGEpO1xuICAgIHRoaXMuY3JlYXRlQW5zd2VyRWxlbWVudDIocXVlc3Rpb24ud3JvbmdfYW5zd2VyXzEsIGFuc3dlclRleHREYXRhKTtcbiAgICB0aGlzLmNyZWF0ZUFuc3dlckVsZW1lbnQzKHF1ZXN0aW9uLndyb25nX2Fuc3dlcl8yLCBhbnN3ZXJUZXh0RGF0YSk7XG4gICAgdGhpcy5jcmVhdGVBbnN3ZXJFbGVtZW50NChxdWVzdGlvbi53cm9uZ19hbnN3ZXJfMywgYW5zd2VyVGV4dERhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5nZXRBbnN3ZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKGluZGljZSkge1xuICAgIGlmKGluZGljZSA9PT0gMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiAzMyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDgxXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmKGluZGljZSA9PT0gMikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiA2NyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDgxXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGlmKGluZGljZSA9PT0gMykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiAzMyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDg5XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGlmKGluZGljZSA9PT0gNCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGhQZXJjZW50YWdlOiA2NyxcbiAgICAgICAgICAgIGhlaWdodFBlcmNlbnRhZ2U6IDg5XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRBbnN3ZXJJbmRpY2VzID0gZnVuY3Rpb24oYW5zd2VySW5kaWNlcykge1xuICAgIHRoaXMuYW5zd2VySW5kaWNlcyA9IGFuc3dlckluZGljZXM7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUNhdGVnb3J5RWxlbWVudCA9IGZ1bmN0aW9uKGNhdGVnb3J5LCBjYXRlZ29yeURhdGEpIHtcbiAgICBjYXRlZ29yeURhdGEudGV4dCA9IGNhdGVnb3J5O1xuICAgIHRoaXMuY2F0ZWdvcnlFbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChjYXRlZ29yeURhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuY2F0ZWdvcnlFbGVtZW50LCA1MCwgNjkpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuY2F0ZWdvcnlFbGVtZW50LCBjYXRlZ29yeURhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVRdWVzdGlvbkVsZW1lbnQgPSBmdW5jdGlvbihxdWVzdGlvbiwgcXVlc3Rpb25EYXRhKSB7XG4gICAgcXVlc3Rpb25EYXRhLnRleHQgPSBxdWVzdGlvbjtcbiAgICB0aGlzLnF1ZXN0aW9uRWxlbWVudCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQocXVlc3Rpb25EYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnF1ZXN0aW9uRWxlbWVudCwgNTAsIDc0KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnF1ZXN0aW9uRWxlbWVudCwgcXVlc3Rpb25EYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQW5zd2VyRWxlbWVudDEgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50MSA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdmFyIGFuc3dlclBvc2l0aW9uID0gdGhpcy5nZXRBbnN3ZXJQb3NpdGlvbih0aGlzLmFuc3dlckluZGljZXNbMF0pO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDEsIGFuc3dlclBvc2l0aW9uLndpZHRoUGVyY2VudGFnZSwgYW5zd2VyUG9zaXRpb24uaGVpZ2h0UGVyY2VudGFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50MSwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUFuc3dlckVsZW1lbnQyID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDIgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHZhciBhbnN3ZXJQb3NpdGlvbiA9IHRoaXMuZ2V0QW5zd2VyUG9zaXRpb24odGhpcy5hbnN3ZXJJbmRpY2VzWzFdKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmFuc3dlckVsZW1lbnQyLCBhbnN3ZXJQb3NpdGlvbi53aWR0aFBlcmNlbnRhZ2UsIGFuc3dlclBvc2l0aW9uLmhlaWdodFBlcmNlbnRhZ2UpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYW5zd2VyRWxlbWVudDIsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVBbnN3ZXJFbGVtZW50MyA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQzID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB2YXIgYW5zd2VyUG9zaXRpb24gPSB0aGlzLmdldEFuc3dlclBvc2l0aW9uKHRoaXMuYW5zd2VySW5kaWNlc1syXSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5hbnN3ZXJFbGVtZW50MywgYW5zd2VyUG9zaXRpb24ud2lkdGhQZXJjZW50YWdlLCBhbnN3ZXJQb3NpdGlvbi5oZWlnaHRQZXJjZW50YWdlKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmFuc3dlckVsZW1lbnQzLCBhbnN3ZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQW5zd2VyRWxlbWVudDQgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50NCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdmFyIGFuc3dlclBvc2l0aW9uID0gdGhpcy5nZXRBbnN3ZXJQb3NpdGlvbih0aGlzLmFuc3dlckluZGljZXNbM10pO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDQsIGFuc3dlclBvc2l0aW9uLndpZHRoUGVyY2VudGFnZSwgYW5zd2VyUG9zaXRpb24uaGVpZ2h0UGVyY2VudGFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50NCwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnNldEFuc3dlclRvQ29sb3VyID0gZnVuY3Rpb24oYW5zd2VyRWxlbWVudCwgYW5zd2VyKSB7XG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT047XG4gICAgdmFyIGNvbG91cnMgPSB7fTtcbiAgICBmb3IodmFyIGkgPSAyOyBpIDw9IDQ7IGkrKykge1xuICAgICAgICBjb2xvdXJzW3RoaXMuQU5TV0VSRURfUFJFRklYICsgaV0gPSBxdWVzdGlvbkRhdGEuV1JPTkdfQU5TV0VSX0NPTE9VUjtcbiAgICB9XG4gICAgY29sb3Vycy5BTlNXRVJFRF8xID0gcXVlc3Rpb25EYXRhLlJJR0hUX0FOU1dFUl9DT0xPVVI7XG4gICAgdmFyIGFuc3dlckNvbG91ciA9IGNvbG91cnNbYW5zd2VyXTtcbiAgICBhbnN3ZXJFbGVtZW50LnNldFN0eWxlKHtmb250OiBhbnN3ZXJFbGVtZW50LnN0eWxlLmZvbnQsIGZpbGw6IGFuc3dlckNvbG91cn0pO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRXaG9BbnN3ZXJlZFF1ZXN0aW9uID0gZnVuY3Rpb24oYW5zd2VyRWxlbWVudCwgYW5zd2VyLCBwbGF5ZXIpIHtcbiAgICB2YXIgcXVlc3Rpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTjtcbiAgICBjb25zb2xlLmxvZyhcIkFuc3dlcjpcIik7XG4gICAgY29uc29sZS5sb2coYW5zd2VyKTtcbiAgICB2YXIgYW5zd2VyT25TY3JlZW4gPSAoYW5zd2VyLnNsaWNlKC0xKSAtIDEpO1xuICAgIHRoaXMucGxheWVyV2hvQW5zd2VyZWRFbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChxdWVzdGlvbkRhdGFbcGxheWVyICsgdGhpcy5BTlNXRVJFRF9TVUZGSVhdKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcldob0Fuc3dlcmVkRWxlbWVudCwgcXVlc3Rpb25EYXRhW3RoaXMuQU5TV0VSRURfUFJFRklYICsgdGhpcy5hbnN3ZXJJbmRpY2VzWyhhbnN3ZXJPblNjcmVlbildXS53aWR0aFBlcmNlbnRhZ2UsIHF1ZXN0aW9uRGF0YVt0aGlzLkFOU1dFUkVEX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1soYW5zd2VyT25TY3JlZW4pXV0uaGVpZ2h0UGVyY2VudGFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXJXaG9BbnN3ZXJlZEVsZW1lbnQsIHF1ZXN0aW9uRGF0YVt0aGlzLkFOU1dFUkVEX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1thbnN3ZXJPblNjcmVlbl1dKTsgXG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnVwZGF0ZVF1ZXN0aW9uVGltZXIgPSBmdW5jdGlvbih0aW1lUmVtYWluaW5nKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMudGltZXIpO1xuICAgIHZhciB0aW1lckRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLlRJTUVSO1xuICAgIHRpbWVyRGF0YS50ZXh0ID0gdGltZVJlbWFpbmluZztcbiAgICB0aGlzLnRpbWVyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudCh0aW1lckRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMudGltZXIsIDk3LCAzKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnRpbWVyLCB0aW1lckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS50dXJuT2ZmSW50ZXJhY3Rpdml0eUZvckFuc3dlckVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50MS5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDIuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQzLmludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50NC5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5hbnN3ZXJFbGVtZW50MSwgdGhpcy5hbnN3ZXJFbGVtZW50MiwgdGhpcy5hbnN3ZXJFbGVtZW50MywgdGhpcy5hbnN3ZXJFbGVtZW50NF07XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25WaWV3OyIsIldpblZpZXcuY29uc3RydWN0b3IgPSBXaW5WaWV3O1xuV2luVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuV2luVmlldy5wcm90b3R5cGUuUExBWV9BR0FJTl9CVVRUT04gPSAwO1xuXG5mdW5jdGlvbiBXaW5WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5zZXR1cFZpZXdFbGVtZW50cygpO1xufVxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlV2lubmVyVGV4dCA9IGZ1bmN0aW9uKHBsYXllcldob1dvbiwgc3RhdERhdGEpIHtcbiAgICB2YXIgd2luRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuV0lOO1xuICAgIHRoaXMuY3JlYXRlV2luVGV4dCh3aW5EYXRhW3BsYXllcldob1dvbiArIFwiX1dJTlNcIl0sIHdpbkRhdGEuV0lOX1RFWFRfUE9TSVRJT04pO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyU3RhdHNUZXh0KHdpbkRhdGEsIHN0YXREYXRhKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24ocGxheWVyV2hvV29uKSB7XG4gICAgdmFyIHdpbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLldJTjtcbiAgICB0aGlzLmNyZWF0ZVBsYXlBZ2FpbkJ1dHRvbih3aW5EYXRhLlBMQVlfQUdBSU4pO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlV2luVGV4dCA9IGZ1bmN0aW9uIChkYXRhLCBwb3NpdGlvbkRhdGEpIHtcbiAgICB0aGlzLndpblRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMud2luVGV4dCwgNTAsIDY2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLndpblRleHQsIHBvc2l0aW9uRGF0YSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXJTdGF0c1RleHQgPSBmdW5jdGlvbihsYXlvdXREYXRhLCBzdGF0RGF0YSkge1xuICAgIHZhciBjb3JyZWN0UDFBbnN3ZXJQZXJjZW50YWdlRGVmYXVsdFRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0O1xuICAgIGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ICsgc3RhdERhdGEucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlO1xuICAgIHRoaXMucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgMjUsIDcyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ID0gY29ycmVjdFAxQW5zd2VyUGVyY2VudGFnZURlZmF1bHRUZXh0O1xuICAgIFxuICAgIHZhciBjb3JyZWN0UDJBbnN3ZXJQZXJjZW50YWdlRGVmYXVsdFRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0O1xuICAgIGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgPSBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ICsgc3RhdERhdGEucGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlO1xuICAgIHRoaXMucGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCwgNzUsIDcyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ID0gY29ycmVjdFAyQW5zd2VyUGVyY2VudGFnZURlZmF1bHRUZXh0O1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheUFnYWluQnV0dG9uID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucGxheUFnYWluQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9wbGF5LWFnYWluLnBuZycpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheUFnYWluQnV0dG9uLCA1MCwgODApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheUFnYWluQnV0dG9uKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLnBsYXlBZ2FpbkJ1dHRvbl07XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIxQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0KTtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIyQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0KTtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy53aW5UZXh0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luVmlldzsiXX0=
