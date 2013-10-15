function handleLoad() {
  loadLocalizedStrings();
  
  var b = chrome.extension.getBackgroundPage();
  
  $('#sharez-enable').attr('checked','checked');
  
  // Initialize the toggle button
  if (b.sharez.Settings.get("enabled", "true") == "true")
  {
    $('#sharez-enable').attr('checked','checked');
  }
  else
  {
    $('#sharez-enable').removeAttr('checked');
  }
  
  
  // TODO: Create the first time setup wizard
  // 
  //if (b.sharez.Settings.Get("first-run", "false") == "true") {
  //    b.sharez.Settings.Set("first-run", "false");
  //    window.close();
  //    b.StartSetupWizard()
  //}
}

function enablesharez()
{
    var b = chrome.extension.getBackgroundPage();

    if (b.sharez.Settings.get("enabled", "true") == "true")
    {
      
      // turn off
      b.sharez.logWrite("sharez: turn off");
      
      b.sharez.logWrite(b.sharez.Settings.get("enabled", "wow"));
      b.sharez.Settings.set("enabled", "false");
      b.sharez.logWrite(b.sharez.Settings.get("enabled", "wow2"));
      
      
      $('#sharez-enable').removeAttr('checked');
    }
    else
    {
      b.sharez.logWrite("sharez: turn on");
      b.sharez.Settings.set("enabled", "true")
      $('#sharez-enable').attr('checked','checked');
    }
    chrome.extension.getBackgroundPage().console.log("Enable sharez 2");
}

function loadLocalizedStrings() {
    document.getElementById("sharez-settings").innerHTML = chrome.i18n.getMessage("browseraction_settings");
    document.getElementById("sharez-goto").innerHTML = chrome.i18n.getMessage("browseraction_goto");
}

function openUrl(b) {
    chrome.tabs.create({
        url: b
    });
    window.close()
}
function openSettings() {
    var b = chrome.extension.getBackgroundPage();
    window.close();
    chrome.extension.getBackgroundPage().console.log("Open settings");
    b.OpenExtensionUrl("options.html")
}

// Register all events
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("load", function () {
        handleLoad()
    });
    document.getElementById("sharez-enable").addEventListener("click", function () {
        enablesharez()
    });
    document.getElementById("sharez-settings").addEventListener("click", function () {
        openSettings()
    });
    document.getElementById("xmarks-goto").addEventListener("click", function () {
        openUrl("http://sharez.me")
    });
});