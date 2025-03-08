import { useRef, useState } from "react";

const RerenderCheckDiv = () => {
  const renderCount = useRef(0);
  const [, forceRender] = useState(0); // Dummy state to trigger re-renders

  renderCount.current += 1;

  // useEffect(() => {
  //   console.log(`Render count: ${renderCount.current}`);
  // });

  const resetCount = () => {
    renderCount.current = 0; // Reset ref
    forceRender((prev) => prev + 1); // Force re-render to update UI
  };

  return (
    <div>
      Render count: {renderCount.current} <button onClick={resetCount}>Reset</button>
    </div>
  );
};

export default RerenderCheckDiv;
