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
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            if (!tab.id || !tab.url || !tab.url.startsWith('http')) return;

            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                files: ['contentScript.js']
              },
              () => {
                if (chrome.runtime.lastError) {
                  console.warn(`Not possible to inject ${tab.id}`, chrome.runtime.lastError.message);
                  return;
                }

                chrome.tabs.sendMessage(tab.id, { type: "SHOW_REMINDER_IMAGE" }, () => {
                  if (chrome.runtime.lastError) {
                    console.warn(`Error message on tab ${tab.id}`, chrome.runtime.lastError.message);
                  } else {
                    console.log(`Image on tab ${tab.id}`);
                  }
                });
              }
            );
          });
        });
      }
    });
  }
});
