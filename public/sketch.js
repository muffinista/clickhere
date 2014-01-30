var x, y, z, start;
var max_size = 25;
var drawing = false;
window.points = (window.points || []);

var style = "dots";

PVector = Processing.PVector;

window.addEventListener('resize', function(event){
    setup();
    clearScreen();
    draw();
});

function setup() {
    createGraphics( $( window ).width(), $( window ).height() );
    background(0);
    loadPoints();

    $("#controls a").on("click", function(e) {
        e.preventDefault();
        style = $(this).attr("href");
        clearScreen();
        renderPoints(window.points);
    });
};

function clearScreen() {
    background(0);
}

function draw() {
    if ( drawing ) {
        z = ticks() - start;
        if ( pointValue(z) >= max_size ) {
            drawing = false;
            postPoint();
        }
    }
};


function mousePressed() {
    var cPos = $("#controls").position();
    var hPos = $("#about").position();

    if (
        ( mouseX >= cPos.left && mouseY >= cPos.top ) ||
        ( mouseX <= hPos.left && mouseY >= cPos.top ) ) {
            return;
        }

    drawing = true;
    start = ticks();
    x = mouseX;
    y = mouseY;
}

function mouseReleased() {
    if ( drawing ) {
        z = ticks() - start;
        postPoint();
    }
    x = 0;
    y = 0;
    drawing = false;
}

function ticks() {
    var now = new Date();
    return now.getTime();
}

var pointValue = function(z) {
    var tmp = z / 25;
    if ( tmp > max_size ) {
        tmp = max_size;
    }
    return tmp;
};

var renderPoint = function(v, z, index) {
    var r;
    v.x = parseInt(v.x, 10);
    v.y = parseInt(v.y, 10);

    switch (style) {
    case "points":
        r = pointValue(z);
        fill(255/max_size * pointValue(z));
        ellipse(v.x, v.y, r, r);
        break;
    case "dots":
        r = 5;
        fill(255/max_size * pointValue(z));
        ellipse(v.x, v.y, r, r);
        break;
    case "nodes":
        var foo = window.points.slice(0);
        foo.sort(function(a, b) {
            return Math.abs(v.mag - a.mag) - Math.abs(v.mag - b.mag);
        });

        fill(0, 0, 0, 2);
        rect(0, 0, width, height);

        fill(255);

        for ( var i = 0; i < foo.length && i < 5; i++ ) {
            stroke(255);
            line(v.x, v.y, foo[i].vx * width, foo[i].vy * height);
        }

        r = pointValue(z);
        ellipse(v.x, v.y, r, r);       
    }
};

var renderPoints = function(points) {
    var home = new PVector(width/2, height/2);

    window.points = points;
    console.log(points);

    for(var i = 0; i < points.length; i++ ) {
        var p = points[i];
        renderHash(p, i);
    }
};

var hashToVector = function(h) {
    var vx = parseFloat(h.vx) * width;
    var vy = parseFloat(h.vy) * height;
    return new PVector(vx, vy, 0);
}

var renderHash = function(p, index) {
    var vx = parseFloat(p.vx) * width;
    var vy = parseFloat(p.vy) * height;
    var z = parseInt(p.z, 10);
    
    var tmp = new PVector(vx, vy, 0);
    renderPoint(tmp, z, index);
};

var loadPoints = function() {
    $.ajax({
        url: "/data",
        success: function(d) { 
            renderPoints(d);
        },
        dataType: 'json'
    });    
};

var es = new EventSource('/stream');
es.onmessage = function(e) { 
    var data = jQuery.parseJSON(e.data);
    window.points.push(data);
    renderHash(data);

    if ( data.users ) {
        $(".stats").html(data.users + " connections");
    }
};

var postPoint = function() {
    var tmp = new PVector(x, y);
    var center = new PVector(width/2, height/2, 0);

    if ( x == 0 && y == 0 ) {
        return;
    }
    $.post("/point", 
           {
               x: x,
               y: y,
               z: z,
               mag: mag,
               vx: x/width,
               vy: y/height
           },
           function(data) {
               data = jQuery.parseJSON(data);
               $(".stats").html(data.users + " connections");
           });

    renderPoint(tmp, z);

    tmp.sub(center);
    mag = tmp.mag();
};

