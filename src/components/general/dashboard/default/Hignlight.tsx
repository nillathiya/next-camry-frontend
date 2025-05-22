"use client";
import React, { useState, useEffect } from "react";

const Highlight = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-only"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <style>{`
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          background: ${isDarkMode ? "#23262e" : "#fff"};
          color: ${isDarkMode ? "#eee" : "#000"};
          padding: 10px 0;
          position: relative;
          border-radius: 10px;
        }

        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 15s linear infinite;
        }

        .marquee-content span {
          display: inline-block;
          padding-right: 50px;
          font-size: 1.2rem;
          font-size: 1rem;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-300px);
          }
        }
      `}</style>

      <div className="marquee-wrapper mb-3">
        <div className="marquee-content">
          <span>🔥 Welcome to Our Website • </span>
        </div>
      </div>
    </div>
  );
};

export default Highlight;
