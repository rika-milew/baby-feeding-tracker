import React from 'react';
import { FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';
import './ProductList.css';
import { ColorPicker } from './ColorPicker';
import { Tooltip } from './Tooltip';
import { motion } from 'framer-motion';


const reactionOptions = [
  { id: 'like', label: 'Понравилось', emoji: '👍', color: '#4CAF50' },
  { id: 'dislike', label: 'Не понравилось', emoji: '👎', color: '#F44336' },
  { id: 'unsure', label: 'Не уверен', emoji: '🤔', color: '#FF9800' },
];

const colorMarks = {
  green: '#4CAF50',
  orange: '#FF9800',
  red: '#F44336',
};

export function ProductList({ products, onDelete, onEditClick, onUpdate }) {
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
          {Object.entries(ageGroups).map(([ageGroup, products]) => (
            <div key={ageGroup} style={{ marginLeft: '20px', marginBottom: '1em' }}>
              <h4>{ageGroup}</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {products.map(product => (
                  <motion.li
                    key={product.id} 
                    initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
   className="product-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '6px 0',
                      borderBottom: '1px solid #ddd',
                      position: 'relative', // добавь это
                       
                    }}
                  >
                    {/* Галочка введённости */}
                    <button
                      onClick={() => toggleIntroduced(product)}
                      aria-label={product.isIntroduced ? 'Продукт введён' : 'Отметить продукт введённым'}
                      type="button"
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
                    <div style={{ display: 'flex', gap: 6 }}>
                      {reactionOptions.map(({ id, emoji, label, color }) => (
                        <button
                          key={id}
                           className="reaction-button"
                          onClick={() => toggleReaction(product, id)}
                          aria-label={label}
                          title={label}
                          type="button"
                          style={{
                             backgroundColor: product.reaction === id ? color : '#eee',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            fontSize: '18px',
                            cursor: 'pointer',
                            userSelect: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            transition: 'background-color 0.3s',
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>



                    {/* Кнопки редактирования и удаления */}
                    <button
                      onClick={() => onEditClick(product)}
                      aria-label="Редактировать"
                      className="icon-button"
                      type="button"
                      style={{ marginLeft: 12 }}
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