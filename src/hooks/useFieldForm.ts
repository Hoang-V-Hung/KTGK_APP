import { FieldInput } from '../types';
import { validateField } from '../utils/validation';
import { showError } from '../utils/alerts';
import { useApp } from './useApp';
import { useValidatedForm } from './useValidatedForm';

export function useFieldForm(id: string | undefined, onSaved: () => void) {
  const { fields, saveField, saving } = useApp();
  const field = fields.find(item => item.id === id);
  const form = useValidatedForm<FieldInput>(
    {
      name: field?.name ?? '',
      type: field?.type ?? '5 người',
      pricePerHour: field ? String(field.pricePerHour) : '',
      status: field?.status ?? 'Hoạt động',
    },
    input => validateField(input, fields, id),
  );

  async function submit() {
    if (saving || !form.validateForSubmit()) {
      return;
    }
    try {
      await saveField(form.input, id);
      onSaved();
    } catch (error) {
      showError(error);
    }
  }
  return { ...form, field, saving, submit };
}
