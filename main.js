/* eslint-disable */
/***************************************************
*	main.js
*	BaseCode provided by CSC 305
*	Modified by Yaoxu_Li
*	UVic ID: V00908578
*	2021/03/17
*	Drwaing animated scene
*
*	Scene Name: Battle of Midway
****************************************************/

var canvas;
var gl;

var program ;

var near = 0.1;
var far = 100;


var left = -5.0;
var right = 5.0;
var ytop =5.0;
var bottom = -5.0;

var objectX = 0;//global var for anime camera coordinations
var objectY = 0;
var objectZ = 0;

var lightPosition2 = vec4(0.0, 20.0, 25.0, 1.0 );
var lightPosition = vec4(0.0, 20.0, 25.0, 1.0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 0.1, 0.1, 0.1, 1.0 );////////////
var lightSpecular = vec4( 0.7, 0.7, 0.7, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );////////
var materialShininess = 25.0;


var ambientColor, diffuseColor, specularColor;

var modelMatrix, viewMatrix ;
var modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var eye;
var at = vec3(0, 0, 0);
var up = vec3(0.0, 1.0, 0.0);

var RX = 0 ;
var RY = 0 ;
var RZ = 0 ;

var MS = [] ; // The modeling matrix stack
var TIME = 0.0 ; // Realtime
//var TIME = 0.0 ; // Realtime
var resetTimerFlag = true ;
var animFlag = false ;
var prevTime = 0.0 ;
var useTextures = 1 ;

var lastTimeFPS = 0;

console.disableYellowBox = true;
// ------------ Images for textures stuff --------------
var texSize = 64;

var image1 = new Array()
for (var i =0; i<texSize; i++)  image1[i] = new Array();
for (var i =0; i<texSize; i++)
for ( var j = 0; j < texSize; j++)
image1[i][j] = new Float32Array(4);
for (var i =0; i<texSize; i++) for (var j=0; j<texSize; j++) {
    var c = (((i & 0x8) == 0) ^ ((j & 0x8)  == 0));
    image1[i][j] = [c, c, c, 1];
}

// Convert floats to ubytes for texture

var image2 = new Uint8Array(4*texSize*texSize);

for ( var i = 0; i < texSize; i++ )
for ( var j = 0; j < texSize; j++ )
for(var k =0; k<4; k++)
image2[4*texSize*i+4*j+k] = 255*image1[i][j][k];


var textureArray = [] ;



function isLoaded(im) {
    if (im.complete) {
        console.log("loaded") ;
        return true ;
    }
    else {
        console.log("still not loaded!!!!") ;
        return false ;
    }
}

function loadFileTexture(tex, filename)
{
    tex.textureWebGL  = gl.createTexture();
    tex.image = new Image();
    tex.image.src = filename ;
    tex.isTextureReady = false ;
    tex.image.onload = function() { handleTextureLoaded(tex); }
    // The image is going to be loaded asyncronously (lazy) which could be
    // after the program continues to the next functions. OUCH!
}

function loadImageTexture(tex, image) {
    tex.textureWebGL  = gl.createTexture();
    tex.image = new Image();
    //tex.image.src = "CheckerBoard-from-Memory" ;
    
    gl.bindTexture( gl.TEXTURE_2D, tex.textureWebGL );
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0,
                  gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                     gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
    gl.bindTexture(gl.TEXTURE_2D, null);

    tex.isTextureReady = true ;

}

function initTextures() {
    
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"texture/sunset.bmp") ;
    
    
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"texture/sky.jpg") ;//1
	
	textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/sea.png") ;//2
	
	textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/deck.jpg") ;//3
	
		textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/JapShip.png") ;//4
	
		textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/land.jpg") ;//5
	
		textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/deck2.jpg") ;//6
		textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/USship.jpg") ;//7
			textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"color/green.jpg");//8
				textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"color/red.jpg");//9
				textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"color/black.jpg");//10
					textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"color/grey.jpg");//11
					textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"color/blue.jpg");//12
					textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/USNavy.jpg");//13
						textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"color/brown.jpg");//14
	textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/flag01.jpg");//15
	textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/flag02.jpg");//16
	textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/flag03.jpg");//17
	textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/flag04.jpg");//18
	textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/flag04.jpg");//19
	textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/flag04.jpg");//20
	textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/boom.jpg");//21
		textureArray.push({}) ;
	loadFileTexture(textureArray[textureArray.length-1],"texture/MIDWAY.jpg");//22
}


function handleTextureLoaded(textureObj) {
    gl.bindTexture(gl.TEXTURE_2D, textureObj.textureWebGL);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // otherwise the image would be flipped upsdide down
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureObj.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
    gl.bindTexture(gl.TEXTURE_2D, null);
    console.log(textureObj.image.src) ;
    
    textureObj.isTextureReady = true ;
}

//----------------------------------------------------------------

function setColor(c)
{
    ambientProduct = mult(lightAmbient, c);
    diffuseProduct = mult(lightDiffuse, c);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
                                        "shininess"),materialShininess );
}

function toggleTextures() {
    useTextures = 1 - useTextures ;
    gl.uniform1i( gl.getUniformLocation(program,
                                         "useTextures"), useTextures );
}

function waitForTextures1(tex) {
    setTimeout( function() {
    console.log("Waiting for: "+ tex.image.src) ;
    wtime = (new Date()).getTime() ;
    if( !tex.isTextureReady )
    {
        console.log(wtime + " not ready yet") ;
        waitForTextures1(tex) ;
    }
    else
    {
        console.log("ready to render") ;
        window.requestAnimFrame(render);
    }
               },5) ;
    
}

// Takes an array of textures and calls render if the textures are created
function waitForTextures(texs) {
    setTimeout( function() {
               var n = 0 ;
               for ( var i = 0 ; i < texs.length ; i++ )
               {
                    console.log("boo"+texs[i].image.src) ;
                    n = n+texs[i].isTextureReady ;
               }
               wtime = (new Date()).getTime() ;
               if( n != texs.length )
               {
               console.log(wtime + " not ready yet") ;
               waitForTextures(texs) ;
               }
               else
               {
               console.log("ready to render") ;
               window.requestAnimFrame(render);
               }
               },5) ;
    
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.9, 1.0, 1.0 );

    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
 
    // Load canonical objects and their attributes
    Cube.init(program);
    Cylinder.init(9,program);
    Cone.init(9,program) ;
    Sphere.init(36,program) ;

    gl.uniform1i( gl.getUniformLocation(program, "useTextures"), useTextures );

    // record the locations of the matrices that are used in the shaders
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    // set a default material
    setColor(materialDiffuse) ;
    
  
    
    // set the callbacks for the UI elements
    document.getElementById("sliderXi").oninput = function() {
        RX = this.value ;
        window.requestAnimFrame(render);
    };
    document.getElementById("sliderYi").oninput = function() {
        RY = this.value;
        window.requestAnimFrame(render);
    };
    document.getElementById("sliderZi").oninput = function() {
        RZ =  this.value;
        window.requestAnimFrame(render);
    };
    
    document.getElementById("animToggleButton").onclick = function() {
        if( animFlag ) {
            animFlag = false;
        }
        else {
            animFlag = true  ;
            resetTimerFlag = true ;
            window.requestAnimFrame(render);
        }
    };
    
//    document.getElementById("textureToggleButton").onclick = function() {
//        toggleTextures() ;
 //       window.requestAnimFrame(render);
 //   };

    var controller = new CameraController(canvas);
    controller.onchange = function(xRot,yRot) {
        RX = xRot ;
        RY = yRot ;
        window.requestAnimFrame(render); };
    
    // load and initialize the textures
    initTextures() ;
    
    // Recursive wait for the textures to load
    waitForTextures(textureArray) ;
    //setTimeout (render, 100) ;
	
	//gl.activeTexture(gl.TEXTURE0);
	//gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
	//gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
    
}

// Sets the modelview and normal matrix in the shaders shader
function setMV() {
    modelViewMatrix = mult(viewMatrix,modelMatrix) ;
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    normalMatrix = inverseTranspose(modelViewMatrix) ;
    gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix) );
}

// Sets the projection, modelview and normal matrix in the shaders
function setAllMatrices() {
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    setMV() ;
    
}

// Draws a 2x2x2 cube center at the origin
// Sets the modelview matrix and the normal matrix of the global program
function drawCube() {
    setMV() ;
    Cube.draw() ;
}

// Draws a sphere centered at the origin of radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
function drawSphere() {
    setMV() ;
    Sphere.draw() ;
}
// Draws a cylinder along z of height 1 centered at the origin
// and radius 0.5.
// Sets the modelview matrix and the normal matrix of the global program
function drawCylinder() {
    setMV() ;
    Cylinder.draw() ;
}

// Draws a cone along z of height 1 centered at the origin
// and base radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
function drawCone() {
    setMV() ;
    Cone.draw() ;
}

// Post multiples the modelview matrix with a translation matrix
// and replaces the modelview matrix with the result
function gTranslate(x,y,z) {
    modelMatrix = mult(modelMatrix,translate([x,y,z])) ;
}

// Post multiples the modelview matrix with a rotation matrix
// and replaces the modelview matrix with the result
function gRotate(theta,x,y,z) {
    modelMatrix = mult(modelMatrix,rotate(theta,[x,y,z])) ;
}

// Post multiples the modelview matrix with a scaling matrix
// and replaces the modelview matrix with the result
function gScale(sx,sy,sz) {
    modelMatrix = mult(modelMatrix,scale(sx,sy,sz)) ;
}

// Pops MS and stores the result as the current modelMatrix
function gPop() {
    modelMatrix = MS.pop() ;
}

// pushes the current modelMatrix in the stack MS
function gPush() {
    MS.push(modelMatrix) ;
}

function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

	
	
	//360 degrees camera fly around
	//Diffrent scene
	//
	
	if(TIME<8){
		at = vec3(-15, -6.2, -15);
		eye = vec3(-11-TIME*0.5, -4.0-TIME*0.3,-18+TIME*0);
	}
	else if(TIME>=8&&TIME <22){
		at = vec3(objectX-1, objectY-1, objectZ-1);
		eye = vec3(objectX, objectY, objectZ);
	}
	else if(TIME>=22&&TIME < 25){
		objectX = 20;
		objecty= -6.6;
		objectZ=  20;	
		at = vec3(18, -6.6, 18);
		eye = vec3(22-TIME+22, -6.6, 22+TIME*0.5-11);
	}
	else if(TIME >= 25&& TIME <27){
		at = vec3(20+TIME*0.2-5, -6.5, -15+TIME*0.2-5);
		eye = vec3(5, -5,-5);
	}	

	else if(TIME >= 27 && TIME <35){
		at = vec3(20, -6.5, -15);
		eye = vec3(20+TIME*0.5-13.5, -6.65+TIME-27,-19);
	} 
	else if(TIME >= 35 && TIME <46){
		at = vec3(-15, -6.2, -15);
		eye = vec3(-13, -6.6,-21);
	}
	else if(TIME >= 45.9){
		at = vec3(0, -6.2, 10);
		eye = vec3(0, -6.2,-2);
	}
	
	
	
	
   
    // set the projection matrix
   // projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    projectionMatrix = perspective(90, 1, near, far);
	
    // set the camera matrix
    viewMatrix = lookAt(eye, at , up);
    
    // initialize the modeling matrix stack
    MS= [] ;
    modelMatrix = mat4() ;
    
    // apply the slider rotations
    gRotate(RZ,0,0,1) ;
    gRotate(RY,0,1,0) ;
    gRotate(RX,1,0,0) ;
    
    // send all the matrices to the shaders
    setAllMatrices() ;
    
    // get real time
    var curTime ;
    if( animFlag )
    {
        curTime = (new Date()).getTime() /1000 ;
        if( resetTimerFlag ) {
            prevTime = curTime ;
            resetTimerFlag = false ;
        }
        TIME = TIME + curTime - prevTime ;
		
		//out fps
		if((curTime - lastTimeFPS) > 1.0){
			var element = document.getElementById("fps");
			element.innerHTML = Math.floor(1.0/(curTime - prevTime));
			lastTimeFPS = curTime;
		}
		
	
        prevTime = curTime ;
    }


    
	
	//draw our objects and their enevts
	drawBackground();
    drawJapanShip();
	drawUSShip();
	drawJapanPlane();
	drawUSPlane();
	drawEnd();
	
	
	
	
    if( animFlag )
        window.requestAnimFrame(render);
}


/***************************************************
*	draw background : sky, sea, island and Anime explosion 
*	and a US flag and its animation
****************************************************/
function drawBackground()
{
	
	//sky
    gPush() ;
    {
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
		gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);
        gTranslate(3,-10,0) ;
        setColor(vec4(0.0,1.0,0.0,1.0)) ;
		gScale(35,30,35);
        drawSphere() ;
    }
    gPop() ;
    
	//sea
	gPush() ;
    {
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureArray[2].textureWebGL);
		gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
		
	
        gTranslate(0,-7,0) ;
        setColor(vec4(0.0,1.0,0.0,1.0)) ;
		gScale(33,0.11,33);
        drawCube() ;
    }
    gPop() ;
    
    //midway island
    gPush() ;
    {
        gTranslate(15,-6.8,15) ;
        gRotate(-90,1,0,0) ;
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
		gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);		
		gScale(6,6,3);
        drawCone();
		
		gTranslate(-0.5,0,0);
		gScale(0.1,0.1,0.1);
		
		//explosion BOOM!
		for(i = 1; i < 3; i++){
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[21].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);	
			gTranslate(0,-1,0);
			
			if(TIME>=18.7 && TIME<18.7+0.5*i){
				gPush();{
					var boom = (TIME-18.7-(0.5*(i-1)))*5.0;
					gScale(boom,boom,boom);
					drawSphere();
				}
				gPop();
			}
		}
    }
    gPop() ;
	
	
	//US flag
	gPush() ;
    {
		gTranslate(15,-5,15) ;
		setColor(vec4(0.1,0.8,0.1,1.0)) ;
		gScale(0.7,0.7,0.7);
		gPush();{
			gScale(0.1,2,0.1);
			drawCube();
			gTranslate(2.5,0.5,0);
			
			//FLAG animation
			//this part refs Assignment 01 seaweed animation
			var i = 0;
			for (i = 0; i < 6; i++) {
				gPush() ;{
					gScale(2.5,0.5,1);
					gl.activeTexture(gl.TEXTURE0);
					gl.bindTexture(gl.TEXTURE_2D, textureArray[15+i].textureWebGL);
					gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
					drawCube();
				}gPop();

				gTranslate(5,0,0);
				gRotate(30*Math.cos(TIME+i*30),0,1,0) ;
			}	
				
		}
		gPop();
    }
	gPop();


}


/***************************************************
*	draw a japanese aircraft carriers and its motion animation.
****************************************************/
function drawJapanShip(){
	gPush() ;
    {
		gTranslate(-15,-6.5,-15);
        gScale(0.4,0.4,0.4);
		gRotate(135,0,1,0);
		
		//sink
		if(TIME>38.5&&TIME<=46){
			    gTranslate(0,(-TIME+38.5)*0.2,0);
				gRotate((TIME-38.5),0,0,1);
				
		}
		
		
		//Flight deck
		gPush() ;
		{
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[3].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(10,0.1,2);
			drawCube() ;
		}
		gPop() ;
		
		//Ship body
		gPush() ;
		{
			gTranslate(0,-0.51,0)
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[4].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(9,0.6,1);
			drawCube();
		}
		gPop() ;
		
		//explosion animation
		gPush();{
			if(TIME>37){
				//explosion BOOM!
				for(i = 1; i < 3; i++){
					gl.activeTexture(gl.TEXTURE0);
					gl.bindTexture(gl.TEXTURE_2D, textureArray[21].textureWebGL);
					gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);	
					gTranslate(0,-1,0);
					
					if(TIME>=37.5 && TIME<37.5+i){
						gPush();{
							var boom = (TIME-37.5-(i-1))*7.0;
							gScale(boom,boom,boom);
							drawSphere();
						}
						gPop();
					}
				}
				
			}
			
		}
		gPop();
    }
    gPop() ;
}

/***************************************************
*	draw a US aircraft carrier and its motion animation.
****************************************************/
function drawUSShip(){
	gPush() ;
    {
		gTranslate(20,-6.5,-15);
        gScale(0.4,0.4,0.4);
		gRotate(0,0,1,0);
		
		//Flight deck
		gPush() ;
		{
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[6].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(10,0.1,2);
			drawCube() ;
		}
		gPop() ;
		
		//ship body
		gPush() ;
		{
			gTranslate(0,-0.51,0)
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[7].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(9,0.6,1);
			drawCube() ;
		}
		gPop() ;
    }
    gPop() ;
}

/***************************************************
*	draw a Japanese plane (aircraft) and its motion animation.
****************************************************/
function drawJapanPlane(){
	gPush() ;
    {
		gTranslate(-15,-6.4,-15);
		objectX = -15;
		objectY = -6.2;
		objectZ = -15;
		
		
        gScale(0.4,0.4,0.4);
		//objectXYZ record Plane motion path
		objectX = objectX*0.4;
		objectY = objectY*0.4;
		objectZ = objectZ*0.4;
		
		gRotate(135,0,1,0);
		
		
		//Japan plane motion path
		if (TIME > 3&& TIME<=4){
			gTranslate(0-(TIME)*2+6,0,0);
			objectX = objectX +((TIME)*2-6)*0.4*Math.cos(45);
			objectZ = objectZ +((TIME)*2-6)*0.4*Math.cos(45);
		}
		else if (TIME > 4 && TIME <=8){
			gTranslate(-2,0,0);
			gTranslate(0-(TIME)*3+12,(TIME-4)*0.2,0);
			objectX = objectX +((TIME)*2-8)*0.4*Math.cos(45);
			objectZ = objectZ +((TIME)*2-8)*0.4*Math.cos(45);
			objectY = objectY+(TIME-3)*0.2*0.4;
		}
		else if (TIME > 8 &&TIME <=22) {
			
			gTranslate(-2-8,0+0.8,0);
			gTranslate(0-(TIME)*9.5+76,(TIME*1.6-12.8),0);
			objectX = objectX+((TIME)*5-40)*0.8*Math.cos(45);
			objectZ = objectZ+((TIME)*5-40)*0.8*Math.cos(45);
			objectY = objectY+(TIME-3)*0.2*0.6;
		}
		else if (TIME > 38.25 ) {
			gTranslate(0,-100,0);
		}


		//draw a plane(aircraft) nothing is excitied.
		gPush() ;
		{
			setColor(vec4(0.5,0.5,0.5,1.0)) ;
			gRotate(-TIME*180/3.14159*29,1,0,0);
			
			gPush() ;
			{
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, textureArray[14].textureWebGL);
				gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
				gTranslate(0,0.5,0);
				gRotate(90,1,0,0);
				gScale(0.1,0.2,0.5);
				drawSphere();
				gTranslate(0,0,2);
				drawSphere();
			}
			gPop() ;
			
		}
		gPop() ;
		
		gPush() ;
		{
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[8].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);

			gScale(2,0.4,0.4);
			gTranslate(1,0,0);
			drawSphere();
			gScale(0.3,0.1,6);
			drawSphere();
			gScale(0.5,0.5,0.5);
			gTranslate(5,1,0);
			drawSphere();
		}
		gPop() ;
		
		gPush() ;
		{
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[11].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			setColor(vec4(0.5,0.5,0.5,1.0)) ;
			gScale(0.5,0.2,0.2);
			gTranslate(3,1.8,0);
			drawSphere();
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[8].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(0.85,2,0.2);
			gTranslate(4.7,0,0);
			drawCube();//weiYi
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[9].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(0.5,0.5,2);
			drawSphere();
		}
		gPop() ;
		
		gPush() ;
		{
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[9].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(0.3,0.05,0.3);
			gTranslate(6.5,0,4);
			drawSphere();
			gTranslate(0,0,-8);
			
			drawSphere();
		}
		gPop() ;
		
	}gPop();
	
}


/***************************************************
*	draw a US aircraft and its motion animation.
****************************************************/
function drawUSPlane(){
    gPush() ;
    {

		gTranslate(20,-6.2,-15);
        gScale(0.4,0.4,0.4);	
		
		//US plane motion path
		if (TIME > 28&& TIME<=30){
			gTranslate(0-(TIME)*2+56,0,0);
		}
		if (TIME > 30 && TIME <=35){
			gTranslate(-4,0,0);
			gTranslate(0-(TIME)*4+120,(TIME-30)*0.5,0);
		}
		
		
		
		//draw a plane(aircraft) nothing is excitied.
		gPush() ;
		{
			setColor(vec4(0.5,0.5,0.5,1.0)) ;
			
			gRotate(-TIME*180/3.14159*28,1,0,0);
			gPush() ;
			{
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, textureArray[14].textureWebGL);
				gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
				gTranslate(0,0.5,0);
				gRotate(90,1,0,0);
				gScale(0.1,0.2,0.5);
				drawSphere();
				gTranslate(0,0,2);
				drawSphere();
			}
			gPop() ;
			
		}
		gPop() ;
		
		gPush() ;
		{
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[12].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(2,0.4,0.4);
			gTranslate(1,0,0);
			drawSphere();
			gScale(0.3,0.1,6);
			drawSphere();
			gScale(0.5,0.5,0.5);
			gTranslate(5,1,0);
			drawSphere();
		}
		gPop() ;
		
		gPush() ;
		{
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[11].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			setColor(vec4(0.5,0.5,0.5,1.0)) ;
			gScale(0.5,0.2,0.2);
			gTranslate(3,1.8,0);
			drawSphere();
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[12].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(0.85,2,0.2);
			gTranslate(4.7,0,0);
			drawCube();//weiYi
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[13].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(0.5,0.5,2);
			drawCube();
		}
		gPop() ;
		
		gPush() ;
		{
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textureArray[13].textureWebGL);
			gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
			gScale(0.3,0.05,0.3);
			gTranslate(6.5,0,4);
			drawCube();
			gTranslate(0,0,-8);
			
			drawCube();
		}
		gPop() ;
		

    }
    gPop() ;

}

//ends here
/***************************************************
*	draw END picture
****************************************************/
function drawEnd(){
    gPush() ;
    {
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureArray[22].textureWebGL);
		gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
		if(TIME > 46){
			gScale(1.2,1,1);
			gTranslate(0,-5.5,1.5);
			drawCube();
		}
    }
    gPop() ;

}





// A simple camera controller which uses an HTML element as the event
// source for constructing a view matrix. Assign an "onchange"
// function to the controller as follows to receive the updated X and
// Y angles for the camera:
//
//   var controller = new CameraController(canvas);
//   controller.onchange = function(xRot, yRot) { ... };
//
// The view matrix is computed elsewhere.
function CameraController(element) {
    var controller = this;
    this.onchange = null;
    this.xRot = 0;
    this.yRot = 0;
    this.scaleFactor = 3.0;
    this.dragging = false;
    this.curX = 0;
    this.curY = 0;
    
    // Assign a mouse down handler to the HTML element.
    element.onmousedown = function(ev) {
        controller.dragging = true;
        controller.curX = ev.clientX;
        controller.curY = ev.clientY;
    };
    
    // Assign a mouse up handler to the HTML element.
    element.onmouseup = function(ev) {
        controller.dragging = false;
    };
    
    // Assign a mouse move handler to the HTML element.
    element.onmousemove = function(ev) {
        if (controller.dragging) {
            // Determine how far we have moved since the last mouse move
            // event.
            var curX = ev.clientX;
            var curY = ev.clientY;
            var deltaX = (controller.curX - curX) / controller.scaleFactor;
            var deltaY = (controller.curY - curY) / controller.scaleFactor;
            controller.curX = curX;
            controller.curY = curY;
            // Update the X and Y rotation angles based on the mouse motion.
            controller.yRot = (controller.yRot + deltaX) % 360;
            controller.xRot = (controller.xRot + deltaY);
            // Clamp the X rotation to prevent the camera from going upside
            // down.
            if (controller.xRot < -90) {
                controller.xRot = -90;
            } else if (controller.xRot > 90) {
                controller.xRot = 90;
            }
            // Send the onchange event to any listener.
            if (controller.onchange != null) {
                controller.onchange(controller.xRot, controller.yRot);
            }
        }
    };
}

function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = '48px serif';
  ctx.fillText('Hello world', 10, 50);
}
