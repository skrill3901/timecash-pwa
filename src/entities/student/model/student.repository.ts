import { enqueueSyncOperation } from '@entities/sync/model/sync.repository';

import { db, type StudentRecord } from '@shared/config/db';
import { createId } from '@shared/lib/id';

const nowIso = (): string => new Date().toISOString();

export const getActiveStudents = async (): Promise<StudentRecord[]> => {
  const students = await db.students
    .filter((student) => {
      const fullName = typeof student.fullName === 'string' ? student.fullName.trim() : '';

      return !student.isArchived && fullName.length > 0;
    })

    .sortBy('fullName');

  return students;
};

export const getAllStudents = async (): Promise<StudentRecord[]> => {
  const students = await db.students.toArray();

  return students;
};

export const createStudent = async (fullName: string): Promise<StudentRecord> => {
  const createdAt = nowIso();
  const student: StudentRecord = {
    id: createId(),
    fullName: fullName.trim(),
    isArchived: false,
    createdAt,
    updatedAt: createdAt,
  };

  await db.students.add(student);
  await enqueueSyncOperation({
    entity: 'student',
    entityId: student.id,
    operation: 'create',
    payload: JSON.stringify(student),
  });

  return student;
};

export const updateStudent = async (id: string, fullName: string): Promise<void> => {
  const payload = {
    fullName: fullName.trim(),
    updatedAt: nowIso(),
  };

  await db.students.update(id, payload);
  await enqueueSyncOperation({
    entity: 'student',
    entityId: id,
    operation: 'update',
    payload: JSON.stringify(payload),
  });
};

export const archiveStudent = async (id: string): Promise<void> => {
  const payload = {
    isArchived: true,
    updatedAt: nowIso(),
  };

  await db.students.update(id, payload);
  await enqueueSyncOperation({
    entity: 'student',
    entityId: id,
    operation: 'delete',
    payload: JSON.stringify(payload),
  });
};
