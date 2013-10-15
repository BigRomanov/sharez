console.log("Sharez Drawer script running");
chrome.extension.sendMessage({enabled: "enabled"}, function(response) {
  // check the response
  if(response.enabled == "true") { // inject overlay if necessary
    console.log("sharez Enabled: injecting drawer");

    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'http://127.0.0.1:3000/stylesheets/drawer.css').load(function(){
      $.get("http://127.0.0.1:3000/extension", function(data){
        console.log("Adding drawer");
        $('body').append(data);
      });
    }) );
  }
});     