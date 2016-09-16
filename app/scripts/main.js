
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

var Menu = function() {
  return {
    domElement: function() {
      return document.getElementById('full-menu');
    },
    
    showMenuLink: function() {
      return document.getElementById('show-menu-link');
    },

    hideMenuLink: function() {
      return document.getElementById('hide-menu-link')
    },

    show: function(event) {
      Utility.stopEvent(event);

      /*
        "this" is now the event, not the Menu so have to explicitly use
        "Menu"
      */
      Utility.addClass(Menu.domElement(), 'full-menu--is-visible')
      
      return false;
    },

    hide: function(event) {
      Utility.stopEvent(event);
      Utility.removeClass(Menu.domElement(), 'full-menu--is-visible');

      return false;
    },

    listenForMenuClicks: function() {
      
      /*
        When links to show or hide the menu are clicked, show or hide menu.
        If this was purely mobile and not being tested in desktop browsers, 
        touchend would be preferable to click.
      */
      this.showMenuLink().addEventListener('click', this.show);
      this.hideMenuLink().addEventListener('click', this.hide);
    },
  }
}();

var Form = function() {
  return {
    domElement: function() {
      return document.getElementById('signup-form');
    },

    alertElement: function() {
      return document.getElementById('invalid-signup-alert');
    },

    usernameElement: function() {
      return document.getElementById('username');
    },

    passwordElement: function() {
      return document.getElementById('password');
    },

    togglePasswordLink: function() {
      return document.getElementById('toggle-password-link');
    },

    /*
      Username cannot be blank
    */
    validUsername: function() {
      var isValid = this.usernameElement().value.length > 0;
      
      Utility.toggleClass(this.usernameElement(), 
                        'signup-form__input--has-error', 
                        !isValid);  //add error if input is invalid
      
      return isValid; 
    },

    /*
      Password must be 6 characters
    */
    validPasswordLength: function() {
      return this.passwordElement().value.length >= 6;
    },

    /*
      Password must contain 1 special character and one uppercase letter
    */
    validPasswordFormat: function() {
      var passwordString = this.passwordElement().value;
      
      /*
        Search for an uppercase character, then search for a character
        that is not a 'word' character (alphanumeric plus underscores)
        or a space, then make sure the password is at least 2 characters.
        The password only needs to be 2 characters to satisfy this
        requirement. The length requirement is handled independently for
        more flexibility.
      */
      var passwordTest = /^(?=.*?[A-Z])(?=.*?[^\w\s]).{2,}$/;

      return passwordTest.test(passwordString);
    },

    validPassword: function() {
      var isValid = this.validPasswordLength() && this.validPasswordFormat();

      Utility.toggleClass(this.passwordElement(), 
                    'signup-form__input--has-error', 
                    !isValid);  //add error if either password validation fails

      return isValid;
    },

    usernameErrorText: function() {
      return 'Username cannot be blank.';
    },

    passwordLengthErrorText: function() {
      return 'Password must be 6 or more characters.';
    },

    passwordFormatErrorText: function() {
      return 'Password must contain one capital letter and one \
        non-alphanumeric character.'
    },

    /*
      Construct an HTML error message based on previously defined
      validation rules and error messages
    */
    constructErrorMessage: function() {
      var errorMessages = [];

      if( !this.validUsername() ) {
        errorMessages.push( this.usernameErrorText() );
      }

      if( !this.validPasswordLength() ) {
        errorMessages.push ( this.passwordLengthErrorText() );
      }

      if ( !this.validPasswordFormat() ) {
        errorMessages.push( this.passwordFormatErrorText() );
      }

      return errorMessages.join('<br>');
    },

    updateErrorMessageText: function(message) {
      this.alertElement().innerHTML = message;
    },

    validate: function(event) {
      Utility.stopEvent(event);

      /*
        Start by validating both fields so appropriate error classes are
        shown if either fails
      */
      var validUsername = Form.validUsername(),
          validPassword = Form.validPassword(),
          errorMessages = Form.constructErrorMessage();


      Form.updateErrorMessageText( errorMessages );

      /*
        If both inputs are valid, remove error alert
      */
      if( validUsername && validPassword ){
        Utility.removeClass(Form.alertElement(), 'alert--is-visible');
      } else {
        Utility.addClass(Form.alertElement(), 'alert--is-visible')
      }

      return false;
    },

    togglePassword: function(event){
      Utility.stopEvent(event);

      var currentType = Form.passwordElement().type;

      if( currentType === 'password' ) {
        Form.passwordElement().type = 'text'
      } else {
        Form.passwordElement().type = 'password';
      }

      return false;
    },

    listenForFormSubmit: function() {

      /*
        When the form is submitted, go through validation function
      */
      this.domElement().addEventListener('submit', this.validate);
    },

    listenForTogglePassword: function(){

      /*
        When the toggle password link is clicked, toggle the input
        type of the password. If this was purely mobile and not being
        tested in desktop browsers, touchend would be preferable to click.
      */
      this.togglePasswordLink().addEventListener('click', this.togglePassword);
    }
  }
}();

window.omload = function(){
  Menu.listenForMenuClicks();
  Form.listenForFormSubmit();
  Form.listenForTogglePassword();
}();

