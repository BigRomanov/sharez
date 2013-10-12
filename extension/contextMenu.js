
function changeToWizCursor(){
  document.body.style.cursor="url('cursors/portal-busy-o.ani'), default";
}

// The onClicked callback function.
function onClickHandler(info, tab) {

  chrome.extension.getBackgroundPage().console.log('LALALA');
  if (info.menuItemId == "share") {

    if (typeof info.linkUrl != 'undefined') {
      alert(info.linkUrl);
    }

    chrome.extension.getBackgroundPage().console.log('foo');
    changeToWizCursor();
    
    // we will have to get the coorrdinates from somewhere else
    //var x = e.clientX, y = e.clientY,
    //    elementMouseIsOver = document.elementFromPoint(x, y);
    //alert(elementMouseIsOver);

  }

};


    
//function changeToCursor2(){
//  document.body.style.cursor="url('cursor2.ani'),url('cursor2.cur'), default";
//}

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {

  chrome.contextMenus.create({"title": "Share...", "contexts":["all"], "id": "share"});
  // Create one test item for each context type.
  //var contexts = ["page","selection","link","editable","image","video", "audio"];

  //for (var i = 0; i < contexts.length; i++) {
  //  var context = contexts[i];
  //  var title = "Test '" + context + "' menu item";
  //  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
  //                                       "id": "context" + context});
  //  console.log("'" + context + "' item:" + id);
  //}

  // Create a parent item and two children.
  //chrome.contextMenus.create({"title": "Test parent item", "id": "parent"});
  //chrome.contextMenus.create({"title": "Child 1", "parentId": "parent", "id": "child1"});
  //chrome.contextMenus.create({"title": "Child 2", "parentId": "parent", "id": "child2"});
  //console.log("parent child1 child2");

  // Create some radio items.
  //chrome.contextMenus.create({"title": "Radio 1", "type": "radio", "id": "radio1"});
  //chrome.contextMenus.create({"title": "Radio 2", "type": "radio", "id": "radio2"});
  //console.log("radio1 radio2");

  // Create some checkbox items.
  //chrome.contextMenus.create({"title": "Checkbox1", "type": "checkbox", "id": "checkbox1"});
  //chrome.contextMenus.create({"title": "Checkbox2", "type": "checkbox", "id": "checkbox2"});
  //console.log("checkbox1 checkbox2");

  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  //console.log("About to try creating an invalid item - an error about " + "duplicate item child1 should show up");
  //chrome.contextMenus.create({"title": "Oops", "id": "child1"}, function() {
  //  if (chrome.extension.lastError) {
  //    console.log("Got expected error: " + chrome.extension.lastError.message);
  //  }
  //});
});
