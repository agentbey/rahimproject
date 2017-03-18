_satellite.pushAsyncScript(function(event, target, $variables){
  function isElementInViewport (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) { el = el[0]; }
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

// Increment counter when slide changes
$('.hero-container .rsNavItem').on("open", function(e){
  var x, l, components = window.dataLayer.page.content.components;
  if( isElementInViewport(e.currentTarget) ){
    for(x=0,l=components.length;x<l;x++){
      if(components[x].el && $.contains(components[x].el, e.currentTarget)){
        _satellite.notify("Number of Slides Viewed has incremented", 1);
        components[x].slidesViewed++;
      }
    }
  }
});
});
