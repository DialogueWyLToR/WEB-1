const webStorageHTML = document.querySelector("#webStorage");
const webWorkersHTML = document.querySelector("#webWorkers");
const sseHTML = document.querySelector("#sse");
const geolocationHTML = document.querySelector("#geolocation");
const dragDropHTML = document.querySelector("#dragDrop");
const canvasHTML = document.querySelector("#canvas");
const svgHTML = document.querySelector("#svg");
const eventList = document.getElementById("event-list");
webStorageHTML.querySelector("#store").addEventListener("click", () => {
  const data = prompt("Mit szeretnél eltárolni?", "szia localStorage");
  localStorage.setItem("test", JSON.stringify(data));
});
webStorageHTML.querySelector("#load").addEventListener("click", () => {
  const data = JSON.parse(localStorage.getItem("test") || "[]");
  alert(data);
});
webStorageHTML.querySelector("#erase").addEventListener("click", () => {
  localStorage.removeItem("test");
  alert("Sikeres törlés");
});
webWorkersHTML.querySelector("button").addEventListener("click", startWorker);

geolocationHTML.querySelector("button").addEventListener("click", getLocation);
dragDropHTML.querySelector("#dragBox").addEventListener("dragstart", drag);
dragDropHTML.querySelector("#dropZone").addEventListener("drop", drop);
dragDropHTML.querySelector("#dropZone").addEventListener("dragover", allowDrop);
canvasHTML.querySelector("button").addEventListener("click", drawCanvas);

function startWorker() {
  if (window.Worker) {
    const worker = new Worker(
      URL.createObjectURL(
        new Blob(
          [
            `
                onmessage = function() {
                    postMessage('Üdv a Workerből!');
                }`,
          ],
          { type: "application/javascript" }
        )
      )
    );
    worker.onmessage = function (event) {
      document.getElementById("workerResult").innerText = event.data;
    };
    worker.postMessage("start");
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      document.getElementById(
        "location"
      ).innerText = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
    });
  }
}

function allowDrop(event) {
  event.preventDefault();
}
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}
function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));
}

function drawCanvas() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "blue";
  ctx.fillRect(50, 50, 100, 100);
}
