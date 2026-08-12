import React, { useState } from 'react';
import { CAR_TYPES } from './carsData';
import crud from './img/crud.png';
import './GameGarage.css';
import c from './img/c.png';
import r from './img/r.png';
import u from './img/u.png';
import d from './img/d.png';

export default function GameGarage() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null); // Для функции READ (просмотр внутри)

  // 1. CREATE: Создание случайной машинки (Максимум 4 на площадке)
  const addRandomCar = () => {
    if (cars.length >= 3) {
      alert('Площадка заполнена! Можно создать не больше 3 машинок.');
      return;
    }
    const types = Object.keys(CAR_TYPES);
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const newCar = {
      id: Date.now(), // Уникальный ID
      type: randomType,
      isModified: false, // Изначально колеса обычные
    };

    setCars([...cars, newCar]);
  };

  // 3. UPDATE: Изменение цвета машинки
  const changeCarColor = (id, newType) => {
    setCars(cars.map(car => car.id === id ? { ...car, type: newType } : car));
    // Синхронизируем окно просмотра, если эта машина открыта
    if (selectedCar && selectedCar.id === id) {
      setSelectedCar(prev => ({ ...prev, type: newType }));
    }
  };

  // 3. UPDATE: Модификация колес (Тюнинг)
  const toggleWheels = (id) => {
    setCars(cars.map(car => car.id === id ? { ...car, isModified: !car.isModified } : car));
    if (selectedCar && selectedCar.id === id) {
      setSelectedCar(prev => ({ ...prev, isModified: !prev.isModified }));
    }
  };

  // 4. DELETE: Удаление машинки с площадки
  const deleteCar = (id) => {
    setCars(cars.filter(car => car.id !== id));
    if (selectedCar && selectedCar.id === id) {
      setSelectedCar(null);
    }
  };

  return (
    <div className='container'>
      <h1 className='title'>
        Детский автосервис вместе с 
        <img src={crud} width={100} height={40} alt='CRUD'/>
        </h1>
      
      {/* Кнопка создания (CREATE) */}
      <div className='toolbar'>
        <button className='createButton' onClick={addRandomCar}>
          <img src={c} width={160} height={60} alt='create'/>
          Собрать машинку по чертежу
           ({cars.length}/3)
        </button>
      </div>

      {/* Игровая площадка */}
      <div className='playground'>
        {cars.length === 0 ? (
          <p className='emptyText'>Площадка пуста. Нажмите кнопку 
          <img src={c} width={160} height={60} alt='create'/>
          , чтобы создать машинку!</p>
        ) : (
          cars.map((car) => {
            const carData = CAR_TYPES[car.type];
            const currentImg = car.isModified ? carData.imgMod : carData.imgNormal;

            return (
              <div key={car.id} className='carCard'>
                <img src={currentImg} alt={carData.name} className='carImage' />
                
                <div style={{
                    ...styles.carBadge,
                    color: car.type === 'blue' ? '#007bff' : car.type === 'green' ? '#28a745' : '#dc3545',
                    fontWeight: 'bold',
                    fontSize: '18px'
                }}>
                {carData.colorName} {car.isModified && '⭐'}
                </div>

                <div className='actions'>
                  {/* READ */}
                  <button className='btnRead' onClick={() => setSelectedCar(car)}>
                    <img src={r} width={110} height={34} alt='read'/>
                   <span>Рассмотреть машинку</span> 
                  </button>
                  
                  {/* UPDATE Колеса */}
                  <button className='btnUpdate' onClick={() => toggleWheels(car.id)}>
                    <img src={u} width={120} height={35} alt='update'/>
                    <span>{car.isModified ? 'Вернуть колеса' : 'Сменить колеса'}</span> 
                  </button>

                  {/* DELETE */}
                  <button className='btnDelete' onClick={() => deleteCar(car.id)}>
                    <img src={d} width={100} height={30} alt='delete'/>
                    <span>Удалить</span> 
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Окно просмотра (READ & Моментальный UPDATE внутри) */}
      {selectedCar && (() => {
        const carData = CAR_TYPES[selectedCar.type];
        const liveCar = cars.find(c => c.id === selectedCar.id); // Актуальное состояние с площадки
        if (!liveCar) return null;

        return (
          <div className='overlay'>
            <div className='modal'>
              <h2>
                <img src={r} width={110} height={34} alt='read'/>
                 Заглядываем внутрь гаража
                </h2>
              <p>В гараже: <strong>{carData.name}</strong></p>
              
              <div className='modalContent'>
                <img 
                  src={liveCar.isModified ? carData.imgMod : carData.imgNormal} 
                  alt="Вид изнутри" 
                  className='modalImage' 
                />
                
                <div className='specs'>
                  <p><strong>
                    <img src={r} width={110} height={34} alt='read'/>
                    Статус колес:
                    </strong> {liveCar.isModified ? `Установлено: ${carData.modText}` : 'Стандартные колеса'}</p>
                  
                  {/* UPDATE цвета прямо из меню просмотра */}
                  <div className='colorPickerContainer'>
                    <p style={{margin: '5px 0'}}>
                        <strong>
                            <img src={u} width={120} height={35} alt='update'/>
                            Перекрасить кузов:
                            </strong></p>
                    {Object.keys(CAR_TYPES).map((colorKey) => (
                      <button
                        key={colorKey}
                        style={{
                          ...styles.colorSelector,
                          backgroundColor: colorKey === 'blue' ? 'lightskyblue' : colorKey === 'green' ? 'lightgreen' : 'tomato',
                          border: liveCar.type === colorKey ? '3px solid black' : '1px solid #ccc'
                        }}
                        onClick={() => changeCarColor(liveCar.id, colorKey)}
                        title={`Сделать ${CAR_TYPES[colorKey].colorName.toLowerCase()}ной`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button className='closeButton' onClick={() => setSelectedCar(null)}>
                ❌ Закрыть дверь гаража
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// Простые встроенные стили для визуализации
const styles = {
//   container: { fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', backgroundColor: '#f9f9f9', minHeight: '100vh' },
//   title: { color: '#333' },
//   toolbar: { marginBottom: '20px' },
//   createButton: { padding: '15px 30px', fontSize: '18px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
//   playground: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', minHeight: '300px', padding: '20px', border: '3px dashed #ccc', borderRadius: '15px', backgroundColor: '#fff' },
//   emptyText: { color: '#999', fontSize: '18px', marginTop: '100px' },
//   carCard: { border: '1px solid #ddd', borderRadius: '12px', padding: '15px', width: '220px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
//   carImage: { width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '10px' },
   carBadge: { fontWeight: 'bold', marginBottom: '10px', color: '#555' },
//   actions: { display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' },
//   btnRead: { padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
//   btnUpdate: { padding: '8px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
//   btnDelete: { padding: '8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
//   overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
//   modal: { backgroundColor: 'white', padding: '30px', borderRadius: '20px', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
//   modalContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', margin: '20px 0' },
//   modalImage: { width: '80%', height: 'auto', borderRadius: '10px' },
//   specs: { fontSize: '16px', textAlign: 'left', width: '100%', padding: '0 20px' },
//   colorPickerContainer: { marginTop: '15px' },
  colorSelector: { width: '35px', height: '35px', borderRadius: '50%', margin: '0 8px', cursor: 'pointer', display: 'inline-block' },
//   closeButton: { padding: '10px 20px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' }
};
