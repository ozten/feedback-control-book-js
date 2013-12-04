# Feedback Control Book JS

JS versions of the [Python code examples](https://github.com/oreillymedia/feedback_control_for_computer_systems) from Feedback Control for Computers

## Preview in your Browser with a HTML5 Gnuplot

* Run a webserver in this directory `python -m SimpleHTTPServer` for example
* Browser to http://localhost:8000
* Run code sample, such as `node ch01.js > gnuplot.out`
* Upload `gnuplot.out`
* Enter the following gnuplot into the textarea:


```
set terminal svg enhanced size 1000,700
set output 'out.svg'
# set terminal svg size 600,400 dynamic enhanced fname 'arial'  fsize 10
mousing name "heatmaps_3" butt solid
# set output 'heatmaps.3.svg'
set format cb "%4.1f"
set view 49, 28, 1, 1.48
set yrange [0:]
set xrange [0:]
plot 'gnuplot.out' using 1:2 with lines, 'gnuplot.out' using 1:3 with lines, 'gnuplot.out' using 1:4 with linespoints, 'gnuplot.out' using 1:5 with points, 'gnuplot.out' using 1:6 with lines
```

Note: You'll vary `using 1:6 with lines` pieces based on what kind of data is `gnuplot.out`. basically, how many columns and what do the columns mean...