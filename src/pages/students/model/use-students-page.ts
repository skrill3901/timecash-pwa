import { useEffect, useMemo, useRef, useState } from 'react';

import { archiveStudent, createStudent, updateStudent, useStudents } from '@entities/student';

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; id: string; fullName: string }
  | { type: 'delete'; id: string; fullName: string };

export const useStudentsPage = () => {
  const studentsQuery = useStudents();
  const students = useMemo(() => studentsQuery ?? [], [studentsQuery]);
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [fullName, setFullName] = useState('');
  const fullNameInputRef = useRef<HTMLInputElement | null>(null);

  const selectedStudent = useMemo(
    () =>
      modalState.type === 'edit' || modalState.type === 'delete'
        ? students.find((student) => student.id === modalState.id)
        : undefined,
    [modalState, students],
  );

  useEffect(() => {
    if (modalState.type !== 'create' && modalState.type !== 'edit') {
      return;
    }

    fullNameInputRef.current?.focus();
  }, [modalState.type]);

  const closeModal = () => {
    setModalState({ type: 'none' });
    setFullName('');
  };

  const handleCreateOpen = () => {
    setModalState({ type: 'create' });
    setFullName('');
  };

  const handleCreate = async () => {
    if (!fullName.trim()) {
      return;
    }

    await createStudent(fullName);
    closeModal();
  };

  const handleEditOpen = (id: string, value: string) => {
    setModalState({ type: 'edit', id, fullName: value });
    setFullName(value);
  };

  const handleEdit = async () => {
    if (modalState.type !== 'edit' || !fullName.trim()) {
      return;
    }

    await updateStudent(modalState.id, fullName);
    closeModal();
  };

  const handleDeleteOpen = (id: string, value: string) => {
    setModalState({ type: 'delete', id, fullName: value });
  };

  const handleDelete = async () => {
    if (modalState.type !== 'delete') {
      return;
    }

    await archiveStudent(modalState.id);
    closeModal();
  };

  return {
    closeModal,
    fullName,
    fullNameInputRef,
    handleCreate,
    handleCreateOpen,
    handleDelete,
    handleDeleteOpen,
    handleEdit,
    handleEditOpen,
    modalState,
    selectedStudent,
    setFullName,
    students,
  };
};
