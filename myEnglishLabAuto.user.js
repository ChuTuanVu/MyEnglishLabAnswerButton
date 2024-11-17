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
  setInterval(() => {
    document.addEventListener("DOMContentLoaded", () => {
      let a = false;
      let b = false;
      let c = false;
      const d = document.getElementById("answer");
      const e = document.getElementById("submitButton");
      const f = document.getElementById("next");
      if (d && !a) {
        d.click();
        a = true;
      }
      if (e && !b) {
        e.click();
        b = true;
      }
      if (f && !c) {
        f.click();
        c = true;
      }
    });
  }, 1000);
})();
