// ContextManager is responsible to determine the context of an item
// using all available data including - site url, link or image source url
// user data, etc

var NO_CONTEXT = "nocontext";

function ContextManager() {
  // Constructor
  
  // Initialize list of page contexts (TODO: Pull from server)
  this.pageContexts = {
    'lesswrong.com' : ["Logic", "Bayesian"],
    'developer.chrome.com' : ["Development", "Programming"]
  }
}

ContextManager.prototype = {
  
  // General function to determine context from present data
  getContext : function(pageUrl, linkUrl, srcUrl, selectionText) {
    
    var page = URI(pageUrl);
    
    
    var contexts = []
    // Look up in the contexts map
    var hostname = page.hostname();
        
    if (this.pageContexts.hasOwnProperty(hostname)) {
      contexts = contexts.concat(this.pageContexts[hostname])
    }
    else {
      
    }
    
    return contexts;
  }
  
}