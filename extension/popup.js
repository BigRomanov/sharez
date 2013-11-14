var HistoryAnalyzer = function() {

}

HistoryAnalyzer.onClick = function()
{
  alert("Clicked");
}

HistoryAnalyzer.prototype.showResults = function(data)
{
  console.log("Showing results2");
  var ul = document.createElement('ul');
  $("#analyzer_results").append(ul);
  console.log("Showing results3");

  console.log(data);

  for (var i = 0, ie = data.length; i < ie; ++i) {
    var a = document.createElement('a');
    a.href = data[i];
    a.appendChild(document.createTextNode(data[i]));
    a.addEventListener('click', HistoryAnalyzer.onClick);

    var li = document.createElement('li');
    li.appendChild(a);

    ul.appendChild(li);
  }
}

HistoryAnalyzer.prototype.analyzeHistory = function()
{
  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
  var self = this;
  chrome.history.search({
      'text': '',              // Return every history item....
      'startTime': oneWeekAgo  // that was accessed less than one week ago.
    },
    function(historyItems) {
      // For each history item, get details on all visits.
      items = [];
      for (var i = 0; i < historyItems.length; ++i) {
        console.log(historyItems[i])
        var url = historyItems[i].url;
        items.push(url);
        var processVisitsWithUrl = function(url) {
          // We need the url of the visited item to process the visit.
          // Use a closure to bind the  url into the callback's args.
          return function(visitItems) {
            processVisits(url, visitItems);
          };
        };
        //chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
      }
      console.log("Showing results");
      self.showResults(items);      
    });
}


console.log("ZZZZZZZZZZZZZZZZ");
// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  var a = new HistoryAnalyzer();
  console.log("Here we are");
  a.analyzeHistory();

  $(document.body).append($('<p>Finished</p>'));
});
