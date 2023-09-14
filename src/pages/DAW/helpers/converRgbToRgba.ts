export const convertRgbToRgba = (rgb: string, alpha: number) => {
  const rgbValues = rgb.match(/\d+/g);
  if (!rgbValues || rgbValues.length !== 3) {
    throw new Error('Invalid RGB format');
  }
  const rgbaColor = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`;
  return rgbaColor;
}