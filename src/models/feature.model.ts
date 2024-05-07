import { Story } from "./story.model";

export interface Feature {
    id: string;
    epicId: string;
    title: string;
    stories: Story[]
}