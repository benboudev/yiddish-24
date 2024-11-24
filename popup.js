document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...

    const fireball = document.getElementById('fireball');
    if (fireball) {
        setTimeout(() => {
            fireball.style.display = 'block';
            fireball.style.animation = 'explode 1s ease-out forwards';
        }, 2500); // Time when cars crash
    }

    const fullScreenFireball = document.getElementById('fullScreenFireball');
    if (fullScreenFireball) {
        setInterval(() => {
            fullScreenFireball.style.display = 'block';
            fullScreenFireball.style.animation = 'fullScreenExplode 1s ease-out forwards';
            setTimeout(() => {
                fullScreenFireball.style.display = 'none';
            }, 1000);
        }, 5000);
    }
});