export interface Course {
    dept: string
    number: number
    title: string
    description: string
    prereqs: any
    "cross-listed"?: string[]
  }
  