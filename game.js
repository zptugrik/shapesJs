var shapes = new Shape();
shapes.ChangeCounter();
shapes.ChangeSquare();

var app = new PIXI.Application(width, height, {forceCanvas: true});
document.body.appendChild(app.view);
//events
app.view.addEventListener('mousedown', function (e) {

    if(shapes.click) shapes.click = false;
    else shapes.GetNew([0, e.layerX, e.layerY]);
});
app.view.addEventListener('touchstart', function (e) {
    console.log(e,e.touches[0].screenY,e.touches[0].clientY)
    if(shapes.click) shapes.click = false;
    else shapes.GetNew([0, e.touches[0].pageX, e.touches[0].pageY-e.touches[0].target.offsetTop]);
});
//init
shapes.CreatePool();

var count = 0;
app.ticker.add(function() {
    var deltaTime = 60/config.shapesAppearVelocity;
    shapes.CheckTotalNumberOfShapes();
    count += 1;
    if(count % deltaTime == 0)
        shapes.GetNew();
    shapes.DrawShapes();
});