export function flipImageVertically(data, width, height) {
  const halfHeight = (height / 2) | 0; // the | 0 keeps the result an int
  const bytesPerRow = width * 4;

  // make a temp buffer to hold one row
  const temp = new Uint8Array(width * 4);
  for (let y = 0; y < halfHeight; ++y) {
    const topOffset = y * bytesPerRow;
    const bottomOffset = (height - y - 1) * bytesPerRow;

    // make copy of a row on the top half
    temp.set(data.subarray(topOffset, topOffset + bytesPerRow));

    // copy a row from the bottom half to the top
    data.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);

    // copy the copy of the top half row to the bottom half
    data.set(temp, bottomOffset);
  }
  return data;
}

// export function createImageFromTexture(texture, width, height) {
//   // Create a framebuffer backed by the texture
//   const offscreenCanvas1 = new OffscreenCanvas(width, height);
//   const gl = offscreenCanvas1.getContext("webgl2");
//   const framebuffer = gl.createFramebuffer();
//   gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
//   gl.framebufferTexture2D(
//     gl.FRAMEBUFFER,
//     gl.COLOR_ATTACHMENT0,
//     gl.TEXTURE_2D,
//     texture,
//     0
//   );

//   // Read the contents of the framebuffer
//   const data = new Uint8Array(width * height * 4);
//   gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

//   gl.deleteFramebuffer(framebuffer);

//   // Reverse the image vertically
//   const flippedData = flipImageVertically(data, width, height);

//   // Create a 2D canvas to store the result
//   //   const canvas = document.getElementById("outputCanvas") as HTMLCanvasElement;
//   //   canvas.width = width;
//   //   canvas.height = height;
//   //   const context = canvas.getContext("2d");

//   const offscreenCanvas = new OffscreenCanvas(width, height);
//   const context = offscreenCanvas.getContext("2d");

//   // Copy the pixels to a 2D canvas
//   const imageData = context.createImageData(width, height);
//   imageData.data.set(flippedData);
//   context.putImageData(imageData, 0, 0);

//   const bitmap = offscreenCanvas.transferToImageBitmap();
//   return bitmap;

//   // return offscreenCanvas;
// }

// working
export function createImageFromTexture(
  gl,
  texture,
  width,
  height,
  framebuffer
) {
  // Create a framebuffer backed by the texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );

  // Read the contents of the framebuffer
  const data = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

  // gl.deleteFramebuffer(framebuffer);
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Reverse the image vertically
  const flippedData = flipImageVertically(data, width, height);

  // Create a 2D canvas to store the result
  //   const canvas = document.getElementById("outputCanvas") as HTMLCanvasElement;
  //   canvas.width = width;
  //   canvas.height = height;
  //   const context = canvas.getContext("2d");

  const offscreenCanvas = new OffscreenCanvas(width, height);
  const context = offscreenCanvas.getContext("2d");

  // Copy the pixels to a 2D canvas
  const imageData = context.createImageData(width, height);
  imageData.data.set(flippedData);
  context.putImageData(imageData, 0, 0);

  const bitmap = offscreenCanvas.transferToImageBitmap();
  return bitmap;

  // return offscreenCanvas;
}

export function createImageFromTextureToCanvas(gl, texture, width, height) {
  // Create a framebuffer backed by the texture
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );

  // Read the contents of the framebuffer
  const data = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

  gl.deleteFramebuffer(framebuffer);

  // Reverse the image vertically
  const flippedData = flipImageVertically(data, width, height);

  const canvas = document.getElementById("outputCanvas") as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  // Copy the pixels to a 2D canvas
  const imageData = context.createImageData(width, height);
  imageData.data.set(flippedData);
  context.putImageData(imageData, 0, 0);
}

export const map = (n, start1, stop1, start2, stop2, withinBounds) => {
  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return Math.max(Math.min(newval, start2), stop2);
  } else {
    return Math.max(Math.min(newval, stop2), start2);
  }
};
