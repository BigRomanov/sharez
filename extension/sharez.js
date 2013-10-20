// //////////////////////////////////////////////////////////////////
function OpenExtensionUrl(a, d) {
    function b(f) {
        for (var i = false, g = 0; g < f.length; g++) {
            var h = f[g];
            if (h.url.indexOf(c) == 0) {
                chrome.tabs.update(h.id, {
                    url: e,
                    selected: true
                });
                i = true;
                break
            }
        }
        i || chrome.tabs.create({
            url: e,
            selected: true
        })
    }
    var c = chrome.extension.getURL(a),
        e = c;
    if (d) e += "?" + d;
    chrome.windows.getCurrent(function (f) {
        chrome.tabs.getAllInWindow(f.id, b)
    })
}



// ////////////////////////////////////////////////////////////////// 
function sharezSettings() {
    this.loadSettings()
}
sharezSettings.VERSION = "0.0.1";
sharezSettings.SERVER_ROOT = "sharez.me";
sharezSettings.prototype = {
    prefs: {},
    get: function (a, b) {
        if (this.prefs.hasOwnProperty(a)) return this.prefs[a];
        return b
    },
    getInt: function (a, b) {
        var c = this.get(a, b);
        return parseInt(c)
    },
    getBool: function (a, b) {
        return this.get(a, b) == "true" ? true : false
    },
    set: function (a, b, c) {
        b = String(b);
        this.prefs[a] = b;
        c && localStorage.setItem("pref-" + a, b)
    },
    remove: function (a) {
        delete this.prefs[a];
        localStorage.removeItem("pref-" + a)
    },
    loadSettings: function () {
      
        // Parsing version, TODO: Refactor as this does not correspond to convention
        function a(f, e, g) {
            f = f.split(".");
            e = e.split(".");
            for (var i = f.length > e.length ? f.length : e.length, h = 0; h < i; h++) {
                if (g && h > 1) break;
                var j = f.length > h ? parseInt(f[h]) : 0,
                    k = e.length > h ? parseInt(e[h]) : 0;
                if (j > k) return -1;
                else if (k > j) return 1
            }
            return 0
        }
        
        // Iterate over local storage and get all prefs
        for (var b = 0; b < localStorage.length; b++) {
            var c = localStorage.key(b);
            c.indexOf("pref-") == 0 && this.set(c.substr(5), localStorage.getItem(c))
        }
        
        // Update the server-root 
        this.get("server-root") || this.set("server-root", sharezSettings.SERVER_ROOT);
        
        // Set enabled by default
        this.get("enabled") || this.set("enabled", "true");
        
        if (b = this.get("version")) {
            if (a(sharezSettings.VERSION, b) < 0) {
                //a(sharezSettings.VERSION, b, true) != 0 && this.set("major-upgrade-run", true);
                this.set("version", sharezSettings.VERSION, true);
                //this.Set("upgrade-run", true)
            }
        } else {
            this.set("version", sharezSettings.VERSION, true);
            this.set("first-run", true)
        }
        
        // Initalize urls 
        b = this.get("server-root");
        c = {
            webserver: "www."
            //authserver: "login.",
            //cloudserver: "cloud.",
            //staticserver: "static.",
            //syncserver: "sync."
        };
        for (var d in c) this.get(d) || this.set(d, c[d] + b)
    },
    getMachineId: function () {
        var a = this.get("machineId");
        if (!a) {
            a = Date.now().toString(36);
            this.set("machineId", a, true)
        }
        return a
    },
    logWrite: function (a) {
        if (this.getBool("disableLogging", "false") == false) {
            var b = new Date,
                c = b.getMonth() + 1,
                d = b.getDate(),
                f = b.getFullYear(),
                e = b.getHours(),
                g = b.getMinutes();
            if (g < 10) g = "0" + g;
            b = b.getSeconds();
            if (b < 10) b = "0" + b;
            console.log("[" + c + "/" + d + "/" + f + " " + e + ":" + g + ":" + b + "] " + a)
        }
    }
};

// ///////////////////////////////////////////////////////////////////////////
function ExtensionListener(a, d) {
}

// ///////////////////////////////////////////////////////////////////////////
function sharezSingleton() {}

sharezSingleton.prototype={
  ContextManager: new ContextManager,
  Settings: new sharezSettings,
  
  logWrite: function (a) {
      this.Settings.logWrite(a)
  },
  
  getContext : function(pageUrl, linkUrl, srcUrl, selectionText) {
    return this.cm.getContext(pageUrl, linkUrl, srcUrl, selectionText);
  }
};

var sharez = new sharezSingleton;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.enabled != 'undefined')
    {
      // Context script 
      var b = chrome.extension.getBackgroundPage();
      var sharezEnabled = b.sharez.Settings.get("enabled", "true");

      if (sharezEnabled === "true") 
      {
        var hostname = $('<a>').prop('href', sender.tab.url).prop('hostname');
        console.log(hostname);
        // check if this extension is enabled for this domain
        if (hostname === "localhost")
        {
            sharezEnabled = "false";
        }
      }

      sendResponse({enabled: sharezEnabled});
    }
  });
