import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyBuildingFloor } from './MyBuildingFloor.js';

export class MyBuilding extends CGFobject {
	constructor(scene, totalLength, numFloor, numWindow, color = [255,255,255]) {
    super(scene);

    this.numFloor       = numFloor;
    this.buildingFloor  = new MyBuildingFloor(this.scene,numWindow,false,false);
    this.baseFloor      = new MyBuildingFloor(this.scene,numWindow,true,false);
    this.topFloor       = new MyBuildingFloor(this.scene,numWindow,false,true);
    this.totalLength    = totalLength;
    this.color          = color;

    this.colorMaterial = null;

  }

  initMaterials(textureManager) {
    const [r,g,b] = this.color
    this.colorMaterial = new CGFappearance(this.scene);
    this.colorMaterial.setAmbient(r/255 * 0.5,g/255 * 0.5,b/255 * 0.5, 1);
    this.colorMaterial.setDiffuse(r/255 * 0.5,g/255 * 0.5,b/255 * 0.5, 1);
    this.colorMaterial.setDiffuse(r/255 * 0.5,g/255 * 0.5,b/255 * 0.5, 1);
    this.colorMaterial.setShininess(10.0);

    this.buildingFloor.initMaterials(textureManager);
    this.baseFloor.initMaterials(textureManager);
    this.topFloor.initMaterials(textureManager);
  }

	display() {
    const scale = this.totalLength;
    const planeOffset = 0.5
    const buildingOffset = 1.2
    let it = 1


    for (let i = 0; i < this.numFloor; i++) {
      this.scene.pushMatrix()
      this.colorMaterial.apply();
      this.scene.scale(scale,scale/2,scale);
      this.scene.translate(1,planeOffset + i,0)
      this.buildingFloor.display();
      this.scene.popMatrix()
    }

    this.scene.pushMatrix()
    this.scene.scale(scale,scale/2,scale*buildingOffset);
    this.colorMaterial.apply();
    this.scene.translate(0,planeOffset,0)
    this.baseFloor.display();
    this.scene.popMatrix()

    for (; it < this.numFloor; it++) {
      this.scene.pushMatrix()
      this.colorMaterial.apply();
      this.scene.scale(scale,scale/2,scale*buildingOffset);
      this.scene.translate(0,planeOffset+ it,0)
      this.buildingFloor.display();
      this.scene.popMatrix()
    }

    this.scene.pushMatrix()
    this.colorMaterial.apply();
    this.scene.scale(scale,scale/2,scale*buildingOffset);
    this.scene.translate(0,planeOffset + it,0)
    this.topFloor.display();
    this.scene.popMatrix()


    for (let i = 0; i < this.numFloor; i++) {
      this.scene.pushMatrix()
      this.scene.scale(scale,scale/2,scale);
      this.colorMaterial.apply();
      this.scene.translate(-1,planeOffset+i,0)
      this.buildingFloor.display();
      this.scene.popMatrix()
    }
  }

  update(t) {
    this.topFloor.update(t);
  }

  regenerateBuilding(numFloor, numWindow) {
    this.numFloor = numFloor;
    this.buildingFloor = new MyBuildingFloor(this.scene, numWindow, false, false);
    this.baseFloor = new MyBuildingFloor(this.scene, numWindow, true, false);
    this.topFloor = new MyBuildingFloor(this.scene, numWindow, false, true);
    
    if (this.colorMaterial) {
      this.buildingFloor.initMaterials(this.scene.textureManager);
      this.baseFloor.initMaterials(this.scene.textureManager);
      this.topFloor.initMaterials(this.scene.textureManager);
    }
  }

  getHeight() {
    return (this.numFloor + 1) * (this.totalLength / 2) + 2.25;
  }
}
