var tracker, googleAnalyticsId2, googleAnalyticsDomain;

googleAnalyticsId2 = (window.googleAnalyticsId2 !== undefined) ? window.googleAnalyticsId2 : false;
googleAnalyticsDomain = (window.googleAnalyticsDomain !== undefined) ? window.googleAnalyticsDomain : "auto";

try {
  // Run the secondardy pageTracker2, but only if present
  if (googleAnalyticsId2) {
    ga('create', {
      "trackingId": googleAnalyticsId2,
      "cookieDomain": googleAnalyticsDomain,
      "name": 'pageTracker2'
    });
    ga('pageTracker2.send', 'pageview');
    _satellite.notify("Universal Analytics secondary pageTracker2 executed", 1);
  }
} catch(err) {
  _satellite.notify(err, 5);
}
try {
  // Run any arbitrary GA extras the user defines; 
  // this can be any custom tracking packed into the googleAnalyticsExtras function.
  if (typeof window.googleAnalyticsExtras === "function") window.googleAnalyticsExtras();
} catch(err) {
  _satellite.notify(err, 5);
}
