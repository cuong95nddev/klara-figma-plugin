import { Box3, Sphere } from "three";

const computeBoundingSphere = (object3d: any): Sphere => {
  const boundingBox = new Box3();

  const boundingSphere = new Sphere();

  object3d.traverse(function (object: any) {
    if (Object.keys(object.userData).length === 0) {
      return;
    }

    boundingBox.union(new Box3().setFromObject(object));
  });

  boundingBox.getBoundingSphere(boundingSphere);

  return boundingSphere;
};

export default computeBoundingSphere;
