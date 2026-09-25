import { useEffect, useState } from 'react';
import './Maintenance.css';

export default function Maintenance() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="maintenance-page">
      <div className="maintenance-background">
        <div className="glow glow-one" />
        <div className="glow glow-two" />
      </div>

      <div className="maintenance-container">
        <div className="maintenance-logo">
          HK
        </div>

        <div className="maintenance-badge">
          <span className="status-dot" />
          Currently Under Maintenance
        </div>

        <h1>
          We'll Be Back
          <span>Soon.</span>
        </h1>

        <p className="maintenance-description">
          I'm currently making some improvements to my portfolio.
          The website will be back online shortly.
        </p>

        <div className="maintenance-loader">
          <div className="loader-line">
            <span />
          </div>

          <p>
            Working on something great{dots}
          </p>
        </div>

        <div className="maintenance-footer">
          <p>
            <strong>Harish Khuva</strong>
            <br />
            WordPress · Shopify · GHL · Webflow · Wix
          </p>
        </div>
      </div>
    </main>
  );
}