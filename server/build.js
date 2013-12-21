// ShareZ build script


console.log("Building templates");
var templatizer = require('templatizer');
templatizer(__dirname + '\\views\\templates', __dirname + '\\public\\javascripts\\snippets.js');


console.log("BUILD COMPLETE");