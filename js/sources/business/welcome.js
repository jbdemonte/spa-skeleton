/**
 * Class Welcome
 * @returns {jQuery}
 * @constructor
 */
function Welcome() {
    return $(tpl.home.welcome()) // call the template
        .append(
            this.createButton() // and append a button
        );
}

/**
 * Example of a creation of enclosed features
 * @returns {jQuery}
 */
Welcome.prototype.createButton = function () {
    return $(tpl.home.btn({txt: "Next..."})) // call the template with parameters
        .click(function () { // append a click function
            $.publish("hello"); // emit an event
        });
};