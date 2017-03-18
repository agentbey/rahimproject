
/*
 * /sm/base/js/nav.js
 */
(function($, Keyboard, window, document, undefined) {
    "use strict";

    var Navigation;

    /*
     * Navigation Mixin Class
     */
    Navigation = {

        cssClass: null,

        cssClassHover: "hover",

        cssClassOpened: "clicked",

        navItemsToLeaveOpen: [],

        event: {
            open:   "event-nav-open",
            opened: "event-nav-opened",
            close:  "event-nav-close",
            closed: "event-nav-closed"
        },

        superBindUI: function(){
            //Utils.log("Navigation.bindEditModeUi()");
            var Instance = this, NavigationSelector;

            // NOTE: This is a mixin class:
            // When in use, this value should resolve to '.navbar-dropdown' or '.navbar-mobile', etc...
            NavigationSelector = this.getCssSelector();

            // Stop "fake" links from inserting a '#' into the addressbar
            $(NavigationSelector).on("click", "a", $.proxy(this.fnHandleAnchorClick, this));

            // Keyboard Navigation for menus
            $(NavigationSelector+".navbar").on("keyup", $.proxy(this.fnHandleNavKeyUp, this));

            // Keyboard Navigation for menu items
            $(NavigationSelector).on("keyup", ".nav-item", $.proxy(this.fnHandleNavItemKeyUp, this));

            // Automatically open & close nav-items when link is in focus
            $(NavigationSelector).on("focus", ".nav-item > a", $.proxy(this.fnHandleAnchorFocus, this));

            // Focus events fire before click events - this makes it difficult to detect mouse-focus vs keyboard-focus
            // This mousedown is used to identify a mouse initiated focus event
            $(NavigationSelector).on("mousedown", ".nav-item > a", $.proxy(this.fnHandleAnchorMouseDown, this));

            // Setup click events for the back buttons
            // NOTE: this could be deprecated at some point to favor use of elements with '.nav-sub-menu-close'
            $(NavigationSelector).on("click", ".nav-item .back", $.proxy(this.fnHandleBackButton, this));
            
            // Add click events for the sub menu navigation buttons
            $(NavigationSelector).on("click", ".nav-sub-menu-open", $.proxy(this.fnHandleOpenButton, this));
            $(NavigationSelector).on("click", ".nav-sub-menu-close", $.proxy(this.fnHandleCloseButton, this));

            /*
             * Automatically close nav-items when user tabs away from the navigation
             */
            $(NavigationSelector).on("keydown", "a:last", function(e){ 
                // tab key
                if(e.keyCode === 9) {
                    Instance.closeAll();
                }
            });
        },


        // Stop links from inserting a '#' into the addressbar
        fnHandleAnchorClick: function(e){
            var anchor = e.currentTarget;
            if( $(anchor).attr('href') === "#" || $(anchor).attr('href') === "" ){
                e.preventDefault();
            }
        },

        /*
         * Automatically open & close nav-items when link is in focus
         */
        fnHandleAnchorFocus: function(e){
            e.stopImmediatePropagation();
            var anchor = e.currentTarget,
                mdown = $(anchor).data('mdown');
            
            if(anchor === e.target){
                // Differentiate mouse-focus & keyboard-focus
                if(mdown){
                    $(anchor).removeData('mdown');
                }else{
                    e.currentTarget = $(anchor).parent();
                    this.fnHandleOpenSubMenu(e);
                }
            }
        },

        /*
         * Focus events fire before click events - this makes it difficult to detect mouse-focus vs keyboard-focus
         * This mousedown is used to identify a mouse initiated focus event
         */
        fnHandleAnchorMouseDown: function(e){
            var $anchor = $(e.currentTarget);
            if(!$anchor.is(':focus')){
                $anchor.data('mdown', true);
            }
        },

        /*
         * Setup click events for the back buttons
         * NOTE: this could be deprecated at some point to favor use of 'fnHandleCloseSubMenu()'
         */
        fnHandleBackButton: function(e) {
            var NavigationSelector = this.getCssSelector();
            e.stopPropagation();
            if( $(e.target).attr('href') === "#" ){
                e.preventDefault();
            }
            this.closeAll( $(e.target).parents(NavigationSelector) );
        },
        

        /*
         * Generic handlers to open and close submenus
         */
        fnHandleToggleSubMenu: function(e){
            e.stopImmediatePropagation();
            var navItem = e.currentTarget;

            this.toggleSubMenu( navItem );
        },
        fnHandleOpenSubMenu: function(e){
            e.stopImmediatePropagation();
            var navItem = e.currentTarget;

            this.triggerOpenEvent(navItem);
            this.closeAll( $(navItem).parent() );
            this.open( navItem );
        },
        fnHandleCloseSubMenu: function(e){
            e.stopImmediatePropagation();
            var navItem = e.currentTarget;

            this.triggerCloseEvent(navItem);
            this.close( navItem );
        },


        /*
         * Event handlers specific to the open/close submenu buttons
         */
        fnHandleOpenButton: function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            var openButton = e.currentTarget,
                $navItem = $(openButton).parents(".nav-item:first");

            if( $navItem.hasClass(this.cssClassHover) ){
                //this.triggerOpenEvent( $navItem[0] );
                this.open( $navItem[0] );
            }else{
                this.toggleSubMenu( $navItem[0] );
            }
            $(openButton).blur();
        },
        fnHandleCloseButton: function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            var closeButton = e.currentTarget,
                $navItem = $(closeButton).parents(".nav-item:first");

            this.triggerCloseEvent( $navItem[0] );
            this.close( $navItem[0] );
            $(closeButton).blur();
        },


        /*
         * Helper Methods
         */
        countParentItems: function(navItem){
            return parseInt($(navItem).parents(".nav-item").length, 10);
        },

        // ex: 1 for top, 2 for 2nd, etc...
        displayCurrentTier: function(navItem){
            return this.countParentItems(navItem) + 1;
        },

        toggleSubMenu: function(navItem){
            // Toggle submenu
            if( this.isOpen(navItem) ){
                // Close current nav
                this.closeAll($(navItem).parents(".nav:first"));
            }else{
                this.triggerOpenEvent(navItem);

                // Close sibling navs
                this.closeAll($(navItem).parents(".nav:first"), navItem);
                this.open( navItem );
            }
        },

        isOpen: function(navItem){
            var isOpen = false;
            if( $(navItem).hasClass( this.cssClassHover ) || $(navItem).hasClass( this.cssClassOpened ) ){
                isOpen  = true;
            }
            return isOpen;
        },

        // Opens a nav item and triggers an open event
        open: function(navItem){
            $(navItem).addClass( this.cssClassOpened ).removeClass( this.cssClassHover );

            this.triggerOpenedEvent(navItem);
        },

        // Closes a nav item and triggers a close event
        close: function(navItem){
            $(navItem).removeClass(this.cssClassOpened +" "+ this.cssClassHover);

            this.triggerClosedEvent(navItem);
        },


        /*
         * Close all child nav-items in this branch
         *  - add navItems to be left open as additional arguments
         */
        closeAll: function ($branchContext) {
            var x, l, navItems, arrItemsToLeaveOpen,
                args = Array.prototype.slice.apply(arguments);
            
            $branchContext = args.shift();
            arrItemsToLeaveOpen = args.concat( this.navItemsToLeaveOpen );  // Optional param

            if( $branchContext === undefined ){
                $branchContext = $("."+this.cssClass +" > .nav");
            }

            navItems = $(".nav-item."+this.cssClassOpened+", .nav-item."+this.cssClassHover, $branchContext).toArray();
            for(x=0, l=navItems.length; x<l; x++){
                if( $.inArray(navItems[x], arrItemsToLeaveOpen) === -1 /* && navItems[x] does not contain navItemToLeaveOpen */){
                    this.triggerCloseEvent(navItems[x]);
                    this.close(navItems[x]);
                }
            }
        },


        /*
         * Custom Events for the open/close states
         */
        triggerOpenEvent: function(navItem){
            var $menuTop = $(navItem).parents("."+this.cssClass);
            $(document).trigger(this.event.open, {"nav" : $menuTop[0]});
            $menuTop.trigger(this.event.open, {"navItem" : navItem});
        },
        triggerCloseEvent: function(navItem){
            var $menuTop = $(navItem).parents("."+this.cssClass);
            $(document).trigger(this.event.close, {"nav" : $menuTop[0]});
            $menuTop.trigger(this.event.close, {"navItem" : navItem});
        },
        // Events for post open/close animations
        triggerOpenedEvent: function(navItem){
            var $menuTop = $(navItem).parents("."+this.cssClass);
            $(document).trigger(this.event.opened, {"nav" : $menuTop[0]});
            $menuTop.trigger(this.event.opened, {"navItem" : navItem});
        },
        triggerClosedEvent: function(navItem){
            var $menuTop = $(navItem).parents("."+this.cssClass);
            $(document).trigger(this.event.closed, {"nav" : $menuTop[0]});
            $menuTop.trigger(this.event.closed, {"navItem" : navItem});
        },



        /*
         * Keyboard Navigation Methods
         */

        /*
        From the DHTML style guide:
        - If a menu bar item has focus and the menu is not open, then:
            - Enter, Spacebar, and the up down arrow keys opens the menu and places focus on the first menu item in the opened menu or child menu bar.
            - Left or right arrow keys moves focus to the adjacent menu bar item.
        - When a menu is open and focus is on a menu item in that open menu, then
            - Enter or Spacebar invokes that menu action (which may be to open a submenu).
            - Up or down arrow keys cycles focus through the items in that menu.
            - Escape closes the open menu and returns focus to the parent menu item.
        - Typing a letter (printable character) key moves focus to the next instance of a visible node whose title begins with that printable letter.
        ! Tabbing out of the menu component closes any open menus.
        - With focus on a menu item and a sub menu opened via mouse behavior, pressing down arrow moves focus to the first item in the sub menu.
        - With focus on a menu item and a sub menu opened via mouse behavior, pressing up arrow moves focus to the last item in the sub menu.
        - With focus on a submenu item, the user must use arrows or the Escape key to progressively close submenus and move up to the parent menu item(s).
        - At the top level, Escape key closes any sub menus and keeps focus at the top level menu.
        */
        fnHandleNavKeyUp: function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            Keyboard = Keyboard || window.SM.accessibility.Keyboard;
            var navbar = e.target,
                NavigationSelector = this.getCssSelector();
            
            //Utils.log("fnHandleNavKeyUp()", e.which);

            // enter, space, up or down
            if(e.which === Keyboard.enter || e.which === Keyboard.space || e.which === Keyboard.up || e.which === Keyboard.down) {
                this.shiftFocusDown( navbar );
            }
            // esc key
            else if(e.which === Keyboard.esc){
                this.closeAll( navbar );
            }
            // left arrow
            else if(e.which === Keyboard.left){
                this.shiftFocusToPreviousNavbar( navbar );
            }
            // right arrow
            else if(e.which === Keyboard.right){
                this.shiftFocusToNextNavbar( navbar );
            }
        },

        shiftFocusToPreviousNavbar: function(navbar){
            var navbarArray = $(".navbar").not('[tabindex="-1"]'),
                len = navbarArray.length,
                i, prev;

            this.closeAll( navbar );

            i = $(navbarArray).index( navbar );
            prev = ((i-1) < 0)? navbarArray[len-1] : navbarArray[i-1];
            $(prev).focus();

            //Utils.log("shiftFocusToPreviousNavbar()", prev);
            return prev;
        },
        shiftFocusToNextNavbar: function(navbar){
            var navbarArray = $(".navbar").not('[tabindex="-1"]'),
                len = navbarArray.length,
                i, next;

            this.closeAll( navbar );

            i = $(navbarArray).index( navbar );
            next = ((i+1) === len)? navbarArray[0] : navbarArray[i+1];
            $(next).focus();

            //Utils.log("shiftFocusToNextNavbar()", next);
            return next;
        },

        fnHandleNavItemKeyUp: function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            Keyboard = Keyboard || window.SM.accessibility.Keyboard;
            var adjacentNavItem,
                navItem = e.currentTarget,
                numParentNavItems = this.countParentItems(navItem),
                NavigationSelector = this.getCssSelector();

            // enter or space
            if(e.which === Keyboard.enter || e.which === Keyboard.space) {
                this.open( navItem );
            }
            // esc key
            else if(e.which === Keyboard.esc){
                this.shiftFocusUp(navItem);
                this.closeAll( $(navItem).parents(NavigationSelector) );
                if(numParentNavItems === 0){
                    $(navItem).parents(".navbar").focus();
                }
            }
            // left arrow
            else if(e.which === Keyboard.left){
                if(numParentNavItems === 0){
                    this.closeAll( $(navItem).parent() );
                    adjacentNavItem = this.shiftFocusToPrevious(navItem);
                }else{
                    this.closeAll( $(navItem).parent() );
                    adjacentNavItem = this.shiftFocusUp( navItem );
                }
            }
            // up arrow
            else if(e.which === Keyboard.up){
                if(numParentNavItems === 0){
                    adjacentNavItem = this.shiftFocusDown(navItem, true);
                }else{
                    this.close( navItem );
                    if($(navItem).prev('li').length === 0) {
                        adjacentNavItem = this.shiftFocusUp( navItem );
                    }else{
                        adjacentNavItem = this.shiftFocusToPrevious(navItem);  
                    }
                }
            }
            // right arrow
            else if(e.which === Keyboard.right){
                if(numParentNavItems === 0){
                    this.closeAll( $(navItem).parent() );
                    adjacentNavItem = this.shiftFocusToNext(navItem);
                }else{
                    this.closeAll( $(navItem) );
                    adjacentNavItem = this.shiftFocusDown( navItem );
                }
            }
            // down arrow
            else if(e.which === Keyboard.down){
                if(numParentNavItems === 0){
                    adjacentNavItem = this.shiftFocusDown( navItem );
                }else{
                    this.close( navItem );
                    if($(navItem).next('li').length === 0) {
                        adjacentNavItem = this.shiftFocusUp( navItem );
                    }else{
                        adjacentNavItem = this.shiftFocusToNext(navItem);
                    }
                }
            }
            // Move focus to the next instance of a visible node whose title begins with that printable letter. 
            else {
                this.shiftFocusByLetter(e.keyCode, navItem);
            }

            return false;
        },

        shiftFocusToPrevious: function(navItem){
            var $previous;
            if($(navItem).prev('li').length === 0) {
                $previous = $(navItem).parents('ul').find('> li').last();
            } else {
                $previous = $(navItem).prev('li');
            }
            $previous.find('a').first().focus();
            
            return $previous[0];
        },

        shiftFocusToNext: function(navItem){
            var $next;
            if($(navItem).next('li').length === 0) {
                $next = $(navItem).parents('ul').find('> li').first();
            } else {
                $next = $(navItem).next('li');
            }
            $next.find('a').first().focus();

            return $next[0];
        },

        shiftFocusUp: function(navItem){
            var $up = [false];
            if($(navItem).parents('ul').length > 0) {
                $up = $(navItem).parents( 'li.'+this.cssClassOpened ).first();
                $up.find('ul').attr('aria-hidden', 'false');
                $up.find('a').first().focus();
            }
            return $up[0];
        },

        shiftFocusDown: function(navItem, targetLastNavItem){
            //Utils = Utils || window.SM.Utils;
            targetLastNavItem = targetLastNavItem || false;

            var $down = [false];
            if($(navItem).find('ul').length > 0) {
                if(targetLastNavItem){
                    //Utils.log( $(navItem).find('ul').first().children('li') );
                    $down = $(navItem).find('ul').first().children('li').last();
                }else{
                    $down = $(navItem).find('ul').first().find('li').first();
                }
                $(navItem).find('ul').attr('aria-hidden', 'false');
                $down.find('a').first().focus();
            }
            return $down[0];
        },

        // Typing a letter (printable character) key moves focus to the next instance of a visible node whose title begins with that printable letter. 
        shiftFocusByLetter: function(keyCode, navItem){
            Keyboard = Keyboard || window.SM.accessibility.Keyboard;
            $(navItem).find('ul[aria-hidden=false] a').each(function(i, a){
                if($(a).text().substring(0,1).toLowerCase() === Keyboard.getChar( keyCode )) {
                    $(a).focus();
                    return false;
                }
            });
        },

        getCssSelector: function(){
            return (this.cssClass !== null)? "."+this.cssClass : ".navbar";
        }

    };

    //Attach to SM.components
    window.SM = window.SM || {};
    window.SM.Navigation = Navigation;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return Navigation; });
    }

}(jQuery, window.SM.accessibility.Keyboard, window, document));


/*
 * /sm/base/js/dropdown.nav.js
 */
(function($, Utils, Navigation, NavigationEditMode, window, undefined) {
    "use strict";

    var DropdownNav,
        
        animationDuration = 200;


    DropdownNav = {

        name: "Dropdown Navigation",

        cssClass: "navbar-dropdown",

        event: {}, // This gets populated by Navigation.event during "DropdownNav.init()"

        init: function(){
            Utils = Utils || window.SM.Utils;
            Navigation = Navigation || window.SM.Navigation;

            //Utils.log("Initializing "+ this.name);

            // Mixin Navigation methods into Dropdown Nav
            Utils.mixin(this, Navigation);
            if( Utils.getWcmAuthorMode() === "edit" && window.SM.NavigationEditMode !== undefined ){
                Utils.mixin(this, window.SM.NavigationEditMode);
            }

            this.renderUI();
            this.bindUI();
        },

        renderUI: function(){
            
        },

        bindUI: function(){
            // Execute Navigation.superBindUI()
            this.superBindUI();

            // Delegate events for ".navbar-dropdown .nav-item"
            $( this.getCssSelector() ).on({
                "mouseenter": $.proxy(this.fnHandleMouseEnter, this),
                "mouseleave": $.proxy(this.fnHandleMouseLeave, this)
            }, ".nav-item");

            // Initialize editmode event listeners
            if( Utils.getWcmAuthorMode() === "edit" && this.bindEditModeUi !== undefined ){
                this.bindEditModeUi();
            }
        },



        /*
         * Trigger open and close events on hover
         */
        fnHandleMouseEnter: function(e){
            e.stopPropagation();
            var navItem = e.currentTarget,
                $menuTop = $(navItem).parents("."+this.cssClass),
                numParentNavItems = DropdownNav.countParentItems(navItem);
            
            if( numParentNavItems === 0 ){
                DropdownNav.triggerOpenEvent(navItem);
                
                DropdownNav.closeAll($menuTop, navItem);
                $(navItem).addClass( this.cssClassHover );

                DropdownNav.triggerOpenedEvent(navItem);
            }
        },
        fnHandleMouseLeave: function(e){
            e.stopPropagation();
            var navItem = e.currentTarget,
                $menuTop = $(navItem).parents("."+this.cssClass),
                numParentNavItems = DropdownNav.countParentItems(navItem);

            if( numParentNavItems === 0 && !$(navItem).hasClass("clicked") ){
                this.triggerCloseEvent(navItem);

                $(navItem).removeClass( this.cssClassHover );
                DropdownNav.closeAll( $(navItem) ); // Class all sub-branches

                this.triggerClosedEvent(navItem);
            }

            // [APP-78] The javascript mouseout event does not reliably get triggered on the Top-level menu items when users move the mouse away quickly.
            // This was added as 'insurance' to made sure the top menu is always closed when users mouse away
            if( $menuTop.is(":hover") === false ){
                DropdownNav.closeAll($menuTop);
            }
        },






        // Opens a nav item and triggers an open event
        open: function(navItem){
            $(navItem).addClass( this.cssClassOpened ).removeClass( this.cssClassHover );

            //DropdownNav.openNavItemAnimation(navItem);
            this.triggerOpenedEvent(navItem);
        },

        // Closes a nav item and triggers a close event
        close: function(navItem){
            $(navItem).removeClass(this.cssClassOpened +" "+ this.cssClassHover);

            //DropdownNav.closeNavItemAnimation(navItem);
            this.triggerClosedEvent(navItem);
        },

        // Close all child nav-items in this branch
        closeAll: function ($branchContext, navItemToLeaveOpen) {
            var x, l, navItems;
            navItemToLeaveOpen = navItemToLeaveOpen || {}; // Optional param
            if( $branchContext === undefined ){
                $branchContext = $("."+Instance.cssClass +" > .nav");
            }
            navItems = $(".nav-item."+this.cssClassOpened+", .nav-item."+this.cssClassHover, $branchContext).toArray();
            for(x=0, l=navItems.length; x<l; x++){
                if(navItems[x] !== navItemToLeaveOpen /* && navItems[x] does not contain navItemToLeaveOpen */){
                    this.triggerCloseEvent(navItems[x]);
                    this.close(navItems[x]);
                }
            }
        },



        /*
         * Animation Methods
         */
        closeNavItemAnimation: function(navItem) {
            var $menuItem = $(navItem),
                $navItemPanel = $menuItem.find(".nav-item-panel"),
                height = $navItemPanel.height() || 0,
                //offset = 70,
                openedHeight = 0, closedHeight = 0, parentHeight,
                $localNavRelated = $menuItem.find(".local-nav-related"),
                $relatedHeading = $menuItem.find(".related-heading"),
                $relatedContainer = $menuItem.find(".related-container"),
                $parentNavItemPanel = $navItemPanel.parents(".nav-item-panel"),
                $parentNavItem = $navItemPanel.closest(".nav-item"),
                parentNavItemPanelHeight = $parentNavItemPanel.height() || 0;

            if($parentNavItem.length === 1) {
                parentHeight = parentNavItemPanelHeight - height;
                $parentNavItemPanel.animate({"height": parentHeight}, animationDuration);

                $relatedContainer = $parentNavItemPanel.find("> section > .related-container");
                $localNavRelated = $relatedContainer.find("> .local-nav-related");
                $relatedHeading = $relatedContainer.find("> .related-heading");

                closedHeight = parseInt($localNavRelated.attr("data-closed-ht"),10) - height;
                openedHeight = parseInt($localNavRelated.attr("data-opened-ht"),10) - height;

                $localNavRelated.attr("data-closed-ht", closedHeight);
                $localNavRelated.attr("data-opened-ht", openedHeight);

                $relatedHeading.off("click");
                $relatedHeading.click(function(e) {
                    e.stopPropagation();
                    if($relatedContainer.hasClass("is-open")) {
                        $parentNavItemPanel.animate({"height": closedHeight}, animationDuration);
                        $relatedContainer.removeClass("is-open");
                    }
                    else {
                        $parentNavItemPanel.animate({"height": openedHeight}, animationDuration);
                        $relatedContainer.addClass("is-open");
                    }
                });
            }

            this.triggerClosedEvent(navItem);
        },


        /*
         * Sub nav items are positioned absolutely.  This calculates the
         * height of the current sub-nav item and applies it to 'DropdownMenuTop' element
         */
        openNavItemAnimation: function(navItem){
            var $menuItem = $(navItem),
                //$menuTop = $menuItem.parents(DropdownNav.cssClass),
                $navItemPanel = $menuItem.find(".nav-item-panel"),
                height = $navItemPanel.height() || 0,
                openedHeight = 0, closedHeight = 0, parentHeight,
                $localNavRelated = $menuItem.find(".local-nav-related"),
                $relatedHeading = $menuItem.find(".related-heading"),
                $relatedContainer = $menuItem.find(".related-container"),
                $parentNavItemPanel = $navItemPanel.parents(".nav-item-panel"),
                $parentNavItem = $navItemPanel.closest(".nav-item"),
                parentNavItemPanelHeight = $parentNavItemPanel.height() || 0,
                localNavRelatedHeight = $localNavRelated.height() || 0;

            //Utils.log("openNavItem() - increasing height to: "+ height);

            if($localNavRelated.length > 0) {
                if( $localNavRelated.attr("data-closed-ht") !== undefined ){
                    closedHeight = parseInt($localNavRelated.attr("data-closed-ht"),10);
                    openedHeight = parseInt($localNavRelated.attr("data-opened-ht"),10);
                }
                else {
                    closedHeight = height - localNavRelatedHeight - 12;
                    openedHeight = height;
                    $localNavRelated.attr("data-closed-ht", closedHeight);
                    $localNavRelated.attr("data-opened-ht", openedHeight);
                }
                $navItemPanel.height(0);
                $navItemPanel.animate({"height": closedHeight}, animationDuration);
                $relatedHeading.off("click");
                $relatedHeading.click(function(e) {
                    e.stopPropagation();
                    if($relatedContainer.hasClass("is-open")) {
                        $navItemPanel.animate({"height": closedHeight}, animationDuration);
                        $relatedContainer.removeClass("is-open");
                    }
                    else {
                        $navItemPanel.animate({"height": openedHeight}, animationDuration);
                        $relatedContainer.addClass("is-open");
                    }
                });
            }
            else {
                // Increase the height to include the submenu navigation
                $navItemPanel.height(0);
                $navItemPanel.animate({"height": height}, animationDuration);

                if($parentNavItem.length === 1) {
                    parentHeight = parentNavItemPanelHeight + height;
                    $parentNavItemPanel.animate({"height": parentHeight}, animationDuration);

                    $relatedContainer = $parentNavItemPanel.find("> section > .related-container");
                    $localNavRelated = $relatedContainer.find("> .local-nav-related");
                    $relatedHeading = $relatedContainer.find("> .related-heading");

                    closedHeight = parseInt($localNavRelated.attr("data-closed-ht"),10) + height;
                    openedHeight = parseInt($localNavRelated.attr("data-opened-ht"),10) + height;

                    $localNavRelated.attr("data-closed-ht", closedHeight);
                    $localNavRelated.attr("data-opened-ht", openedHeight);

                    $relatedHeading.off("click");
                    $relatedHeading.click(function(e) {
                        e.stopPropagation();
                        if($relatedContainer.hasClass("is-open")) {
                            $parentNavItemPanel.animate({"height": closedHeight}, animationDuration);
                            $relatedContainer.removeClass("is-open");
                        }
                        else {
                            $parentNavItemPanel.animate({"height": openedHeight}, animationDuration);
                            $relatedContainer.addClass("is-open");
                        }
                    });
                }
            }

            //$menuTop.animate({"height": offset + height}, animationDuration);

            //$menuTop.bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
            //    $(document).trigger( MobileNavigationPanel.event.updateMaincontentHeight );
            //});

            this.triggerOpenedEvent(navItem);

            //$menuTop.trigger(DropdownNav.event.opened, {"navItem" : this});
            //$(document).trigger( this.event.updateMaincontentHeight );
        }

    };

    //Attach to SM.components
    window.SM = window.SM || {};
    window.SM.DropdownNav = DropdownNav;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return DropdownNav; });
    }

}(
    jQuery, 
    window.SM.Utils, 
    window.SM.Navigation, 
    window.SM.NavigationEditMode, 
    window
));

/*
 * /sm/base/js/accordion.nav.js
 */
(function($, Utils, Navigation, NavigationEditMode, window, document, undefined) {
    "use strict";
         
    var AccordionNav,

        ANIMATION_DURATION = 100;

    
    AccordionNav = {

        name: "Accordion Navigation",

        cssClass: "navbar-accordion",

        init: function(){
            Utils = Utils || window.SM.Utils;
            Navigation = Navigation || window.SM.Navigation;

            //Utils.log("Initializing "+ this.name);
            
            // Mixin Navigation methods into Mobile Nav
            Utils.mixin(this, Navigation);
            if( Utils.getWcmAuthorMode() === "edit" && window.SM.NavigationEditMode !== undefined ){
                Utils.mixin(this, window.SM.NavigationEditMode);
            }
            
            this.renderUI();
            this.bindUI();
        },

        renderUI: function(){
            var NavigationSelector = this.getCssSelector(), 
                anchorSelector = NavigationSelector+" .nav a:not(.search-button)",
                subNavClass = $(NavigationSelector).find(".nav-item-panel").length===0? "navbar-nav" : "nav-item-panel";

            // This attribute gets defined in Navigation Mixin
            this.navItemsToLeaveOpen.push( $(NavigationSelector).find(".nav-item.search")[0] );
            
            // Hide sub levels
            $(anchorSelector+" + ."+subNavClass).hide();

            $(anchorSelector+" .nav a:not(.search-button)").addClass("collapsed");

            // Show current page's sub level nav
            $(anchorSelector+".active").siblings("."+subNavClass).show();
            $(anchorSelector+".active").parents("."+subNavClass).show();
            $(anchorSelector+".active").parents(".nav-item").addClass( this.cssClassOpened );
            $(anchorSelector+".active").parents("."+subNavClass).siblings("a").removeClass("collapsed");
            $(anchorSelector+".active").removeClass("collapsed");
        },

        bindUI: function() {
            this.superBindUI();

            // Initialize editmode event listeners
            if( Utils.getWcmAuthorMode() === "edit" && this.bindEditModeUi !== undefined ){
                this.bindEditModeUi();
            }
        },


        /*
         * Methods redefined from Navigation Mixin
         */

        // Opens a nav item and triggers an open event
        open: function(navItem){
            var Instance = this,
                subNavClass = $(navItem).children("ul").length>0? "navbar-nav" : "nav-item-panel";

            $(navItem).addClass( this.cssClassOpened ).removeClass( this.cssClassHover );
            
            // Setup Animation
            $("> ."+subNavClass, navItem).slideDown(ANIMATION_DURATION, function(){
                // trigger open-finished event
                Instance.triggerOpenedEvent(navItem);
            });

            $("> a", navItem).removeClass("collapsed");
        },

        // Closes a nav item and triggers a close event
        close: function(navItem){
            var Instance = this,
                subNavClass = $(navItem).children("ul").length>0? "navbar-nav" : "nav-item-panel";

            $(navItem).removeClass(this.cssClassOpened +" "+ this.cssClassHover);
            
            // Setup Animation
            $("> ."+subNavClass, navItem).slideUp(ANIMATION_DURATION, function(){
                // trigger close-finished event
                Instance.triggerClosedEvent(navItem);
            });

            $("> a", navItem).addClass("collapsed");
        }

    };

    window.SM = window.SM || {};
    window.SM.AccordionNav = AccordionNav;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return AccordionNav; });
    }

}(
    jQuery,
    window.SM.Utils, 
    window.SM.Navigation,
    window.SM.NavigationEditMode,
    window, 
    document
));
