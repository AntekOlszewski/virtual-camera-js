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
	}
	
	drawXYAxis(){
		// x axis
		this.ctx.beginPath();
		this.ctx.moveTo(0,this.yMiddle);
		this.ctx.lineTo(this.xMiddle * 2, this.yMiddle);
		this.ctx.closePath();
		this.ctx.stroke();
		// y axis
		this.ctx.beginPath();
		this.ctx.moveTo(this.xMiddle,0);
		this.ctx.lineTo(this.xMiddle , this.yMiddle * 2);
		this.ctx.closePath();
		this.ctx.stroke();
	}
	
	render() {
		this.ctx.clearRect(0, 0, 2 * this.xMiddle, 2 * this.yMiddle);
		//this.drawXYAxis();
		for(let i = 0; i < this.objects.length; i++){
			for(let j = 0; j < this.objects[i].faces.length; j++){
				this.drawFace(this.objects[i].faces[j]);
			}
		}
	}
}