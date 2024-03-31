/*

Maze1 is a simple video game coded in JavaScript without using complex functions. This game was tested in Firefox.

The MIT License (MIT)

Copyright (c) Nicolas-C-G

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

/*
 * Global variables
*/

var wallCounter=0
var wallsPoints = [];
var playerParam =  {x1:50, 
    y1:0, 
    x2:100, 
    y2:0, 
    x3:50, 
    y3:50, 
    x4:100, 
    y4:50, 
    h:50, 
    w:50, 
    centroidX:75, 
    centroidY:25, 
    background:"#3244a8",
    borderRad:"5px",
    position:"absolute",
    animation:"/static/images/XOsX.gif",
    id:"player",
    animationId:'playerImage'};

var player = document.createElement("div");
var finishPoints = [];
var collision = 0;

/**
 * This function recalculate all the point of a specific object.
 * @param {object} obj - It's a JavaScript DOM Element. For example, var object = document.createElement('<div>');
 * @param {object} objParam - It's a JavaScript Object with all the parameters that define the HTML element.   
*/

function recalculateObjectPoints(objParam, obj){
    objParam.x1 = parseInt(obj.style.left, 10);
    objParam.x2 = parseInt(obj.style.left, 10) + objParam.w;
    objParam.x3 = parseInt(obj.style.left, 10);
    objParam.x4 = parseInt(obj.style.left, 10) + objParam.w;
    
    objParam.y1 = parseInt(obj.style.top, 10);
    objParam.y2 = parseInt(obj.style.top, 10);
    objParam.y3 = parseInt(obj.style.top, 10) + objParam.h;
    objParam.y4 = parseInt(obj.style.top, 10) + objParam.h;
    objParam.centroidX=objParam.x1 + (objParam.w/2);
    objParam.centroidY=objParam.y1 + (objParam.h/2);
}

/**
 * This function generate a wall by using divs with an incremental id. 
    x/y-w-x2/y2
    -------------
    h-----------h
    -------------
    x3/y3-w-x4/y4
    @param {number} x - It's the distance from the left. 
    @param {number} y - It's the distance from the top.
    @param {number} h - It's the height of the div. 
    @param {number} w - It's the width of the div.
    @param {hexadecimal} color - It's the object color.
    @param {string} position - This define the object position type (absolute, relative...).  
*/
function rectangleWallBuilder(x, y, h, w, color, position){
    var wall = document.createElement("div");
    wall.id="wall"+wallCounter;
    wall.style.position = position;
    wall.style.left = x;
    wall.style.top = y;
    wall.style.height = h;
    wall.style.width = w;
    wall.style.backgroundColor = color;
    /*
        x1/y1-w-x2/y2
        -------------
        h-----------h
        -------------
        x3/y3-w-x4/y4
    */
    var wallObj = {id: wall.id, 
                   x1:parseInt(wall.style.left,10), 
                   y1:parseInt(wall.style.top,10),
                   x2:parseInt(wall.style.left,10) + parseInt(w,10), 
                   y2:parseInt(wall.style.top,10),
                   x3:parseInt(wall.style.left,10), 
                   y3:parseInt(wall.style.top,10) + parseInt(h,10),
                   x4:parseInt(wall.style.left,10) + parseInt(w,10), 
                   y4:parseInt(wall.style.top,10) + parseInt(h,10),
                   h:parseInt(h,10),
                   w:parseInt(w,10)
                }
    wallsPoints.push(wallObj);
    document.getElementById('game').appendChild(wall);
    wallCounter++;
}

/**
 * This function is used to create new game objects.
 * The following digram shows where the points are.
    x1/y1-w-x2/y2
    -------------
    h-----------h
    -------------
    x3/y3-w-x4/y4
    @param {object} object -  It's a JavaScript DOM Element. For example, var object = document.createElement('<div>');
    @param {string} id
    @param {string} position - This define the object position type (absolute, relative...).  
    @param {number} x1 - It's the distance from the left.
    @param {number} y1 - It's the distance from the top.
    @param {number} h  - It's the height of the div.
    @param {number} w  - It's the width of the div.
    @param {hexadecimal} background - It's the background color.
    @param {string} borderRad - It's the border value in px.
    @param {string} animation - It's the animation local path.
    @param {string} animationId        
*/
function createObject(object, id, position, x1, y1, h, w, background, borderRad, animation, animationId){
    object.id = id;
    object.style.position = position;
    object.style.left = x1 + "px";
    object.style.top = y1 + "px";
    object.style.height = h + "px";
    object.style.width = w + "px";
    object.style.background = background;
    object.style.borderRadius = borderRad;
    document.getElementById('game').appendChild(object);
    object.innerHTML='<img src='+ animation +' id="'+ animationId +'"/>';
    var character = document.getElementById(animationId);
    character.style.height = h + "px";
    character.style.width = w + "px";
}

/** 
 * This function creates all the static objects that are necesary for the game.  
*/
function mazeGenerator() {
    var blockValues = {block:48,sep1:20,sep2:5, colorBlock:"#32a852", colorSep:"#000000", position:"absolute"};
    var finishParam =  {x1:50, 
        y1:0, 
        x2:98, 
        y2:0, 
        x3:48, 
        y3:48, 
        x4:98, 
        y4:48, 
        h:48, 
        w:48, 
        centroidX:74, 
        centroidY:24, 
        background:"#3244a8",
        borderRad:"5px",
        position:"absolute",
        animation:"/static/images/treasure.png",
        id:"finish",
        animationId:'finishImage'};
    var finish = document.createElement("div");

    var mapParam = [10,10];
    var mazeMap = [[1,0,1,1,1,1,1,1,1,1],
                   [1,0,0,0,0,0,0,0,0,1],
                   [1,1,1,1,1,1,1,1,0,1],
                   [1,0,0,0,0,0,0,0,0,1],
                   [1,1,0,1,1,1,1,1,1,1],
                   [1,1,0,1,1,1,1,1,1,1],
                   [1,1,0,0,0,0,0,1,1,1],
                   [1,1,1,1,1,1,0,1,1,1],
                   [1,1,0,0,0,0,0,0,0,1],
                   [1,1,2,1,1,1,1,1,1,1]];

    var top = 0;
    var left = 0;
    for (let i = 0; i < mapParam[0]; i++) {
        for (let j = 0; j < mapParam[1]; j++) {
            if (mazeMap[i][j] === 1) {
                rectangleWallBuilder(left + "px",top + "px",blockValues.block + "px", blockValues.block + "px", blockValues.colorBlock, blockValues.position);    
            }else if (mazeMap[i][j] === 2){
                createObject(finish,finishParam.id, finishParam.position, left, top, finishParam.h, finishParam.w,
                             finishParam.background, finishParam.borderRad, finishParam.animation, finishParam.animationId);
                recalculateObjectPoints(finishParam, finish);
                finishPoints.push(finishParam);
            }
            left = left + blockValues.block + blockValues.sep2;
        }
        left = 0;
        top = top + blockValues.block + blockValues.sep2;
    }
}

/**
 * This function evaluetes if the player hit another object
 * @param {number} neighborhood - It's the distance in pixels from the centroid to the boundybox side.
 * @param {number} playerCenX   - It's the x axis object centroid.  
 * @param {number} playerCenY   - It's the y axis object centroid.  
 * @param {object} objPoints    - It's a JavaScript Object with all the parameters that define one or more HTML elements.   
 * @param {numeric} type        - Define the type of collision. 1 for walls, 2 for treasures.   
 */
function collisionDetector(neighborhood, playerCenX, playerCenY, objPoints, type) {
    for (let i = 0; i < objPoints.length; i++) {
        if ((Math.abs(objPoints[i].x1 - playerCenX) <= neighborhood) && (Math.abs(objPoints[i].y1 - playerCenY) <= neighborhood)) {
            //console.log("collision to "+ objPoints[i].id);
            collision = type;
        }else if ((Math.abs(objPoints[i].x2 - playerCenX) <= neighborhood) && (Math.abs(objPoints[i].y2 - playerCenY) <= neighborhood)) {
            //console.log("collision to "+ objPoints[i].id);
            collision = type;
        }else if ((Math.abs(objPoints[i].x3 - playerCenX) <= neighborhood) && (Math.abs(objPoints[i].y3 - playerCenY) <= neighborhood)) {
            //console.log("collision to "+ objPoints[i].id);
            collision = type;
        }else if ((Math.abs(objPoints[i].x4 - playerCenX) <= neighborhood) && (Math.abs(objPoints[i].y4 - playerCenY) <= neighborhood)) {
            //console.log("collision to "+ objPoints[i].id);
            collision = type;
        }
    }
}

/**
 * This function define what keys are using in the game, the behaivore and iteractions.
 */
function playerController(){
    var messages = {lose:"You lose - press f5", win: "You win!! - press f5 to restart"};
    var collisionDistance=24; 
    var step = 2;
    document.onkeydown = function (e) {
        e = e || window.event;
        
        if (e.key === "s") {
            if (collision == 1) {
                alert(messages.lose);
            }else if (collision == 2){
                alert(messages.win);
            }else{
                var actualTop = parseInt(player.style.top, 10);
                player.style.top = actualTop + step + "px";
                recalculateObjectPoints(playerParam, player);
                collisionDetector(collisionDistance, playerParam.centroidX, playerParam.centroidY, wallsPoints, 1);
                collisionDetector(collisionDistance, playerParam.centroidX, playerParam.centroidY, finishPoints, 2);
            }
        }else if (e.key === "w"){
            if (collision == 1) {
                alert(messages.lose);
            }else if (collision == 2){
                    alert(messages.win);
            }else{
                var actualTop = parseInt(player.style.top, 10);
                player.style.top = actualTop - step + "px";
                recalculateObjectPoints(playerParam, player);
                collisionDetector(collisionDistance, playerParam.centroidX, playerParam.centroidY, wallsPoints, 1);
                collisionDetector(collisionDistance, playerParam.centroidX, playerParam.centroidY, finishPoints, 2);
            }
        }else if (e.key === "d"){
            if (collision == 1) {
                alert(messages.lose);
            }else if (collision == 2){
                alert(messages.win);
            }else{
                var actualLeft = parseInt(player.style.left, 10);
                player.style.left = actualLeft + step + "px";
                recalculateObjectPoints(playerParam, player);
                collisionDetector(collisionDistance, playerParam.centroidX, playerParam.centroidY, wallsPoints, 1);
                collisionDetector(collisionDistance, playerParam.centroidX, playerParam.centroidY, finishPoints, 2);
            }
        }else if (e.key === "a"){
            if (collision == 1) {
                alert(messages.lose);
            }else if (collision == 2){
                alert(messages.win);
            }else{
                var actualLeft = parseInt(player.style.left, 10);
                player.style.left = actualLeft - step + "px";
                recalculateObjectPoints(playerParam, player);
                collisionDetector(collisionDistance, playerParam.centroidX, playerParam.centroidY, wallsPoints, 1);
                collisionDetector(collisionDistance, playerParam.centroidX, playerParam.centroidY, finishPoints, 2);
            }
        }
    }
}

function main(){
    mazeGenerator();
    createObject(player,playerParam.id, playerParam.position, playerParam.x1, playerParam.y1, playerParam.h, playerParam.w,
                 playerParam.background, playerParam.borderRad, playerParam.animation, playerParam.animationId);
    playerController();
}

main();