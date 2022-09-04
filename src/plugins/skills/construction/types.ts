export type BuildableFurnitureDefinition = {
    itemId: number;
    level: number;
    requirements: { itemId: number, amount: number }[];
}

export type Furniture = {
    key: string;
    replacementId: number;
}
