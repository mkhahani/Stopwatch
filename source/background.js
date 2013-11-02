chrome.app.runtime.onLaunched.addListener(function() {
  init();
});

function init() {
  chrome.app.window.create('window.html', {
    id: 'stopwatch',
    frame : 'none',
    resizable: false,
    bounds: {
      width: 170,
      height: 60
    }
  });
}
