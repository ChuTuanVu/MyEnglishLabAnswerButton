// ==UserScript==
// @name         Auto MyEnglishLab Answer Button
// @version      1.0
// @description  Automatically complete assignments
// @author       Chu Tuan Vu
// @match        https://myenglishlab.pearson-intl.com/activities
// @icon         https://www.google.com/s2/favicons?domain=myenglishlab.pearson-intl.com
// @updateURL    https://github.com/ChuTuanVu/MyEnglishLabAnswerButton/raw/main/myEnglishLabAuto.user.js
// @downloadURL  https://github.com/ChuTuanVu/MyEnglishLabAnswerButton/raw/main/myEnglishLabAuto.user.js
// ==/UserScript==

(function () {
  "use strict";
  const homepage = document.getElementById("menu-homepage")
  const notstarted = document.querySelector('button[data-id="header-state-filter-id--not-started"]');
  if (homepage) {
    homepage.click();
  }
  if (notstarted) {
    notstarted.click();
  }
})();