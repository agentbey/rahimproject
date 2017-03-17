
(function($, CQ, lodash, window, document, undefined){
    "use strict";
         
    /* Generic Utility Methods */
    var Utils = {

        BREAKPOINT_PHONE: 479,

        BREAKPOINT_TABLET: 768,

        BREAKPOINT_DESKTOP: 992,

        BREAKPOINT_LARGE: 1200,

        // Outputs to console.log if available
        log: function(msg) {
            if( window.console !== undefined && console.log !== undefined){
                if(typeof console.log.apply === "function"){
                    console.log.apply(console, arguments);
                }else{
                    console.log(msg);
                }
            }
        },

        isEmpty: function(value){
            var i, len, is = false,
                emptyValues = [undefined, null, false, 0, '', '0'];
            for (i = 0, len = emptyValues.length; i < len; i++) {
                if (value === emptyValues[i]) {
                    is = true;
                }
            }
            return is;
        },

        substitute: function(token, jsonReplace) {
            return token.replace(/\{\{(.+?)\}\}/g, function(val, key) {
                return jsonReplace.hasOwnProperty(key) ? jsonReplace[key] : val;
            });
        },

        escapeHtml: function(str) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        },

        // Generate a unique ID
        createUniqueId: function(prefix, suffix) {
            prefix = prefix || "";
            suffix = suffix || "";
            return prefix + Math.round(new Date().getTime() + (Math.random() * 100)) + suffix;
        },

        // Detect if event is above the fold
        isElementInViewport: function(el) {
            var rect;
            el = (el instanceof $)? el[0] : el; //Accomodate jQuery elements
            rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
            );
        },

        
        /*
         * Create a copy of the local-nav for mobile
         */
        cloneLocalNavigation: function(){
            if( $(".header-global .navbar-local").length === 0 ){                
                var localNav = $("#navigationLocal.navbar-local")[0];
                $(localNav).clone(true, true).attr("id", "").prependTo(".header-global");
            }
        },

        /*
         * Expose to keyboard tab navigation and attempt to restore tabindex value
         */
        revealToKeyboard: function(element){
            var tabIndex = $(element).data("tabindex") || undefined;
            if( tabIndex === undefined || tabIndex === null || isNaN(parseFloat(tabIndex))  ){
                tabIndex = 0;
            }
            $(element).attr("tabindex", tabIndex);
            return element;
        },

        /*
         * Hide from keyboard tab navigation and save original tabindex value
         */
        hideFromKeyboard: function(element){
            var tabIndex = $(element).attr("tabindex") || undefined;
            if( tabIndex === undefined || tabIndex === null || isNaN(parseFloat(tabIndex))  ){
                tabIndex = 0;
            }

            if( $(element).data("tabindex") === undefined ){
                $(element).data("tabindex", tabIndex);
            }
            
            $(element).attr("tabindex", "-1");
            return element;
        },

        // Identify current WCM mode
        getWcmAuthorMode: function(){
            CQ = CQ || window.CQ;
            var mode = false;
            
            if( CQ !== undefined && CQ.WCM !== undefined ){
                if(CQ.WCM.isEditMode(true)){
                    mode = "edit";
                }else if(CQ.WCM.isDesignMode(true)){
                    mode = "design";
                }else if(CQ.WCM.isPreviewMode(true)){
                    mode = "preview";
                }
            }
            return mode;
        },


        // Custom mixin that does not overwrite existing fucntions on the target
        mixin: function(target, source){
            var attr,
                args = Array.prototype.slice.apply(arguments);
            target = args.shift();
            source = args.shift();

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !$.isFunction(target) ) {
                target = {};
            }
            
            // Extend the base object
            if(typeof source === 'object' && source !== null){
                for( attr in source ){
                    if( source.hasOwnProperty(attr) ){
                        // Prevent never-ending loop
                        if ( target === source[ attr ] ) {
                            continue;
                        }

                        // Apply souce functions to target without overwriting exisiting
                        if( $.isFunction(source[attr]) ){
                            if( target[attr] === undefined ){
                                target[attr] = source[attr];
                            }else{
                                // skip... 
                                //target[attr] = target[attr];    
                            }
                        }
                        // Else deep extend objects
                        else if(typeof source[attr] === 'object' && !$.isArray(source[attr])){
                            if(target[attr] === undefined){
                                target[attr] = {};
                            }
                            target[attr] = lodash.defaults(target[attr], source[attr]);
                        }
                        else{
                            target[attr] = source[attr];
                        }
                    }
                }
            }
            return target;
        },

        moreSectionSlideToggle: function(element) {
            var toggleConfig = {
                duration: 400
            };

            $(element).slideToggle(toggleConfig.duration);

            $(element).toggleClass("st-expanded");
        }

    };

    window.SM = window.SM || {};
    window.SM.Utils = Utils;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return Utils; });
    }
    
}(window.jQuery, window.CQ, window._, window, document));
