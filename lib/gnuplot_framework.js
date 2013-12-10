var gnuplot = new Gnuplot('/lib/gnuplot.js');
gnuplot.onOutput = function(text) {
    document.getElementById('output').value += text + '\n';
    document.getElementById('output').scrollTop = 99999;
};
gnuplot.onError = function(text) {
    document.getElementById('output').value += 'ERR: ' + text + '\n';
    document.getElementById('output').scrollTop = 99999;
};
var lastTAContent = '';

function scriptChange() {
    var val = document.getElementById("gnuplot").value;
    if (lastTAContent == val)
        return;
    localStorage["gnuplot.script"] = val;
    if (gnuplot.isRunning) {
        setTimeout(scriptChange, 1000);
    } else {
        lastTAContent = val;
        runScript();
    }
};
var runScript = function() {
    var editor = document.getElementById('gnuplot'); // textarea
    var start = Date.now();

    var script = "set terminal svg size 600,400 dynamic enhanced fname 'arial'  fsize 10 mousing name " +
        '"simple_1" butt solid \n' +
        "set output 'out.svg' \n" +
        "set key inside left top vertical Right noreverse enhanced autotitles box linetype -1 linewidth 1.000 \n" +
        "set samples 50, 50 \n" +
        'plot [10:30] sin(x),atan(x),cos(atan(x))\n';

    script = editor.value;



    gnuplot.run(script, function(e) {
        gnuplot.onOutput('Execution took ' + (Date.now() - start) / 1000 + 's.');
        gnuplot.getFile('out.svg', function(e) {
            if (!e.content) {
                gnuplot.onError("Output file out.svg not found!");
                return;
            }
            var img = document.getElementById('gnuimg');
            try {
                var ab = new Uint8Array(e.content);
                var blob = new Blob([ab], {
                    "type": "image\/svg+xml"
                });
                window.URL = window.URL || window.webkitURL;
                img.src = window.URL.createObjectURL(blob);
            } catch (err) { // in case blob / URL missing, fallback to data-uri
                if (!window.blobalert) {
                    alert('Warning - your browser does not support Blob-URLs, using data-uri with a lot more memory and time required. Err: ' + err);
                    window.blobalert = true;
                }
                var rstr = '';
                for (var i = 0; i < e.content.length; i++)
                    rstr += String.fromCharCode(e.content[i]);
                img.src = 'data:image\/svg+xml;base64,' + btoa(rstr);
            }
        });
    });
};
 // set the script from local storage
if (localStorage["gnuplot.script"])
    document.getElementById('gnuplot').value = localStorage["gnuplot.script"];
scriptChange();

function handleFileSelect(evt) {
    var _files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = _files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
            '</li>');
        (function() {
            var reader = new FileReader();
            var fname = f.name;
            reader.onloadend = function(e) {
                if (e.target.result) {
                    gnuplot.onOutput(fname + ": Read success - storing in browser. " + e.target.result.length);
                    files[fname] = e.target.result;
                    localStorage["gnuplot.files"] = JSON.stringify(files);
                }

            };
            reader.readAsText(f);
        })();
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}
//document.getElementById('files').addEventListener('change', handleFileSelect, false);


document.getElementById('slider').addEventListener('change', function(e) {
    console.log(typeof e.target.value);
    console.log(parseInt(e.target.value));
    console.log('this.value^');
}, false);