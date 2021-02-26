let can; let canw = 400; let canh = 400;
let tileW = 20, tileH = 20;

let field, parts
let tiles = {}
function setup() {
    can = createCanvas(canh, canw)
    frameRate(60)
    field = genFlowField(canw, canh, tileW, tileH)
    let nParts = 100
    parts = genParts(nParts)
    print(parts)
}

let inc = 0.1
function genFlowField(mapw, maph, tw, th) {
    let nRows = floor(maph / th);
    let nCols = floor(mapw / tw);
    let nTiles = nRows * nCols;
    let result = new Array(nTiles);
    let yoff = 0
    for (let r = 0; r < nRows; r++) {
        let xoff = 0 
        for (let c = 0; c<nCols; c++){
            let ang = noise(yoff, xoff) * TWO_PI;
            xoff += inc
            let dir = p5.Vector.fromAngle(ang)
            result[r * nCols + c] = noise(r,c,0)
            push()
            translate(c * tw, r * th)
            rotate(dir.heading()); // "heading" in a dir
            stroke(0)
            line(0, 0, 15, 0)
            pop()
        }
        yoff += inc
    }
    return result;
}

function draw() {
    for(part of parts) {
        part.applyForce(random(0, 10))
        part.show()
    }
}

function genParts(nParts) {
    let result = []
    for(let i = 0; i < nParts; i++) {
        result.push(new Particle());
    }
    return result
}

function Particle() {
    this.pos = createVector(
        random(0, canw) | 0,
        random(0, canh) | 0
    )
    this.vel = createVector(0,0)
    this.acc = createVector(0,0)

    this.update = function() {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        this.acc.mult(0)
    }

    this.size = 10;
    this.show = function() {
        ellipse(this.pos.x, this.pos.y, this.size, this.size)
    }

    this.applyForce = function(force) {
        this.acc.add(force)
    }
}
