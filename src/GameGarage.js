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
    nameRu: 'Синяя машинка', nameEn: 'Blue car', nameFr: 'Voiture bleue',
    modRu: 'Синие диски', modEn: 'Blue rims', modFr: 'Disques bleus',
    colorRu: 'Синий', colorEn: 'Blue', colorFr: 'Bleu',
    imgNormal: blue_car, imgMod: blue_car_mod 
  },
  green: { 
    id: 'green', 
    nameRu: 'Зеленая машинка', nameEn: 'Green car', nameFr: 'Voiture verte',
    modRu: 'Новые шины', modEn: 'New tires', modFr: 'Pneus neufs',
    colorRu: 'Зелёный', colorEn: 'Green', colorFr: 'Vert',
    imgNormal: green_car, imgMod: green_car_mod 
  },
  red: { 
    id: 'red', 
    nameRu: 'Kрасная машинка', nameEn: 'Red car', nameFr: 'Voiture rouge',
    modRu: 'Желтые диски', modEn: 'Yellow rims', modFr: 'Disques jaunes',
    colorRu: 'Красный', colorEn: 'Red', colorFr: 'Rouge',
    imgNormal: red_car, imgMod: red_car_mod 
  }
};

const translations = {
  ru: {
    title: "Детский автосервис вместе с ",
    assemble: "Собрать машинку по чертежу",
    empty: "Площадка пуста. Нажмите кнопку ",
    emptyEnd: ", чтобы создать машинку!",
    details: "Рассмотреть машинку",
    returnWheels: "Вернуть колеса",
    changeWheels: "Сменить колеса",
    delete: "Удалить",
    insideGarage: "Заглядываем внутрь гаража",
    inGarage: "В гараже: ",
    wheelsStatus: "Статус колес:",
    installed: "Установлено:",
    standardWheels: "Стандартные колеса",
    modify: "Изменить машинку:",
    makeIt: "Сделать цвета",
    close: "Закрыть дверь гаража",
    alertFull: "Площадка заполнена! Можно создать не больше 3 машинок."
  },
  en: {
    title: "Kids car service with ",
    assemble: "Assemble a car using the drawing",
    empty: "The area is empty. Push button ",
    emptyEnd: " to create a car!",
    details: "Car in details",
    returnWheels: "Return the wheels",
    changeWheels: "Change wheels",
    delete: "Delete",
    insideGarage: "We look inside the garage",
    inGarage: "Inside the garage: ",
    wheelsStatus: "Wheels status:",
    installed: "Installed:",
    standardWheels: "Standard wheels",
    modify: "Modify your car:",
    makeIt: "Make it ",
    close: "Close garage door",
    alertFull: "The area is full! You can create no more than 3 cars."
  },
  fr: {
    title: "Service de voiture pour enfants avec ",
    assemble: "Assembler une voiture selon le dessin",
    empty: "Le terrain est vide. Appuyez sur le bouton ",
    emptyEnd: " pour créer une voiture!",
    details: "Voiture en détails",
    returnWheels: "Rendre les roues",
    changeWheels: "Changer de roues",
    delete: "Supprimer",
    insideGarage: "On regarde à l'intérieur du garage",
    inGarage: "Dans le garage: ",
    wheelsStatus: "Statut des roues:",
    installed: "Installé:",
    standardWheels: "Roues standards",
    modify: "Modifier votre voiture:",
    makeIt: "Rendre ",
    close: "Fermer la porte du garage",
    alertFull: "Le terrain est plein! Tu ne peux créer que 3 voitures."
  }
};

export default function GameGarage() {
  const [lang, setLang] = useState('ru');
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null); // Для функции READ (просмотр внутри)

  const t = translations[lang];

  // Хелперы для получения динамических данных машин в зависимости от языка
  const getCarName = (carData) => {
    if (lang === 'en') return carData.nameEn;
    if (lang === 'fr') return carData.nameFr;
    return carData.nameRu;
  };

  const getCarColor = (carData) => {
    if (lang === 'en') return carData.colorEn;
    if (lang === 'fr') return carData.colorFr;
    return carData.colorRu;
  };

  const getCarMod = (carData) => {
    if (lang === 'en') return carData.modEn;
    if (lang === 'fr') return carData.modFr;
    return carData.modRu;
  };

  // Циклическое переключение языков: RU -> EN -> FR -> RU
  const toggleLanguage = () => {
    if (lang === 'ru') setLang('en');
    else if (lang === 'en') setLang('fr');
    else setLang('ru');
  };

  // Определение названия кнопки переключения
  const getLangButtonLabel = () => {
    if (lang === 'en') return "English";
    if (lang === 'fr') return "Français";
    return "Русский";
  };

  // 1. CREATE: Создание случайной машинки (Максимум 4 на площадке)
  const addRandomCar = () => {
    if (cars.length >= 3) {
      alert(t.alertFull);
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
      <button className='language' onClick={toggleLanguage}>
        {getLangButtonLabel()}
      </button>
      <h1 className='title'>
        {t.title} 
        <img src={crud} width={100} height={40} alt='CRUD' loading="lazy" aspectRatio= '1 / 1'/>
        </h1>
      
      {/* Кнопка создания (CREATE) */}
      <div className='toolbar'>
        <button className='createButton' onClick={addRandomCar}>
          <img src={c} width={160} height={60} alt='create' loading="lazy" aspectRatio= '1 / 1'/>
          {t.assemble}
           ({cars.length}/3)
        </button>
      </div>

      {/* Игровая площадка */}
      <div className='playground'>
        {cars.length === 0 ? (
          <p className='emptyText'>
            {t.empty} 
          <img src={c} width={160} height={60} alt='create' loading="lazy" aspectRatio= '1 / 1'/>
          {t.emptyEnd}</p>
        ) : (
          cars.map((car) => {
            const carData = CAR_TYPES[car.type];
            const currentImg = car.isModified ? carData.imgMod : carData.imgNormal;

            return (
              <div key={car.id} className='carCard'>
                <img src={currentImg} alt={getCarName(carData)} className='carImage' loading="lazy" aspectRatio= '1 / 1'/>
                
                <div style={{
                    ...styles.carBadge,
                    color: car.type === 'blue' ? '#007bff' : car.type === 'green' ? '#28a745' : '#dc3545',
                    fontWeight: 'bold',
                    fontSize: '18px'
                }}>
                {getCarColor(carData)} {car.isModified && '⭐'}
                </div>

                <div className='actions'>
                  {/* READ */}
                  <button className='btnRead' onClick={() => setSelectedCar(car)}>
                    <img src={r} width={110} height={34} alt='read' loading="lazy" aspectRatio= '1 / 1'/>
                   <span>{t.details}</span> 
                  </button>
                  
                  {/* UPDATE Колеса */}
                  <button className='btnUpdate' onClick={() => toggleWheels(car.id)}>
                    <img src={u} width={120} height={35} alt='update' loading="lazy" aspectRatio= '1 / 1'/>
                    <span>
                      {car.isModified 
                      ? (t.returnWheels) 
                      : (t.changeWheels)}
                      </span> 
                  </button>

                  {/* DELETE */}
                  <button className='btnDelete' onClick={() => deleteCar(car.id)}>
                    <img src={d} width={100} height={30} alt='delete' loading="lazy" aspectRatio= '1 / 1'/>
                    <span>{t.delete}</span> 
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
                <img src={r} width={110} height={34} alt='read' loading="lazy" aspectRatio= '1 / 1'/>
                 {t.insideGarage}
                </h2>
              <p>{t.inGarage} 
                <strong>{getCarName(carData)}</strong></p>
              
              <div className='modalContent'>
                <img 
                  src={liveCar.isModified ? carData.imgMod : carData.imgNormal} 
                  alt="Вид изнутри" 
                  className='modalImage'
                  loading="lazy" 
                  aspectRatio= '1 / 1' 
                />
                
                <div className='specs'>
                  <p><strong>
                    <img src={r} width={110} height={34} alt='read' loading="lazy" aspectRatio= '1 / 1'/>
                    {t.wheelsStatus}
                    </strong>{' '} 
                    {liveCar.isModified 
                    ? `${t.installed} ${getCarMod(carData)}`  
                    : (t.standardWheels)}
                  </p>
                  
                  {/* UPDATE цвета прямо из меню просмотра */}
                  <div className='colorPickerContainer'>
                    <p style={{margin: '5px 0'}}>
                        <strong>
                            <img src={u} width={120} height={35} alt='update' loading="lazy" aspectRatio= '1 / 1'/>
                            {t.modify}
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
                        title={lang==='ru'
                          ? `${t.makeIt}${CAR_TYPES[colorKey].colorRu?.toLowerCase()}ной`
                          : `${t.makeIt}${getCarColor(CAR_TYPES[colorKey])?.toLowerCase()}`
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button className='closeButton' onClick={() => setSelectedCar(null)}>
                ❌ {t.close}
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
