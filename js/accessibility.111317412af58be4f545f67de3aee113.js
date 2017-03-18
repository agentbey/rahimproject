/*
 * /sm/base/js/accessibility/keycode.js
 */
(function(window) {
  "use strict";

  var Keyboard = {

    getCode: function(key){
      var code, codeMap = {
        "tab": 9, "enter": 13, "esc": 27, "space": 32, "pageUp": 33, "pageDown": 34, "end": 35, "home": 36, "left": 37, "up": 38, "right": 39, "down": 40
      };
      code = ( key.length===1 && /([A-Za-z0-9])/.test(key) )? 
        key.charCodeAt(0) : codeMap[ key ];
      return code;
    },

    getChar: function(code){
      return String.fromCharCode(code);
    }
  };

  ////
  Keyboard.enter = Keyboard.getCode("enter");

  Keyboard.esc = Keyboard.getCode("esc");

  Keyboard.space = Keyboard.getCode("space");
  
  Keyboard.tab = Keyboard.getCode("tab");

  ////
  // Directional Keys    
  Keyboard.up = Keyboard.getCode("up");
  
  Keyboard.right = Keyboard.getCode("right");
  
  Keyboard.down = Keyboard.getCode("down");

  Keyboard.left = Keyboard.getCode("left");

  ////
  // Page Control keys
  Keyboard.pageUp = Keyboard.getCode("pageUp");
  
  Keyboard.pageDown = Keyboard.getCode("pageDown");

  Keyboard.end = Keyboard.getCode("end");

  Keyboard.home = Keyboard.getCode("home"); 



  window.SM = SM || {};
  window.SM.accessibility = SM.accessibility || {};
  window.SM.accessibility.Keyboard = Keyboard;

  if( typeof window.define === 'function' && window.define.amd ){
    window.define(function () { return Keyboard; });
  }

}(window));
/*
 * /sm/base/js/accessibility/keyboardfocus.js
 */
(function($, Keyboard, window) {
  "use strict";

  var KeyboardFocus, keycodeToFctnMap = {};

  // Hash to store local methods
  keycodeToFctnMap[Keyboard.left] = "getPrevItem";
  keycodeToFctnMap[Keyboard.up]   = "getPrevItem";
  keycodeToFctnMap[Keyboard.right]= "getNextItem";
  keycodeToFctnMap[Keyboard.down] = "getNextItem";
  keycodeToFctnMap[Keyboard.home] = "getFirstItem";
  keycodeToFctnMap[Keyboard.end]  = "getLastItem";
  keycodeToFctnMap[Keyboard.esc]  = "getDocument";


  KeyboardFocus = {

    // CSS Selector fragments to identify component parts
    // NOTE: these defaults are for a navigation/menu.  You'll need to customize for your situation.
    ariaSelector: {
      // Outer wrapper element for this compoent/widget
      parent: "[role=navigation]",

      // Wrapper for navItem-collections
      navbar: "[role=menubar]",
      
      // A collection of navItems 
      nav:    "[role=menu]",
      
      // An element that gets a 'focus' state
      navitem:"[role=menuitem]",
      
      // Content associated with the navItem
      content:"[role=presentation]"
    },

    setAriaSelector: function(selector){
      this.ariaSelector = selector;
    },

    shiftFocusByKeycode: function(keyCode, sourceNode){
      var success = false, fnGetItem, destinationNode;
      sourceNode = sourceNode || window.document.activeElement;
        
      fnGetItem = keycodeToFctnMap[ keyCode ];

      if( $.isFunction(this[fnGetItem]) ){
        destinationNode = this[ fnGetItem ]( sourceNode );
        //console.log(fnGetItem, destinationNode);
        destinationNode.focus();
        success = true;
      }

      return success;
    },

    // Locate Items within the current tree
    getFirstItem: function(item){
      var $first = $(item).parents( this.ariaSelector.parent ).find( this.ariaSelector.navitem ).first();
      return $first[0];
    },
    getPrevItem: function(item){
      var $previous = this.findPrev(item, this.ariaSelector.navitem);
      if($previous.length === 0) {
          $previous = $(this.getLastItem(item));
      }
      return $previous[0];
    },
    getNextItem: function(item){
      var $next = this.findNext(item, this.ariaSelector.navitem);
      if($next.length === 0) {
          $next = $(this.getFirstItem(item));
      }
      return $next[0];
    },
    getLastItem: function(item){
      var $last = $(item).parents( this.ariaSelector.parent ).find( this.ariaSelector.navitem ).last();
      return $last[0];
    },

    getDocument: function(){
      return window.document.body;
    },


    // Util methods
    findPrev: function(element, selector){
      return this.findInCollection(element, selector, function(x){
        return (x - 1);
      });
    },

    findNext: function(element, selector){
      return this.findInCollection(element, selector, function(x){
        return (x + 1);
      });
    },

    findInCollection: function(element, selector, fnModIterator){
      var x, l, haystack, needle = [];
      haystack = $(element).parents( this.ariaSelector.parent ).find(selector).toArray();
      for(x=0,l=haystack.length; x<l; x++){
        if(haystack[x] === element && haystack[ fnModIterator(x) ] !== undefined){
          needle = haystack[ fnModIterator(x) ];
        }
      }
      return $(needle);
    }
  };

  window.SM = window.SM || {};
  window.SM.accessibility = window.SM.accessibility || {};
  window.SM.accessibility.KeyboardFocus = KeyboardFocus;

  if( typeof window.define === 'function' && window.define.amd ){
      window.define(function () { return KeyboardFocus; });
  }
}(
  jQuery,
  window.SM.accessibility.Keyboard, 
  window
));
/*
 * /sm/base/js/accessibility/ariastate.js
 */
(function($, document, window) {
  "use strict";

  var AriaState = {

    is: function(element, stateName){
      var attrValue = $(element).attr("aria-"+ stateName);
      return (attrValue !== undefined && attrValue === "true");
    },

    addAttr: function(element, stateName, value){
      $(element).attr("aria-"+stateName, value);
    },

    expand: function(element){
      this.addAttr(element, "expanded", true);
    },
    collapse: function(element){
      this.addAttr(element, "expanded", false);
    },

    hide: function(element){
      this.addAttr(element, "hidden", true);
    },
    show: function(element){
      this.addAttr(element, "hidden", false);
    },

    select: function(element){
      this.addAttr(element, "selected", true);
    },
    deselect: function(element){
      this.addAttr(element, "selected", false);
    },


    expandWidget: function(element){
      var fnExpandMethod = this.getExpandMethod(element);
      this[fnExpandMethod].apply(this, arguments);
    },
    collapseWidget: function(element){
      var fnCollapseMethod = this.getCollapseMethod(element);
      this[fnCollapseMethod].apply(this, arguments);
    },

    getExpandMethod: function(element){
      return "expandTabpanel";
    },
    getCollapseMethod: function(element){
      return "collapseTabpanel";
    },


    // Tab Panel Methods
    expandTabpanel: function(element){
      var tab, tabpanel;
      tab = this.findTab(element);
      tabpanel = this.findTabpanel(element);
      this.expand(tab);
      this.show(tabpanel);
    },

    collapseTabpanel: function(element){
      var tab, tabpanel;
      tab = this.findTab(element);
      tabpanel = this.findTabpanel(element);
      this.collapse(tab);
      this.hide(tabpanel);
    },

    findTab: function(element){
      var tab = element, labeledby;
      if( $(tab).attr("aria-controls") === undefined ){
        labeledby = $(element).attr("aria-labeledby");
        tab = document.getElementById(labeledby);
      }
      return tab;
    },

    findTabpanel: function(element){
      var tabpanel = element, controls;
      if( $(tabpanel).attr("aria-labeledby") === undefined ){
        controls = $(element).attr("aria-controls");
        tabpanel = document.getElementById(controls);
      }
      return tabpanel;
    }

  };

  window.SM = window.SM || {};
  window.SM.accessibility = window.SM.accessibility || {};
  window.SM.accessibility.AriaState = AriaState;

  if( typeof window.define === 'function' && window.define.amd ){
      window.define(function () { return AriaState; });
  }
}(
  jQuery,
  window.document,
  window
));
