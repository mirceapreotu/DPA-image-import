chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
		sendResponse({parentHtml: document.body.innerHTML});
  });