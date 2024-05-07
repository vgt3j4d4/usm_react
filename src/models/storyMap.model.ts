import { Epic } from "./epic.model";
import { Role } from "./role.model";

export interface StoryMap {
    id: string;
    roles: Role[]
    epics: Epic[];
}