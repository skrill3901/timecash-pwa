export const Form = () => {
  return (
    <form>
      <label htmlFor="text-input">Вставьте текст</label>
      <textarea id="text-input" placeholder="Введите данные..." rows={5} />
      <button type="submit">Посчитать</button>
    </form>
  );
};
