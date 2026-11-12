// Editable product catalogue.
// IMPORTANT: the factory currently makes only the 30-cell egg tray
// (confirmed by the owner). Dimensions are still a sample spec, so the
// product stays flagged `unconfirmed` and the UI labels it accordingly.

export interface Product {
  id: string;
  name: string;
  cells: number;
  rows: number;
  cols: number;
  dimensions: string;
  material: string;
  unconfirmed: boolean;
}

export const products: Product[] = [
  {
    id: "tray-30",
    name: "30-Cell Egg Tray",
    cells: 30,
    rows: 5,
    cols: 6,
    dimensions: "Sample spec - to be confirmed",
    material: "Molded recycled paper pulp",
    unconfirmed: true,
  }
];