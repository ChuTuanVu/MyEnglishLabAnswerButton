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
  window.onload = function () {
    let answerFlag = false;
    let submitFlag = false;
    let nextFlag = false;

    const answer = document.getElementById("answer");
    const submit = document.getElementById("submitButton");
    const next = document.getElementById("next");
    function loop() {
      if (answer && !answerFlag) {
        answer.click();
        answerFlag = true;
      }
      if (submit && !submitFlag) {
        submit.click();
        submitFlag = true;
      }
      if (next && !nextFlag) {
        next.click();
        nextFlag = true;
      }
      if (!answerFlag || !submitFlag || !nextFlag) {
        setTimeout(loop, 100);
      }
    }
    loop();
  };
})();