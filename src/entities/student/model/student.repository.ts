import { enqueueSyncOperation } from '@entities/sync/model/sync.repository';

import { db, type StudentRecord } from '@shared/config/db';
import { createId } from '@shared/lib/id';

const nowIso = (): string => new Date().toISOString();

const normalizeStudentName = (fullName: string): string => {
  return fullName.trim().replaceAll(/\s+/g, ' ').toLocaleLowerCase('ru-RU');
};

const sanitizeStudentName = (fullName: string): string => {
  return fullName.trim().replaceAll(/\s+/g, ' ');
};

export const getActiveStudents = async (): Promise<StudentRecord[]> => {
  const students = await db.students
    .filter((student) => !student.isArchived && sanitizeStudentName(student.fullName).length > 0)
    .sortBy('fullName');
  const seenNames = new Set<string>();

  return students.filter((student) => {
    const normalizedName = normalizeStudentName(student.fullName);

    if (seenNames.has(normalizedName)) {
      return false;
    }

    seenNames.add(normalizedName);

    return true;
  });
};

export const getAllStudents = async (): Promise<StudentRecord[]> => {
  const students = await db.students.toArray();

  return students;
};

export const createStudent = async (fullName: string): Promise<StudentRecord> => {
  const sanitizedFullName = sanitizeStudentName(fullName);
  const normalizedNewName = normalizeStudentName(sanitizedFullName);

  if (!normalizedNewName) {
    throw new Error('Имя ученика не может быть пустым');
  }

  const existingStudent = await db.students
    .filter(
      (student) =>
        !student.isArchived && normalizeStudentName(student.fullName) === normalizedNewName,
    )
    .first();

  if (existingStudent) {
    return existingStudent;
  }

  const createdAt = nowIso();
  const student: StudentRecord = {
    id: createId(),
    fullName: sanitizedFullName,
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
  const sanitizedFullName = sanitizeStudentName(fullName);
  const payload = {
    fullName: sanitizedFullName,
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
