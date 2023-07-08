import { usePositionData } from "@/hooks/useAllPositionData";
import { closeAllPositionsAndOrders } from "@/hooks/useCloseAllPositionsAndOrdes";

export const CloseAllPositions = () => {
  const { combinedData } = usePositionData();

  const handleCloseClick = () => {
    // Filter out positions with quantity different than 0
    const openPositions = combinedData.filter(
      (position) => position.positionAmt !== 0
    );

    if (openPositions.length > 0) {
      closeAllPositionsAndOrders(openPositions);
    }
  };

  return <button onClick={handleCloseClick}>Close All Positions</button>;
};
