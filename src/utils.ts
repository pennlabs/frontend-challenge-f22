import { Dispatch, SetStateAction, createContext } from "react";

export type Course = {
    dept: string;
    number: number;
    title: string;
    prereqs?: string[];
    crossListed?: string[];
    description: string;
}

export interface CourseWithSimilarity extends Course {
    similarity: number;
}

export interface DetailedCourse extends Course {
    "id": string,
    "syllabus_url": string | null,
    "semester": string,
    "course_quality": number,
    "instructor_quality": number,
    "sections": {
        id: string,
        status: number,
        activity: string,
        credits: number,
        capacity: number,
        semester: string,
        meetings: {day: string, start: number, end: number, room: string}[],
        instructors: {id: number, name: string}[],
        "course_quality": number,
        "instructor_quality": number,
        "difficulty": number,
        "work_required": number,
        "associated_sections": string[],
        "registration_volume": number,
    }[],

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

// Sidebar course context
type SidebarContextType = { sidebarCourse: (Course | null), setSidebarCourse: Dispatch<SetStateAction<(Course | null)>> };
const sidebarDummyContext = { sidebarCourse: null, setSidebarCourse: () => { } };
export const SidebarCourseContext = createContext<SidebarContextType>(sidebarDummyContext);