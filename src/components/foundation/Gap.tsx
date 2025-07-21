const Gap = ({ size, width, height }: { size: number; width?: number; height?: number }) => {
  const finalWidth = width !== undefined ? width : size;
  const finalHeight = height !== undefined ? height : size;
  return <div style={{ width: finalWidth, height: finalHeight }}></div>;
};

export default Gap;
