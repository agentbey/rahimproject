
/*
 * /sm/base/js/global.footer.js
 */
(function($, Utils, WindowResizeEnd, MobileNavigationPanel, window, document, undefined) {
    "use strict";

    var GlobalFooter = {

        init: function(){
            Utils = Utils || window.SM.Utils;
            MobileNavigationPanel = MobileNavigationPanel || window.SM.MobileNavigationPanel;
            WindowResizeEnd = WindowResizeEnd || window.SM.WindowResizeEnd;

            this.renderUI();
            this.bindUI();
        },

        renderUI: function(){
            // Push the footer down on page load
            this.pushFooter();
        },

        bindUI: function(){
            var offset = 220,
                fadeDuration = 450,
                scrollDuration = 300;

            // Go To Top link
            $(window).scroll(function() {
                if ($(this).scrollTop() > offset) {
                    $("#backToTop").fadeIn(fadeDuration);
                } else {
                    $("#backToTop").fadeOut(fadeDuration);
                }
            });

            $("#backToTop").click(function(event) {
                event.preventDefault();
                $("html, body").animate({scrollTop: 0}, scrollDuration);
                return false;
            });

            // Adjust amount on window resize
            $(document).bind(WindowResizeEnd.event, function(){
                GlobalFooter.pushFooter();
            });

            //Resize the footer when the mobile nav is opened
            $(document).bind(MobileNavigationPanel.event.navOpened, function(){
                GlobalFooter.pushFooter();
            });

            $(document).bind(MobileNavigationPanel.event.navClosed, function(){
                GlobalFooter.pushFooter();
            });
        },

        /*
         * Set bottom margin on #outerContainer based on #footer height to push
         * the footer below all content
         */
        pushFooter: function () {
            //Utils.log("pushFooter()");
            var height = $("#footer").height() + 12; // 12px margin.

            if( !MobileNavigationPanel.enabled() ){
                $("#outerContainer").css("padding-bottom", height + "px");
                // TODO: need to add additional login to handle he olympus layout
            }else{
                $("#outerContainer").css("padding-bottom", "");
            }
        }
    };

    window.SM = window.SM || {};
    window.SM.GlobalFooter = GlobalFooter;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return GlobalFooter; });
    }
        

}(
    jQuery, 
    window.SM.Utils, 
    window.SM.WindowResizeEnd, 
    window.SM.MobileNavigationPanel,
    window, 
    document
));
$(document).ready(function() {
    initDropDowns();
    applyErrorStyling();

    $('form').on('reset', function() {
        var selects = $(this).find('select');
        $(selects).each(function() {
            var select = $(this);
            setTimeout(function() {
                updateSelected(select);
            }, 100);
        });

    });

    $(window).resize(function() {
        $('.dropdown').each(function() {
            var dropdown = $(this);
            updateMiddleWidth(dropdown);
        });
    });

    $('input[type=submit]').each(function(){
        var submitButton = $(this);
        $(submitButton).wrap("<button class='submit-btn'></button>");
        $(submitButton).parent().click(function(event){
            var form = $(this).parents('form');
            form.submit();
        });
    });
});

function initDropDown(dropdown) {

    var select = dropdown.find('select');

    // If the select has been set to be multi don't do the special styling.
    if(select.attr('multiple') === 'multiple'){
        dropdown.addClass('multiple');
        dropdown.removeClass('dropdown');
        return;
    }

    var middleSpan = dropdown.find('.form_rightcol span.middle');
    var textSpan = dropdown.find('.form_rightcol span.text');

    if(textSpan.length === 0){
        var selectedText = select.find('option:selected').text();
        $('<span class="text">' + selectedText + '</span>').insertBefore(select);
    }

    if(middleSpan.length === 0){
        $('<span class="middle">&nbsp;</span>').insertBefore(select);
    }

    $(select).change(function() {
        updateSelected(this);
    });
    $(select).focusin(function() {
        $(this).parent('.form_rightcol').addClass('focus');
    });
    $(select).focusout(function() {
        $(this).parent('.form_rightcol').removeClass('focus');
    });
    updateMiddleWidth(dropdown);
}

function applyErrorStyling(){
    //apply error-wrapper styling to forms with error
    if ($('div.form_error').length){
        $('div.form_error').each(function () {
            $(this).closest('.section').addClass('error-wrapper');
        });
    }
    //repeat error message above submit
    if ($('p.form_error').length){
        $('p.form_error').each(function () {
            $(this).closest('form').find('.submit.section').prepend($(this).clone().addClass('simple'));
        });
    }

    //remove extra unused space, targeting rendering of errors, CQ problem fix
    $('.form_leftcol').each(function(){
        var $this = $(this);
        if (
          $this.find('.form_leftcollabel span').html() == "&nbsp;" &&
          $this.find('.form_leftcolmark').html() == "&nbsp;"
        ){
            $this.remove();
        }
    });

}

function updateSelected(select) {
    var selectedText = $(select).find('option:selected').text();
    $(select).parent('div').find('span.text').text(selectedText);
}

function updateMiddleWidth(dropdown) {
    var dropdownWidth = dropdown.width();
    var middleWidth = dropdownWidth - 500;
    var middleSpan = dropdown.find('.middle');
    if (middleWidth < 0) {
        $(middleSpan).css("background", "none");
        $(middleSpan).css("width", "auto");
    } else {
        $(middleSpan).width(middleWidth+1);
        $(middleSpan).css("background", "");
    }
}

function initDropDowns() {
    $('.dropdown').each(function() {
        var dropdown = $(this);
        initDropDown(dropdown);

    });

    $('.form_address_country').each(function() {
        var countrySelect = $(this);
        var dropdown = $(countrySelect).parents('.form_row');
        $(dropdown).wrap("<div class='dropdown'></div>");
        var description = $(dropdown).find('.form_row_description');
        $(description).insertBefore(dropdown);
        initDropDown(dropdown);
    });
}
$(window).load(function(){
    if(!CQ || !CQ.WCM){
        $.each($("form"),function(){
        this.action=this.action && this.action.replace("/content/sm","");
        },this);
    }});

/*
 * /sm/base/js/print.js
 */
(function($, window, document, undefined) {
    "use strict";

    var PrintPrep = {
        init: function(){
            this.renderUI();
        },

        renderUI: function(){
            //dom manipulation for printing goes here
        }
    };

    window.SM = window.SM || {};
    window.SM.PrintPrep = PrintPrep;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return PrintPrep; });
    }


}(
  jQuery,
  window,
  document
));

/*
 * /sm/base/js/main.js
 */
(function($, Utils, WindowResizeEnd, GlobalNav, MobileNavigationPanel, Dropdown, AccordionNav, GlobalFooter, PrintPrep, window, document) {
    "use strict";

    var Base = {
        init: function(){
            Utils = Utils || window.SM.Utils;
            GlobalNav = GlobalNav || window.SM.components.GlobalNav;
            MobileNavigationPanel = MobileNavigationPanel || window.SM.MobileNavigationPanel;
            Dropdown = Dropdown || window.SM.DropdownNav;
            AccordionNav = AccordionNav || window.SM.AccordionNav;
            GlobalFooter = GlobalFooter || window.SM.GlobalFooter;
            WindowResizeEnd = WindowResizeEnd || window.SM.WindowResizeEnd;
            PrintPrep = PrintPrep || window.SM.PrintPrep;

            //Utils.log("Base.init()");
            this.renderUi();
            this.bindUi();
        },

        renderUi: function(){
            //Utils.log("Base.renderUi()");
            
            /*
             * Create a copy of the local-nav for mobile
             */
            Utils.cloneLocalNavigation();
            // Remove dropdown functionality and replace with mobile nav 
            $(".header-global .navbar-local").removeClass( Dropdown.cssClass ).addClass(AccordionNav.cssClass +" navbar-mobile");
            
            // Initialize the navigation elements
            Dropdown.init();
            AccordionNav.init();
            
            // Initialize the nav containers
            GlobalNav.init();
            MobileNavigationPanel.init();
            GlobalFooter.init();
			
            // Initialize print preparation
            PrintPrep.init();

            //find featured headlines and apply correct bg
            if ($('.feature h1, .feature h2, .feature h3').length) {
                var featuredHeadlines = $('.feature h1, .feature h2, .feature h3');
                featuredHeadlines.each(function() {
                    var $outerThis = $(this);
                    $outerThis.parents().each(function() {
                        var $this = $(this);
                        //if parent container has a background, apply that color
                        if (($this.css('background-color') != 'rgba(0, 0, 0, 0)') && ($this.css('background-color') != 'transparent'))  {
                            $outerThis.css('background-color', $this.css('background-color'));
                            return false;
                        }
                        //if parent container has class "color-row" find the :before and use that background-color
                        if ($this.hasClass('color-row')){
                            $outerThis.css('background-color', window.getComputedStyle(
                              $this.get(0), ':before'
                            ).getPropertyValue('background-color'));
                            return false;
                        }
                    });
                });
            }
        },

        bindUi: function(){

            // Uncomment to test onResizeEnd event
            //$(window).on(WindowResizeEnd.event, function(){ Utils.log(WindowResizeEnd.event); });

            $("a[href=#mainContent]").on("click", $.proxy(this.applyFocusMainContent, this));
            $("a[href=#navigationLocal]").on("click", $.proxy(this.applyFocusToLocalNav, this));
            $("a[href=#navigationGlobal]").on("click", $.proxy(this.applyFocusToGlobalNav, this));
        },


        applyFocusMainContent: function(event){
            event.preventDefault();
            $("#mainContent").focus();
        },

        applyFocusToLocalNav: function(event){
            event.preventDefault();
            if( $(window).width() < Utils.BREAKPOINT_DESKTOP ){
                MobileNavigationPanel.openNavigation();
                $(".header-global .navbar-local:first > .nav > .nav-item > a:first").focus();
            }else{
                $(".navbar-local:first > .nav > .nav-item > a:first").focus();
            }
        },

        applyFocusToGlobalNav: function(event){
            event.preventDefault();
            if( $(window).width() < Utils.BREAKPOINT_DESKTOP ){
                MobileNavigationPanel.openNavigation();
                $(".header-global .navbar-global:first > .nav > .nav-item > a:first").focus();
            }else{
                $(".navbar-global:first > .nav > .nav-item > a:first").focus();
            }
        }
    };

    window.SM = window.SM || {};
    window.SM.Base = Base;

    // Auto-Initialize...
    $(document).ready(function(){
        Base.init();
    });


}(
    jQuery,
    window.SM.Utils,
    window.SM.WindowResizeEnd,
    window.SM.components.GlobalNav,
    window.SM.MobileNavigationPanel,
    window.SM.DropdownNav,
    window.SM.AccordionNav,
    window.SM.GlobalFooter,
    window.SM.PrintPrep,
    window, 
    document
));
/*
 * /sm/base/js/component-initializer.js
 *
 * Example code in Component JSP:
 *   <script>
 *
 *     window._q.push(function(){
 *       window.SM.components.MyComponent.init("Hello World");
 *     });
 *
 *   </script>
 *
 * Example Component JavaScript:
 *   (function($) {
 *      $.extend(SM.components,{
 *
 *        MyComponent: {
 *           init: function(greeting){
 *           alert(greeting);
 *         }
 *       }
 *
 *     });
 *   }(jQuery));
 *
 * Originally sourced from:
 * - http://www.crownpartners.com/blog/avoid-paying-jquery-tax-adobe-cq
 */
(function($, Utils, window, document, undefined) {
    "use strict";

    $(document).ready(function() {
        Utils = Utils || window.SM.Utils;
        
        if( window.init !== undefined ){
            $.each(window.init.a, function(index,initFunction){
                initFunction();
            });
        }else{
            Utils.log("component-initializer skipped - window.init is undefined.");
        }
    });

}(jQuery, window.SM.Utils, window, document));
