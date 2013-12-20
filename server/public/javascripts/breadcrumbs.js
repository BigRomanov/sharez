// Module responsible for breadcrumb management
// TODO: Make part of larger - UI state solution

var breadcrumbs = (function() {

  // Private 
  var container = null;
  var path = [];

  //Public
  return {
    setContainer : function(container) {
      this.container = container;
    },
    render : function() {
      var text = ""
      var path = this.path;
      for(var i = 0; i < path.length; i++)
      {
        text += path[i];
        text += " >> "; // add separator
      }

      this.container.empty();
      this.container.append('<p class="breadcrumb">'+text+'</p>')
    },

    set :function(path) {
      this.path = path;
    }
  }

}());
