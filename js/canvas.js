// Some functions in global scope to interoperate with the
// non-paperscript code:
globals.updateStyle = function() {
	activeKnot.strokeWidth = globals.strokeWidth;
	activeKnot.strokeColor = globals.strokeColor;
}
globals.undo = function(){popUndo();}
globals.straighten = function(){activeKnot.clearHandles();showIntersections();globals.smooth = false;}
globals.toSVG = function(){return project.exportSVG({bounds:'content'});}
globals.toJSON = function() { // Does not work for multiple knots
	var obj = activeKnot.exportJSON({asString:false});
	return JSON.stringify([obj, intersectionWatcher]);
}
globals.fromJSON = function(jsonString) { // Does not work for multiple knots
	var obj = JSON.parse(jsonString);
	activeKnot.importJSON(JSON.stringify(obj[0]));
	var intersections = obj[1];
	intersectionWatcher = [[],[]];
	for (var k = 0; k < intersections[1].length; k++) {
		intersectionWatcher[1][k] = intersections[1][k];
		intersectionWatcher[0][k] = new Point(intersections[0][k][1], intersections[0][k][2]);
	}
}
globals.select = function(){
	var bool = activeKnot.fullySelected;
	activeKnot.fullySelected = false;
	activeKnot.fullySelected = !bool;
	hitOptions.handles = true;
}
globals.draw = function(){drawing = true; project.clear();globals.smooth=false;}

globals.toTikz = function(scale) {
	// Tikz's coordinates go down, not up
	activeKnot.scale(1,-1);

	// This is the preamble to initialise and style the knot
	var out = "\\begin{tikzpicture}\n\\begin{knot}[consider self intersections=no splits,end tolerance=1pt,line join=round,clip width=1,ignore endpoint intersections=true,background color=red,every intersection/.style={line width=4pt,only when rendering/.style={draw=white,line width=2pt,double=none,}},only when rendering/.style={red,line width=1pt,double=white,double distance=2pt,},flip crossing/.list={1,3,5,7}]\n\\strand\n";

	var l = activeKnot.curves.length;
	function pointToString(p) {
		return "(" + Math.round(p.x)/100 + ',' + Math.round(p.y)/100 + ')'
	}

	for (var k = 0; k < l; k++) {
		points = activeKnot.curves[k].points;

		// Defining the strand through cubic bezier curves (Paper Script doesn't support string templates)
		out += pointToString(points[0]) + ".. controls " + pointToString(points[1]) + " and " + pointToString(points[2]) + " .. " + pointToString(points[3]) + (k == l - 1 ? ';\n' : '--\n');
	}

	out += '\\end{knot}\n\\end{tikzpicture}';

	activeKnot.scale(1,-1);
	return out;
}

var hitOptions = {
	segments: true,
	stroke: true,
	handles: false,
	fill: true,
	tolerance: 5
};

var intersectionWatcher = [[],[]];

var neighbors = 1;

var drawing = false;
var intersectionRadius = 1;
var strokeColor = 'black';


var knot = new Path();
knot.strokeColor = strokeColor;
knot.strokeWidth = window.globals.strokeWidth;
knot.selected = true;
knot.data = {kind: 'knot'};
var activeKnot = knot.clone();
knot.remove();

// We display this pretty Conway knot as a default
var conway = '[["Path",{"applyMatrix":true,"data":{"z":[120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,650,660,670,680,690,700,710,720,730,740,750,760,770,780,790,800,810,820,830,840,850,860,870,880,890,900,910,920,930,940,950,960,970,980,990]},"segments":[[[421.28466,231.56804],[-21.98799,34.57871],[21.98799,-34.57871]],[[541.15302,119.60118],[-42.61808,20.11501],[42.61808,-20.11501]],[[617.04883,144.11296],[-3.30386,-27.58365],[3.30386,27.58365]],[[577.8222,230.56682],[19.16436,-20.74603],[-19.16436,20.74603]],[[530.24102,254.85465],[13.45425,-0.17392],[-13.45425,0.17392]],[[478.36779,223.2304],[26.47305,28.77815],[-26.47305,-28.77815]],[[414.19627,110.11536],[-3.3017,29.80063],[3.3017,-29.80063]],[[493.65076,93.74515],[-28.54922,-18.49541],[28.54922,18.49541]],[[550.60688,182.40743],[-18.91202,-28.11106],[18.91202,28.11106]],[[608.26824,251.27713],[-10.42017,-26.59232],[10.42017,26.59232]],[[581.63596,333.43788],[29.5636,-16.5501],[-29.5636,16.5501]],[[489.83504,315.17333],[10.59895,28.89652],[-10.59895,-28.89652]],[[514.97928,197.83947],[-5.30273,36.56243],[5.30273,-36.56243]],[[467.17824,137.31252],[33.26876,2.71457],[-33.26876,-2.71457]],[[366.41896,184.08378],[20.78802,-33.66503],[-20.78802,33.66503]],[[371.42595,304.71931],[-20.66856,-35.46123],[20.66856,35.46123]],[[462.11965,357.62161],[-33.81448,1.97211],[33.81448,-1.97211]],[[528.96498,310.4633],[-1.61257,21.82881],[1.61257,-21.82881]],[[454.88923,264.90073],[47.49517,3.43354],[-47.49517,-3.43354]],[[322.21835,297.89199],[18.37851,-22.99166],[-18.37851,22.99166]],[[358.58189,353.71775],[-24.70188,-0.28391],[24.70188,0.28391]],[[406.35977,300.17742],[-3.7124,21.84188],[3.7124,-21.84188]]],"closed":true,"strokeColor":[0,0,0],"strokeWidth":5}],[[["Point",452.37472,191.95975],["Point",498.30283,148.00243],["Point",523.24666,129.67566],["Point",586.10668,220.81536],["Point",501.39462,244.86085],["Point",422.07864,143.3116],["Point",513.22797,337.04625],["Point",492.48581,272.25192],["Point",359.28646,276.59666],["Point",393.06553,331.55003],["Point",407.33358,266.33317]],[true,false,true,false,true,true,true,false,false,true,false]]]'
globals.fromJSON(conway);

// We add a second layer to display intersections
var intersectionLayer = new Layer();

var intersections = activeKnot.getIntersections(activeKnot);

// We initialise a Stack for Undoing:
var undoStack = [];

function pushUndo() {if (undoStack.length > 40) undoStack.shift(); undoStack.push(globals.toJSON());}
function popUndo() {if (undoStack.length > 0) {globals.fromJSON(undoStack.pop());typesetInvariants();}}
pushUndo();

function showIntersections() {
	intersectionLayer.removeChildren();
	intersections = activeKnot.getCrossings(activeKnot);

	// Let's map observed intersections to previous intersections
	// First, the case when an intersection was added:
	if (intersectionWatcher[0].length < intersections.length) {
		var bools = Array(intersections.length).fill(false);

		for (var i = 0; i < intersectionWatcher[0].length; i++) {
			var previous = intersectionWatcher[0][i];

			// we calculate the index in //intersections// of the point that is closest to //previous//.
			var min = 99999999999999;
			var min_index = 0;
			for (var k = 0; k < intersections.length; k++) {
					var distance = intersections[k].point.getDistance(previous);
					if (distance < min) {
						min = distance;
						min_index = k;
					}
			}
			// We copy the over-under boolean from this minimal value
			bools[min_index] = intersectionWatcher[1][i];
		}

		intersectionWatcher[1] = bools;
	}

	// Next, the case when intersections were deleted:
	else if (intersectionWatcher[0].length >= intersections.length) {
		var bools = Array(intersectionWatcher[0].length).fill(false);

		for (var i = 0; i < intersections.length; i++) {
			var intersection = intersections[i].point;

			// we calculate the index in //intersectionWatcher[0]// of the point that is closest to //intersection//.
			var min = 99999999999999;
			var min_index = 0;
			for (var k = 0; k < intersectionWatcher[0].length; k++) {
					var distance = intersectionWatcher[0][k].getDistance(intersection);
					if (distance < min) {
						min = distance;
						min_index = k;
					}
			}
			// We copy the over-under boolean from this minimal value
			bools[i] = intersectionWatcher[1][min_index];
		}

		intersectionWatcher[1] = bools;
	}

	for (var i = 0; i < intersections.length; i++) {
		var intersect = intersections[i];
		intersectionWatcher[0][i] = intersect.point;
	}

	for (var i = 0; i < intersections.length; i++) {
			var intersect = intersections[i];

			// This would need to be two variables for multiple knots.
			var path = intersect.path;
			var center = intersect.point;

			var i1 = intersect.curve.index;
			var i2 = intersect.intersection.curve.index;

			intersect.curve.data = {};

			var curve1 = intersect.curve;
			var curve2 = intersect.intersection.curve;
			var t1 = intersect.time;
			var t2 = intersect.intersection.time;

			var tangent1 = intersect.tangent;
			var tangent2 = intersect.intersection.tangent;

			if (intersectionWatcher[1][i]) {
				t1 = intersect.intersection.time;
				t2 = intersect.time;
				tangent1 = intersect.intersection.tangent;
				tangent2 = intersect.tangent;
				curve1 = intersect.intersection.curve;
				curve2 = intersect.curve;
			}
			var radius = (15 * Math.abs(tangent1.dot(tangent2)) + 2 * globals.strokeWidth) / curve1.length;
			var segments = [curve1.getPart(t1 - radius, t1 + radius).segment1.clone(), curve1.getPart(t1 - radius, t1 + radius).segment2.clone()];

			var path = new Path({
					segments: segments,
					strokeColor: 'white',
					strokeWidth: window.globals.gapWidth * window.globals.strokeWidth,
					data: {kind: 'intersection', i1: i, path: path}
			});

			var path2 = new Path({
					segments: segments,
					strokeColor: window.globals.showIntersections ? 'red' : window.globals.strokeColor,
					strokeWidth: window.globals.strokeWidth,
					locked: true
			});
	}
}

function alexanderPolynomial() {
	showIntersections();
	intersections = activeKnot.getCrossings(activeKnot);
	if (intersections.length == 0) {
		return '0';
	}
	underTimes = [];

	for (var i = 0; i < intersections.length; i++) {
			var intersect = intersections[i];
			if (intersectionWatcher[1][i]) {
				underTimes.push(intersect.time + intersect.index);
			}
			else {
				underTimes.push(intersect.intersection.time + intersect.intersection.index);
			}
	}
	underTimes.sort(function(a, b){return a-b});

	function getStrand(time) {
		if (time <= underTimes[0] || time > underTimes[underTimes.length - 1]) {
			return 0;
		}
		for (var k = 1; k < underTimes.length; k++) {
			if (time <= underTimes[k]) {
				return k;
			}
		}
	}

	matrix = [];
	for (var i = 0; i < intersections.length -1; i++) {
		var intersect = intersections[i];
		over = getStrand(intersect.time + intersect.index);
		under1 = getStrand(intersect.intersection.time + intersect.intersection.index);

		// Swap over and under depending on whether the crossing goes over or under
		if (intersectionWatcher[1][i]) {
			over = [under1, under1 = over][0];
		}
		under2 = (under1 + 1) % (intersections.length);

		// The entries swap if the crossing is left or right handed
		var inverted = intersect.tangent.cross(intersect.intersection.tangent) < 0;
		if (intersectionWatcher[1][i]) under2 = [under1, under1 = under2][0];
		if (inverted) {under2 = [under1, under1 = under2][0];}
		row = Array(intersections.length).fill(0);
		row[over] += polyToInt([1,-1]);
		row[under1] += polyToInt([-1]);
		row[under2] += polyToInt([0,1]);
		matrix.push(row.slice(0,intersections.length - 1));
	}

	var polynomial = intToPoly(det(matrix));
	var out = [];
	var flag = 0;
	for (var k = 0; k < polynomial.length; k++) {
		var coeff = polynomial[k];
		if (flag == 0) {
			if (coeff != 0) {
				flag = coeff > 0 ? 1 : -1;
				out.push(flag * coeff);
			}
		} else {
			out.push(flag * coeff);
		}
	}

	return out;
}

function alexanderString() {
	var p = alexanderPolynomial();
	var out = "\\( p(t) = ";
	var l = p.length;
	for (var k = 0; k < l; k++) {
		var coeff = p[k];
		var exponent = (l - 1) / 2 - k;
		out += (coeff > 0 && k != 0 ? "+" : "");
		out += coeff.toString();
		out += exponent != 0 ? "t^{" + exponent.toString() + "}" : "";
	}
	out += "\\)";
	return out
}

function typesetInvariants() {
	polynomial.innerHTML = alexanderString();
	MathJax.typeset();
}

var segment, path, handleIn, handleOut;
var movePath = false;
var drawn;
function onMouseDown(event) {
		if (drawing) {
			project.clear(); // This would be different for more than one knot

			drawn = new Path({
					segments: [event.point],
					strokeColor: 'black',
					strokeWidth: window.globals.strokeWidth,
					fullySelected: true,
					data: {z: []}
			});
			intersectionLayer = new Layer();

			return;
		}

		pushUndo();

		segment = handleIn = handleOut = null;
		var hitResult = project.hitTest(event.point, hitOptions);

		if (!hitResult) {
				activeKnot.selected = !activeKnot.selected;
				hitOptions.handles = false;
				return;
		}

		if (event.modifiers.shift) {
				if (hitResult.type == 'segment') {
						hitResult.segment.remove();
				}
				return;
		}

		if (event.modifiers.control) {
				if (hitResult.type == 'segment') {
						var seg = hitResult.segment;
						seg.handleIn = (seg.previous.point - seg.next.point) / 4;
						seg.handleOut = -seg.handleIn;
				}
		}

		if (hitResult) {
				if (hitResult.item.data.kind == 'intersection') {
					activeKnot = hitResult.item.data.path;
					var i = hitResult.item.data.i1;
					intersectionWatcher[1][i] = !(intersectionWatcher[1][i]);
				}
				else if (hitResult.type == 'segment') {
						activeKnot = hitResult.item;
						segment = hitResult.segment;

						activeKnot.selected = true;
				} else if (hitResult.type == 'stroke') {
						activeKnot = hitResult.item;
						var location = hitResult.location;
						activeKnot.selected = true;
						segment = activeKnot.insert(location.index + 1, event.point);
				}
				else if (hitResult.type == 'handle-in') {
					handleIn = hitResult.segment;
				}
				else if (hitResult.type == 'handle-out') {
					handleOut = hitResult.segment;
				}
			}

		showIntersections();
}

function onMouseMove(event) {
		if (!drawing) {
			showIntersections();
		}
}
function onMouseUp(event) {
	if (drawing) {
		if (globals.smooth) {drawn.simplify();}
		drawn.simplify(15);
		drawn.fullySelected = true;

		drawn.closed = true;
		drawing = false;

		activeKnot = drawn.clone();
		drawn.remove();
	}

	else {
		if (globals.smooth) activeKnot.smooth('geometric', 1);
		typesetInvariants();
	}
}

function onMouseDrag(event) {
		if (drawing) {
			drawn.add(event.point);
			return;
		}
		if (segment) {

			segment.point += event.delta;

			var next = segment;
			var previous = segment;
			var delta = event.delta;
			for (var i=0; i < window.globals.neighbors; i++) {
				next = next.next;

				delta *= 0.5;
				previous = previous.previous;
				next.point += delta;
				previous.point += delta;
			}

			}

		else if (handleIn) {
			handleIn.handleIn += event.delta; // This doesn't work sometimes, for some reason
		}
		else if (handleOut) {handleOut.handleOut += event.delta;}
		showIntersections();

		typesetInvariants();
}
typesetInvariants()

var speed = 10;
var angularSpeed = 3;
function onKeyDown(event) {
	var delta = new Point(0,0);
	if(event.key == 'a') {
		delta.x -= speed;
	}
	else if(event.key == 'd') {
		delta.x += speed;
	}
	if(event.key == 'w') {
		delta.y -= speed;
	}
	else if(event.key == 's') {
		delta.y += speed;
	}
	activeKnot.translate(delta);

	if(event.key == 'e') {
		activeKnot.rotate(angularSpeed);
	}
	else if(event.key == 'q') {
		activeKnot.rotate(-angularSpeed);
	}

	if(event.key == 'z') {
		popUndo();
	}

	showIntersections();
}
