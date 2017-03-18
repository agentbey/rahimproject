
var RTECollapse = {
    init: function(nodeId) {

        if (nodeId) {

            // Click more event handler
            $('#' + nodeId + ' .collapse-link.more').click(function(event) {
                event.preventDefault();
                RTECollapse.toggleText(nodeId);
                $('#' + nodeId + ' .collapse-link.more').hide(0);
            });

            // Click less event handler
            $('#' + nodeId + ' .collapse-link.less').click(function(event) {
                event.preventDefault();
                RTECollapse.toggleText(nodeId, function() {
                    $('#' + nodeId + ' .collapse-link.more').show();
                    $('#' + nodeId + ' .collapse-link.more').css("display", "inline");
                });

            });

            var moreLink = $('#' + nodeId + ' a.collapse-link.more');
            if (moreLink.length > 0) {
                var moreParent = $(moreLink).parent();

                // Determine context.
                var alone = $(moreParent).html().indexOf("<a class=\"collapse-link more") === 0;

                // If mid paragraph
                if (!alone) {

                    var addEllips = RTECollapse.addEllips($(moreParent));

                    // Hide everything after moreLink
                    RTECollapse.wrapRestOfParagraph(moreLink);

                    $("#" + nodeId + " span.collapse-text").wrapAll('<span class="collapse-text-toggle"></span>');

                    // Wrap more link and add ellipis and <br/>
                    $(moreLink).wrap("<span class='collapse-link more'></span>");

                    if (addEllips) {
                        $(moreLink).before("&hellip;<br/>");
                    } else {
                        $(moreLink).before("<br/>");
                    }

                    // If in own <p>
                } else {
                    $(moreParent).addClass("collapse-link more");
                }

                RTECollapse.setClassOnP(nodeId);
                $('#' + nodeId + ' .collapse-text:not(span)').wrapAll("<div class=\"collapse-text-toggle\"</div>");
                RTECollapse.toggleText(nodeId, 0);
            }
             // Remove added font styles
            $('#' + nodeId + ' span, #' + nodeId + ' a').each(function(){
               $(this).css("font-family", "");
               $(this).css("font-size", "");
            });
        }
    },
    wrapRestOfParagraph: function(element) {

        var nextSibling = RTECollapse.getNextSibling(element);

        if (nextSibling) {
            if (nextSibling.nodeType === 3 || nextSibling.nodeType === 1) {
                $(nextSibling).wrap("<span class=\"collapse-text\"></span>");

            } else if (nextSibling.nodeName !== "SPAN") {
                $(nextSibling).wrap("<span class=\"collapse-text\"></span>");
            }
            nextSibling = $(nextSibling).parent();
            RTECollapse.wrapRestOfParagraph(nextSibling);
        }
    },
    setClassOnP: function(nodeId) {
        var ptags = $('#' + nodeId + ' > *');
        var hide = false;
        $.each(ptags, function(index, value) {
            var html = value.innerHTML;
            if (hide) {
                $(value).addClass("collapse-text");
            }
            if (html.toLowerCase().indexOf("collapse-link more") >= 0) {
                hide = true;
            }
        });
    },
    toggleText: function(nodeId, duration, complete) {
        if (!duration && duration !== 0) {
            duration = 400;
        }
        $('#' + nodeId + ' .collapse-text-toggle').slideToggle(duration, complete);
        var spanToggle = $('#' + nodeId + ' span.collapse-text-toggle');
        if ($(spanToggle).css("display") !== 'none') {
            $(spanToggle).css("display", "inline");
        }
    },
    getNextSibling: function(element) {
        if (element[0]) {
            return element[0].nextSibling;
        } else {
            return element.nextSibling;
        }
    },
    addEllips: function(moreParent) {

        $(moreParent).children('span').each(function(){
           $(this).contents().unwrap();
        });

        var parentHtml = moreParent.html();
        var indexOfMoreLink = parentHtml.indexOf("<a class=\"collapse-link more\"");
        var charBefore = parentHtml.charAt(indexOfMoreLink - 1);

        if (charBefore === ';') {
            charBefore = parentHtml.charAt(indexOfMoreLink - 7);
        }
        
        var addEllips = (charBefore != '.');

        return addEllips;
    }
};

window.SM = window.SM || {};
window.SM.components.RTECollapse = RTECollapse;

if( typeof window.define === 'function' && window.define.amd ){
    window.define(function () { return RTECollapse; });
}

