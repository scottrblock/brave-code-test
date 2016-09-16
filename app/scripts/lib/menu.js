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