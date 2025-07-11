import React, { useState, useEffect } from 'react';

const categories = ['Фрукты и ягоды', 'Овощи и зелень', 'Белки', 'Углеводы', 'Жиры', 'Другое'];
const ageGroups = ['от 4 месяцев', 'от 6 месяцев', 'от 7 месяцев', 'от 8 месяцев', 'от 9 месяцев', 'от 11 месяцев', 'от 12 месяцев', 'от 18 месяцев', 'от 24 месяцев', 'от 36 месяцев'];

export function ProductForm({ onAdd, editingProduct, onSaveEdit, onCancelEdit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [ageGroup, setAgeGroup] = useState(ageGroups[0]);

  // При загрузке редактируемого продукта заполняем форму
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setAgeGroup(editingProduct.ageGroup);
    } else {
      setName('');
      setCategory(categories[0]);
      setAgeGroup(ageGroups[0]);
    }
  }, [editingProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Введите название продукта');

    const productData = { name, category, ageGroup };

    if (editingProduct) {
      onSaveEdit({ ...editingProduct, ...productData });
    } else {
      onAdd(productData);
    }

    if (!editingProduct) {
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Название продукта"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <select value={category} onChange={e => setCategory(e.target.value)} style={{ marginRight: 10 }}>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} style={{ marginRight: 10 }}>
        {ageGroups.map(age => (
          <option key={age} value={age}>{age}</option>
        ))}
      </select>
      <button type="submit">{editingProduct ? 'Сохранить' : 'Добавить'}</button>
      {editingProduct && (
        <button type="button"  className="cancel-button" onClick={onCancelEdit}> 
          Отмена
        </button>
      )}
    </form>
  );
}