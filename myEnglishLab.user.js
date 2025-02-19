// ==UserScript==
// @name         MyEnglishLab Answer Button
// @version      2.0
// @description  Add an answer button
// @author       Chu Tuan Vu
// @match        https://myenglishlab.pearson-intl.com/activities/*
// @icon         https://www.google.com/s2/favicons?domain=myenglishlab.pearson-intl.com
// @updateURL    https://github.com/ChuTuanVu/MyEnglishLabAnswerButton/raw/main/myEnglishLab.user.js
// @downloadURL  https://github.com/ChuTuanVu/MyEnglishLabAnswerButton/raw/main/myEnglishLab.user.js
// ==/UserScript==

(function () {
  "use strict";
  const answer = document.createElement("li");
  answer.innerHTML =
    '<a id="answer" class="button" href="#" role="button">Show answer</a>';
  document
    .querySelector(".navigation__buttons ul")
    .insertBefore(
      answer,
      document.querySelector("#submitButton").parentElement
    );
  answer.addEventListener("click", async function (p) {
    p.preventDefault();
    const cached = sessionStorage.getItem("cached");

    if (cached) {
      processActivity(JSON.parse(cached));
    } else {
      await fetchAndProcessData();
    }
  });

  const unit = document
    .getElementsByClassName("product_design_unit taskUnit")[0]
    ?.textContent.trim();
  const activity = document
    .getElementsByClassName("product_design_activity_section")[0]
    ?.textContent.trim();
  const activity_desc = document
    .getElementsByClassName("activity-desc__unit-name")[0]
    ?.textContent.trim();

  const fDev = [
    "Exercise 3",
    "Exercise 4A",
    "Exercise 4B",
    "Exercise 5",
    "Exercise 6A",
    "Exercise 6B",
  ];

  if (fDev.includes(activity) && !unit && activity_desc == "Reading") {
    unit = "1.1";
  } else if (fDev.includes(activity) && !unit) {
    unit = "1.2";
  }

  let answerData = null;
  function processActivity(data) {
    const unitData = data.record.find((item) => item.unit === unit);
    const activityData = unitData?.activities.find(
      (item) => item.activity === activity
    );

    if (unitData && activityData) {
      answerData = activityData;
      const keys = {
        fillin,
        matching,
        multipleChoice,
        wordsearch,
        essay,
        draggableJumbledWords,
        singleUnderline,
        multipleUnderline,
        insertAWord,
        hangman,
        positionalDragAndDrop,
        inlineDropDown,
        firstLetterFillin,
        dragAndDropCategorisation,
        dragAndDrop,
        singleChoice,
        crossword,
        audiosubmit,
      };

      Object.keys(keys).forEach((id) => {
        document.querySelectorAll(`.${id}`).forEach(() => keys[id]());
      });
    } else {
      alert("Hiện chưa có đáp án cho bài tập này! 😥");
    }
  }

  async function fetchAndProcessData() {
    const key = prompt("Liên hệ: chutuanvu0206\nVui lòng nhập key:");
    if (!key) return;

    try {
      const response = await fetch(
        "https://api.jsonbin.io/v3/b/67b58430acd3cb34a8e7e2d5",
        {
          headers: { "X-Access-Key": key },
        }
      );
      if (!response.ok) {
        alert("Key không hợp lệ.");
        return;
      }

      const data = await response.json();
      sessionStorage.setItem("cached", JSON.stringify(data));
      processActivity(data);
    } catch (error) {
      alert("Opps");
      console.error(error);
    }
  }

  function draggableJumbledWords() {
    const queryElements = document.querySelectorAll(".droppableWrapper");
    answerData.answer.forEach((Array, index) => {
      const targetDiv = queryElements[index];
      Array.forEach((item) => {
        const targetElement = document.querySelector(`div[value="${item}"]`);
        targetDiv.appendChild(targetElement);
      });
    });
  }
  function multipleUnderline() {
    singleUnderline();
  }
  function singleUnderline() {
    const queryElements = document.querySelectorAll("span");
    const queryElementsFt = Array.from(queryElements).filter((span) => {
      const input = span.querySelector("input");
      return input && answerData.answer.includes(input.value);
    });
    queryElementsFt.forEach((id) => {
      id.click();
    });
  }
  function insertAWord() {
    if (unit == "4.1" && activity == "Exercise 5A") {
      answerData.answer.forEach((id) => {
        const input = document.getElementById(id);
        input.value += ",";
        input.style.display = "inline-block";
      });
    } else {
      const queryElements = document.querySelectorAll("span");
      const queryElementsFt = Array.from(queryElements).filter((span) =>
        /\(.*\)/.test(span.textContent)
      );
      const answer = queryElementsFt.map((span) =>
        span.textContent.replace(/[()]/g, "")
      );
      answerData.answer.forEach((id, index) => {
        const queryElements = document.getElementById(id);
        queryElements.value = answer[index];
        queryElements.style.display = "inline-block";
      });
    }
  }
  function inlineDropDown() {
    const inlineDropDownSelect = document.querySelectorAll(
      ".activity-select:not([disabled])"
    );
    inlineDropDownSelect.forEach((p, i) => {
      const answer = answerData.answer;
      p.value = answer[i];
    });
  }
  function firstLetterFillin() {
    const queryElements = document.querySelectorAll(".normalWidth");
    const queryElementsFt = Array.from(queryElements).filter(
      (element) => !element.hasAttribute("disabled")
    );
    queryElementsFt.forEach((id, index) => {
      id.value = answerData.answer[index];
    });
  }
  function dragAndDropCategorisation() {
    const queryElementsFt = document.querySelectorAll(
      ".boxBody:not([disabled])"
    );
    answerData.answer.forEach((id, index) => {
      if (id.trim() !== "") {
        const element = document.querySelector(`[data-id='${id}']`);
        if (element) {
          queryElementsFt[index % queryElementsFt.length].appendChild(element);
        }
      }
    });
  }
  function positionalDragAndDrop() {
    dragAndDrop();
  }
  function dragAndDrop() {
    const dragAndDropDiv = document.querySelectorAll(
      ".correctAnswer,div.drop:not(.example)"
    );
    dragAndDropDiv.forEach((p, i) => {
      const answer = document.querySelector(
        `[data-id='${answerData.answer[i]}']`
      );
      if (answer) {
        p.appendChild(answer);
        p.style.minWidth = "26px"; //UI
        p.style.borderColor = "transparent"; //UI
      } else {
        console.warn(
          `Element with data-id='${answerData.answer[i]}' not found.`
        );
      }
    });
  }

  function singleChoice() {
    answerData.answer.forEach((value) => {
      document.querySelector(`input[value="${value}"]`).checked = true;
    });
  }
  function multipleChoice() {
    singleChoice();
  }
  function hangman() {
    const hangmanInput = document.querySelectorAll(
      'input[autocorrect^="off"]:not([disabled]):not(.filled)'
    );
    const answer = answerData.answer.filter(
      (value) => !/^i_\d+--inline_choice--\d+$/.test(value)
    );
    hangmanInput.forEach((p, i) => {
      p.value = answer[i];
    });
  }
  function crossword() {
    const crosswordInput = document.querySelectorAll(
      'input[class^="response-RESPONSE_"]:not(.example)'
    );
    const answer = answerData.answer;
    crosswordInput.forEach((p, i) => {
      p.value = answer[i];
    });
  }
  function fillin() {
    const inputResponse = document.querySelectorAll(
      'input[name*="RESPONSE"]:not([disabled])'
    );
    const answer = answerData.answer.filter(
      (value) =>
        !/^i_\d+--underline--\d+$/.test(value) &&
        !/^i_\d+_RESPONSE_(left|right)_i_\d+--matching--\d+$/.test(value)
    );
    inputResponse.forEach((p, i) => {
      p.value = answer[i];
    });
  }

  function essay() {
    const queryElements = document.querySelectorAll("textarea");
    queryElements.forEach((id, index) => {
      id.value = answerData.answer[index];
    });
  }
  function wordsearch() {
    answerData.answer.forEach((id) => {
      const queryElements = document.getElementById(id);
      queryElements.click();
    });
  }
  function matching() {
    const queryElements = answerData.answer.map((id) =>
      document.getElementById(id)
    );
    queryElements.forEach((element) => {
      element.click();
    });
  }
  function audiosubmit() {
    const submit = document.getElementById("submitButton");
    submit.addEventListener("click", (i) => {
      i.preventDefault();
      i.stopPropagation();
    });
    const exit = document.getElementById("exit");
    exit.click();
    const button = document.querySelectorAll(".ui-dialog-buttonset button");
    button.forEach((i) => {
      if (i.textContent.trim() == "Yes") {
        i.click();
      }
    });
  }
})();
