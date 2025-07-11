import React, { useState, useEffect } from 'react';
import { products as initialProducts } from './data';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import './App.css';

console.log('initialProducts:', initialProducts);

function App() {
   const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : initialProducts;
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Добавить продукт
  const addProduct = (product) => {
  setProducts(prev => [
    ...prev,
    { 
      id: Date.now(),
      isIntroduced: false,
      reaction: null,
      colorMark: null,
      ...product,
    },
  ]);
};

const updateProduct = (updatedProduct) => {
  setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
};

  // Удалить продукт по id
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // Если удаляем редактируемый продукт — сбросим форму
    if (editingProduct?.id === id) setEditingProduct(null);
  };

  // Начать редактировать продукт
  const editClick = (product) => {
    setEditingProduct(product);
  };

  // Сохранить отредактированный продукт
  const saveEdit = (updatedProduct) => {
    setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
    setEditingProduct(null);
  };

  // Отменить редактирование
  const cancelEdit = () => {
    setEditingProduct(null);
  };

    useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Трекер прикорма для малышей</h1>
      <ProductForm
        onAdd={addProduct}
        editingProduct={editingProduct}
        onSaveEdit={saveEdit}
        onCancelEdit={cancelEdit}
      />
      <ProductList
        products={products}
        onDelete={deleteProduct}
        onEditClick={editClick}
        onUpdate={updateProduct}
      />
    </div>
  );
}

export default App;