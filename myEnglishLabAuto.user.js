// ==UserScript==
// @name         Auto MyEnglishLab Answer Button
// @version      1.0
// @description  Automatically complete assignments
// @author       Chu Tuan Vu
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @icon         https://www.google.com/s2/favicons?domain=myenglishlab.pearson-intl.com
// @updateURL    https://github.com/ChuTuanVu/MyEnglishLabAnswerButton/raw/main/myEnglishLabAuto.user.js
// @downloadURL  https://github.com/ChuTuanVu/MyEnglishLabAnswerButton/raw/main/myEnglishLabAuto.user.js
// ==/UserScript==

(function () {
  "use strict";
  window.onload = () => {
    const answerButton = document.getElementById("answer");
    const submitButton = document.getElementById("submitButton");
    const nextButton = document.getElementById("next");
    if (answerButton) {
      answerButton.click();
    }
    setTimeout(() => {
      if (submitButton) {
        submitButton.click();
      }
    }, 1000);
    if (nextButton) {
      nextButton.click();
    }
  };
})();
