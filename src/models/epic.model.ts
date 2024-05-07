import { Feature } from "./feature.model";

export interface Epic {
    id: string;
    title: string;
    features: Feature[]
}