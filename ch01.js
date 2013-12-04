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
        //console.log(that.kp, '*', e, '+', that.ki, '*', that.i, (that.kp * e) + (that.ki * that.i));
        return (that.kp * e) + (that.ki * that.i);
    };
    return that;
}

function openLoop(p, tm) {
    tm = tm || 5000;
    var that = {};
    that.target = function(t) {
        return 5.0;
    };

    for (var t=0; t < tm; t++) {
        var u = that.target(t);
        var y = p.work(u);

        console.log(t, u, 0, u, y);
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
        } else {
            return 10.0;
        }
    };

    var y = 0.0;
    for (var t=0; t < tm; t++) {
        var r = that.setpoint(t);
        var e = r - y;
        u = c.work(e);
        y = p.work(u);

        console.log(t, r, e, u, y);
    }
    return that;
}

var c = Controller(1.25, 0.1);
var p = Buffer(50, 10);

//openLoop(p, 1000);
closedLoop(c, p, 1000);