var r = parseInt(process.argv[2]);
var k = parseFloat(process.argv[3]);

var u = 0; // previous output

for (var i=0; i < 200; i++) {
    var y = u;     // One-Step delay: previous output

    var e = r - y;
    u = k*e;       // Controller output

    console.log(i, r, e, 0, u, y);
}