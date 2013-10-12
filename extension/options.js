// Sharewiz options (temporary)

// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("language");
  var language = select.children[select.selectedIndex].value;
  localStorage["sharewiz_language"] = language;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["sharewiz_language"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("language");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}

//document.addEventListener('DOMContentLoaded', restore_options);
//document.querySelector('#save').addEventListener('click', save_options);

function login() {
  console.log("AAAAAAAAAAAAAAAAAAAA");
  var email = $('#user_email').val();
  var password = $('#user_password').val();
  
  console.log("AAAAAAAAAAAAAAAAAAAA111");
  
  var data = {remote: true, commit: "Sign in", utf8: "✓", user: {remember_me: 1, password: password, email: email}};

  $.post('http://localhost:3000/users/sign_in.json', data, function(resp) {
    if(resp.success) {
      // process success case
      alert('Success');
    } else {
      // let the user know they failed authentication
      alert("Failed");
    }
  });
  return false;
}

$(document).ready(function() {
    console.log("In options page ready");
    $("#user_login").click(function() {
      login();
      return false;
    });
    
    createDropDown();

    $(".dropdown dt a").click(function() {
        $(".dropdown dd ul").toggle();
    });

    $(document).bind('click', function(e) {
        var $clicked = $(e.target);
        if (! $clicked.parents().hasClass("dropdown"))
            $(".dropdown dd ul").hide();
    });

    $(".dropdown dd ul li a").click(function() {
        var text = $(this).html();
        $(".dropdown dt a").html(text);
        $(".dropdown dd ul").hide();

        var source = $("#source");
        source.val($(this).find("span.value").html())
    });
});

function createDropDown(){
    var source = $("#language");
    var selected = source.find("option[selected]");
    var options = $("option", source);

    $("#language_options_div").append('<dl id="target" class="dropdown"></dl>')
    $("#target").append('<dt><a href="#">' + selected.text() + 
        '<span class="value">' + selected.val() + 
        '</span></a></dt>')
    $("#target").append('<dd><ul></ul></dd>')

    options.each(function(){
        $("#target dd ul").append('<li><a href="#">' + 
            $(this).text() + '<span class="value">' + 
            $(this).val() + '</span></a></li>');
    });
}