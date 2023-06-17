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

// From https://github.com/joshuahhh/knot-identification-tool/blob/master/kit.coffee
// under MIT
// Courtesy of Alexander Stoimenow and Joshua Horowitz
knotEncyclopedia = {"1": [["0_1"]], "1,-5,9,-11,9,-5,1": [["9_20"], ["10_149"]], "2,-9,21,-27,21,-9,2": [["10_95"]], "1,-3,6,-8,9,-8,6,-3,1": [["10_62"]], "2,-10,20,-25,20,-10,2": [["10_92"]], "1,-4,7,-9,7,-4,1": [["3_1", "6_2"]], "1,-5,11,-17,19,-17,11,-5,1": [["10_112"]], "1,-7,18,-23,18,-7,1": [["9_40"], ["10_59"]], "1,-3,6,-7,7,-7,6,-3,1": [["10_47"]], "4,-12,15,-12,4": [["10_16"]], "1,-1,0,1,-1,1,0,-1,1": [["10_124"]], "1,-5,9,-5,1": [["7_7"]], "2,-3,3,-3,2": [["7_3"]], "2,-7,11,-7,2": [["8_13"]], "1,-6,15,-24,29,-24,15,-6,1": [["10_123"]], "2,-6,7,-6,2": [["8_6"]], "2,-3,2,-1,2,-3,2": [["10_142"]], "3,-9,16,-19,16,-9,3": [["10_66"]], "1,-2,4,-5,4,-2,1": [["10_126"]], "7,-21,29,-21,7": [["10_101"]], "4,-11,13,-11,4": [["10_11"]], "2,-10,17,-10,2": [["9_19"]], "2,-10,21,-27,21,-10,2": [["10_114"]], "1,-1,1,-1,1,-1,1,-1,1": [["9_1"]], "1,-3,3,-3,1": [["6_2"]], "1,-4,8,-9,8,-4,1": [["8_16"], ["10_156"]], "2,-10,24,-31,24,-10,2": [["10_117"]], "2,-8,13,-8,2": [["10_146"]], "2,-7,11,-13,11,-7,2": [["10_50"]], "4,-14,19,-14,4": [["10_18"], ["10_24"]], "2,-8,16,-21,16,-8,2": [["10_102"]], "2,-5,7,-7,7,-5,2": [["5_1", "5_2"]], "1,-7,18,-25,18,-7,1": [["10_71"]], "1,-6,9,-6,1": [["9_45"]], "1,-4,8,-10,11,-10,8,-4,1": [["10_85"]], "1,-3,5,-5,5,-3,1": [["8_7"]], "2,-9,20,-25,20,-9,2": [["10_84"]], "3,-7,3": [["8_1"]], "1,-1,0,2,-3,2,0,-1,1": [["10_139"]], "1,-7,16,-19,16,-7,1": [["10_70"]], "2,-5,8,-9,8,-5,2": [["9_16"], ["3_1", "7_3"]], "1,-5,7,-7,7,-5,1": [["9_11"]], "1,-7,11,-7,1": [["9_48"]], "1,-3,5,-7,7,-7,5,-3,1": [["10_9"]], "1,-7,20,-27,20,-7,1": [["10_73"]], "1,-6,14,-17,14,-6,1": [["9_32"]], "2,-4,6,-7,6,-4,2": [["9_9"]], "3,-13,19,-13,3": [["10_36"]], "2,-6,11,-13,11,-6,2": [["3_1", "7_5"]], "2,-6,7,-7,7,-6,2": [["10_6"]], "1,-6,13,-17,13,-6,1": [["3_1", "7_6"]], "1,-4,9,-15,19,-15,9,-4,1": [["10_104"]], "4,-11,15,-11,4": [["9_23"], ["3_1", "7_4"]], "3,-14,21,-14,3": [["9_39"]], "2,-7,15,-19,15,-7,2": [["10_51"]], "2,-7,13,-15,13,-7,2": [["10_23"], ["10_52"]], "2,-9,19,-25,19,-9,2": [["10_86"]], "1,-4,8,-12,13,-12,8,-4,1": [["10_82"]], "2,-3,3,-3,3,-3,2": [["9_3"]], "1,-3,3,-3,3,-3,1": [["8_2"]], "1,-1,1,-1,1": [["5_1"], ["10_132"]], "1,-5,8,-7,8,-5,1": [["10_138"]], "2,-4,4,-3,4,-4,2": [["10_134"]], "1,-3,4,-5,4,-3,1": [["8_5"], ["10_141"]], "1,-2,2,-1,2,-2,1": [["10_125"]], "1,-5,9,-9,9,-5,1": [["9_17"]], "2,-11,26,-33,26,-11,2": [["10_113"]], "4,-10,13,-10,4": [["9_18"]], "1,1,-3,1,1": [["10_145"]], "2,-9,18,-23,18,-9,2": [["10_87"], ["10_98"]], "2,-6,10,-11,10,-6,2": [["10_12"], ["10_54"]], "1,-1,0,1,0,-1,1": [["8_19"]], "2,-4,5,-4,2": [["7_5"], ["10_130"]], "3,-5,5,-5,3": [["9_4"]], "2,-11,27,-35,27,-11,2": [["10_121"]], "4,-8,9,-8,4": [["9_10"]], "1,-1,-1,3,-1,-1,1": [["10_153"]], "1,-2,3,-2,1": [["8_20"], ["10_140"], ["3_1", "3_1"]], "1,-8,24,-35,24,-8,1": [["10_88"]], "8,-26,37,-26,8": [["10_120"]], "2,-5,2": [["6_1"], ["9_46"]], "2,-8,15,-19,15,-8,2": [["10_32"]], "1,-6,15,-19,15,-6,1": [["3_1", "7_7"]], "6,-11,6": [["9_5"]], "2,-8,15,-17,15,-8,2": [["10_93"]], "4,-7,4": [["7_4"], ["9_2"]], "1,-7,19,-25,19,-7,1": [["10_44"]], "2,-9,16,-19,16,-9,2": [["10_72"]], "2,-7,9,-7,2": [["8_11"], ["10_147"], ["3_1", "6_1"]], "1,-7,21,-29,21,-7,1": [["10_69"]], "1,-4,10,-13,10,-4,1": [["10_151"]], "1,-5,11,-13,11,-5,1": [["9_26"]], "3,-10,13,-10,3": [["10_144"]], "4,-9,4": [["8_3"], ["10_1"]], "2,-3,1,1,1,-3,2": [["10_128"]], "2,-8,12,-13,12,-8,2": [["10_14"]], "1,-4,9,-14,15,-14,9,-4,1": [["10_94"]], "7,-13,7": [["9_35"]], "2,-9,19,-23,19,-9,2": [["10_83"]], "1,-7,22,-33,22,-7,1": [["10_96"]], "1,-6,15,-21,15,-6,1": [["4_1", "6_3"]], "1,-5,8,-9,8,-5,1": [["9_36"]], "2,-7,11,-11,11,-7,2": [["10_19"]], "2,-9,15,-9,2": [["9_14"]], "2,-5,5,-5,2": [["8_4"]], "2,-7,13,-17,13,-7,2": [["10_26"]], "5,-14,19,-14,5": [["9_38"], ["10_63"]], "3,-9,11,-9,3": [["10_20"], ["10_162"]], "3,-6,7,-6,3": [["9_49"]], "1,-4,8,-11,8,-4,1": [["8_17"]], "1,-4,10,-16,19,-16,10,-4,1": [["10_99"]], "1,-8,22,-31,22,-8,1": [["10_107"]], "3,-9,15,-17,15,-9,3": [["10_80"]], "1,-4,9,-14,17,-14,9,-4,1": [["10_91"]], "1,-7,17,-21,17,-7,1": [["10_41"]], "1,-1,1,-1,1,-1,1": [["7_1"]], "1,-5,12,-19,23,-19,12,-5,1": [["10_118"]], "1,-6,11,-6,1": [["10_137"], ["4_1", "4_1"]], "2,-9,17,-21,17,-9,2": [["10_111"]], "1,-2,3,-3,3,-3,3,-2,1": [["3_1", "7_1"]], "2,-6,9,-6,2": [["8_8"], ["10_129"]], "2,-11,19,-11,2": [["9_37"], ["4_1", "6_1"]], "1,-3,5,-5,5,-5,5,-3,1": [["10_5"]], "3,-12,19,-12,3": [["9_41"]], "1,-8,22,-29,22,-8,1": [["10_105"]], "3,-7,9,-7,3": [["9_7"]], "2,-8,11,-8,2": [["8_14"], ["9_8"], ["10_131"]], "2,-10,15,-10,2": [["9_15"], ["10_165"]], "1,-4,6,-5,6,-4,1": [["9_47"]], "1,-3,5,-7,5,-3,1": [["8_9"], ["10_155"]], "1,-9,26,-37,26,-9,1": [["10_115"]], "1,-6,16,-23,16,-6,1": [["9_34"]], "1,-3,6,-10,11,-10,6,-3,1": [["10_64"]], "1,-4,6,-7,6,-4,1": [["10_127"], ["10_150"]], "5,-22,33,-22,5": [["10_97"]], "1,-4,9,-11,9,-4,1": [["10_159"], ["3_1", "6_3"]], "1,-4,5,-5,5,-4,1": [["4_1", "5_1"]], "2,-8,14,-17,14,-8,2": [["10_25"], ["10_56"]], "1,0,-2,3,-2,0,1": [["10_161"]], "1,-1,1": [["3_1"]], "1,-8,24,-33,24,-8,1": [["10_89"]], "2,-5,6,-7,6,-5,2": [["10_61"]], "2,-8,13,-15,13,-8,2": [["10_39"]], "2,-10,23,-31,23,-10,2": [["10_119"]], "4,-12,17,-12,4": [["5_2", "5_2"]], "2,-6,10,-13,10,-6,2": [["10_22"]], "1,-3,6,-7,6,-3,1": [["8_10"], ["10_143"], ["3_1", "3_1", "3_1"]], "1,-2,3,-4,5,-4,3,-2,1": [["5_1", "5_1"]], "1,-4,4,-3,4,-4,1": [["10_160"]], "4,-16,23,-16,4": [["10_67"], ["10_74"]], "1,-7,15,-17,15,-7,1": [["10_29"]], "1,-4,7,-4,1": [["9_44"]], "3,-11,17,-11,3": [["10_10"], ["10_164"]], "1,-5,12,-17,12,-5,1": [["9_30"]], "5,-15,21,-15,5": [["10_55"]], "1,-6,13,-15,13,-6,1": [["4_1", "6_2"]], "3,-8,12,-13,12,-8,3": [["10_49"]], "1,-6,14,-19,14,-6,1": [["9_33"]], "1,-5,10,-11,10,-5,1": [["9_22"]], "1,-5,10,-13,10,-5,1": [["8_18"], ["9_24"], ["3_1", "3_1", "4_1"]], "2,-3,2": [["5_2"]], "1,-3,5,-3,1": [["6_3"]], "1,-5,13,-17,13,-5,1": [["9_31"]], "1,-5,12,-19,21,-19,12,-5,1": [["10_116"]], "1,-6,11,-13,11,-6,1": [["10_157"]], "2,-13,23,-13,2": [["10_13"]], "3,-5,3": [["7_2"]], "1,-5,11,-15,11,-5,1": [["9_27"]], "2,-8,16,-19,16,-8,2": [["10_27"]], "2,-8,17,-23,17,-8,2": [["10_90"]], "1,-3,6,-9,11,-9,6,-3,1": [["10_48"]], "2,-6,9,-9,9,-6,2": [["10_15"]], "1,-4,10,-17,21,-17,10,-4,1": [["10_109"]], "1,-3,2,-1,2,-3,1": [["9_43"]], "4,-15,21,-15,4": [["10_38"]], "2,-7,12,-15,12,-7,2": [["10_76"]], "6,-18,25,-18,6": [["10_53"]], "2,-5,7,-5,2": [["3_1", "5_2"]], "1,-7,19,-27,19,-7,1": [["10_42"], ["10_75"]], "2,-7,9,-9,9,-7,2": [["10_21"]], "4,-17,25,-17,4": [["10_30"]], "2,-4,5,-5,5,-4,2": [["9_6"]], "4,-16,25,-16,4": [["10_33"]], "3,-9,13,-9,3": [["10_34"], ["10_135"]], "2,-8,17,-21,17,-8,2": [["10_40"], ["10_103"]], "2,-5,5,-5,5,-5,2": [["10_8"]], "1,-7,20,-29,20,-7,1": [["10_60"]], "2,-12,21,-12,2": [["10_35"]], "1,-4,10,-15,10,-4,1": [["10_158"]], "1,-3,3,-3,3,-3,3,-3,1": [["10_2"]], "2,-9,13,-9,2": [["9_12"], ["4_1", "5_2"]], "1,-7,16,-21,16,-7,1": [["10_78"]], "4,-14,21,-14,4": [["10_31"], ["10_68"]], "1,-3,7,-12,15,-12,7,-3,1": [["10_79"]], "2,-8,18,-23,18,-8,2": [["10_57"]], "3,-11,15,-11,3": [["10_7"]], "4,-9,11,-9,4": [["9_13"]], "2,-7,14,-17,14,-7,2": [["10_65"], ["10_77"]], "4,-13,19,-13,4": [["10_28"], ["10_37"]], "2,-11,17,-11,2": [["9_21"]], "1,-4,9,-15,17,-15,9,-4,1": [["10_106"]], "3,-16,27,-16,3": [["10_58"]], "3,-8,11,-8,3": [["8_15"], ["3_1", "7_2"]], "2,-8,14,-15,14,-8,2": [["10_108"]], "1,-2,3,-3,3,-2,1": [["3_1", "5_1"]], "1,-3,5,-7,9,-7,5,-3,1": [["10_17"]], "1,-5,12,-15,12,-5,1": [["9_28"], ["9_29"], ["10_163"]], "1,-3,7,-9,7,-3,1": [["10_148"]], "1,-5,7,-5,1": [["7_6"], ["10_133"]], "1,-3,1": [["4_1"]], "1,-3,4,-5,5,-5,4,-3,1": [["10_46"]], "1,-1,-1,4,-5,4,-1,-1,1": [["10_152"]], "6,-13,6": [["10_3"]], "1,-4,5,-4,1": [["8_21"], ["10_136"], ["3_1", "4_1"]], "3,-12,17,-12,3": [["9_25"]], "1,0,-4,7,-4,0,1": [["10_154"]], "1,-8,20,-25,20,-8,1": [["10_110"]], "1,-7,13,-7,1": [["8_12"]], "2,-11,24,-31,24,-11,2": [["10_122"]], "1,-7,21,-31,21,-7,1": [["10_45"]], "3,-7,7,-7,3": [["10_4"]], "1,-4,9,-12,13,-12,9,-4,1": [["10_100"]], "1,-2,1,-2,1": [["9_42"]], "1,-7,17,-23,17,-7,1": [["10_43"]], "1,-8,20,-27,20,-8,1": [["10_81"]]}

function alexanderString(p) {
	
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
	var p = alexanderPolynomial();
	polynomial.innerHTML = alexanderString(p);

	candidates.innerHTML = "";
	var candidateArray = knotEncyclopedia[p];
	console.log(candidateArray)
	if (candidateArray.length > 0) {
		for (var k = 0; k < candidateArray.length; k++) {
			var knot = candidateArray[k];
			console.log(knot)
			candidates.innerHTML += "<a target='_blank' rel='noreferrer noopener' href='http://katlas.org/wiki/" + knot + "'> <img height='30px' src='https://knotinfo.math.indiana.edu/diagrams_mosaic/mosaic" + knot + ".png'> </a>";
		}
	}
	

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
