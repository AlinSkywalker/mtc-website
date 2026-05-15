/**
 * Возвращает слово в правильном падеже в зависимости от количества.
 * @param {number} count - Количество.
 * @param {string[]} forms - Массив из трёх форм слова: [для 1, для 2-4, для 5-20].
 * @returns {string} - Слово в нужном падеже.
 */
export const pluralizeWord = (count, forms) => {
  count = Math.abs(count) % 100
  const n1 = count % 10

  if (count > 10 && count < 20) return forms[2]
  if (n1 === 1) return forms[0]
  if (n1 >= 2 && n1 <= 4) return forms[1]

  return forms[2]
}
