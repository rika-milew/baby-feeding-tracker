import React, { useState, useRef, useEffect } from 'react';
import './ColorPicker.css';

const colors = [
  { id: 'green', color: '#4CAF50' },
  { id: 'orange', color: '#FF9800' },
  { id: 'red', color: '#F44336' },
];

export function ColorPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Закрываем список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setOpen(o => !o);

  const handleSelect = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className="color-button" style={{ position: 'relative', display: 'inline-block' }}>
      {/* Кнопка: текущий цвет или пустой кружок */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Выбрать цвет метки"
        className="color-button-toggle"
        style={{ backgroundColor: value ? colors.find(c => c.id === value)?.color : 'transparent' }}
      />

      {/* Выпадающий список кружочков */}
      {open && (
         <div className="color-button-dropdown"
      style={{ zIndex: 999999, position: 'absolute' }}>
      
         {colors.map(({ id, color }) => {
  const labels = {
    green: 'Ок',
    orange: 'Сомнительно',
    red: 'Аллергия',
  };
  return (
    <div key={id} className="tooltip-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
  <button
    type="button"
    onClick={() => handleSelect(id)}
    aria-label={`Выбрать цвет ${id}`}
    style={{
      width: 24,
      height: 24,
      borderRadius: '50%',
      backgroundColor: color,
      border: '2px solid #555',
      cursor: 'pointer',
      padding: 0,
    }}
  />
  <span className="tooltip-text">{labels[id]}</span>
</div>
  );
})}
          {/* Кнопка очистки выбора */}
        <button
            type="button"
            onClick={() => handleSelect(null)}
            aria-label="Очистить цвет"
            className="circle-button"
            style={{ backgroundColor: 'transparent', borderColor: '#555' }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}