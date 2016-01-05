ViewLoader = require('./loader/ViewLoader');
Controller = require('./controller/Controller');
HelpView = require('./view/HelpView');
HelpController = require('./controller/HelpController');
MenuView = require('./view/MenuView');
MenuController = require('./controller/MenuController');
Display = require('./util/Display');
BucketLoader = require('./loader/BucketLoader');
JsonLoader = require('./loader/JsonLoader');

window.onload = function() {
    var menuController = new MenuController();
};