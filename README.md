I wanted to make something using
[Server-sent events](http://en.wikipedia.org/wiki/Server-sent_events),
so I made a silly drawing app.

It's pretty simple, but it is collaborative drawing app. Everyone who
is on the page shares the same screen. When someone adds a point, it
shows up for everyone else. There's three rendering modes, all of
which share the same data, so someone can make a drawing in one modes,
and the other modes will also change.

Anyway, you draw by clicking on the screen. The longer you hold the
mouse button down, the stronger the point is, depending on your
particular mode. It's random, and rough around the edges, but fairly
entertaining.

It runs on Sinatra, and uses [p5.js](http://p5js.org/) which is
similar to processing.js.
