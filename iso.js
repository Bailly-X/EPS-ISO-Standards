const answers = document.querySelectorAll('.answer');
const result = document.getElementById('result');

// Exemple de quiz (tu peux en ajouter d'autres)
const quiz = {
  question: "Which is written in plain language?",
  options: [
    "Please be advised that the meeting will be rescheduled.",
    "The meeting will take place at a later date.",
    "We’re moving the meeting."
  ],
  correct: 2
};

// Charger les options
answers.forEach((btn, index) => {
  btn.textContent = quiz.options[index];
  btn.addEventListener('click', () => {
    if (index === quiz.correct) {
      result.textContent = "✅ Good choice! That’s plain language.";
    } else {
      result.textContent = "❌ Try again! This is not plain language.";
    }
  });
});