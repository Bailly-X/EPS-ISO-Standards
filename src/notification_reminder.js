console.log("OUI");
console.log("apres");

document.getElementById('saveSettingsBtn').addEventListener('click', () => {
  const hour = parseInt(document.getElementById('hourInput').value, 10);
  const minute = parseInt(document.getElementById('minuteInput').value, 10);
  const reminderActive = document.getElementById('enableReminder').checked;
  const frequency = document.querySelector('input[name="frequency"]:checked').value;

  chrome.storage.sync.set({ hour, minute, enabled: reminderActive }, () => {
  });


  if (reminderActive) {
    startReminder();
  } else {
    clearInterval(intervalId);
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
        console.log('Daily call!');
      } else if (frequency === 'weekly' && now.getDay() === 1) {
        console.log('Weekly call!');
      } 

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          console.log("Message sent to contentscript");
          chrome.tabs.sendMessage(tabs[0].id, { type: "SHOW_REMINDER_IMAGE" });
        }
      });
    }
  }, 1000);
}
