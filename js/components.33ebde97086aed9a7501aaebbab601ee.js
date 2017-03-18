jQuery( function($) {

	function setPlaylistHeight() {

		$('.playlist-fluid').each(function(){

			var playlistContainer = $(this),
				player = playlistContainer.find('object'),
				newHeight = Math.floor(player.width() * .45);

			player.height(newHeight);

		});

	}

	$(window).on('load resize', setPlaylistHeight);
	setPlaylistHeight();

});

// Add a delayed resize trigger because Firefox with Firebug delays loading the
// list player object for 2000ms to prevent Firefox from locking up. This delay
// causes the height calculation and adjustment to fail on page load.
$(document).ready(function(){
    setTimeout(function(){
        $(window).trigger("resize");
    }, 2500);
});

/*
This file is part of the Kaltura Collaborative Media Suite which allows users
to do with audio, video, and animation what Wiki platfroms allow them to do with
text.

Copyrighted Kaltura Inc.
Licensed under AGPL.

The Kaltura Thumb Rotator object lets you show a thumbnail slideshow preview for a video hosted on the Kaltura platform

In order to use the KalturaThumbRotator object, include its javascript code and attach two events to each img element you want to preview.

Sample:

<img src="http://cdn.kaltura.com/p/1/sp/1/thumbnail/entry_id/y2ahhtvvsk/width/160/height/120" width="160" height="120" 
	onmouseover="KalturaThumbRotator.start(this)" 
	onmouseout="KalturaThumbRotator.end(this)">

KalturaThumbRotator.start(this) cancels the current running preview and starts a new one
KalturaThumbRotator.end(this) cancels the current running preview and restores the original thumbnail

*/

KalturaThumbRotator = {

	slices : 40, // number of thumbs per video
	frameRate : 400, // frameRate in milliseconds for changing the thumbs
	
	timer : null,
	slice : 0,
	img  : new Image(),
	
	thumbBase : function (o) // extract the base thumb path by removing the slicing parameters
	{
		var path = o.src;
		var pos = path.indexOf("/vid_slice");
		if (pos != -1)
			path = path.substring(0, pos);
			
		return path;
	},
	

	change : function (o, i) // set the Nth thumb, request the next one and set a timer for showing it
	{
		slice = (i + 1) % this.slices;

		var path = this.thumbBase(o);
		
		o.src = path + "/vid_slice/" + i + "/vid_slices/" + this.slices;
		this.img.src = path + "/vid_slice/" + slice + "/vid_slices/" + this.slices;

		i = i % this.slices;
		i++;
		
		this.timer = setTimeout(function () { KalturaThumbRotator.change(o, i) }, this.frameRate);
	},
	
	start : function (o) // reset the timer and show the first thumb
	{
		clearTimeout(this.timer);
		var path = this.thumbBase(o);
		this.change(o, 1);
	},

	end : function (o) // reset the timer and restore the base thumb
	{
		clearTimeout(this.timer);
		o.src = this.thumbBase(o);
	}
};
jQuery( function($) {
    var thumbnails = $(".thumbnail-standard-size.has-video");
    thumbnails.each(function() {
        var currentThumb = $(this).get(0);
        $("span.overlay-icon").hover(function() {
                KalturaThumbRotator.start(currentThumb);
            },
            function() {
                KalturaThumbRotator.end(currentThumb);
            });
    });
});
/*jslint newcap: true, nomen: true, white: true, browser: true, devel: true*/

/*
 * /sm/components/commons/video-list-builder/clientlibs/js/mobile-thumb-resize.js
 */
(function($, window, document, undefined) {
    "use strict";

    var EVENT_WINDOW_RESIZE_END = "event-window-resize-end";
    
    /* Changes bootstrap column class of the columns containing our thumbnail previews,
     * depending on browser width */
    function updateColClass() {
        if($(window).width() < 768) {
            $(".thumbnail-container").each(function() {
                $(this).toggleClass("col-sm-3", false);
                $(this).toggleClass("col-xs-6", true);
            });
        }
        else {
            $(".thumbnail-container").each(function() {
                $(this).toggleClass("col-xs-6", false);
                $(this).toggleClass("col-sm-3", true);
            });
        }
    }

    $(document).ready(function() {
        //update once on ready
        updateColClass();

        // then on each resize
        $(document).bind(EVENT_WINDOW_RESIZE_END, function(){
            updateColClass();
        });
    });

}(jQuery, window, document));

/*jslint newcap: true, nomen: true, plusplus: true, white: true, browser: true, devel: true */

/*
 * /sm/components/commons/video/clientlibs/js/video-resize.js
 */
(function($, window, document, undefined) {
    "use strict";

    var EVENT_WINDOW_RESIZE_END = "event-window-resize-end";

    function setVideoHeight() {
        $('.video-fluid:visible').each(function() {

            var videoContainer = $(this);
            resizePlayer(videoContainer);
        });


    }
    function setHiddenVideoHeights() {
        $('.video-fluid:hidden').each(function() {
            var videoContainer = $(this);
            videoContainer.parents(".panel-collapse").each(function() {
                $(this).on("shown.bs.collapse", function() {
                    var container = $(this);
                    resizePlayer(container);
                });
            });

        });
    }

    function resizePlayer(container) {
        var player = container.find('.kp-player'),
                newHeight = Math.ceil(player.width() * 0.562130) + 1;
        player.height(newHeight);
    }

    $(document).ready(function() {
        setVideoHeight();
        setHiddenVideoHeights();

        $(document).bind(EVENT_WINDOW_RESIZE_END, function(){
            setVideoHeight();
        });
    });

}(jQuery, window, document));

/*jslint newcap: true, nomen: true, plusplus: true, white: true, browser: true, devel: true */

/*
 * /sm/components/commons/video/clientlibs/js/embed.js
 */
(function($, window, document, undefined) {
    "use strict";
    $(document).ready(function() {
        $('.sm-kp-embed').each(function(idx,elem){
            var $vid = $(elem);
            var flashVars = {
                "streamerType": "auto"
            };
            kWidget.embed({
                "targetId": $vid.attr('id'),
                "wid": "_1392761",
                "uiconf_id": $vid.attr('data-player-skin'),
                "flashvars": flashVars,
                "cache_st": "main_video",
                "entry_id": $vid.attr('data-entry-id')
            });
        });

    });

}(jQuery, window, document));

// Custom JavaScript for Twitter Timeline Component
/*jslint newcap: true, nomen: true, plusplus: true, white: true, browser: true, devel: true, regexp: true */

window.SM = window.SM || {};
/*
 * /sm/components/commons/timeline/clientlibs/js/timeline.js
 */
(function($, Utils, document){
    "use strict";

    /*
     * Constants
     */
    var Timeline,
        CSS_ODD = "media-odd",
        CSS_SELECTED = "selected",
        CSS_YEAR = "year",
        CSS_YEARLARGE = "year-large";

    
    Timeline = {

        cssClass: "timeline",

        event: {
            show: "event-timeline-show",
            shown: "event-timeline-shown"
        },

        init: function() {
            Utils = Utils || window.SM.Utils;
            Utils.log("Timeline.init()");

            this.renderUI();
            this.bindUI();
            this.syncUI();
        },

        // Disconnect all event listeners and remove markup from DOM
        destroy: function(){
            $("."+this.cssClass+" .media").removeClass(CSS_ODD);
            $("."+this.cssClass+" li").hasClass(CSS_YEARLARGE).remove();

            $("."+this.cssClass).off("click", ".media-object, .media-heading");
        },

            
        //Renders the elements to the DOM
        renderUI: function() {
            var id = Utils.createUniqueId( this.cssClass+'-' ),
                TimelineSelector = "."+this.cssClass;
            //Utils.log("Timeline.renderUI()");

            $(TimelineSelector+" .media").each(function(x, element){
                $(element).attr("aria-expanded", "false");

                //Identify the odd-numnbered .media rows
                if(x % 2){
                    $(this).addClass( CSS_ODD );
                }
            });

            //Insert the decade year markers into the timeline
            if( $(TimelineSelector).hasClass("decadeMarkers") ){
                this.addDecadeMarkers();
            }

            // Add ARIA roles
            $(TimelineSelector).attr("aria-multiselectable", "false");
            $(TimelineSelector+" .media-list").attr("role", "tablist");
            $(TimelineSelector+" .media-object").attr("role", "tab").attr("aria-selected","false").attr("aria-expanded","false");
            $(TimelineSelector+" .media-content").attr("role", "tabpanel").attr("aria-hidden", "true");

            // Link tabs to panels
            $(TimelineSelector+" .rsNav").each(function(i,element){
                $(element).attr("id",id+"-tab"+(i+1)).attr("aria-controls",id+"-panel"+(i+1));
            });
            $(TimelineSelector+" .rsContent").each(function(i,element){
                id = Timeline.createId("");
                $(element).attr("id",id+"-panel"+(i+1)).attr("aria-labeledby",id+"-tab"+(i+1));
            });
        },

        bindUI: function(){
            //Utils.log("Timeline.bindUI()");
            var Instance = this;

            // Delegate events across all timelines
            $("."+this.cssClass).on({
                "click": $.proxy(this.fnHandleClick, this),
                "keyup": $.proxy(this.fnHandleNavKeyUp, this)
            }, ".media");

        },

        syncUI: function(){},



        fnHandleClick: function(e){
            e.preventDefault();
            var scrollDuration = 300,
                pxOffset = 30,
                elementTop, contentTop, top, $media, $content;

            if( $(e.target).attr('href') === undefined ){
                $media = $(e.currentTarget);
                $content = $media.find(".media-content");

                $("."+this.cssClass+" .media").removeClass(CSS_SELECTED);
                $media.addClass(CSS_SELECTED);
                $(".media-object",$media).attr("aria-expanded", "true");
                $(".media-content",$media).attr("aria-hidden", "false");

                $(document).trigger( this.event.show );

                // Scroll the page to the clicked timeline item 
                if( $content.length > 0 ){
                    
                    elementTop = $media.offset().top;
                    contentTop = $content.offset().top;
                    top = (elementTop < contentTop)?  elementTop : contentTop;
                    top = (top-pxOffset > 0)?  (top-pxOffset) : top;

                    setTimeout(function(){
                        if( !Utils.isElementInViewport($content) ){
                            $("html, body").animate({scrollTop: top}, scrollDuration);
                        }
                        $(document).trigger( Timeline.event.shown );
                    }, 200);
                }   
            }
        },

        fnHandleNavKeyUp: function(event){
            var element = event.currentTarget,
            keyCode = event.keyCode,
            key = {enter:13, space:32, esc:27, tab:9, left:37, up:38, right:39, down:40};

            if (keyCode === key.enter || keyCode === key.space) {
                this.fnHandleClick(event);
            }
            // Top level key events
            else if (keyCode === key.left || keyCode === key.up) {
                this.goToPrev(event.currentTarget);
            } else if (keyCode === key.right || keyCode === key.down) {
                this.goToNext(event.currentTarget);
            }

            return false;
        },

        goToPrev: function(currentItem){
            var $previous;
            if($(currentItem).prev('li').length === 0) {
                $previous = $(currentItem).parents('ul').find('> li').last();
            } else {
                $previous = $(currentItem).prev('li');
            }
            $previous.focus();
            
            return $previous[0];
        },

        goToNext: function(currentItem){
            var $next;
            if($(currentItem).next('li').length === 0) {
                $next = $(currentItem).parents('ul').find('> li').first();
            } else {
                $next = $(currentItem).next('li');
            }
            $next.focus();
            
            return $next[0];
        },

        //Insert the decade year markers into the timeline
        addDecadeMarkers: function(){
            var year, x,l, el, sort,
                eventsArray = [],
                curDecade = 0;

            if( $("."+this.cssClass+" ."+ CSS_YEAR ).length <= 1 ){

                $("."+this.cssClass+" .media-object time").each(function(){
                    year = parseInt($(this).attr('datetime').match(/(\d{4})/g)[0], 10);
                    eventsArray.push({
                        "element" : $(this).parents("li.media"),
                        "decade" : Math.floor(year / 10) * 10,
                        "year" : year
                    });
                });

                eventsArray.sort(function(a,b){
                    if(a.year === b.year){ sort = 0; }
                    if(a.year < b.year){ sort = -1; }
                    if(a.year > b.year){ sort = 1; }
                    return sort;
                });

                for(x=0,l=eventsArray.length;x<l;x++){
                    if(curDecade !== eventsArray[x].decade){
                        curDecade = eventsArray[x].decade;
                        el = $("<li>").text(curDecade).addClass( CSS_YEAR );
                        if(x===0){
                            $( el ).addClass( CSS_YEARLARGE );
                        }
                        eventsArray[x].element.after( el );
                    }
                }
            }        
        }
    };

    // Add to SM
    window.SM = window.SM || {};
    window.SM.components = window.SM.components || {};
    $.extend(window.SM.components, {"Timeline": Timeline});

}(jQuery, window.SM.Utils, document));
/*
* /sm/components/commons/text/clientlibs/js/script.js
*/
(function($, document){
  "use strict";

  var TextComponent = {

    init: function(){
      this.renderUi();
      this.bindUi();
    },

    renderUi: function(){
      /*
       * Ticket WT-616: 
       *   CSS nth-child(even) does not produce the desired effect
       *   Workaround: explicitly label odd and even rows with CSS classes
       */
      $('.text > div > ul > li > ul').each(function(){
        $(this).find("li:odd").addClass("even");
        $(this).find("li:even").addClass("odd");
      });

      // Fix Link Arrow break
      this.fixLinkArrow();
    },

    bindUi: function(){},

    /*
     * Wraps the last word in the link text with a span allowing styles to
     * add the arrow and keep the last word and arrow together on wrap.
     */
    fixLinkArrow: function() {
      $(".p-link-w-arrow a, a.link-w-arrow, .p-e-link-w-arrow a, a.e-link-w-arrow").each(function() {
        var heading, word_array, last_word, first_part;

        // If the link text already has the last word wrapped do nothing.
        if($(this).find("span.lastWord").length > 0){
          return;
        } else{
          heading = $(this);
          if(!heading.hasClass('collapse-link')) {
            word_array = heading.html().split(/\s+/); // split on spaces 
            last_word = word_array.pop();             // pop the last word
            first_part = word_array.join(' ');        // rejoin the first words together

            heading.html([first_part, ' <span class="lastWord">', last_word, '</span>'].join(''));
          }
        }
      });
    }
  };

  window.SM = window.SM || {}
  window.SM.components = window.SM.components || {}
  window.SM.components.TextComponent = TextComponent;

  // Auto-Initialize...
  $(document).ready(function(){
    TextComponent.init();
  });

}(jQuery, document));
/*
 * /sm/components/commons/targeted-search/clientlibs/js/targeted-search.js
 */
(function($, window) {
  "use strict";
  
  var TargetedSearch = {

    init: function(){
      this.renderUI();
      this.bindUI();
    },

    renderUI: function(){
      $(".search-container").append($("<select>").addClass("temp-select").hide().append("<option>"));
    },

    bindUI: function(){
      var instance = this;
      $("#searchTarget").on("change", $.proxy(this.onSelectChange, this));
      $("#searchBtn").on("click", $.proxy(this.onSearchSubmit, this));
      $('#searchTxt').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode === 13){
          instance.onSearchSubmit();
        }
      });

      $(document).ready(function(){
        instance.onSelectChange({"currentTarget": $("#searchTarget")[0]});
      });
    },

    onSearchSubmit: function(){
      var searchTxt = $('#searchTxt').val(),
        searchTarget = $('#searchTarget').val(),
        searchLocation;
      
      if (searchTxt.length === 0) {
        alert('Enter Search text.');
        return;
      }
      
      if (searchTarget.length === 0) {
        alert('Select Search target.');
        return;
      }
      
      searchLocation = searchTarget + encodeURIComponent(searchTxt);
      window.location.href = searchLocation;
    },

    // Resize the select element to better fit the content
    onSelectChange: function(event){
      var text = $(event.currentTarget).find("option:selected").text(),
        $tmpSelect = $(event.currentTarget).parents(".search-container").find(".temp-select");

      $tmpSelect.find("option").html(text);
      $(event.currentTarget).width( $tmpSelect.width() + 20 );
    }
  };

  window.SM = window.SM || {};
  window.SM.components.TargetedSearch = TargetedSearch;

  if( typeof window.define === 'function' && window.define.amd ){
    window.define(function () { return TargetedSearch; });
  }

}(jQuery,window));
window.SM.accessibility = window.SM.accessibility || {};
/*
 * /sm/components/commons/tabs/clientlibs/js/tabs.js
 */
(function($, Utils, KeyboardFocus, Aria, WindowResizeEnd, window, document) {
  "use strict";
  
  var Tabset = {

    cssClass: "tabs",

    event: {
      open:  "open",
      opened:"opened",
      close: "close",
      closed:"closed"
    },

    init: function(){
      Utils = Utils || window.SM.Utils;
      Aria = Aria || window.SM.accessibility.AriaState;
      WindowResizeEnd = WindowResizeEnd || window.SM.WindowResizeEnd;
      KeyboardFocus = KeyboardFocus || window.SM.accessibility.KeyboardFocus;
      
      this.renderUI();
      this.bindUI();
      this.syncUI();
      this.tabPagination();
    },

    renderUI: function(){
      var x, l, tabComponents = $("."+ this.cssClass).toArray();
      for(x=0, l=tabComponents.length; x<l; x++){
        this.buildMobileMenu( tabComponents[x] ); // Build the compressed display
        this.displayMobileMenu( tabComponents[x] );
      }
    },

    bindUI: function(){
      var tabSelector = "."+ this.cssClass;

      $('.nav-tabs a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.id;
      });

      $(tabSelector).on({
        "keyup": $.proxy(this.fnHandleKeyUpEvent, this),
        // Bootstrap tab events
        "show.bs.tab":  $.proxy(this.fnHandleOpenEvent, this),
        "shown.bs.tab": $.proxy(this.fnHandleOpenEndEvent, this),
        "hide.bs.tab":  $.proxy(this.fnHandleCloseEvent, this)
      }, "[role=tab]");

      // Bootstrap collapse / accordion events
      $(tabSelector).on({
        "show.bs.collapse":  $.proxy(this.fnHandleOpenAccordionEvent, this),
        "hide.bs.collapse":  $.proxy(this.fnHandleCloseAccordionEvent, this)
      }, "[role=tabpanel]");

      // Close mobile nav when window is resized to Desktop
      $(document).on(WindowResizeEnd.event, $.proxy(this.fnHandleWindowResize, this));

      // Menu Button when display is Collapsed
      $(tabSelector).on("click", '.nav-tabs-menu', $.proxy(this.fnHandleMobileMenuButtonClick, this));
      $(tabSelector).on("click", ".hamburger [role=tab]", $.proxy(this.fnHandleMobileMenuClick, this));
      $("ul.nav-tabs li a,div.hamburger ul li a").on("click",function(e){

            if(e.target.nodeName=="DIV"){
                window.location.hash = $(e.target).closest("a").attr("id") ? $(e.target).closest("a").attr("id") : $(e.target).closest("a").attr("data-id");
            } else {
                window.location.hash = e.target.id ? e.target.id : e.target.data-id ;
            }

       })
    },

    syncUI: function(){
      var namedAnchor;
      // Trigger click events on bookmarked tabs and accordions
      if(window.location.hash) {
        namedAnchor = document.getElementById( window.location.hash.replace("#",'') );
        if( namedAnchor && $(namedAnchor).parents("."+ this.cssClass).length > 0 ){
          $(namedAnchor).trigger( "click" );
        }
      }
    },


    fnHandleOpenEvent: function(event){
      var x, l, tabset, tabpanel, toggleBehavior,
        tab = event.target;

      Aria.expandWidget(tab);
      $(tab).attr("tabindex",0);

      tabset = $(tab).parents("[role=tablist]").find('[role=tab]').toArray();
      for(x=0, l=tabset.length; x<l; x++){
        if( tabset[x] !== tab ){
          $(tabset[x]).attr("tabindex",-1);

          // Extend the 'open' behavior to the nested accordion
          toggleBehavior = $(tabset[x]).attr("data-toggle");
          if( toggleBehavior !== undefined && toggleBehavior === 'collapse'){
            tabpanel = Aria.findTabpanel(tabset[x]);
            if( $(tab).attr("aria-controls") === $(tabset[x]).attr("aria-controls") ){
              $( tabpanel ).collapse('show');
            }else if( $(tabpanel).is(":visible") ){
              $( tabpanel ).collapse('hide');
            }
          }

          // Apply aria state to the mobile menu / nested accordion elements
          if( $(tab).attr("aria-controls") === $(tabset[x]).attr("aria-controls") ){
            Aria.expand(tabset[x]);
            $(tabset[x]).attr("tabindex",0);
          }

          // TODO: Remove this block when Bootstrap gets upgraded
          else{
            // Bootstrap v3.0.2 does not trigger a hide event
            if( Aria.is(tabset[x], "expanded") ){
              $(tabset[x]).trigger("hide.bs.tab");
            }
          }
        }
      }

      //update pagination number if present
      this.updatePaginationText(event);

      //this.resetAccordion( $(tab).parents("."+ this.cssClass) );
    },
    fnHandleOpenEndEvent: function(event){
      $(event.target).trigger(this.event.opened);
    },

    fnHandleCloseEvent: function(event){
      var tab = event.target;
      Aria.collapseWidget(tab);
      $(tab).parent().removeClass('active');
      $(tab).trigger(this.event.close);
    },

    fnHandleOpenAccordionEvent: function(event){
      var tab, labeledby;
      labeledby = $(event.target).attr("aria-labeledby");
      tab = $(".panel-group [id="+labeledby+"]")[0];
      Aria.expand(tab);
    },
    fnHandleCloseAccordionEvent: function(event){
      var tab, labeledby;
      labeledby = $(event.target).attr("aria-labeledby");
      tab = $(".panel-group [id="+labeledby+"]")[0];
      Aria.collapse(tab);
    },

    fnHandleKeyUpEvent: function(event){
      // CSS Selector fragments to identify component parts
      KeyboardFocus.setAriaSelector({
        parent: "[role=tablist] > ul[aria-hidden=false]",
        navitem:"[role=tab]",
        content:"[role=tabpanel]"
      });
      KeyboardFocus.shiftFocusByKeycode(event.keyCode);
    },


    /*********************/

    // Builds the Hamburger Menu elements
    buildMobileMenu: function(tabComponent){
      var menu = $('[role=tablist] > ul:first', tabComponent).clone().removeClass("nav nav-tabs");
      $('li', menu).each(function(index, tab){
        $(tab).find('script').remove();

        var oldId = $(tab).find('a').attr("id");
        $(tab).find('a').attr("id", "").attr("data-id", oldId);
      });

      $(menu).appendTo($('.hamburger', tabComponent));
    },

    // Calculate if hamburger menu should be displayed
    displayMobileMenu: function(tabComponent){
      var tabsetWidth, componentWidth, tabMenu, mobileMenu, padValue;
      tabMenu = $(tabComponent).find('[role=tablist] > ul:first')[0];
      mobileMenu = $(tabComponent).find('.hamburger ul')[0];

      tabsetWidth = this.getTabsetWidth(tabComponent);
      componentWidth = $(tabMenu).width();
      padValue = 2;

      if (tabsetWidth+padValue > componentWidth && tabsetWidth > componentWidth+padValue) {
        $(tabComponent).addClass("compressed");
        Aria.hide( tabMenu );
        Aria.show( mobileMenu );

      }else {
        $(tabComponent).removeClass("compressed");
        Aria.show( tabMenu );
        Aria.hide( mobileMenu );
        $(mobileMenu).hide();
      }
    },

    fnHandleWindowResize: function(){
      var x, l, tabComponents = $("."+ this.cssClass).toArray();
      for(x=0, l=tabComponents.length; x<l; x++){
        this.displayMobileMenu( tabComponents[x] );
      }
    },

    // Handle Click event on a Hamburger menu item
    fnHandleMobileMenuClick: function(event){
      var tab = event.currentTarget;

      this.closeMenu(tab);
      // Force the open/close on the normal tabs
      if( $(tab).parents('.hamburger').length > 0 ){
        tab = document.getElementById( $(tab).attr("data-id") );
      }
      $(tab).parent().addClass('active');
      $(tab).show();
    },

    // Handle click event on hamburger menu toggle button
    fnHandleMobileMenuButtonClick: function(event){
      var button = event.target;

      if( Aria.is(button, "expanded") ){
        this.closeMenu( button );
      } else {
        this.openMenu( button );
      }
    },

    getTabsetWidth: function(tabComponent) {
      var tabsLength = 0;

      $(tabComponent).find('[role=tablist] > ul:first > li').each(function(idx, tab){
        tabsLength += $(tab).outerWidth();
      });

      return tabsLength;
    },

    // Open the Hamburger Menu
    openMenu: function(referenceElement){
      var menuButton, hamburgerMenu,
        tabComponent = $(referenceElement).parents("."+ this.cssClass)[0];

      menuButton = $('.nav-tabs-menu', tabComponent)[0];
      hamburgerMenu = $('.hamburger > ul', tabComponent)[0];

      Aria.expand(menuButton);
      $(menuButton).addClass("expanded");
      $(hamburgerMenu).stop().slideDown("fast");
    },

    // Close the Hamburger Menu
    closeMenu: function(referenceElement){
      var menuButton, hamburgerMenu,
        tabComponent = $(referenceElement).parents("."+ this.cssClass)[0];

      menuButton = $('.nav-tabs-menu', tabComponent)[0];
      hamburgerMenu = $('.hamburger > ul', tabComponent)[0];

      Aria.collapse(menuButton);
      $(menuButton).removeClass("expanded");
      $(hamburgerMenu).stop().slideUp("fast");
    },
    updatePaginationText: function(event){
      var tab = event.target;
      $("."+ this.cssClass).find("a.btn-page-jumper").text($(tab).closest("li").index()+1 + "/" + $(tab).closest("ul").find(">li").length);
    },
    tabPagination: function () {
      var outerMethod = this;
      $("div.paginationContent").each(function () {
        var self = this;
        var tbs = $(self).siblings("ul.nav-tabs").find("li");
        var activeTab = $("ul.nav-tabs").find("li.active");
        $(self).find("a.btn-page-jumper").text((activeTab.index() + 1) + "/" + tbs.length);

        $(this).find("a.btn-previous-page").click(function () {
          var pardiv = self;
          var tbs = $(pardiv).siblings("ul.nav-tabs").find("li");
          var activeTab = $(pardiv).siblings("ul.nav-tabs").find("li.active");
          var next = 0;
          if (activeTab.index() != 0) {
            next = activeTab.index() - 1;
          } else {
            next = tbs.length - 1;
          }
          tbs.eq(next).find("a").trigger("click");
          $('.' + outerMethod.cssClass).find('div.hamburger ul > li').eq(activeTab.index()-1).addClass('active');
        });

        $(this).find("a.btn-next-page").click(function () {
          var pardiv = self;
          var tbs = $(pardiv).siblings("ul.nav-tabs").find("li");
          var activeTab = $(pardiv).siblings("ul.nav-tabs").find("li.active");
          var next = 0;
          if (tbs.length >= (activeTab.index() + 2)) {
            next = activeTab.index() + 1
          }

          tbs.eq(next).find("a").trigger("click");
          $('.' + outerMethod.cssClass).find('div.hamburger ul > li').eq(activeTab.index()+1).addClass('active');
        });
      });
    }
  };

  window.SM = window.SM || {};
  window.SM.components.Tabset = Tabset;

  if( typeof window.define === 'function' && window.define.amd ){
      window.define(function () { return Tabset; });
  }


}(
  jQuery,
  window.SM.Utils,
  window.SM.accessibility.KeyboardFocus,
  window.SM.accessibility.AriaState,
  window.SM.WindowResizeEnd,
  window, 
  document
));
(function($, Utils, window, document){
  "use strict";

  $(document).ready(function() {
    if($('.search-results').length > 0) {
      /* Get results from parameters */
      var getParameter = function(parameterName) {
        var queryString = (window.top.location.href.indexOf('cf#') > -1 ? window.top.location.hash.substring(1) : window.top.location.search.substring(1));
        parameterName += '=';
        if(queryString.length > 0) {
          var begin = queryString.indexOf(parameterName);
          if(begin != -1) {
            begin += parameterName.length;
            var end = queryString.indexOf ('&' , begin);
            if(end == -1) end = queryString.length;
            return decodeURIComponent(decodeURIComponent(queryString.substring(begin,end)));
          }
        }
        // Return "null" if no parameter has been found
        return null;
      }
      var keyword = getParameter('q');
      var site = getParameter('site');
      // var site = 'med.stanford.edu';
      var searchId = getParameter('searchId');
      var startResult = getParameter('start');
      var globalGoogleId = '006236158989535544791:nznc8ztdo00';
      var googleAPIUrl = 'https://www.googleapis.com/customsearch/v1';
      var googleAPIKey = 'AIzaSyDMZGvWuq7iJFdSCYiT6aYZnnmS5FwG8sw';
      var paginationInterval = 10;
      var ajaxDataAll = null;
      var ajaxDataSite = null;
      var currentPage = null;
      var pageNum = null;

      var ajaxData = {
        key: googleAPIKey,
        cx: globalGoogleId,
        q: keyword
      };

      var commaSeparateNumber = function(val) {
        while (/(\d+)(\d{3})/.test(val.toString())){
          val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
      }

      if($('body').hasClass('olympus-page')) $('body').addClass('olympus-results-page');

      if(getParameter('q') != null) {
        var headingKeyword = decodeURIComponent(getParameter('q'));
        headingKeyword = headingKeyword.replace(/\+/g, " ");
        $('.search-results .heading-search-keyword').html('&ldquo;' + Utils.escapeHtml(headingKeyword) + '&rdquo;');
        if($('.olympus-results-page .section-header').lenth > 0)
          $('.olympus-results-page .section-header p').each(function() {
            $(this).remove();
          })
          $('.olympus-results-page .section-header')
            .append('<p>for <span class="heading-search-keyword">&ldquo;' + Utils.escapeHtml(headingKeyword) + '&rdquo;</span></p>');
      }
      if($('.header-local .brand').length > 0) {
        var siteBrand = (getParameter('siteBrand') != null ? decodeURIComponent(getParameter('siteBrand')) : "");
        var siteSubBrand = (getParameter('siteSubBrand') != null ? decodeURIComponent(getParameter('siteSubBrand')) : "");
        siteBrand = siteBrand.replace(/\+/g, " ");
        siteSubBrand = siteSubBrand.replace(/\+/g, " ");
        if(siteBrand != "") {
          if($('.brand-sitename-title').length > 0) {
            $('.brand-sitename-title').html(siteBrand);
          }
          else {
            $('.brand-sitename .wrap').prepend('<span class="brand-sitename-title">' + siteBrand + '</span>');
          }
        }
        if(siteSubBrand != "") {
          if($('.brand-sitename-subtitle').length > 0) {
            $('.brand-sitename-subtitle').html(siteSubBrand);
          }
          else {
            $('.brand-sitename .wrap').append('<span class="brand-sitename-subtitle">' + siteSubBrand + '</span>');
          }
        }
      }
      $('.search-results .search-tabs li a').each(function(i) {
        if(getParameter('defaultToSiteSpecific') != null) {
          if(i!=0) $(this).addClass('inactive');
        }
        else {
          if(i!=1) $(this).addClass('inactive');
        }
      });
      $('.search-results .search-tabs-content').hide();
      if(getParameter('defaultToSiteSpecific') != null) {
        $('.search-results .search-tabs-content:nth-child(2)').show();
      }
      else {
        $('.search-results .search-tabs-content:nth-child(3)').show();
      }
      if(searchId == null && (site == null || site == '')) {
        $('#this-site').addClass('inactive').hide();
      }
      $('.search-results .search-tabs li a:not(.external-results-link)').click(function(e){
        e.preventDefault();
        var t = $(this).attr('id');

        if($(this).hasClass('inactive')){ //this is the start of our condition 
          $('.search-results .search-tabs li a').addClass('inactive');           
          $(this).removeClass('inactive');

          $('.search-results .search-tabs-content').hide();
          $('#'+ t + '-c').fadeIn('slow');
        }
      });

      if(searchId != null) {
        $('.search-results .form-control').after('<input id="searchId" name="searchId" type="hidden" value="' + searchId + '">');
      }
      else {
        $('.search-results .form-control').after('<input id="siteUrl" name="site" type="hidden" value="' + site + '">');
      }

      if(getParameter('siteRootName') != null) {
        $('.search-results .form-control').after('<input id="siteRootName" name="siteRootName" type="hidden" value="' + getParameter('siteRootName') + '">');
      }

      if(getParameter('defaultToSiteSpecific') != null) {
        $('.search-results .form-control').after('<input id="defaultToSiteSpecific" name="defaultToSiteSpecific" type="hidden" value="' + getParameter('defaultToSiteSpecific') + '">');
      }

      if(getParameter('siteBrand') != null) {
        $('.search-results .form-control').after('<input id="siteBrand" name="siteBrand" type="hidden" value="' + getParameter('siteBrand') + '">');
      }

      if(getParameter('siteSubBrand') != null) {
        $('.search-results .form-control').after('<input id="siteSubBrand" name="siteSubBrand" type="hidden" value="' + getParameter('siteSubBrand') + '">');
      }

      if(keyword != null) {
        var newsHref = $('.search-results .news-link').attr('href');
        var pplHref = $('.search-results .people-link').attr('href');
        $('.search-results .news-link').attr('href', newsHref + '?q=' + keyword);
        $('.search-results .people-link').attr('href', pplHref + '?q=' + keyword);
      }

      var showResults = function(resultsData, resultsEl) {
        var numResults = null;
        var startResult = null;
        var promotionMarkup = '';
        if(typeof(resultsData.queries) !== 'undefined') {
          if(typeof(resultsData.queries.request) !== 'undefined') {
            if(typeof(resultsData.queries.request[0]) !== 'undefined') {
              if(typeof(resultsData.queries.request[0].startIndex) !== 'undefined') {
                startResult = parseInt(resultsData.queries.request[0].startIndex);
              }
              if(typeof(resultsData.queries.request[0].totalResults) !== 'undefined') {
                numResults = parseInt(resultsData.queries.request[0].totalResults);
                var resToShow = (numResults > 10000 ? '10,000+' : commaSeparateNumber(numResults));
                if(resultsEl.closest('#all-sites-c').length > 0) {
                  $('#all-sites .results-num').html('(' + resToShow + ')')
                }
                else if(resultsEl.closest('#this-site-c').length > 0) {
                  $('#this-site .results-num').html('(' + resToShow + ')')
                }
                if(numResults === 0) {
                  resultsEl.html('<li class="result-item"><p>No results were found for your search.</p>'
                    + '<h3>Suggestions</h3><ul><li>Make sure all words are spelled correctly.</li>'
                    + '<li>Try different keywords.</li><li>Try more general and meaningful keywords.</li></ul></li>');
                  return false;
                }
              }
            }
          }
        }
        resultsEl.html('');
        if(typeof(resultsData.promotions) !== 'undefined') {
          var convertStringToBold = function(stringToBeBolded) {
            var boldedString = stringToBeBolded.replace(new RegExp('\<em\>', 'g'), '<strong>');
            boldedString = boldedString.replace(new RegExp('\<\/em\>', 'g'), '</strong>');
            return boldedString
          };
          $.each(resultsData.promotions, function(i, val) {
            promotionMarkup += '<li class="result-item search-promotion"><a href="' + val.link + '" class="result-link"></a>';
            promotionMarkup += '<div class="result-content">';
            promotionMarkup += '<h3 class="result-heading">' + convertStringToBold(val.htmlTitle) + '</h3>';
            if(typeof(val.image) !== 'undefined') {
              promotionMarkup += '<img src="' + val.image.source + '" class="result-image" />';
            }
            promotionMarkup += (typeof(val.bodyLines) !== 'undefined' && val.bodyLines.length > 0 ? '<p>' : '');
            if (typeof(val.bodyLines) !== 'undefined') {
              $.each(val.bodyLines, function(i, line) {
                promotionMarkup += (i > 0 ? ' ' : '') + convertStringToBold(line.htmlTitle);
              });
            }
            promotionMarkup += (typeof(val.bodyLines) !== 'undefined' && val.bodyLines.length > 0 ? '</p>' : '');
            promotionMarkup += '<div class="result-url">' + val.displayLink + '</div>';
            promotionMarkup += '</div></li>';
          });
        }
        if(promotionMarkup !== '') resultsEl.append(promotionMarkup);
        if(typeof(resultsData.items) !== 'undefined') {
          $.each(resultsData.items, function(i, val) {
            var resultMarkup = '';
            resultMarkup += '<a href="' + val.link + '" class="result-link"></a>';
            resultMarkup += '<div class="result-content">';
            if(typeof(val.image) !== 'undefined') {
              resultMarkup += '<img src="' + val.image.thumbnailLink + '" class="result-image" />';
            }
            resultMarkup += '<h3' + (val.fileFormat === 'PDF/Adobe Acrobat' ? ' class="result-heading result-is-pdf"' : ' class="result-heading"') + '>' + val.htmlTitle + '</h3>';
            resultMarkup += '<p>' + val.htmlSnippet + '</p>';
            resultMarkup += '<div class="result-url">' + val.htmlFormattedUrl + '</div>';
            resultMarkup += '</div>';
            resultsEl.append('<li class="result-item">' + resultMarkup + '</li>');
          });
        }
        if(numResults !== null && numResults > paginationInterval) {
          showPagination(resultsEl, startResult, numResults);
        }
      }

      var showPagination = function(resultsEl, startResult, numResults) {
        if(startResult !== null) {
          resultsEl.closest('.search-tabs-content').find('.results-pagination').remove();
          var paginationEl = $('.results-tpl .results-pagination').clone().appendTo(resultsEl.closest('.search-tabs-content')).show();
          currentPage = commaSeparateNumber(Math.floor(startResult/paginationInterval) + 1);
          pageNum = commaSeparateNumber(Math.ceil(numResults/paginationInterval));
          paginationEl.find('.results-curr-pg').text(currentPage);
          paginationEl.find('.results-pg-num').text(pageNum);
          if(startResult + paginationInterval >= numResults) {
            paginationEl.find('.next-btn').attr('disabled', 'disabled');
            paginationEl.find('.last-btn').attr('disabled', 'disabled');
          }
          else {
            attachPaginationClickHandler(paginationEl, resultsEl, startResult, numResults, 'next');
            attachPaginationClickHandler(paginationEl, resultsEl, startResult, numResults, 'last');
          }
          if(startResult === 1) {
            paginationEl.find('.previous-btn').attr('disabled', 'disabled');
            paginationEl.find('.first-btn').attr('disabled', 'disabled');
          }
          else {
            attachPaginationClickHandler(paginationEl, resultsEl, startResult, numResults, 'previous');
            attachPaginationClickHandler(paginationEl, resultsEl, startResult, numResults, 'first');
          }
        }
      }

      var attachPaginationClickHandler = function(paginationEl, resultsEl, startResult, numResults, direction) {
        paginationEl.find('.' + direction + '-btn').click(function(e) {
          var ajaxStartResult = null;
          switch (direction) {
            case 'next':
              ajaxStartResult = startResult + paginationInterval;
              break;
            case 'previous':
              ajaxStartResult = startResult - paginationInterval;
              break;
            case 'last':
              var modNum = numResults%paginationInterval;
              ajaxStartResult = numResults - (modNum === 0 ? paginationInterval : modNum);
              break;
            case 'first':
              ajaxStartResult = 1;
              break;
          }
          if(resultsEl.closest('#all-sites-c').length > 0) {
            ajaxDataAll['start'] = ajaxStartResult;
            $.ajax({
              url: googleAPIUrl,
              data: ajaxDataAll,
              success: function(data) {
                showResults(data, resultsEl);
                var offset = $('#mainContent').offset();
                window.scrollTo(0, offset.top);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                showError(resultsEl);
              },
              dataType: 'json'
            });
          }
          else if(resultsEl.closest('#this-site-c').length > 0) {
            ajaxDataSite['start'] = ajaxStartResult;
            $.ajax({
              url: googleAPIUrl,
              data: ajaxDataSite,
              success: function(data) {
                showResults(data, resultsEl);
                var offset = $('#mainContent').offset();
                window.scrollTo(0, offset.top);
              },
              error: function(jqXHR, textStatus, errorThrown) {
                showError(resultsEl);
              },
              dataType: 'json'
            });
          }
        });
      }

      var showError = function(resultsEl) {
        resultsEl.html('<p>There was an issue retrieving search results. Please try again.</p>');
      }

      var getAllResults = function() {
        ajaxDataAll = $.extend({}, ajaxData);
        $.ajax({
          url: googleAPIUrl,
          data: ajaxDataAll,
          success: function(data) {
            showResults(data, $('.search-results #all-sites-c .results-list'));
          },
          error: function(jqXHR, textStatus, errorThrown) {
            showError($('.search-results #all-sites-c'));
          },
          dataType: 'json'
        });      
      }

      var getSiteResults = function() {
        ajaxDataSite = $.extend({}, ajaxData);

        if(searchId != null) {
          ajaxDataSite['cx'] = searchId;
        }
        else {
          ajaxDataSite['siteSearch'] = site;
        }

        $.ajax({
          url: googleAPIUrl,
          data: ajaxDataSite,
          success: function(data) {
            showResults(data, $('.search-results #this-site-c .results-list'));
          },
          error: function(jqXHR, textStatus, errorThrown) {
            showError($('.search-results #this-site-c'));
          },
          dataType: 'json'
        });
      }

      getAllResults();
      getSiteResults();
    }
  });

}(jQuery, window.SM.Utils, window, document));
/*
 * /sm/components/commons/related-links-panel/clientlibs/js/related-links-panel.js
 */
(function($, Utils, MobileNavigationPanel, document, undefined){
    "use strict";

    var RelatedLinksPanel;

    
    RelatedLinksPanel = {

        mobileMenu: null,

        init: function() {
            Utils = Utils || window.SM.Utils;
            MobileNavigationPanel = MobileNavigationPanel || window.SM.MobileNavigationPanel;
            Utils.log("RelatedLinksPanel.init()");

            this.renderUI();
            this.bindUI();
        },

        
        renderUI: function() {
            var copy;

            // Hide sub levels
            $(".related-links-panel").each(function(i, panel) {
                $(".nav", panel).hide();
                $("h2 i", panel).removeClass("fa-angle-up").addClass("fa-angle-right");
            });

            copy = $(".iparsys .related-links-panel").clone(true, true)[0];
            if( copy !== undefined && copy.length > 0 ){
                this.mobileMenu = copy[0];
            }
        },

        bindUI: function(){
            //Utils.log("RelatedLinksPanel.bindUI()");

            $(".related-links-panel h2 i").on("click", $.proxy(this.fnHandleClick, this));

            $(".related-links-panel").each(function(i,panel) {
               if(!($("h2 a", panel).length)){
                $("h2", panel).css('cursor','pointer');
                $("h2", panel).on("click", function(){$("h2 i", panel).click();});
               }                
            });

            $(document).on(MobileNavigationPanel.event.init, function() {
                $(".header-global .navbar-local").after( this.mobileMenu );
            });

            $(document).on(MobileNavigationPanel.event.navOpened, function() {
                $(this.mobileMenu).show();
            });

            $(document).on(MobileNavigationPanel.event.navClosed, function() {
                $(this.mobileMenu).hide();
            });
        },

        fnHandleClick: function(evt){
            evt.preventDefault();
        
            var $panel = $(evt.target).parents(".related-links-panel");
            
            $(".nav", $panel).slideToggle(100);
            $(evt.target)
                .toggleClass("fa-angle-right")
                .toggleClass("fa-angle-up");
            
            evt.stopPropagation();
        }
    };

    // Add to SM
    window.SM = window.SM || {};
    window.SM.components = window.SM.components || {};
    $.extend(window.SM.components, {"RelatedLinksPanel": RelatedLinksPanel});

}(jQuery, window.SM.Utils, window.SM.MobileNavigationPanel, document));
/*
 * /apps/sm/components/commons/profiles-search/results/clientlibs/js/results.js
 *
 */
(function($, window, document){
    "use strict";

    var ProfilesResults;

    ProfilesResults = {

        cssClass: 'profiles-results',

        init: function(){
            this.renderUI();
        },

        renderUI: function(){
            if($(".profile-details .bio.info-collapsible").length > 0) {
                $(".profile-details .bio.info-collapsible").readmore({
                    collapsedHeight: 70,
                    speed: 75,
                    moreLink: '<a href="#" class="more-btn">More</a>',
                    lessLink: '<a href="#" class="less-btn">Less</a>'
                }); 
            }
        }

    };

    // Add to SM
    window.SM = window.SM || {};
    window.SM.components = window.SM.components || {};
    $.extend(window.SM.components, {"ProfilesResults": ProfilesResults});

}(
    jQuery, 
    window, 
    document
));
/*
$(document).ready(function() {
    $(".profile-popup").fancybox({
        maxWidth: 520,
        maxHeight: 600,
        fitToView: false,
        width: '70%',
        height: '70%',
        autoSize: true,
        closeClick: false,
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0
    });
});
*/

// Temporary fix for profile images. The source of images were being set incorrectly to sgec.stanford.edu
$(document).ready(function() {
    $(".profile .profile-details .image").each(function(index) {
        $(this).find("div[data-src]").each(function(index) {
            $(this).attr("data-src", $(this).attr("data-src").replace("//sgec.stanford.edu/content/sm-profiles", "//med.stanford.edu/content/sm-profiles"));
        });
        $(this).find("img").each(function(index) {
            $(this).attr("src", $(this).attr("src").replace("//sgec.stanford.edu/content/sm-profiles", "//med.stanford.edu/content/sm-profiles"));
        });
    });

   if($(".profile .publication.article .authors").length > 0) {
		$(".profile .publication.article .authors").readmore({
			collapsedHeight: 38,

			moreLink: '<a href="#"><i class="icon-caret"></i>All Authors</a>',
			lessLink: '<a href="#"><i class="icon-caret-up"></i>Hide</a>',
			beforeToggle: function(trigger, element, expanded){
			}
		});
	}
	$(".profile p.pub-med a").prepend("<i class='icon-external-link'></i>&nbsp;");
    $(".profile p.doi a").prepend("<i class='icon-external-link'></i>&nbsp;");
    $(".profile p.wos").find("a").prepend("<i class='icon-external-link'></i>&nbsp;");


});


/*
 * /sm/components/commons/panel_builder/clinetlibs/js/panel_builder.js
 */
(function($, Utils, WindowResizeEnd, window, document) {
    "use strict";

    var PanelBuilder,

        BREAKPOINT_TABLET = 768,

        CSS_CLASS_MODIFIED = "modified-by-panel-builder";

    
    PanelBuilder = {

        init: function(){
            Utils = Utils || window.SM.Utils;
            WindowResizeEnd = WindowResizeEnd || window.SM.WindowResizeEnd;

            this.renderUI();
            this.bindUI();
        },

        renderUI: function(){
            
            if( Utils.getWcmAuthorMode() !== "edit" ){
                this.fixBottomPadding();
            }

            this.panelBuilderColumnFix();
        },

        bindUI: function(){
            var observer, MutationObserver;

            if( Utils.getWcmAuthorMode() !== "edit" ){
                $(document).bind(WindowResizeEnd.event, $.proxy(this.fixBottomPadding, this));
            }

            // Setup event handler to run fix when the dom changes
            MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            if (typeof MutationObserver === "object") {
                observer = new MutationObserver(function(mutations, observer) {
                    this.panelBuilderColumnFix();
                });

                observer.observe(document, {
                    subtree: true,
                    childList: true
                });
            }
        },

        /**
         * Sets bottom margin to 0 of last div element in a panel builder
         */
        fixBottomPadding: function () {
            var x, l, element, parsys, panels, isSection, borderShadowParent, isInBorderShadow,
                isMobileSize = $(window).width() < BREAKPOINT_TABLET,
                parsysSelectors;

            // Target top-level parsys elements in a panel builder
            parsysSelectors = [
                '.panel_builder > .row > [class*=panel-builder] > .parsys',
                '.panel_builder > .border-and-shadow > .row > [class*=panel-builder] > .parsys'
            ];

            try{
                parsys = $( parsysSelectors.join(", ") ).toArray();
                for(x=0,l=parsys.length; x<l; x++){
                    // Get last div
                    element = $(parsys[x]).find(" > div").last();
                    if (element.hasClass("new")) {
                        element = $(element).prev("div");
                    }

                    // Reset bottom margin
                    $(element).css("margin-bottom", "").removeClass( CSS_CLASS_MODIFIED );

                    // Determine context of element
                    isSection = element.hasClass("section");

                    borderShadowParent = $(element).parents(".border-and-shadow");
                    isInBorderShadow = borderShadowParent.length > 0;

                    // Reset bottom padding on border-and-shadow
                    $(borderShadowParent).css("padding-bottom", "");

                    // Set bottom padding for feature box inside a border-shadow panel.
                    if (isMobileSize && isSection && isInBorderShadow) {
                        $(borderShadowParent).css("padding-bottom", "0").addClass( CSS_CLASS_MODIFIED );
                    }

                    // Set bottom margin for elements that need it set
                    if (!isMobileSize || (isMobileSize && !isSection)) {
                        $(element).css("margin-bottom", "0").addClass( CSS_CLASS_MODIFIED );
                    }
                }
            }catch(e){
                Utils.log("Error: PanelBuilder.fixBottomPadding() failed");
            }

            panels = $(".panel_builder").toArray();
            for(x=0,l=panels.length; x<l; x++){
                this.adjustBottomMargin(panels[x], 1);
            }

            panels = $(".border-and-shadow").toArray();
            for(x=0,l=panels.length; x<l; x++){
                this.adjustBottomMargin(panels[x], 2);
            }
        },

        adjustBottomMargin: function (element, classListLength){
            var parents, classList;

            if ($(window).width() < BREAKPOINT_TABLET) {
                parents = $(element).parents(".border-and-shadow");

                if (parents.length > 0) {
                    classList = $(element).attr("class").split(/\s+/);
                    if (classList.length === classListLength) {
                        $(element).css("margin-bottom", 0).addClass( CSS_CLASS_MODIFIED );
                    }
                }

            }
        },

        /*
         * Edit Mode Only method (should be in panel-builder editmode clientlibs)
         * For each panel_builder determine if the column needs a little extra space
         * below to allow for easier drop zone.
         */
        panelBuilderColumnFix: function() {
            if( Utils.getWcmAuthorMode() === "edit" ){

                $(".panel_builder.section").each(function() {
                    var i, l, row, adjustHeights, newSection,
                        column, columns, columnHeight, 
                        nextColumn, nextColumnIndex, nextColumnHeight,
                        prevColumn, prevColumnIndex, prevColumnHeight;
                        
                    row = $(this).children(".row");

                    // Loop through each column in the panel builder.
                    columns = row.children("div");
                    adjustHeights = [columns.length];
                    for(i=0, l=columns.length; i < l; i++){

                        // Remove any style that may have been applied previously.
                        $(columns[i]).children(".new").removeAttr("style");

                        column = columns[i];

                        nextColumnIndex = i + 1 < columns.length ? i + 1 : 0;
                        nextColumn = columns[nextColumnIndex];

                        prevColumnIndex = i - 1 >= 0 ? i-1: columns.length - 1;
                        prevColumn = columns[prevColumnIndex];

                        columnHeight = $(column).height();
                        nextColumnHeight = $(nextColumn).height();
                        prevColumnHeight = $(prevColumn).height();

                        // Mark if column drop area needs to be adjusted
                        if(columnHeight < nextColumnHeight || columnHeight < prevColumnHeight){
                            adjustHeights[i] = true;
                        } else {
                            adjustHeights[i] = false;
                        }
                    }

                    // Loop through adjusting heights of drop zones
                    for (i=0, l=adjustHeights.length; i < l; i++){
                        if(adjustHeights[i]){
                            newSection = $(columns[i]).children(".new");
                            newSection.height(160);
                        }
                    }
                });
            }
        }
    };

    window.SM = window.SM || {};
    window.SM.components = window.SM.components || {};
    window.SM.components.PanelBuilder = PanelBuilder;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return PanelBuilder; });
    }
        

}(
    window.jQuery, 
    window.SM.Utils, 
    window.SM.WindowResizeEnd, 
    window, 
    document
));
!function($) {
    "use strict";

    var pluginName = "newsWireFeed",
            defaults = {};

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    function buildNewsFeed($el, data, displayCount, layout) {
        if (data &&
                data.NewsItemsByCategory &&
                data.NewsItemsByCategory.newsItems &&
                data.NewsItemsByCategory.newsItems.length > 0) {
            var newsItems = data.NewsItemsByCategory.newsItems,
                    $ul = $('<ul></ul>').addClass('news');

            var monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            $.each(newsItems, function(idx, newsItem) {
                if (displayCount < (idx + 1))
                    return;

                var publicationDate = newsItem.publicationDate,
                        title = newsItem.title,
                        link = newsItem.link,
                        imgSrc = newsItem.imageUrl,
                        description = newsItem.description;

                if (publicationDate && title && link) {
                    var dateObj = new Date(publicationDate),
                        formattedDate = (monthShortNames[dateObj.getMonth()]) + " " + dateObj.getDate() + ", " + dateObj.getFullYear(),
                        $li = $('<li></li>').addClass('newsfeed-item newswire row');

                    $li.append(display(link, title, imgSrc, description, publicationDate, formattedDate, layout));
                    $ul.append($li);
                } else {
                    // Increment display count to compensate for bad data
                    displayCount++;
                }
            });

            $el.empty().append($ul);
        } else {
            printUserMessage('No news item found.');
        }
    }

    function printUserMessage($el, msg) {
        $el.empty().append($('<span></span>').text(msg).addClass('error'));
    }

    function display(link, title, imgSrc, description, publicationDate, formattedDate, layout) {
        if (layout === 'horizontal') {
            return layoutHorizontal(link, title, imgSrc, description, publicationDate, formattedDate);
        } else if (layout === 'compact') {
            return layoutCompact(link, title, description);
        } else {
            return layoutHorizontal(link, title, imgSrc, description, publicationDate, formattedDate);
        }
    }

    function layoutHorizontal(link, title, imgSrc, description, publicationDate, formattedDate) {
        return  '<div class="col-sm-4">' +
                '<div class="newsfeed-item-container newsfeed-item-image-container">' +
                '<a href="' + link + '">' +
                '<div class="image">' +
                '<img alt="' + title + '" src="' + imgSrc + '">' +
                '</div>' +
                '</a>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-8">' +
                '<a href="' + link + '"><h3 class="newsfeed-item-title">' + title + '</h3></a>' +
                '<p class="newsfeed-item-excerpt">' + description + ' <a class="link-w-arrow" href="' + link + '"> Full <span class="lastWord">Story</span></p>' +
                '<hr>' +
                '<div class="newsfeed-item-footer">' +
                '<div class="pull-left" style="margin-bottom: 0px;">' +
                '<time datetime="' + publicationDate + '"><i class="fa fa-clock-o"></i> ' + formattedDate + '</time>' +
                '</div>' +
                '</div>' +
                '</div>';
    }

    function layoutCompact(link, title, description) {
        return '<div class="col-sm-12 compact">' +
                '<a href="' + link + '"><h4 class="newsfeed-item-title">' + title + '</h4></a>' +
                '<p class="newsfeed-time-excerpt" style="display:none">' + description + ' <a class="link-w-arrow" href="' + link + '"> Full <span class="lastWord">Story</span></p>' +
                '<a class="more" onclick="expandCompactNewsDescription(this)">More</a>' +
                '<hr />' +
                '</div>';
    }

    Plugin.prototype = {
        init: function() {
            var newsWireFeedUrl = $(this.element).attr('data-news-wire-url'),
                    displayCount = $(this.element).attr('data-display-count') || 5,
                    layout = $(this.element).attr('data-layout'),
                    $el = $(this.element);

            if (newsWireFeedUrl) {
                $.getJSON(newsWireFeedUrl, function(data) {
                    buildNewsFeed($el, data, displayCount, layout);
                }).fail(function() {
                    printUserMessage($el, 'Could not download news feed.');
                });
            } else {
                printUserMessage($el, 'No news feed source configured.');
            }
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

    // on page load, find and initialize news feed widgets
    $(function() {
        $('[data-widget=news-wire-feed]').newsWireFeed();
    });
}(window.jQuery);


function expandCompactNewsDescription(item) {
    var parent = $(item).parent('.compact');
    var descriptionP = parent.find('.newsfeed-time-excerpt');
    $(descriptionP).slideToggle(200);
    $(item).toggleClass("expanded");
}
/*jslint newcap: true, nomen: true, plusplus: true, white: true, browser: true, devel: true, regexp: true */

/*
 *  /apps/sm/components/commons/gallery/clientlibs/js/gallery.js
 */
$(document).ready(function() {

    $('.gallery').each(function() {

        var gallery = $(this);
        var nodeId = gallery.attr('id');

        gallery.find('.royalSlider').royalSlider({
            controlNavigation: 'thumbnails',
            navigateByClick:false,
            thumbs: {
                spacing: 12,
                appendSpan: true,
                arrowsAutoHide: false,
                autoCenter: true,
                firstMargin: true
            },
            deeplinking: {
                // deep linking options go gere
                enabled: true,
                prefix: nodeId + '-',
                change: true
            },
            fullscreen: {
                enabled: false,
                nativeFS: true
            },
            transitionType: 'fade',
            loop: true,
            keyboardNavEnabled: true,
            arrowsNavAutoHide: false,
            arrowsNav: true,
            usePreloader: true,
            numImagesToPreload: 1
        });

        var popupSrc = "#" + nodeId + "-popup";
        var slider = $('#' + nodeId + ' .royalSlider').data('royalSlider');

        gallery.find('.rsTmb').magnificPopup({
            items: {
                src: popupSrc,
                type: 'inline'
            },
            callbacks: {
                open: function() {
                    // Will fire when this exact popup is opened
                    // this - is Magnific Popup object
                    slider.updateSliderSize(true);
                    slider.updateThumbsSize();
                    $(document).trigger('debouncedresize');
                },
                close: function() {
                    slider.updateSliderSize(true);
                    slider.updateThumbsSize();
                }
            }
        });

        if (slider) {
            slider.ev.on('rsAfterSlideChange', function(event) {
                $(document).trigger('debouncedresize');
            });

            slider.ev.on('rsBeforeAnimStart', function(event) {
                if (event.currentTarget.captionHidden) {
                    $(slider.slider).find('.caption').hide();
                } else {
                    $(slider.slider).find('.caption').show();
                }
            });

            slider.captionHidden = false;
        }

        //$(‘.hideCaptionButton').click(function(event) {
        $('.royalSlider').on('click', '.hideCaptionButton', function(event) {
            event.stopPropagation();
            slider.captionHidden = !slider.captionHidden;
            var toggleButton = $(this);
            $(toggleButton).parents('.royalSlider').find('.caption').each(function() {
                $(this).slideToggle();
            });
        });

    });

    // Figures out which thumbnail was clicked, and if is in the buggy case of
    // all thumbnails fit into view space go to clicked slide, otherwise let
    // default action go.
    $('.rsTmb').click(function() {
        var thumb = $(this);
        var slider = thumb.parents('.royalSlider').data('royalSlider');
        var slideClicked = thumb.attr('class').match(/[0-9]+/);
        var thumbs = thumb.parents('.rsThumbs');
        var leftArrow = $(thumbs).find('.rsThumbsArrowLeft');
        var rightArrow = $(thumbs).find('.rsThumbsArrowRight');
        var leftArrowDisabled = $(leftArrow).attr('class').indexOf('rsThumbsArrowDisabled');
        var rightArrowDisabled = $(rightArrow).attr('class').indexOf('rsThumbsArrowDisabled');
        if (leftArrowDisabled >= 0 && rightArrowDisabled >= 0) {
            if (slider.currSlideId !== Number(slideClicked[0])) {
                slider.goTo(slideClicked);
            }
        }
    });

     setTimeout(function(){
        $('.gallery').each(function() {
            var cls = "mediaImageFullWidth";
            var gallery = $(this);
            if(gallery.hasClass("true")){
                cls = "mediaImageWidth";
            }
            gallery.find('.rsThumbsContainer img').each(function(){
                $(this).addClass(cls);
            })
            if(gallery.hasClass("true")){                
                gallery.find('.rsThumbsContainer .rsNavItem').each(function(){
                    $(this).width($(this).find("img").width()+5);
                })
            }

        });
    }, 3000);
});
(function($) {
    $(window).load(function () {
        $('.map-canvas').each(function () {
            var mapCanvas = $(this);
            var map;
            var mapDataElem = mapCanvas.next('.map-data');
            var mapData = mapDataElem.data();
            var centerAddress = mapDataElem.find('.center-marker').data();
            var markers = [];
            mapDataElem.find('.markers div').each(function() {
                markers.push($.parseJSON($(this).html()));
            });

            // filter mapType/style
            var mapType = mapData.mapType;
            if (mapType == "Road Map") {
                mapType = google.maps.MapTypeId.ROADMAP;
            } else if (mapType == "Satellite") {
                mapType = google.maps.MapTypeId.SATELLITE;
            }
            else if (mapType == "Hybrid") {
                mapType = google.maps.MapTypeId.HYBRID;
            }
            else if (mapType == "Terrain") {
                mapType = google.maps.MapTypeId.TERRAIN;
            }

            var centerLatLng = new google.maps.LatLng(37.4419, -122.1419); // Center on google, this is default if no center is set

            var centerofmaplatitude = parseFloat(mapData.centerLat);
            var centerofmaplongitude = parseFloat(mapData.centerLng);
            if (!isNaN(centerofmaplatitude) && !isNaN(centerofmaplongitude)) { // won't be able to center map without either of these variables
                centerLatLng = new google.maps.LatLng(centerofmaplatitude, centerofmaplongitude);
            }
            // setup map options
            var mapOptions = {
                zoom: parseFloat(mapData.zoom),
                center: centerLatLng,
                zoomControl: true,
                panControl: false,
                mapTypeId: mapType,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL
                }
            };
            map = new google.maps.Map(document.getElementById(mapData.nodeId),
                mapOptions);

            // marker business
            var latitude = centerAddress.latitude;
            var longitude = centerAddress.longitude;
            var myLatlng = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map
            });
            var contentString = "<h3>"+centerAddress.name+"</h3><p>"+centerAddress.address + "<br/>"  + centerAddress.city + " " + centerAddress.state + " " + centerAddress.zipcode + " " + centerAddress.country +"</p>";
            if ( mapData.addressType == "latlong" )
            {
                contentString = "<h3>"+centerAddress.name+"</h3><p>"+centerAddress.latitude + ", " + centerAddress.longitude;
            }
            var infoWindow = new google.maps.InfoWindow({
                content: contentString
            });

            google.maps.event.addListener(marker, 'mouseover', function () {
                infoWindow.open(map, marker);
            });
            infoWindow.open(map, marker); // there are problems with starting the infoWindow up. it causes errors in the default center of map. (the loop() below fixes the centering)
            $.each(markers,  function(idx, markerData) {
                if (markerData.latitude != "" && markerData.longitude != "") {
                    var myLatlng = new google.maps.LatLng(parseFloat(markerData.latitude), parseFloat(markerData.longitude));
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map
                    });
                    var iw = new google.maps.InfoWindow({
                        content: "<h3>" + markerData.title + "</h3><p>" + markerData.address + "<br/>" + markerData.city + " " + markerData.state + " " + markerData.zip + " " + markerData.country + "</p>"
                    });
                    google.maps.event.addListener(marker, 'mouseover', function () {
                        iw.open(map, marker);
                    });
                }
            });
            google.maps.event.addListenerOnce(map, 'idle', function(){
                if(mapCanvas.parents(".tab-pane").length > 0) {
                    mapCanvas.parents(".tab-pane").css("display", "block");
                    var center = this.getCenter();
                    google.maps.event.trigger(this, "resize");
                    this.setCenter(center);
                    setTimeout(function() {
                        mapCanvas.parents(".tab-pane").css("display", "");
                    }, 300);
                }
            });

        });
    });
})(jQuery);
jQuery(function($) {
	$(document).trigger('debouncedresize');

	//size "auto-width" containers while centered
	function resizeImageComponentContainer(){
		$('.image-auto-width.center-image').each(function(){
			console.log('resizing');
			var $this = $(this);
			$this.css('max-width', '');
			$this.css('max-width', $this.find('div.image img').get(0).width);
		});
	}

	$(window).on('load, resize', function(){
		resizeImageComponentContainer();
	});


	//add icon tray with expander icon to adaptive image
	$('.adaptiveimage [data-fullscreen-modal="true"]').each(function(){
		var $this = $(this),
			  largestImageSrc = $this.find('[data-picture] [data-src]:last').data("src");
		$this.find('[data-picture]').append("<div class='icon-tray'><a class='modal-open' href='" + largestImageSrc + "'><i class='fa fa-expand'></i></a></div>");
	});

	//if adaptive image does not have link, open larger view
	$('.adaptiveimage [data-fullscreen-modal="true"] .sm-image .image').on('click', function(e){
		var $this = $(this);
		if (!$this.parents('a').length){
			$this.find('a.modal-open:first').trigger('click');
		}
	});

/*
	//mignific popup scripts, does not support galleries/linking of groups
	$('.adaptiveimage .icon-tray a.modal-open').each(function() {
		$(this).magnificPopup({
			type: 'image',
			mainClass: 'image-component-modal',

			image: {
				titleSrc: function(item){
					if ($(item.el).closest('.adaptiveimage').find('.caption-container .caption').length){
						return "<div class='image-component-caption'>" + $(item.el).closest('.adaptiveimage').find('.caption-container .caption').html() + "</div>";
					}
				}
			}
		});
	});
*/

	//gather adaptive images on page, group into array if matching
	var adaptiveImageGroups = adaptiveImageGroups || {};
	adaptiveImageGroups.modalSet = {};
	$('.adaptiveimage [data-fullscreen-modal="true"] .icon-tray a.modal-open').each(function() {
		var id;
		if ($(this).closest('[data-picture]').attr('data-group') !== "") {
			id = $(this).closest('[data-picture]').attr('data-group');
		}
		else {
			do {
				id = Math.floor((Math.random() * 10000000) + 1);
			}
			while (adaptiveImageGroups.modalSet[id]);
		}

		if(!adaptiveImageGroups.modalSet[id]) {
			adaptiveImageGroups.modalSet[id] = [];
		}

		adaptiveImageGroups.modalSet[id].push( this );
	});


	//initialize adaptive image magnific-popup galleries and single viewers
	$.each(adaptiveImageGroups.modalSet, function() {

		$(this).magnificPopup({
			type: 'image',
			gallery: {enabled: true},
			mainClass: 'image-component-modal',

			image: {
				titleSrc: function (item) {
					if ($(item.el).closest('.adaptiveimage').find('.caption-container .caption').length) {
						return "<div class='image-component-caption'>" + $(item.el).closest('.adaptiveimage').find('.caption-container .caption').html() + "</div>";
					}
					else {
						return "";
					}
				}
			}
		});
	});

});

/*
 * debouncedresize: special jQuery event that happens once after a window resize
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery-smartresize
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work? 
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 */
(function($) {

var $event = $.event,
	$special,
	resizeTimeout;
/*
$special = $event.special.debouncedresize = {
	setup: function() {
		$( this ).on( "resize", $special.handler );
	},
	teardown: function() {
		$( this ).off( "resize", $special.handler );
	},
	handler: function( event, execAsap ) {
		// Save the context
		var context = this,
			args = arguments,
			dispatch = function() {
				// set correct event type
				event.type = "debouncedresize";
				$event.dispatch.apply( context, args );
			};

		if ( resizeTimeout ) {
			clearTimeout( resizeTimeout );
		}

		execAsap ?
			dispatch() :
			resizeTimeout = setTimeout( dispatch, $special.threshold );
	},
	threshold: 150
};
*/
})($);
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

window.matchMedia = window.matchMedia || (function( doc, undefined ) {

  "use strict";

  var bool,
      docElem = doc.documentElement,
      refNode = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement( "body" ),
      div = doc.createElement( "div" );

  div.id = "mq-test-1";
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  return function(q){

    div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

    docElem.insertBefore( fakeBody, refNode );
    bool = div.offsetWidth === 42;
    docElem.removeChild( fakeBody );

    return {
      matches: bool,
      media: q
    };

  };

}( document ));
/*
 * Adobe Systems Incorporated
 * Modified: October 30th, 2012
 *
 * Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with divs).
 * Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2
 */

(function($, w) {

    // Enable strict mode
    "use strict";

    w.picturefill = function(context) {
        var undefined;
        if (context === undefined) {
            context = $("body");
        }

        $("div[data-picture]", context).each(function() {
            var currentPicture = this;
            var containingDivWidth = $(currentPicture).width();
            var matches = [];
            $("div[data-media]", currentPicture).each(function() {
                var media = $(this).attr("data-media");
                var mediaValues = media.match(/\d+/g);

                // If container width matches media check which quality to use
                if (containingDivWidth >= mediaValues[0] && (mediaValues[1] === undefined || containingDivWidth <= mediaValues[1]) || containingDivWidth === 0) {
                    var quality = $(this).attr("data-quality");
                    var windowWidth = $(window).width();

                    if (windowWidth <= 476 && quality === "high") {
                        matches.push(this);
                    } else if ((windowWidth <= 991 && windowWidth > 476) && quality === "high") {
                        matches.push(this);
                    } else if (windowWidth > 991 && quality === "high") {
                        matches.push(this);
                    } else {
                        matches.push();
                    }
                }
            });

            var $picImg = $("img", currentPicture).first();

            if (matches.length) {
                if ($picImg.size() === 0) {
                    var $currentPicture = $(currentPicture);
                    $picImg = $("<img />").attr("alt", $currentPicture.attr("data-alt")).attr("title", $currentPicture.attr("data-alt")).appendTo($currentPicture);
                }

                // Add a url parameter to the image url for browser cache busting on author instance (Especially for IE)
                var p = "";
                if (typeof CQ !== 'undefined') {
                    p = "?cq_ck=" + $.now();
                }

                var matchedImage;
                if (matches.length > 1 && $(this).is(".image.vertical"))   {
                    matchedImage = matches[0];
                } else {
                    matchedImage = matches.pop();
                }

                $picImg.attr("src", matchedImage.getAttribute("data-src") + p);
            } else {
                $picImg.remove();
            }
        });
    };

    // Run on debounced resize and domready
    $(function() {
        w.picturefill();
    });

    $(w).on("debouncedresize", function() {
        w.picturefill();
    });

}($, this));

/*
  /apps/sm/components/commons/feature-box/clientlibs.editmode/js/text-image.js
*/
(function($, Utils, CQ, window){
  "use strict";

  var ImageIconEditmode = {

    fnHandleLoadContent: function(inputField){
      var panel = inputField.findParentByType('panel');
      if(inputField.getValue() === "") {
        inputField.setValue("image");
      }
      ImageIconEditmode.hideShowFieldsets(panel, inputField);
    },

    fnHandleSelectionChanged: function(inputField){
      var panel = inputField.findParentByType('panel');
      ImageIconEditmode.hideShowFieldsets(panel, inputField);
    },

    hideShowFieldsets: function(parent, inputField) {
      var mediaType = inputField.getValue();
      var imageFields = parent.find('name', './imageFields')[0];
      var iconFields = parent.find('name', './iconFields')[0];
      if (mediaType === "image") {
        imageFields.show();
        iconFields.hide();
      }
      else if (mediaType === "icon") {
        imageFields.hide();
        iconFields.show();
      }
      else {
        imageFields.hide();
        iconFields.hide();
      }     
    },

    fnHandleDialogSubmit: function(dialog) {
      CQ = CQ || window.CQ;
      var imageDescField = dialog.find('name', './alt')[0];
      var mediaTypeField = dialog.find('name', './mediaType')[0];
      var mediaType = mediaTypeField.getValue();
      var imageDescription = imageDescField.getValue();
      if(mediaType == 'image' && imageDescription == '') {
        CQ.Ext.Msg.show({
          title: 'Validation Error',
          msg: 'Please make sure the image title field is not empty.',
          buttons: CQ.Ext.MessageBox.OK,
          icon: CQ.Ext.MessageBox.ERROR,
          fn: function() {
            imageDescField.addClass('x-form-invalid').addClass('x-form-focus');
            imageDescField.focus();
          }
        });
        return false;
      }
      else {
        return true;       
      }
    }
  };

  window.SM = window.SM || {}
  window.SM.components = window.SM.components || {}
  window.SM.components.ImageIconEditmode = ImageIconEditmode;
     
}(
  jQuery,
  window.SM.Utils,
  window.CQ,
  window
));


/*
 * /sm/components/commons/hero-banner/clientlibs/js/hero-banner.js
 */
(function($, Utils, WindowResizeEnd, Keyboard, Aria, HeroBannerEditMode, window, document, undefined) {
  "use strict";

  /*
   * NOTE: Addtional hero banner JS resources are located under the page templates
   * - /apps/sm/components/olympus/hero-banner/clientlib/js/hero-banner.js
   * - /apps/sm/components/everest/hero-banner/clientlib/js/hero-banner.js
   * - etc...
   */

  var HeroBanner,
      
      SELECTOR_ROYAL_SLIDER = 
        ".hero-banner .royalSlider";

  
  // This code is written with the assumption that there is only one royal slider on a page.
  // If more than one is added it will break the code below.

  HeroBanner = {

    cssClass: "hero-banner-container",

    heroContainerCssClass: "hero-container",
    
    scaleSliderHeight: 5,
    
    scaleSliderWidth: 12,

    mobileScaleSliderHeight: null,
    
    mobileScaleSliderWidth: null,

    positionControlsAtPageWidth: true,

    scrollBarWidth: 0,

    layout: null,

    container: null,

    slider: {},

    sliderConfig: {},

    leftArrow: null,

    rightArrow: null,

    thumbnails: null,

    keyboardInitiated: false,

    lastSlideRef: null,

    event: {
      open:  "open",
      opened:"opened",
      close: "close",
      //closed:"closed",
      initialized: "initialized"
    },

    initialize: function(selector){
      Utils = Utils || window.SM.Utils;
      selector = selector || SELECTOR_ROYAL_SLIDER;
      Keyboard = Keyboard || window.SM.accessibility.Keyboard;
      WindowResizeEnd = WindowResizeEnd || window.SM.WindowResizeEnd;
      HeroBannerEditMode = HeroBannerEditMode || window.SM.components.HeroBannerEditMode;

      var documentWidth = $(document).width(),
          scaleSliderHeight, scaleSliderWidth;

      // Initialize 
      if( this.mobileScaleSliderHeight === null ){
        this.mobileScaleSliderHeight = this.scaleSliderHeight;
      }
      if( this.mobileScaleSliderWidth === null ){
        this.mobileScaleSliderWidth = this.scaleSliderWidth;
      }

      this.scrollBarWidth = this.calculateScrollbarWidth();
      
      scaleSliderHeight = ((documentWidth < Utils.BREAKPOINT_PHONE) ? this.mobileScaleSliderHeight : this.scaleSliderHeight);
      scaleSliderWidth = ((documentWidth < Utils.BREAKPOINT_PHONE) ? this.mobileScaleSliderWidth : this.scaleSliderWidth);

      //Utils.log(scaleSliderHeight+", "+scaleSliderWidth);

      if( $(selector).length > 0 ){
        this.container = $(selector)[0];
        this.layout = $(this.container).parents(".hero-banner-container").data("layout");

        // Disable certain options to acheive layout
        if( this.layout === "fullpage" ){
          this.positionControlsAtPageWidth = false;
        }

        this.sliderConfig = {
          autoScaleSlider: true, //Automatically updates slider height based on base width.
          autoScaleSliderHeight: scaleSliderHeight, //Base slider height
          autoScaleSliderWidth: scaleSliderWidth, //Base slider width. Slider will autocalculate the ratio based on these values.
          
          //keyboardNavEnabled: true,
          globalCaption: true,
          imageScalePadding: 0,
          arrowsNavAutoHide: false,
          sliderDrag: false,
          imageScaleMode: 'fill', //Scale mode for images. "fill", "fit", "fit-if-smaller" or "none
          loop: true,
          autoPlay: {
            // autoplay options go here
            enabled: $(this.container).attr('autoPlayEnabled'),
            pauseOnHover: true,
            stopAtAction: true,
            delay: 5000
          }
        };

        this.renderUi();
        this.bindUi();
        this.syncUi();

      }else{
        //Utils.log("HeroBanner did not initlize - $('"+selector+"').length == 0");
      }
    },

    // Disconnect all event listeners and remove markup from DOM
    destroy: function(){
      $(document).off(WindowResizeEnd.event, this.resize);
      //$(document).off("debouncedresize", this.resize);
      $('.rsNav', this.container).children().off('keyup');

      $(this.container).off("keyup");

      this.slider.destroy(); // royalslider custom events automatically get removed here
    },

    // Update the DOM
    renderUi: function(){
      var context = this.container,
          rsWidget, editables;

      // Prepare the parent
      if( this.layout !== "default" ){
        $(context).parents("."+this.heroContainerCssClass).addClass(this.layout);
        this.updateHeight();
      }

      if( HeroBannerEditMode ){
        // Store an array of all parsys areas
        editables = $('.parsys', HeroBanner.container).toArray();
        $(HeroBanner.container).data("editables", editables);

        // Disable WCM initilialization scripts before Royal Slider is initilized
        HeroBannerEditMode.disableWCMScripts(this.container);
      }

      // init royalslider
      rsWidget = $(context).royalSlider(this.sliderConfig);
      this.selectCurrentSlide();

      $(context).each(function() {
        if($(this).find('.rsContent').length === 1){ $(this).addClass('has-one-slide'); }
        $(this).after('<div class="hero-banner-label-container hero-banner-no-label"></div>');
        $(this).removeClass("banner-loading");
      });

      this.leftArrow = $(".rsArrowLeft", context)[0];
      this.rightArrow = $(".rsArrowRight", context)[0];
      this.thumbnails = $(".rsBullets", context)[0];

      this.slider = $(rsWidget).data('royalSlider');

      if (this.slider) {
        this.writeMobileOnlySliderLabel();
        this.wrapContentForFireFox();
        this.lastSlideRef = this.slider.currSlide;
      }

      this.updateHeroBackground();

      // Accessibility attributes
      this.applyAriaStates();
    },

    // Define event listeners
    bindUi: function(){
      $(document).on(WindowResizeEnd.event, $.proxy(this.fnHandleBeforeMove, this));
      $(document).on(WindowResizeEnd.event, $.proxy(this.resize, this));

      // Update slide label after change
      if (this.slider) {
        
        //Slide Open-Start
        // - trigger `open` event
        this.slider.ev.on('rsBeforeMove', $.proxy(this.fnHandleBeforeMove, this));

        // Slide Open-End 
        // - trigger `opened` event
        this.slider.ev.on('rsAfterSlideChange', $.proxy(this.fnHandleAfterSlideChange, this));

        // Identify the current slide
        // - trigger `close` event
        this.slider.ev.on("rsBeforeAnimStart", $.proxy(this.fnHandleBeforeAnimStart, this));

        // Royalslider does not really expose an "Initialized" event
        // The 'rsMaybeSizeReady' is the closest I've found & it fires more than once...
        // NOTE: There are many more undocumented events - checkout the royalslider source for more
        this.slider.ev.on('rsMaybeSizeReady', $.proxy(this.fnHandlePluginInitialized, this));
      }

      // Handle all keyup events
      $(this.container).on("keyup", $.proxy(this.fnHandleKeyUpEvent, this));
    },

    // Put the widget back in sync with the DOM
    syncUi: function(){
      HeroBanner.resize();
      HeroBanner.updateHeroBackground();
    },


    /*
     * Event Callbacks
     */
    fnHandleBeforeMove: function(){
      var index = HeroBanner.slider.currSlideId;
      $('.rsNavItem:nth-child('+(index+1)+')', HeroBanner.container).trigger( HeroBanner.event.open );
    },

    fnHandleAfterSlideChange: function(){
      var index = this.slider.currSlideId;

      this.writeMobileOnlySliderLabel( this.slider );
      if( this.keyboardInitiated === true ){
        this.shiftFocusToThumb( this.slider.currSlideId );
      }
      // Trigger Opened Event
      $('.rsNavItem:nth-child('+(index+1)+')', HeroBanner.container).trigger( HeroBanner.event.opened );
    },

    fnHandleBeforeAnimStart: function(){
      // Trigger close event
      $('.rsNavItem:nth-child('+(this.lastSlideRef.id+1)+')', this.container).trigger( this.event.close );
      this.lastSlideRef = this.slider.currSlide;

      // Manage aria states
      this.selectCurrentSlide();
      this.positionImageCenter( $(".currentSlide .image > img", this.container)[0] );
    },

    fnHandlePluginInitialized: function(){
      this.wrapContentForFireFox();
      this.positionImageCenter( $(".image > img", this.slider.currSlide.content.context)[0] );
      $(this.container).parents("."+ this.heroContainerCssClass).trigger( this.event.initialized );
    },

    // Changes the slide displayed when keyboard is used
    fnHandleKeyUpEvent: function(event){
      var element = event.target,
          keyCode = event.keyCode;

      this.keyboardInitiated = true;

      // Top level key events
      if (keyCode === Keyboard.left || keyCode === Keyboard.up) {
        this.goToPrev();
      } else if (keyCode === Keyboard.right || keyCode === Keyboard.down) {
        this.goToNext();
      }
      // Thumbnail key events
      else if( $(element).hasClass("rsNavItem") ){
        if (keyCode === Keyboard.enter || keyCode === Keyboard.space) {
          event.preventDefault();
          this.goTo( $(element).index() );
        }
      }

      return false;
    },


    /*
     * Utility Functions
     */

    goTo: function(index){
      return this.slider.goTo(index);
    },

    goToNext: function(){
      $(this.container).royalSlider('next');
    },
    goToPrev: function(){
      $(this.container).royalSlider('prev');
    },

    // Maintains the state of the currently displayed slide
    selectCurrentSlide: function(){
      var x, l, 
        $royalSlider = $(this.container).data('royalSlider'),
        slides = $royalSlider.slides;

      // Deselect
      for(x=0, l=slides.length; x<l; x++){
        if(slides[x].isRendered === true){
          slides[x].holder.removeClass("currentSlide");
          Aria.collapseWidget( slides[x].holder.find("[role=tabpanel]")[0] );
        }
      }

      // Select
      $royalSlider.currSlide.holder.addClass("currentSlide");
      Aria.expandWidget( $royalSlider.currSlide.holder.find("[role=tabpanel]")[0] );
    },

    // Update background color/style
    updateHeroBackground: function(){
      var container = this.container;
      $(container).parents(".hero-banner-container").each(function() {
        var data = $(this).data();
        
        $(container).parents("."+HeroBanner.heroContainerCssClass).css("backgroundColor", data.containerBackgroundColor);
          
        if (data.hatchedStyle === true) {
          $(container).parents("."+HeroBanner.heroContainerCssClass).addClass("hero-banner-hatched");
        }
      });
    },

    // go into slide
    shiftFocusIntoSlide: function(){
      Utils.log("shiftFocusIntoSlide()");
      $(".hero-banner-link:first", HeroBanner.slider.currSlide.content.context).focus();
    },

    shiftFocusToThumb: function(index){
      $('.rsNavItem:nth-child('+(index+1)+')', this.thumbnails).focus();
    },

    // RoyalSlider does not implement ARIA out-of-the-box
    // This function applies attributes to configure the Slider as an Aria Tabset 
    applyAriaStates: function(){
      var context = this.container, nodeId, $firstPanel,
          id = Utils.createUniqueId( this.cssClass +"-");
      
      $(context).attr("aria-multiselectable", "false");
      $(".rsNav",context).attr("role", "tablist");
      $(".rsNavItem",context).attr("role", "tab");
      $(".rsContent",context).attr("role", "tabpanel");

      // Link tabs to panels
      $firstPanel = $(".rsContent",context).first();
      if( $firstPanel[0] && $firstPanel.attr("id") !== undefined && $firstPanel.attr("aria-labeledby") !== undefined ){
        // Use existing attributes
        nodeId = $(context).parent().data("node-id");
        $(".rsNavItem",context).each(function(i,element){
          $(element).attr("id", nodeId+"_control_"+(i+1)).attr("aria-controls", nodeId+"_content_"+(i+1));
        });
      }
      else{
        // Add new attributes
        $(".rsNav > .rsNavItem",context).each(function(i,element){
          $(element).attr("id", id+"-tab"+(i+1)).attr("aria-controls",id+"-panel"+(i+1));
        });
        $(".rsContent",context).each(function(i,element){
          $(element).attr("id", id+"-panel"+(i+1)).attr("aria-labeledby",id+"-tab"+(i+1));
        });
      }

      // Make Slider arrows and thumbnails navigable
      $(".rsArrow, .rsNav > .rsNavItem",context).attr("tabindex","0");

      // Add text cues to keyboard & screen readers
      $(".rsNavItem > span", context).each(function(i,element) {
        $(element).html( $("<span>").addClass("sr-only").text("Slide #"+ (i+1)) );
      });
      $(".rsArrow.rsArrowLeft .rsArrowIcn",context).html( $("<span>").addClass("sr-only").text("Previous Slide") );
      $(".rsArrow.rsArrowRight .rsArrowIcn",context).html( $("<span>").addClass("sr-only").text("Next Slide") );
    },

    /*
     * Display mode functions
     */

    // Resizes the Aspect Ratio of the Slider
    resize: function(){
      var mobileBreak, tabletBreak, windowWidth, aspectRatio;

      if (this.slider) {
        mobileBreak = (Utils.BREAKPOINT_PHONE - this.scrollBarWidth);
        tabletBreak = (Utils.BREAKPOINT_TABLET - this.scrollBarWidth);
        windowWidth = $(window).width();
      
        this.updateHeight();

        if (windowWidth < mobileBreak) {
          aspectRatio = this.getMobileRatio();
          Utils.log("HeroBanner: Resize to mobile");
        }
        else{

          if( this.layout === "fullpage" && windowWidth >= tabletBreak ){
            aspectRatio = this.getFullScreenRatio();
            Utils.log("HeroBanner: Resize to fullpage");
          }
          else{
            aspectRatio = this.getDefaultRatio();
            Utils.log("HeroBanner: Resize to default/desktop");
          }
        }

        // Update if a change was detected
        if(this.slider.st.autoScaleSliderHeight !== aspectRatio.split(":")[1] || this.slider.st.autoScaleSliderWidth !== aspectRatio.split(":")[0]){
          this.slider.st.autoScaleSliderHeight = aspectRatio.split(":")[1];
          this.slider.st.autoScaleSliderWidth = aspectRatio.split(":")[0];

          //Utils.log(this.slider.st.autoScaleSliderHeight+":"+this.slider.st.autoScaleSliderWidth);
          this.updateWidth();
        }

        this.positionImageCenter( $(".image > img", this.slider.currSlide.content.context)[0] );
      }
    },

    updateHeight: function(){
      var offSet = $(this.container).parents("."+HeroBanner.heroContainerCssClass).offset(),
          tabletBreak = (Utils.BREAKPOINT_TABLET - HeroBanner.scrollBarWidth),
          heightValue;

      if( this.layout === "fullpage" ){
        if( $(window).width() >= tabletBreak ){
          heightValue = HeroBanner.getFullPageHeight();
        }else{
          heightValue = "auto";
        }
        $(this.container).parents(".hero-banner-container").height( heightValue );
      }
    },

    updateWidth: function(){
      HeroBanner.slider.width = 0;  // NOTE: this is required for updateSliderSize() to work
      HeroBanner.slider.updateSliderSize(true);

      if( HeroBanner.positionControlsAtPageWidth === true ){
        if( $(window).width() > Utils.BREAKPOINT_DESKTOP ){
          HeroBanner.positionSlideControls();
        }else{
          HeroBanner.positionSlideControls(true);
        }
      }
    },

    // Position the sider controls just outside the page width
    positionSlideControls: function(reset){
      if(reset === true){
        $(this.leftArrow).css("left", 0);
        $(this.rightArrow).css("right", 0);
        $(this.thumbnails).css("right", 0);
      }else{
        $(this.leftArrow).css("left", this.calculateSlideControlOffset( this.leftArrow ));
        $(this.rightArrow).css("right", this.calculateSlideControlOffset( this.rightArrow ));
        $(this.thumbnails).css("right", this.calculateSlideControlOffset());
      }
    },

    // Calculate the position of the Slideshow Controls based on the page width
    calculateSlideControlOffset: function(slideControl){
      var horizontalMargin, layoutWidth, horizontalPadding, slideControlWidth, offset,
          $headerSpace = $(".header-local > .container");

      //offest = royalsliderwidth() - header.width()

      slideControlWidth = (slideControl!==undefined)? $(slideControl).width() : 0;
      horizontalMargin = $headerSpace.offset().left;
      layoutWidth = $headerSpace.width();
      horizontalPadding = ($headerSpace.innerWidth() - layoutWidth) / 2;
      offset = parseInt(horizontalMargin + horizontalPadding - slideControlWidth, 10);

      //Utils.log(offset + " = "+horizontalMargin+" + "+horizontalPadding+" - "+slideControlWidth);
      return offset;
    },

    calculateScrollbarWidth: function(){
      var scrollbarWidth, 
          scrollDiv = document.createElement("div");

      document.body.appendChild(scrollDiv);
      $(scrollDiv).css({
        width: "100px",
        height: "100px",
        overflow: "scroll",
        position: "absolute",
        top: "-9999px"
      });
      scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);

      return scrollbarWidth;
    },

    calculateRatio: function(height, width){
      var aspect_full = (width / height),
          vFinal = Math.round(aspect_full * 100) / 100;

      vFinal = this.reduce((vFinal*100), 100);
      vFinal = vFinal[0] +":"+ vFinal[1];
      return vFinal;
    },

    // Reduce a fraction by finding the Greatest Common Divisor and dividing by it.
    reduce: function (numerator,denominator){
      var gcd = function gcd(a,b){
        return b ? gcd(b, a%b) : a;
      };
      gcd = gcd(numerator,denominator);
      return [numerator/gcd, denominator/gcd];
    },

    getMobileRatio: function(){
      var ratio = this.mobileScaleSliderWidth +":"+ this.mobileScaleSliderHeight;
      return ratio;
    },

    getFullScreenRatio: function(){
      var ratio, maxHeight;
      // Get the largest height value - including the height of the content in each slide
      maxHeight = this.getFullPageHeight();
      ratio = this.calculateRatio(maxHeight, $(window).width());
      return ratio;
    },

    getDefaultRatio: function(){
      var ratio, defaultScaleHeight, defaultScaleWidth, contentHeight, defaultHeight;

      defaultScaleHeight = this.scaleSliderHeight;
      defaultScaleWidth = this.scaleSliderWidth;

      // Calculate the pixel height of the default aspect ratio
      defaultHeight = Math.round((defaultScaleHeight * this.slider.width) / defaultScaleWidth);

      // Text-content in each slide can wrap, this extra height needs to be accounted for.
      // Get the largest pixel height of the content in each slide
      contentHeight = Math.max.apply(null, this.getContentHeightArray());

      if( contentHeight > defaultHeight ){
        ratio = this.calculateRatio(contentHeight, this.slider.width);
      }else{
        ratio = defaultScaleWidth+":"+defaultScaleHeight;
      }
      
      return ratio;
    },

    getSiderHeight: function(){
      var height, heightArray;
      heightArray = this.getContentHeightArray();
      heightArray.push( HeroBanner.slider.height );
      // Get the largest value
      height = Math.max.apply(null, heightArray);
      return height;
    },

    getFullPageHeight: function(){
      var height, heightArray, offSet;
      offSet = $(this.container).parents("."+this.heroContainerCssClass).offset();

      heightArray = this.getContentHeightArray();
      heightArray.push( $(window).height() - offSet.top ); // Include the fullpage height
      // Get the largest value
      height = Math.max.apply(null, heightArray);
      return height;
    },

    // Create an array of content heights for each slide
    getContentHeightArray: function(){
      var heightArray = $(".hero-banner-infobox-container", this.container).map(function(){
        return $(this).outerHeight();
      }).get();
      return heightArray;
    },
    
    // Force full width & height and center hroizontally & vertically
    positionImageCenter: function(image){
      var sliderHeight, imageHeight, imageWidth, scaledImageWidth, scaledImageHeight, centerStyles,
          tabletBreak = (Utils.BREAKPOINT_TABLET - this.scrollBarWidth),
          sliderWidth = $(window).width();

      if( sliderWidth <= tabletBreak || (this.layout === "fullpage" && sliderWidth >= tabletBreak) ){

        // Calculate the dimensions of the image scaled to fill the banner area
        sliderHeight = (this.layout === "fullpage" && sliderWidth >= tabletBreak)? this.getFullPageHeight() : this.getSiderHeight();
        imageHeight = $(image).height();
        imageWidth = $(image).width();
        scaledImageWidth = (imageWidth * sliderHeight) / imageHeight;
        scaledImageHeight = (imageHeight * sliderWidth) / imageWidth;

        centerStyles = {position: "absolute", height: "inherit", width: "100%", top: 0, left: 0};

        // Center the image horzontally
        if( scaledImageHeight < sliderHeight ){
          // Position the image negative left, while keeping image centered in slider
          centerStyles.height = "100%";
          //centerStyles.left = (-((scaledImageWidth/2)-(sliderWidth/2)) / scaledImageWidth * 100)+"%";
        }
        // Center the image vertically
        else{
          // Position the image negative top, while keeping image centered in slider
          centerStyles.width = "100%";
          centerStyles.top = (-((scaledImageHeight/2)-(sliderHeight/2)) / scaledImageHeight * 100)+"%";
        }

        $(image).css(centerStyles);
      }else{
        // Clear positioning
        $(image).attr({style : ""});
      }
    },

    writeMobileOnlySliderLabel: function() {
      var slideContent = "", $slide, $mobileOnlyLabel;
      $slide = this.slider.currSlide;
      
      if( $slide.content.find('.parsys').length === 0 ){
        // Copy V1 Content
        slideContent = this.copyDialogBasedContent( $slide );
      }else{
        // Copy V2 Content
        slideContent = this.copyDropzoneContent( $slide );
      }
      
      $mobileOnlyLabel = this.slider.slider.next('.hero-banner-label-container');
      if(slideContent.length > 0) {
        $mobileOnlyLabel.removeClass('hero-banner-no-label').html(slideContent);
      }else{
        $mobileOnlyLabel.addClass('hero-banner-no-label');
      }
    },

    // V1 of the HeroBanner has slide content managed in edit dialog
    copyDialogBasedContent: function($slide){
      var content = "", labelLinkContent, labelLinkTarget, linkInLabelHeading, labelHeading, labelLink;

      labelHeading = $slide.content.find('.hero-banner-infobox h2').clone();
      if(labelHeading.length > 0) {
        linkInLabelHeading = labelHeading.find('.hero-banner-more-link');
        linkInLabelHeading.remove();
        $(labelHeading.find('br')).each(function() {
          $(this).replaceWith('&nbsp;');
        });
        labelHeading.addClass('hero-banner-label-text');
        content += labelHeading[0].outerHTML;
      }

      labelLink = $slide.content.find('.hero-banner-more-link span');
      if(labelLink.length > 0) {
        labelLinkContent = labelLink.html();
        labelLinkTarget = $slide.content.find('.hero-banner-link').attr('href');
        content += $('<div>').addClass("hero-banner-label-link").html( $('<a>').attr('href',labelLinkTarget).html(labelLinkContent) )[0].outerHTML;
      }

      return content;
    },
    
    // V2 of the HeroBanner has slide content managed in dropzone areas
    copyDropzoneContent: function($slide){
      var content = "";
      if( $slide.content.find('.content').length > 0 ){
        content = $slide.content.find('.content')[0].outerHTML;
        // remove style attributes from all elements
        content = content.replace(/ style="/i, ' data-style="');
        // remove id attributes from all elements
        content = content.replace(/ id="/i, ' data-id="');
        // remove unessesary chars
        content = content.replace(/(?:\r\n|\r|\n)|parsys|parbase/g, "");
      }
      return content;
    },

    // Add non-breaking spaces to fix rendering issue on Firefox: CQ-910
    wrapContentForFireFox: function(){
      var x, l, alphaNumExists, nbsp = String.fromCharCode(160);
      //Utils.log("wrapContentForFireFox()");

      // Prevent JS error in IE8
      if( String.prototype.trim ){
        
        // Look for <h2> tags that do not have &nbsp; characters
        if($(".infobox-heading-wrapper h2", this.container).length > 0){
          $(".infobox-heading-wrapper h2", this.container).each(function() {
            if($(this).html().indexOf(nbsp) === -1) {
              for(x=0, l=this.childNodes.length; x<l; x++) {
                alphaNumExists = new RegExp("([a-zA-Z0-9]+)", "ig");
      
                // Target TextNodes with actual content
                if( this.childNodes[x].nodeType === 3 && alphaNumExists.test(this.childNodes[x].nodeValue) ){
                  this.childNodes[x].nodeValue = nbsp + this.childNodes[x].nodeValue.trim() + nbsp;
                }
              }
            }
          });
        }
      }
    }
  };

  // Add to SM
  window.SM = window.SM || {};
  window.SM.components = window.SM.components || {};
  $.extend(window.SM.components, {"HeroBanner": HeroBanner});

}(
  jQuery, 
  window.SM.Utils, 
  window.SM.WindowResizeEnd, 
  window.SM.accessibility.Keyboard,
  window.SM.accessibility.AriaState,
  window.SM.components.HeroBannerEditMode,
  window, 
  document
));

/*
 * /sm/components/commons/global-navigation/clientlibs/js/global.nav.js
 */
(function($, Dropdown, window) {
    "use strict";

    var GlobalNav = {

        name: "Global Navigation",

        cssClass: "navbar-global",

        init: function(){
            Dropdown = Dropdown || window.SM.DropdownNav;

            //console.log("Initializing "+ this.name);
            this.renderUI();
            this.bindUI();
        },

        renderUI: function(){},

        bindUI: function(){
            // Stop "fake" links from inserting a '#' into the addressbar
            $("."+this.cssClass).on("click", ".search-button", $.proxy(this.fnHandleSearchButtonClick, this));

            //override default in page linking
            $(document).on("click keypress", ".skip-to-links a", $.proxy(this.fnHandleSkipToLinksEvents, this))
        },

        // Stop "fake" links from inserting a '#' into the addressbar
        fnHandleSearchButtonClick: function(event){
            if( $(event.target).hasClass("fa-search") ){
                event.target = event.target.offsetParent;
            }
            Dropdown.fnHandleAnchorClick(event);
        },

        //Handles "skip to" links, hidden by default, only accessible via tabbing. Overwrites default functionality as fixed footer was causing inaccurate jump to math.
        fnHandleSkipToLinksEvents: function(event){
            event.preventDefault();
            var $this = {
                el: $(event.target),
                attr: $(event.target).attr("href")
            };
            if(($this.attr !== "#") && ($($this.attr).length)){
                $('html, body').scrollTop($($this.attr).offset().top);
            }
        }

    };

    window.SM = window.SM || {};
    window.SM.components = window.SM.components || {};
    window.SM.components.GlobalNav = GlobalNav;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return GlobalNav; });
    }

}(jQuery, window.SM.DropdownNav, window));
(function() {
	"use strict";
	$(document).ready(function() {
		$(".flip-panel .parsys").resize(function() {
			var $panel = $(this).closest(".flip-panel");

			$panel.trigger("parsys:resize");
		});
		$(".flip-panel .button-bar a").on("click", function(evt) {
			var $panel = $(this).closest(".flip-panel");

			$panel.toggleClass("flipped");
		});
		$(".flip-panel").on("parsys:resize", function(evt) {
			var $frontParsys = $(".front .parsys", this),
				$backParsys = $(".back .parsys", this),
				frontHeight = $frontParsys.height(),
				frontButtonBarHeight = $(".front .button-bar", this).outerHeight(true),
				backHeight = $backParsys.height(),
				backButtonBarHeight = $(".back .button-bar", this).outerHeight(true),
				offset = 20,
				frontPanelHeight = frontHeight + frontButtonBarHeight,
			    backPanelHeight = backHeight + backButtonBarHeight,
			    panelHeight = Math.max(frontPanelHeight, backPanelHeight),
			    containerHeight = $(this).height();

			if ($(this).hasClass("edit-mode")) {
				offset = 85;
			}
			
			panelHeight += offset;
			
			if (frontPanelHeight === backPanelHeight && !(containerHeight < panelHeight)) return;

			$(this).css("height", panelHeight);
			$(".front", this).css("height", panelHeight);
			$(".back", this).css("height", panelHeight);
		});
		$(".flip-panel").trigger("parsys:resize");
	});
}());
/*
  /apps/sm/components/commons/feature-box/clientlibs.editmode/js/text-image.js
*/
(function($, Utils, CQ, window){
  "use strict";

  var FeatureBoxEditmode = {

    fnHandleLoadContent: function(inputField){
      var panel = inputField.findParentByType('panel');
      if(inputField.getValue() === "") {
        inputField.setValue("image");
      }
      FeatureBoxEditmode.hideShowFieldsets(panel, inputField);
    },

    fnHandleSelectionChanged: function(inputField){
      var panel = inputField.findParentByType('panel');
      FeatureBoxEditmode.hideShowFieldsets(panel, inputField);
    },

    hideShowFieldsets: function(parent, inputField) {
      var mediaType = inputField.getValue();
      var imageFields = parent.find('name', './imageFields')[0];
      var iconFields = parent.find('name', './iconFields')[0];
      if (mediaType === "image") {
        imageFields.show();
        iconFields.hide();
      }
      else if (mediaType === "icon") {
        imageFields.hide();
        iconFields.show();
      }
      else {
        imageFields.hide();
        iconFields.hide();
      }     
    },

    fnHandleDialogSubmit: function(dialog) {
      CQ = CQ || window.CQ;
      var imageDescField = dialog.find('name', './alt')[0];
      var mediaTypeField = dialog.find('name', './mediaType')[0];
      var mediaType = mediaTypeField.getValue();
      var imageDescription = imageDescField.getValue();
      if(mediaType == 'image' && imageDescription == '') {
        CQ.Ext.Msg.show({
          title: 'Validation Error',
          msg: 'Please make sure the image title field is not empty.',
          buttons: CQ.Ext.MessageBox.OK,
          icon: CQ.Ext.MessageBox.ERROR,
          fn: function() {
            imageDescField.addClass('x-form-invalid').addClass('x-form-focus');
            imageDescField.focus();
          }
        });
        return false;
      }
      else {
        return true;       
      }
    }
  };

  window.SM = window.SM || {}
  window.SM.components = window.SM.components || {}
  window.SM.components.FeatureBoxEditmode = FeatureBoxEditmode;
     
}(
  jQuery,
  window.SM.Utils,
  window.CQ,
  window
));


/*
 * /apps/sm/components/commons/clinicaltrials-search/clientlibs/js/clinicaltrials-search.js
 *
 */
(function($, CQ, Utils, window, document){
    "use strict";

    var ClinicaltrialsSearch;

    ClinicaltrialsSearch = {

        cssClass: 'clinicaltrials-search',

        init: function(){
            CQ = CQ || window.CQ;
            Utils = Utils || window.SM.Utils;

            this.bindUI();
        },

        renderUI: function(){
        },

        bindUI: function(){
            var selector = "."+ this.cssClass;

            // Toggle button click
            $(selector).on("click", ".ct-show-more-btn", $.proxy(this.fnHandleMoreButton, this));
            // $(selector).on("click", ".ct-show-more-btn .fa", function(event) { event.preventDefault(); });
        },

        fnHandleMoreButton: function(event) {
            event.preventDefault();
            var $btnElement = $("." + this.cssClass + " .ct-show-more-btn"),
                elementToToggle = $btnElement.parents("." + this.cssClass).find(".ct-form-additional-fields");
            Utils.moreSectionSlideToggle(elementToToggle);
            if($(elementToToggle).hasClass("st-expanded")) {
                $btnElement.html("<i class='fa fa-minus-square-o'></i> See fewer search options");
            }
            else {
                $btnElement.html("<i class='fa fa-plus-square-o'></i> See more search options");
            }
        }

    };

    // Add to SM
    window.SM = window.SM || {};
    window.SM.components = window.SM.components || {};
    $.extend(window.SM.components, {"ClinicaltrialsSearch": ClinicaltrialsSearch});

}(
    jQuery, 
    window.CQ, 
    window.SM.Utils,
    window, 
    document
));
/*
 * /sm/components/commons/clinicaltrials/clientlibs/js/clinicaltrials.js
 */
(function($, window, document) {
  "use strict";

  var ClinicalTrials;

  
  // This code is written with the assumption that there is only one royal slider on a page.
  // If more than one is added it will break the code below.

  ClinicalTrials = {
    init: function() {
        this.bindUI();
    },
    bindUI: function() {
        var that = this;
        $(".clinicaltrials .pagination .active-pagination-link").click(function() {
            window.scrollTo(0, 0);
        });
        $(".clinicaltrials .clinical-trials-summary .trial .expand-btn").click(function() {
            that.toggleMoreTrialsSummary(this);
        });
    },
    toggleMoreTrialsSummary: function(element) {
        var moreSection = $(element).prev();
        $(moreSection).slideToggle(400);

        setTimeout(function(){
            $(element).toggleClass("expanded");
            $(element).toggleClass("collapsed");
        }, 200);

        var isCollapsed = $(element).hasClass("expanded");

        if(isCollapsed){
            $(element).animate({top: -12},400);
        } else {
            $(element).animate({top: 0},400);
        }
    }
  }
  // Add to SM
  window.SM = window.SM || {};
  window.SM.components = window.SM.components || {};
  $.extend(window.SM.components, {"ClinicalTrials": ClinicalTrials});

  // AMD Support
  if( typeof window.define === 'function' && window.define.amd ){
    window.define(['jquery'], function(){ return ClinicalTrials; });
  }
}(
  jQuery, 
  window, 
  document
));
/*
 * /sm/components/commons/hero-banner/clientlibs/js/hero-banner.js
 */
(function($, Utils, WindowResizeEnd, Keyboard, Aria, window, document, undefined) {
  "use strict";

  /*
   * NOTE: Addtional hero banner JS resources are located under the page templates
   * - /apps/sm/components/olympus/hero-banner/clientlib/js/hero-banner.js
   * - /apps/sm/components/everest/hero-banner/clientlib/js/hero-banner.js
   * - etc...
   */

  var Carouselset,

      SELECTOR_ROYAL_SLIDER =
          ".carousel royalSlider";


  // This code is written with the assumption that there is only one royal slider on a page.
  // If more than one is added it will break the code below.

  Carouselset = {

    cssClass: "carousel-content-container",

    heroContainerCssClass: "carousel-label-container",

    scaleSliderHeight: 5,

    scaleSliderWidth: 12,

    mobileScaleSliderHeight: null,

    mobileScaleSliderWidth: null,

    positionControlsAtPageWidth: true,

    scrollBarWidth: 0,

    layout: null,

    container: null,

    slider: {},

    sliderConfig: {},

    leftArrow: null,

    rightArrow: null,

    thumbnails: null,

    keyboardInitiated: false,

    lastSlideRef: null,

    event: {
      open:  "open",
      opened:"opened",
      close: "close",
      //closed:"closed",
      initialized: "initialized"
    },

    init: function(selector){
      Utils = Utils || window.SM.Utils;
      selector = selector || SELECTOR_ROYAL_SLIDER;
      Keyboard = Keyboard || window.SM.accessibility.Keyboard;
      WindowResizeEnd = WindowResizeEnd || window.SM.WindowResizeEnd;
     // HeroBannerEditMode = HeroBannerEditMode || window.SM.components.HeroBannerEditMode;

      var documentWidth = $(document).width(),
          scaleSliderHeight, scaleSliderWidth;

      // Initialize
      if( this.mobileScaleSliderHeight === null ){
        this.mobileScaleSliderHeight = this.scaleSliderHeight;
      }
      if( this.mobileScaleSliderWidth === null ){
        this.mobileScaleSliderWidth = this.scaleSliderWidth;
      }

      this.scrollBarWidth = this.calculateScrollbarWidth();

      scaleSliderHeight = ((documentWidth < Utils.BREAKPOINT_PHONE) ? this.mobileScaleSliderHeight : this.scaleSliderHeight);
      scaleSliderWidth = ((documentWidth < Utils.BREAKPOINT_PHONE) ? this.mobileScaleSliderWidth : this.scaleSliderWidth);

      //Utils.log(scaleSliderHeight+", "+scaleSliderWidth);

      if( $(selector).length > 0 ){
        this.container = $(selector)[0];
        this.layout = $(this.container).parents(".carousel-content-container ").data("layout");

        this.sliderConfig = {
          autoScaleSlider: false, //Automatically updates slider height based on base width.
          autoScaleSliderHeight: scaleSliderHeight, //Base slider height
          autoScaleSliderWidth: scaleSliderWidth, //Base slider width. Slider will autocalculate the ratio based on these values.
          controlNavigation: 'none',
          keyboardNavEnabled: true,
          globalCaption: false,
          imageScalePadding: 0,
          arrowsNav: false,
          sliderDrag: false,
          imageScaleMode: 'fit', //Scale mode for images. "fill", "fit", "fit-if-smaller" or "none
          loop: true,
          autoHeight: true,
          autoPlay: {
            // autoplay options go here
            enabled: $(this.container).attr('autoPlayEnabled'),
            pauseOnHover: true,
            stopAtAction: true,
            delay: $(this.container).attr('slideSpeed')
          }
        };

        this.renderUi();
        this.bindUi();
        this.syncUi();

      }else{
        //Utils.log("HeroBanner did not initlize - $('"+selector+"').length == 0");
      }
    },

    // Disconnect all event listeners and remove markup from DOM
    destroy: function(){
      $(document).off(WindowResizeEnd.event, this.resize);
      //$(document).off("debouncedresize", this.resize);
     // $('.rsNav', this.container).children().off('keyup');

      $(this.container).off("keyup");

      this.slider.destroy(); // royalslider custom events automatically get removed here
    },

    // Update the DOM
    renderUi: function(){
      var context = this.container,
          rsWidget, editables;

      // Prepare the parent
      if( this.layout !== "default" ){
        $(context).parents("."+this.heroContainerCssClass).addClass(this.layout);
        this.updateHeight();
      }

      // init royalslider
      rsWidget = $(context).royalSlider(this.sliderConfig);
      this.selectCurrentSlide();

      $(context).each(function() {
        if($(this).find('.rsContent').length === 1){ $(this).addClass('has-one-slide'); }
        $(this).after('<div class="carousel-label-container carousel-no-label"></div>');
        $(this).removeClass("banner-loading");
      });

      this.leftArrow = $(".rsArrowLeft", context)[0];
      this.rightArrow = $(".rsArrowRight", context)[0];

      //var slideCount=$('.carousel .rsSlide');
      var activeSlide=$('.carousel .rsSlide.currentSlide');
      var currentID= activeSlide.find(".rsContent");
      var slideNumber = currentID.data("slide-number")+1;
      var slideCount=$('.carousel-content-container').data('qty');

      $(".carousel").find("a.btn-page-jumper").text(slideNumber+"/"+slideCount);

      this.slider = $(rsWidget).data('royalSlider');

      if (this.slider) {
        this.writeMobileOnlySliderLabel();
        this.wrapContentForFireFox();
        this.lastSlideRef = this.slider.currSlide;
      }

      this.updateHeroBackground();

      // Accessibility attributes
      this.applyAriaStates();
    },

    // Define event listeners
    bindUi: function(){
      $(document).on(WindowResizeEnd.event, $.proxy(this.fnHandleBeforeMove, this));
      $(document).on(WindowResizeEnd.event, $.proxy(this.resize, this));

      // Update slide label after change
      if (this.slider) {

        //Slide Open-Start
        // - trigger `open` event
        this.slider.ev.on('rsBeforeMove', $.proxy(this.fnHandleBeforeMove, this));

        // Slide Open-End
        // - trigger `opened` event
        this.slider.ev.on('rsAfterSlideChange', $.proxy(this.fnHandleAfterSlideChange, this));

        // Identify the current slide
        // - trigger `close` event
        this.slider.ev.on("rsBeforeAnimStart", $.proxy(this.fnHandleBeforeAnimStart, this));

        // Royalslider does not really expose an "Initialized" event
        // The 'rsMaybeSizeReady' is the closest I've found & it fires more than once...
        // NOTE: There are many more undocumented events - checkout the royalslider source for more
        this.slider.ev.on('rsMaybeSizeReady', $.proxy(this.fnHandlePluginInitialized, this));
      }

      // Handle all keyup events
      $(this.container).on("keyup", $.proxy(this.fnHandleKeyUpEvent, this));

      $(".carousel .paginationContent .btn-next-page").on("click", function(){Carouselset.slider.next()});
      $(".carousel .paginationContent .btn-previous-page").on("click", function(){Carouselset.slider.prev()});
    },

    // Put the widget back in sync with the DOM
    syncUi: function(){
      Carouselset.resize();
      Carouselset.updateHeroBackground();
    },


    /*
     * Event Callbacks
     */
    fnHandleBeforeMove: function(){
      var index = Carouselset.slider.currSlideId;
      //$('.rsNavItem:nth-child('+(index+1)+')', Carouselset.container).trigger( Carouselset.event.open );
    },

    fnHandleAfterSlideChange: function(){
      var index = this.slider.currSlideId;
      var activeSlide=$('.carousel .rsSlide.currentSlide');
      var currentID= activeSlide.find(".rsContent");
      var slideNumber = currentID.data("slide-number")+1;
      var slideCount=$('.carousel-content-container').data('qty');

      $(".carousel").find("a.btn-page-jumper").text(slideNumber+"/"+slideCount);


      this.writeMobileOnlySliderLabel( this.slider );
      if( this.keyboardInitiated === true ){
        this.shiftFocusToThumb( this.slider.currSlideId );
      }
      // Trigger Opened Event
      //$('.rsNavItem:nth-child('+(index+1)+')', Carouselset.container).trigger( Carouselset.event.opened );
    },

    fnHandleBeforeAnimStart: function(){
      // Trigger close event
      //$('.rsNavItem:nth-child('+(this.lastSlideRef.id+1)+')', this.container).trigger( this.event.close );
      this.lastSlideRef = this.slider.currSlide;

      // Manage aria states
      this.selectCurrentSlide();
      //this.positionImageCenter( $(".currentSlide .image > img", this.container)[0] );
    },

    fnHandlePluginInitialized: function(){
      this.wrapContentForFireFox();
      //this.positionImageCenter( $(".image > img", this.slider.currSlide.content.context)[0] );
      $(this.container).parents("."+ this.heroContainerCssClass).trigger( this.event.initialized );
    },

    // Changes the slide displayed when keyboard is used
    fnHandleKeyUpEvent: function(event){
      var element = event.target,
          keyCode = event.keyCode;

      this.keyboardInitiated = true;

      // Top level key events
      if (keyCode === Keyboard.left || keyCode === Keyboard.up) {
        this.goToPrev();
      } else if (keyCode === Keyboard.right || keyCode === Keyboard.down) {
        this.goToNext();
      }
      // Thumbnail key events
          /*
      else if( $(element).hasClass("rsNavItem") ){
        if (keyCode === Keyboard.enter || keyCode === Keyboard.space) {
          event.preventDefault();
          this.goTo( $(element).index() );
        }
      }
      */
      return false;
    },


    /*
     * Utility Functions
     */

    goTo: function(index){
      return this.slider.goTo(index);
    },

    goToNext: function(){
      $(this.container).royalSlider('next');

    },
    goToPrev: function(){
      $(this.container).royalSlider('prev');
    },

    // Maintains the state of the currently displayed slide
    selectCurrentSlide: function(){
      var x, l,
          $royalSlider = $(this.container).data('royalSlider'),
          slides = $royalSlider.slides;

      // Deselect
      for(x=0, l=slides.length; x<l; x++){
        if(slides[x].isRendered === true){
          slides[x].holder.removeClass("currentSlide");
          Aria.collapseWidget( slides[x].holder.find("[role=tabpanel]")[0] );
        }
      }

      // Select
      $royalSlider.currSlide.holder.addClass("currentSlide");
      Aria.expandWidget( $royalSlider.currSlide.holder.find("[role=tabpanel]")[0] );
    },

    // Update background color/style
    updateHeroBackground: function(){
      var container = this.container;
      $(container).parents(".carousel-content-container").each(function() {
        var data = $(this).data();

        $(container).parents("."+Carouselset.heroContainerCssClass).css("backgroundColor", data.containerBackgroundColor);

        if (data.hatchedStyle === true) {
          $(container).parents("."+Carouselset.heroContainerCssClass).addClass("container-hatched");
        }
      });
    },

    // go into slide
    shiftFocusIntoSlide: function(){
      //Utils.log("shiftFocusIntoSlide()");
      $(".container-link:first", Carouselset.slider.currSlide.content.context).focus();
    },

    shiftFocusToThumb: function(index){
     // $('.rsNavItem:nth-child('+(index+1)+')', this.thumbnails).focus();
    },

    // RoyalSlider does not implement ARIA out-of-the-box
    // This function applies attributes to configure the Slider as an Aria Tabset
    applyAriaStates: function(){
      var context = this.container, nodeId, $firstPanel,
          id = Utils.createUniqueId( this.cssClass +"-");

      $(context).attr("aria-multiselectable", "false");

      $(".rsContent",context).attr("role", "tabpanel");

      // Link tabs to panels
      $firstPanel = $(".rsContent",context).first();
      if( $firstPanel[0] && $firstPanel.attr("id") !== undefined && $firstPanel.attr("aria-labeledby") !== undefined ){
        // Use existing attributes
        nodeId = $(context).parent().data("node-id");

      }

      // Make Slider arrows and thumbnails navigable

      $(".carousel .btn-previous-page",context).html( $("<span>").addClass("sr-only").text("Previous Slide") );
      $(".carousel .btn-next-page",context).html( $("<span>").addClass("sr-only").text("Next Slide") );

    },

    /*
     * Display mode functions
     */

    // Resizes the Aspect Ratio of the Slider
    resize: function(){
      var mobileBreak, tabletBreak, windowWidth, aspectRatio;

      if (this.slider) {
        mobileBreak = (Utils.BREAKPOINT_PHONE - this.scrollBarWidth);
        tabletBreak = (Utils.BREAKPOINT_TABLET - this.scrollBarWidth);
        windowWidth = $(window).width();

        this.updateHeight();

        if (windowWidth < mobileBreak) {
          aspectRatio = this.getMobileRatio();
         // Utils.log("Carouselset: Resize to mobile");
        }
        else{

            aspectRatio = this.getDefaultRatio();
            //Utils.log("Carouselset: Resize to default/desktop");

        }

        // Update if a change was detected
        if(this.slider.st.autoScaleSliderHeight !== aspectRatio.split(":")[1] || this.slider.st.autoScaleSliderWidth !== aspectRatio.split(":")[0]){
          this.slider.st.autoScaleSliderHeight = aspectRatio.split(":")[1];
          this.slider.st.autoScaleSliderWidth = aspectRatio.split(":")[0];

          //Utils.log(this.slider.st.autoScaleSliderHeight+":"+this.slider.st.autoScaleSliderWidth);
          this.updateWidth();
        }

        //this.positionImageCenter( $(".image > img", this.slider.currSlide.content.context)[0] );
      }
    },

    updateHeight: function(){
      var offSet = $(this.container).parents("."+Carouselset.heroContainerCssClass).offset(),
          tabletBreak = (Utils.BREAKPOINT_TABLET - Carouselset.scrollBarWidth),
          heightValue;
    },

    updateWidth: function(){
      Carouselset.slider.width = 0;  // NOTE: this is required for updateSliderSize() to work
      Carouselset.slider.updateSliderSize(true);

      if( Carouselset.positionControlsAtPageWidth === true ){
        if( $(window).width() > Utils.BREAKPOINT_DESKTOP ){
          Carouselset.positionSlideControls();
        }else{
          Carouselset.positionSlideControls(true);
        }
      }
    },

    // Position the sider controls just outside the page width
    positionSlideControls: function(reset){
        $(this.leftArrow).css("left", 0);
        $(this.rightArrow).css("right", 0);

    },

    // Calculate the position of the Slideshow Controls based on the page width
    calculateSlideControlOffset: function(slideControl){
      var horizontalMargin, layoutWidth, horizontalPadding, slideControlWidth, offset,
          $headerSpace = $(".header-local > .container");

      //offest = royalsliderwidth() - header.width()

      slideControlWidth = (slideControl!==undefined)? $(slideControl).width() : 0;
      horizontalMargin = $headerSpace.offset().left;
      layoutWidth = $headerSpace.width();
      horizontalPadding = ($headerSpace.innerWidth() - layoutWidth) / 2;
      offset = parseInt(horizontalMargin + horizontalPadding - slideControlWidth, 10);

      //Utils.log(offset + " = "+horizontalMargin+" + "+horizontalPadding+" - "+slideControlWidth);
      return offset;
    },

    calculateScrollbarWidth: function(){
      var scrollbarWidth,
          scrollDiv = document.createElement("div");

      document.body.appendChild(scrollDiv);
      $(scrollDiv).css({
                         width: "100px",
                         height: "100px",
                         overflow: "scroll",
                         position: "absolute",
                         top: "-9999px"
                       });
      scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);

      return scrollbarWidth;
    },

    calculateRatio: function(height, width){
      var aspect_full = (width / height),
          vFinal = Math.round(aspect_full * 100) / 100;

      vFinal = this.reduce((vFinal*100), 100);
      vFinal = vFinal[0] +":"+ vFinal[1];
      return vFinal;
    },

    // Reduce a fraction by finding the Greatest Common Divisor and dividing by it.
    reduce: function (numerator,denominator){
      var gcd = function gcd(a,b){
        return b ? gcd(b, a%b) : a;
      };
      gcd = gcd(numerator,denominator);
      return [numerator/gcd, denominator/gcd];
    },

    getMobileRatio: function(){
      var ratio = this.mobileScaleSliderWidth +":"+ this.mobileScaleSliderHeight;
      return ratio;
    },

    getDefaultRatio: function(){
      var ratio, defaultScaleHeight, defaultScaleWidth, contentHeight, defaultHeight;

      defaultScaleHeight = this.scaleSliderHeight;
      defaultScaleWidth = this.scaleSliderWidth;

      // Calculate the pixel height of the default aspect ratio
      defaultHeight = Math.round((defaultScaleHeight * this.slider.width) / defaultScaleWidth);

      // Text-content in each slide can wrap, this extra height needs to be accounted for.
      // Get the largest pixel height of the content in each slide
      contentHeight = Math.max.apply(null, this.getContentHeightArray());

      if( contentHeight > defaultHeight ){
        ratio = this.calculateRatio(contentHeight, this.slider.width);
      }else{
        ratio = defaultScaleWidth+":"+defaultScaleHeight;
      }

      return ratio;
    },

    getSiderHeight: function(){
      var height, heightArray;
      heightArray = this.getContentHeightArray();
      heightArray.push( Carouselset.slider.height );
      // Get the largest value
      height = Math.max.apply(null, heightArray);
      return height;
    },

    getFullPageHeight: function(){
      var height, heightArray, offSet;
      offSet = $(this.container).parents("."+this.heroContainerCssClass).offset();

      heightArray = this.getContentHeightArray();
      heightArray.push( $(window).height() - offSet.top ); // Include the fullpage height
      // Get the largest value
      height = Math.max.apply(null, heightArray);
      return height;
    },

    // Create an array of content heights for each slide
    getContentHeightArray: function(){
      var heightArray = $(".carousel-infobox-container", this.container).map(function(){
        return $(this).outerHeight();
      }).get();
      return heightArray;
    },

    // Force full width & height and center hroizontally & vertically
    positionImageCenter: function(image){
      var sliderHeight, imageHeight, imageWidth, scaledImageWidth, scaledImageHeight, centerStyles,
          tabletBreak = (Utils.BREAKPOINT_TABLET - this.scrollBarWidth),
          sliderWidth = $(window).width();

      if( sliderWidth <= tabletBreak || (this.layout === "fullpage" && sliderWidth >= tabletBreak) ){
        //Utils.log("wrapContentForFireFox()");
        // Calculate the dimensions of the image scaled to fill the banner area
        sliderHeight = (this.layout === "fullpage" && sliderWidth >= tabletBreak)? this.getFullPageHeight() : this.getSiderHeight();
        imageHeight = $(image).height();
        imageWidth = $(image).width();
        scaledImageWidth = (imageWidth * sliderHeight) / imageHeight;
        scaledImageHeight = (imageHeight * sliderWidth) / imageWidth;

        centerStyles = {position: "absolute", height: "auto", width: "auto", top: 0, left: 0};

        // Center the image horzontally
        if( scaledImageHeight < sliderHeight ){
          // Position the image negative left, while keeping image centered in slider
          centerStyles.height = "100%";
          centerStyles.left = (-((scaledImageWidth/2)-(sliderWidth/2)) / scaledImageWidth * 100)+"%";
        }
        // Center the image vertically
        else{
          // Position the image negative top, while keeping image centered in slider
          centerStyles.width = "100%";
          centerStyles.top = (-((scaledImageHeight/2)-(sliderHeight/2)) / scaledImageHeight * 100)+"%";
        }

        $(image).css(centerStyles);
      }else{
        // Clear positioning
        $(image).attr({style : ""});
      }
    },

    writeMobileOnlySliderLabel: function() {
      var slideContent = "", $slide, $mobileOnlyLabel;
      $slide = this.slider.currSlide;

      if( $slide.content.find('.parsys').length === 0 ){
        // Copy V1 Content
        slideContent = this.copyDialogBasedContent( $slide );
      }else{
        // Copy V2 Content
        slideContent = this.copyDropzoneContent( $slide );
      }

      $mobileOnlyLabel = this.slider.slider.next('.carousel-label-container');
      if(slideContent.length > 0) {
        $mobileOnlyLabel.removeClass('carousel-no-label').html(slideContent);
      }else{
        $mobileOnlyLabel.addClass('carousel-no-label');
      }
    },

    // V1 of the Carouselset has slide content managed in edit dialog
    copyDialogBasedContent: function($slide){
      var content = "", labelLinkContent, labelLinkTarget, linkInLabelHeading, labelHeading, labelLink;

      labelHeading = $slide.content.find('.carousel-infobox h2').clone();
      if(labelHeading.length > 0) {
        linkInLabelHeading = labelHeading.find('.carousel-more-link');
        linkInLabelHeading.remove();
        $(labelHeading.find('br')).each(function() {
          $(this).replaceWith('&nbsp;');
        });
        labelHeading.addClass('carousel-label-text');
        content += labelHeading[0].outerHTML;
      }

      labelLink = $slide.content.find('.container-more-link span');
      if(labelLink.length > 0) {
        labelLinkContent = labelLink.html();
        labelLinkTarget = $slide.content.find('.carousel-link').attr('href');
        content += $('<div>').addClass("carousel-label-link").html( $('<a>').attr('href',labelLinkTarget).html(labelLinkContent) )[0].outerHTML;
      }

      return content;
    },

    // V2 of the Carouselset has slide content managed in dropzone areas
    copyDropzoneContent: function($slide){
      var content = "";
      if( $slide.content.find('.content').length > 0 ){
        content = $slide.content.find('.content')[0].outerHTML;
        // remove style attributes from all elements
        content = content.replace(/ style="/i, ' data-style="');
        // remove id attributes from all elements
        content = content.replace(/ id="/i, ' data-id="');
        // remove unessesary chars
        content = content.replace(/(?:\r\n|\r|\n)|parsys|parbase/g, "");
      }
      return content;
    },

    // Add non-breaking spaces to fix rendering issue on Firefox: CQ-910
    wrapContentForFireFox: function(){
      var x, l, alphaNumExists, nbsp = String.fromCharCode(160);
      //Utils.log("wrapContentForFireFox()");

      // Prevent JS error in IE8
      if( String.prototype.trim ){

        // Look for <h2> tags that do not have &nbsp; characters
        if($(".infobox-heading-wrapper h2", this.container).length > 0){
          $(".infobox-heading-wrapper h2", this.container).each(function() {
            if($(this).html().indexOf(nbsp) === -1) {
              for(x=0, l=this.childNodes.length; x<l; x++) {
                alphaNumExists = new RegExp("([a-zA-Z0-9]+)", "ig");

                // Target TextNodes with actual content
                if( this.childNodes[x].nodeType === 3 && alphaNumExists.test(this.childNodes[x].nodeValue) ){
                  this.childNodes[x].nodeValue = nbsp + this.childNodes[x].nodeValue.trim() + nbsp;
                }
              }
            }
          });
        }
      }
    }
  };

  // Add to SM
  window.SM = window.SM || {};
  window.SM.components = window.SM.components || {};
  $.extend(window.SM.components, {"Carouselset": Carouselset});

}(
    jQuery,
    window.SM.Utils,
    window.SM.WindowResizeEnd,
    window.SM.accessibility.Keyboard,
    window.SM.accessibility.AriaState,
    window,
    document
));

/*jslint newcap: true, nomen: true, white: true, browser: true, devel: true*/

/*
 * /sm/components/commons/button/clientlibs/js/script.js
 */
(function($){
    "use strict";

    $( window ).load(function(){
        /*
         * Sarfari 5.1 has a bug that will not allow a <button> element 
         * to be centered if it doesn't have a defined width. This snippet attempts 
         * to resolve this.
         */
        $(".ext-safari:not(.ext-mac) .button .center .btn").each(function(){
            $(this).css("width",  $(this).outerWidth());
        });
    });

}(jQuery));
(
   function(){
	   $(document).ready(function() {		
            $(".block-list-item .block-list-li").each(function(i, el){
                $(el).css("height", $(el).height() +"px")
                          });

	   });
}());

!function($) {
    "use strict";

    var pluginName = "anchorIndexMenu",
            defaults = {};

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    function printUserMessage($el, msg) {
        $el.empty().append($('<span></span>').text(msg).addClass('error'));
    }

    Plugin.prototype = {
        init: function() {
            var $element = $(this.element),
                    $ul = $('<ul class="anchor-list"></ul>');
            $('[data-target=anchor-menu-item]').each(function(idx, title) {
                var $title = $(title),
                        label = $.trim($title.text()),
                        id = $title.attr('id');

                if (!id) {
                    id = label;
                    var updatedId = id.replace(/\ /g, '-').toLowerCase();                    
                    $title.parent().attr('id', updatedId);
                }

                var $li = $('<li></li>'),
                        $a = $('<a></a>', {
                            href: '#' + updatedId
                        }).text(label);
                $li.append($a);
                $ul.append($li);
            });
            $element.append($ul);

            // If Menu To jump down to jump link menu is there
            if ($(".anchor-index .menu").length === 1) {
                // add top padding on left jump link style column
                $(".jump-link-layout .border-and-shadow").addClass("extra-top-padding");
            }
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

    // on page load, find and initialize news feed widgets
    $(function() {
        $('[data-widget=anchor-index-menu]').anchorIndexMenu();
    });
}(window.jQuery);
/*
 * /apps/sm/components/commons/accordion/clientlibs/js/accordion.js
 *
 * Accessibility Specs taken from:
 *  - http://www.oaa-accessibility.org/examplep/accordian1/
 *
 */
(function($, Aria, Keyboard, KeyboardFocus, window, document){
    "use strict";

    var Accordion,

        STR_COLLAPSE_ALL = "Collapse All",

        STR_EXPAND_ALL = "Expand All";

    Accordion = {

        cssClass: 'accordion',

        cssClassOpened: "in",

        cssClassClosed: "collapsed",

        event: {
            open:  "open",
            opened:"opened",
            close: "close",
            closed:"closed"
        },


        init: function(){
            Aria = Aria || window.SM.accessibility.AriaState;
            Keyboard = Keyboard || window.SM.accessibility.Keyboard;
            KeyboardFocus = KeyboardFocus || window.SM.accessibility.KeyboardFocus;

            this.renderUI();
            this.bindUI();
            this.syncUI();
        },

        renderUI: function(){
            var x, l, id, heading, panel, accordions,
                selector = "."+ this.cssClass;

            // Initialize the opened / closed state of all accordion panels
            accordions = $(".panel", selector).toArray();
            for(x=0, l=accordions.length; x<l; x++){
                panel = $("[role=tabpanel]", accordions[x])[0];
                if( !$(panel).hasClass( this.cssClassOpened ) ){
                    this.fnHandleCloseEvent( {"target": panel} ); // Pass the panel in a mock event obj
                }else{
                    this.fnHandleOpenEvent( {"target": panel} ); // Pass the panel in a mock event obj
                }
            }
        },

        bindUI: function(){
            var selector = "."+ this.cssClass;

            // Bind hide and show parsys drop zones to custom events
            $("[role=tabpanel]", selector).on("show.bs.collapse",  $.proxy(this.fnHandleOpenEvent, this));
            $("[role=tabpanel]", selector).on("shown.bs.collapse", $.proxy(this.fnHandleOpenEndEvent, this));
            $("[role=tabpanel]", selector).on("hide.bs.collapse",  $.proxy(this.fnHandleCloseEvent, this));
            $("[role=tabpanel]", selector).on("hidden.bs.collapse",$.proxy(this.fnHandleCloseEndEvent, this));

            // Toggle button click
            $(selector).on("click", ".accordion-btn-toggle", $.proxy(this.fnHandleToggleButton, this));

            /*
             * Accessibility listeners
             */
            $(selector).on("keyup", "[role=tab]", $.proxy(this.fnHandleKeyUpEvent, this));
        },

        syncUI: function(){
          var namedAnchor;
          // Trigger click events on bookmarked accordions
          if(window.location.hash) {
            namedAnchor = document.getElementById( window.location.hash.replace("#",'') );
            if( namedAnchor && $(namedAnchor).parents("."+ this.cssClass).length > 0 ){
              $(namedAnchor).trigger( "click" );
            }
          }
        },

        /*
         * Event Handlers
         */
        fnHandleOpenEvent: function(event){
            var tabPanel = event.target;
            $(tabPanel).parents(".panel").find("[role=tab]").attr("aria-expanded", "true").removeClass( this.cssClassClosed );
            Aria.show(tabPanel);
            $(tabPanel).trigger(this.event.open);
        },

        fnHandleOpenEndEvent: function(event){
            $(event.target).trigger(this.event.opened);
        },

        fnHandleCloseEvent: function(event){
            var tabPanel = event.target;
            $(tabPanel).parents(".panel").find("[role=tab]").attr("aria-expanded", "false").addClass( this.cssClassClosed );
            Aria.hide(tabPanel);
            $(tabPanel).trigger(this.event.close);
        },

        fnHandleCloseEndEvent: function(event){
            $(event.target).trigger(this.event.closed);
        },

        fnHandleToggleButton: function(event){
            var x, l, context, panels, button = event.target;

            context = $(button).parents("[role=tablist]"),
            panels = $("[role=tabpanel]", context).toArray();

            if( Aria.is(button, "expanded") ){
                $(button).attr("aria-expanded", "false").text(STR_EXPAND_ALL);
                for(x=0,l=panels.length; x<l; x++){
                    if( $(panels[x]).hasClass(this.cssClassOpened) ){
                        $(panels[x]).collapse('hide');
                    }
                }
            }else{
                $(button).attr("aria-expanded", "true").text(STR_COLLAPSE_ALL);
                for(x=0,l=panels.length; x<l; x++){
                    if( !$(panels[x]).hasClass(this.cssClassOpened) ){
                        $(panels[x]).collapse('show');
                    }
                }
            }
        },

        toggle: function(tab){
            //$('[role=tabpanel]', tab).collapse('toggle');
            //$(tab).parents(".panel").find("[role=tabpanel]").collapse('toggle');
            $( Aria.findTabpanel(tab) ).collapse('toggle');
        },


        /*
         * Accesibility methods
         */
        fnHandleKeyUpEvent: function(event){
            var keyCode = event.keyCode;

            // CSS Selector fragments to identify component parts
            KeyboardFocus.setAriaSelector({
                parent: "[role=tablist]",
                navitem:"[role=tab]",
                content:"[role=tabpanel]"
            });
            KeyboardFocus.shiftFocusByKeycode(keyCode);
          
            // Expand / Collapse panel
            if (keyCode === Keyboard.enter || keyCode === Keyboard.space) {
                this.toggle( event.target );
            }
        }
    };

    // Add to SM
    window.SM = window.SM || {};
    window.SM.components = window.SM.components || {};
    $.extend(window.SM.components, {"Accordion": Accordion});

}(
    jQuery, 
    window.SM.accessibility.AriaState,
    window.SM.accessibility.Keyboard,
    window.SM.accessibility.KeyboardFocus,
    window, 
    document
));
