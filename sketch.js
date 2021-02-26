let can; let canw = 400; let canh = 400;
let tileW = 20, tileH = 20;

let field, parts, nRows, nCols
let tiles = {}
function setup() {
    can = createCanvas(canh, canw)
    frameRate(60)
    field = genFlowField(canw, canh, tileW, tileH, zoff)
    let nParts = 100
    parts = genParts(nParts)
}

let inc = 0.1
let zoff = 0
function genFlowField(mapw, maph, tw, th, zoff) {
    nRows = floor(maph / th);
    nCols = floor(mapw / tw);
    let nTiles = nRows * nCols;
    let result = new Array(nTiles);
    let yoff = 0
    for (let r = 0; r < nRows; r++) {
        let xoff = 0 
        for (let c = 0; c<nCols; c++){
            let ang = noise(yoff, xoff, zoff) * TWO_PI * 4;  // * 4 iot not have it clump in one direction
            xoff += inc
            let dir = p5.Vector.fromAngle(ang)
            dir.setMag(1) // universalize mag
            // noise(r,c,0)
            result[r * nCols + c] = dir
            push()
            translate(c * tw, r * th)
            rotate(dir.heading()); // "heading" in a dir
            stroke(0)
            // line(0, 0, 15, 0)
            pop()
        }
        yoff += inc
        zoff += 0.1;  // affects overall change of flow field
    }
    return result;
}

function draw() {
    field = genFlowField(canw, canh, tileW, tileH, zoff)
    let zoff_inc = 0.0005
    zoff += zoff_inc
    for(part of parts) {
        part.followField(field, tileW, tileH, nCols)
        // part.applyForce(random(0, 10))
        part.handleWrap(canw, canh)
        part.update()
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
    this.maxspeed = 4

    this.update = function() {
        this.vel.add(this.acc)
        this.vel.limit(this.maxspeed)  // iot to stop it from building too much speed
        this.pos.add(this.vel)
        this.acc.mult(0)
    }

    this.size = 10;
    this.show = function() {
        stroke(0, 4)
        strokeWeight(4)
        point(this.pos.x, this.pos.y)
    }

    this.followField = function(field, tileW, tileH, nCols) {
        let x = Math.floor(this.pos.x / tileW);
        let y = Math.floor(this.pos.y / tileH);
        let acc = field[y * nCols + x];
        
        this.applyForce(acc)
    }

    this.applyForce = function(force) {
        this.acc.add(force)
    }

    this.handleWrap = function(canw, canh) {
        this.pos.x %= canw+1
        this.pos.y %= canh+1
        this.pos.x = this.pos.x < 0 ? canw-5 : this.pos.x;
        this.pos.y = this.pos.y < 0 ? canh-5 : this.pos.y;
    }
}
