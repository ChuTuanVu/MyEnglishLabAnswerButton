// ==UserScript==
// @name         Auto MyEnglishLab Answer Button
// @version      1.0
// @description  Automatically complete assignments
// @author       Chu Tuan Vu
// @match        https://myenglishlab.pearson-intl.com/*
// @icon         https://www.google.com/s2/favicons?domain=myenglishlab.pearson-intl.com
// @updateURL    https://github.com/ChuTuanVu/MyEnglishLabAnswerButton/raw/main/myEnglishLabAuto.user.js
// @downloadURL  https://github.com/ChuTuanVu/MyEnglishLabAnswerButton/raw/main/myEnglishLabAuto.user.js
// ==/UserScript==

(function () {
  "use strict";
  let answerFlag = false;
  let submitFlag = false;
  let nextFlag = false;

  let notStartedFlag = false;
  let openFlag = false;

  const answer = document.getElementById("answer");
  const submit = document.getElementById("submitButton");
  const next = document.getElementById("next");
  const matching = document.querySelector(".matching");

  if (matching) {
    window.onload = loop;
  }
  else {
    loop();
  }
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
      requestAnimationFrame(loop);
    }
  }

  function open() {
    const notstarted = document.querySelector('button[data-id="header-state-filter-id--not-started"]');
    const open = document.querySelector(".open-link-cell a");
    if (notstarted && !notStartedFlag) {
      notstarted.click();
      notStartedFlag = true;
    }
    if (open && !openFlag) {
      open.click();
      openFlag = true;
    }
  }
  setInterval(open, 1000)
})();