export type Course = {
    dept: string;
    number: number;
    title: string;
    prereqs?: string[];
    crossListed?: string[];
    description: string;
    similarity?: number;
}