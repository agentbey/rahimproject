
/*
 * /etc/clientlibs/sm/mckinley/js/local.nav.js
 */
(function($, Utils, WindowResizeEnd, Dropdown, window, document, undefined){
    "use strict";

    var MckinleyNavBehavior,

        CSS_HAS_SUBMENU = 
            "has-submenu",

        CSS_HEIGHT_IS_ADJUSTED =
            "height-is-adjusted",

        CSS_EDIT_MODE = 
            "navbar-editmode",

        editModeDropzoneHeight = 105,
            
        animationDuration = 100,

        mainContentPixelBump = 1;


    MckinleyNavBehavior = {

        name: "Mckinley Navigation",

        cssClass: "navbar-dropdown-mckinley",


        init: function(){
            Utils = Utils || window.SM.Utils;
            Dropdown = Dropdown || window.SM.DropdownNav;
            WindowResizeEnd = WindowResizeEnd || window.SM.WindowResizeEnd;

            //Utils.log("Initializing "+ this.name);
            this.renderUI();
            this.bindUI();
        },

        renderUI: function(){
            // Pre-identify which nav-items hav sub menus
            $(".navbar-local > .nav").each(function(i, nav){
                
                $(nav).find(".nav-item").each(function(i, navItem){
                    var numChildMenus = $(navItem).find(".nav-item-panel .nav").length,
                        numAdditionalParsys = $(navItem).find(".nav-item-panel .menu-box").length;

                    if( numAdditionalParsys > 0 || numChildMenus > 0 ){
                        $(navItem).addClass(CSS_HAS_SUBMENU);
                    }

                    if( numChildMenus.length > 1 ){
                        $(this).addClass(CSS_HAS_SUBMENU + "-nested");
                    }
                });
            });

            // Set common height for top level nav-items
            if( $("."+MckinleyNavBehavior.cssClass).length > 0 ){
                this.setNavItemHeight();
            }

            //apply class to parent of local nav active link
            $(".navbar-local > .nav").find('a.active').parent('.has-submenu').addClass('active-parent');
        },

        bindUI: function(){

            // On window Resize end
            if( $("."+MckinleyNavBehavior.cssClass).length > 0 ){
                $(document).on(WindowResizeEnd.event, $.proxy(this.setNavItemHeight, this));
            }
            
            $("#navigationLocal").on(Dropdown.event.opened, $.proxy(this.fnHandleNavItemOpenEnd, this));

            $("#navigationLocal").on(Dropdown.event.closed, $.proxy(this.fnHandleNavItemCloseEnd, this));

            // Disable the hover events for third level menus
            $("."+MckinleyNavBehavior.cssClass).on({
                mouseenter: $.proxy(this.stopEventPropagation, this),
                mouseleave: $.proxy(this.stopEventPropagation, this)
            }, [".nav-item-panel .nav-item", ".nav-item-panel .nav-sub-menu-open", ".nav-item-panel .nav-sub-menu-close"].join(", "));


            $(window).on("load", $.proxy(this.fnHandleWindowLoad, this));
        },


        fnHandleNavItemOpenEnd: function(e, data){
            //Utils.log("MckinleyNavBehavior.on(Dropdown.event.opened)");
            var navItem = (data && data.navItem)? data.navItem : null,
                $navItemA = $(navItem).find('a.active');

            if(navItem !== null){
                this.setSubMenuHeight(navItem);
            }



            //open subsequent navigation panel if appropriate
            if (
              $navItemA.length //a.active under current nav item
              && $navItemA.parents('.has-submenu').not('.top-level, .clicked, .active-parent').length //nav item is nested in an appropriate submenu
            ){
                $navItemA.parents('.has-submenu').not('.top-level, .clicked, .active-parent').last().find('> button').trigger('click'); //open parent submenus
            }
        },


        fnHandleNavItemCloseEnd: function(e, data){
            //Utils.log("MckinleyNavBehavior.on(Dropdown.event.closed)");
            var navItem = (data && data.navItem)? data.navItem : null, 
                numParentNavItems = Dropdown.countParentItems(navItem);

            if( $(navItem).hasClass(CSS_HAS_SUBMENU) ){

                // Hack for Chrome bug: force a repaint of the main content area
                if( numParentNavItems === 0 ){
                    this.repaintMainContent();
                }
            }
        },


        stopEventPropagation: function(e){
            e.stopImmediatePropagation();
        },

        fnHandleWindowLoad: function(){
            Utils.log("MckinleyNavBehavior - $(window).on( load )");
            // Hack to address IE8 issue
            // - this needs to be bound the html5shiv loaded event
            if( $("html").hasClass("no-cssremunit") && $("."+this.cssClass).length > 0 ){
              setTimeout(this.setNavItemHeight, 2000);
            }
        },




        // Set height of 1st level nav items to that of the tallest item.
        setNavItemHeight: function() {
            Utils.log("MckinleyNavBehavior.setNavItemHeight()");
            var targetHeight, newHeight;

            if($(window).width() > Utils.BREAKPOINT_DESKTOP + 5) {
                $("#navigationLocal > .nav > .nav-item").css("height", "");
                $("#navigationLocal > .nav > .nav-item > a").css("height", "");

                targetHeight = MckinleyNavBehavior.calculateTallestItemHeight();
                $("#navigationLocal > .nav > .nav-item").css("height", targetHeight);

                // Recalculate to account for floated arrow/button elements
                newHeight = MckinleyNavBehavior.calculateTallestItemHeight();
                if(newHeight !== targetHeight){
                    targetHeight = newHeight;
                    $("#navigationLocal > .nav > .nav-item").css("height", targetHeight);
                }

                $("#navigationLocal > .nav > .nav-item > a").css("height", targetHeight);
                $("#navigationLocal > .nav > .nav-item > .nav-item-panel").css("top", targetHeight);
            }
        },

        // Set the submenu height 
        setSubMenuHeight: function(navItem){
            //Utils.log("MckinleyNavBehavior.on(Dropdown.event.opened)");
            var numParentNavItems = Dropdown.countParentItems(navItem),
                $section = $(navItem).parents("."+MckinleyNavBehavior.cssClass+" > .nav > .nav-item > .nav-item-panel > section"),
                $rootNavItem = (numParentNavItems>0)? $(navItem).parents("."+MckinleyNavBehavior.cssClass+" > .nav > .nav-item") : $(navItem),
                numAdditionalParsys = $rootNavItem.find(".nav-item-panel .related-container").length,
                calculatedHeight = 0;

            // If 1st level nav-item has opened...
            if(numParentNavItems === 0) {
                $section = $(navItem).find(" > .nav-item-panel > section"); // redefine <section> reference
            }

            // If 2nd or 3rd level nav-item has opened...
            if( $(navItem).hasClass(CSS_HAS_SUBMENU) ){
                $section.find("section").css("height", "");
                calculatedHeight = MckinleyNavBehavior.calculateHeight($rootNavItem[0], 10);

                if( numAdditionalParsys > 0 || $(navItem).hasClass(CSS_HAS_SUBMENU) ){
                    
                    $section.css("height", calculatedHeight);
                    
                    // Adjust the heights of the 3rd level <section>s
                    $section.find("section").height(calculatedHeight);

                    // Hack to correct the related-conteainer height
                    // The outer section has a top and bottom border. This causes a 2 pixel difference that needs to be corrected
                    $("> .related-container", $section).css("height", calculatedHeight - 2);
                }

                // Hack to correct the 3rd & 4th menu heights
                // The outer section has a top and bottom border. This causes a 2 pixel difference that needs to be corrected
                $section.find("section").each(function(i, childSection){
                    if( Dropdown.countParentItems(childSection) > 1 ){
                        $(childSection).height(calculatedHeight - 2);
                    }
                });
            }
        },



        /*
         * Utility Functions
         */
        calculateHeight: function(rootNavItem, padding, includeHidden){
            var Instance = this,
                $localNavRelated = $(rootNavItem).find("> .nav-item-panel .related-container > .local-nav-related"),
                $relatedContainer = $(rootNavItem).find("> .nav-item-panel .related-container"),
                $section = $(rootNavItem).find("> .nav-item-panel > section"), 
                $subNavs = $(rootNavItem).find("> .nav-item-panel .nav-item-panel"),
                targetHeight, localNavRelatedHeight, relatedContainerHeight, sectionHeight, subNavHeight, subNavTop, subNavH;

            padding = padding || 0;
            targetHeight = subNavHeight = 0;
            includeHidden = includeHidden || false;

            sectionHeight = this.getHeight( $section[0] );
            localNavRelatedHeight = $localNavRelated.height() || 0;
            relatedContainerHeight = this.getOuterHeight( $relatedContainer[0] );

            // Add space for the parsys dropzone
            if( $(rootNavItem).parents("."+MckinleyNavBehavior.cssClass).hasClass(CSS_EDIT_MODE) ){
                relatedContainerHeight += editModeDropzoneHeight;
            }

            $subNavs.each(function(i, nav){
                if(includeHidden===false && $(nav).filter(":visible").length===0){
                    return;
                }
                subNavH = parseInt($(nav).outerHeight(),10) || 0;
                subNavTop = parseInt($(nav).css("top"),10) || 0;
                if(subNavH + subNavTop > subNavHeight){
                    subNavHeight = subNavH + subNavTop;
                }
            });

            // Choose which height is taller
            targetHeight = Math.max(localNavRelatedHeight, relatedContainerHeight, subNavHeight, sectionHeight) + padding;

            //Utils.log("MckinleyNavBehavior.calculateHeight(): "+ targetHeight, localNavRelatedHeight, relatedContainerHeight, subNavHeight, sectionHeight, padding);
            return targetHeight;
        },

        calculateTallestItemHeight: function(){
            var targetHeight = Math.max.apply(null, $("#navigationLocal > .nav > .nav-item > a").map(function(){
                return $(this).outerHeight();
            }).get());

            return targetHeight;
        },


        // Force a repaint of the main content area
        repaintMainContent: function(){
            // NOTE: The first executuion of 'getMarginTop' caches the original value
            var marginTop = this.getMarginTop("#mainContent", "margin-top");

            $("#mainContent").css("margin-top", marginTop - mainContentPixelBump);
            $("#mainContent").css("margin-top", marginTop);
        },

        // Get cached value if exists, else calculate height()
        getHeight: function(element){
            var height = this.getData(element, "height") || 0;
            return parseInt(height, 10);
        },

        // Get cached value if exists, else calculate outerHeight()
        getOuterHeight: function(element){
            var height = this.getData(element, "outerHeight") || 0;
            return parseInt(height, 10);
        },

        // Get cached value if exists, else calculate $().css("margin-top")
        getMarginTop: function(element){
            var margin = this.getData($(element)[0], "margin-top") || 0;
            return parseInt(margin, 10);
        },

        // Read data stored in an element.
        // If the data is empty, attempt to extract the data with a jQuery function
        getData: function(element, key){
            var value, data;
            if(element !== undefined){
                data = $.data(element, key);
                if(data !== "" && data !== undefined){
                    value = data;
                }else{
                    // extract the data with a jQuery function - ex: $("div").height()
                    if(typeof $(element)[key] === "function"){
                        value = $(element)[ key ]();
                    }
                    // extract the data from a CSS query
                    else {
                        value = $(element).css( key );
                    }
                    // Store in data-cache
                    $.data(element, key, value);
                }
            }
            return value;
        }
    };

    //Attach to SM.components
    window.SM = window.SM || {};
    window.SM.MckinleyNavBehavior = MckinleyNavBehavior;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return MckinleyNavBehavior; });
    }

}(
    jQuery,
    window.SM.Utils,
    window.SM.WindowResizeEnd,
    window.SM.DropdownNav,
    window,
    document
));

/*
 * /etc/clientlibs/sm/mckinley/js/main.js
 */
(function($, Utils, MckinleyNavBehavior, window, document){
    "use strict";

    var MckinleyNav = {

        init: function(){
            Utils = Utils || window.SM.Utils;
            MckinleyNavBehavior = MckinleyNavBehavior || window.SM.components.MckinleyNavBehavior;

            this.renderUI();
            this.bindUI();
        },

        renderUI: function(){
            //Utils.log("MckinleyNav.renderUI()");

            // Remove the Mckinley Nav selector from the copied mobile-nav
            $(".header-global .navbar-local").removeClass( MckinleyNavBehavior.cssClass );

            // Initialize Mckinley Navigation 
            MckinleyNavBehavior.init();
        },

        bindUI: function(){
            // Define event listeners here
        }
    };

    // Attach to common namespace
    window.SM = window.SM || {};
    window.SM.MckinleyNav = MckinleyNav;

    // Auto-Initialize...
    $(document).ready(function(){
        MckinleyNav.init();
    });


}(
    jQuery,
    window.SM.Utils,
    window.SM.MckinleyNavBehavior,
    window,
    document
));
