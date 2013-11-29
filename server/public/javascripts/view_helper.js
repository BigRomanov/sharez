// Converts newline (\n) witin text to <p> blocks
function cnvNlToP(text)
{
  console.log("Conerting new line to paragraph")
  var output = "";
  var pos    = 0;

  for (var i = 0, len = text.length; i < len; i++) {
    if (text[i] === '\n') {
      output += "<p>"+text.slice(pos, i)+"</p>";
      pos = i;
    }
  }

  if (text[i-1] != '\n') {
    // if text did not end with \n, wrap the last part
    output += "<p>"+text.slice(pos, i)+"</p>";
  }

  return output;
}