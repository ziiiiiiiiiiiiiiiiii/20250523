let faceMesh;
let predictions = [];
const lipIndices = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];

function setup() {
  let cnv = createCanvas(640, 480);
  cnv.style('display', 'block');
  cnv.parent(document.body);
  cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  // 啟用視訊
  let video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 啟用ml5 facemesh
  faceMesh = ml5.facemesh(video, () => {
    console.log('FaceMesh ready');
  });
  faceMesh.on('predict', results => {
    predictions = results;
  });
}

function draw() {
  background(220);

  if (predictions.length > 0) {
    let keypoints = predictions[0].scaledMesh;
    stroke(255, 0, 0);
    strokeWeight(15); // 更粗
    noFill();
    for (let i = 0; i < lipIndices.length - 1; i++) {
      let idxA = lipIndices[i];
      let idxB = lipIndices[i + 1];
      let [x1, y1] = keypoints[idxA];
      let [x2, y2] = keypoints[idxB];
      line(x1, y1, x2, y2);
    }
    // 收尾，連接最後一點到第一點
    let [xStart, yStart] = keypoints[lipIndices[0]];
    let [xEnd, yEnd] = keypoints[lipIndices[lipIndices.length - 1]];
    line(xEnd, yEnd, xStart, yStart);
  }
}
