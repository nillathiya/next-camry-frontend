"use client";
import {
  userShowSlidingHighlight,
  useSlidingHighlightText,
} from "@/hooks/useUserSettings";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import React, { useState, useEffect } from "react";

const Highlight = () => {
  const { darkMode } = useAppSelector((state) => state.themeCustomizer);
  const { loading: ShowSlidingHighlightLoading, value: showSlidingHighlight } =
    userShowSlidingHighlight();
  const { loading: slidingHighlightTextLoading, value: slidingHighlightText } =
    useSlidingHighlightText();

  console.log("showSlidingHighlight", showSlidingHighlight);

  return (
    <div>
      <style>{`
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          background: ${darkMode ? "#23262e" : "#fff"};
          color: ${darkMode ? "#eee" : "#000"};
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

      {showSlidingHighlight &&
        !ShowSlidingHighlightLoading &&
        !slidingHighlightTextLoading && (
          <div className="marquee-wrapper mb-3">
            <div className="marquee-content">
              <span>
                {"\u{1F525}"}
                {"\u26A0\uFE0F"}
                {"\u{1F3A4}"}
                {slidingHighlightText}{" "}
              </span>
            </div>
          </div>
        )}
    </div>
  );
};

export default Highlight;
