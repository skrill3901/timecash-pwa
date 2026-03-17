import { useEffect, useRef, useState } from 'react';

import { archiveStudent, createStudent, updateStudent, useStudents } from '@entities/student';

import { Button } from '@shared/ui';

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; id: string; fullName: string }
  | { type: 'delete'; id: string; fullName: string };

export const StudentsPage = () => {
  const students = useStudents() ?? [];
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [fullName, setFullName] = useState('');
  const fullNameInputRef = useRef<HTMLInputElement | null>(null);

  const hasStudents = students.length > 0;

  const selectedStudent =
    modalState.type === 'edit' || modalState.type === 'delete'
      ? students.find((student) => student.id === modalState.id)
      : undefined;

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

  useEffect(() => {
    if (modalState.type !== 'create' && modalState.type !== 'edit') {
      return;
    }

    fullNameInputRef.current?.focus();
  }, [modalState.type]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div>
          <h2 className="text-lg font-semibold">Ученики</h2>
          <p className="text-sm text-muted-foreground">
            Добавляйте, редактируйте и архивируйте учеников.
          </p>
        </div>
        <Button type="button" onClick={handleCreateOpen}>
          Добавить
        </Button>
      </div>

      {hasStudents ? (
        <ul className="space-y-2">
          {students.map((student) => (
            <li
              key={student.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
            >
              <span className="font-medium">
                {typeof student.fullName === 'string' ? student.fullName : 'Без имени'}
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleEditOpen(
                      student.id,
                      typeof student.fullName === 'string' ? student.fullName : '',
                    )
                  }
                >
                  Редактировать
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    handleDeleteOpen(
                      student.id,
                      typeof student.fullName === 'string' ? student.fullName : 'Без имени',
                    )
                  }
                >
                  Удалить
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Пока нет учеников. Нажмите «Добавить», чтобы создать первого.
        </div>
      )}

      {modalState.type !== 'none' ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-4 shadow-xl">
            {modalState.type === 'delete' ? (
              <>
                <h3 className="text-lg font-semibold">Подтвердите удаление</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ученик «{selectedStudent?.fullName ?? modalState.fullName}» будет архивирован.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Отмена
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => void handleDelete()}>
                    Удалить
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">
                  {modalState.type === 'create' ? 'Добавить ученика' : 'Редактировать ученика'}
                </h3>
                <label className="mt-3 block text-sm">
                  ФИО
                  <input
                    ref={fullNameInputRef}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Введите ФИО"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </label>
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Отмена
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      void (modalState.type === 'create' ? handleCreate() : handleEdit())
                    }
                  >
                    Сохранить
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
};
