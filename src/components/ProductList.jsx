import React, { useState, useEffect, useRef } from 'react';
import { FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';
import './ProductList.css';
import { ColorPicker } from './ColorPicker';
import { Tooltip } from './Tooltip';
import { motion } from 'framer-motion';


const reactionOptions = [
  { id: 'adore', label: 'Супер', emoji: '😍', color: '#ca2a97ff' },
  { id: 'like', label: 'Понравилось', emoji: '👍', color: '#4CAF50' },
  { id: 'dislike', label: 'Не нравится', emoji: '👎', color: '#F44336' },
  { id: 'unsure', label: 'Не уверен', emoji: '🤔', color: '#FF9800' },
];





export function ProductList({ products, onDelete, onEditClick, onUpdate }) {
  const [openReactionId, setOpenReactionId] = useState(null);
  const menuRef = useRef(null);

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenReactionId(null);
    }
  };

  if (openReactionId !== null) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [openReactionId]);

  const groupedByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = {};
    if (!acc[product.category][product.ageGroup]) acc[product.category][product.ageGroup] = [];
    acc[product.category][product.ageGroup].push(product);
    return acc;
  }, {});

  // Функции для обновления конкретных свойств продукта
  const toggleIntroduced = (product) => {
    onUpdate({ ...product, isIntroduced: !product.isIntroduced });
  };

  const toggleReaction = (product, id) => {
    const newReaction = product.reaction === id ? null : id;
    onUpdate({ ...product, reaction: newReaction });
  };

  const changeColorMark = (product, e) => {
    const value = e.target.value || null;
    onUpdate({ ...product, colorMark: value });
  };

  return (
    <div>
      <h2>Список продуктов прикорма</h2>
      {Object.entries(groupedByCategory).map(([category, ageGroups]) => (
        <section key={category} style={{ marginBottom: '1.5em' }}>
          <h3>{category}</h3>
          {Object.entries(ageGroups)
  .sort(([a], [b]) => a.localeCompare(b, 'ru', { numeric: true }))
  .map(([ageGroup, products]) => (
            <div key={ageGroup} className="age-section" style={{ marginBottom: '1em' }}>
              <h4>{ageGroup}</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {products.map(product => (
                  <motion.li
                    key={product.id} 
                    initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
   className="product-item"
                    
                  >
                    {/* Галочка введённости */}
                    <button
                      onClick={() => toggleIntroduced(product)}
                      aria-label={product.isIntroduced ? 'Продукт введён' : 'Отметить продукт введённым'}
                      type="button"
                      className="checked-button"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: '2px solid #555',
                        backgroundColor: product.isIntroduced ? '#4CAF50' : 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {product.isIntroduced && <FiCheck color="white" size={18} />}
                    </button>

                    {/* Название продукта */}
                    <span style={{ flexGrow: 1 }}>{product.name}</span>

                    

                    {/* Цветовая метка (селект) */}
                    <ColorPicker
  value={product.colorMark}
  onChange={(newColor) => changeColorMark(product, { target: { value: newColor } })}
/>

{/* Реакции */}
                   <div className="reaction-container">
 {isMobile ? (
  <div style={{ position: 'relative' }}>
    {/* Текущая реакция — при нажатии открывается меню */}
    <button
      onClick={() => setOpenReactionId(openReactionId === product.id ? null : product.id)}
      style={{
        backgroundColor: reactionOptions.find(r => r.id === product.reaction)?.color || '#eee',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        fontSize: '18px',
        cursor: 'pointer',
      }}
      title="Выбрать реакцию"
    >
      {reactionOptions.find(r => r.id === product.reaction)?.emoji || '🙂'}
    </button>

    {/* Выпадающее меню с реакциями и кнопкой очистки */}
    {openReactionId === product.id && (
      <div className="open-reaction"
        ref={menuRef}
      >
        {reactionOptions.map(({ id, emoji, label, color }) => (
             <div key={id} className="reaction-title" onClick={() => {
              toggleReaction(product, id);
              setOpenReactionId(null);
            }}>
          <button 
            
            
            style={{
              backgroundColor: product.reaction === id ? color : '#eee',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
            title={label}
          >
            {emoji}
          </button>
           <span style={{ fontSize: '12px', color: '#333' }}>{label}</span>
          </div>
        ))}

        {/* Кнопка очистки выбранной реакции */}
        <div className="reaction-title" onClick={() => {
            toggleReaction(product, null); // сбрасываем реакцию
            setOpenReactionId(null);       // закрываем меню
          }}>
          <button
           
            aria-label="Очистить реакцию"
            className="circle-button"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#555',
            }}
            title="Очистить реакцию"
          >
            ×
          </button>
          <span style={{ fontSize: '12px', color: '#333' }}>Очистить</span>
          </div>
      </div>
    )}
  </div>
  ) : (
    <div style={{ display: 'flex', gap: 6 }}>
      {reactionOptions.map(({ id, emoji, label, color }) => (
        <Tooltip key={id} text={label}>
        <button
          
          onClick={() => toggleReaction(product, id)}
          style={{
            backgroundColor: product.reaction === id ? color : '#eee',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '18px',
            cursor: 'pointer',
          }}
          title={label}
        >
          {emoji}
        </button>
        </Tooltip>
      ))}
      
    </div>
  )}
</div>

                    {/* Кнопки редактирования и удаления */}
                    <button
                      onClick={() => onEditClick(product)}
                      aria-label="Редактировать"
                      className="icon-button"
                      type="button"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      aria-label="Удалить"
                      className="icon-button delete"
                      type="button"
                      style={{ marginLeft: 4 }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}