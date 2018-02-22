const Shape = function(){
    this.data = [];
    this.square = 0;
    this.shapesPool = [[],[],[],[],[],[],[]];
    this.click = false;
    this.starPoints = [ 0, 0,
                        20, 50,
                        80, 55,
                        35, 95,
                        50, 150,
                        0, 120,
                        -50, 150,
                        -35, 95,
                        -80, 55,
                        -20, 50
                    ];
};
Shape.prototype.GetNew = function(shapeArray) {
    var shapeInitArray ;
        if(typeof shapeArray == 'undefined')
            shapeInitArray = this.GetShapeInitArray();
        else{
            shapeInitArray = shapeArray ;
        }
    var newShape = this.GetFromPool(shapeInitArray[0]);
    newShape.x=shapeInitArray[1];
    newShape.y=shapeInitArray[2];
    newShape.interactive = true;
    app.stage.addChild(newShape);
    this.data.push(newShape);
    this.ChangeCounter();
    this.ChangeSquare(newShape.square);
    //events
    newShape.on('mousedown', function(e){
        this.handlerClick(e);
    }.bind(this));
    newShape.on('touchstart', function(e){
       this.handlerClick(e);
    }.bind(this));
};
Shape.prototype.ChangeSquare = function(delta=0){
    this.square += delta;
    document.getElementById('square').innerText = TXT_SQUARE + (this.square==0?0:(100*this.square/(height*width)).toFixed(2)) + "%";
};
Shape.prototype.ChangeCounter = function(){
    document.getElementById('counter').innerText = TXT_COUNTER + this.data.length;
};
Shape.prototype.handlerClick = function(e){
    this.click = true;
    this.Remove(this.data.indexOf(e.currentTarget));
}
Shape.prototype.GetFromPool = function(i){
    return this.shapesPool[i].shift();
};
Shape.prototype.Calcuate = (shapeInitArray) => {
    var [sides, x, y] = shapeInitArray;

    if( sides == 1 )
        return [x, y+=config.radius];
    if( sides == 2 )
        return [x, y+=config.radius, 100];

    var sidesPoints=[x, y], sideLength=config.shapeConst/sides;
    const startAngle = ( sides%2 != 0 ) ? 180/sides : 0;
    for(var i=0; i<sides; i++)
    {
        sidesPoints.push(sidesPoints[2*i]+sideLength*Math.cos(deg(startAngle + (360/sides)*i)));
        sidesPoints.push(sidesPoints[2*i+1]+sideLength*Math.sin(deg(startAngle + (360/sides)*i)));
    }
    return sidesPoints;
};
Shape.prototype.Remove = function(shapeIndex){
    var poolIndex =  this.data[shapeIndex].poolIndex;
    this.shapesPool[poolIndex].push(this.data[shapeIndex]);
    this.ChangeSquare(-this.data[shapeIndex].square);
    app.stage.removeChild(this.data[shapeIndex]);
    this.data.splice(shapeIndex, 1);
    this.ChangeCounter();
};
Shape.prototype.Cleaning = function(shapeIndex){
    if(this.data[shapeIndex].y > height)
    {
       this.Remove(shapeIndex);
    }
};
Shape.prototype.CheckTotalNumberOfShapes = function(){
    if(this.data.length<config.totalNumber)
    {
        this.GetNew();
        this.CheckTotalNumberOfShapes();
    }
};
Shape.prototype.GetShapeInitArray = (sidesMax=config.maxSides, sidesMin=1,
                minX=config.minX, maxX=config.maxX,
                minY=config.minY, maxY=config.maxY ) => {
    return [
        Math.floor(Math.random() * (sidesMax - sidesMin + 1) + sidesMin),
        Math.floor(Math.random() * (maxX - minX + 1) + minX),
        Math.floor(Math.random() * (maxY - minY + 1) + minY),
        ];
};
Shape.prototype.DrawShapes = function(){
    for( var shapeIndex=0; shapeIndex<this.data.length; shapeIndex++)
    {
        this.data[shapeIndex].y+=config.gravity;
        this.Cleaning(shapeIndex);
    }
};
Shape.prototype.GetColours = function(){
    return [
        config.colours[Math.floor(Math.random() * (config.colours.length + 1))],
        config.colours[Math.floor(Math.random() * (config.colours.length + 1))]
    ];
};
Shape.prototype.CreatePool = function(){
    for( var j=0; j<=config.maxSides; j++)
    {
        for( var i=0; i<100; i++)
        {
            var points = (j)?this.Calcuate([j,0,0]):this.starPoints;
            var graphics = new PIXI.Graphics();
            var colours = this.GetColours();
            graphics.lineStyle(6, colours[0], 1);
            graphics.beginFill(colours[1], 0.5);
            var sideLength;
            switch(j){
                case 1: //cicle
                    graphics.drawCircle(points[0], points[1], config.radius);
                    graphics.square = Math.PI*config.radius*config.radius;
                    break;
                case 2://ellipse
                    graphics.drawEllipse(points[0], points[1], points[2], config.radius);
                    graphics.square = Math.PI*points[2]*config.radius;
                    break;
                case 3://triangle
                    sideLength=config.shapeConst/3;
                    graphics.square = Math.sqrt(3)*sideLength/4;
                case 0:
                case 4://4 sides
                    sideLength=config.shapeConst/4;
                    graphics.square = sideLength*sideLength;
                case 5://5 sides
                    sideLength=config.shapeConst/5;
                    graphics.square = 5*Math.sqrt(3)*sideLength*sideLength/4;
                case 6://6 sides
                    sideLength=config.shapeConst/6;
                    graphics.square = 3*Math.sqrt(3)*sideLength*sideLength/2;
                default:
                    graphics.drawPolygon(points);
            }
            graphics.endFill();
            graphics.poolIndex = j;
            this.shapesPool[j].push(graphics);
        }
    }
}
Shape.prototype.DecreaseGravity = function(){
    if(config.gravity>config.gravityMin)
    {
        config.gravity--;
        document.getElementById("gravityTitle").innerText = TXT_GRAVITY + config.gravity;
    }
};
Shape.prototype.IncreaseGravity = function(){
    if(config.gravity<config.gravityMax)
    {
        config.gravity++;
        document.getElementById("gravityTitle").innerText = TXT_GRAVITY + config.gravity;
    }
};
Shape.prototype.DecreaseShapesVelocity = function(){
    if(config.shapesAppearVelocity>config.shapesAppearVelocityMin)
    {
        config.shapesAppearVelocity--;
        document.getElementById("shapesTitle").innerText = TXT_VELOCITY + config.shapesAppearVelocity;
    }
};
Shape.prototype.IncreaseShapesVelocity = function(){
    if(config.shapesAppearVelocity<config.shapesAppearVelocityMax)
    {
        config.shapesAppearVelocity++;
        document.getElementById("shapesTitle").innerText = TXT_VELOCITY + config.shapesAppearVelocity;
    }
};
Shape.prototype.ButtonsInit = function(){
    document.getElementById("gravityTitle").innerText = TXT_GRAVITY + config.gravity;
    document.getElementById("shapesTitle").innerText = TXT_VELOCITY + config.shapesAppearVelocity;
};
function deg(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}