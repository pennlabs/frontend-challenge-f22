import { Dispatch, SetStateAction, createContext } from "react";

export type Course = {
    dept: string;
    number: number;
    title: string;
    prereqs?: string[];
    crossListed?: string[];
    description: string;
    similarity?: number;
}

export const fetcher = async (url: string) => fetch(url).then(res => res.json())

// Context
export interface CoursePreference {
    // stores course numbers. all courses are from the CIS department so there is no risk of duplication.
    [key: number]: "cart" | "taken" | "uninterested" | "none";
}

type ContextType = { coursePreferences: CoursePreference, setCoursePreferences: Dispatch<SetStateAction<CoursePreference>> };
const dummyContext = { coursePreferences: {}, setCoursePreferences: () => { } };
export const CoursePreferencesContext = createContext<ContextType>(dummyContext);