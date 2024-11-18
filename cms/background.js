document.addEventListener('DOMContentLoaded', () => {
    const backgroundSlider = document.getElementById('background-slider');
    const slides = document.querySelectorAll('.slide');
    const torch = document.getElementById('torch');

    // Food images for the slider
    const foodImages = [
        '1.jpeg',
        '2.jpg',
        '3.jpeg',
    ];

    // Set up the slider
    slides.forEach((slide, index) => {
        slide.style.backgroundImage = `url('${foodImages[index]}')`;
    });

    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].style.opacity = 0;
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.opacity = 1;
    }

    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Show the first slide
    slides[currentSlide].style.opacity = 1;

    // Torch-like cursor effect
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        torch.style.left = `${x - 100}px`;
        torch.style.top = `${y - 100}px`;
    });
});