function handleLoad() {
  loadLocalizedStrings();
  
  var b = chrome.extension.getBackgroundPage();
  
  $('#sharewiz-enable').attr('checked','checked');
  
  // Initialize the toggle button
  if (b.ShareWiz.Settings.get("enabled", "true") == "true")
  {
    $('#sharewiz-enable').attr('checked','checked');
  }
  else
  {
    $('#sharewiz-enable').removeAttr('checked');
  }
  
  
  // TODO: Create the first time setup wizard
  // 
  //if (b.ShareWiz.Settings.Get("first-run", "false") == "true") {
  //    b.ShareWiz.Settings.Set("first-run", "false");
  //    window.close();
  //    b.StartSetupWizard()
  //}
}

function enableSharewiz()
{
    var b = chrome.extension.getBackgroundPage();

    if (b.ShareWiz.Settings.get("enabled", "true") == "true")
    {
      
      // turn off
      b.ShareWiz.logWrite("ShareWiz: turn off");
      
      b.ShareWiz.logWrite(b.ShareWiz.Settings.get("enabled", "wow"));
      b.ShareWiz.Settings.set("enabled", "false");
      b.ShareWiz.logWrite(b.ShareWiz.Settings.get("enabled", "wow2"));
      
      
      $('#sharewiz-enable').removeAttr('checked');
    }
    else
    {
      b.ShareWiz.logWrite("ShareWiz: turn on");
      b.ShareWiz.Settings.set("enabled", "true")
      $('#sharewiz-enable').attr('checked','checked');
    }
    chrome.extension.getBackgroundPage().console.log("Enable ShareWiz 2");
}

function loadLocalizedStrings() {
    document.getElementById("sharewiz-settings").innerHTML = chrome.i18n.getMessage("browseraction_settings");
    document.getElementById("sharewiz-goto").innerHTML = chrome.i18n.getMessage("browseraction_goto");
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
    document.getElementById("sharewiz-enable").addEventListener("click", function () {
        enableSharewiz()
    });
    document.getElementById("sharewiz-settings").addEventListener("click", function () {
        openSettings()
    });
    document.getElementById("xmarks-goto").addEventListener("click", function () {
        openUrl("http://sharewiz.me")
    });
});