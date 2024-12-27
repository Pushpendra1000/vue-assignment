export class NodeState {
  constructor(numOfCourses, numOfModules) {
    this.imgCache = {};
    this.numOfCourses = numOfCourses;
    this.numOfImages = numOfModules;
  }

  getImage(id, imgSrc) {
    if (!this.imgCache[id]) {
      const img = new Image();
      img.src = imgSrc;
      this.imgCache[id] = img;
    }
    return this.imgCache[id];
  }

  incrementCourses() {
    return ++this.numOfCourses;
  }

  incrementImages() {
    return ++this.numOfImages;
  }
}
