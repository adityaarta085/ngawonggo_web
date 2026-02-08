
import { useState, useEffect, useCallback } from 'react';

const AdManager = () => {
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [shouldShowAds, setShouldShowAds] = useState(false);

  const detectAdBlock = useCallback(async () => {
    // Method 1: Bait Div
    const adDiv = document.createElement('div');
    adDiv.className = 'adsbox ad-unit ad-zone ad-space google-ads';
    adDiv.style.position = 'absolute';
    adDiv.style.left = '-9999px';
    adDiv.style.top = '-9999px';
    adDiv.innerHTML = '&nbsp;';
    document.body.appendChild(adDiv);

    // Method 2: Bait Script
    let scriptBlocked = false;
    try {
      const response = await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
        method: 'HEAD',
        mode: 'no-cors',
      });
    } catch (error) {
      scriptBlocked = true;
    }

    setTimeout(() => {
      const isBlocked = adDiv.offsetHeight === 0 || adDiv.clientHeight === 0 || scriptBlocked;
      setAdBlockDetected(isBlocked);
      document.body.removeChild(adDiv);

      if (isBlocked) {
          // Dispatch event for AdBlockOverlay
          window.dispatchEvent(new CustomEvent('adBlockDetected', { detail: true }));
      }
    }, 100);
  }, []);

  useEffect(() => {
    detectAdBlock();

    // Check conditions for showing ads
    const checkAdsStatus = () => {
      const isAdmin = localStorage.getItem('adminSession');
      const adsDisabledByUser = localStorage.getItem('adsDisabledByUser') === 'true';
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore') === 'true';

      if (isAdmin) {
        setShouldShowAds(false);
        return;
      }

      if (adsDisabledByUser) {
        setShouldShowAds(false);
        return;
      }

      if (!hasVisitedBefore) {
        setShouldShowAds(false);
        // Set flag for next visit
        localStorage.setItem('hasVisitedBefore', 'true');
        return;
      }

      // If we passed all checks, show ads
      setShouldShowAds(true);
    };

    checkAdsStatus();

    // Listen for storage changes (for the hidden feature)
    const handleStorageChange = () => {
      checkAdsStatus();
    };
    window.addEventListener('storage', handleStorageChange);
    // Also listen for a custom event from Footer
    window.addEventListener('adsPreferenceChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adsPreferenceChanged', handleStorageChange);
    };
  }, [detectAdBlock]);

  useEffect(() => {
    if (shouldShowAds && !adBlockDetected) {
      injectAdScripts();
    }
  }, [shouldShowAds, adBlockDetected]);

  const injectAdScripts = () => {
    // Only inject if not already injected
    if (document.getElementById('ezmob-prebid')) return;

    // 1. Monetag meta
    if (!document.querySelector('meta[name="monetag"]')) {
        const meta = document.createElement('meta');
        meta.name = 'monetag';
        meta.content = '76a8d4189fc76873b6c1e55c4aa970ce';
        document.head.appendChild(meta);
    }

    // 2. Ezmob Prebid
    const ezmobScript = document.createElement('script');
    ezmobScript.id = 'ezmob-prebid';
    ezmobScript.src = 'https://docdn.ezmob.com/prebid.js';
    ezmobScript.async = true;
    document.head.appendChild(ezmobScript);

    // 3. Ezmob Config
    const ezmobConfig = document.createElement('script');
    ezmobConfig.innerHTML = `
      var pbjs = pbjs || {};
      pbjs.que = pbjs.que || [];

      pbjs.que.push(function() {
        var adUnits = [{
          code: 'container-1',
          mediaTypes: {
            video: {
              context: 'outstream',
              playerSize: [300, 250],
              renderer: {
                url: 'https://docdn.ezmob.com/outstream_pb.js',
                render: renderOutstream
              }
            }
          },
          bids: [{
            bidder: 'adkernel',
            params: {
              zoneId: 329693,
              host: 'cpm.ezmob.com'
            }
          }]
        }];
        pbjs.addAdUnits(adUnits);
        pbjs.requestBids({
          bidsBackHandler: function(bidResponses) {
            process('container-1');
          }
        });
      });

      function process(adUnit) {
        var bidResponses = pbjs.getHighestCpmBids(adUnit);
        if (bidResponses.length == 0) {
          return;
        }
        var bid = bidResponses[0];
        pbjs.renderAd(document, bid.adId);
      }

      function renderOutstream(bid) {
        if (typeof OutstreamPlayerPB === 'function') {
            OutstreamPlayerPB(bid, {
                displayMode: 'floating',
                transitions: true,
                vpaidMode: 2
            });
        }
      }
    `;
    document.head.appendChild(ezmobConfig);

    // 4. Container for Ezmob
    if (!document.getElementById('container-1')) {
        const container = document.createElement('div');
        container.id = 'container-1';
        document.body.appendChild(container);
    }

    // 5. Quge5
    const qugeScript = document.createElement('script');
    qugeScript.src = 'https://quge5.com/88/tag.min.js';
    qugeScript.dataset.zone = '208854';
    qugeScript.async = true;
    qugeScript.dataset.cfasync = 'false';
    document.head.appendChild(qugeScript);

    // 6. Al5sm
    const al5smScript = document.createElement('script');
    al5smScript.innerHTML = `(function(s){s.dataset.zone='10575512',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.body.appendChild(al5smScript);
  };

  return null; // This component doesn't render anything itself
};

export default AdManager;
