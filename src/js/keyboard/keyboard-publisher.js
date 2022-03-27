function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

function getROSBridgeURL() {
  var secure = getUrlVars()['secure'];
  if (secure && (secure == "1" || secure == "true")) {
      secure = true;
  }
  else{
      secure = undefined;
  }

  var rosbridgeURL = getUrlVars()["rosbridge_url"]; // ws://localhost:9090 or localhost:9090
  rosbridgeURL = decodeURIComponent(rosbridgeURL);
  if (!rosbridgeURL) {
    return "ws://localhost:9090";
  }

  // if protocol already exists, simply return
  if (rosbridgeURL.startsWith("ws://") || rosbridgeURL.startsWith("wss://")) {
    return rosbridgeURL;
  }

  // if protocol is not provided, we have to infer ws protocol
  var protocol = window.location.protocol;
  var websocketProtocol = 'ws://';
  var secureWebsocketProtocol = 'wss://';
  if (!secure && protocol == 'http:') {  // if insecure, return http (because we're probably in local)
    return websocketProtocol + rosbridgeURL;
  }

  // if secure, return wss, because we're in production
  return secureWebsocketProtocol + rosbridgeURL
}

var rosbridgeURL = getROSBridgeURL();

var keyboardUp;
var keyboardDown;

let keysPressed = {}

document.addEventListener("keydown", e => {
  keysPressed[e.key] = true;
  const key = Object.keys(keysPressed).join(",")
  var message = new ROSLIB.Message({ data: key });
  keyboardDown.publish(message);
});

document.addEventListener("keyup", e => {
  delete keysPressed[e.key]
  var message = new ROSLIB.Message({ data: e.key });
  keyboardUp.publish(message);
});

var ros = new ROSLIB.Ros({
  url: rosbridgeURL
});

ros.on("connection", function () {
  console.log("Connected to websocket server.");
});

ros.on("error", function () {
  setTimeout(function () {
    ros.connect(rosbridgeURL);
  }, 1000);
});

keyboardDown = new ROSLIB.Topic({
  ros: ros,
  name: "/keyboard_down",
  messageType: "std_msgs/String"
});

keyboardUp = new ROSLIB.Topic({
  ros: ros,
  name: "/keyboard_up",
  messageType: "std_msgs/String"
});
