function createLayer(scl, off) {

	let w = width;
	let h = height / 2;
	let res = 100;

	let o = w / 10;
	let s = scl;
	
	let V = [];

	// corner start vertex
	V.push({x: -w / 2, y: -h / 2});

	// terrain vertices
	for (let i = 0; i <= res; i++) {
	
		let x = w / res * i - w / 2; 
		let k = noise(i / s + off) * o;

		let y = (-h / 2) - k;
	
		V.push({x, y});
}

	// the box below
	V.push({x: w / 2, y: -h / 2});
	V.push({x: w / 2, y: h / 2});
	V.push({x: -w / 2, y: h / 2});
	V.push({x: -w / 2, y: -h / 2});

	return V;

}

function updateLayer(scl, off, V) {
	
	let w = width;
	let h = height / 2;
	let res = 100;

	let o = w / 5;
	let s = scl;

	for (let i = 1; i <= res + 1; i++) {
		let k = noise(i / s + xoff, off) * o;	
		V[i].y = (-h / 2) - k;
	}
}
function drawLayer(x, y, verts) {
	push();
	translate(x, y);
	
beginShape();
	verts.forEach(v => vertex(v.x, v.y));
	endShape();
	pop();
}

function setupLayers() {
	layers = Array(10).fill().map((l, i) => {
		randomSeed(i);
		return {
			seed: random(0,  5000),
			pos: {x: 0, y: i * 20 + height * 0.5},
			verts: createLayer(i * 50, i * 40)
		}
	})
	xoff = 0;
	setCol(true);
}

function drawLayers() {
	layers.forEach((l, i, self) => {
		updateLayer(10 + 2 * i, l.seed, l.verts);
		noStroke();
    
    	
    let _i = i / self.length;
  	if (coloured) {
      // remapped -> x * x -> quadratic colouring
      //_i *= _i;
fill(90, 100 - 100 * _i, 10 +  200 * _i);
    } else {
			fill(225 - 225 / self.length * i);
    }
      
    drawLayer(l.pos.x, l.pos.y, l.verts);
	});
} 
function setupStars(w, h) {

	let ctx = createGraphics(w, h);


	let data = Array(200).fill().map(s => ({
		x: random(0, width),
		y: random(0, height),
		r: random(1, 5)
	}));

	console.log(data);
	return {ctx, data};

}

function updateStars(stars) {
	stars.ctx.background(0);
	stars.data.forEach((s, i) => {
		let t = frameCount / 80 + i;
		s.r = map(sin(t), -1, 1, 1, 5);
    
stars.ctx.fill(255 * noise(t * 3));
    stars.ctx.ellipse(s.x, s.y, s.r, s.r);
  });
}	
function drawStars(stars) {
	image(stars.ctx, 0, 0, stars.ctx.width, stars.ctx.height);
}

//------------------------------------------------
let layers;
let xoff;
let stars;
let coloured;

function setup() {
		
	createCanvas(1750, 800);
  
	setupLayers();
	stars = setupStars(width, height);

  
}

function draw() {
	
	xoff = frameCount / 80;	
updateStars(stars);
	drawStars(stars);

	translate(width / 2, height / 2);
	drawLayers();
  		
  
}

const setCol = b => {
  coloured = b;
  colorMode(coloured ? HSB : RGB);
}