import { Light, WebGLRenderer } from "three";

export const cleanScene = (scene: any) => {
  scene.traverse((object: any) => {
    if (!object.isMesh) return;

    object.geometry.dispose();

    if (object.material.isMaterial) {
      cleanMaterial(object.material);
    } else {
      for (const material of object.material) {
        cleanMaterial(material);
      }
    }
  });
};

/**
 * Clean up and dispose of a material
 */
export const cleanMaterial = (material: any) => {
  material.dispose();

  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value && typeof value === "object" && "minFilter" in value) {
      value.dispose();
    }
  }
};

/**
 * Clean up and dispose of a renderer
 */
export const cleanRenderer = (renderer: WebGLRenderer) => {
  renderer.dispose();
  renderer.forceContextLoss();
};

/**
 * Clean up lights by removing them from their parent
 */
export const removeLights = (lights: Light[]) => {
  for (const light of lights) {
    light?.parent?.remove(light);
  }
};
