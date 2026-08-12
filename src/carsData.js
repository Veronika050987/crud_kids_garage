import blue_car from './img/blue_car.png';
import blue_car_mod from './img/blue_car_mod.png';
import green_car from './img/green_car.png';
import green_car_mod from './img/green_car_mod.png';
import red_car from './img/red_car.png';
import red_car_mod from './img/red_car_mod.png';

export const CAR_TYPES = {
  blue: {
    id: 'blue',
    name: 'Синяя машинка',
    colorName: 'Синий цвет',
    imgNormal: blue_car,     
    imgMod: blue_car_mod,   
    modText: 'Синие диски'
  },
  green: {
    id: 'green',
    name: 'Зеленая машинка',
    colorName: 'Зелёный цвет',
    imgNormal: green_car,  
    imgMod: green_car_mod,   
    modText: 'Новые шины'
  },
  red: {
    id: 'red',
    name: 'Красная машинка',
    colorName: 'Красный цвет',
    imgNormal: red_car,      
    imgMod: red_car_mod,     
    modText: 'Желтые диски'
  }
};
