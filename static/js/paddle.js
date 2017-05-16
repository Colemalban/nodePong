function Paddle(orientation){
    if(orientation === 0){
        this.x = 10;
    }
    else{
        this.x = 730;
    }
    this.y = 20;
    this.width = 10;
    this.height = 100;
    this.speed = 0;
    this.draw = function(){
        this.y += this.speed;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.updatePosition = function(y){
        this.y = y;
    };
}
