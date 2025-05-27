console.log("C EST CHARGE");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SHOW_REMINDER_IMAGE") {
    console.log("affiche toi le N");
    const existingImg = document.getElementById("extensionReminderImage");

    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("icon.png");
    img.id = "extensionReminderImage";
    img.style.position = "fixed";
    img.style.bottom = "20px";
    img.style.left = "20px";
    img.style.width = "100px";
    img.style.zIndex = "999999";
    img.style.borderRadius = "12px";
    img.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    document.body.appendChild(img);
  }
});
