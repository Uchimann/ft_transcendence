function animateElement(element, property, startValue, endValue, duration) {
    let startTime = null;

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsedTime = currentTime - startTime;

        const progress = Math.min(elapsedTime / duration, 1);
        const value = startValue + (endValue - startValue) * Math.sin(progress * Math.PI);

        element.style[property] = value + "px";

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            requestAnimationFrame(() => animateElement(element, property, startValue, endValue, duration));
        }
    }

    requestAnimationFrame(animate);
}

const headStripe = document.getElementById("headStripe");
const spaceman = document.getElementById("spaceman");

animateElement(headStripe, "transform", 0, 1, 1000);
animateElement(spaceman, "transform", 0, 1, 1000);


function animateCrater(element, startX, endX, duration) {
    let startTime = null;

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsedTime = currentTime - startTime;

        const progress = Math.min(elapsedTime / duration, 1);
        const value = startX + (endX - startX) * Math.sin(progress * Math.PI);

        element.style.transform = `translateX(${value}px)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            requestAnimationFrame(() => animateCrater(element, startX, endX, duration));
        }
    }

    requestAnimationFrame(animate);
}

const craterSmall = document.getElementById("craterSmall");
const craterBig = document.getElementById("craterBig");

animateCrater(craterSmall, 0, -3, 1000);
animateCrater(craterBig, 0, 3, 1000);

