var r = 0.6;
var k = process.argv[2];
var t = 0;


console.log('r=', r, 'k=', k);

function cache(size) {
    var hitrate;
    if (0 > size) {
        hitrate = 0;
    } else if (100 < size) {
        hitrate = 1;
    } else {
        hitrate = size / 100;
    }
    return hitrate;
}

var y = 0;
var c = 0;

for (var i=0; i<200; i++) {
    var e = r - y; // tracking error
    c += e;    // cumulative error
    var u = k*c;   // control action
    y = cache(u);  // process output
    console.log(i, r, e, c, u, y);
}