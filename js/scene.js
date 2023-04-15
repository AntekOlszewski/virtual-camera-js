class Scene{
	constructor(ctx, objects, xMiddle, yMiddle){
		this.ctx = ctx;
		this.objects = objects;
		this.xMiddle = xMiddle;
		this.yMiddle = yMiddle;
		this.focal = 600;
		this.focalStep = 10;
		this.translationStep = 10;
		this.rotateStep = 0.01;
		this.ctx.fillStyle = "white";
	}
	
	project3Dto2D(point3D) {
		if (point3D.y < 0) return;
		const r = this.focal / point3D.y;
		return new Point2D(r * point3D.x, r * point3D.z);
	}
	
	drawFace(face){
		this.ctx.beginPath();
		let p = this.project3Dto2D(face[0]);
		if (p == undefined) return;
		ctx.moveTo(p.x + this.xMiddle, -p.y + this.yMiddle);
		for(let i = 1; i < face.length; i++){
			p = this.project3Dto2D(face[i]);
			if (p == undefined) return;
			this.ctx.lineTo(p.x + this.xMiddle, -p.y + this.yMiddle);
		}
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.fill();
	}
	
	compareFaces(a, b) {
		const maxAz = Math.max(...a.map(vertex => vertex.z))
		const maxBz = Math.max(...b.map(vertex => vertex.z))
		const maxAy = Math.max(...a.map(vertex => vertex.y))
		const maxBy = Math.max(...b.map(vertex => vertex.y))
		const maxAx = Math.max(...a.map(vertex => vertex.x))
		const maxBx = Math.max(...b.map(vertex => vertex.x))
	
		const minAz = Math.min(...a.map(vertex => vertex.z))
		const minBz = Math.min(...b.map(vertex => vertex.z))
		const minAy = Math.min(...a.map(vertex => vertex.y))
		const minBy = Math.min(...b.map(vertex => vertex.y))
		const minAx = Math.min(...a.map(vertex => vertex.x))
		const minBx = Math.min(...b.map(vertex => vertex.x))
	
		const Amid = [(maxAx + minAx)/2, (maxAy + minAy)/2, (maxAz + minAz)/2];
		const Bmid = [(maxBx + minBx)/2, (maxBy + minBy)/2, (maxBz + minBz)/2];
	
		const distA = Math.pow(Amid[0], 2) + Math.pow(Amid[1], 2) + Math.pow(Amid[2], 2);
		const distB = Math.pow(Bmid[0], 2) + Math.pow(Bmid[1], 2) + Math.pow(Bmid[2], 2);
		
		return distB - distA;
	}

	render() {
		this.ctx.clearRect(0, 0, 2 * this.xMiddle, 2 * this.yMiddle);
		let faces = this.objects.map(o => o.faces);
		faces = [].concat.apply([],faces);
		faces.sort(this.compareFaces);
		faces.forEach(f => {
			this.drawFace(f);
		});
	}
}