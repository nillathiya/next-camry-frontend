"use client";
import {
  useShowSlidingHighlight,
  useSlidingHighlightText,
} from "@/hooks/useUserSettings";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import React, { useState, useEffect } from "react";

const Highlight = () => {
  const { darkMode } = useAppSelector((state) => state.themeCustomizer);
  const { loading: ShowSlidingHighlightLoading, value: showSlidingHighlight } =
    useShowSlidingHighlight();
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

.marquee-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  overflow: hidden;
}

.icon {
  flex-shrink: 0;
}

.marquee-content {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}

.marquee-content span {
  display: inline-block;
  min-width: 100%;
  padding-right: 50px;
  font-size: 1rem;
  animation: marquee 15s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

      `}</style>

      {showSlidingHighlight &&
        !ShowSlidingHighlightLoading &&
        !slidingHighlightTextLoading && (
          <div className="marquee-wrapper mb-3">
            <div className="marquee-inner">
              <div className="icon">
                <img src="/assets/images/speacker.svg" alt="" />
              </div>
              <div className="marquee-content">
                <span>
                  {"\u{1F525}"}
                  {"\u26A0\uFE0F"}
                  {"\u{1F3A4}"}
                  {slidingHighlightText}
                </span>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Highlight;
