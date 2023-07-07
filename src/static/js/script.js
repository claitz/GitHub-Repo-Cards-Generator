const publicUrl = window.config.PUBLIC_URL;
const googleAnalyticsID = window.config.googleAnalyticsID;
document.getElementById('repoForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const gituser = document.getElementById('gituser').value;
    const repository = document.getElementById('repository').value;
    const bgColor = encodeURIComponent(document.getElementById('bg_color').value);
    const titleColor = encodeURIComponent(document.getElementById('title_color').value);
    const textColor = encodeURIComponent(document.getElementById('text_color').value);
    const iconColor = encodeURIComponent(document.getElementById('icon_color').value);

    localStorage.setItem('gituser', gituser);
    localStorage.setItem('repository', repository);
    localStorage.setItem('bgColor', bgColor);
    localStorage.setItem('titleColor', titleColor);
    localStorage.setItem('textColor', textColor);
    localStorage.setItem('iconColor', iconColor);

    const imageUrl = `${publicUrl}/repo/${gituser}/${repository}?bg_color=${bgColor}&title_color=${titleColor}&text_color=${textColor}&icon_color=${iconColor}`;

    const response = await fetch(imageUrl);

    document.getElementById('result').innerHTML = await response.text();

    // Generate shortcodes
    const bbShortcode = `[img]${imageUrl}[/img]`;
    const htmlShortcode = `&lt;img src=&quot;${imageUrl}&quot; alt=&quot;GitHub Repo Card&quot;&gt;`;
    const mdShortcode = `![GitHub Repo Card](${imageUrl})`;

    // Insert buttons into the div
    document.getElementById('shortcodes').innerHTML = `
        <button onclick="copyToClipboard('${bbShortcode}')" class="copy-button">Copy BBCode</button>
        <button onclick="copyToClipboard('${htmlShortcode}')" class="copy-button">Copy HTML</button>
        <button onclick="copyToClipboard('${mdShortcode}')" class="copy-button">Copy Markdown</button>
    `;
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function () {
        console.log('Copying to clipboard was successful!');
    }, function (err) {
        console.error('Could not copy text: ', err);
    });
}

function updateResetIcons() {
    const colorInputs = document.querySelectorAll('input[type=color]');
    // Show reset icons if value is different from default
    colorInputs.forEach(input => {
        const defaultValue = input.nextElementSibling.getAttribute('data-default');
        if (input.value !== defaultValue) {
            input.nextElementSibling.style.display = 'inline';
        } else {
            input.nextElementSibling.style.display = 'none';
        }
    });
}

window.onload = () => {
    document.getElementById('gituser').value = localStorage.getItem('gituser') || '';
    document.getElementById('repository').value = localStorage.getItem('repository') || '';
    document.getElementById('bg_color').value = localStorage.getItem('bgColor') ? decodeURIComponent(localStorage.getItem('bgColor')) : '#ffffff';
    document.getElementById('title_color').value = localStorage.getItem('titleColor') ? decodeURIComponent(localStorage.getItem('titleColor')) : '#0366d6';
    document.getElementById('text_color').value = localStorage.getItem('textColor') ? decodeURIComponent(localStorage.getItem('textColor')) : '#333333';
    document.getElementById('icon_color').value = localStorage.getItem('iconColor') ? decodeURIComponent(localStorage.getItem('iconColor')) : '#333333';

    // Call this function after setting the values to show or hide the reset icons
    updateResetIcons();
};

document.addEventListener('DOMContentLoaded', () => {
    const colorInputs = document.querySelectorAll('input[type=color]');
    const resetIcons = document.querySelectorAll('.reset-icon');

    // Listen for changes in color pickers
    colorInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateResetIcons(); // Call the function to show or hide the reset icons
        });
    });

    // Reset color picker to default value when reset icon is clicked
    resetIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            icon.previousElementSibling.value = icon.getAttribute('data-default');
            icon.style.display = 'none';
        });
    });
});

// Google Analytics
if (typeof googleAnalyticsID !== 'undefined' && googleAnalyticsID.trim() !== '') {
    document.addEventListener('DOMContentLoaded', function() {
        // Creating the gtag script element
        let gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsID}`;

        // Appending the gtag script to the document head
        document.head.appendChild(gtagScript);

        // Creating the configuration script element
        let gtagConfigScript = document.createElement('script');
        gtagConfigScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAnalyticsID}');
        `;

        // Appending the configuration script to the document head
        document.head.appendChild(gtagConfigScript);
    });
}
