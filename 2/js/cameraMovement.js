function zoomIn(){
	scene.focal += scene.focalStep;
	scene.render();
}

function zoomOut(){
	if(scene.focal <= scene.focalStep) return;
	scene.focal -= scene.focalStep;
	scene.render();
}

function translate(direction){
	let translation;
	const s = scene.translationStep;
	switch(direction){
		case 'left':
			translation = [-s, 0, 0];
			break;
		case 'right':
			translation = [s, 0, 0];
			break;
		case 'up':
			translation = [0, -s, 0];
			break;
		case 'down':
			translation = [0, s, 0];
			break;
		case 'forward':
			translation = [0, 0, s];
			break;
		case 'backward':
			translation = [0, 0, -s];
			break;
	}
	scene.objects.forEach(o =>{
		o.vertices.forEach(v =>{
			v.x += translation[0];
			v.y += translation[1];
			v.z += translation[2];
		});
	});
	scene.render();
}

function rotateCamera(direction){
	const s = scene.rotateStep;
	scene.objects.forEach(o =>{
		o.vertices.forEach(v =>{
			switch(direction){
				case 'right':
					v.x = (v.x * Math.cos(s) - v.y * Math.sin(s));
					v.y = (v.x * Math.sin(s) + v.y * Math.cos(s));
					break;
				case 'left':
					v.x = (v.x * Math.cos(s) - v.y * Math.sin(-s));
					v.y = (v.x * Math.sin(-s) + v.y * Math.cos(s));
					break;
				case 'up':
					v.y = (v.y * Math.cos(s) - v.z * Math.sin(-s));
					v.z = (v.y * Math.sin(-s) + v.z * Math.cos(s));
					break;
				case 'down':
					v.y = (v.y * Math.cos(s) - v.z * Math.sin(s));
					v.z = (v.y * Math.sin(s) + v.z * Math.cos(s));
					break;
				case 'clockwise':
					v.x = (v.x * Math.cos(s) - v.z * Math.sin(s));
					v.z = (v.x * Math.sin(s) + v.z * Math.cos(s));
					break;
				case 'counterclockwise':
					v.x = (v.x * Math.cos(s) - v.z * Math.sin(-s));
					v.z = (v.x * Math.sin(-s) + v.z * Math.cos(s));
					break;
			}
		});
	});
	scene.render();
}