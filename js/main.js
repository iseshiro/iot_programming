'use strict'

const led1 = document.getElementById('led1');
const led2 = document.getElementById('led2');
const led3 = document.getElementById('led3');
const led4 = document.getElementById('led4');
const set_led1 = document.getElementById('set_led1');
const set_led2 = document.getElementById('set_led2');
const set_led3 = document.getElementById('set_led3');
const set_led4 = document.getElementById('set_led4');

if(set_led1.value === "ON") {
    led1.classList.add('ledOn');
} else {
    led1.classList.remove('ledOn');
}

if(set_led2.value === "ON") {
    led2.classList.add('ledOn');
} else {
    led2.classList.remove('ledOn');
}

if(set_led3.value === "ON") {
    led3.classList.add('ledOn');
} else {
    led3.classList.remove('ledOn');
}

if(set_led4.value === "ON") {
    led4.classList.add('ledOn');
} else {
    led4.classList.remove('ledOn');
}

led1.addEventListener('click', function() {
    if( set_led1.value === "ON") {
	led1.classList.remove('ledOn');
	set_led1.value = "OFF"
    } else {
	led1.classList.add('ledOn');
	set_led1.value = "ON"
    }
});

led2.addEventListener('click', function() {
    if( set_led2.value === "ON") {
	led2.classList.remove('ledOn');
	set_led2.value = "OFF"
    } else {
	led2.classList.add('ledOn');
	set_led2.value = "ON"
    }
});

led3.addEventListener('click', function() {
    if( set_led3.value === "ON") {
	led3.classList.remove('ledOn');
	set_led3.value = "OFF"
    } else {
	led3.classList.add('ledOn');
	set_led3.value = "ON"
    }
});

led4.addEventListener('click', function() {
    if( set_led4.value === "ON") {
	led4.classList.remove('ledOn');
	set_led4.value = "OFF"
    } else {
	led4.classList.add('ledOn');
	set_led4.value = "ON"
    }
});

led1.addEventListener('mouseover', function() { led1.classList.add('ledOver');});
led2.addEventListener('mouseover', function() { led2.classList.add('ledOver');});
led3.addEventListener('mouseover', function() { led3.classList.add('ledOver');});
led4.addEventListener('mouseover', function() { led4.classList.add('ledOver');});

led1.addEventListener('mouseout', function() { led1.classList.remove('ledOver');});
led2.addEventListener('mouseout', function() { led2.classList.remove('ledOver');});
led3.addEventListener('mouseout', function() { led3.classList.remove('ledOver');});
led4.addEventListener('mouseout', function() { led4.classList.remove('ledOver');});

const rangeValue = function (elem, target) {
    return function(evt) {
	target.innerHTML = elem.value;
    }
}

const pwm_elem1 = document.getElementById('pwm_range1');
const pwm_elem2 = document.getElementById('pwm_range2');
const pwm_elem3 = document.getElementById('pwm_range3');
let pwm_target1 = document.getElementById('pwm_value1');
let pwm_target2 = document.getElementById('pwm_value2');
let pwm_target3 = document.getElementById('pwm_value3');
pwm_elem1.addEventListener('input', rangeValue(pwm_elem1, pwm_target1));
pwm_elem2.addEventListener('input', rangeValue(pwm_elem2, pwm_target2));
pwm_elem3.addEventListener('input', rangeValue(pwm_elem3, pwm_target3));

const pwm_elem4 = document.getElementById('pwm_range4');
const pwm_elem5 = document.getElementById('pwm_range5');
const pwm_elem6 = document.getElementById('pwm_range6');
let pwm_target4 = document.getElementById('pwm_value4');
let pwm_target5 = document.getElementById('pwm_value5');
let pwm_target6 = document.getElementById('pwm_value6');
pwm_elem4.addEventListener('input', rangeValue(pwm_elem4, pwm_target4));
pwm_elem5.addEventListener('input', rangeValue(pwm_elem5, pwm_target5));
pwm_elem6.addEventListener('input', rangeValue(pwm_elem6, pwm_target6));

let pwm_set1 = document.getElementById('set_pwm1');
let pwm_set2 = document.getElementById('set_pwm2');
let pwm_set3 = document.getElementById('set_pwm3');
let pwm_set4 = document.getElementById('set_pwm4');
let pwm_set5 = document.getElementById('set_pwm5');
let pwm_set6 = document.getElementById('set_pwm6');

function submit_rgb() {
    pwm_set1.value = pwm_target1.textContent;
    pwm_set2.value = pwm_target2.textContent;
    pwm_set3.value = pwm_target3.textContent;
    pwm_set4.value = pwm_target4.textContent;
    pwm_set5.value = pwm_target5.textContent;
    pwm_set6.value = pwm_target6.textContent;
    document.set_pwm_led.submit();
}


const sw1 = document.getElementById('sw1');
sw1.style.backgroundColor = (sw1.textContent === "ON")?'limegreen':'darkgreen';
const sw2 = document.getElementById('sw2');
sw2.style.backgroundColor = (sw2.textContent === "ON")?'limegreen':'darkgreen';
const sw3 = document.getElementById('sw3');
sw3.style.backgroundColor = (sw3.textContent === "ON")?'limegreen':'darkgreen';
const sw4 = document.getElementById('sw4');
sw4.style.backgroundColor = (sw4.textContent === "ON")?'limegreen':'darkgreen';

const btn1 = document.getElementById('btn1');
btn1.style.backgroundColor = (btn1.textContent === "ON")?'limegreen':'darkgreen';
const btn2 = document.getElementById('btn2');
btn2.style.backgroundColor = (btn2.textContent === "ON")?'limegreen':'darkgreen';
const btn3 = document.getElementById('btn3');
btn3.style.backgroundColor = (btn3.textContent === "ON")?'limegreen':'darkgreen';
const btn4 = document.getElementById('btn4');
btn4.style.backgroundColor = (btn4.textContent === "ON")?'limegreen':'darkgreen';
