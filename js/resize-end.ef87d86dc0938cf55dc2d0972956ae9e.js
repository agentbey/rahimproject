
(function($, window, document){
    "use strict";
         
    var WindowResizeEnd,

        /* 
         * NOTE: Tweak this value to ensure the "resize end" event fires only once
         */
        milliseconds = 200;

    

    WindowResizeEnd = {

        event:  "event-window-resize-end",
        
        threshold: milliseconds,

        resizeTimeout: null,

        timesFired: 0,


        init: function(){
            $(window).on("resize", this.detect);

            // Prevent other DOM related resize events from bubbling up
            $(document).on("resize", function(event){
                event.stopImmediatePropagation();
            });
        },

        /*
         * Trigger a custom event when the window has finished resizing
         */
        detect: function(event) {
            var me = WindowResizeEnd;
            //console.log(arguments);

            if ( me.resizeTimeout ) {
                clearTimeout( me.resizeTimeout );
                me.resizeTimeout = null;
            }                
            me.resizeTimeout = setTimeout(me.trigger, me.threshold);
        },

        trigger: function(){
            var me = WindowResizeEnd;
            me.timesFired++;

            $(document).trigger(me.event, me.timesFired);
            $(document).trigger("debouncedresize", me.timesFired);
        }
    };

    window.SM = window.SM || {};
    window.SM.WindowResizeEnd = WindowResizeEnd;

    if( typeof window.define === 'function' && window.define.amd ){
        window.define(function () { return WindowResizeEnd; });
    }

    // Auto-Initialize...
    $(document).ready(function(){
        WindowResizeEnd.init();
    });
    
}(jQuery, window, document));
