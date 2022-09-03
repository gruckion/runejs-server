export type Furniture = {
    itemId: number;
    level: number;
    requirements: { itemId: number, amount: number }[];
}
