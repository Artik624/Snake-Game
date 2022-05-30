$(document).ready(function(){
    //define vars 
    var canvas = $('canvas')[0]
    var ctx = canvas.getContext('2d')
    var width = canvas.width
    var height = canvas.height

    var cellWidth = 15
    var direction = 'right'
    var food
    var score
    var color = 'green'
    var speed = 130

    //snake arr 
    var snakeArray 

    function init(){
        create_snake()
        create_food()
        score = 0
        direction = 'right'
        if(typeof game_loop != 'undefined') clearInterval(game_loop)
        game_loop = setInterval(paint, speed) 
    }

    init()

    function create_snake() {
        var length = 5
        snakeArray = []
        for (let i = length-1; i >= 0; i--) {
            snakeArray.push({x:i,y:0})
            
        }
    }

    function create_food() {
        food ={
            x:Math.round(Math.random()*(width-cellWidth)/cellWidth),
            y:Math.round(Math.random()*(height-cellWidth)/cellWidth)
        }
    }

    function paint(){
        //paint canvas 
        ctx.fillStyle = 'black'
        ctx.fillRect(0,0,width,height)
        ctx.strokeStyle = 'white'
        ctx.strokeRect(0,0,width,height)

        var nx = snakeArray[0].x
        var ny = snakeArray[0].y
        

        if(direction == 'right') nx++
        else if (direction == 'left') nx--
        else if (direction == 'up') ny--
        else if(direction == 'down') ny++

        //collide code 
        if(nx === -1 || nx === width/cellWidth || ny === -1 || ny === height/cellWidth || checkCollision(nx, ny , snakeArray)){
            //init()
            $('#final_score').html(score)
            $('#overlay').fadeIn(300)
            return;
        }

        if(nx == food.x && ny ==food.y){
            var tail = {x:nx, y: ny}
            score++
            speed++
            //create new food 
        create_food()
        }
        else{
            var tail = snakeArray.pop()
            tail.x = nx 
            tail.y = ny
        }

        snakeArray.unshift(tail)

        for (i = 0 ; i< snakeArray.length; i++){
            var c = snakeArray[i]
            paintCell(c.x, c.y)
        }

        paintCell(food.x,food.y)

        checkScore(score)

        $('#score').html('Score: ' + score)
        $('#high_score').html(localStorage.getItem('highscore'))

        function paintCell(x,y){
            ctx.fillStyle=color
            ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth)
            ctx.strokeStyle ='white'
            ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth)
        }

        function checkCollision(x,y, array){
            for(var i = 0; i< array.length; i++){
                if(array[i.x == x && array[i].y == y]) return true 
            }
            return false
        }

        function checkScore(score){
            if(localStorage.getItem('highscore') == null){
                localStorage.setItem('highscore', score)
            }
            else{
                if(score > localStorage.getItem('highscore')){
                    localStorage.setItem('highscore', score)
                }
            }
        }

        //keyboard controller 
        $(document).keydown(function(e) {
            var key = e.which
            if(key == "37" && direction != 'right' ) {
                direction = 'left'
            }
            else if (key == "38" && direction != 'down') {direction = 'up'}
            else if (key == '39' && direction != 'left') {direction = 'right'}
            else if (key == '40' && direction != 'up') {direction = 'down'}
        })
    }

})