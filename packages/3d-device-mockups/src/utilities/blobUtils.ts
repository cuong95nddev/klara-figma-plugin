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
