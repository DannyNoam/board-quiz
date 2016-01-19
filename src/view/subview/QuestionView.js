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