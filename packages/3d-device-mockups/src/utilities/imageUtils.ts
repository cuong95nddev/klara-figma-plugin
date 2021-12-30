export function getImage(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = src;
  });
}

export function getImageBlob(uri: string) {
  const data = uri.split(",")[1];
  const bytes = atob(data);
  const buf = new ArrayBuffer(bytes.length);
  const array = new Uint8Array(buf);

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }

  return array;
}

export async function readAsDataURL(fileByteArray: Uint8Array) {
  return new Promise<string | ArrayBuffer | null>((resolve) => {
    const blob = new Blob([fileByteArray], { type: "image/png" });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
}
