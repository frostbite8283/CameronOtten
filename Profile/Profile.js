const textElement = document.getElementById('titleText');
const textList = ["Game Developer", "Software Engineer", "AI programmer"];
const fadeDuration = 500; // Matches the CSS transition duration
let index = 0;

function cycleText() {

    textElement.classList.remove('slide-in');
    textElement.classList.add('slide-out');

    setTimeout(() => {
        textElement.textContent = textList[index];
        textElement.classList.remove('slide-out');
        textElement.classList.add('slide-in');

        index = (index + 1) % textList.length;
    }, fadeDuration); // Match the slide-out animation duration
}

// Initial call to start the cycling
cycleText();

// Set interval for continuous cycling
setInterval(cycleText, 3000); // Adjust the interval as needed (slide duration + pause)