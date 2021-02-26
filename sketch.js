let can; let canw = 400; let canh = 400;
let tileW = 50, tileH = 50;

let tiles = {}
function setup() {
    can = createCanvas(canh, canw)
    frameRate(60)
    let field = genFlowField(canw, canh, tileW, tileH)
}

function genFlowField(mapw, maph, tw, th) {
    let nRows = floor(maph / th);
    let nCols = floor(mapw / tw);
    let nTiles = nRows * nCols;
    let result = new Array(nTiles);
    for (let r = 0; r < nRows; r++) {
        for (let c = 0; c<nCols; c++){
            let ang = noise(r,c,0) * TWO_PI;
            let dir = p5.Vector.fromAngle(ang)
            result[r * nCols + c] = noise(r,c,0)
            push()
            translate(c * tw, r * th)
            rotate(dir.heading()); // "heading" in a dir
            stroke(0)
            line(0, 0, 20, 0)
            pop()
            // rect(r*tileW, c*tileH, tileW, tileH);
        }
    }
    return result;
}

function draw() {
}
