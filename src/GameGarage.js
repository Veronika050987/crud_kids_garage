import React, { useState } from 'react';
// import { CAR_TYPES } from './carsData';
import crud from './img/crud.png';
import './GameGarage.css';
import c from './img/c.png';
import r from './img/r.png';
import u from './img/u.png';
import d from './img/d.png';

import blue_car from './img/blue_car.png';
import blue_car_mod from './img/blue_car_mod.png';
import green_car from './img/green_car.png';
import green_car_mod from './img/green_car_mod.png';
import red_car from './img/red_car.png';
import red_car_mod from './img/red_car_mod.png';

export const CAR_TYPES = {
  blue: { 
    id: 'blue', 
    nameRu: 'Синяя машинка', nameEn: 'Blue car', 
    modRu: 'Синие диски', modEn: 'Blue rims',
    colorRu: 'Синий', colorEn: 'Blue',
    imgNormal: blue_car, imgMod: blue_car_mod 
  },
  green: { 
    id: 'green', 
    nameRu: 'Зеленая машинка', nameEn: 'Green car', 
    modRu: 'Новые шины', modEn: 'New tires',
    colorRu: 'Зелёный', colorEn: 'Green',
    imgNormal: green_car, imgMod: green_car_mod 
  },
  red: { 
    id: 'red', 
    nameRu: 'Kрасная машинка', nameEn: 'Red car', 
    modRu: 'Желтые диски', modEn: 'Yellow rims',
    colorRu: 'Красный', colorEn: 'Red',
    imgNormal: red_car, imgMod: red_car_mod 
  }
};

export default function GameGarage() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null); // Для функции READ (просмотр внутри)


  // Получаем машину, которую открыли в гараже
  const liveCar = cars.find(c => c?.id === selectedCar?.id);
  const carData = liveCar ? CAR_TYPES[liveCar.type] : null;

  // 1. CREATE: Создание случайной машинки (Максимум 4 на площадке)
  const addRandomCar = () => {
    if (cars.length >= 3) {
      alert('Площадка заполнена! Можно создать не больше 3 машинок.');
      return;
    }
    const types = Object.keys(CAR_TYPES);
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    setCars([...cars, { id: Date.now(), type: randomType, isModified: false }]);
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
      <button className='language' onClick={() => setIsEnglish(!isEnglish)}>
        {isEnglish ? "Русский" : "English"}
      </button>
      <h1 className='title'>
        {isEnglish ? "Kids car service with " : "Детский автосервис вместе с "} 
        <img src={crud} width={100} height={40} alt='CRUD'/>
        </h1>
      
      {/* Кнопка создания (CREATE) */}
      <div className='toolbar'>
        <button className='createButton' onClick={addRandomCar}>
          <img src={c} width={160} height={60} alt='create'/>
          {isEnglish ? "Assemble a car using the drawing" : "Собрать машинку по чертежу"}
           ({cars.length}/3)
        </button>
      </div>

      {/* Игровая площадка */}
      <div className='playground'>
        {cars.length === 0 ? (
          <p className='emptyText'>
            {isEnglish ? "The area is empty. Push button " : "Площадка пуста. Нажмите кнопку "} 
          <img src={c} width={160} height={60} alt='create'/>
          {isEnglish ? " to create a car!" : ", чтобы создать машинку!"}</p>
        ) : (
          cars.map((car) => {
            const carData = CAR_TYPES[car.type];
            const currentImg = car.isModified ? carData.imgMod : carData.imgNormal;

            return (
              <div key={car.id} className='carCard'>
                <img src={currentImg} alt={isEnglish ? carData.nameEn : carData.nameRu} className='carImage' />
                
                <div style={{
                    ...styles.carBadge,
                    color: car.type === 'blue' ? '#007bff' : car.type === 'green' ? '#28a745' : '#dc3545',
                    fontWeight: 'bold',
                    fontSize: '18px'
                }}>
                {isEnglish ? carData.colorEn : carData.colorRu} {car.isModified && '⭐'}
                </div>

                <div className='actions'>
                  {/* READ */}
                  <button className='btnRead' onClick={() => setSelectedCar(car)}>
                    <img src={r} width={110} height={34} alt='read'/>
                   <span>{isEnglish ? 'Car in details' : 'Рассмотреть машинку'}</span> 
                  </button>
                  
                  {/* UPDATE Колеса */}
                  <button className='btnUpdate' onClick={() => toggleWheels(car.id)}>
                    <img src={u} width={120} height={35} alt='update'/>
                    <span>
                      {car.isModified 
                      ? (isEnglish ? 'Return the wheels' : 'Вернуть колеса') 
                      : (isEnglish ? 'Change wheels' : 'Сменить колеса')}
                      </span> 
                  </button>

                  {/* DELETE */}
                  <button className='btnDelete' onClick={() => deleteCar(car.id)}>
                    <img src={d} width={100} height={30} alt='delete'/>
                    <span>{isEnglish ? 'Delete' : 'Удалить'}</span> 
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
                 {isEnglish ? 'We look inside the garage' : 'Заглядываем внутрь гаража'}
                </h2>
              <p>{isEnglish ? 'Inside the garage: ' : 'В гараже: '} 
                <strong>{isEnglish ? carData.nameEn : carData.nameRu}</strong></p>
              
              <div className='modalContent'>
                <img 
                  src={liveCar.isModified ? carData.imgMod : carData.imgNormal} 
                  alt="Вид изнутри" 
                  className='modalImage' 
                />
                
                <div className='specs'>
                  <p><strong>
                    <img src={r} width={110} height={34} alt='read'/>
                    {isEnglish ? 'Wheels status:' : 'Статус колес:'}
                    </strong>{' '} 
                    {liveCar.isModified 
                    ? `${isEnglish ? 'Installed:' : 'Установлено:'} ${isEnglish ? carData.modEn : carData.modRu}`  
                    : (isEnglish ? 'Standard wheels' : 'Стандартные колеса')}
                  </p>
                  
                  {/* UPDATE цвета прямо из меню просмотра */}
                  <div className='colorPickerContainer'>
                    <p style={{margin: '5px 0'}}>
                        <strong>
                            <img src={u} width={120} height={35} alt='update'/>
                            {isEnglish ? 'Modify your car:' : 'Изменить машинку:'}
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
                        title={isEnglish 
                          ? `Make it ${CAR_TYPES[colorKey].colorEn.toLowerCase()}` 
                          : `Сделать ${CAR_TYPES[colorKey].colorRu.toLowerCase()}ной`
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button className='closeButton' onClick={() => setSelectedCar(null)}>
                ❌ {isEnglish ? 'Close garage door' : 'Закрыть дверь гаража'}
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
   carBadge: { fontWeight: 'bold', marginBottom: '10px', color: '#555' },
  colorSelector: { width: '35px', height: '35px', borderRadius: '50%', margin: '0 8px', cursor: 'pointer', display: 'inline-block' }
}
