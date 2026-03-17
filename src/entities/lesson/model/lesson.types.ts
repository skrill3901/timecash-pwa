export interface LessonRow {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  studentAId: string | null;
  studentBId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EditableLessonRow {
  id: string;
  startTime: string;
  endTime: string;
  studentAId: string | null;
  studentBId: string | null;
}
