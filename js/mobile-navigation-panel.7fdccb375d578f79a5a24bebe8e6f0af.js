
/*
 * /sm/base/js/mobile.nav.js
 */
(function($, Utils, WindowResizeEnd, window, document, undefined) {
    "use strict";
         
    var MobileNavigationPanel,

        ANIMATION_DURATION = 100;

    
    MobileNavigationPanel = {

        name: "Mobile Navigation",

        cssEnabled: "slide-right",

        contentHeight: null,

        event:  {
            init: "event-mobile-nav-init",
            navOpened: "event-mobile-nav-opened",
            navClosed: "event-mobile-nav-closed",
            updateMaincontentHeight: "event-update-maincontent-height"
        },

        init: function(){
            Utils = Utils || window.SM.Utils;
            WindowResizeEnd = WindowResizeEnd || window.SM.WindowResizeEnd;

            //Utils.log("Initializing "+ this.name);
            
            this.renderUI();
            this.bindUI();
        },

        renderUI: function(){
            this.resetMobileNavigation();
        },

        bindUI: function() {
            var Instance = this;

            /*
             * Enable swipe to close on mobile navigation
             */
            if($('.royalSlider').length === 0 && $('#mcd-hospital').length === 0 && $('#mcd-hospital-mobile').length === 0) {
                if ($(window).width() < Utils.BREAKPOINT_DESKTOP && Utils.getWcmAuthorMode() !== "edit") {
                    $("body").swipe({
                        swipeLeft: function(event, direction, distance, duration, fingerCount) {
                            Instance.toggleNavigation();
                            //Instance.openNavigation();
                        },
                        swipeRight: function(event, direction, distance, duration, fingerCount) {
                            Instance.closeNavigation();
                        }
                    });
                }
            }

            // Toggle the mobile nav when the 'Hamburger' button is clicked
            $(".header-local button.navbar-toggle").click($.proxy(this.fnHandleToggleNavigation, this));

            // Close the mobile nav when the white space is clicked
            $(".header-global").click($.proxy(this.fnHandleWhitespaceClick, this));

            // Stop click event from propagating to '.header-global'
            $(".header-global > .navbar").click($.proxy(this.fnHandleNavbarClick, this));

            // Close mobile nav when window is resized to Desktop
            $(document).on(WindowResizeEnd.event, $.proxy(this.fnHandleWindowResize, this));


            $(document).on(this.event.updateMaincontentHeight, $.proxy(this.setContentHeight, this));

            // Trigger init event for any items waiting to init themselves for mobile nav
            $(document).trigger( this.event.init );

            // Manage focus when user tabs away from the Mobile Nav search box
            $("."+this.cssEnabled+" form[role=search] input[name=q]").on("blur", $.proxy(this.fnHandleSearchblur, this));
        },


        /*
         * Toggle the mobile nav when the 'Hamburger' button is clicked
         */
        fnHandleToggleNavigation: function(event) {
            //Utils.log("button.navbar-toggle clicked!!!");
            event.preventDefault();
            if( !this.enabled() ){
                this.openNavigation();
            }else{
                this.closeNavigation();
                $(window).scrollTop(0);
            }
        },

        /*
         * Close the mobile nav when the white space is clicked
         */
        fnHandleWhitespaceClick: function(event) {
            if (this.enabled()) {
                event.preventDefault();
                if ( $(document).width() <= Utils.BREAKPOINT_TABLET) {
                    this.closeNavigation();
                }
            }
        },

        /*
         * Stop click event on '.navbar' from propagating to '.header-global'
         */
        fnHandleNavbarClick: function(event) {
            if (this.enabled()) {
                event.stopPropagation();
            }
        },

        /*
         * Close mobile nav when window is resized to Desktop
         */
        fnHandleWindowResize: function(event, numTimesResizeHasFired){
            
            // Fix to stop mobile menu from closing after it is opened when the page first loads
            if( (this.enabled() && $(window).width() >= Utils.BREAKPOINT_DESKTOP) && numTimesResizeHasFired > 1){
                this.closeNavigation();
            }

            if ($(document).width() < Utils.BREAKPOINT_DESKTOP) {
                Utils.hideFromKeyboard($("#navigationLocal.navbar-local")[0]);
                Utils.revealToKeyboard($(".header-global .navbar-local")[0]);
            }else{
                Utils.revealToKeyboard($("#navigationLocal.navbar-local")[0]);
                Utils.hideFromKeyboard($(".header-global .navbar-local")[0]);
            }
        },

        /*
         * Manage focus when user tabs away from the Mobile Nav search box
         */
        fnHandleSearchblur: function(event){
            Utils.log("MobileNavigationPanel.fnHandleSearchblur()");
            $(".header-global .navbar-local > .nav").focus()
        },





        /*
         * Helper Functions
         */
        enabled: function() {
            return $('body').hasClass( this.cssEnabled );
        },

        /*
         * Hide the mobile nav layout
         */
        closeNavigation: function() {
            //Utils.log("closeMobileNavPanel()");
            this.removeMainContentRightSpacing();
            $('body').removeClass( this.cssEnabled );
            $("#mainContent").css("height", "");
            this.resetMobileNavigation();
            
            $(document).trigger( this.event.navClosed );

            // Remove focus from mobile-nav
            $("#mainContent").focus();
        },

        /*
         * Show the mobile nav layout
         */
        openNavigation: function() {
            this.adjustMainContentRight();
            $('body').addClass( this.cssEnabled );
            this.setContentHeight();
            this.resetMobileNavigation();

            $(document).trigger( this.event.navOpened );
        },

        /*
         * Adjust spacing on the right of the main content element to allow Color Row background to
         * stretch full-width.
        */

        adjustMainContentRight: function() {
            if($(".color-row").length > 0) {
                var calculatedPadding = parseFloat($("#mainContent").css("margin-right").replace("px", ""));
                calculatedPadding += parseFloat($("#mainContent").css("padding-right").replace("px", ""));
                $("#mainContent").css("margin-right", "0");
                $("#mainContent").css("padding-right", calculatedPadding + "px");
            }
        },

        /*
         * Remove adjusted spacing to the right of main content element.
        */

        removeMainContentRightSpacing: function() {
            if($(".color-row").length > 0) {
                $("#mainContent").css("margin-right", "");
                $("#mainContent").css("padding-right", "");
            }
        },

        /*
         * Toggle the mobile nav layout
         */
        toggleNavigation: function(){
            if( this.enabled() ){
                this.closeNavigation();
            }else{
                this.openNavigation();
            }
        },

        resetMobileNavigation: function(){
            //$("."+this.cssClass).each(function(i, nav){
            //    $(nav).data("height", $(nav).height());
            //});
        },

        setContentHeight: function (){
            var height,
                offset = 70, 
                headerLocalHeight = $("#outerContainer .header-local").outerHeight(), 
                headerGlobalHeight = $("#outerContainer .header-global").outerHeight(), 
                headerHeight = headerGlobalHeight - headerLocalHeight, 
                viewportHeight = $(window).height() - headerLocalHeight;

            // Calculate the largest possible height
            this.contentHeight = Math.max(headerHeight, viewportHeight, this.contentHeight);

            $("#mainContent").css("height", this.contentHeight + offset);
        }

    };

    window.SM = window.SM || {};
    window.SM.MobileNavigationPanel = MobileNavigationPanel;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return MobileNavigationPanel; });
    }

}(
    jQuery,
    window.SM.Utils, 
    window.SM.WindowResizeEnd,
    window, 
    document
));
