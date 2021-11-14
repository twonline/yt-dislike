function saveOptions(e) {
  browser.storage.sync.set({
    apikey: document.querySelector("#apikey").value
  });
  e.preventDefault();
}

function restoreOptions() {
  var gettingItem = browser.storage.sync.get('apikey');
  gettingItem.then((res) => {
    document.querySelector("#apikey").value = res.apikey || 'API KEY HERE';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
