class Point2D {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}	
}

class Point3D {
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Cube {
	constructor(middle, edge, color){
		const d = edge / 2;
		this.vertices = [
			new Point3D(middle.x - d, middle.y - d, middle.z - d),
			new Point3D(middle.x - d, middle.y - d, middle.z + d),
			new Point3D(middle.x - d, middle.y + d, middle.z - d),
			new Point3D(middle.x - d, middle.y + d, middle.z + d),
			new Point3D(middle.x + d, middle.y - d, middle.z - d),
			new Point3D(middle.x + d, middle.y - d, middle.z + d),
			new Point3D(middle.x + d, middle.y + d, middle.z - d),
			new Point3D(middle.x + d, middle.y + d, middle.z + d)
		];
		/*this.vertices = [
			new Point3D(middle.x - 10, middle.y - d, middle.z - 100),
			new Point3D(middle.x - 10, middle.y - d, middle.z + 100),
			new Point3D(middle.x - 10, middle.y + d, middle.z - 100),
			new Point3D(middle.x - 10, middle.y + d, middle.z + 100),
			new Point3D(middle.x + 10, middle.y - d, middle.z - 100),
			new Point3D(middle.x + 10, middle.y - d, middle.z + 100),
			new Point3D(middle.x + 10, middle.y + d, middle.z - 100),
			new Point3D(middle.x + 10, middle.y + d, middle.z + 100)
		]; */
		
		this.faces = [
			[this.vertices[0], this.vertices[2], this.vertices[3], this.vertices[1], color], //left
			[this.vertices[1], this.vertices[3], this.vertices[7], this.vertices[5], color], //back
			[this.vertices[4], this.vertices[5], this.vertices[7], this.vertices[6], color], //right
			[this.vertices[0], this.vertices[2], this.vertices[6], this.vertices[4], color], //front
			[this.vertices[0], this.vertices[1], this.vertices[5], this.vertices[4], color], //bottom
			[this.vertices[2], this.vertices[3], this.vertices[7], this.vertices[6], color] //top
		];
	}
}