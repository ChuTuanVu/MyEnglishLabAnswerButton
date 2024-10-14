// ==UserScript==
// @name         MyEnglishLab Answer Button
// @version      2.4
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
  const navigationButtons = document.querySelector(".navigation__buttons ul");
  const submitButton = document.querySelector("#submitButton");
  navigationButtons.insertBefore(answer, submitButton.parentElement);

  let unit = document
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
  document.getElementById("answer").addEventListener("click", function (event) {
    event.preventDefault();
    const cached = sessionStorage.getItem("cached");
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
        };
        Object.keys(keys).forEach((id) => {
          const elements = document.querySelectorAll(`.${id}`);
          if (elements.length > 0) {
            keys[id]();
          }
        });
      } else {
        alert("Hiện chưa có đáp án cho bài tập này! 😥");
      }
    }
    if (cached) {
      const data = JSON.parse(cached);
      processActivity(data);
    } else {
      let ver = prompt(
        "Chọn môn học:\ntatc: Tiếng anh tăng cường\nta: Tiếng anh 1,2,3"
      );
      let verta = "";
      let untatc = "";

      if (ver == "tatc") {
        untatc = prompt(
          "Chọn unit:\n1: Unit 1 đến unit 6\n2: Unit 7 đến unit 12"
        );
        if (untatc == "1") {
          verta = "https://api.jsonbin.io/v3/b/670a8615ad19ca34f8b73234";
        } else if (untatc == "2") {
          verta = "https://api.jsonbin.io/v3/b/670a862bacd3cb34a895a80b";
        }
      } else if (ver == "ta") {
        verta = "https://api.jsonbin.io/v3/b/66ee3797acd3cb34a8885ea5";
      }
      if (ver && verta) {
        fetch("https://api.ipify.org/?format=json")
          .then((response) => response.json())
          .then((data) => {
            const ip = data.ip;
            return fetch(
              `https://api.airtable.com/v0/appkzsY0wGr47oUqa/MyEnglishLab`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer pat6VkxBrIGDyGXKc.5924e5c16e6fc0e6091c563de1e3d8d3df0f75695f3b67af763c6f3f01db5b9c`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  records: [
                    {
                      fields: {
                        ip: ip,
                        time: new Date().toLocaleString(),
                      },
                    },
                  ],
                }),
              }
            );
          })
          .then((response) => response.json())
          .then(() => {
            let key = prompt("Liên hệ: chutuanvu0206\nVui lòng nhập key:");
            if (key) {
              fetch(verta, {
                headers: {
                  "X-Access-Key": key,
                },
              })
                .then((response) => {
                  if (!response.ok) {
                    alert("Key không hợp lệ.");
                    return;
                  }
                  return response.json();
                })
                .then((data) => {
                  if (data) {
                    sessionStorage.setItem("cached", JSON.stringify(data));
                    processActivity(data);
                  }
                });
            }
          });
      }
    }
  });

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
  function inlineDropDown() {
    const queryElements = document.querySelectorAll(".activity-select");
    const queryElementsFt = Array.from(queryElements).filter(
      (element) => !element.hasAttribute("disabled")
    );
    queryElementsFt.forEach((id, index) => {
      id.value = answerData.answer[index];
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
    const queryElements = document.querySelectorAll(".boxBody");
    const queryElementsFt = Array.from(queryElements).filter(
      (element) => !element.hasAttribute("disabled")
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
    const queryElements = document.querySelectorAll("div.drop:not(.example)");
    queryElements.forEach((id, index) => {
      id.appendChild(
        document.querySelector(`[data-id='${answerData.answer[index]}']`)
      );
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
    const queryElements = document.querySelectorAll(
      'input[autocorrect^="off"]'
    );
    const queryElementsFt = Array.from(queryElements).filter(
      (element) =>
        !element.hasAttribute("disabled") &&
        !element.classList.contains("filled")
    );
    queryElementsFt.forEach((id, index) => {
      id.value = answerData.answer[index];
    });
  }
  function crossword() {
    const queryElements = document.querySelectorAll(
      'input[class^="response-RESPONSE_"]'
    );
    const queryElementsFt = Array.from(queryElements).filter(
      (element) => !element.classList.contains("example")
    );
    queryElementsFt.forEach((id, index) => {
      id.value = answerData.answer[index];
    });
  }
  function fillin() {
    const queryElements = document.querySelectorAll(
      ".superwideWidth, .wideWidth, .normalWidth, .narrowWidth"
    );
    const queryElementsFt = Array.from(queryElements).filter(
      (element) => !element.hasAttribute("disabled")
    );
    const AnswersFt = answerData.answer.filter(
      (value) =>
        !/^i_\d+--underline--\d+$/.test(value) &&
        !/^i_\d+_RESPONSE_(left|right)_i_\d+--matching--\d+$/.test(value)
    );
    queryElementsFt.forEach((id, index) => {
      id.value = AnswersFt[index];
    });
  }
  function essay() {
    alert(
      "Bài này văn mẫu đấy.\nNếu được tự viết nhé 😉 (from VuChu with love ❤️)"
    );
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
})();
