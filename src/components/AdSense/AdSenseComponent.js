import React, { useEffect } from 'react';

const AdSenseComponent = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense Error:", e);
        }
    }, []);

    return (
        <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2190305679534890"
            data-ad-slot="9434422911"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    );
};

export default AdSenseComponent;
