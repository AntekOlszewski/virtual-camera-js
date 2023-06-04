class Scene{
	constructor(ctx, objects, xMiddle, yMiddle){
		this.ctx = ctx;
		this.ctx.fillStyle = "white";
		this.objects = objects;
		this.xMiddle = xMiddle;
		this.yMiddle = yMiddle;
		this.focal = 600;
		this.focalStep = 10;
		this.translationStep = 10;
		this.rotateStep = 0.01;
	}
	
	project3Dto2D(point3D) {
		const r = this.focal / point3D.z;
		return new Point2D(r * point3D.x, r * point3D.y);
	}
	
	pvmult(point, vector) {
		return vector[0] * point.x + vector[1] * point.y + vector[2] * point.z + vector[3];
	}
	
	getPlaneFromPolygon(polygon) {
		let x1 = polygon[0].x;
		let y1 = polygon[0].y;
		let z1 = polygon[0].z;

		let x2 = polygon[1].x;
		let y2 = polygon[1].y;
		let z2 = polygon[1].z;

		let x3 = polygon[2].x;
		let y3 = polygon[2].y;
		let z3 = polygon[2].z;

		let ux = x2 - x1;
		let uy = y2 - y1;
		let uz = z2 - z1;
		let vx = x3 - x1;
		let vy = y3 - y1;
		let vz = z3 - z1;

		let a = uy * vz - uz * vy;
		let b = uz * vx - ux * vz;
		let c = ux * vy - uy * vx;
		let d = (-a * x1 - b * y1 - c * z1);
		return [a, b, c, d];
	}
	
	areAllPointsOnOppositeSide(polygon1, polygon2) {
		const plane = this.getPlaneFromPolygon(polygon1);
		return polygon2.every(p => this.isPointOnOppositeSide(p, plane));
	}
	
	isPointOnOppositeSide(point, plane) {
		if(typeof(point) == 'string') return true;
		return this.pvmult(point, plane) * this.pvmult(new Point3D(0, 0, 0), plane) >= 0;
	}
	
	areAllPointsOnObserverSide(polygon1, polygon2) {
		const plane = this.getPlaneFromPolygon(polygon1);
		return polygon2.every(p => this.isPointOnObserverSide(p, plane));
	}

	isPointOnObserverSide(point, plane) {
		if(typeof(point) == 'string') return true;
		return this.pvmult(point, plane) * this.pvmult(new Point3D(0, 0, 0), plane) < 0;
	}
	
	isPointIn2dFace(point, face){
		if(typeof(point) == 'string') return false;
		let minX = Number.MAX_VALUE;
		let minY = Number.MAX_VALUE;
		let maxX = Number.MIN_VALUE;
		let maxY = Number.MIN_VALUE;

		for (let point of face) {
		  minX = Math.min(minX, point.x);
		  minY = Math.min(minY, point.y);
		  maxX = Math.max(maxX, point.x);
		  maxY = Math.max(maxY, point.y);
		}

		return (point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY);
	}
	
	checkExclusion(a, b){
		let aminX = Number.MAX_VALUE;
		let aminY = Number.MAX_VALUE;
		let amaxX = Number.MIN_VALUE;
		let amaxY = Number.MIN_VALUE;

		for (let point of a) {
		  aminX = Math.min(aminX, point.x);
		  aminY = Math.min(aminY, point.y);
		  amaxX = Math.max(amaxX, point.x);
		  amaxY = Math.max(amaxY, point.y);
		}
		
		let bminX = Number.MAX_VALUE;
		let bminY = Number.MAX_VALUE;
		let bmaxX = Number.MIN_VALUE;
		let bmaxY = Number.MIN_VALUE;

		for (let point of b) {
		  bminX = Math.min(bminX, point.x);
		  bminY = Math.min(bminY, point.y);
		  bmaxX = Math.max(bmaxX, point.x);
		  bmaxY = Math.max(bmaxY, point.y);
		}
		
		return !(aminX < bmaxX && amaxX > bminX && aminY < bmaxY && amaxY > bminY)
	}
	
	getBounds(polygon2D) {
		let left = Number.MAX_VALUE;
		let top = Number.MIN_VALUE;
		let right = Number.MIN_VALUE;
		let bottom = Number.MAX_VALUE;

		for (let point of polygon2D) {
			left = Math.min(left, point.x);
			top = Math.max(top, point.y);
			right = Math.max(right, point.x);
			bottom = Math.min(bottom, point.y);
		}
		return [
			new Point2D(left, top),
			new Point2D(right, top),
			new Point2D(right, bottom),
			new Point2D(left, bottom)
		];
	}
		
	//a,b = faces projected to 2d
	intersect(a, b){
		return a.some(p => this.isPointIn2dFace(p, b)) || b.some(p => this.isPointIn2dFace(p, a));
	}
	
	excludeBoundInterference(polygon1, polygon2) {
		return !this.intersect(this.getBounds(polygon1), this.getBounds(polygon2));
	}
	
	excludeInterference(polygon1, polygon2) {
		return !this.intersect(polygon1, polygon2);
	}
	
	compareZIndexes(b, a){
		let bminZ = Number.MAX_VALUE;
		let amaxZ = Number.MIN_VALUE;

		for (let point of a) {
		  amaxZ = Math.max(amaxZ, point.z);
		}
		
		for (let point of b) {
		  bminZ = Math.min(bminZ, point.z);
		}
		
		return amaxZ > bminZ;
	}

	compareFaces(a, b, secondRun = false) {
		const a2d = [
			this.project3Dto2D(a[0]),
			this.project3Dto2D(a[1]),
			this.project3Dto2D(a[2]),
			this.project3Dto2D(a[3])
		];
		const b2d = [
			this.project3Dto2D(b[0]),
			this.project3Dto2D(b[1]),
			this.project3Dto2D(b[2]),
			this.project3Dto2D(b[3])
		];
		
		
		if (this.checkExclusion(a2d, b2d) && !secondRun) {
		  return -1;
		}
		if (this.excludeInterference(a2d, b2d) && !secondRun) {
		  return -1;
		}
		if(this.compareZIndexes(a, b) && !secondRun){
			return -1;
		}
		if (this.areAllPointsOnOppositeSide(a, b)) {
		  return secondRun ? 1 : -1;
		}
		if (this.areAllPointsOnObserverSide(b, a)) {
			return secondRun ? 1 : -1;
		}
		
		return secondRun ? 1 : this.compareFaces(b, a, true);
	}
	
	drawFace(face){
		if(face[0].z < 0 || face[1].z < 0 || face[2].z < 0 || face[3].z < 0) return;
		this.ctx.fillStyle = face[4];
		this.ctx.strokeStyle = face[4];
		this.ctx.beginPath();
		let p = this.project3Dto2D(face[0]);
		ctx.moveTo(p.x + this.xMiddle, -p.y + this.yMiddle);
		for(let i = 1; i < 4; i++){
			p = this.project3Dto2D(face[i]);
			if (p == undefined) return;
			this.ctx.lineTo(p.x + this.xMiddle, -p.y + this.yMiddle);
		} 
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.fill();
	}
	
	render() {
		this.ctx.clearRect(0, 0, 2 * this.xMiddle, 2 * this.yMiddle);
		let faces = this.objects.map(o => o.faces);
		faces = [].concat.apply([],faces);

		faces.sort((a, b) => this.compareFaces(a, b));

		// faces.sort(this.compareFaces);
		faces.forEach(f => {
			this.drawFace(f);
		});
	}
}