const canvas = document.getElementById('canvas');
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
const ctx = canvas.getContext("2d");
const objects = [
	new Cube(new Point3D(100, 100, 0), 100), //front right
	new Cube(new Point3D(-100, 100, 0), 100), //front left
	new Cube(new Point3D(100, 300, 0), 100), //back right
	new Cube(new Point3D(-100, 300, 0), 100) //back left
];
const scene = new Scene(ctx, objects, canvas.width / 2, canvas.height / 2);

document.addEventListener('keydown', function (event) {
    if (event.keyCode === 187) zoomIn() //+
    if (event.keyCode === 189) zoomOut()//-

    if (event.keyCode === 39) translate('left') //left arrow
    if (event.keyCode === 37) translate('right') //right arrow
    if (event.keyCode === 40) translate('forward') //up arrow
    if (event.keyCode === 38) translate('backward') //down arrow
		
    if (event.keyCode === 33) translate('up') //pageUp
    if (event.keyCode === 34) translate('down') //pageDown

    if (event.keyCode === 68) rotateCamera('right') //D
    if (event.keyCode === 65) rotateCamera('left') // A
    if (event.keyCode === 87) rotateCamera('up') // W
    if (event.keyCode === 83) rotateCamera('down') // S
	
	if (event.keyCode === 67) rotateCamera('clockwise') // C
    if (event.keyCode === 88) rotateCamera('counterclockwise') // X
})

scene.render();
