console.log("OUI");
console.log("apres");

document.getElementById('saveSettingsBtn').addEventListener('click', () => {
  const hour = parseInt(document.getElementById('hourInput').value, 10);
  const minute = parseInt(document.getElementById('minuteInput').value, 10);
  const reminderActive = document.getElementById('enableReminder').checked;
  const frequency = document.querySelector('input[name="frequency"]:checked').value;

  console.log(`⏰ Rappel configuré pour ${hour}h${minute < 10 ? '0' : ''}${minute}, actif: ${reminderActive}, fréquence: ${frequency}`);

  if (reminderActive) {
    startReminder();
  } else {
    clearInterval(intervalId);
    console.log('🔕 Rappel désactivé');
  }
});

let intervalId;

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
      } else {
        return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          console.log("📨 Message envoyé au content script");
          chrome.tabs.sendMessage(tabs[0].id, { type: "SHOW_REMINDER_IMAGE" });
        }
      });
    }
  }, 1000);
}
