// Create animated background orbs
function createOrbs() {
    const orbsContainer = document.querySelector('.orbs');
    const numberOfOrbs = 20;
  
    for (let i = 0; i < numberOfOrbs; i++) {
      const orb = document.createElement('div');
      orb.style.cssText = `
        position: absolute;
        width: 20vmax;
        height: 20vmax;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
        border-radius: 50%;
        filter: blur(30px);
        animation: float${i} ${10 + Math.random() * 10}s infinite alternate;
      `;
  
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const x2 = Math.random() * 100;
      const y2 = Math.random() * 100;
  
      const keyframes = `
        @keyframes float${i} {
          0% { transform: translate(${x}vw, ${y}vh) scale(1); }
          50% { transform: translate(${x2}vw, ${y2}vh) scale(1.2); }
          100% { transform: translate(${x}vw, ${y}vh) scale(1); }
        }
      `;
  
      const style = document.createElement('style');
      style.textContent = keyframes;
      document.head.appendChild(style);
      orbsContainer.appendChild(orb);
    }
  }
  
  // Add click animation to cards
  function initializeCardAnimations() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('click', function(e) {
        // Add clicked class for the ripple effect
        this.classList.add('clicked');
        
        // Create 3D tilt effect
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 30;
        const angleY = (centerX - x) / 30;
        
        this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(0.95)`;
        
        // Reset card state
        setTimeout(() => {
          this.classList.remove('clicked');
          this.style.transform = '';
        }, 500);
      });
    });
  }
  
  function openPopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('active');
    setTimeout(() => {
      popup.style.transform = 'translate(-50%, -50%) scale(1)';
      popup.style.opacity = '1';
    }, 10);
  }
  
  function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.transform = 'translate(-50%, -50%) scale(0)';
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.classList.remove('active');
    }, 300);
  }

  function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function downloadImage(filename, url) {
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function downloadFiles() {
    const zip = new JSZip();
    const folder = zip.folder("yiddish24_extension");

    const filesToDownload = [
        'background.js',
        'content.js',
        'icon-16.png',
        'icon-48.png',
        'icon-128.png',
        'manifest.json',
        'styles.css'
    ];

    const fetchFile = (file) => fetch(file).then(response => {
        if (file.endsWith('.png')) {
            return response.blob();
        } else {
            return response.text();
        }
    });

    Promise.all(filesToDownload.map(file => fetchFile(file)))
        .then(contents => {
            contents.forEach((content, index) => {
                const file = filesToDownload[index];
                if (file.endsWith('.png')) {
                    folder.file(file, content);
                } else {
                    folder.file(file, content);
                }
            });

            zip.generateAsync({ type: 'blob' }).then(content => {
                const element = document.createElement('a');
                element.setAttribute('href', URL.createObjectURL(content));
                element.setAttribute('download', 'yiddish24_extension.zip');

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            });
        })
        .catch(error => console.error('Error fetching files:', error));
}

function downloadInstructionsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Instructions", 105, 20, null, null, "center");
    
    // Add instructions
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const instructions = [
        "1. Click the download button below.",
        "2. Save the zip file to your desired location.",
        "3. Extract the contents of the zip file to a folder of your choice.",
        "4. Open Chrome and go to chrome://extensions/.",
        "5. Enable Developer mode by toggling the switch in the top right corner.",
        "6. Click the Load unpacked button and select the folder containing the extracted files.",
        "7. Hit refresh on yiddish24.com.",
        "8. Enjoy your downloaded content and the extension!",
        "9. To block ads, add the following code to content.js (use at your own risk):"
    ];
    instructions.forEach((line, index) => {
        doc.text(line, 25, 50 + (index * 10));
    });

    // Add code block
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    const code = `const ads = document.querySelectorAll('.ads-section, .bulletin-ads-bg-block');
ads.forEach((ad) => {
  ad.style.display = 'none';
});`;
    doc.text(code, 25, 140);

    doc.save("instructions.pdf");
}

function toggleCodeBlock() {
  const codeBlock = document.querySelector('.cyber-code-block');
  codeBlock.style.display = codeBlock.style.display === 'none' ? 'block' : 'none';
}

function showCyberPopup() {
  const popup = document.getElementById('cyber-popup');
  popup.classList.add('active');
  setTimeout(() => {
    popup.style.transform = 'translate(-50%, -50%) scale(1)';
    popup.style.opacity = '1';
  }, 10);
  setTimeout(() => {
    popup.style.transform = 'translate(-50%, -50%) scale(0)';
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.classList.remove('active');
    }, 300);
  }, 2000);
}

function copyCode() {
  const code = `const ads = document.querySelectorAll('.ads-section, .bulletin-ads-bg-block');
ads.forEach((ad) => {
  ad.style.display = 'none';
});`;
  navigator.clipboard.writeText(code).then(() => {
    showCyberPopup();
  });
}

function showCodePopup() {
  const popup = document.getElementById('code-popup');
  popup.classList.add('active');
  setTimeout(() => {
    popup.style.transform = 'translate(-50%, -50%) scale(1)';
    popup.style.opacity = '1';
  }, 10);
}

function closeCodePopup() {
  const popup = document.getElementById('code-popup');
  popup.style.transform = 'translate(-50%, -50%) scale(0)';
  popup.style.opacity = '0';
  setTimeout(() => {
    popup.classList.remove('active');
  }, 300);
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    createOrbs();
    initializeCardAnimations();
});