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
SoundController = require('./controller/SoundController');
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
        new BucketLoader(loadLayout, bucketLoadingFailedMessage);
    })();
    
    function loadLayout() {
        new JsonLoader('./resource/' + Display.bucket.width + 'x' + Display.bucket.height + '/layout.json', setLayoutDataInPIXI);
    }
    
    function setLayoutDataInPIXI(layoutData) {
        PIXI.Container.layoutData = layoutData;
        setSpriteStoreForView(startRendering);
    }
    
    function setSpriteStoreForView(callback) {
        var spriteStore = new SpriteStore();
        View.prototype.spriteStore = spriteStore;
        callback();
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
        setControllerStoreInController();
    }
    
    function setControllerStoreInController() {
        var controllerStore = new ControllerStore();
        Controller.prototype.controllerStore = controllerStore;
        beginGame(controllerStore);
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
    
    function beginGame(controllerStore) {
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
},{"./constant/SocketConstants":2,"./controller/AvatarSelectionController":3,"./controller/Controller":4,"./controller/FindGameController":5,"./controller/GameController":6,"./controller/HelpController":7,"./controller/MenuController":8,"./controller/SoundController":9,"./controller/TurnController":10,"./controller/subcontroller/DiceController":11,"./controller/subcontroller/PlayerController":12,"./controller/subcontroller/QuestionController":13,"./loader/BucketLoader":14,"./loader/ImageLoader":15,"./loader/JsonLoader":16,"./loader/ViewLoader":17,"./store/ControllerStore":18,"./store/SpriteStore":19,"./util/Display":20,"./view/AvatarSelectionView":21,"./view/FindGameView":22,"./view/HelpView":23,"./view/LoadingView":24,"./view/MenuView":25,"./view/View":26,"./view/subview/AvatarView":27,"./view/subview/DiceView":28,"./view/subview/PlayerView":29,"./view/subview/QuestionView":30,"./view/subview/WinView":31}],2:[function(require,module,exports){
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

GameController.prototype.soundController = new SoundController();

module.exports = GameController;
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
function SoundController() {
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

module.exports = SoundController;
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
        this.soundController.playRollDiceSound();
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
        this.soundController.playCorrectAnswerSound();
        this.emitDealDamageToOpponentToSocket(this.ANSWERED_1);
    }.bind(this));
};

QuestionController.prototype.setWrongAnswerListeners = function(answers) {
    this.registerListener(answers.ANSWERED_2, function() {
        this.soundController.playWrongAnswerSound();
        this.emitDealDamageToSelfToSocket(this.ANSWERED_2);
    }.bind(this));
    
    this.registerListener(answers.ANSWERED_3, function() {
        this.soundController.playWrongAnswerSound();
        this.emitDealDamageToSelfToSocket(this.ANSWERED_3);
    }.bind(this));
    
    this.registerListener(answers.ANSWERED_4, function() {
        this.soundController.playWrongAnswerSound();
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
        bucketData[orientation].forEach(function (bucket) {
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
            callback();
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
    
    this.createLogo();
    this.createHelpText(layoutData.INFO);
    this.createBackButton();
};

HelpView.prototype.createLogo = function () {
    var logo = this.spriteStore.get('logo');
    this.setElementPositionInPercent(logo, 50, 10);
    this.addElementToContainer(logo);
};

HelpView.prototype.createHelpText = function (data) {
    var helpText = this.createTextElement(data);
    this.setElementPositionInPercent(helpText, 50, 25);
    this.addElementToContainer(helpText);
};

HelpView.prototype.createBackButton = function (data) {
    this.backButton = this.spriteStore.get('backButton');
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi5qcyIsInNyYy9jb25zdGFudC9Tb2NrZXRDb25zdGFudHMuanMiLCJzcmMvY29udHJvbGxlci9BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0ZpbmRHYW1lQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0dhbWVDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvSGVscENvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9NZW51Q29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1NvdW5kQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1R1cm5Db250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9EaWNlQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUXVlc3Rpb25Db250cm9sbGVyLmpzIiwic3JjL2xvYWRlci9CdWNrZXRMb2FkZXIuanMiLCJzcmMvbG9hZGVyL0ltYWdlTG9hZGVyLmpzIiwic3JjL2xvYWRlci9Kc29uTG9hZGVyLmpzIiwic3JjL2xvYWRlci9WaWV3TG9hZGVyLmpzIiwic3JjL3N0b3JlL0NvbnRyb2xsZXJTdG9yZS5qcyIsInNyYy9zdG9yZS9TcHJpdGVTdG9yZS5qcyIsInNyYy91dGlsL0Rpc3BsYXkuanMiLCJzcmMvdmlldy9BdmF0YXJTZWxlY3Rpb25WaWV3LmpzIiwic3JjL3ZpZXcvRmluZEdhbWVWaWV3LmpzIiwic3JjL3ZpZXcvSGVscFZpZXcuanMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy5qcyIsInNyYy92aWV3L01lbnVWaWV3LmpzIiwic3JjL3ZpZXcvVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvQXZhdGFyVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvRGljZVZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1BsYXllclZpZXcuanMiLCJzcmMvdmlldy9zdWJ2aWV3L1F1ZXN0aW9uVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvV2luVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRGlzcGxheSA9IHJlcXVpcmUoJy4vdXRpbC9EaXNwbGF5Jyk7XG5Tb2NrZXRDb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50L1NvY2tldENvbnN0YW50cycpO1xuVmlldyA9IHJlcXVpcmUoJy4vdmlldy9WaWV3Jyk7XG5Mb2FkaW5nVmlldyA9IHJlcXVpcmUoJy4vdmlldy9Mb2FkaW5nVmlldycpO1xuQnVja2V0TG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvQnVja2V0TG9hZGVyJyk7XG5Kc29uTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvSnNvbkxvYWRlcicpO1xuSW1hZ2VMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9JbWFnZUxvYWRlcicpO1xuVmlld0xvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL1ZpZXdMb2FkZXInKTtcbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvQ29udHJvbGxlcicpO1xuSGVscFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvSGVscFZpZXcnKTtcbkhlbHBDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0hlbHBDb250cm9sbGVyJyk7XG5NZW51VmlldyA9IHJlcXVpcmUoJy4vdmlldy9NZW51VmlldycpO1xuTWVudUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvTWVudUNvbnRyb2xsZXInKTtcbkF2YXRhclNlbGVjdGlvblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvQXZhdGFyU2VsZWN0aW9uVmlldycpO1xuQXZhdGFyVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L0F2YXRhclZpZXcnKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcicpO1xuRmluZEdhbWVWaWV3ID0gcmVxdWlyZSgnLi92aWV3L0ZpbmRHYW1lVmlldycpO1xuRmluZEdhbWVDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL0ZpbmRHYW1lQ29udHJvbGxlcicpO1xuU291bmRDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL1NvdW5kQ29udHJvbGxlcicpO1xuR2FtZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvR2FtZUNvbnRyb2xsZXInKTtcbkRpY2VWaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvRGljZVZpZXcnKTtcbkRpY2VDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvRGljZUNvbnRyb2xsZXInKTtcblF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L1F1ZXN0aW9uVmlldycpO1xuUXVlc3Rpb25Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUXVlc3Rpb25Db250cm9sbGVyJyk7XG5QbGF5ZXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvUGxheWVyVmlldycpO1xuUGxheWVyQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9zdWJjb250cm9sbGVyL1BsYXllckNvbnRyb2xsZXInKTtcbldpblZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9XaW5WaWV3Jyk7XG5UdXJuQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9UdXJuQ29udHJvbGxlcicpO1xuQ29udHJvbGxlclN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZS9Db250cm9sbGVyU3RvcmUnKTtcblNwcml0ZVN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZS9TcHJpdGVTdG9yZScpO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgdmFyIERFRkFVTFRfV0lEVEggPSA0ODA7XG4gICAgdmFyIERFRkFVTFRfSEVJR0hUID0gMzIwO1xuICAgIHZhciBSRU5ERVJFUl9CQUNLR1JPVU5EX0NPTE9VUiA9IDB4MDAwMDAwO1xuICAgIHZhciBESVZfSUQgPSBcImdhbWVcIjtcbiAgICBcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIG5ldyBCdWNrZXRMb2FkZXIobG9hZExheW91dCwgYnVja2V0TG9hZGluZ0ZhaWxlZE1lc3NhZ2UpO1xuICAgIH0pKCk7XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZExheW91dCgpIHtcbiAgICAgICAgbmV3IEpzb25Mb2FkZXIoJy4vcmVzb3VyY2UvJyArIERpc3BsYXkuYnVja2V0LndpZHRoICsgJ3gnICsgRGlzcGxheS5idWNrZXQuaGVpZ2h0ICsgJy9sYXlvdXQuanNvbicsIHNldExheW91dERhdGFJblBJWEkpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXRMYXlvdXREYXRhSW5QSVhJKGxheW91dERhdGEpIHtcbiAgICAgICAgUElYSS5Db250YWluZXIubGF5b3V0RGF0YSA9IGxheW91dERhdGE7XG4gICAgICAgIHNldFNwcml0ZVN0b3JlRm9yVmlldyhzdGFydFJlbmRlcmluZyk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldFNwcml0ZVN0b3JlRm9yVmlldyhjYWxsYmFjaykge1xuICAgICAgICB2YXIgc3ByaXRlU3RvcmUgPSBuZXcgU3ByaXRlU3RvcmUoKTtcbiAgICAgICAgVmlldy5wcm90b3R5cGUuc3ByaXRlU3RvcmUgPSBzcHJpdGVTdG9yZTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc3RhcnRSZW5kZXJpbmcoKSB7XG4gICAgICAgIHZhciByZW5kZXJlck9wdGlvbnMgPSB7XG4gICAgICAgICAgICBhbnRpYWxpYXNpbmc6ZmFsc2UsXG4gICAgICAgICAgICByZXNvbHV0aW9uOjEsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6UkVOREVSRVJfQkFDS0dST1VORF9DT0xPVVJcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHZpZXdMb2FkZXIgPSBuZXcgVmlld0xvYWRlcigpO1xuICAgICAgICB2YXIgY29udGFpbmVyID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gICAgICAgIGNvbnRhaW5lci5pbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHZhciByZW5kZXJlciA9IG5ldyBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcih3aW5kb3cuaW5uZXJXaWR0aCAqIERpc3BsYXkuc2NhbGUsIHdpbmRvdy5pbm5lckhlaWdodCAqIERpc3BsYXkuc2NhbGUsIHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICAgIHJlbmRlcmVyLnJvdW5kUGl4ZWxzID0gdHJ1ZTtcbiAgICAgICAgc2V0RGVwZW5kZW5jaWVzKHZpZXdMb2FkZXIsIGNvbnRhaW5lciwgcmVuZGVyZXIpO1xuICAgICAgICBhcHBlbmRHYW1lVG9ET00ocmVuZGVyZXIpO1xuICAgICAgICBiZWdpbkFuaW1hdGlvbih2aWV3TG9hZGVyKTtcbiAgICAgICAgYWRkTG9hZGluZ1ZpZXdUb1NjcmVlbih2aWV3TG9hZGVyKTtcbiAgICAgICAgbmV3IEpzb25Mb2FkZXIoJy4vcmVzb3VyY2UvcXVlc3Rpb25zLmpzb24nLCBzZXRRdWVzdGlvbkRhdGFJblF1ZXN0aW9uQ29udHJvbGxlcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldFF1ZXN0aW9uRGF0YUluUXVlc3Rpb25Db250cm9sbGVyKHF1ZXN0aW9uRGF0YSkge1xuICAgICAgICBRdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnF1ZXN0aW9uRGF0YSA9IHF1ZXN0aW9uRGF0YTtcbiAgICAgICAgbmV3IEpzb25Mb2FkZXIoJy4vcmVzb3VyY2UvY2F0ZWdvcmllcy5qc29uJywgc2V0Q2F0ZWdvcnlEYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXRDYXRlZ29yeURhdGFJblF1ZXN0aW9uQ29udHJvbGxlcihjYXRlZ29yeURhdGEpIHtcbiAgICAgICAgUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5jYXRlZ29yeURhdGEgPSBjYXRlZ29yeURhdGE7XG4gICAgICAgIHNldENvbnRyb2xsZXJTdG9yZUluQ29udHJvbGxlcigpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXRDb250cm9sbGVyU3RvcmVJbkNvbnRyb2xsZXIoKSB7XG4gICAgICAgIHZhciBjb250cm9sbGVyU3RvcmUgPSBuZXcgQ29udHJvbGxlclN0b3JlKCk7XG4gICAgICAgIENvbnRyb2xsZXIucHJvdG90eXBlLmNvbnRyb2xsZXJTdG9yZSA9IGNvbnRyb2xsZXJTdG9yZTtcbiAgICAgICAgYmVnaW5HYW1lKGNvbnRyb2xsZXJTdG9yZSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFwcGVuZEdhbWVUb0RPTShyZW5kZXJlcikge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChESVZfSUQpLmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXREZXBlbmRlbmNpZXModmlld0xvYWRlciwgY29udGFpbmVyLCByZW5kZXJlcikge1xuICAgICAgICB2aWV3TG9hZGVyLnNldENvbnRhaW5lcihjb250YWluZXIpO1xuICAgICAgICB2aWV3TG9hZGVyLnNldFJlbmRlcmVyKHJlbmRlcmVyKTtcbiAgICAgICAgQ29udHJvbGxlci5zZXRWaWV3TG9hZGVyKHZpZXdMb2FkZXIpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBiZWdpbkFuaW1hdGlvbih2aWV3TG9hZGVyKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh2aWV3TG9hZGVyLmFuaW1hdGUpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBiZWdpbkdhbWUoY29udHJvbGxlclN0b3JlKSB7XG4gICAgICAgIHZhciBtZW51Q29udHJvbGxlciA9IGNvbnRyb2xsZXJTdG9yZS5nZXQoJ21lbnVDb250cm9sbGVyJyk7XG4gICAgICAgIG1lbnVDb250cm9sbGVyLmxvYWRWaWV3KCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFkZExvYWRpbmdWaWV3VG9TY3JlZW4odmlld0xvYWRlcikge1xuICAgICAgICB2YXIgbG9hZGluZ1ZpZXcgPSBuZXcgTG9hZGluZ1ZpZXcoKTtcbiAgICAgICAgbG9hZGluZ1ZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICAgICAgdmlld0xvYWRlci5sb2FkVmlldyhsb2FkaW5nVmlldyk7XG4gICAgfVxuICAgICAgICBcbiAgICBmdW5jdGlvbiBidWNrZXRMb2FkaW5nRmFpbGVkTWVzc2FnZSgpIHtcbiAgICAgICAgRGlzcGxheS5idWNrZXQuaGVpZ2h0ID0gREVGQVVMVF9IRUlHSFQ7XG4gICAgICAgIERpc3BsYXkuYnVja2V0LndpZHRoID0gREVGQVVMVF9XSURUSDtcbiAgICAgICAgRGlzcGxheS5zY2FsZSA9IDE7XG4gICAgICAgIERpc3BsYXkucmVzb3VyY2VQYXRoID0gREVGQVVMVF9XSURUSCArICd4JyArIERFRkFVTFRfSEVJR0hUO1xuICAgIH1cbn07IiwidmFyIFNvY2tldENvbnN0YW50cyA9IHtcbiAgICAnb24nIDoge1xuICAgICAgICAnUExBWUVSU19IRUFMVEgnIDogJ3BsYXllcnMtaGVhbHRoJyxcbiAgICAgICAgJ0RJQ0VfTlVNQkVSJyA6ICdkaWNlLW51bWJlcicsXG4gICAgICAgICdSQU5ET01fUVVFU1RJT04nIDogJ3JhbmRvbS1xdWVzdGlvbicsXG4gICAgICAgICdJTklUX05FV19UVVJOJyA6ICdpbml0LW5ldy10dXJuJyxcbiAgICAgICAgJ0RBTUFHRV9ERUFMVCcgOiAnZGFtYWdlLWRlYWx0JyxcbiAgICAgICAgJ1NIVUZGTEVEX0FOU1dFUl9JTkRJQ0VTJyA6ICdzaHVmZmxlZC1hbnN3ZXItaW5kaWNlcycsXG4gICAgICAgICdHQU1FX0ZPVU5EJyA6ICdnYW1lLWZvdW5kJyxcbiAgICAgICAgJ0dBTUVfU1RBVFMnIDogJ2dhbWUtc3RhdHMnXG4gICAgfSxcbiAgICBcbiAgICAnZW1pdCcgOiB7XG4gICAgICAgICdDT05ORUNUSU9OJyA6ICdjb25uZWN0aW9uJyxcbiAgICAgICAgJ0ZJTkRJTkdfR0FNRScgOiAnZmluZGluZy1nYW1lJyxcbiAgICAgICAgJ0dFVF9QTEFZRVJTX0hFQUxUSCcgOiAnZ2V0LXBsYXllcnMtaGVhbHRoJyxcbiAgICAgICAgJ0RJU0NPTk5FQ1QnIDogJ2Rpc2Nvbm5lY3QnLFxuICAgICAgICAnUk9MTF9ESUNFJyA6ICdyb2xsLWRpY2UnLFxuICAgICAgICAnR0VUX1JBTkRPTV9RVUVTVElPTicgOiAnZ2V0LXJhbmRvbS1xdWVzdGlvbicsXG4gICAgICAgICdORVdfVFVSTicgOiAnbmV3LXR1cm4nLFxuICAgICAgICAnREVBTF9EQU1BR0UnIDogJ2RlYWwtZGFtYWdlJyxcbiAgICAgICAgJ1NIVUZGTEVfQU5TV0VSX0lORElDRVMnIDogJ3NodWZmbGUtYW5zd2VyLWluZGljZXMnLFxuICAgICAgICAnR0FNRV9FTkRFRCcgOiAnZ2FtZS1lbmRlZCdcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvY2tldENvbnN0YW50czsiLCJBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcjtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEF2YXRhclNlbGVjdGlvblZpZXcoKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNlbGVjdGVkQXZhdGFyVmlldyA9IG5ldyBBdmF0YXJWaWV3KCk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5hdmF0YXJzID0gWydlbW9qaUFuZ2VsJywgJ2Vtb2ppQmlnU21pbGUnLCAnZW1vamlDb29sJywgJ2Vtb2ppR3JpbicsICdlbW9qaUhhcHB5JywgJ2Vtb2ppS2lzcycsICdlbW9qaUxhdWdoaW5nJywgJ2Vtb2ppTG92ZScsICdlbW9qaU1vbmtleScsICdlbW9qaVBvbycsICdlbW9qaVNjcmVhbScsICdlbW9qaVNsZWVwJywgJ2Vtb2ppU21pbGUnLCAnZW1vamlTbGVlcCcsICdlbW9qaVdpbmsnXTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmN1cnJlbnRBdmF0YXJJbmRleCA9IDA7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5hbUlTZXQgPSBcIk5vXCI7XG5cbmZ1bmN0aW9uIEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xufVxuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKCk7XG4gICAgdGhpcy5zZWxlY3RlZEF2YXRhclZpZXcuY3JlYXRlQXZhdGFyKHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF0pO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgYmFja0J1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuQkFDS19CVVRUT05dO1xuICAgIHZhciBzZWxlY3RVcCA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuU0VMRUNUX1VQXTtcbiAgICB2YXIgc2VsZWN0RG93biA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuU0VMRUNUX0RPV05dO1xuICAgIHZhciBmaW5kR2FtZSA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuRklORF9HQU1FXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYmFja0J1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZW51Q29udHJvbGxlciA9IHRoaXMuY29udHJvbGxlclN0b3JlLmdldChcIm1lbnVDb250cm9sbGVyXCIpO1xuICAgICAgICBtZW51Q29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHNlbGVjdFVwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIFVQID0gMTtcbiAgICAgICAgdGhpcy5zZXR1cE5leHRBdmF0YXIoVVApO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoc2VsZWN0RG93biwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBET1dOID0gLTE7XG4gICAgICAgIHRoaXMuc2V0dXBOZXh0QXZhdGFyKERPV04pO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoZmluZEdhbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXZhdGFyID0gdGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XTtcbiAgICAgICAgdmFyIGZpbmRHYW1lQ29udHJvbGxlciA9IHRoaXMuY29udHJvbGxlclN0b3JlLmdldChcImZpbmRHYW1lQ29udHJvbGxlclwiKTtcbiAgICAgICAgZmluZEdhbWVDb250cm9sbGVyLmxvYWRWaWV3KGF2YXRhcik7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTmV4dEF2YXRhciA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuICAgIGlmKHRoaXMuY3VycmVudEF2YXRhckluZGV4ID49ICh0aGlzLmF2YXRhcnMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXZhdGFySW5kZXggPSAwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50QXZhdGFySW5kZXggKyBkaXJlY3Rpb24gPCAwKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEF2YXRhckluZGV4ID0gKHRoaXMuYXZhdGFycy5sZW5ndGggLSAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCA9IHRoaXMuY3VycmVudEF2YXRhckluZGV4ICsgZGlyZWN0aW9uO1xuICAgIH1cbiAgIFxuICAgIHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3LmNyZWF0ZUF2YXRhcih0aGlzLmF2YXRhcnNbdGhpcy5jdXJyZW50QXZhdGFySW5kZXhdKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyOyIsImZ1bmN0aW9uIENvbnRyb2xsZXIoKSB7fVxuXG5Db250cm9sbGVyLnNldFZpZXdMb2FkZXIgPSBmdW5jdGlvbih2aWV3TG9hZGVyKSB7XG4gICAgQ29udHJvbGxlci5wcm90b3R5cGUudmlld0xvYWRlciA9IHZpZXdMb2FkZXI7XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5zb2NrZXQgPSBpbygpO1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZWdpc3Rlckxpc3RlbmVyID0gZnVuY3Rpb24odmlld0VsZW1lbnQsIGFjdGlvbikge1xuICAgIHZpZXdFbGVtZW50LnRvdWNoZW5kID0gdmlld0VsZW1lbnQuY2xpY2sgPSBhY3Rpb247XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZWdpc3Rlck11bHRpcGxlTGlzdGVuZXJzID0gZnVuY3Rpb24odmlld0VsZW1lbnRzLCBhY3Rpb24pIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdmlld0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcih2aWV3RWxlbWVudHNbaV0sIGFjdGlvbik7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyOyIsIkZpbmRHYW1lQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEZpbmRHYW1lQ29udHJvbGxlcjtcbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBGaW5kR2FtZVZpZXcoKTtcbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuYXZhdGFyID0gbnVsbDtcbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuVFJBTlNJVElPTl9UT19HQU1FX1RJTUUgPSAzMDAwO1xuXG5mdW5jdGlvbiBGaW5kR2FtZUNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHRoaXMuYXZhdGFyID0gYXZhdGFyO1xuICAgIHRoaXMuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKHRoaXMuYXZhdGFyKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkZJTkRJTkdfR0FNRSwge2F2YXRhcjogdGhpcy5hdmF0YXJ9KTtcbn07XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uR0FNRV9GT1VORCwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLmFzc2lnbkF2YXRhcnMocGxheWVyRGF0YSk7XG4gICAgICAgIHRoaXMudmlldy5jcmVhdGVHYW1lRm91bmRDYXB0aW9uKCk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICAgICAgICAgIHZhciBwbGF5ZXJDb250cm9sbGVyID0gdGhpcy5jb250cm9sbGVyU3RvcmUuZ2V0KCdwbGF5ZXJDb250cm9sbGVyJyk7XG4gICAgICAgICAgICBwbGF5ZXJDb250cm9sbGVyLnNldFBsYXllckRhdGEocGxheWVyRGF0YSk7XG4gICAgICAgICAgICB2YXIgZGljZUNvbnRyb2xsZXIgPSB0aGlzLmNvbnRyb2xsZXJTdG9yZS5nZXQoJ2RpY2VDb250cm9sbGVyJyk7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25Db250cm9sbGVyID0gdGhpcy5jb250cm9sbGVyU3RvcmUuZ2V0KCdxdWVzdGlvbkNvbnRyb2xsZXInKTtcbiAgICAgICAgICAgIHF1ZXN0aW9uQ29udHJvbGxlci5zZXRQbGF5ZXJDb250cm9sbGVyKHBsYXllckNvbnRyb2xsZXIpO1xuICAgICAgICAgICAgdmFyIHR1cm5Db250cm9sbGVyID0gdGhpcy5jb250cm9sbGVyU3RvcmUuZ2V0KCd0dXJuQ29udHJvbGxlcicpO1xuICAgICAgICAgICAgdHVybkNvbnRyb2xsZXIuc2V0Q29udHJvbGxlckRlcGVuZGVuY2llcyhwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICAgICAgICAgIHR1cm5Db250cm9sbGVyLmluaXRpYXRlKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5UUkFOU0lUSU9OX1RPX0dBTUVfVElNRSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuYXNzaWduQXZhdGFycyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgc29ja2V0SWRQcmVmaXggPSBcIi8jXCI7XG4gICAgdmFyIHNvY2tldElkID0gc29ja2V0SWRQcmVmaXggKyB0aGlzLnNvY2tldC5pZDtcbiAgICBpZihkYXRhLnBsYXllcjFJZCA9PT0gc29ja2V0SWQpIHtcbiAgICAgICAgdGhpcy52aWV3LmNyZWF0ZVBsYXllcjJBY3R1YWxBdmF0YXIoZGF0YS5wbGF5ZXIyQXZhdGFyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhcihkYXRhLnBsYXllcjFBdmF0YXIpO1xuICAgIH1cbn07XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbmRHYW1lQ29udHJvbGxlcjsiLCJHYW1lQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEdhbWVDb250cm9sbGVyO1xuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIEdhbWVDb250cm9sbGVyKHBsYXllckRhdGEpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG59XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zZXRQbGF5ZXJEYXRhID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5wbGF5ZXJEYXRhID0gcGxheWVyRGF0YTtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zZXREaWNlTnVtYmVyID0gZnVuY3Rpb24oZGljZU51bWJlcikge1xuICAgIEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5kaWNlTnVtYmVyID0gZGljZU51bWJlcjtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5pc1BsYXllcjEgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc29ja2V0UHJlZml4ID0gXCIvI1wiO1xuICAgIHJldHVybiB0aGlzLnBsYXllckRhdGEucGxheWVyMUlkID09PSAoc29ja2V0UHJlZml4ICsgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNvY2tldC5pZCk7XG59O1xuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0UGxheWVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNQbGF5ZXIxKHRoaXMucGxheWVyRGF0YSkgPyBcIlBMQVlFUl8xXCIgOiBcIlBMQVlFUl8yXCI7XG59O1xuXG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0T3Bwb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pc1BsYXllcjEodGhpcy5wbGF5ZXJEYXRhKSA/IFwiUExBWUVSXzJcIiA6IFwiUExBWUVSXzFcIjtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zb3VuZENvbnRyb2xsZXIgPSBuZXcgU291bmRDb250cm9sbGVyKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUNvbnRyb2xsZXI7IiwiSGVscENvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBIZWxwQ29udHJvbGxlcjtcbkhlbHBDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuSGVscENvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgSGVscFZpZXcoKTtcblxuZnVuY3Rpb24gSGVscENvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xufVxuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgYmFja0J1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuQkFDS19CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gdGhpcy5jb250cm9sbGVyU3RvcmUuZ2V0KCdtZW51Q29udHJvbGxlcicpO1xuICAgICAgICBtZW51Q29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBDb250cm9sbGVyOyIsIk1lbnVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gTWVudUNvbnRyb2xsZXI7XG5NZW51Q29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IE1lbnVWaWV3KCk7XG5cbmZ1bmN0aW9uIE1lbnVDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbn1cblxuTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgdGhpcy52aWV3LnNldHVwVmlld0VsZW1lbnRzKCk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xufTtcblxuTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZXdFbGVtZW50cyA9IHRoaXMudmlldy5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cygpOyAgXG4gICAgdmFyIHBsYXlCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlBMQVlfQlVUVE9OXTtcbiAgICB2YXIgaGVscEJ1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuSEVMUF9CVVRUT05dO1xuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihwbGF5QnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSB0aGlzLmNvbnRyb2xsZXJTdG9yZS5nZXQoJ2F2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXInKTtcbiAgICAgICAgYXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGhlbHBCdXR0b24sIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaGVscENvbnRyb2xsZXIgPSB0aGlzLmNvbnRyb2xsZXJTdG9yZS5nZXQoJ2hlbHBDb250cm9sbGVyJyk7XG4gICAgICAgIGhlbHBDb250cm9sbGVyLmxvYWRWaWV3KCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudUNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gU291bmRDb250cm9sbGVyKCkge1xuICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jb3JyZWN0QW5zd2VyU291bmQgPSBuZXcgSG93bCh7dXJsczogW1wicmVzb3VyY2Uvc291bmQvY29ycmVjdC1hbnN3ZXIubXAzXCJdfSk7XG4gICAgICAgIHRoaXMud3JvbmdBbnN3ZXJTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC93cm9uZy1hbnN3ZXIubXAzXCJdfSk7XG4gICAgICAgIHRoaXMucm9sbERpY2VTb3VuZCA9IG5ldyBIb3dsKHt1cmxzOiBbXCJyZXNvdXJjZS9zb3VuZC9yb2xsLWRpY2UubXAzXCJdfSk7XG4gICAgICAgIHRoaXMudGlja1NvdW5kID0gbmV3IEhvd2woe3VybHM6IFtcInJlc291cmNlL3NvdW5kL3RpY2subXAzXCJdfSk7XG4gICAgfS5iaW5kKHRoaXMpKSgpO1xuICAgIFxuICAgIHRoaXMucGxheUNvcnJlY3RBbnN3ZXJTb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvcnJlY3RBbnN3ZXJTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlXcm9uZ0Fuc3dlclNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMud3JvbmdBbnN3ZXJTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlSb2xsRGljZVNvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucm9sbERpY2VTb3VuZC5wbGF5KCk7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnBsYXlUaWNrU291bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50aWNrU291bmQucGxheSgpO1xuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmRDb250cm9sbGVyOyIsIlR1cm5Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gVHVybkNvbnRyb2xsZXI7XG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIFR1cm5Db250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG59XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5pbml0aWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud2luVmlldyA9IG5ldyBXaW5WaWV3KCk7XG4gICAgdGhpcy5jbGVhbkNvbnRyb2xsZXJWaWV3KCk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIHRoaXMubmV3VHVybigpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLnNldENvbnRyb2xsZXJEZXBlbmRlbmNpZXMgPSBmdW5jdGlvbihwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKSB7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyID0gcGxheWVyQ29udHJvbGxlcjtcbiAgICB0aGlzLmRpY2VDb250cm9sbGVyID0gZGljZUNvbnRyb2xsZXI7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIgPSBxdWVzdGlvbkNvbnRyb2xsZXI7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uSU5JVF9ORVdfVFVSTiwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGggPT09IDApIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdBTUVfRU5ERUQsIHt3aW5uZXI6IFwiUExBWUVSXzJcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoID09PSAwKSB7XG4gICAgICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HQU1FX0VOREVELCB7d2lubmVyOiBcIlBMQVlFUl8xXCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXdUdXJuKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDE1MDApO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uR0FNRV9TVEFUUywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLmxvYWRXaW5WaWV3KGRhdGEud2lubmVyLCBkYXRhKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRXaW5WaWV3ID0gZnVuY3Rpb24ocGxheWVyLCBkYXRhKSB7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLndpblZpZXcuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy53aW5WaWV3LmNyZWF0ZVdpbm5lclRleHQocGxheWVyLCBkYXRhKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy53aW5WaWV3KTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLndpblZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBwbGF5QWdhaW5CdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy53aW5WaWV3LlBMQVlfQUdBSU5fQlVUVE9OXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIocGxheUFnYWluQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB0aGlzLmRpY2VDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICAgICAgdmFyIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSB0aGlzLmNvbnRyb2xsZXJTdG9yZS5nZXQoJ2F2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXInKTtcbiAgICAgICAgYXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUubmV3VHVybiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5kaWNlQ29udHJvbGxlci5yb2xsRGljZSgpO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwMCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIubG9hZFZpZXcoKTtcbiAgICB9LmJpbmQodGhpcyksIDMwMDApO1xufTtcblxuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuQ29udHJvbGxlclZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5jaGVja1BsYXllcnNIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9QTEFZRVJTX0hFQUxUSCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFR1cm5Db250cm9sbGVyOyIsIkRpY2VDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gRGljZUNvbnRyb2xsZXI7XG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBEaWNlVmlldygpO1xuXG5mdW5jdGlvbiBEaWNlQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uRElDRV9OVU1CRVIsIGZ1bmN0aW9uKGRpY2UpIHtcbiAgICAgICAgdGhpcy5zb3VuZENvbnRyb2xsZXIucGxheVJvbGxEaWNlU291bmQoKTtcbiAgICAgICAgdGhpcy5sb2FkRGljZShkaWNlLm51bWJlcik7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS5yb2xsRGljZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ST0xMX0RJQ0UpO1xuICAgIH1cbn07XG5cbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkRGljZSA9IGZ1bmN0aW9uKGRpY2VOdW1iZXIpIHtcbiAgICB0aGlzLnZpZXcuc2V0dXBEaWNlKGRpY2VOdW1iZXIpO1xuICAgIHRoaXMuc2V0RGljZU51bWJlcihkaWNlTnVtYmVyKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbn07XG5cbkRpY2VDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGljZUNvbnRyb2xsZXI7IiwiUGxheWVyQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IFBsYXllckNvbnRyb2xsZXI7XG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlKTtcblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgUGxheWVyVmlldygpO1xuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUuREFOR0VST1VTX0xFVkVMX0hFQUxUSCA9IDY7XG5cbmZ1bmN0aW9uIFBsYXllckNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXcuc2V0UGxheWVyRGF0YSh0aGlzLnBsYXllckRhdGEpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cygpO1xuICAgIHRoaXMudXBkYXRlUGxheWVyc0hlYWx0aCgpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xufTtcblxuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uUExBWUVSU19IRUFMVEgsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5jbGVhckludGVydmFscygpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0UGxheWVyMUhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGgpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0UGxheWVyMkhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjJIZWFsdGgpO1xuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGggPD0gdGhpcy5EQU5HRVJPVVNfTEVWRUxfSEVBTFRIKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuZmxhc2hQbGF5ZXIxSGVhbHRoKHBsYXllckRhdGEucGxheWVyMUhlYWx0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoIDw9IHRoaXMuREFOR0VST1VTX0xFVkVMX0hFQUxUSCkge1xuICAgICAgICAgICAgdGhpcy52aWV3LmZsYXNoUGxheWVyMkhlYWx0aChwbGF5ZXJEYXRhLnBsYXllcjJIZWFsdGgpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVBsYXllcnNIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9QTEFZRVJTX0hFQUxUSCk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFySW50ZXJ2YWxzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3LmNsZWFySW50ZXJ2YWxzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllckNvbnRyb2xsZXI7IiwiUXVlc3Rpb25Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gUXVlc3Rpb25Db250cm9sbGVyO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlKTtcblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBRdWVzdGlvblZpZXcoKTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8xID0gJ0FOU1dFUkVEXzEnO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8yID0gJ0FOU1dFUkVEXzInO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF8zID0gJ0FOU1dFUkVEXzMnO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5BTlNXRVJFRF80ID0gJ0FOU1dFUkVEXzQnO1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLlRJTUVfVE9fQU5TV0VSX1FVRVNUSU9OID0gMTA7XG5cbmZ1bmN0aW9uIFF1ZXN0aW9uQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlJBTkRPTV9RVUVTVElPTiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gZGF0YS5xdWVzdGlvbjtcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGRhdGEuY2F0ZWdvcnk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5EQU1BR0VfREVBTFQsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy52aWV3LnNldEFuc3dlclRvQ29sb3VyKHRoaXMuYW5zd2Vyc1twbGF5ZXJEYXRhLmFuc3dlcl0sIHBsYXllckRhdGEuYW5zd2VyKTtcbiAgICAgICAgdGhpcy52aWV3LnNldEFuc3dlclRvQ29sb3VyKHRoaXMuYW5zd2Vyc1t0aGlzLkFOU1dFUkVEXzFdLCB0aGlzLkFOU1dFUkVEXzEpO1xuICAgICAgICB0aGlzLnZpZXcuc2V0V2hvQW5zd2VyZWRRdWVzdGlvbih0aGlzLmFuc3dlcnNbcGxheWVyRGF0YS5hbnN3ZXJdLCBwbGF5ZXJEYXRhLmFuc3dlciwgcGxheWVyRGF0YS5wbGF5ZXJfd2hvX2Fuc3dlcmVkKTtcbiAgICAgICAgdGhpcy52aWV3LnR1cm5PZmZJbnRlcmFjdGl2aXR5Rm9yQW5zd2VyRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLnVwZGF0ZVBsYXllcnNIZWFsdGgoKTtcbiAgICAgICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySW50ZXJ2YWxJZCk7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0Lk5FV19UVVJOKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uU0hVRkZMRURfQU5TV0VSX0lORElDRVMsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy52aWV3LnNldEFuc3dlckluZGljZXMoZGF0YSk7XG4gICAgICAgIHRoaXMudmlldy5kaXNwbGF5Q2F0ZWdvcnlBbmRRdWVzdGlvbih0aGlzLmNhdGVnb3J5LCB0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXRQbGF5ZXJDb250cm9sbGVyID0gZnVuY3Rpb24ocGxheWVyQ29udHJvbGxlcikge1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySW50ZXJ2YWxJZCk7XG4gICAgdGhpcy5nZXRSYW5kb21RdWVzdGlvbigpO1xuICAgIHRoaXMuc2h1ZmZsZUFuc3dlckluZGljZXMoKTtcbiAgICB0aGlzLnVwZGF0ZVRpbWVyKCk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVRpbWVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRpbWVSZW1haW5pbmcgPSAxMDtcbiAgICB2YXIgdGltZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGltZVJlbWFpbmluZyA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcudXBkYXRlUXVlc3Rpb25UaW1lcih0aW1lUmVtYWluaW5nKTtcbiAgICAgICAgICAgIHRpbWVSZW1haW5pbmctLTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0Lk5FV19UVVJOKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lckludGVydmFsSWQpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuICAgIHRoaXMudGltZXJJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwodGltZXIsIDEwMDApO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5nZXRSYW5kb21RdWVzdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdmFyIGNhdGVnb3JpZXMgPSB0aGlzLmNhdGVnb3J5RGF0YS5DQVRFR09SSUVTO1xuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5xdWVzdGlvbkRhdGEuQ0FURUdPUklFUztcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUkFORE9NX1FVRVNUSU9OLCB7Y2F0ZWdvcmllczogY2F0ZWdvcmllcywgcXVlc3Rpb25zOiBxdWVzdGlvbnN9KTtcbiAgICB9XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuc3dlcnMgPSB0aGlzLmdldFZpZXdBbnN3ZXJzKCk7XG4gICAgdGhpcy5zZXRSaWdodEFuc3dlckxpc3RlbmVyKGFuc3dlcnMpO1xuICAgIHRoaXMuc2V0V3JvbmdBbnN3ZXJMaXN0ZW5lcnMoYW5zd2Vycyk7XG4gICAgdGhpcy5zZXRBbnN3ZXJVcGRhdGVMaXN0ZW5lcihhbnN3ZXJzKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0Vmlld0Fuc3dlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7XG4gICAgdmFyIGFuc3dlcnMgPSB7fTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzEgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlJJR0hUX0FOU1dFUl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8yID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMV07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8zID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF80ID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfM107XG4gICAgcmV0dXJuIGFuc3dlcnM7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFJpZ2h0QW5zd2VyTGlzdGVuZXIgPSBmdW5jdGlvbihhbnN3ZXJzKSB7XG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfMSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc291bmRDb250cm9sbGVyLnBsYXlDb3JyZWN0QW5zd2VyU291bmQoKTtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvT3Bwb25lbnRUb1NvY2tldCh0aGlzLkFOU1dFUkVEXzEpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFdyb25nQW5zd2VyTGlzdGVuZXJzID0gZnVuY3Rpb24oYW5zd2Vycykge1xuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kQ29udHJvbGxlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8yKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzMsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kQ29udHJvbGxlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8zKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihhbnN3ZXJzLkFOU1dFUkVEXzQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNvdW5kQ29udHJvbGxlci5wbGF5V3JvbmdBbnN3ZXJTb3VuZCgpO1xuICAgICAgICB0aGlzLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQodGhpcy5BTlNXRVJFRF80KTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zaHVmZmxlQW5zd2VySW5kaWNlcyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgaWYodGhpcy5pc1BsYXllcjEoKSkge1xuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LlNIVUZGTEVfQU5TV0VSX0lORElDRVMsIHtpbmRpY2VzOiBbMSwyLDMsNF19KTtcbiAgICB9XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldEFuc3dlclVwZGF0ZUxpc3RlbmVyID0gZnVuY3Rpb24oYW5zd2Vycykge1xuICAgIHRoaXMuYW5zd2VycyA9IGFuc3dlcnM7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmVtaXREZWFsRGFtYWdlVG9PcHBvbmVudFRvU29ja2V0ID0gZnVuY3Rpb24oYW5zd2VyKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5ERUFMX0RBTUFHRSwge3BsYXllcl93aG9fYW5zd2VyZWQ6IHRoaXMuZ2V0UGxheWVyKCksIHBsYXllcl90b19kYW1hZ2U6IHRoaXMuZ2V0T3Bwb25lbnQoKSwgZGFtYWdlOiB0aGlzLmRpY2VOdW1iZXIsIGFuc3dlcjogYW5zd2VyLCBhbnN3ZXJTdGF0dXM6ICdjb3JyZWN0JywgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnl9KTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZW1pdERlYWxEYW1hZ2VUb1NlbGZUb1NvY2tldCA9IGZ1bmN0aW9uKGFuc3dlcikge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuREVBTF9EQU1BR0UsIHtwbGF5ZXJfd2hvX2Fuc3dlcmVkOiB0aGlzLmdldFBsYXllcigpLCBwbGF5ZXJfdG9fZGFtYWdlOiB0aGlzLmdldFBsYXllcigpLCBkYW1hZ2U6IHRoaXMuZGljZU51bWJlciwgYW5zd2VyOiBhbnN3ZXIsIGFuc3dlclN0YXR1czogJ2luY29ycmVjdCcsIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5fSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3LmNsZWFuVmlldygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbkNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gQnVja2V0TG9hZGVyIChjYWxsYmFjaywgZXJyb3JDYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBQT1JUUkFJVCA9IFwicG9ydHJhaXRcIixcbiAgICAgICAgTEFORFNDQVBFID0gXCJsYW5kc2NhcGVcIixcbiAgICAgICAgQlVDS0VUX1NJWkVfSlNPTl9QQVRIID0gXCJyZXNvdXJjZS9idWNrZXRfc2l6ZXMuanNvblwiO1xuXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbmV3IEpzb25Mb2FkZXIoQlVDS0VUX1NJWkVfSlNPTl9QQVRILCBjYWxjdWxhdGVCZXN0QnVja2V0KTtcbiAgICB9KSgpO1xuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlU2NhbGUgKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5mbG9vcih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyksIDIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUJlc3RCdWNrZXQgKGJ1Y2tldERhdGEpIHtcbiAgICAgICAgdmFyIG9yaWVudGF0aW9uID0gY2FsY3VsYXRlT3JpZW50YXRpb24oKTtcbiAgICAgICAgdmFyIHNjYWxlID0gY2FsY3VsYXRlU2NhbGUoKTtcbiAgICAgICAgaWYoc2NhbGUgPT09IDIpIHtcbiAgICAgICAgICAgIHNjYWxlID0gMS41O1xuICAgICAgICB9XG4gICAgICAgIGJ1Y2tldERhdGFbb3JpZW50YXRpb25dLmZvckVhY2goZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgICAgICAgICAgaWYgKGJ1Y2tldC5oZWlnaHQgKiBzY2FsZSA8PSB3aW5kb3cuaW5uZXJIZWlnaHQgKSB7XG4gICAgICAgICAgICAgICAgRGlzcGxheS5idWNrZXQgPSBidWNrZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgRGlzcGxheS5zY2FsZSA9IGNhbGN1bGF0ZVNjYWxlKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgRGlzcGxheS5yZXNvdXJjZVBhdGggPSAnLi9yZXNvdXJjZS8nICsgRGlzcGxheS5idWNrZXQud2lkdGggKyAneCcgKyBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQgKyAnL3NjYWxlLScgKyBEaXNwbGF5LnNjYWxlO1xuICAgICAgICBEaXNwbGF5Lm9yaWVudGF0aW9uID0gb3JpZW50YXRpb247XG4gICAgICAgIGV4ZWN1dGVDYWxsYmFjaygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVPcmllbnRhdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFBPUlRSQUlUO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIExBTkRTQ0FQRTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWN1dGVDYWxsYmFjayAoKSB7XG4gICAgICAgIGlmIChEaXNwbGF5LmJ1Y2tldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWNrZXRMb2FkZXI7IiwidmFyIEltYWdlTG9hZGVyID0gZnVuY3Rpb24oaW1hZ2VKc29uUGF0aCwgY2FsbGJhY2spIHtcbiAgICB2YXIganNvbkxvYWRlciA9IG5ldyBKc29uTG9hZGVyKGltYWdlSnNvblBhdGgsIGxvYWRJbWFnZXMpO1xuICAgIHZhciBpbWFnZXNMb2FkZWQgPSAwO1xuICAgIHZhciB0b3RhbEltYWdlcyA9IDA7XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlcyhpbWFnZURhdGEpIHtcbiAgICAgICAgdmFyIGltYWdlcyA9IGltYWdlRGF0YS5JTUFHRVM7XG4gICAgICAgIGNvdW50TnVtYmVyT2ZJbWFnZXMoaW1hZ2VzKTtcbiAgICAgICAgZm9yKHZhciBpbWFnZSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIGxvYWRJbWFnZShpbWFnZXNbaW1hZ2VdLnBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZShpbWFnZVBhdGgpIHtcbiAgICAgICAgdmFyIFJFUVVFU1RfRklOSVNIRUQgPSA0O1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBpbWFnZVBhdGgsIHRydWUpO1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gUkVRVUVTVF9GSU5JU0hFRCkge1xuICAgICAgICAgICAgICBpbWFnZXNMb2FkZWQrKztcbiAgICAgICAgICAgICAgY2hlY2tJZkFsbEltYWdlc0xvYWRlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY291bnROdW1iZXJPZkltYWdlcyhpbWFnZXMpIHtcbiAgICAgICAgZm9yKHZhciBpbWFnZSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIHRvdGFsSW1hZ2VzKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY2hlY2tJZkFsbEltYWdlc0xvYWRlZCgpIHtcbiAgICAgICAgaWYoaW1hZ2VzTG9hZGVkID09PSB0b3RhbEltYWdlcykge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VMb2FkZXI7IiwidmFyIEpzb25Mb2FkZXIgPSBmdW5jdGlvbiAocGF0aCwgY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgIFJFUVVFU1RfRklOSVNIRUQgPSA0O1xuICAgIChmdW5jdGlvbiBsb2FkSnNvbigpIHtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIub3BlbignR0VUJywgcGF0aCwgdHJ1ZSk7XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSBSRVFVRVNUX0ZJTklTSEVEKSB7XG4gICAgICAgICAgICB0aGF0LmRhdGEgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgY2FsbGJhY2sodGhhdC5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSkoKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGF0LmRhdGE7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBKc29uTG9hZGVyO1xuIiwiZnVuY3Rpb24gVmlld0xvYWRlcigpIHt9XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24odmlldykge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIuYWRkQ2hpbGQodmlldyk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5yZW1vdmVBbGxWaWV3cyA9IGZ1bmN0aW9uKCkge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIucmVtb3ZlQ2hpbGRyZW4oKTtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnJlbW92ZVZpZXcgPSBmdW5jdGlvbih2aWV3KSB7XG4gICAgVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lci5yZW1vdmVDaGlsZCh2aWV3KTtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnNldFJlbmRlcmVyID0gZnVuY3Rpb24ocmVuZGVyZXIpIHtcbiAgICBWaWV3TG9hZGVyLnByb3RvdHlwZS5yZW5kZXJlciA9IHJlbmRlcmVyO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUuc2V0Q29udGFpbmVyID0gZnVuY3Rpb24oY29udGFpbmVyKSB7XG4gICAgVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lciA9IGNvbnRhaW5lcjtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbigpIHtcbiAgICBWaWV3TG9hZGVyLnByb3RvdHlwZS5yZW5kZXJlci5yZW5kZXIoVmlld0xvYWRlci50b3BMZXZlbENvbnRhaW5lcik7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKFZpZXdMb2FkZXIucHJvdG90eXBlLmFuaW1hdGUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TG9hZGVyOyIsInZhciBDb250cm9sbGVyU3RvcmUgPSBmdW5jdGlvbigpIHtcbiAgICBcbiAgICB2YXIgY29udHJvbGxlcnMgPSBbXTtcbiAgICBcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnRyb2xsZXJzLm1lbnVDb250cm9sbGVyID0gbmV3IE1lbnVDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnRyb2xsZXJzLmF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSBuZXcgQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcigpO1xuICAgICAgICBjb250cm9sbGVycy5oZWxwQ29udHJvbGxlciA9IG5ldyBIZWxwQ29udHJvbGxlcigpO1xuICAgICAgICBjb250cm9sbGVycy5maW5kR2FtZUNvbnRyb2xsZXIgPSBuZXcgRmluZEdhbWVDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnRyb2xsZXJzLmRpY2VDb250cm9sbGVyID0gbmV3IERpY2VDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnRyb2xsZXJzLnBsYXllckNvbnRyb2xsZXIgPSBuZXcgUGxheWVyQ29udHJvbGxlcigpO1xuICAgICAgICBjb250cm9sbGVycy5xdWVzdGlvbkNvbnRyb2xsZXIgPSBuZXcgUXVlc3Rpb25Db250cm9sbGVyKCk7XG4gICAgICAgIGNvbnRyb2xsZXJzLnR1cm5Db250cm9sbGVyID0gbmV3IFR1cm5Db250cm9sbGVyKCk7XG4gICAgfSkoKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGNvbnRyb2xsZXJOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gY29udHJvbGxlcnNbY29udHJvbGxlck5hbWVdO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlclN0b3JlOyIsInZhciBTcHJpdGVTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIHZhciBzcHJpdGVzID0gW107XG4gICAgXG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICBzcHJpdGVzLmxvZ28gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9sb2dvLmpwZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXlCdXR0b24gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9wbGF5LWJ1dHRvbi5qcGcnKTtcbiAgICAgICAgc3ByaXRlcy5oZWxwQnV0dG9uID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvaGVscC1idXR0b24uanBnJyk7XG4gICAgICAgIHNwcml0ZXMuYmFja0J1dHRvbiA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2JhY2stYnV0dG9uLmpwZycpO1xuICAgICAgICBzcHJpdGVzLmRvd25UcmlhbmdsZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2Rvd24tdHJpYW5nbGUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMudXBUcmlhbmdsZSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL3VwLXRyaWFuZ2xlLnBuZycpO1xuICAgICAgICBzcHJpdGVzLmZpbmRHYW1lID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZmluZC1nYW1lLmpwZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaUFuZ2VsID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWFuZ2VsLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaUJpZ1NtaWxlID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWJpZy1zbWlsZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlDb29sID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWNvb2wucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppR3JpbiA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1ncmluLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaUhhcHB5ID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWhhcHB5LnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaUtpc3MgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamkta2lzcy5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlMYXVnaGluZyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1sYXVnaGluZy5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlMb3ZlID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWxvdmUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppTW9ua2V5ID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLW1vbmtleS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIxZW1vamlQb28gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktcG9vLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjFlbW9qaVNjcmVhbSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zY3JlYW0ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppU2xlZXAgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktc2xlZXAucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppU21pbGUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktc21pbGUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppU2xlZXAgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktc2xlZXAucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMWVtb2ppV2luayA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS13aW5rLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaUFuZ2VsID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWFuZ2VsLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaUJpZ1NtaWxlID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWJpZy1zbWlsZS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlDb29sID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWNvb2wucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppR3JpbiA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1ncmluLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaUhhcHB5ID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWhhcHB5LnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaUtpc3MgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamkta2lzcy5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlMYXVnaGluZyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1sYXVnaGluZy5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlMb3ZlID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLWxvdmUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppTW9ua2V5ID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvYXZhdGFyL2Vtb2ppLW1vbmtleS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5wbGF5ZXIyZW1vamlQb28gPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktcG9vLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnBsYXllcjJlbW9qaVNjcmVhbSA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS1zY3JlYW0ucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppU2xlZXAgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktc2xlZXAucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppU21pbGUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktc21pbGUucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppU2xlZXAgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9hdmF0YXIvZW1vamktc2xlZXAucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheWVyMmVtb2ppV2luayA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2F2YXRhci9lbW9qaS13aW5rLnBuZycpO1xuICAgICAgICBzcHJpdGVzLnF1ZXN0aW9uTWFyayA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL3F1ZXN0aW9uLW1hcmsucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZGljZUZhY2UxID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZGljZS9kaWNlLWZhY2UtMS5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5kaWNlRmFjZTIgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9kaWNlL2RpY2UtZmFjZS0yLnBuZycpO1xuICAgICAgICBzcHJpdGVzLmRpY2VGYWNlMyA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2RpY2UvZGljZS1mYWNlLTMucG5nJyk7XG4gICAgICAgIHNwcml0ZXMuZGljZUZhY2U0ID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvZGljZS9kaWNlLWZhY2UtNC5wbmcnKTtcbiAgICAgICAgc3ByaXRlcy5kaWNlRmFjZTUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKERpc3BsYXkucmVzb3VyY2VQYXRoICsgJy9kaWNlL2RpY2UtZmFjZS01LnBuZycpO1xuICAgICAgICBzcHJpdGVzLmRpY2VGYWNlNiA9IG5ldyBQSVhJLlNwcml0ZS5mcm9tSW1hZ2UoRGlzcGxheS5yZXNvdXJjZVBhdGggKyAnL2RpY2UvZGljZS1mYWNlLTYucG5nJyk7XG4gICAgICAgIHNwcml0ZXMucGxheUFnYWluID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShEaXNwbGF5LnJlc291cmNlUGF0aCArICcvcGxheS1hZ2Fpbi5wbmcnKTtcbiAgICB9KSgpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oc3ByaXRlTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHNwcml0ZXNbc3ByaXRlTmFtZV07XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGVTdG9yZTsiLCJ2YXIgRGlzcGxheSA9IHtcbiAgICBidWNrZXQ6IG51bGwsXG4gICAgc2NhbGU6IG51bGwsXG4gICAgcmVzb3VyY2VQYXRoOiBudWxsLFxuICAgIG9yaWVudGF0aW9uOiBudWxsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BsYXk7IiwiQXZhdGFyU2VsZWN0aW9uVmlldy5jb25zdHJ1Y3RvciA9IEF2YXRhclNlbGVjdGlvblZpZXc7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5TRUxFQ1RfVVAgPSAxO1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuU0VMRUNUX0RPV04gPSAyO1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuRklORF9HQU1FID0gMztcblxuXG5mdW5jdGlvbiBBdmF0YXJTZWxlY3Rpb25WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jcmVhdGVMb2dvKCk7XG4gICAgdGhpcy5jcmVhdGVCYWNrQnV0dG9uKCk7XG4gICAgdGhpcy5jcmVhdGVTZWxlY3REb3duQnV0dG9uKCk7XG4gICAgdGhpcy5jcmVhdGVTZWxlY3RVcEJ1dHRvbigpO1xuICAgIHRoaXMuY3JlYXRlRmluZEdhbWVCdXR0b24oKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUxvZ28gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBsb2dvID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2xvZ28nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChsb2dvLCA1MCwgMTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGxvZ28pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQmFja0J1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5iYWNrQnV0dG9uID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2JhY2tCdXR0b24nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmJhY2tCdXR0b24sIDY5LCA4MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5iYWNrQnV0dG9uKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZVNlbGVjdERvd25CdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuc2VsZWN0RG93bkJ1dHRvbiA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdkb3duVHJpYW5nbGUnKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnNlbGVjdERvd25CdXR0b24sIDI0LCA4NSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5zZWxlY3REb3duQnV0dG9uKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZVNlbGVjdFVwQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnNlbGVjdFVwQnV0dG9uID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ3VwVHJpYW5nbGUnKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnNlbGVjdFVwQnV0dG9uLCAyNCwgMzUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuc2VsZWN0VXBCdXR0b24pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlRmluZEdhbWVCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuZmluZEdhbWVCdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnZmluZEdhbWUnKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmZpbmRHYW1lQnV0dG9uLCA2OSwgNDgpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuZmluZEdhbWVCdXR0b24pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuYmFja0J1dHRvbiwgdGhpcy5zZWxlY3RVcEJ1dHRvbiwgdGhpcy5zZWxlY3REb3duQnV0dG9uLCB0aGlzLmZpbmRHYW1lQnV0dG9uXTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXZhdGFyU2VsZWN0aW9uVmlldzsiLCJGaW5kR2FtZVZpZXcuY29uc3RydWN0b3IgPSBGaW5kR2FtZVZpZXc7XG5GaW5kR2FtZVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIEZpbmRHYW1lVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkZJTkRfR0FNRTtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZUZpbmRHYW1lQ2FwdGlvbihsYXlvdXREYXRhLkNBUFRJT04pO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMUF2YXRhcihhdmF0YXIpO1xuICAgIHRoaXMuY3JlYXRlVmVyc3VzVGV4dChsYXlvdXREYXRhLlZFUlNVUyk7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIyVW5rbm93bkF2YXRhcigpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMVRleHQobGF5b3V0RGF0YS5QTEFZRVJfMSk7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIyVGV4dChsYXlvdXREYXRhLlBMQVlFUl8yKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlRmluZEdhbWVDYXB0aW9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmZpbmRHYW1lQ2FwdGlvbiA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5maW5kR2FtZUNhcHRpb24sIDUwLCAxNSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5maW5kR2FtZUNhcHRpb24pO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxQXZhdGFyID0gZnVuY3Rpb24gKGF2YXRhcikge1xuICAgIHRoaXMucGxheWVyMUF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5ZXIxJyArIGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIxQXZhdGFyLCAyNSwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMUF2YXRhcik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVZlcnN1c1RleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciB2ZXJzdXMgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHZlcnN1cywgNTAsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih2ZXJzdXMpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyVW5rbm93bkF2YXRhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGxheWVyMlVua25vd25BdmF0YXIgPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgncXVlc3Rpb25NYXJrJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMlVua25vd25BdmF0YXIsIDc1LCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMlVua25vd25BdmF0YXIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHBsYXllcjEgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHBsYXllcjEsIDI1LCA3NCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMSk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgcGxheWVyMiA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQocGxheWVyMiwgNzUsIDc0KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhciA9IGZ1bmN0aW9uIChhdmF0YXIpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIyVW5rbm93bkF2YXRhcik7XG4gICAgdmFyIHBsYXllcjJBY3R1YWxBdmF0YXIgPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgncGxheWVyMicgKyBhdmF0YXIpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHBsYXllcjJBY3R1YWxBdmF0YXIsIDc1LCA1MCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMkFjdHVhbEF2YXRhcik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZUdhbWVGb3VuZENhcHRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuZmluZEdhbWVDYXB0aW9uKTtcbiAgICB2YXIgZm91bmRHYW1lQ2FwdGlvbiA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5GSU5EX0dBTUUuRk9VTkRfR0FNRV9DQVBUSU9OKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChmb3VuZEdhbWVDYXB0aW9uLCA1MCwgMTUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGZvdW5kR2FtZUNhcHRpb24pO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbmRHYW1lVmlldzsiLCJIZWxwVmlldy5jb25zdHJ1Y3RvciA9IEhlbHBWaWV3O1xuSGVscFZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5cbmZ1bmN0aW9uIEhlbHBWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5IRUxQO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlTG9nbygpO1xuICAgIHRoaXMuY3JlYXRlSGVscFRleHQobGF5b3V0RGF0YS5JTkZPKTtcbiAgICB0aGlzLmNyZWF0ZUJhY2tCdXR0b24oKTtcbn07XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5jcmVhdGVMb2dvID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2dvID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2xvZ28nKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudChsb2dvLCA1MCwgMTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGxvZ28pO1xufTtcblxuSGVscFZpZXcucHJvdG90eXBlLmNyZWF0ZUhlbHBUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgaGVscFRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGhlbHBUZXh0LCA1MCwgMjUpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGhlbHBUZXh0KTtcbn07XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5jcmVhdGVCYWNrQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmJhY2tCdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgnYmFja0J1dHRvbicpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYmFja0J1dHRvbiwgNTAsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmJhY2tCdXR0b24pO1xufTtcblxuSGVscFZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLmJhY2tCdXR0b25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZWxwVmlldzsiLCJMb2FkaW5nVmlldy5jb25zdHJ1Y3RvciA9IExvYWRpbmdWaWV3O1xuTG9hZGluZ1ZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIExvYWRpbmdWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkxvYWRpbmdWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5MT0FESU5HO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlTG9hZGluZ1RleHQobGF5b3V0RGF0YS5MT0FESU5HX1RFWFQpO1xufTtcblxuTG9hZGluZ1ZpZXcucHJvdG90eXBlLmNyZWF0ZUxvYWRpbmdUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgbG9hZGluZ1RleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KGxvYWRpbmdUZXh0LCA1MCwgNTApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGxvYWRpbmdUZXh0LCBkYXRhKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZ1ZpZXc7IiwiTWVudVZpZXcuY29uc3RydWN0b3IgPSBNZW51Vmlldztcbk1lbnVWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5NZW51Vmlldy5wcm90b3R5cGUuUExBWV9CVVRUT04gPSAwO1xuTWVudVZpZXcucHJvdG90eXBlLkhFTFBfQlVUVE9OID0gMTtcblxuZnVuY3Rpb24gTWVudVZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuTWVudVZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jcmVhdGVMb2dvKCk7XG4gICAgdGhpcy5jcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgdGhpcy5jcmVhdGVIZWxwQnV0dG9uKCk7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlTG9nbyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbG9nbyA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdsb2dvJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQobG9nbywgNTAsIDEwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihsb2dvKTtcbn07XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5QnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnBsYXlCdXR0b24gPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgncGxheUJ1dHRvbicpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheUJ1dHRvbiwgNTAsIDUwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXlCdXR0b24pO1xufTtcblxuTWVudVZpZXcucHJvdG90eXBlLmNyZWF0ZUhlbHBCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuaGVscEJ1dHRvbiA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdoZWxwQnV0dG9uJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5oZWxwQnV0dG9uLCA1MCwgODApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuaGVscEJ1dHRvbik7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMucGxheUJ1dHRvbiwgdGhpcy5oZWxwQnV0dG9uXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXc7IiwiVmlldy5jb25zdHJ1Y3RvciA9IFZpZXc7XG5WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblZpZXcucHJvdG90eXBlLklOVEVSQUNUSVZFID0gdHJ1ZTtcblZpZXcucHJvdG90eXBlLkNFTlRFUl9BTkNIT1IgPSAwLjU7XG5cbmZ1bmN0aW9uIFZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuVmlldy5wcm90b3R5cGUuYWRkRWxlbWVudFRvQ29udGFpbmVyID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGVsZW1lbnQuYW5jaG9yLnggPSB0aGlzLkNFTlRFUl9BTkNIT1I7XG4gICAgZWxlbWVudC5hbmNob3IueSA9IHRoaXMuQ0VOVEVSX0FOQ0hPUjtcbiAgICBlbGVtZW50LmludGVyYWN0aXZlID0gdGhpcy5JTlRFUkFDVElWRTtcbiAgICB0aGlzLmFkZENoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUuY3JlYXRlVGV4dEVsZW1lbnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQSVhJLlRleHQoZGF0YS50ZXh0LCB7Zm9udDogZGF0YS5zaXplICsgXCJweCBcIiArIGRhdGEuZm9udCwgZmlsbDogZGF0YS5jb2xvcn0pO1xufTtcblxuVmlldy5wcm90b3R5cGUuY3JlYXRlU3ByaXRlRWxlbWVudCA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICByZXR1cm4gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShwYXRoKTtcbn07XG5cblZpZXcucHJvdG90eXBlLnJlbW92ZUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdGhpcy5yZW1vdmVDaGlsZChlbGVtZW50KTtcbn07XG5cblZpZXcucHJvdG90eXBlLnVwZGF0ZUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdGhpcy5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICB0aGlzLmFkZENoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUucmVtb3ZlQWxsRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQgPSBmdW5jdGlvbihlbGVtZW50LCB3aWR0aFBlcmNlbnRhZ2UsIGhlaWdodFBlcmNlbnRhZ2UpIHtcbiAgICBlbGVtZW50LnggPSAod2luZG93LmlubmVyV2lkdGggLyAxMDApICogd2lkdGhQZXJjZW50YWdlO1xuICAgIGVsZW1lbnQueSA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAxMDApICogaGVpZ2h0UGVyY2VudGFnZTsgICBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcblxuIiwiQXZhdGFyVmlldy5jb25zdHJ1Y3RvciA9IEF2YXRhclZpZXc7XG5BdmF0YXJWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5BdmF0YXJWaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5cbmZ1bmN0aW9uIEF2YXRhclZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuQXZhdGFyVmlldy5wcm90b3R5cGUuY3JlYXRlQXZhdGFyID0gZnVuY3Rpb24gKGF2YXRhcikge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLmF2YXRhcik7XG4gICAgdGhpcy5hdmF0YXIgPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgncGxheWVyMScgKyBhdmF0YXIpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYXZhdGFyLCAyNCwgNjApO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYXZhdGFyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXZhdGFyVmlldzsiLCJEaWNlVmlldy5jb25zdHJ1Y3RvciA9IERpY2VWaWV3O1xuRGljZVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIERpY2VWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkRpY2VWaWV3LnByb3RvdHlwZS5zZXR1cERpY2UgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgdGhpcy5jcmVhdGVEaWNlRWxlbWVudChkaWNlTnVtYmVyKTtcbn07XG5cbkRpY2VWaWV3LnByb3RvdHlwZS5jcmVhdGVEaWNlRWxlbWVudCA9IGZ1bmN0aW9uKGRpY2VOdW1iZXIpIHtcbiAgICB0aGlzLmRpY2VFbGVtZW50ID0gdGhpcy5zcHJpdGVTdG9yZS5nZXQoJ2RpY2VGYWNlJyArIGRpY2VOdW1iZXIpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuZGljZUVsZW1lbnQsIDUwLCA0Mik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5kaWNlRWxlbWVudCk7XG59O1xuXG5EaWNlVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaWNlVmlldzsiLCJQbGF5ZXJWaWV3LmNvbnN0cnVjdG9yID0gUGxheWVyVmlldztcblBsYXllclZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIFBsYXllclZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyRGF0YSA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllckRhdGEgPSBwbGF5ZXJEYXRhO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVyTGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSO1xuICAgIHZhciBhdmF0YXJEYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5BVkFUQVI7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxQXZhdGFyKHRoaXMucGxheWVyRGF0YS5wbGF5ZXIxQXZhdGFyKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9IRUFMVEgpO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlUGxheWVyMkF2YXRhcih0aGlzLnBsYXllckRhdGEucGxheWVyMkF2YXRhcik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIySGVhbHRoKHBsYXllckxheW91dERhdGEuUExBWUVSXzJfSEVBTFRIKTtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFUZXh0KHBsYXllckxheW91dERhdGEuUExBWUVSXzFfVEVYVCk7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIyVGV4dChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX1RFWFQpO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlTG9nbygpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlTG9nbyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbG9nbyA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdsb2dvJyk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQobG9nbywgNTAsIDEwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihsb2dvKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFBdmF0YXIgPSBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICB0aGlzLnBsYXllcjFBdmF0YXIgPSB0aGlzLnNwcml0ZVN0b3JlLmdldCgncGxheWVyMScgKyBhdmF0YXIpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMUF2YXRhciwgMjUsIDM2KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFBdmF0YXIpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMkF2YXRhciA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHRoaXMucGxheWVyMkF2YXRhciA9IHRoaXMuc3ByaXRlU3RvcmUuZ2V0KCdwbGF5ZXIyJyArIGF2YXRhcik7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIyQXZhdGFyLCA3NSwgMzYpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMkF2YXRhcik7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxSGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoRGF0YSkge1xuICAgIHRoaXMucGxheWVyMUhlYWx0aFRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGhlYWx0aERhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMUhlYWx0aFRleHQsIDI1LCA1Nik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCwgaGVhbHRoRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIySGVhbHRoID0gZnVuY3Rpb24oaGVhbHRoRGF0YSkge1xuICAgIHRoaXMucGxheWVyMkhlYWx0aFRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGhlYWx0aERhdGEpO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMucGxheWVyMkhlYWx0aFRleHQsIDc1LCA1Nik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIySGVhbHRoVGV4dCwgaGVhbHRoRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxVGV4dCA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllcjFUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjFUZXh0LCAyNSwgNTMpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMVRleHQsIHBsYXllckRhdGEpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMlRleHQgPSBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIyVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQocGxheWVyRGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXIyVGV4dCwgNzUsIDUzKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjJUZXh0LCBwbGF5ZXJEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLnNldFBsYXllcjFIZWFsdGggPSBmdW5jdGlvbihoZWFsdGgpIHtcbiAgICB2YXIgcGxheWVyMUhlYWx0aERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUi5QTEFZRVJfMV9IRUFMVEg7XG4gICAgdGhpcy5wbGF5ZXIxSGVhbHRoVGV4dC50ZXh0ID0gcGxheWVyMUhlYWx0aERhdGEudGV4dCArIGhlYWx0aDtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLnNldFBsYXllcjJIZWFsdGggPSBmdW5jdGlvbihoZWFsdGgpIHtcbiAgICB2YXIgcGxheWVyMkhlYWx0aERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlBMQVlFUi5QTEFZRVJfMl9IRUFMVEg7XG4gICAgdGhpcy5wbGF5ZXIySGVhbHRoVGV4dC50ZXh0ID0gcGxheWVyMkhlYWx0aERhdGEudGV4dCArIGhlYWx0aDtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmZsYXNoUGxheWVyMUhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXJMYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5QTEFZRVI7XG4gICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBsYXllcjJIZWFsdGhJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCFyZW1vdmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIxSGVhbHRoVGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBsYXllcjFIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9IRUFMVEgpO1xuICAgICAgICAgICAgdGhpcy5zZXRQbGF5ZXIxSGVhbHRoKGhlYWx0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlZCA9ICFyZW1vdmVkO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmZsYXNoUGxheWVyMkhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXJMYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5QTEFZRVI7XG4gICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBsYXllcjFIZWFsdGhJbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCFyZW1vdmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5wbGF5ZXIySGVhbHRoVGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBsYXllcjJIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMl9IRUFMVEgpO1xuICAgICAgICAgICAgdGhpcy5zZXRQbGF5ZXIySGVhbHRoKGhlYWx0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlZCA9ICFyZW1vdmVkO1xuICAgIH0uYmluZCh0aGlzKSwgMjAwKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNsZWFuVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQWxsRWxlbWVudHMoKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNsZWFySW50ZXJ2YWxzID0gZnVuY3Rpb24oKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnBsYXllcjFIZWFsdGhJbnRlcnZhbElkKTtcbiAgICBjbGVhckludGVydmFsKHRoaXMucGxheWVyMkhlYWx0aEludGVydmFsSWQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJWaWV3OyIsIlF1ZXN0aW9uVmlldy5jb25zdHJ1Y3RvciA9IFF1ZXN0aW9uVmlldztcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5SSUdIVF9BTlNXRVIgPSAwO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5XUk9OR19BTlNXRVJfMSA9IDE7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLldST05HX0FOU1dFUl8yID0gMjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuV1JPTkdfQU5TV0VSXzMgPSAzO1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLkFOU1dFUl9QUkVGSVggPSBcIkFOU1dFUl9cIjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSRURfUFJFRklYID0gXCJBTlNXRVJFRF9cIjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSRURfU1VGRklYID0gXCJfQU5TV0VSRURcIjtcblxuZnVuY3Rpb24gUXVlc3Rpb25WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuZGlzcGxheUNhdGVnb3J5QW5kUXVlc3Rpb24gPSBmdW5jdGlvbihjYXRlZ29yeSwgcXVlc3Rpb24pIHtcbiAgICB2YXIgcXVlc3Rpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTjtcbiAgICB2YXIgYW5zd2VyVGV4dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OLkFOU1dFUjtcbiAgICB0aGlzLmNyZWF0ZUNhdGVnb3J5RWxlbWVudChjYXRlZ29yeSwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTi5DQVRFR09SWSk7XG4gICAgdGhpcy5jcmVhdGVRdWVzdGlvbkVsZW1lbnQocXVlc3Rpb24udGV4dCwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTi5RVUVTVElPTl9QT1NJVElPTik7XG4gICAgdGhpcy5jcmVhdGVBbnN3ZXJFbGVtZW50MShxdWVzdGlvbi5yaWdodF9hbnN3ZXIsIGFuc3dlclRleHREYXRhKTtcbiAgICB0aGlzLmNyZWF0ZUFuc3dlckVsZW1lbnQyKHF1ZXN0aW9uLndyb25nX2Fuc3dlcl8xLCBhbnN3ZXJUZXh0RGF0YSk7XG4gICAgdGhpcy5jcmVhdGVBbnN3ZXJFbGVtZW50MyhxdWVzdGlvbi53cm9uZ19hbnN3ZXJfMiwgYW5zd2VyVGV4dERhdGEpO1xuICAgIHRoaXMuY3JlYXRlQW5zd2VyRWxlbWVudDQocXVlc3Rpb24ud3JvbmdfYW5zd2VyXzMsIGFuc3dlclRleHREYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuZ2V0QW5zd2VyUG9zaXRpb24gPSBmdW5jdGlvbihpbmRpY2UpIHtcbiAgICBpZihpbmRpY2UgPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoUGVyY2VudGFnZTogMzMsXG4gICAgICAgICAgICBoZWlnaHRQZXJjZW50YWdlOiA4MVxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZihpbmRpY2UgPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoUGVyY2VudGFnZTogNjcsXG4gICAgICAgICAgICBoZWlnaHRQZXJjZW50YWdlOiA4MVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBpZihpbmRpY2UgPT09IDMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoUGVyY2VudGFnZTogMzMsXG4gICAgICAgICAgICBoZWlnaHRQZXJjZW50YWdlOiA4OVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBpZihpbmRpY2UgPT09IDQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoUGVyY2VudGFnZTogNjcsXG4gICAgICAgICAgICBoZWlnaHRQZXJjZW50YWdlOiA4OVxuICAgICAgICB9O1xuICAgIH1cbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuc2V0QW5zd2VySW5kaWNlcyA9IGZ1bmN0aW9uKGFuc3dlckluZGljZXMpIHtcbiAgICB0aGlzLmFuc3dlckluZGljZXMgPSBhbnN3ZXJJbmRpY2VzO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVDYXRlZ29yeUVsZW1lbnQgPSBmdW5jdGlvbihjYXRlZ29yeSwgY2F0ZWdvcnlEYXRhKSB7XG4gICAgY2F0ZWdvcnlEYXRhLnRleHQgPSBjYXRlZ29yeTtcbiAgICB0aGlzLmNhdGVnb3J5RWxlbWVudCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoY2F0ZWdvcnlEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmNhdGVnb3J5RWxlbWVudCwgNTAsIDY5KTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmNhdGVnb3J5RWxlbWVudCwgY2F0ZWdvcnlEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlUXVlc3Rpb25FbGVtZW50ID0gZnVuY3Rpb24ocXVlc3Rpb24sIHF1ZXN0aW9uRGF0YSkge1xuICAgIHF1ZXN0aW9uRGF0YS50ZXh0ID0gcXVlc3Rpb247XG4gICAgdGhpcy5xdWVzdGlvbkVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHF1ZXN0aW9uRGF0YSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5xdWVzdGlvbkVsZW1lbnQsIDUwLCA3NCk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5xdWVzdGlvbkVsZW1lbnQsIHF1ZXN0aW9uRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUFuc3dlckVsZW1lbnQxID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDEgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHZhciBhbnN3ZXJQb3NpdGlvbiA9IHRoaXMuZ2V0QW5zd2VyUG9zaXRpb24odGhpcy5hbnN3ZXJJbmRpY2VzWzBdKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmFuc3dlckVsZW1lbnQxLCBhbnN3ZXJQb3NpdGlvbi53aWR0aFBlcmNlbnRhZ2UsIGFuc3dlclBvc2l0aW9uLmhlaWdodFBlcmNlbnRhZ2UpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYW5zd2VyRWxlbWVudDEsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVBbnN3ZXJFbGVtZW50MiA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQyID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB2YXIgYW5zd2VyUG9zaXRpb24gPSB0aGlzLmdldEFuc3dlclBvc2l0aW9uKHRoaXMuYW5zd2VySW5kaWNlc1sxXSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5hbnN3ZXJFbGVtZW50MiwgYW5zd2VyUG9zaXRpb24ud2lkdGhQZXJjZW50YWdlLCBhbnN3ZXJQb3NpdGlvbi5oZWlnaHRQZXJjZW50YWdlKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmFuc3dlckVsZW1lbnQyLCBhbnN3ZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlQW5zd2VyRWxlbWVudDMgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50MyA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdmFyIGFuc3dlclBvc2l0aW9uID0gdGhpcy5nZXRBbnN3ZXJQb3NpdGlvbih0aGlzLmFuc3dlckluZGljZXNbMl0pO1xuICAgIHRoaXMuc2V0RWxlbWVudFBvc2l0aW9uSW5QZXJjZW50KHRoaXMuYW5zd2VyRWxlbWVudDMsIGFuc3dlclBvc2l0aW9uLndpZHRoUGVyY2VudGFnZSwgYW5zd2VyUG9zaXRpb24uaGVpZ2h0UGVyY2VudGFnZSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5hbnN3ZXJFbGVtZW50MywgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUFuc3dlckVsZW1lbnQ0ID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHZhciBhbnN3ZXJQb3NpdGlvbiA9IHRoaXMuZ2V0QW5zd2VyUG9zaXRpb24odGhpcy5hbnN3ZXJJbmRpY2VzWzNdKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLmFuc3dlckVsZW1lbnQ0LCBhbnN3ZXJQb3NpdGlvbi53aWR0aFBlcmNlbnRhZ2UsIGFuc3dlclBvc2l0aW9uLmhlaWdodFBlcmNlbnRhZ2UpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYW5zd2VyRWxlbWVudDQsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRBbnN3ZXJUb0NvbG91ciA9IGZ1bmN0aW9uKGFuc3dlckVsZW1lbnQsIGFuc3dlcikge1xuICAgIHZhciBxdWVzdGlvbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OO1xuICAgIHZhciBjb2xvdXJzID0ge307XG4gICAgZm9yKHZhciBpID0gMjsgaSA8PSA0OyBpKyspIHtcbiAgICAgICAgY29sb3Vyc1t0aGlzLkFOU1dFUkVEX1BSRUZJWCArIGldID0gcXVlc3Rpb25EYXRhLldST05HX0FOU1dFUl9DT0xPVVI7XG4gICAgfVxuICAgIGNvbG91cnMuQU5TV0VSRURfMSA9IHF1ZXN0aW9uRGF0YS5SSUdIVF9BTlNXRVJfQ09MT1VSO1xuICAgIHZhciBhbnN3ZXJDb2xvdXIgPSBjb2xvdXJzW2Fuc3dlcl07XG4gICAgYW5zd2VyRWxlbWVudC5zZXRTdHlsZSh7Zm9udDogYW5zd2VyRWxlbWVudC5zdHlsZS5mb250LCBmaWxsOiBhbnN3ZXJDb2xvdXJ9KTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuc2V0V2hvQW5zd2VyZWRRdWVzdGlvbiA9IGZ1bmN0aW9uKGFuc3dlckVsZW1lbnQsIGFuc3dlciwgcGxheWVyKSB7XG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT047XG4gICAgdmFyIGFuc3dlck9uU2NyZWVuID0gKGFuc3dlci5zbGljZSgtMSkgLSAxKTtcbiAgICB0aGlzLnBsYXllcldob0Fuc3dlcmVkRWxlbWVudCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQocXVlc3Rpb25EYXRhW3BsYXllciArIHRoaXMuQU5TV0VSRURfU1VGRklYXSk7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb25JblBlcmNlbnQodGhpcy5wbGF5ZXJXaG9BbnN3ZXJlZEVsZW1lbnQsIHF1ZXN0aW9uRGF0YVt0aGlzLkFOU1dFUkVEX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1soYW5zd2VyT25TY3JlZW4pXV0ud2lkdGhQZXJjZW50YWdlLCBxdWVzdGlvbkRhdGFbdGhpcy5BTlNXRVJFRF9QUkVGSVggKyB0aGlzLmFuc3dlckluZGljZXNbKGFuc3dlck9uU2NyZWVuKV1dLmhlaWdodFBlcmNlbnRhZ2UpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyV2hvQW5zd2VyZWRFbGVtZW50LCBxdWVzdGlvbkRhdGFbdGhpcy5BTlNXRVJFRF9QUkVGSVggKyB0aGlzLmFuc3dlckluZGljZXNbYW5zd2VyT25TY3JlZW5dXSk7IFxufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS51cGRhdGVRdWVzdGlvblRpbWVyID0gZnVuY3Rpb24odGltZVJlbWFpbmluZykge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnRpbWVyKTtcbiAgICB2YXIgdGltZXJEYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTi5USU1FUjtcbiAgICB0aW1lckRhdGEudGV4dCA9IHRpbWVSZW1haW5pbmc7XG4gICAgdGhpcy50aW1lciA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQodGltZXJEYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnRpbWVyLCA5NywgMyk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy50aW1lciwgdGltZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUudHVybk9mZkludGVyYWN0aXZpdHlGb3JBbnN3ZXJFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDEuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmFuc3dlckVsZW1lbnQyLmludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5hbnN3ZXJFbGVtZW50My5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuYW5zd2VyRWxlbWVudDQuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuYW5zd2VyRWxlbWVudDEsIHRoaXMuYW5zd2VyRWxlbWVudDIsIHRoaXMuYW5zd2VyRWxlbWVudDMsIHRoaXMuYW5zd2VyRWxlbWVudDRdO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uVmlldzsiLCJXaW5WaWV3LmNvbnN0cnVjdG9yID0gV2luVmlldztcbldpblZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbldpblZpZXcucHJvdG90eXBlLlBMQVlfQUdBSU5fQlVUVE9OID0gMDtcblxuZnVuY3Rpb24gV2luVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuc2V0dXBWaWV3RWxlbWVudHMoKTtcbn1cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVdpbm5lclRleHQgPSBmdW5jdGlvbihwbGF5ZXJXaG9Xb24sIHN0YXREYXRhKSB7XG4gICAgdmFyIHdpbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLldJTjtcbiAgICB0aGlzLmNyZWF0ZVdpblRleHQod2luRGF0YVtwbGF5ZXJXaG9Xb24gKyBcIl9XSU5TXCJdLCB3aW5EYXRhLldJTl9URVhUX1BPU0lUSU9OKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllclN0YXRzVGV4dCh3aW5EYXRhLCBzdGF0RGF0YSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKHBsYXllcldob1dvbikge1xuICAgIHZhciB3aW5EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5XSU47XG4gICAgdGhpcy5jcmVhdGVQbGF5QWdhaW5CdXR0b24od2luRGF0YS5QTEFZX0FHQUlOKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVdpblRleHQgPSBmdW5jdGlvbiAoZGF0YSwgcG9zaXRpb25EYXRhKSB7XG4gICAgdGhpcy53aW5UZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLndpblRleHQsIDUwLCA2Nik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy53aW5UZXh0LCBwb3NpdGlvbkRhdGEpO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyU3RhdHNUZXh0ID0gZnVuY3Rpb24obGF5b3V0RGF0YSwgc3RhdERhdGEpIHtcbiAgICB2YXIgY29ycmVjdFAxQW5zd2VyUGVyY2VudGFnZURlZmF1bHRUZXh0ID0gbGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dDtcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ID0gbGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCArIHN0YXREYXRhLnBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZTtcbiAgICB0aGlzLnBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIDI1LCA3Mik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0LCBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRSk7XG4gICAgbGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCA9IGNvcnJlY3RQMUFuc3dlclBlcmNlbnRhZ2VEZWZhdWx0VGV4dDtcbiAgICBcbiAgICB2YXIgY29ycmVjdFAyQW5zd2VyUGVyY2VudGFnZURlZmF1bHRUZXh0ID0gbGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dDtcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ID0gbGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCArIHN0YXREYXRhLnBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZTtcbiAgICB0aGlzLnBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIDc1LCA3Mik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIyQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0LCBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRSk7XG4gICAgbGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCA9IGNvcnJlY3RQMkFuc3dlclBlcmNlbnRhZ2VEZWZhdWx0VGV4dDtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXlBZ2FpbkJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBsYXlBZ2FpbkJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChEaXNwbGF5LnJlc291cmNlUGF0aCArICcvcGxheS1hZ2Fpbi5wbmcnKTtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluUGVyY2VudCh0aGlzLnBsYXlBZ2FpbkJ1dHRvbiwgNTAsIDgwKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXlBZ2FpbkJ1dHRvbik7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5nZXRJbnRlcmFjdGl2ZVZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5wbGF5QWdhaW5CdXR0b25dO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMucGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCk7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMucGxheWVyMkNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCk7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMud2luVGV4dCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpblZpZXc7Il19
