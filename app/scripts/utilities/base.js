/*
  Utility functions to make class manipulation easier and support
  cross browser event propegation
*/
var Utility = function() {
  return {
    addClass: function($element, className) {
      var currentClasses = $element.className,
          newClasses = currentClasses.concat(' ' + className);
      
      $element.className = newClasses;
    },

    removeClass: function($element, className) {
      var currentClasses = $element.className,

          /*
            Use js' (fast) array functions to remove all instances of
            the className
          */
          newClasses = currentClasses.split(className).join('');
      
      $element.className = newClasses; 
    },

    toggleClass: function($element, className, shouldAdd){
      if( shouldAdd ) {
        this.addClass($element, className);
      } else {
        this.removeClass($element, className);
      }
    },

    stopEvent: function(e){
      if( !e ){
        e = window.event;
      }

      if( e.preventDefault ){
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
  }
}();