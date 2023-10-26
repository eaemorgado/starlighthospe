document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const nameInput = document.getElementById('name');
        const commentInput = document.getElementById('comment');

        const name = nameInput.value;
        const comment = commentInput.value;

        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${name}:</strong> ${comment}`;
        commentList.appendChild(listItem);

        // Limpe os campos do formulário
        nameInput.value = '';
        commentInput.value = '';
    });
});

const carousel = document.getElementById("carousel");
        const slides = document.querySelectorAll(".carousel-slide");

        let currentIndex = 0;

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }

        function updateCarousel() {
            const offset = -currentIndex * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        }

        // Troca de slide automaticamente a cada 3 segundos
        setInterval(nextSlide, 3000);

        // Atualiza o carrossel quando a janela é redimensionada
        window.addEventListener("resize", updateCarousel);

        updateCarousel(); // Atualiza o carrossel quando a página é carregada
