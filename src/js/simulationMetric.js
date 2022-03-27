const TOPIC_NAME = "/simulation_metrics";
var IS_METRIC_INITIALIZED = false;

function displayInitialContent() {
  const container = `
  <div id="riders-simulation-metrics">
    <div class="ant-row-flex ant-row-flex-center">
    <div class="ant-col ant-col-20">
        <div id="stat-content" class="ant-row-flex" style="margin-left: -24px; margin-right: -24px;">
        <!-- CONTENT -->
        </div>
    </div>
    <i aria-label="icon: shrink" class="anticon anticon-shrink minimize icon" onClick="minimize()">
    <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg>
    </i>
    </div>
  </div>
  <i aria-label="icon: arrows-alt" class="anticon anticon-arrows-alt icon hidden" id="maximize-icon" onClick="maximize()">
  <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 0 0 140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"></path></svg>
  </i>
`;
  document.getElementById("riders-simulation-metrics-container").innerHTML = container;
}

function getText(key) {
  const keyToText = {
    distance_to_checkpoint: "Distance to the checkpoint"
  };
  if (key in keyToText) {
    return keyToText[key];
  }
  return key.split("_").join(" ");
}

function updateContent(data) {
  var output = "";
  Object.keys(data).map(key => {
    var result = data[key];
    output += `
    <div class="ant-col ant-col-6" style="padding:2px 10px;">
      <div class="ant-row-flex">
        <div class="ant-col title">${getText(key)}</div>
        <div class="ant-col" style="padding-left: 5px; padding-right: 5px;">:</div>
        <div class="ant-col">${result}</div>
      </div>
    </div>`;
  });
  document.getElementById("stat-content").innerHTML = output;
}

function minimize() {
  document.getElementById("riders-simulation-metrics").classList.add("hidden");
  document.getElementById("maximize-icon").classList.remove("hidden");
}

function maximize() {
  document.getElementById("riders-simulation-metrics").classList.remove("hidden");
  document.getElementById("maximize-icon").classList.add("hidden");
}

var listener = new ROSLIB.Topic({
  ros: ros,
  name: TOPIC_NAME,
  messageType: "std_msgs/String"
});

listener.subscribe(function(message) {
  if (!message.data) {
    return;
  }
  const data = JSON.parse(message.data);
  if (data && Object.keys(data).length > 0) {
    if (!IS_METRIC_INITIALIZED) {
      displayInitialContent();
      IS_METRIC_INITIALIZED = true;
    }
    updateContent(data);
  }
});