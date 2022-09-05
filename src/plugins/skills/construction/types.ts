export type BuildableFurnitureDefinition = {
    itemId: number;
    placeholderId: number; // TODO (Sigex): This is not needed we can remove this soon.
    objectId: number;
    level: number;
    experience?: number;
    requirements: { itemId: number, amount: number }[];
}

export type Furniture = {
    key: string;
    replacementId: number;
}
