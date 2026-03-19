import { Button } from '@shared/ui';

import { useStudentsPage } from '../model/use-students-page';
import { StudentsModal } from './students-modal';
import { StudentsPageSkeleton } from './students-page-skeleton';

export const StudentsPage = () => {
  const {
    closeModal,
    fullName,
    fullNameInputRef,
    handleCreate,
    handleCreateOpen,
    handleDelete,
    handleDeleteOpen,
    handleEdit,
    handleEditOpen,
    isLoading,
    modalState,
    selectedStudent,
    setFullName,
    students,
  } = useStudentsPage();
  const hasStudents = students.length > 0;

  if (isLoading) {
    return <StudentsPageSkeleton />;
  }

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

      <StudentsModal
        fullName={fullName}
        inputRef={fullNameInputRef}
        modalType={modalState.type}
        selectedStudentName={selectedStudent?.fullName}
        fallbackStudentName={modalState.type === 'delete' ? modalState.fullName : undefined}
        onClose={closeModal}
        onConfirmCreate={handleCreate}
        onConfirmDelete={handleDelete}
        onConfirmEdit={handleEdit}
        onFullNameChange={setFullName}
      />
    </section>
  );
};
