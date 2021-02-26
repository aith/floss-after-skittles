let can; let canw = 800; let canh = 800;
let tileW = 20, tileH = 20;

let field, parts, nRows, nCols
let tiles = {}
function setup() {
    can = createCanvas(canh, canw)
    frameRate(60)
    let nParts = 200
    parts = genParts(nParts)
    background("#f7f5f1")
}

let inc = 0.1
let zoff = 0
function genFlowField(mapw, maph, tw, th, zoff, z_inc) {
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
            dir.setMag(0.6) // universalize mag, change flow monality
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
        zoff += z_inc
    }
    return result;
}

function draw() {
    let zinc = 0.0005
    field = genFlowField(canw, canh, tileW, tileH, zoff, zinc)
    zoff += zinc
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
    this.color = doColor(0,0,0,random(0,1), 0);
    this.maxspeed = 3

    this.update = function() {
        this.vel.add(this.acc)
        this.vel.limit(this.maxspeed)  // iot to stop it from building too much speed
        this.pos.add(this.vel)
        this.acc.mult(0)
    }

    this.size = 10;
    this.show = function() {
        // stroke(0, 4)
        let c = this.color
        stroke(c[0], c[1], c[2], 34)
        // strokeWeight(4)
        ellipse(this.pos.x, this.pos.y, 1, 1)
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
        if (this.pos.x > canw) {
            this.pos.x = 0;
        }
        if (this.pos.x < 0) {
            this.pos.x = canw;
        }
        if (this.pos.y > canh) {
            this.pos.y = 0;
        }
        if (this.pos.y < 0) {
            this.pos.y = canh;
        }
    }
}

let index = 0.5 // 0  to 1 === t
// trying out inigo quillez' procedural color palette
function doColor(a, b, c, t, d) {
    a = [0.5,0.5,0.5]
    b = [0.5,0.5,0.5]
    c = [1,1,1]
    let first = [a[0], a[1], a[2]]
    let d2 = random(0.33, 0.33)
    let d3 = random(d2, 0.67)
    d = [0, d2, d3]
    let second = [
        b[0]*cos((2*PI*(c[0]*t+d[0]))),
        b[1]*cos((2*PI*(c[1]*t+d[1]))),
        b[2]*cos((2*PI*(c[2]*t+d[2])))
    ]
                 
    let result = [
        (first[0] + second[0]) * 255,
        (first[1] + second[1]) * 255,
        (first[2] + second[2]) * 255
    ]
    return result
}

