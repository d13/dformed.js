/**
 * dformed.js
 * @author  Keith Daulton
 * @version 0.2
 */
(function(undefined) {
    // base functions
    var log = (function() {
        
        if (console !== undefined) {
            return function(text) {
                return console.log(text);
            };
        }
        
        return function() { 
            return;
        };
        
    })(),
    trim = (function() {
        
        if (String.prototype.trim) {
            return function(text) {
                return text.trim();
            };
        }
        
        return function(text) {
            return text.replace(/^\s+/, "").replace(/\s+$/, "");
        };
        
    })(),
    _eval = window.eval,
    eval = function(strCode) {
        return (new Function("return" + strCode))();
    },
    runCallback = function(fncall) {
        if (typeof fncall === "string") {
            return eval(fncall);
        }
        return fncall();
    };
    
});
