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

    const downloadBtn = document.getElementById('downloadBtn');
    const downloadCount = document.getElementById('downloadCount');
    const funFill = document.getElementById('funFill');
    const partyButton = document.getElementById('partyButton');
    const stars = document.getElementById('stars');
    let count = 0;
    let funLevel = 0;
    let partyMode = false;

    downloadBtn.addEventListener('click', () => {
        count++;
        downloadCount.textContent = `Downloads: ${count}`;
        funLevel += 10;
        if (funLevel > 100) funLevel = 100;
        funFill.style.width = `${funLevel}%`;

        if (count >= 10 && !partyMode) {
            partyButton.style.display = 'inline-block';
        }

        // Open yiddish24 in a new tab
        window.open('https://www.yiddish24.com/', '_blank');
    });

    partyButton.addEventListener('click', () => {
        partyMode = !partyMode;
        if (partyMode) {
            document.body.style.animation = 'rotate 10s linear infinite';
            stars.style.opacity = '1';
        } else {
            document.body.style.animation = 'none';
            stars.style.opacity = '0';
        }
    });

    // Create stars
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 1}s`;
        stars.appendChild(star);
    }

    const starsButton = document.getElementById('starsButton');
    let starsVisible = false;

    starsButton.addEventListener('click', () => {
        starsVisible = !starsVisible;
        stars.style.opacity = starsVisible ? '1' : '0';
    });
   
    // Easter egg: Typing "ben"
    const secretCode = ['b', 'e', 'n'];
    let secretIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === secretCode[secretIndex]) {
            secretIndex++;
            if (secretIndex === secretCode.length) {
                
                document.body.style.animation = 'rotate 2s linear infinite';
                setTimeout(() => {
                    document.body.style.animation = 'none';
                }, 5000);
                secretIndex = 0;
            }
        } else {
            secretIndex = 0;
        }
    });
});