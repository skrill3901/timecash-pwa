import { Button } from '@shared/ui';

import type { RefObject } from 'react';

interface StudentsModalProps {
  fullName: string;
  inputRef: RefObject<HTMLInputElement | null>;
  modalType: 'none' | 'create' | 'edit' | 'delete';
  selectedStudentName?: string;
  fallbackStudentName?: string;
  onClose: () => void;
  onConfirmCreate: () => Promise<void>;
  onConfirmDelete: () => Promise<void>;
  onConfirmEdit: () => Promise<void>;
  onFullNameChange: (value: string) => void;
}

export const StudentsModal = ({
  fallbackStudentName,
  fullName,
  inputRef,
  modalType,
  onClose,
  onConfirmCreate,
  onConfirmDelete,
  onConfirmEdit,
  onFullNameChange,
  selectedStudentName,
}: StudentsModalProps) => {
  if (modalType === 'none') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-background p-4 shadow-xl">
        {modalType === 'delete' ? (
          <>
            <h3 className="text-lg font-semibold">Подтвердите удаление</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ученик «{selectedStudentName ?? fallbackStudentName}» будет архивирован.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="button" variant="destructive" onClick={() => void onConfirmDelete()}>
                Удалить
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold">
              {modalType === 'create' ? 'Добавить ученика' : 'Редактировать ученика'}
            </h3>
            <label className="mt-3 block text-sm">
              ФИО
              <input
                ref={inputRef}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Введите ФИО"
                value={fullName}
                onChange={(event) => onFullNameChange(event.target.value)}
              />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button
                type="button"
                onClick={() => void (modalType === 'create' ? onConfirmCreate() : onConfirmEdit())}
              >
                Сохранить
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
