QuestionController.constructor = QuestionController;
QuestionController.prototype = Object.create(GameController.prototype);
QuestionController.prototype.view = new QuestionView();

QuestionController.prototype.SOCKET_ON_RANDOM_CATEGORY = 'random-category';
QuestionController.prototype.SOCKET_ON_RANDOM_QUESTION = 'random-question';
QuestionController.prototype.SOCKET_ON_DAMAGE_DEALT = 'damage-dealt';
QuestionController.prototype.SOCKET_NEW_TURN = 'new-turn';
QuestionController.prototype.SOCKET_GET_RANDOM_CATEGORY = 'get-random-category';
QuestionController.prototype.SOCKET_GET_RANDOM_QUESTION = 'get-random-question';
QuestionController.prototype.SOCKET_DEAL_DAMAGE = 'deal-damage';
QuestionController.prototype.SOCKET_SHUFFLE_ANSWER_INDICES = 'shuffle-answer-indices';
QuestionController.prototype.SOCKET_ON_SHUFFLED_ANSWER_INDICES = 'shuffled-answer-indices';

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
    this.socket.on(this.SOCKET_ON_RANDOM_QUESTION, function(data) {
        this.question = data.question;
        this.category = data.category;
        //this.loadView();
    }.bind(this));
    
    this.socket.on(this.SOCKET_ON_DAMAGE_DEALT, function(playerData) {
        this.view.setAnswerToColour(this.answers[playerData.answer], playerData.answer);
        this.view.setWhoAnsweredQuestion(this.answers[playerData.answer], playerData.answer, playerData.player_who_answered);
        this.view.turnOffInteractivityForAnswerElements();
        this.playerController.updatePlayersHealth();
        if(this.isPlayer1()) {
            this.socket.emit(this.SOCKET_NEW_TURN);
        }
    }.bind(this));
};

QuestionController.prototype.loadView = function() {
    this.getRandomQuestion();
    this.shuffleAnswerIndices(function() {
        this.view.displayCategoryAndQuestion(this.category, this.question);
        this.setupListeners();
        this.viewLoader.loadView(this.view);
    }.bind(this));
};

QuestionController.prototype.getRandomQuestion = function() {
    if(this.isPlayer1()) {
        var categories = this.categoryData.CATEGORIES;
        var questions = this.questionData.CATEGORIES;
        this.socket.emit(this.SOCKET_GET_RANDOM_QUESTION, {categories: categories, questions: questions});
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
        this.socket.emit(this.SOCKET_SHUFFLE_ANSWER_INDICES, {indices: [1,2,3,4]});
    }
    
    this.socket.on(this.SOCKET_ON_SHUFFLED_ANSWER_INDICES, function(data) {
        this.view.setAnswerIndices(data);
        callback();
    }.bind(this));
};

QuestionController.prototype.setAnswerUpdateListener = function(answers) {
    this.answers = answers;
};

QuestionController.prototype.emitDealDamageToOpponentToSocket = function(answer) {
    this.socket.emit(this.SOCKET_DEAL_DAMAGE, {player_who_answered: this.getPlayer(), player_to_damage: this.getOpponent(), damage: this.diceNumber, answer:        answer});
};

QuestionController.prototype.emitDealDamageToSelfToSocket = function(answer) {
    this.socket.emit(this.SOCKET_DEAL_DAMAGE, {player_who_answered: this.getPlayer(), player_to_damage: this.getPlayer(), damage: this.diceNumber, answer:       answer});
};

QuestionController.prototype.cleanView = function() {
    this.viewLoader.removeView(this.view);
    this.view.cleanView();
};

module.exports = QuestionController;