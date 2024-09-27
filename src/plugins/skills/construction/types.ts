export type BuildableFurnitureDefinition = {
    itemId: number;
    placeholderId: number; // TODO (Sigex): This might not be needed will consider once we have remove object working
    objectId: number;
    level: number;
    experience?: number;
    requirements: { itemId: number, amount: number }[];
}

export type Furniture = {
    key: string;
    replacementId: number;
}
