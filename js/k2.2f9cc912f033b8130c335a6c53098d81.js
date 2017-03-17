/*
 * /sm/components/k2/hero-banner/clientlibs/js/hero-baner.js
 */
(function($, HeroBanner, window, document) {
  "use strict";

  $(document).ready(function(){ 

    HeroBanner = HeroBanner || window.SM.components.HeroBanner;

    HeroBanner.scaleSliderHeight = 1;
    HeroBanner.scaleSliderWidth = 3;
    HeroBanner.mobileScaleSliderHeight = 2;
    HeroBanner.mobileScaleSliderWidth = 3;
    HeroBanner.positionControlsAtPageWidth = true;

    HeroBanner.initialize('.hero-banner-container .royalSlider');
  });

}(jQuery, window.SM.components.HeroBanner, window, document));
/*
 * /sm/components/k2/hero-banner/clientlibs/js/hero-baner.js
 */
(function($, Carouselset, window, document) {
  "use strict";

  $(document).ready(function(){

    Carouselset = Carouselset || window.SM.components.Carouselset;

    Carouselset.scaleSliderHeight = 1;
    Carouselset.scaleSliderWidth = 3;
    Carouselset.mobileScaleSliderHeight = 2;
    Carouselset.mobileScaleSliderWidth = 3;
    Carouselset.positionControlsAtPageWidth = true;

    Carouselset.init('.carousel-content-container .royalSlider');
  });

}(jQuery, window.SM.components.Carouselset, window, document));
