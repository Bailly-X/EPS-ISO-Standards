/*
const quizData = [
  {
    question: "Which is written in plain language?",
    options: [
      "Please be advised that the meeting will be rescheduled.",
      "The meeting will take place at a later date.",
      "We’re moving the meeting."
    ],
    correct: 2
  },
  {
    question: "Which sentence is clearer?",
    options: [
      "Commence the procedure immediately.",
      "Begin the process now.",
      "Start now."
    ],
    correct: 2
  }
];

let currentQuestion = 0;

function showQuestion(index) {
  const popup = document.getElementById('popupContent');
  popup.innerHTML = '';

  const questionObj = quizData[index];

  const questionTitle = document.createElement('h2');
  questionTitle.innerHTML = `<strong>${questionObj.question}</strong>`;
  popup.appendChild(questionTitle);

  const result = document.createElement('p');
  result.id = 'result';
  popup.appendChild(result);

  questionObj.options.forEach((text, idx) => {
    const btn = document.createElement('button');
    btn.className = 'answer';
    btn.textContent = text;
    popup.appendChild(btn);

    btn.addEventListener('click', () => {
      result.textContent =
        idx === questionObj.correct
          ? "✅ Good choice! That’s plain language."
          : "❌ Try again! This is not plain language.";
      result.style.color = idx === questionObj.correct ? 'green' : 'red';
    });
  });

  // Ajouter bouton "Next" si ce n’est pas la dernière question
  if (index < quizData.length - 1) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = "Next →";
    nextBtn.style.marginTop = "15px";
    popup.appendChild(nextBtn);

    nextBtn.addEventListener('click', () => {
      currentQuestion++;
      showQuestion(currentQuestion);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('play').addEventListener('click', () => {
    currentQuestion = 0;
    showQuestion(currentQuestion);
  });
});
*/