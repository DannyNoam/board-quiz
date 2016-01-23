(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Display = require('./util/Display');
SocketConstants = require('./SocketConstants');
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
        startRendering();
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
        new ImageLoader('./resource/images.json', beginGame);
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
},{"./SocketConstants":2,"./controller/AvatarSelectionController":3,"./controller/Controller":4,"./controller/FindGameController":5,"./controller/GameController":6,"./controller/HelpController":7,"./controller/MenuController":8,"./controller/TurnController":9,"./controller/subcontroller/DiceController":10,"./controller/subcontroller/PlayerController":11,"./controller/subcontroller/QuestionController":12,"./loader/BucketLoader":13,"./loader/ImageLoader":14,"./loader/JsonLoader":15,"./loader/ViewLoader":16,"./util/Display":17,"./view/AvatarSelectionView":18,"./view/FindGameView":19,"./view/HelpView":20,"./view/LoadingView":21,"./view/MenuView":22,"./view/View":23,"./view/subview/AvatarView":24,"./view/subview/DiceView":25,"./view/subview/PlayerView":26,"./view/subview/QuestionView":27,"./view/subview/WinView":28}],2:[function(require,module,exports){
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
    this.initController();
}

AvatarSelectionController.prototype.initController = function() {
    this.viewLoader.removeAllViews();
    this.view.setupViewElements(this.loadView, this);
};

AvatarSelectionController.prototype.loadView = function() {
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
    this.initController();
}

MenuController.prototype.initController = function() {
    this.viewLoader.removeAllViews();
    this.view.setupViewElements(this.loadView, this);
    this.setupListeners();
};

MenuController.prototype.loadView = function() {
    this.viewLoader.loadView(this.view);
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

AvatarSelectionView.prototype.setupViewElements = function(callback, context) {
    var layoutData = PIXI.Container.layoutData.AVATAR_SELECTION;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.createBoardQuizText(commonData.BOARD_QUIZ);
    this.createBackButton(commonData.BACK_BUTTON);
    this.createSelectDownButton(layoutData.SELECT_DOWN);
    this.createSelectUpButton(layoutData.SELECT_UP);
    this.createFindGameButton(layoutData.FIND_GAME);
    callback.apply(context);
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
},{}],22:[function(require,module,exports){
MenuView.constructor = MenuView;
MenuView.prototype = Object.create(View.prototype);

MenuView.prototype.PLAY_BUTTON = 0;
MenuView.prototype.HELP_BUTTON = 1;

function MenuView() {
    PIXI.Container.call(this);
}

MenuView.prototype.setupViewElements = function(callback, context) {
    var layoutData = PIXI.Container.layoutData.MENU;
    var commonData = PIXI.Container.layoutData.COMMON;
    
    this.createBoardQuizText(commonData.BOARD_QUIZ);
    this.createPlayButton(layoutData.PLAY_BUTTON);
    this.createHelpButton(layoutData.HELP_BUTTON);
    callback.apply(context);
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
},{}],23:[function(require,module,exports){
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


},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTWFpbi5qcyIsInNyYy9Tb2NrZXRDb25zdGFudHMuanMiLCJzcmMvY29udHJvbGxlci9BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0ZpbmRHYW1lQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0dhbWVDb250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvSGVscENvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9NZW51Q29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL1R1cm5Db250cm9sbGVyLmpzIiwic3JjL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9EaWNlQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUXVlc3Rpb25Db250cm9sbGVyLmpzIiwic3JjL2xvYWRlci9CdWNrZXRMb2FkZXIuanMiLCJzcmMvbG9hZGVyL0ltYWdlTG9hZGVyLmpzIiwic3JjL2xvYWRlci9Kc29uTG9hZGVyLmpzIiwic3JjL2xvYWRlci9WaWV3TG9hZGVyLmpzIiwic3JjL3V0aWwvRGlzcGxheS5qcyIsInNyYy92aWV3L0F2YXRhclNlbGVjdGlvblZpZXcuanMiLCJzcmMvdmlldy9GaW5kR2FtZVZpZXcuanMiLCJzcmMvdmlldy9IZWxwVmlldy5qcyIsInNyYy92aWV3L0xvYWRpbmdWaWV3LmpzIiwic3JjL3ZpZXcvTWVudVZpZXcuanMiLCJzcmMvdmlldy9WaWV3LmpzIiwic3JjL3ZpZXcvc3Vidmlldy9BdmF0YXJWaWV3LmpzIiwic3JjL3ZpZXcvc3Vidmlldy9EaWNlVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvUGxheWVyVmlldy5qcyIsInNyYy92aWV3L3N1YnZpZXcvUXVlc3Rpb25WaWV3LmpzIiwic3JjL3ZpZXcvc3Vidmlldy9XaW5WaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJEaXNwbGF5ID0gcmVxdWlyZSgnLi91dGlsL0Rpc3BsYXknKTtcblNvY2tldENvbnN0YW50cyA9IHJlcXVpcmUoJy4vU29ja2V0Q29uc3RhbnRzJyk7XG5WaWV3ID0gcmVxdWlyZSgnLi92aWV3L1ZpZXcnKTtcbkxvYWRpbmdWaWV3ID0gcmVxdWlyZSgnLi92aWV3L0xvYWRpbmdWaWV3Jyk7XG5CdWNrZXRMb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9CdWNrZXRMb2FkZXInKTtcbkpzb25Mb2FkZXIgPSByZXF1aXJlKCcuL2xvYWRlci9Kc29uTG9hZGVyJyk7XG5JbWFnZUxvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyL0ltYWdlTG9hZGVyJyk7XG5WaWV3TG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXIvVmlld0xvYWRlcicpO1xuQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9Db250cm9sbGVyJyk7XG5IZWxwVmlldyA9IHJlcXVpcmUoJy4vdmlldy9IZWxwVmlldycpO1xuSGVscENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvSGVscENvbnRyb2xsZXInKTtcbk1lbnVWaWV3ID0gcmVxdWlyZSgnLi92aWV3L01lbnVWaWV3Jyk7XG5NZW51Q29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9NZW51Q29udHJvbGxlcicpO1xuQXZhdGFyU2VsZWN0aW9uVmlldyA9IHJlcXVpcmUoJy4vdmlldy9BdmF0YXJTZWxlY3Rpb25WaWV3Jyk7XG5BdmF0YXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvQXZhdGFyVmlldycpO1xuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyJyk7XG5GaW5kR2FtZVZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvRmluZEdhbWVWaWV3Jyk7XG5GaW5kR2FtZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvRmluZEdhbWVDb250cm9sbGVyJyk7XG5HYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9HYW1lQ29udHJvbGxlcicpO1xuRGljZVZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9EaWNlVmlldycpO1xuRGljZUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9EaWNlQ29udHJvbGxlcicpO1xuUXVlc3Rpb25WaWV3ID0gcmVxdWlyZSgnLi92aWV3L3N1YnZpZXcvUXVlc3Rpb25WaWV3Jyk7XG5RdWVzdGlvbkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvc3ViY29udHJvbGxlci9RdWVzdGlvbkNvbnRyb2xsZXInKTtcblBsYXllclZpZXcgPSByZXF1aXJlKCcuL3ZpZXcvc3Vidmlldy9QbGF5ZXJWaWV3Jyk7XG5QbGF5ZXJDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3N1YmNvbnRyb2xsZXIvUGxheWVyQ29udHJvbGxlcicpO1xuV2luVmlldyA9IHJlcXVpcmUoJy4vdmlldy9zdWJ2aWV3L1dpblZpZXcnKTtcblR1cm5Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL1R1cm5Db250cm9sbGVyJyk7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBcbiAgICB2YXIgREVGQVVMVF9XSURUSCA9IDQ4MDtcbiAgICB2YXIgREVGQVVMVF9IRUlHSFQgPSAzMjA7XG4gICAgdmFyIFJFTkRFUkVSX0JBQ0tHUk9VTkRfQ09MT1VSID0gMHgzMzMzMzM7XG4gICAgdmFyIERJVl9JRCA9IFwiZ2FtZVwiO1xuICAgIFxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgbmV3IEJ1Y2tldExvYWRlcihsb2FkTGF5b3V0LCBidWNrZXRMb2FkaW5nRmFpbGVkTWVzc2FnZSk7XG4gICAgfSkoKTtcbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkTGF5b3V0KCkge1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS8nICsgRGlzcGxheS5idWNrZXQud2lkdGggKyAneCcgKyBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQgKyAnL2xheW91dC5qc29uJywgc2V0TGF5b3V0RGF0YUluUElYSSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldExheW91dERhdGFJblBJWEkobGF5b3V0RGF0YSkge1xuICAgICAgICBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhID0gbGF5b3V0RGF0YTtcbiAgICAgICAgc3RhcnRSZW5kZXJpbmcoKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc3RhcnRSZW5kZXJpbmcoKSB7XG4gICAgICAgIHZhciB2aWV3TG9hZGVyID0gbmV3IFZpZXdMb2FkZXIoKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICAgICAgICBjb250YWluZXIuaW50ZXJhY3RpdmUgPSB0cnVlO1xuICAgICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoRGlzcGxheS5idWNrZXQud2lkdGgsIERpc3BsYXkuYnVja2V0LmhlaWdodCk7XG4gICAgICAgIHJlbmRlcmVyLmJhY2tncm91bmRDb2xvciA9IFJFTkRFUkVSX0JBQ0tHUk9VTkRfQ09MT1VSO1xuICAgICAgICBzZXREZXBlbmRlbmNpZXModmlld0xvYWRlciwgY29udGFpbmVyLCByZW5kZXJlcik7XG4gICAgICAgIGFwcGVuZEdhbWVUb0RPTShyZW5kZXJlcik7XG4gICAgICAgIGJlZ2luQW5pbWF0aW9uKHZpZXdMb2FkZXIpO1xuICAgICAgICBhZGRMb2FkaW5nVmlld1RvU2NyZWVuKHZpZXdMb2FkZXIpO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS9xdWVzdGlvbnMuanNvbicsIHNldFF1ZXN0aW9uRGF0YUluUXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0UXVlc3Rpb25EYXRhSW5RdWVzdGlvbkNvbnRyb2xsZXIocXVlc3Rpb25EYXRhKSB7XG4gICAgICAgIFF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUucXVlc3Rpb25EYXRhID0gcXVlc3Rpb25EYXRhO1xuICAgICAgICBuZXcgSnNvbkxvYWRlcignLi9yZXNvdXJjZS9jYXRlZ29yaWVzLmpzb24nLCBzZXRDYXRlZ29yeURhdGFJblF1ZXN0aW9uQ29udHJvbGxlcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldENhdGVnb3J5RGF0YUluUXVlc3Rpb25Db250cm9sbGVyKGNhdGVnb3J5RGF0YSkge1xuICAgICAgICBRdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmNhdGVnb3J5RGF0YSA9IGNhdGVnb3J5RGF0YTtcbiAgICAgICAgbG9hZEltYWdlcygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKCkge1xuICAgICAgICBuZXcgSW1hZ2VMb2FkZXIoJy4vcmVzb3VyY2UvaW1hZ2VzLmpzb24nLCBiZWdpbkdhbWUpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBhcHBlbmRHYW1lVG9ET00ocmVuZGVyZXIpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRElWX0lEKS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0RGVwZW5kZW5jaWVzKHZpZXdMb2FkZXIsIGNvbnRhaW5lciwgcmVuZGVyZXIpIHtcbiAgICAgICAgdmlld0xvYWRlci5zZXRDb250YWluZXIoY29udGFpbmVyKTtcbiAgICAgICAgdmlld0xvYWRlci5zZXRSZW5kZXJlcihyZW5kZXJlcik7XG4gICAgICAgIENvbnRyb2xsZXIuc2V0Vmlld0xvYWRlcih2aWV3TG9hZGVyKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYmVnaW5BbmltYXRpb24odmlld0xvYWRlcikge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodmlld0xvYWRlci5hbmltYXRlKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYmVnaW5HYW1lKCkge1xuICAgICAgICB2YXIgbWVudUNvbnRyb2xsZXIgPSBuZXcgTWVudUNvbnRyb2xsZXIoKTsgXG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGFkZExvYWRpbmdWaWV3VG9TY3JlZW4odmlld0xvYWRlcikge1xuICAgICAgICB2YXIgbG9hZGluZ1ZpZXcgPSBuZXcgTG9hZGluZ1ZpZXcoKTtcbiAgICAgICAgbG9hZGluZ1ZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICAgICAgdmlld0xvYWRlci5sb2FkVmlldyhsb2FkaW5nVmlldyk7XG4gICAgfVxuICAgICAgICBcbiAgICBmdW5jdGlvbiBidWNrZXRMb2FkaW5nRmFpbGVkTWVzc2FnZSgpIHtcbiAgICAgICAgRGlzcGxheS5idWNrZXQuaGVpZ2h0ID0gREVGQVVMVF9IRUlHSFQ7XG4gICAgICAgIERpc3BsYXkuYnVja2V0LndpZHRoID0gREVGQVVMVF9XSURUSDtcbiAgICAgICAgRGlzcGxheS5zY2FsZSA9IDE7XG4gICAgICAgIERpc3BsYXkucmVzb3VyY2VQYXRoID0gREVGQVVMVF9XSURUSCArICd4JyArIERFRkFVTFRfSEVJR0hUO1xuICAgIH1cbn07IiwidmFyIFNvY2tldENvbnN0YW50cyA9IHtcbiAgICAnb24nIDoge1xuICAgICAgICAnUExBWUVSU19IRUFMVEgnIDogJ3BsYXllcnMtaGVhbHRoJyxcbiAgICAgICAgJ0RJQ0VfTlVNQkVSJyA6ICdkaWNlLW51bWJlcicsXG4gICAgICAgICdSQU5ET01fUVVFU1RJT04nIDogJ3JhbmRvbS1xdWVzdGlvbicsXG4gICAgICAgICdJTklUX05FV19UVVJOJyA6ICdpbml0LW5ldy10dXJuJyxcbiAgICAgICAgJ0RBTUFHRV9ERUFMVCcgOiAnZGFtYWdlLWRlYWx0JyxcbiAgICAgICAgJ1NIVUZGTEVEX0FOU1dFUl9JTkRJQ0VTJyA6ICdzaHVmZmxlZC1hbnN3ZXItaW5kaWNlcycsXG4gICAgICAgICdHQU1FX0ZPVU5EJyA6ICdnYW1lLWZvdW5kJyxcbiAgICAgICAgJ0dBTUVfU1RBVFMnIDogJ2dhbWUtc3RhdHMnXG4gICAgfSxcbiAgICBcbiAgICAnZW1pdCcgOiB7XG4gICAgICAgICdDT05ORUNUSU9OJyA6ICdjb25uZWN0aW9uJyxcbiAgICAgICAgJ0ZJTkRJTkdfR0FNRScgOiAnZmluZGluZy1nYW1lJyxcbiAgICAgICAgJ0dFVF9QTEFZRVJTX0hFQUxUSCcgOiAnZ2V0LXBsYXllcnMtaGVhbHRoJyxcbiAgICAgICAgJ0RJU0NPTk5FQ1QnIDogJ2Rpc2Nvbm5lY3QnLFxuICAgICAgICAnUk9MTF9ESUNFJyA6ICdyb2xsLWRpY2UnLFxuICAgICAgICAnR0VUX1JBTkRPTV9RVUVTVElPTicgOiAnZ2V0LXJhbmRvbS1xdWVzdGlvbicsXG4gICAgICAgICdORVdfVFVSTicgOiAnbmV3LXR1cm4nLFxuICAgICAgICAnREVBTF9EQU1BR0UnIDogJ2RlYWwtZGFtYWdlJyxcbiAgICAgICAgJ1NIVUZGTEVfQU5TV0VSX0lORElDRVMnIDogJ3NodWZmbGUtYW5zd2VyLWluZGljZXMnLFxuICAgICAgICAnR0FNRV9FTkRFRCcgOiAnZ2FtZS1lbmRlZCdcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvY2tldENvbnN0YW50czsiLCJBdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLmNvbnN0cnVjdG9yID0gQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcjtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEF2YXRhclNlbGVjdGlvblZpZXcoKTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNlbGVjdGVkQXZhdGFyVmlldyA9IG5ldyBBdmF0YXJWaWV3KCk7XG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5hdmF0YXJzID0gWydFTU9KSV9DUlknLCAnRU1PSklfQU5HUlknXTtcbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmN1cnJlbnRBdmF0YXJJbmRleCA9IDA7XG5cbmZ1bmN0aW9uIEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5pbml0Q29udHJvbGxlcigpO1xufVxuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5pbml0Q29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cyh0aGlzLmxvYWRWaWV3LCB0aGlzKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZWxlY3RlZEF2YXRhclZpZXcuc2V0dXBWaWV3RWxlbWVudHModGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XSk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3KTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBiYWNrQnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5CQUNLX0JVVFRPTl07XG4gICAgdmFyIHNlbGVjdFVwID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5TRUxFQ1RfVVBdO1xuICAgIHZhciBzZWxlY3REb3duID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5TRUxFQ1RfRE9XTl07XG4gICAgdmFyIGZpbmRHYW1lID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5GSU5EX0dBTUVdO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gbmV3IE1lbnVDb250cm9sbGVyKCk7XG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHNlbGVjdFVwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIFVQID0gMTtcbiAgICAgICAgdGhpcy5zZXR1cE5leHRBdmF0YXIoVVApO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoc2VsZWN0RG93biwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBET1dOID0gLTE7XG4gICAgICAgIHRoaXMuc2V0dXBOZXh0QXZhdGFyKERPV04pO1xuICAgICAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnNlbGVjdGVkQXZhdGFyVmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoZmluZEdhbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXZhdGFyID0gdGhpcy5hdmF0YXJzW3RoaXMuY3VycmVudEF2YXRhckluZGV4XTtcbiAgICAgICAgdmFyIGZpbmRHYW1lQ29udHJvbGxlciA9IG5ldyBGaW5kR2FtZUNvbnRyb2xsZXIoYXZhdGFyKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBOZXh0QXZhdGFyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgaWYodGhpcy5jdXJyZW50QXZhdGFySW5kZXggPj0gKHRoaXMuYXZhdGFycy5sZW5ndGggLSAxKSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCA9IDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRBdmF0YXJJbmRleCArIGRpcmVjdGlvbiA8IDApIHtcbiAgICAgICAgdGhpcy5jdXJyZW50QXZhdGFySW5kZXggPSAodGhpcy5hdmF0YXJzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3VycmVudEF2YXRhckluZGV4ID0gdGhpcy5jdXJyZW50QXZhdGFySW5kZXggKyBkaXJlY3Rpb247XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWRBdmF0YXJWaWV3LnNldHVwVmlld0VsZW1lbnRzKHRoaXMuYXZhdGFyc1t0aGlzLmN1cnJlbnRBdmF0YXJJbmRleF0pO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXI7IiwiZnVuY3Rpb24gQ29udHJvbGxlcigpIHt9XG5cbkNvbnRyb2xsZXIuc2V0Vmlld0xvYWRlciA9IGZ1bmN0aW9uKHZpZXdMb2FkZXIpIHtcbiAgICBDb250cm9sbGVyLnByb3RvdHlwZS52aWV3TG9hZGVyID0gdmlld0xvYWRlcjtcbn07XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnNvY2tldCA9IGlvKCk7XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTGlzdGVuZXIgPSBmdW5jdGlvbih2aWV3RWxlbWVudCwgYWN0aW9uKSB7XG4gICAgdmlld0VsZW1lbnQudG91Y2hlbmQgPSB2aWV3RWxlbWVudC5jbGljayA9IGFjdGlvbjtcbn07XG5cbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTXVsdGlwbGVMaXN0ZW5lcnMgPSBmdW5jdGlvbih2aWV3RWxlbWVudHMsIGFjdGlvbikge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2aWV3RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKHZpZXdFbGVtZW50c1tpXSwgYWN0aW9uKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7IiwiRmluZEdhbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gRmluZEdhbWVDb250cm9sbGVyO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29udHJvbGxlci5wcm90b3R5cGUpO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IEZpbmRHYW1lVmlldygpO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5hdmF0YXIgPSBudWxsO1xuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5UUkFOU0lUSU9OX1RPX0dBTUVfVElNRSA9IDMwMDA7XG5cbmZ1bmN0aW9uIEZpbmRHYW1lQ29udHJvbGxlcihhdmF0YXIpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLmF2YXRhciA9IGF2YXRhcjtcbiAgICB0aGlzLmxvYWRWaWV3KCk7XG59XG5cbkZpbmRHYW1lQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHModGhpcy5hdmF0YXIpO1xuICAgIHRoaXMudmlld0xvYWRlci5sb2FkVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMuc2V0dXBTZXJ2ZXJJbnRlcmFjdGlvbigpO1xufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cFNlcnZlckludGVyYWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkdBTUVfRk9VTkQsIGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5hc3NpZ25BdmF0YXJzKHBsYXllckRhdGEpO1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlR2FtZUZvdW5kQ2FwdGlvbigpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZUFsbFZpZXdzKCk7XG4gICAgICAgICAgICB2YXIgcGxheWVyQ29udHJvbGxlciA9IG5ldyBQbGF5ZXJDb250cm9sbGVyKHBsYXllckRhdGEpO1xuICAgICAgICAgICAgdmFyIGRpY2VDb250cm9sbGVyID0gbmV3IERpY2VDb250cm9sbGVyKCk7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25Db250cm9sbGVyID0gbmV3IFF1ZXN0aW9uQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyKTtcbiAgICAgICAgICAgIHZhciB0dXJuQ29udHJvbGxlciA9IG5ldyBUdXJuQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCB0aGlzLlRSQU5TSVRJT05fVE9fR0FNRV9USU1FKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuRklORElOR19HQU1FLCB7YXZhdGFyOiB0aGlzLmF2YXRhcn0pO1xufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5hc3NpZ25BdmF0YXJzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBzb2NrZXRJZFByZWZpeCA9IFwiLyNcIjtcbiAgICB2YXIgc29ja2V0SWQgPSBzb2NrZXRJZFByZWZpeCArIHRoaXMuc29ja2V0LmlkO1xuICAgIGlmKGRhdGEucGxheWVyMUlkID09PSBzb2NrZXRJZCkge1xuICAgICAgICB0aGlzLnZpZXcuY3JlYXRlUGxheWVyMkFjdHVhbEF2YXRhcihkYXRhLnBsYXllcjJBdmF0YXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldy5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyKGRhdGEucGxheWVyMUF2YXRhcik7XG4gICAgfVxufTtcblxuRmluZEdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmluZEdhbWVDb250cm9sbGVyOyIsIkdhbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gR2FtZUNvbnRyb2xsZXI7XG5HYW1lQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gR2FtZUNvbnRyb2xsZXIocGxheWVyRGF0YSkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbn1cblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldFBsYXllckRhdGEgPSBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXllckRhdGEgPSBwbGF5ZXJEYXRhO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldERpY2VOdW1iZXIgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmRpY2VOdW1iZXIgPSBkaWNlTnVtYmVyO1xufTtcblxuR2FtZUNvbnRyb2xsZXIucHJvdG90eXBlLmlzUGxheWVyMSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzb2NrZXRQcmVmaXggPSBcIi8jXCI7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyRGF0YS5wbGF5ZXIxSWQgPT09IChzb2NrZXRQcmVmaXggKyBHYW1lQ29udHJvbGxlci5wcm90b3R5cGUuc29ja2V0LmlkKTtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5nZXRQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pc1BsYXllcjEodGhpcy5wbGF5ZXJEYXRhKSA/IFwiUExBWUVSXzFcIiA6IFwiUExBWUVSXzJcIjtcbn07XG5cbkdhbWVDb250cm9sbGVyLnByb3RvdHlwZS5nZXRPcHBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlzUGxheWVyMSh0aGlzLnBsYXllckRhdGEpID8gXCJQTEFZRVJfMlwiIDogXCJQTEFZRVJfMVwiO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lQ29udHJvbGxlcjsiLCJIZWxwQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IEhlbHBDb250cm9sbGVyO1xuSGVscENvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb250cm9sbGVyLnByb3RvdHlwZSk7XG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUudmlldyA9IG5ldyBIZWxwVmlldygpO1xuXG5mdW5jdGlvbiBIZWxwQ29udHJvbGxlcigpIHtcbiAgICBDb250cm9sbGVyLmNhbGwodGhpcyk7XG4gICAgdGhpcy5sb2FkVmlldygpO1xufVxuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlQWxsVmlld3MoKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5IZWxwQ29udHJvbGxlci5wcm90b3R5cGUuc2V0dXBMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7ICBcbiAgICB2YXIgYmFja0J1dHRvbiA9IHZpZXdFbGVtZW50c1t0aGlzLnZpZXcuQkFDS19CVVRUT05dO1xuICAgIFxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcihiYWNrQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lbnVDb250cm9sbGVyID0gbmV3IE1lbnVDb250cm9sbGVyKCk7XG4gICAgfSk7XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBDb250cm9sbGVyOyIsIk1lbnVDb250cm9sbGVyLmNvbnN0cnVjdG9yID0gTWVudUNvbnRyb2xsZXI7XG5NZW51Q29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbnRyb2xsZXIucHJvdG90eXBlKTtcbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IE1lbnVWaWV3KCk7XG5cbmZ1bmN0aW9uIE1lbnVDb250cm9sbGVyKCkge1xuICAgIENvbnRyb2xsZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmluaXRDb250cm9sbGVyKCk7XG59XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5pbml0Q29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlld0xvYWRlci5yZW1vdmVBbGxWaWV3cygpO1xuICAgIHRoaXMudmlldy5zZXR1cFZpZXdFbGVtZW50cyh0aGlzLmxvYWRWaWV3LCB0aGlzKTtcbiAgICB0aGlzLnNldHVwTGlzdGVuZXJzKCk7XG59O1xuXG5NZW51Q29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbn07XG5cbk1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLnZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBwbGF5QnV0dG9uID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5QTEFZX0JVVFRPTl07XG4gICAgdmFyIGhlbHBCdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LkhFTFBfQlVUVE9OXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIocGxheUJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdmF0YXJTZWxlY3Rpb25Db250cm9sbGVyID0gbmV3IEF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIoKTtcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoaGVscEJ1dHRvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWxwQ29udHJvbGxlciA9IG5ldyBIZWxwQ29udHJvbGxlcigpO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51Q29udHJvbGxlcjsiLCJUdXJuQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IFR1cm5Db250cm9sbGVyO1xuVHVybkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBUdXJuQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyLCBkaWNlQ29udHJvbGxlciwgcXVlc3Rpb25Db250cm9sbGVyKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlciA9IGRpY2VDb250cm9sbGVyO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyID0gcXVlc3Rpb25Db250cm9sbGVyO1xuICAgIHRoaXMud2luVmlldyA9IG5ldyBXaW5WaWV3KCk7XG4gICAgdGhpcy5jbGVhblZpZXcoKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlci5sb2FkVmlldygpO1xuICAgIHRoaXMubmV3VHVybigpO1xufVxuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJTb2NrZXRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uSU5JVF9ORVdfVFVSTiwgZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgICAgICBpZihwbGF5ZXJEYXRhLnBsYXllcjFIZWFsdGggPT09IDApIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdBTUVfRU5ERUQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0Lm9uKFNvY2tldENvbnN0YW50cy5vbi5HQU1FX1NUQVRTLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFdpblZpZXcoXCJQTEFZRVJfMlwiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYocGxheWVyRGF0YS5wbGF5ZXIySGVhbHRoID09PSAwKSB7XG4gICAgICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HQU1FX0VOREVEKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uR0FNRV9TVEFUUywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRXaW5WaWV3KFwiUExBWUVSXzFcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubmV3VHVybigpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5sb2FkV2luVmlldyA9IGZ1bmN0aW9uKHBsYXllciwgZGF0YSkge1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy53aW5WaWV3LmNyZWF0ZVdpbm5lclRleHQocGxheWVyLCBkYXRhKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy53aW5WaWV3KTtcbn07XG5cblR1cm5Db250cm9sbGVyLnByb3RvdHlwZS5zZXR1cExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3RWxlbWVudHMgPSB0aGlzLndpblZpZXcuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMoKTsgIFxuICAgIHZhciBwbGF5QWdhaW5CdXR0b24gPSB2aWV3RWxlbWVudHNbdGhpcy53aW5WaWV3LlBMQVlfQUdBSU5fQlVUVE9OXTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIocGxheUFnYWluQnV0dG9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB0aGlzLmRpY2VDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uQ29udHJvbGxlci5jbGVhblZpZXcoKTtcbiAgICAgICAgdmFyIGF2YXRhclNlbGVjdGlvbkNvbnRyb2xsZXIgPSBuZXcgQXZhdGFyU2VsZWN0aW9uQ29udHJvbGxlcigpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUubmV3VHVybiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5kaWNlQ29udHJvbGxlci5yb2xsRGljZSgpO1xuICAgIHRoaXMucXVlc3Rpb25Db250cm9sbGVyLmxvYWRWaWV3KCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wbGF5ZXJDb250cm9sbGVyLmNsZWFuVmlldygpO1xuICAgIHRoaXMuZGljZUNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG4gICAgdGhpcy5xdWVzdGlvbkNvbnRyb2xsZXIuY2xlYW5WaWV3KCk7XG59O1xuXG5UdXJuQ29udHJvbGxlci5wcm90b3R5cGUuY2hlY2tQbGF5ZXJzSGVhbHRoID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUExBWUVSU19IRUFMVEgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUdXJuQ29udHJvbGxlcjsiLCJEaWNlQ29udHJvbGxlci5jb25zdHJ1Y3RvciA9IERpY2VDb250cm9sbGVyO1xuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnZpZXcgPSBuZXcgRGljZVZpZXcoKTtcblxuZnVuY3Rpb24gRGljZUNvbnRyb2xsZXIoKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJTb2NrZXRFdmVudHMoKTtcbn1cblxuRGljZUNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLkRJQ0VfTlVNQkVSLCBmdW5jdGlvbihkaWNlKSB7XG4gICAgICAgIHRoaXMubG9hZERpY2UoZGljZS5udW1iZXIpO1xuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUucm9sbERpY2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuUk9MTF9ESUNFKTtcbiAgICB9XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUubG9hZERpY2UgPSBmdW5jdGlvbihkaWNlTnVtYmVyKSB7XG4gICAgdGhpcy52aWV3LnNldHVwRGljZShkaWNlTnVtYmVyKTtcbiAgICB0aGlzLnNldERpY2VOdW1iZXIoZGljZU51bWJlcik7XG4gICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG59O1xuXG5EaWNlQ29udHJvbGxlci5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3TG9hZGVyLnJlbW92ZVZpZXcodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuY2xlYW5WaWV3KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpY2VDb250cm9sbGVyOyIsIlBsYXllckNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBQbGF5ZXJDb250cm9sbGVyO1xuUGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdhbWVDb250cm9sbGVyLnByb3RvdHlwZSk7XG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IFBsYXllclZpZXcoKTtcblxuZnVuY3Rpb24gUGxheWVyQ29udHJvbGxlcihwbGF5ZXJEYXRhKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMuc2V0UGxheWVyRGF0YShwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ja2V0RXZlbnRzKCk7XG59XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmxvYWRWaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWV3LnNldFBsYXllckRhdGEodGhpcy5wbGF5ZXJEYXRhKTtcbiAgICB0aGlzLnZpZXcuc2V0dXBWaWV3RWxlbWVudHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBsYXllcnNIZWFsdGgoKTtcbiAgICB0aGlzLnZpZXdMb2FkZXIubG9hZFZpZXcodGhpcy52aWV3KTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlBMQVlFUlNfSEVBTFRILCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRQbGF5ZXIxSGVhbHRoKHBsYXllckRhdGEucGxheWVyMUhlYWx0aCk7XG4gICAgICAgIHRoaXMudmlldy5zZXRQbGF5ZXIySGVhbHRoKHBsYXllckRhdGEucGxheWVyMkhlYWx0aCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVBsYXllcnNIZWFsdGggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkdFVF9QTEFZRVJTX0hFQUxUSCk7XG59O1xuXG5QbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyQ29udHJvbGxlcjsiLCJRdWVzdGlvbkNvbnRyb2xsZXIuY29uc3RydWN0b3IgPSBRdWVzdGlvbkNvbnRyb2xsZXI7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHYW1lQ29udHJvbGxlci5wcm90b3R5cGUpO1xuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS52aWV3ID0gbmV3IFF1ZXN0aW9uVmlldygpO1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzEgPSAnQU5TV0VSRURfMSc7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzIgPSAnQU5TV0VSRURfMic7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzMgPSAnQU5TV0VSRURfMyc7XG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLkFOU1dFUkVEXzQgPSAnQU5TV0VSRURfNCc7XG5cbmZ1bmN0aW9uIFF1ZXN0aW9uQ29udHJvbGxlcihwbGF5ZXJDb250cm9sbGVyKSB7XG4gICAgQ29udHJvbGxlci5jYWxsKHRoaXMpO1xuICAgIHRoaXMucGxheWVyQ29udHJvbGxlciA9IHBsYXllckNvbnRyb2xsZXI7XG4gICAgdGhpcy5yZWdpc3RlclNvY2tldEV2ZW50cygpO1xufVxuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyU29ja2V0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlJBTkRPTV9RVUVTVElPTiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gZGF0YS5xdWVzdGlvbjtcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGRhdGEuY2F0ZWdvcnk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnNvY2tldC5vbihTb2NrZXRDb25zdGFudHMub24uREFNQUdFX0RFQUxULCBmdW5jdGlvbihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJUb0NvbG91cih0aGlzLmFuc3dlcnNbcGxheWVyRGF0YS5hbnN3ZXJdLCBwbGF5ZXJEYXRhLmFuc3dlcik7XG4gICAgICAgIHRoaXMudmlldy5zZXRXaG9BbnN3ZXJlZFF1ZXN0aW9uKHRoaXMuYW5zd2Vyc1twbGF5ZXJEYXRhLmFuc3dlcl0sIHBsYXllckRhdGEuYW5zd2VyLCBwbGF5ZXJEYXRhLnBsYXllcl93aG9fYW5zd2VyZWQpO1xuICAgICAgICB0aGlzLnZpZXcudHVybk9mZkludGVyYWN0aXZpdHlGb3JBbnN3ZXJFbGVtZW50cygpO1xuICAgICAgICB0aGlzLnBsYXllckNvbnRyb2xsZXIudXBkYXRlUGxheWVyc0hlYWx0aCgpO1xuICAgICAgICBpZih0aGlzLmlzUGxheWVyMSgpKSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0Lk5FV19UVVJOKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgdGhpcy5zb2NrZXQub24oU29ja2V0Q29uc3RhbnRzLm9uLlNIVUZGTEVEX0FOU1dFUl9JTkRJQ0VTLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMudmlldy5zZXRBbnN3ZXJJbmRpY2VzKGRhdGEpO1xuICAgICAgICB0aGlzLnZpZXcuZGlzcGxheUNhdGVnb3J5QW5kUXVlc3Rpb24odGhpcy5jYXRlZ29yeSwgdGhpcy5xdWVzdGlvbik7XG4gICAgICAgIHRoaXMuc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy52aWV3TG9hZGVyLmxvYWRWaWV3KHRoaXMudmlldyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUubG9hZFZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdldFJhbmRvbVF1ZXN0aW9uKCk7XG4gICAgdGhpcy5zaHVmZmxlQW5zd2VySW5kaWNlcygpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5nZXRSYW5kb21RdWVzdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdmFyIGNhdGVnb3JpZXMgPSB0aGlzLmNhdGVnb3J5RGF0YS5DQVRFR09SSUVTO1xuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5xdWVzdGlvbkRhdGEuQ0FURUdPUklFUztcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5HRVRfUkFORE9NX1FVRVNUSU9OLCB7Y2F0ZWdvcmllczogY2F0ZWdvcmllcywgcXVlc3Rpb25zOiBxdWVzdGlvbnN9KTtcbiAgICB9XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFuc3dlcnMgPSB0aGlzLmdldFZpZXdBbnN3ZXJzKCk7XG4gICAgdGhpcy5zZXRSaWdodEFuc3dlckxpc3RlbmVyKGFuc3dlcnMpO1xuICAgIHRoaXMuc2V0V3JvbmdBbnN3ZXJMaXN0ZW5lcnMoYW5zd2Vycyk7XG4gICAgdGhpcy5zZXRBbnN3ZXJVcGRhdGVMaXN0ZW5lcihhbnN3ZXJzKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0Vmlld0Fuc3dlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlld0VsZW1lbnRzID0gdGhpcy52aWV3LmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzKCk7XG4gICAgdmFyIGFuc3dlcnMgPSB7fTtcbiAgICBhbnN3ZXJzLkFOU1dFUkVEXzEgPSB2aWV3RWxlbWVudHNbdGhpcy52aWV3LlJJR0hUX0FOU1dFUl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8yID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMV07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF8zID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfMl07XG4gICAgYW5zd2Vycy5BTlNXRVJFRF80ID0gdmlld0VsZW1lbnRzW3RoaXMudmlldy5XUk9OR19BTlNXRVJfM107XG4gICAgcmV0dXJuIGFuc3dlcnM7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFJpZ2h0QW5zd2VyTGlzdGVuZXIgPSBmdW5jdGlvbihhbnN3ZXJzKSB7XG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVyKGFuc3dlcnMuQU5TV0VSRURfMSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZW1pdERlYWxEYW1hZ2VUb09wcG9uZW50VG9Tb2NrZXQodGhpcy5BTlNXRVJFRF8xKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXRXcm9uZ0Fuc3dlckxpc3RlbmVycyA9IGZ1bmN0aW9uKGFuc3dlcnMpIHtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF8yLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0KHRoaXMuQU5TV0VSRURfMik7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF8zLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0KHRoaXMuQU5TV0VSRURfMyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXIoYW5zd2Vycy5BTlNXRVJFRF80LCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbWl0RGVhbERhbWFnZVRvU2VsZlRvU29ja2V0KHRoaXMuQU5TV0VSRURfNCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblF1ZXN0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2h1ZmZsZUFuc3dlckluZGljZXMgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGlmKHRoaXMuaXNQbGF5ZXIxKCkpIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChTb2NrZXRDb25zdGFudHMuZW1pdC5TSFVGRkxFX0FOU1dFUl9JTkRJQ0VTLCB7aW5kaWNlczogWzEsMiwzLDRdfSk7XG4gICAgfVxufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5zZXRBbnN3ZXJVcGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uKGFuc3dlcnMpIHtcbiAgICB0aGlzLmFuc3dlcnMgPSBhbnN3ZXJzO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5lbWl0RGVhbERhbWFnZVRvT3Bwb25lbnRUb1NvY2tldCA9IGZ1bmN0aW9uKGFuc3dlcikge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoU29ja2V0Q29uc3RhbnRzLmVtaXQuREVBTF9EQU1BR0UsIHtwbGF5ZXJfd2hvX2Fuc3dlcmVkOiB0aGlzLmdldFBsYXllcigpLCBwbGF5ZXJfdG9fZGFtYWdlOiB0aGlzLmdldE9wcG9uZW50KCksIGRhbWFnZTogdGhpcy5kaWNlTnVtYmVyLCBhbnN3ZXI6IGFuc3dlciwgYW5zd2VyU3RhdHVzOiAnY29ycmVjdCcsIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5fSk7XG59O1xuXG5RdWVzdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmVtaXREZWFsRGFtYWdlVG9TZWxmVG9Tb2NrZXQgPSBmdW5jdGlvbihhbnN3ZXIpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KFNvY2tldENvbnN0YW50cy5lbWl0LkRFQUxfREFNQUdFLCB7cGxheWVyX3dob19hbnN3ZXJlZDogdGhpcy5nZXRQbGF5ZXIoKSwgcGxheWVyX3RvX2RhbWFnZTogdGhpcy5nZXRQbGF5ZXIoKSwgZGFtYWdlOiB0aGlzLmRpY2VOdW1iZXIsIGFuc3dlcjogYW5zd2VyLCBhbnN3ZXJTdGF0dXM6ICdpbmNvcnJlY3QnLCBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeX0pO1xufTtcblxuUXVlc3Rpb25Db250cm9sbGVyLnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZXdMb2FkZXIucmVtb3ZlVmlldyh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5jbGVhblZpZXcoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25Db250cm9sbGVyOyIsImZ1bmN0aW9uIEJ1Y2tldExvYWRlciAoY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgUE9SVFJBSVQgPSBcInBvcnRyYWl0XCIsXG4gICAgICAgIExBTkRTQ0FQRSA9IFwibGFuZHNjYXBlXCIsXG4gICAgICAgIEJVQ0tFVF9TSVpFX0pTT05fUEFUSCA9IFwicmVzb3VyY2UvYnVja2V0X3NpemVzLmpzb25cIjtcblxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG5ldyBKc29uTG9hZGVyKEJVQ0tFVF9TSVpFX0pTT05fUEFUSCwgY2FsY3VsYXRlQmVzdEJ1Y2tldCk7XG4gICAgfSkoKTtcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVNjYWxlICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGguZmxvb3Iod2luZG93LmRldmljZVBpeGVsUmF0aW8pLCAyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVCZXN0QnVja2V0IChidWNrZXREYXRhKSB7XG4gICAgICAgIHZhciBvcmllbnRhdGlvbiA9IGNhbGN1bGF0ZU9yaWVudGF0aW9uKCk7XG4gICAgICAgIGJ1Y2tldERhdGFbb3JpZW50YXRpb25dLmZvckVhY2goZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgICAgICAgICAgaWYgKGJ1Y2tldC5oZWlnaHQgPD0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgRGlzcGxheS5idWNrZXQgPSBidWNrZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIERpc3BsYXkuc2NhbGUgPSBjYWxjdWxhdGVTY2FsZSh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgIERpc3BsYXkucmVzb3VyY2VQYXRoID0gRGlzcGxheS5idWNrZXQud2lkdGggKyAneCcgKyBEaXNwbGF5LmJ1Y2tldC5oZWlnaHQ7XG4gICAgICAgIGV4ZWN1dGVDYWxsYmFjaygpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVPcmllbnRhdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFBPUlRSQUlUO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIExBTkRTQ0FQRTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWN1dGVDYWxsYmFjayAoKSB7XG4gICAgICAgIGlmIChEaXNwbGF5LmJ1Y2tldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWNrZXRMb2FkZXI7IiwidmFyIEltYWdlTG9hZGVyID0gZnVuY3Rpb24oaW1hZ2VKc29uUGF0aCwgY2FsbGJhY2spIHtcbiAgICB2YXIganNvbkxvYWRlciA9IG5ldyBKc29uTG9hZGVyKGltYWdlSnNvblBhdGgsIGxvYWRJbWFnZXMpO1xuICAgIHZhciBpbWFnZXNMb2FkZWQgPSAwO1xuICAgIHZhciB0b3RhbEltYWdlcyA9IDA7XG4gICAgXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlcyhpbWFnZURhdGEpIHtcbiAgICAgICAgdmFyIGltYWdlcyA9IGltYWdlRGF0YS5JTUFHRVM7XG4gICAgICAgIGNvdW50TnVtYmVyT2ZJbWFnZXMoaW1hZ2VzKTtcbiAgICAgICAgZm9yKHZhciBpbWFnZSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIGxvYWRJbWFnZShpbWFnZXNbaW1hZ2VdLnBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGxvYWRJbWFnZShpbWFnZVBhdGgpIHtcbiAgICAgICAgdmFyIFJFUVVFU1RfRklOSVNIRUQgPSA0O1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBpbWFnZVBhdGgsIHRydWUpO1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gUkVRVUVTVF9GSU5JU0hFRCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbmlzaGVkIGxvYWRpbmcgaW1hZ2UgcGF0aDogXCIgKyBpbWFnZVBhdGgpO1xuICAgICAgICAgICAgICBpbWFnZXNMb2FkZWQrKztcbiAgICAgICAgICAgICAgY2hlY2tJZkFsbEltYWdlc0xvYWRlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY291bnROdW1iZXJPZkltYWdlcyhpbWFnZXMpIHtcbiAgICAgICAgZm9yKHZhciBpbWFnZSBpbiBpbWFnZXMpIHtcbiAgICAgICAgICAgIHRvdGFsSW1hZ2VzKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY2hlY2tJZkFsbEltYWdlc0xvYWRlZCgpIHtcbiAgICAgICAgaWYoaW1hZ2VzTG9hZGVkID09PSB0b3RhbEltYWdlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbGwgaW1hZ2VzIGxvYWRlZCFcIik7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJPbmx5IFwiICsgaW1hZ2VzTG9hZGVkICsgXCIgYXJlIGxvYWRlZC5cIik7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlTG9hZGVyOyIsInZhciBKc29uTG9hZGVyID0gZnVuY3Rpb24gKHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICBSRVFVRVNUX0ZJTklTSEVEID0gNDtcbiAgICAoZnVuY3Rpb24gbG9hZEpzb24oKSB7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm92ZXJyaWRlTWltZVR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpO1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gUkVRVUVTVF9GSU5JU0hFRCkge1xuICAgICAgICAgICAgdGhhdC5kYXRhID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIGNhbGxiYWNrKHRoYXQuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhhdC5kYXRhO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSnNvbkxvYWRlcjtcbiIsImZ1bmN0aW9uIFZpZXdMb2FkZXIoKSB7fVxuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5sb2FkVmlldyA9IGZ1bmN0aW9uKHZpZXcpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyLmFkZENoaWxkKHZpZXcpO1xuICAgIGNvbnNvbGUubG9nKHZpZXcpO1xufTtcblxuVmlld0xvYWRlci5wcm90b3R5cGUucmVtb3ZlQWxsVmlld3MgPSBmdW5jdGlvbigpIHtcbiAgICBWaWV3TG9hZGVyLnRvcExldmVsQ29udGFpbmVyLnJlbW92ZUNoaWxkcmVuKCk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5yZW1vdmVWaWV3ID0gZnVuY3Rpb24odmlldykge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIucmVtb3ZlQ2hpbGQodmlldyk7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5zZXRSZW5kZXJlciA9IGZ1bmN0aW9uKHJlbmRlcmVyKSB7XG4gICAgVmlld0xvYWRlci5wcm90b3R5cGUucmVuZGVyZXIgPSByZW5kZXJlcjtcbn07XG5cblZpZXdMb2FkZXIucHJvdG90eXBlLnNldENvbnRhaW5lciA9IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xuICAgIFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIgPSBjb250YWluZXI7XG59O1xuXG5WaWV3TG9hZGVyLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgVmlld0xvYWRlci5wcm90b3R5cGUucmVuZGVyZXIucmVuZGVyKFZpZXdMb2FkZXIudG9wTGV2ZWxDb250YWluZXIpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShWaWV3TG9hZGVyLnByb3RvdHlwZS5hbmltYXRlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlld0xvYWRlcjsiLCJ2YXIgRGlzcGxheSA9IHtcbiAgICBidWNrZXQ6IG51bGwsXG4gICAgc2NhbGU6IG51bGwsXG4gICAgcmVzb3VyY2VQYXRoOiBudWxsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BsYXk7IiwiQXZhdGFyU2VsZWN0aW9uVmlldy5jb25zdHJ1Y3RvciA9IEF2YXRhclNlbGVjdGlvblZpZXc7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5TRUxFQ1RfVVAgPSAxO1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuU0VMRUNUX0RPV04gPSAyO1xuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuRklORF9HQU1FID0gMztcblxuXG5mdW5jdGlvbiBBdmF0YXJTZWxlY3Rpb25WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgbGF5b3V0RGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQVZBVEFSX1NFTEVDVElPTjtcbiAgICB2YXIgY29tbW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQ09NTU9OO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlQm9hcmRRdWl6VGV4dChjb21tb25EYXRhLkJPQVJEX1FVSVopO1xuICAgIHRoaXMuY3JlYXRlQmFja0J1dHRvbihjb21tb25EYXRhLkJBQ0tfQlVUVE9OKTtcbiAgICB0aGlzLmNyZWF0ZVNlbGVjdERvd25CdXR0b24obGF5b3V0RGF0YS5TRUxFQ1RfRE9XTik7XG4gICAgdGhpcy5jcmVhdGVTZWxlY3RVcEJ1dHRvbihsYXlvdXREYXRhLlNFTEVDVF9VUCk7XG4gICAgdGhpcy5jcmVhdGVGaW5kR2FtZUJ1dHRvbihsYXlvdXREYXRhLkZJTkRfR0FNRSk7XG4gICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVCb2FyZFF1aXpUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgYm9hcmRRdWl6VGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoYm9hcmRRdWl6VGV4dCwgZGF0YSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVCYWNrQnV0dG9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmJhY2tCdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5iYWNrQnV0dG9uLCBkYXRhKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZVNlbGVjdERvd25CdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuc2VsZWN0RG93bkJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnNlbGVjdERvd25CdXR0b24sIGRhdGEpO1xufTtcblxuQXZhdGFyU2VsZWN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlU2VsZWN0VXBCdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuc2VsZWN0VXBCdXR0b24gPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5zZWxlY3RVcEJ1dHRvbiwgZGF0YSk7XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVGaW5kR2FtZUJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5maW5kR2FtZUJ1dHRvbiA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmZpbmRHYW1lQnV0dG9uLCBkYXRhKTtcbn07XG5cbkF2YXRhclNlbGVjdGlvblZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLmJhY2tCdXR0b24sIHRoaXMuc2VsZWN0VXBCdXR0b24sIHRoaXMuc2VsZWN0RG93bkJ1dHRvbiwgdGhpcy5maW5kR2FtZUJ1dHRvbl07XG59O1xuXG5BdmF0YXJTZWxlY3Rpb25WaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclNlbGVjdGlvblZpZXc7IiwiRmluZEdhbWVWaWV3LmNvbnN0cnVjdG9yID0gRmluZEdhbWVWaWV3O1xuRmluZEdhbWVWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBGaW5kR2FtZVZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5GSU5EX0dBTUU7XG4gICAgdmFyIGF2YXRhckRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkFWQVRBUjtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZUZpbmRHYW1lQ2FwdGlvbihsYXlvdXREYXRhLkNBUFRJT04pO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMUF2YXRhcihhdmF0YXJEYXRhW2F2YXRhcl0sIGxheW91dERhdGEuUExBWUVSXzFfQVZBVEFSKTtcbiAgICB0aGlzLmNyZWF0ZVZlcnN1c1RleHQobGF5b3V0RGF0YS5WRVJTVVMpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMlVua25vd25BdmF0YXIoYXZhdGFyRGF0YS5QTEFZRVJfMl9VTktOT1dOLCBsYXlvdXREYXRhLlBMQVlFUl8yX0FWQVRBUik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxVGV4dChsYXlvdXREYXRhLlBMQVlFUl8xKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjJUZXh0KGxheW91dERhdGEuUExBWUVSXzIpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVGaW5kR2FtZUNhcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuZmluZEdhbWVDYXB0aW9uID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmZpbmRHYW1lQ2FwdGlvbiwgZGF0YSk7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFBdmF0YXIgPSBmdW5jdGlvbiAoYXZhdGFyLCBkYXRhKSB7XG4gICAgdmFyIHBsYXllcjFBdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoYXZhdGFyKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIxQXZhdGFyLCBkYXRhKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlVmVyc3VzVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHZlcnN1cyA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodmVyc3VzLCBkYXRhKTtcbn07XG5cbkZpbmRHYW1lVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMlVua25vd25BdmF0YXIgPSBmdW5jdGlvbiAoYXZhdGFyLCBkYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIyVW5rbm93bkF2YXRhciA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChhdmF0YXIpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMlVua25vd25BdmF0YXIsIGRhdGEpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHBsYXllcjEgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjEsIGRhdGEpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHBsYXllcjIgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjIsIGRhdGEpO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyQWN0dWFsQXZhdGFyID0gZnVuY3Rpb24gKGF2YXRhcikge1xuICAgIHRoaXMucmVtb3ZlRWxlbWVudCh0aGlzLnBsYXllcjJVbmtub3duQXZhdGFyKTtcbiAgICB2YXIgcGxheWVyMlVua25vd25BdmF0YXIgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5BVkFUQVJbYXZhdGFyXSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIocGxheWVyMlVua25vd25BdmF0YXIsIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuRklORF9HQU1FLlBMQVlFUl8yX0FWQVRBUik7XG59O1xuXG5GaW5kR2FtZVZpZXcucHJvdG90eXBlLmNyZWF0ZUdhbWVGb3VuZENhcHRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW1vdmVFbGVtZW50KHRoaXMuZmluZEdhbWVDYXB0aW9uKTtcbiAgICB2YXIgZm91bmRHYW1lQ2FwdGlvbiA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5GSU5EX0dBTUUuRk9VTkRfR0FNRV9DQVBUSU9OKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihmb3VuZEdhbWVDYXB0aW9uLCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkZJTkRfR0FNRS5GT1VORF9HQU1FX0NBUFRJT04pO1xufTtcblxuRmluZEdhbWVWaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbmRHYW1lVmlldzsiLCJIZWxwVmlldy5jb25zdHJ1Y3RvciA9IEhlbHBWaWV3O1xuSGVscFZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5cbmZ1bmN0aW9uIEhlbHBWaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5IRUxQO1xuICAgIHZhciBjb21tb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5DT01NT047XG4gICAgXG4gICAgdGhpcy5jcmVhdGVIZWxwVGV4dChsYXlvdXREYXRhLklORk8pO1xuICAgIHRoaXMuY3JlYXRlQmFja0J1dHRvbihjb21tb25EYXRhLkJBQ0tfQlVUVE9OKTtcbn07XG5cbkhlbHBWaWV3LnByb3RvdHlwZS5jcmVhdGVIZWxwVGV4dCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGhlbHBUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihoZWxwVGV4dCwgZGF0YSk7XG59O1xuXG5IZWxwVmlldy5wcm90b3R5cGUuY3JlYXRlQmFja0J1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5iYWNrQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuYmFja0J1dHRvbiwgZGF0YSk7XG59O1xuXG5IZWxwVmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuYmFja0J1dHRvbl07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBWaWV3OyIsIkxvYWRpbmdWaWV3LmNvbnN0cnVjdG9yID0gTG9hZGluZ1ZpZXc7XG5Mb2FkaW5nVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gTG9hZGluZ1ZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuTG9hZGluZ1ZpZXcucHJvdG90eXBlLnNldHVwVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkxPQURJTkc7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVMb2FkaW5nVGV4dChsYXlvdXREYXRhLkxPQURJTkdfVEVYVCk7XG59O1xuXG5Mb2FkaW5nVmlldy5wcm90b3R5cGUuY3JlYXRlTG9hZGluZ1RleHQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgbG9hZGluZyB0ZXh0Li4uXCIpO1xuICAgIHZhciBsb2FkaW5nVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIobG9hZGluZ1RleHQsIGRhdGEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nVmlldzsiLCJNZW51Vmlldy5jb25zdHJ1Y3RvciA9IE1lbnVWaWV3O1xuTWVudVZpZXcucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShWaWV3LnByb3RvdHlwZSk7XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5QTEFZX0JVVFRPTiA9IDA7XG5NZW51Vmlldy5wcm90b3R5cGUuSEVMUF9CVVRUT04gPSAxO1xuXG5mdW5jdGlvbiBNZW51VmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5NZW51Vmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBsYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5NRU5VO1xuICAgIHZhciBjb21tb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5DT01NT047XG4gICAgXG4gICAgdGhpcy5jcmVhdGVCb2FyZFF1aXpUZXh0KGNvbW1vbkRhdGEuQk9BUkRfUVVJWik7XG4gICAgdGhpcy5jcmVhdGVQbGF5QnV0dG9uKGxheW91dERhdGEuUExBWV9CVVRUT04pO1xuICAgIHRoaXMuY3JlYXRlSGVscEJ1dHRvbihsYXlvdXREYXRhLkhFTFBfQlVUVE9OKTtcbiAgICBjYWxsYmFjay5hcHBseShjb250ZXh0KTtcbn07XG5cbk1lbnVWaWV3LnByb3RvdHlwZS5jcmVhdGVCb2FyZFF1aXpUZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgYm9hcmRRdWl6VGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoZGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIoYm9hcmRRdWl6VGV4dCwgZGF0YSk7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlUGxheUJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5wbGF5QnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheUJ1dHRvbiwgZGF0YSk7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuY3JlYXRlSGVscEJ1dHRvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5oZWxwQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuaGVscEJ1dHRvbiwgZGF0YSk7XG59O1xuXG5NZW51Vmlldy5wcm90b3R5cGUuZ2V0SW50ZXJhY3RpdmVWaWV3RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMucGxheUJ1dHRvbiwgdGhpcy5oZWxwQnV0dG9uXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXc7IiwiVmlldy5jb25zdHJ1Y3RvciA9IFZpZXc7XG5WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblZpZXcucHJvdG90eXBlLklOVEVSQUNUSVZFID0gdHJ1ZTtcblZpZXcucHJvdG90eXBlLkNFTlRFUl9BTkNIT1IgPSAwLjU7XG5cbmZ1bmN0aW9uIFZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuVmlldy5wcm90b3R5cGUuYWRkRWxlbWVudFRvQ29udGFpbmVyID0gZnVuY3Rpb24oZWxlbWVudCwgcG9zaXRpb25EYXRhKSB7XG4gICAgdGhpcy5zZXRFbGVtZW50UG9zaXRpb24oZWxlbWVudCwgcG9zaXRpb25EYXRhKTtcbiAgICBlbGVtZW50LmFuY2hvci54ID0gdGhpcy5DRU5URVJfQU5DSE9SO1xuICAgIGVsZW1lbnQuYW5jaG9yLnkgPSB0aGlzLkNFTlRFUl9BTkNIT1I7XG4gICAgZWxlbWVudC5pbnRlcmFjdGl2ZSA9IHRoaXMuSU5URVJBQ1RJVkU7XG4gICAgdGhpcy5hZGRDaGlsZChlbGVtZW50KTtcbn07XG5cblZpZXcucHJvdG90eXBlLnNldEVsZW1lbnRQb3NpdGlvbiA9IGZ1bmN0aW9uKGVsZW1lbnQsIHBvc2l0aW9uRGF0YSkge1xuICAgIGVsZW1lbnQucG9zaXRpb24ueCA9IHBvc2l0aW9uRGF0YS54O1xuICAgIGVsZW1lbnQucG9zaXRpb24ueSA9IHBvc2l0aW9uRGF0YS55O1xufTtcblxuVmlldy5wcm90b3R5cGUuY3JlYXRlVGV4dEVsZW1lbnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQSVhJLlRleHQoZGF0YS50ZXh0LCB7Zm9udDogZGF0YS5zaXplICsgXCJweCBcIiArIGRhdGEuZm9udCwgZmlsbDogZGF0YS5jb2xvcn0pO1xufTtcblxuVmlldy5wcm90b3R5cGUuY3JlYXRlU3ByaXRlRWxlbWVudCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShkYXRhLnBhdGgpO1xufTtcblxuVmlldy5wcm90b3R5cGUucmVtb3ZlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xufTtcblxuVmlldy5wcm90b3R5cGUudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB0aGlzLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIHRoaXMuYWRkQ2hpbGQoZWxlbWVudCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5yZW1vdmVBbGxFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcblxuIiwiQXZhdGFyVmlldy5jb25zdHJ1Y3RvciA9IEF2YXRhclZpZXc7XG5BdmF0YXJWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5BdmF0YXJWaWV3LnByb3RvdHlwZS5CQUNLX0JVVFRPTiA9IDA7XG5cbmZ1bmN0aW9uIEF2YXRhclZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbn1cblxuQXZhdGFyVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbihhdmF0YXJOYW1lKSB7XG4gICAgdmFyIGxheW91dERhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkFWQVRBUjtcbiAgICB2YXIgY29tbW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuQ09NTU9OO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlQXZhdGFyKGxheW91dERhdGFbYXZhdGFyTmFtZV0pO1xufTtcblxuQXZhdGFyVmlldy5wcm90b3R5cGUuY3JlYXRlQXZhdGFyID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgYXZhdGFyID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKGF2YXRhciwgZGF0YSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF2YXRhclZpZXc7IiwiRGljZVZpZXcuY29uc3RydWN0b3IgPSBEaWNlVmlldztcbkRpY2VWaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBEaWNlVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5EaWNlVmlldy5wcm90b3R5cGUuc2V0dXBEaWNlID0gZnVuY3Rpb24oZGljZU51bWJlcikge1xuICAgIHZhciBkaWNlSW1hZ2UgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkRJQ0VbZGljZU51bWJlcl07XG4gICAgdmFyIGRpY2VQb3NpdGlvbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkRJQ0UuQ09PUkRTO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlRGljZUVsZW1lbnQoZGljZUltYWdlLCBkaWNlUG9zaXRpb25EYXRhKTtcbn07XG5cbkRpY2VWaWV3LnByb3RvdHlwZS5jcmVhdGVEaWNlRWxlbWVudCA9IGZ1bmN0aW9uKGRpY2VJbWFnZSwgZGljZVBvc2l0aW9uRGF0YSkge1xuICAgIHRoaXMuZGljZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVNwcml0ZUVsZW1lbnQoZGljZUltYWdlKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLmRpY2VFbGVtZW50LCBkaWNlUG9zaXRpb25EYXRhKTtcbn07XG5cbkRpY2VWaWV3LnByb3RvdHlwZS5jbGVhblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUFsbEVsZW1lbnRzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpY2VWaWV3OyIsIlBsYXllclZpZXcuY29uc3RydWN0b3IgPSBQbGF5ZXJWaWV3O1xuUGxheWVyVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gUGxheWVyVmlldygpIHtcbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5zZXRQbGF5ZXJEYXRhID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIHRoaXMucGxheWVyRGF0YSA9IHBsYXllckRhdGE7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5zZXR1cFZpZXdFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5ZXJMYXlvdXREYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5QTEFZRVI7XG4gICAgdmFyIGF2YXRhckRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLkFWQVRBUjtcbiAgICBcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFBdmF0YXIoYXZhdGFyRGF0YVt0aGlzLnBsYXllckRhdGEucGxheWVyMUF2YXRhcl0sIHBsYXllckxheW91dERhdGEuUExBWUVSXzFfQVZBVEFSKTtcbiAgICB0aGlzLmNyZWF0ZVBsYXllcjFIZWFsdGgocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMV9IRUFMVEgpO1xuICAgIFxuICAgIHRoaXMuY3JlYXRlUGxheWVyMkF2YXRhcihhdmF0YXJEYXRhW3RoaXMucGxheWVyRGF0YS5wbGF5ZXIyQXZhdGFyXSwgcGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMl9BVkFUQVIpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMkhlYWx0aChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8yX0hFQUxUSCk7XG4gICAgXG4gICAgdGhpcy5jcmVhdGVQbGF5ZXIxVGV4dChwbGF5ZXJMYXlvdXREYXRhLlBMQVlFUl8xX1RFWFQpO1xuICAgIHRoaXMuY3JlYXRlUGxheWVyMlRleHQocGxheWVyTGF5b3V0RGF0YS5QTEFZRVJfMl9URVhUKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjFBdmF0YXIgPSBmdW5jdGlvbihhdmF0YXIsIGF2YXRhclBvc2l0aW9uKSB7XG4gICAgdGhpcy5wbGF5ZXIxQXZhdGFyID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGF2YXRhcik7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIxQXZhdGFyLCBhdmF0YXJQb3NpdGlvbik7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIyQXZhdGFyID0gZnVuY3Rpb24oYXZhdGFyLCBhdmF0YXJQb3NpdGlvbikge1xuICAgIHRoaXMucGxheWVyMUF2YXRhciA9IHRoaXMuY3JlYXRlU3ByaXRlRWxlbWVudChhdmF0YXIpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMUF2YXRhciwgYXZhdGFyUG9zaXRpb24pO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyMUhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aERhdGEpIHtcbiAgICB0aGlzLnBsYXllcjFIZWFsdGhUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChoZWFsdGhEYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFIZWFsdGhUZXh0LCBoZWFsdGhEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJIZWFsdGggPSBmdW5jdGlvbihoZWFsdGhEYXRhKSB7XG4gICAgdGhpcy5wbGF5ZXIySGVhbHRoVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoaGVhbHRoRGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXIySGVhbHRoVGV4dCwgaGVhbHRoRGF0YSk7XG59O1xuXG5QbGF5ZXJWaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5ZXIxVGV4dCA9IGZ1bmN0aW9uKHBsYXllckRhdGEpIHtcbiAgICB0aGlzLnBsYXllcjFUZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChwbGF5ZXJEYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnBsYXllcjFUZXh0LCBwbGF5ZXJEYXRhKTtcbn07XG5cblBsYXllclZpZXcucHJvdG90eXBlLmNyZWF0ZVBsYXllcjJUZXh0ID0gZnVuY3Rpb24ocGxheWVyRGF0YSkge1xuICAgIHRoaXMucGxheWVyMlRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KHBsYXllckRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheWVyMlRleHQsIHBsYXllckRhdGEpO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMUhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIxSGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8xX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjFIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIxSGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuc2V0UGxheWVyMkhlYWx0aCA9IGZ1bmN0aW9uKGhlYWx0aCkge1xuICAgIHZhciBwbGF5ZXIySGVhbHRoRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUExBWUVSLlBMQVlFUl8yX0hFQUxUSDtcbiAgICB0aGlzLnBsYXllcjJIZWFsdGhUZXh0LnRleHQgPSBwbGF5ZXIySGVhbHRoRGF0YS50ZXh0ICsgaGVhbHRoO1xufTtcblxuUGxheWVyVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJWaWV3OyIsIlF1ZXN0aW9uVmlldy5jb25zdHJ1Y3RvciA9IFF1ZXN0aW9uVmlldztcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFZpZXcucHJvdG90eXBlKTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5SSUdIVF9BTlNXRVIgPSAwO1xuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5XUk9OR19BTlNXRVJfMSA9IDE7XG5RdWVzdGlvblZpZXcucHJvdG90eXBlLldST05HX0FOU1dFUl8yID0gMjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuV1JPTkdfQU5TV0VSXzMgPSAzO1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLkFOU1dFUl9QUkVGSVggPSBcIkFOU1dFUl9cIjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSRURfUFJFRklYID0gXCJBTlNXRVJFRF9cIjtcblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuQU5TV0VSRURfU1VGRklYID0gXCJfQU5TV0VSRURcIjtcblxuZnVuY3Rpb24gUXVlc3Rpb25WaWV3KCkge1xuICAgIFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG59XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuZGlzcGxheUNhdGVnb3J5QW5kUXVlc3Rpb24gPSBmdW5jdGlvbihjYXRlZ29yeSwgcXVlc3Rpb24pIHtcbiAgICB2YXIgcXVlc3Rpb25EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTjtcbiAgICB0aGlzLmNyZWF0ZUNhdGVnb3J5RWxlbWVudChjYXRlZ29yeSwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTi5DQVRFR09SWSk7XG4gICAgdGhpcy5jcmVhdGVRdWVzdGlvbkVsZW1lbnQocXVlc3Rpb24udGV4dCwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTi5RVUVTVElPTl9QT1NJVElPTik7XG4gICAgdGhpcy5jcmVhdGVSaWdodEFuc3dlckVsZW1lbnQocXVlc3Rpb24ucmlnaHRfYW5zd2VyLCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OW3RoaXMuQU5TV0VSX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1swXV0pO1xuICAgIHRoaXMuY3JlYXRlV3JvbmdBbnN3ZXJFbGVtZW50MShxdWVzdGlvbi53cm9uZ19hbnN3ZXJfMSwgUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5RVUVTVElPTlt0aGlzLkFOU1dFUl9QUkVGSVggKyB0aGlzLmFuc3dlckluZGljZXNbMV1dKTtcbiAgICB0aGlzLmNyZWF0ZVdyb25nQW5zd2VyRWxlbWVudDIocXVlc3Rpb24ud3JvbmdfYW5zd2VyXzIsIFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT05bdGhpcy5BTlNXRVJfUFJFRklYICsgdGhpcy5hbnN3ZXJJbmRpY2VzWzJdXSk7XG4gICAgdGhpcy5jcmVhdGVXcm9uZ0Fuc3dlckVsZW1lbnQzKHF1ZXN0aW9uLndyb25nX2Fuc3dlcl8zLCBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OW3RoaXMuQU5TV0VSX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1szXV0pO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRBbnN3ZXJJbmRpY2VzID0gZnVuY3Rpb24oYW5zd2VySW5kaWNlcykge1xuICAgIHRoaXMuYW5zd2VySW5kaWNlcyA9IGFuc3dlckluZGljZXM7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZUNhdGVnb3J5RWxlbWVudCA9IGZ1bmN0aW9uKGNhdGVnb3J5LCBjYXRlZ29yeURhdGEpIHtcbiAgICBjYXRlZ29yeURhdGEudGV4dCA9IGNhdGVnb3J5O1xuICAgIHRoaXMuY2F0ZWdvcnlFbGVtZW50ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChjYXRlZ29yeURhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMuY2F0ZWdvcnlFbGVtZW50LCBjYXRlZ29yeURhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVRdWVzdGlvbkVsZW1lbnQgPSBmdW5jdGlvbihxdWVzdGlvbiwgcXVlc3Rpb25EYXRhKSB7XG4gICAgcXVlc3Rpb25EYXRhLnRleHQgPSBxdWVzdGlvbjtcbiAgICB0aGlzLnF1ZXN0aW9uRWxlbWVudCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQocXVlc3Rpb25EYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLnF1ZXN0aW9uRWxlbWVudCwgcXVlc3Rpb25EYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlUmlnaHRBbnN3ZXJFbGVtZW50ID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMucmlnaHRBbnN3ZXIgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucmlnaHRBbnN3ZXIsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5jcmVhdGVXcm9uZ0Fuc3dlckVsZW1lbnQxID0gZnVuY3Rpb24oYW5zd2VyLCBhbnN3ZXJEYXRhKSB7XG4gICAgYW5zd2VyRGF0YS50ZXh0ID0gYW5zd2VyO1xuICAgIHRoaXMud3JvbmdBbnN3ZXIxID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChhbnN3ZXJEYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih0aGlzLndyb25nQW5zd2VyMSwgYW5zd2VyRGF0YSk7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmNyZWF0ZVdyb25nQW5zd2VyRWxlbWVudDIgPSBmdW5jdGlvbihhbnN3ZXIsIGFuc3dlckRhdGEpIHtcbiAgICBhbnN3ZXJEYXRhLnRleHQgPSBhbnN3ZXI7XG4gICAgdGhpcy53cm9uZ0Fuc3dlcjIgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGFuc3dlckRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMud3JvbmdBbnN3ZXIyLCBhbnN3ZXJEYXRhKTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY3JlYXRlV3JvbmdBbnN3ZXJFbGVtZW50MyA9IGZ1bmN0aW9uKGFuc3dlciwgYW5zd2VyRGF0YSkge1xuICAgIGFuc3dlckRhdGEudGV4dCA9IGFuc3dlcjtcbiAgICB0aGlzLndyb25nQW5zd2VyMyA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQoYW5zd2VyRGF0YSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy53cm9uZ0Fuc3dlcjMsIGFuc3dlckRhdGEpO1xufTtcblxuUXVlc3Rpb25WaWV3LnByb3RvdHlwZS5zZXRBbnN3ZXJUb0NvbG91ciA9IGZ1bmN0aW9uKGFuc3dlckVsZW1lbnQsIGFuc3dlcikge1xuICAgIHZhciBxdWVzdGlvbkRhdGEgPSBQSVhJLkNvbnRhaW5lci5sYXlvdXREYXRhLlFVRVNUSU9OO1xuICAgIHZhciBjb2xvdXJzID0ge307XG4gICAgZm9yKHZhciBpID0gMjsgaSA8PSA0OyBpKyspIHtcbiAgICAgICAgY29sb3Vyc1t0aGlzLkFOU1dFUkVEX1BSRUZJWCArIGldID0gcXVlc3Rpb25EYXRhLldST05HX0FOU1dFUl9DT0xPVVI7XG4gICAgfVxuICAgIGNvbG91cnMuQU5TV0VSRURfMSA9IHF1ZXN0aW9uRGF0YS5SSUdIVF9BTlNXRVJfQ09MT1VSO1xuICAgIHZhciBhbnN3ZXJDb2xvdXIgPSBjb2xvdXJzW2Fuc3dlcl07XG4gICAgYW5zd2VyRWxlbWVudC5zZXRTdHlsZSh7Zm9udDogYW5zd2VyRWxlbWVudC5zdHlsZS5mb250LCBmaWxsOiBhbnN3ZXJDb2xvdXJ9KTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuc2V0V2hvQW5zd2VyZWRRdWVzdGlvbiA9IGZ1bmN0aW9uKGFuc3dlckVsZW1lbnQsIGFuc3dlciwgcGxheWVyKSB7XG4gICAgdmFyIHF1ZXN0aW9uRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuUVVFU1RJT047XG4gICAgdmFyIGFuc3dlck9uU2NyZWVuID0gKGFuc3dlci5zbGljZSgtMSkgLSAxKTtcbiAgICB0aGlzLnBsYXllcldob0Fuc3dlcmVkRWxlbWVudCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQocXVlc3Rpb25EYXRhW3BsYXllciArIHRoaXMuQU5TV0VSRURfU1VGRklYXSk7XG4gICAgdGhpcy5hZGRFbGVtZW50VG9Db250YWluZXIodGhpcy5wbGF5ZXJXaG9BbnN3ZXJlZEVsZW1lbnQsIHF1ZXN0aW9uRGF0YVt0aGlzLkFOU1dFUkVEX1BSRUZJWCArIHRoaXMuYW5zd2VySW5kaWNlc1thbnN3ZXJPblNjcmVlbl1dKTsgXG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLnR1cm5PZmZJbnRlcmFjdGl2aXR5Rm9yQW5zd2VyRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJpZ2h0QW5zd2VyLmludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy53cm9uZ0Fuc3dlcjEuaW50ZXJhY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLndyb25nQW5zd2VyMi5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMud3JvbmdBbnN3ZXIzLmludGVyYWN0aXZlID0gZmFsc2U7XG59O1xuXG5RdWVzdGlvblZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLnJpZ2h0QW5zd2VyLCB0aGlzLndyb25nQW5zd2VyMSwgdGhpcy53cm9uZ0Fuc3dlcjIsIHRoaXMud3JvbmdBbnN3ZXIzXTtcbn07XG5cblF1ZXN0aW9uVmlldy5wcm90b3R5cGUuY2xlYW5WaWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxFbGVtZW50cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvblZpZXc7IiwiV2luVmlldy5jb25zdHJ1Y3RvciA9IFdpblZpZXc7XG5XaW5WaWV3LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmlldy5wcm90b3R5cGUpO1xuXG5XaW5WaWV3LnByb3RvdHlwZS5QTEFZX0FHQUlOX0JVVFRPTiA9IDA7XG5cbmZ1bmN0aW9uIFdpblZpZXcoKSB7XG4gICAgUElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcbiAgICB0aGlzLnNldHVwVmlld0VsZW1lbnRzKCk7XG59XG5XaW5WaWV3LnByb3RvdHlwZS5jcmVhdGVXaW5uZXJUZXh0ID0gZnVuY3Rpb24ocGxheWVyV2hvV29uLCBzdGF0RGF0YSkge1xuICAgIHZhciB3aW5EYXRhID0gUElYSS5Db250YWluZXIubGF5b3V0RGF0YS5XSU47XG4gICAgdGhpcy5jcmVhdGVXaW5UZXh0KHdpbkRhdGFbcGxheWVyV2hvV29uICsgXCJfV0lOU1wiXSwgd2luRGF0YS5XSU5fVEVYVF9QT1NJVElPTik7XG4gICAgdGhpcy5jcmVhdGVQbGF5ZXJTdGF0c1RleHQod2luRGF0YSwgc3RhdERhdGEpO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuc2V0dXBWaWV3RWxlbWVudHMgPSBmdW5jdGlvbihwbGF5ZXJXaG9Xb24pIHtcbiAgICB2YXIgd2luRGF0YSA9IFBJWEkuQ29udGFpbmVyLmxheW91dERhdGEuV0lOO1xuICAgIHRoaXMuY3JlYXRlUGxheUFnYWluQnV0dG9uKHdpbkRhdGEuUExBWV9BR0FJTik7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5jcmVhdGVXaW5UZXh0ID0gZnVuY3Rpb24gKGRhdGEsIHBvc2l0aW9uRGF0YSkge1xuICAgIHZhciB3aW5UZXh0ID0gdGhpcy5jcmVhdGVUZXh0RWxlbWVudChkYXRhKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcih3aW5UZXh0LCBwb3NpdGlvbkRhdGEpO1xufTtcblxuV2luVmlldy5wcm90b3R5cGUuY3JlYXRlUGxheWVyU3RhdHNUZXh0ID0gZnVuY3Rpb24obGF5b3V0RGF0YSwgc3RhdERhdGEpIHtcbiAgICBsYXlvdXREYXRhLlBMQVlFUl8xX0NPUlJFQ1RfUEVSQ0VOVEFHRS50ZXh0ID0gbGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCArIHN0YXREYXRhLnBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZTtcbiAgICB2YXIgcGxheWVyMUNvcnJlY3RBbnN3ZXJQZXJjZW50YWdlVGV4dCA9IHRoaXMuY3JlYXRlVGV4dEVsZW1lbnQobGF5b3V0RGF0YS5QTEFZRVJfMV9DT1JSRUNUX1BFUkNFTlRBR0UpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHBsYXllcjFDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQsIGxheW91dERhdGEuUExBWUVSXzFfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICBcbiAgICAgICAgbGF5b3V0RGF0YS5QTEFZRVJfMl9DT1JSRUNUX1BFUkNFTlRBR0UudGV4dCA9IGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFLnRleHQgKyBzdGF0RGF0YS5wbGF5ZXIyQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2U7XG4gICAgdmFyIHBsYXllcjJDb3JyZWN0QW5zd2VyUGVyY2VudGFnZVRleHQgPSB0aGlzLmNyZWF0ZVRleHRFbGVtZW50KGxheW91dERhdGEuUExBWUVSXzJfQ09SUkVDVF9QRVJDRU5UQUdFKTtcbiAgICB0aGlzLmFkZEVsZW1lbnRUb0NvbnRhaW5lcihwbGF5ZXIyQ29ycmVjdEFuc3dlclBlcmNlbnRhZ2VUZXh0LCBsYXlvdXREYXRhLlBMQVlFUl8yX0NPUlJFQ1RfUEVSQ0VOVEFHRSk7XG59O1xuXG5XaW5WaWV3LnByb3RvdHlwZS5jcmVhdGVQbGF5QWdhaW5CdXR0b24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMucGxheUFnYWluQnV0dG9uID0gdGhpcy5jcmVhdGVTcHJpdGVFbGVtZW50KGRhdGEpO1xuICAgIHRoaXMuYWRkRWxlbWVudFRvQ29udGFpbmVyKHRoaXMucGxheUFnYWluQnV0dG9uLCBkYXRhKTtcbn07XG5cbldpblZpZXcucHJvdG90eXBlLmdldEludGVyYWN0aXZlVmlld0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLnBsYXlBZ2FpbkJ1dHRvbl07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpblZpZXc7Il19
