var ViewLoader = function() {
    var viewPrototype = new View();
    
    this.load = function(view) {
        if(view.prototype.isPrototypeOf(viewPrototype)) {
            view.render();
        } else {
            console.error("Given view is not a subtype of View!");
        }
    }
}