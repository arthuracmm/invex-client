
interface Inventory {
  productId: string;
  totalQuantity: number;
  product: {
    id: string;
    shortName: string;
    fullName: string;
  };
}

interface InventoryMovementSummary {
  productId: string;
  total: number | string; 
  product: {
    id: string;
    shortName: string;
    fullName: string;
  };
}

export interface Dashboard {
  totalQuantity: number;
  smaller: Inventory[];
  greater: Inventory[];
  topEntry: InventoryMovementSummary[];
  topOutput: InventoryMovementSummary[];
}
