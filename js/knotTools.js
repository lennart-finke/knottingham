function gaussCode(intersectionWatcher) {
    const indices = intersectionWatcher[3].map((_, index) => index);
    indices.sort((indexA, indexB) => intersectionWatcher[3][indexA] - intersectionWatcher[3][indexB]);

	var out = new Array(intersectionWatcher[2].length);
	var i = 0;
	var j = 0;
	for (var k = 0; k < 2 * intersectionWatcher[2].length; k++) {
		if (intersectionWatcher[2][i] < intersectionWatcher[3][indices[j]]) {
			out[k] = (i+1)*(intersectionWatcher[1][i] ? 1 : -1);
			i += 1;
		}
		else {
			out[k] = (j+1)*(intersectionWatcher[1][indices[j]] ? -1 : 1);
			j += 1;
		}
	}
	return out;
}

function dowkerThistlethwaiteCodeDebug(intersectionWatcher) {
	const indices = intersectionWatcher[3].map((_, index) => index);
    indices.sort((indexA, indexB) => intersectionWatcher[3][indexA] - intersectionWatcher[3][indexB]);

	var out = new Array(intersectionWatcher[3].length);

	var i = 0;
	var j = 0;
	for (var k = 0; k < 2 * intersectionWatcher[2].length; k++) {
		if (intersectionWatcher[2][i] < intersectionWatcher[3][indices[j]]) {
            if (k % 2 == 1) {
                out[i] = (k+1)*(intersectionWatcher[1][i] ? 1 : -1);
            }
            i += 1;
		} else {
            if (k % 2 == 1) {
			    out[indices[j]] = (k+1)*(intersectionWatcher[1][indices[j]] ? -1 : 1);
            }
            j += 1;
		}
	}

	return out;
}

function dowkerThistlethwaiteCode(intersectionWatcher) {
	const indices = intersectionWatcher[3].map((_, index) => index);
    indices.sort((indexA, indexB) => intersectionWatcher[3][indexA] - intersectionWatcher[3][indexB]);

	var out = [];
	for (var k = 0; k < intersectionWatcher[2].length; k++) {
		out.push([,]);
	}
	var i = 0;
	var j = 0;
	for (var k = 0; k < 2 * intersectionWatcher[2].length; k++) {
		if (intersectionWatcher[2][i] < intersectionWatcher[3][indices[j]]) {
			out[i][k % 2] = (k+1)*(k % 2 == 1 && !intersectionWatcher[1][i] ? -1 : 1);
			i += 1;
		} else {
			out[indices[j]][k % 2] = (k+1)*(k % 2 == 1 && intersectionWatcher[1][indices[j]] ? -1 : 1);
			j += 1;
		}
	}

    out.sort((a, b) => a[0] - b[0]);
	return out.map(sub => sub[1]);
}