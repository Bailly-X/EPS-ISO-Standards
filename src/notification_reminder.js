console.log("OUI")


console.log("apres")

document.getElementById('saveSettingsBtn').addEventListener('click', () => {
   const hour = parseInt(document.getElementById('hourInput').value, 10);
   const minute = parseInt(document.getElementById('minuteInput').value, 10);
   const reminderActive = document.getElementById('enableReminder').checked;
   const frequency = document.querySelector('input[name="frequency"]:checked').value;

  console.log(`⏰ Rappel configuré pour ${hour}h${minute < 10 ? '0' : ''}${minute}, actif: ${reminderActive}, fréquence: ${frequency}`);
});


let intervalId;

document.getElementById('enableReminder').addEventListener('change', (e) => {
  const active = e.target.checked;

  if (active) {
    startReminder();
  } else {
    clearInterval(intervalId);
    console.log('🔕 Rappel désactivé');
  }
});

function startReminder() {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    const hour = parseInt(document.getElementById('hourInput').value, 10);
    const minute = parseInt(document.getElementById('minuteInput').value, 10);
    const now = new Date();

    if (
      now.getHours() === hour &&
      now.getMinutes() === minute &&
      now.getSeconds() === 0
    ) {
      const frequency = document.querySelector('input[name="frequency"]:checked').value;
      if (frequency === 'daily') {
        console.log('📢 Rappel quotidien déclenché !');
      } else if (frequency === 'weekly' && now.getDay() === 1) {
        console.log('📢 Rappel hebdomadaire déclenché (lundi) !');
      }
    }
  }, 1000);
}
