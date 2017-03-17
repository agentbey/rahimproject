/**
 * Plugin: jquery.zRSSFeed
 * 
 * Version: 1.1.4 (custom)
 * (c) Copyright 2010-2011, Zazar Ltd
 * 
 * Description: jQuery plugin for display of RSS feeds via Google Feed API
 *              (Based on original plugin jGFeed by jQuery HowTo. Filesize function by Cary Dunn.)
 * 
 * History:
 * 1.1.4 - Modified to meet markup needs (Mark Trenchard - Stanford University)
 * 1.1.3 - Added Filters on feeds (Ron Santos - Simon Fraser University)
 * 1.1.2 - Added user callback function due to issue with ajaxStop after jQuery 1.4.2
 * 1.1.1 - Correction to null xml entries and support for media with jQuery < 1.5
 * 1.1.0 - Added support for media in enclosure tags
 * 1.0.3 - Added feed link target
 * 1.0.2 - Fixed issue with GET parameters (Seb Dangerfield) and SSL option
 * 1.0.1 - Corrected issue with multiple instances
 * 
 **/

(function($){

    $.fn.rssfeed = function(url, options, fn) { 
    
        // Set pluign defaults
        var defaults = {
            header: true,
            titletag: 'h3',
            date: true,
            content: true,
            snippet: true,
            showerror: true,
            errormsg: '',
            key: null,
            ssl: false,
            linktarget: '_self',
            displayLimit: 10,
            filterAction1: '',
            filterField1: '',
            filterValue1: '',
            filterAction2: '',
            filterField2: '',
            filterValue2: '',
            filterAction3: '',
            filterField3: '',
            filterValue3: '', 
            windowWidth: 0,    
            windowHeight: 0                        
        };  
        var options = $.extend(defaults, options); 
        
        // Functions
        return this.each(function(i, e) {
            var $e = $(e);
            //var s = '';
            
            // Check for SSL protocol
            //if (options.ssl) s = 's';
            
            // Add feed class to user div
            if (!$e.hasClass('rssFeed')) $e.addClass('rssFeed');
            if (options.snippet) $e.addClass('snippet');
            if (options.content) $e.addClass('full');
            
            // Check for valid url
            if(url == null) return false;

            // Create Google Feed API address
            var api=   "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20'"+encodeURIComponent(url)+"'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
            //var api = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&num=-1&q=" + encodeURIComponent(url);
            //var api = "http"+ s +"://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&num=-1&q=" + encodeURIComponent(url);
            //var api = "http"+ s +"://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=" + encodeURIComponent(url);
            //if (options.limit != null) api += "&num=" + options.limit;
            if (options.key != null) api += "&key=" + options.key;
            api += "&output=json_xml"

            // Send request
           $.getJSON(api, function(data){
                // Check for error
                if (data.query.count>0) {
                    var fdata =  data.query.results.rss || data.query.results.feed
                    // Process the feeds
                    _process(e, fdata, options);
                    // Optional user callback function
                    if ($.isFunction(fn)) fn.call(this,$e);

                } else {

                    // Handle error if required
                    if (options.showerror)
                        if (options.errormsg != '') {
                            var msg = options.errormsg;
                            $(e).html('<div class="rssError"><p class="component-error">There is an error with this feed: '+ msg +'</p></div>');
                        } else {
                            $(e).html('<div class="rssError"><p class="component-info">Double click to configure this feed</p></div>');
                        };
                };
            });
        });
    };

    // Function to create HTML result
    var _process = function(e, data, options) {

        // Get JSON feed data
        var feeds = data.channel || data;
        if (!feeds) {
            return false;
        }
        var html = '';
        var row = 'odd';

        // Get XML data for media (parseXML not used as requires 1.5+)
        var xml = getXMLDocument(data.xmlString);
        var xmlEntries = xml.getElementsByTagName('item');
        var rtitle = feeds.title;
        if(typeof(rtitle) != "undefined" && typeof(rtitle) != "string"){
            rtitle = rtitle.content;
        }
        var tlink = feeds.link[1];
          if(typeof(tlink) != "undefined" && typeof(tlink) != "string"){
                  tlink = tlink.href;
         }

        // Add header if required
        if (options.header)
            html += '<div class="rssHeader">' +
                '<a href="'+tlink+'" title="'+ feeds.description +'" target="'+ options.linktarget +'">'+ rtitle +'</a>' +
                '</div>';

        // Add body
        html += '<div class="rssBody">' +
            '<ul>';

        // Add feeds
        var filterAction =[options.filterAction1, options.filterAction2, options.filterAction3];
        var filterField = [options.filterField1, options.filterField2, options.filterField3];
        var filterValue = [options.filterValue1, options.filterValue2, options.filterValue3];

        var displayCount = 0;
        var flist = feeds.item || feeds.entry;
        if(flist && !$.isArray(flist)){
            flist = [flist];
        }
        for (var i=0; i<flist.length; i++) {
            if (displayCount < options.displayLimit) {
                // Get individual feed
                var entry = flist[i];

                // Filter results if specified
                var showEntry = true;

                for (var x=0;x<3;x++) {
                      if (filterAction[x] != '' && filterField[x] != '' && filterValue[x] != '') {
                            if (filterField[x] == 'title') {
                                var titleContains = entry.title.indexOf(filterValue[x]);
                                if ((filterAction[x] == 'hideAny' && titleContains != -1) || (filterAction[x] == 'showOnly' && titleContains == -1)) {
                                    showEntry = false;

                                } else if ((filterAction[x] == 'hideAny' && titleContains != -1) || (filterAction[x] == 'showOnly' && titleContains != -1)) {
                                    showEntry = true;

                                }
                            }

                            if (filterField[x] == 'categories') {
                                var catContains = entry.categories.indexOf(filterValue[x]);
                                if ((filterAction[x] == 'hideAny' && catContains != -1) || (options.filterAction1 == 'showOnly' && catContains == -1)) {
                                    showEntry = false;

                                } else if ((filterAction[x] == 'hideAny' && catContains != -1) || (filterAction[x] == 'showOnly' && catContains != -1)) {
                                    showEntry = true;

                                }
                            }
                            if (filterField[x] == 'author') {
                                var authorContains = entry.author.indexOf(filterValue[x]);
                                if ((filterAction[x] == 'hideAny' && authorContains != -1) || (filterAction[x] == 'showOnly' && authorContains == -1)) {
                                    showEntry = false;

                                } else if ((filterAction[x] == 'hideAny' && authorContains != -1) || (filterAction[x] == 'showOnly' && authorContains != -1)) {
                                    showEntry = true;

                                }
                            }
                      } // end if
                } // end for loop

                if (showEntry) {
                    // Format published date
                    var entryDate = new Date(entry.pubDate || entry.issued || entry.published);
                    //dateFormat.masks.pubDate = "mmmm d, yyyy h:MM TT";
                    var pubDate=entryDate.medium();

                    html += '<li class="rssRow '+row+'">';

                    if (options.date)
                        html += '<div class="date"><i class="fa fa-clock-o"></i>&nbsp;' + pubDate + '</div>';

                    var etitle = entry.title;
                    if(typeof(etitle) != "undefined" && typeof(etitle) != "string"){
                        etitle = etitle.content;
                    }
                    var elink = entry.link;
                    if(typeof(elink) != "undefined" && typeof(elink) != "string"){
                        elink = elink.href;
                    }

                    // Add feed row
                    if (options.linktarget == '_self') {
                        html += '<'+ options.titletag +' class="newsfeed-item-title"><a href="'+ elink +'" title="View this feed at '+ rtitle +'" target="'+ options.linktarget +'" >'+etitle +'</a></'+ options.titletag +'>'
                    } else {
                        html += '<'+ options.titletag +' class="newsfeed-item-title"><a href="'+ elink +'" title="View this feed at '+ rtitle +'" target="'+ options.linktarget +'" onclick="return newWindow(\''+ elink +'\','+ options.windowWidth +','+ options.windowHeight +');">'+ etitle +'</a></'+ options.titletag +'>'
                    }
                    //if (options.date) html += '<div class="date">'+ pubDate +'</div>'
                    //if (options.content) {

                        // Use feed snippet if available and optioned
                       /* if (options.snippet && entry.contentSnippet != '') {
                            var content = entry.contentSnippet;
                        } else {
                            var content = entry.content;
                        }*/

                     if (options.content) {

                        // Use feed snippet if available and optioned
                        var content = entry.description || entry.summary || "";

                        if (content == "" && typeof(entry.content) != "undefined" && typeof(entry.content.content) != "undefined") {
                            content = entry.content.content;
                        }
                        html += '<p>'+ content +'</p>'
                    }

                    if (options.snippet)
                        html += '<p class="p-e-link-w-arrow right">' +
                            '<a href="'+tlink+'" title="Read the full story" target="'+ options.linktarget +'">Full <span class="lastWord">story</span></a>' +
                            '</p>';

                    // Add any media
                    if(xmlEntries.length > 0) {
                        var xmlMedia = xmlEntries[i].getElementsByTagName('enclosure');
                        if (xmlMedia.length > 0) {
                            html += '<div class="rssMedia"><div>Media files</div><ul>'
                            for (var m=0; m<xmlMedia.length; m++) {
                                var xmlUrl = xmlMedia[m].getAttribute("url");
                                var xmlType = xmlMedia[m].getAttribute("type");
                                var xmlSize = xmlMedia[m].getAttribute("length");
                                html += '<li><a href="'+ xmlUrl +'" title="Download this media">'+ xmlUrl.split('/').pop() +'</a> ('+ xmlType +', '+ formatFilesize(xmlSize) +')</li>';
                            }
                            html += '</ul></div>'
                        }
                        html += '</li>';
                    }

                    // Alternate row classes
                    if (row == 'odd') {
                        row = 'even';
                    } else {
                        row = 'odd';
                    }
                    displayCount++;
                } // showEntry if statement
            } // displayCount if statement
        } //skipEntry if statement

        html += '</ul>' +
            '</div>'

        $(e).html(html);
    };

    function formatFilesize(bytes) {
        var s = ['bytes', 'kb', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes)/Math.log(1024));
        return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
    }

    function getXMLDocument(string) {
        var browser = navigator.appName;
        var xml;
        if (browser == 'Microsoft Internet Explorer') {
            xml = new ActiveXObject('Microsoft.XMLDOM');
            xml.async = 'false'
            xml.loadXML(string);
        } else {
            xml = (new DOMParser()).parseFromString(string, 'text/xml');
        }
        return xml;
    }        
    
})(jQuery);

Date.prototype.medium = function(){
    var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var a_p = "";
    var pub_date = this.getDate();
    var pub_month = this.getMonth();
    var pub_year = this.getFullYear();
    //var pub_hour = this.getHours();
    //var pub_min = this.getMinutes();
    //if (pub_min < 10){ pub_min = "0"+pub_min;}
    //if (pub_hour < 12) {a_p = "AM"; } else {a_p = "PM"; }
    //if (pub_hour == 0){pub_hour = 12;}
    //if (pub_hour > 12){pub_hour = pub_hour - 12;}
    //return m_names[pub_month] + " " + pub_date + ", " + pub_year + " " + pub_hour + ":" + pub_min + " " + a_p;
    return m_names[pub_month] + " " + pub_date + ", " + pub_year;
}  

    function newWindow(url, windowWidth, windowHeight) {
        if (windowWidth > 0 && windowHeight > 0) {
            window.open(url,'feedwindow','width='+windowWidth+',height='+windowHeight+',scrollbars=yes');
        } else {
            window.open(url,'feedwindow');
        }
        return false;
    }
