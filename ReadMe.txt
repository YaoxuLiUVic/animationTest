Assignment 02   CSC 305
Student:		Yaoxu Li  V00908578
Date:			March 07 2021

== Description == 
This assignmnet asks students to draw an animation scene in js/webGL.
Template code is provided. Student should edit or design a shader.

==============================================
== IMPORTANT: Security Issues with Textures == 
==============================================
If the textures do not work, check the console for an error message related to “Cross-origin image”.  To use textures in WebGL we have to bypass a security issue that is present with most browsers.

Chrome (Recommend!)
Close all running chrome instances first. Then start Chrome executable with a command line flag (strongly suggest making this a desktop icon for easy reuse):

chrome --allow-file-access-from-files

Firefox
Go to:  about:config
Find: security.fileuri.strict_origin_policy parameter
Set it to false

For more details and other methods see:

https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally


== Student Work ==

Shader: Use Blinn-Phong lighting model to shade textured object with light reflection. 
This shader will dislay texture and do reflect of the light hitting the object surface.
You can open comparison.png to see visible effect of the shader(For more details and implementation see main.html fragment shader)


Scene: A 50 seconds Real-Time sence simulates the storytelling of Battle of Midway.
Scene0(0-8s): Japan Naval Aviation Plane take off.
Scene1(8-22s): IJN Plane bombing Midway Island.
Scene2(22-25s): Midway Island.
Scene3(25-27s): US Navy Task Force 16.
Scene4(27-35s): TF16 Carrier-based aircraft take off.
Scene4(35-46s): Japan aircraft carrier be bombed and sink.
Scene4(46s-): Allies win.(Display a picture cube)

Please open description.jpg to see how does it implement in coordinate system.
Thank you.


Marking Scheme(what I have done):
[4 Marks] one two-level hierarchical object. [checked]
[6 Marks] At least two textures either procedural or mapped. [checked]
[10 Marks] At least one shader edited or designed [checked]
[4 Marks] 360 degrees camera fly around  [checked]
[4 Marks] Connection to real-time. [checked]
[2 Marks] frame rate / 2s [checked]  //see main.html left top
[5 Marks] Complexity: [checked]
[5 Marks] Creativity:  [checked]
[5 Marks] Quality:  	[checked]
[2 Marks] Programming style.[checked]