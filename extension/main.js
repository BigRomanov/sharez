// MAIN

var logger = chrome.extension.getBackgroundPage().console;


logger.log("ShareWiz started...");

function onClickHandler(info, tab) {

  chrome.extension.getBackgroundPage().console.log(info);
  
  // Parse context menu info 
  
  var pageUrl = ""
  if (typeof info.pageUrl != 'undefined') {
    pageUrl = info.pageUrl
  }

  var linkUrl = ""
  if (typeof info.linkUrl != 'undefined') {
    linkUrl = info.linkUrl;
  }
  
  var srcUrl = ""
  if (typeof info.srcUrl != 'undefined') {
    srcUrl = info.srcUrl;
  }
  
  var selectionText = ""
  if (typeof info.selectionText != 'undefined') {
    selectionText = info.selectionText;
  }
 
    // we will have to get the coordinates from somewhere else
    //var x = e.clientX, y = e.clientY,
    //    elementMouseIsOver = document.elementFromPoint(x, y);
    //alert(elementMouseIsOver);
    
  contexts = app.getContext(pageUrl, linkUrl, srcUrl, selectionText);
  alert(contexts);

};

// //////////////////////////////////////////////////////////////////////
// MAIN

// Add context menu listener
// chrome.contextMenus.onClicked.addListener(onClickHandler);

// Create context menu
chrome.contextMenus.create({
    "title": "ShareWiz",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : onClickHandler
  });
