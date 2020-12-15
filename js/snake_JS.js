'use strict';

const canvas = document.querySelector('#game'); // выбираем поле
const  ctx = canvas.getContext('2d'); // указываем, что игра будет 2D
const ground = new Image(); // пространство в памяти для картинки  поля
const food = new Image(); // пространство в памяти для картинки  яблока
let box = 32; // указываем размер ячейки поля
let score = 0; // указываем счёт
let snake = []; // массив для отрисовки змейки
let speed; //скорость змейки
let level; // уровень игры, от него зависит скорость змейки
let titleLevel; // краткое описание уровня
let apple; // координаты яблока
let dir; // направление движения змейки
let snakeX;
let snakeY;
let newHead;
let appleX;
let appleY;
let soundTraks;


function readTextFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == '200') {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}
//usage:
readTextFile("./sound/_FilesName.json", function(text){
    soundTraks = JSON.parse(text);
    // console.log(`hjfhuigvh\\${soundTraks['0_mp3']}`);
});



level = prompt(`ВЫБЕРИТЕ  УРОВЕНЬ (от 1 до 10)`) || '1'; // запрашиваем у игрока уровень
// ==============================================  устанавливаем скорость змейки
        switch (level) {
            case  '1': speed = 1000; titleLevel = 'Первый раз играю ...'; break;
            case  '2': speed = 250; titleLevel = 'Молокосос !!!'; break;
            case  '3': speed = 200;break;
            case  '4': speed = 175;break;
            case  '5': speed = 150;break;
            case  '6': speed = 125;break;
            case  '7': speed = 100;break;
            case  '8': speed = 85;break;
            case  '9': speed = 70;break;
            case  '10': speed = 50; titleLevel = 'УльтраНагибатор'; break;
            // case 'null': speed = 300; titleLevel = 'Первый раз играю ...'; break;
            // default: speed = 300; titleLevel = 'Первый раз играю ...'; break;
        }
console.log(`Уровень ${level}, скорость ${speed}`); // выводим уровень игры и скорость змейки
ground.src = "img/ground.png"; // подгружаем изображение поля
food.src = "img/apple.png"; // подружаем изображение яблока
// ==============================================  задаём координаты яблока
        apple = { //  (в видео это food)
           x: Math.floor(Math.random()*17+1)*box,
           y: Math.floor(Math.random()*15+3)*box,
        };
// ==============================================  задаём начальную позицию змейки
        snake[0] = {
           x: 9*box,
           y: 10*box
        };
document.addEventListener('keydown', direction); // добавляем обработчик событий на нажатие клавиши
// ==============================================  определяем направление движения змейки
        function direction(e) {
            if(e.code === 'ArrowLeft' && dir !== 'right'){ // если нажата стрелка влево и направление не равно right, то
                dir = 'left'; // указываем направление left
            }else if(e.code === 'ArrowUp' && dir !== 'down'){ // если нажата стрелка вверх и направление не равно down, то
                dir = 'up'; // указываем направление up
            }else if(e.code === 'ArrowRight' && dir !== 'left'){ // если нажата стрелка вправо и направление не равно left, то
                dir = 'right'; // указываем направление right
            }else if(e.code === 'ArrowDown' && dir !== 'up'){ // если нажата стрелка вниз и направление не равно up, то
                dir = 'down'; // указываем направление down
            }
            drawGame();
        }
// ==============================================  на случай, если змейка запуталась
        function eatTail(head, arr) {
            for (let i=0;i<arr.length;i++){
                if(head.x===arr[i].x && head.y===arr[i].y){  // если координаты головы равны координатам любой части тела, то
                    clearInterval(game); // останавливаем игру
                    (confirm(`ЧЁ ЗА ... ???  ТЫ  ЗАПУТАЛСЯ  !!!  ЗАНОВО  ???`)) ? (location.reload()):(alert(`GAME  OVER`));// выводим сообщение
                }
            }
        }


let game = setInterval(drawGame, speed); // запускаем игру


// ==============================================  функция для запуска игры (перемещения змейки)
        function drawGame() {
    ctx.drawImage(ground, 0,0); // отрисоввываем на экране игровое поле
    ctx.drawImage(food,  apple.x, apple.y); // отрисовываем яблоко с рандомными координатами
    // ==============================================  отрисовываем змейку
    for (let i=0; i<snake.length;i++){
        ctx.fillStyle = ( i===0 ? 'red' : 'green' );
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
    }
    // ==============================================  отрисовываем текст набранных очков
    ctx.fillStyle = 'white'; // цвет белый
    ctx.font = '2rem Roboto sans-serif'; // определяем семейство шрифтов
    ctx.fillText(score, box*2,box*1.6); // определяем расположение текста
    snakeX = snake[0].x; // выделяем координаты головы змейки
    snakeY = snake[0].y;
    // сравниваем их с координатами яблока, если равны, то
    if(snakeX===apple.x && snakeY===apple.y){
        score++; // увеличываем очки
        // ===========================  и перемещаем яблоко в другое место
        appleX = Math.floor(Math.random()*17+1)*box;
        appleY = Math.floor(Math.random()*15+3)*box;

        snake.forEach((item)=>{
            if (item.x === appleX){
                if(item.y === appleY){
                    appleX = Math.floor(Math.random()*17+1)*box;
                    appleY = Math.floor(Math.random()*15+3)*box;
                }else {
                    appleX = Math.floor(Math.random()*17+1)*box;
                }
            }
        });
        apple = { // в видео это food
            x: appleX,
            y: appleY
        }

        // apple = { // в видео это food
        //     x: Math.floor(Math.random()*17+1)*box,
        //     y: Math.floor(Math.random()*15+3)*box
        // }

    }else { snake.pop();} // если координаты не равны, то удаляем последний объект в массиве (переместили голову и удалили хвост)
    // ===========================   ограничываем передвижение змейки границами игрового поля
    if(snakeX<box || snakeX>(17*box) || snakeY<(3*box) ||snakeY>(17*box) ){ // если координаты головы выходят за координаты границ поля, то
        clearInterval(game); // останавливаем игру
        (confirm(`ТЫ  СВАЛИЛ,  КАК  ПОЗОРНЫЙ  ТРУС  !!! ЗАНОВО ???`)) ? (location.reload()):(alert(`GAME  OVER`)); // выводим оповещение
    }
    // ===========================   перемещаем голову змейки
    if(dir === 'left'){snakeX -=box} // если направление равно left, то уменьшаем координату Х
    if(dir === 'right'){snakeX +=box} // если направление равно right, то увеличиваем координату Х
    if(dir === 'up'){snakeY -=box} // если направление равно up, то уменьшаем координату Y
    if(dir === 'down'){snakeY +=box} // если направление равно down, то увеличиваем координату Y
    // ===========================   создаем новый объект с новыми координатами
    let newHead={
        x:snakeX,
        y:snakeY
    };
    eatTail(newHead, snake); // запускаем скрипт "запуталась ли змейка?"
    snake.unshift(newHead); // добавляем в массив новый объект с новыми координатами, который становиться головой
}



