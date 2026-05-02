// Утилиты для валидации полей ввода

/**
 * Фильтрует ввод имени - оставляет только буквы, пробелы и дефисы
 * Удаляет цифры и специальные символы
 */
export const filterNameInput = (value: string): string => {
  // Разрешаем: буквы (включая кириллицу), пробелы, дефисы
  // Запрещаем: цифры и специальные символы
  return value.replace(/[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`]/g, '');
};

/**
 * Проверяет, содержит ли строка только буквы (и допустимые символы для имени)
 */
export const isValidName = (value: string): boolean => {
  // Разрешаем буквы, пробелы и дефисы
  const nameRegex = /^[\p{L}\s\-']+$/u;
  return nameRegex.test(value);
};

/**
 * Фильтрует ввод только цифр
 */
export const filterNumericInput = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Фильтрует ввод телефона - только цифры и +
 */
export const filterPhoneInput = (value: string): string => {
  return value.replace(/[^\d+]/g, '');
};
