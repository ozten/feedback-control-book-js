
function Buffer(maxWip, maxFlow) {
    var that = {};
    that.queued = 0;
    // work-in-progress aka "ready pool"
    that.wip = 0;
    that.maxWip = maxWip;
    // Average outflow is maxFlow / 2
    that.maxFlow = maxFlow;

    // Add work to the ready pool
    that.work = function(u) {
        u = Math.max(0, Math.round(u));
        u = Math.min(u, that.maxWip);
        that.wip += u;

        // Transfer from rady pool to the queue
        var rr = Math.random() * that.wip;
        var r = Math.round(rr);
        that.wip -= r;
        that.queued += r;

        // Release from queue to downstream process
        var rr2 = Math.random() * that.maxFlow;
        r = Math.round(rr2);
        r = Math.min(r, that.queued);
        that.queued -= r;

        return that.queued;
    };
    return that;
}

function Controller(kp, ki) {
    var that = {};
    that.kp = kp;
    that.ki = ki;
    // Cumulative error ("integral")
    that.i = 0;

    that.work = function(e) {
        that.i += e;
        console.log(that.kp, '*', e, '+', that.ki, '*', that.i, (that.kp * e) + (that.ki * that.i));
        return (that.kp * e) + (that.ki * that.i);
    };
    return that;
}
var data = [];
function openLoop(p, tm) {
    tm = tm || 5000;
    var that = {};
    that.target = function(t) {
        return 5.0;
    };

    for (var t=0; t < tm; t++) {
        var u = that.target(t);
        var y = p.work(u);

        data.push([t, u, 0, u, y].join(' '));
    }
    return that;
}

function closedLoop(c, p, tm) {
    tm = tm || 5000;

    var that = {};
    that.setpoint = function(t) {
        if (t < 100) {
            return 0.0;
        } else if (t < 300) {
            return 50.0;

        } else if (t < 600) {
            return 250.0;

        } else if (t < 1300) {
            return 150.0;

        } else if (t < 2500) {
            return 0.0;
        } else if (t < 4500) {
            return 150.0;


        } else {
            return 10.0;
        }
    };

    var y = 0.0;
    for (var t=0; t < tm; t++) {
        var r = that.setpoint(t);
        var e = r - y;
        //console.log('setpoint=', r, 'y=', y, 'error=', e);
        u = c.work(e);
        y = p.work(u);
console.log('doing data');
        data.push([t, r, e, u, y].join(' '));
        console.log(t + ' ' + tm);
    }
    return that;
}

function changeLoad(load) {

console.log(load);
    console.log('Controller load=', load);

    var c = Controller(load, 0.1);
    console.log('created controller');
    var p = Buffer(500, 250);
console.log('created buffer');
    // reset data
    data = [];
    //openLoop(p, 1000);
    closedLoop(c, p, 1000);
    console.log('after closedLoop');
    console.log(data.join('\n'));
    gnuplot.putFile('simulation.out', data.join('\n'));
    gnuplot.onOutput(data.join('\n'));
    runScript();
}
document.getElementById('slider').addEventListener('change', function(e) {
        var load;
    if (e.value) {
        load = parseFloat(e.value);
    } else {
        load = parseFloat(e.target.value);
    }

  changeLoad(load);
}, false);

document.getElementById('slider').value = 0.5;

changeLoad(0.5);