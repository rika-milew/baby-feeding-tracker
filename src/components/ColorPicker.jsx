import React, { useState, useRef, useEffect } from 'react';
import './ColorPicker.css';

const colors = [
  { id: 'green', color: '#4CAF50', label: 'Хорошо' },
  { id: 'orange', color: '#FF9800', label: 'Сомнительно' },
  { id: 'red', color: '#F44336', label: 'Аллергия' },
];

export function ColorPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);

  // Проверка мобильной версии
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Закрытие при клике вне компонента
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
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Выбрать цвет метки"
        className="color-button-toggle"
        style={{ backgroundColor: value ? colors.find(c => c.id === value)?.color : 'transparent' }}
      />

      {open && (
        <div className="color-button-dropdown" style={{ zIndex: 999999, position: 'absolute' }}>
          {colors.map(({ id, color, label }) => (
            <div key={id} className="reaction-title" onClick={() => handleSelect(id)}>
              <button
                type="button"
                
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
              {isMobile && (
                <span style={{ fontSize: '12px', color: '#333', display: 'block', marginTop: 2 }}>
                  {label}
                </span>
              )}
            </div>
          ))}

          {/* Кнопка очистки */}
          <div className="reaction-title" onClick={() => handleSelect(null)}>
            <button
              type="button"
              
              aria-label="Очистить цвет"
              className="color-circle-button"
              style={{ backgroundColor: 'transparent', borderColor: '#555' }}
            >
              ×
            </button>
            {isMobile && (
              <span style={{ fontSize: '12px', color: '#333', display: 'block', marginTop: 2 }}>
                Очистить
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}