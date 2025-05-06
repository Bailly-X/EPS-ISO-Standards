document.getElementById('play').addEventListener('click', () => {
    const popup = document.getElementById('popupContent');
    popup.innerHTML = `
      <h2><strong>Which is written in plain language?</strong></h2>
      <button class="answer">Please be advised that the meeting will be rescheduled.</button>
      <button class="answer">The meeting will take place at a later date.</button>
      <button class="answer">We’re moving the meeting.</button>
      <p id="result"></p>
    `;
  
    const answers = document.querySelectorAll('.answer');
    const result = document.getElementById('result');
    const correctIndex = 2;
  
    answers.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (index === correctIndex) {
          result.textContent = "✅ Good choice! That’s plain language.";
          result.style.color = "green";
        } else {
          result.textContent = "❌ Try again! This is not plain language.";
          result.style.color = "red";
        }
      });
    });
  });
  
  