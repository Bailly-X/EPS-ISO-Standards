chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('reminderAlarm', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'reminderAlarm') {
    const now = new Date();
    chrome.storage.sync.get(['hour', 'minute', 'enabled'], (result) => {
      if (!result.enabled) return;

      const targetHour = result.hour ?? 15;
      const targetMinute = result.minute ?? 30;

      if (now.getHours() === targetHour && now.getMinutes() === targetMinute) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "SHOW_REMINDER_IMAGE" });
          }
        });
      }
    });
  }
});
