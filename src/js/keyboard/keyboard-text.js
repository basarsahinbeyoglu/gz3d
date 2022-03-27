function setKeyboardText(hasFocus) {
  var text = '<img src="./img/keyboard.svg" />';
  if (hasFocus) {
    text = '<img class="filter-green-svg" src="./img/keyboard.svg" />';
  }
  document.getElementById("keyboard-info").innerHTML = text;
}
window.addEventListener("load", function() {
  window.addEventListener("focus", function() {
    setKeyboardText(true);
  });
  window.addEventListener("blur", function() {
    setKeyboardText(false);
  });
  setKeyboardText(document.hasFocus());
});
