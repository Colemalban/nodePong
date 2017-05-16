function Ball(){
    this.radius = 15;
    this.x = 250;
    this.y = 250;
    this.startAngle = 0;
    this.endAngle = Math.PI * 2;
    this.speedVertical = 1;
    this.speedHorizontal = 5;
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,this.startAngle,this.endAngle,false);
        ctx.fill();
        ctx.closePath();
    };
    this.updatePosition = function(x,y){
        this.x = x;
        this.y = y;
    };
}

function detectCollision(location, speed, offset, border){
    if(location + speed + offset >= border || location + speed - offset <= 0){
        return true;
    }
    return false;
}
