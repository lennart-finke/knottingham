// Some math copied 1:1 from https://joshuahhh.com/projects/kit/
// by Joshua Horowitz licenced under MIT

function polyToInt(l, base = 1000) {
		var toReturn = bigInt(0);
		for (var i = 0; i < l.length; i++) {
			var coeff = l[i];
			toReturn = bigInt(base).pow(i).times(coeff).plus(toReturn);
		}
		return toReturn;
}

function intToPoly(num, base = 1000) {
	num = bigInt(num);
	var sign = num < 0 ? -1 : 1;
	num = num.times(sign);

	var b = [];
	while (num.greater(0)) {
		var divmod = num.divmod(base);
		b.push(divmod.remainder.toJSNumber());
		num = divmod.quotient;
	}
	b.push(0);

	for (var i = 0; i < b.length; i++) {
		if (b[i] >= base / 2) {
			b[i] = b[i] - base;
			b[i + 1] = b[i + 1] + 1;
		}
		b[i] *= sign;
	}
	if (b[b.length - 1] == 0) {
		b.pop();
	}

	return b;
}

function det(matrix) {
	const size = matrix.length;
	let sum = bigInt(0);
	if (size === 1) {
		return matrix[0][0];
	}

	for (let i = 0; i < size; i++) {
		if (bigInt(matrix[0][i]).notEquals(0)) {
			const smaller = [];
			for (let a = 1; a < size; a++) {
				smaller[a - 1] = [];
				for (let b = 0; b < size; b++) {
					if (b < i) {
						smaller[a - 1][b] = matrix[a][b];
					} else if (b > i) {
						smaller[a - 1][b - 1] = matrix[a][b];
					}
				}
			}
			const s = i % 2 === 0 ? 1 : -1;
			sum = bigInt(matrix[0][i]).times(s).times(det(smaller)).plus(sum);
		}
	}
	return sum;
}
