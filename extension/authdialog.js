

var xm_callback = null,
    xm_action = null;

function HandleAction(a) {
    if (!xm_action) {
        xm_action = a;
        var b = {};
        if (a == "auth") {
            b.username = document.getElementById("username").value;
            b.password = Base64.encode(document.getElementById("password").value);
            b.remember = document.getElementById("remember").checked ? true : false
        }
        xm_callback(top, b)
    }
}

function HandleLoad() {
    LoadLocalizedStrings();
    var a = chrome.extension.getBackgroundPage().Xmarks.Settings.GetWindowParams();
    document.getElementById("username").focus();
    if (a) {
        xm_callback = a.callback;
        if (a.username) document.getElementById("username").value = a.username;
        if (a.password) document.getElementById("password").value = Base64.decode(a.password);
        document.getElementById("remember-span").style.display = a.forceRequest ? "none" : ""
    }
}

function LoadLocalizedStrings() {
    document.title = chrome.i18n.getMessage("authdialog_title");
    document.getElementById("auth-title").innerHTML = chrome.i18n.getMessage("authdialog_title");
    document.getElementById("auth-message-username").innerHTML = chrome.i18n.getMessage("authdialog_username");
    document.getElementById("auth-message-password").innerHTML = chrome.i18n.getMessage("authdialog_password");
    document.getElementById("auth-message-remember").innerHTML = chrome.i18n.getMessage("authdialog_remember");
    document.getElementById("auth-button-login").value =
        chrome.i18n.getMessage("dialog_login");
    document.getElementById("auth-button-cancel").value = chrome.i18n.getMessage("dialog_cancel")
}
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("load", function () {
        HandleLoad()
    });
    window.addEventListener("unload", function () {
        HandleAction("cancel")
    });
    document.getElementById("xmform").onsubmit = function () {
        HandleAction("auth")
    };
    document.getElementById("auth-button-cancel").addEventListener("click", function () {
        HandleAction("cancel")
    })
});