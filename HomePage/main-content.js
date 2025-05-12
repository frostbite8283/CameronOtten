let activeContentId = 'content0'; // Keep track of the active content

function toggleContent(targetId) {
    const allContent = document.querySelectorAll('.main-content');

    allContent.forEach(content => {
        if (content.id === targetId) {
            content.classList.add('active-content');
            activeContentId = targetId;
            if (content.dataset.iframeContent === 'true' && !content.dataset.loaded) {
                loadIframe('/' + targetId + '/' + targetId + '.html', targetId);
                content.dataset.loaded = true; // Mark as loaded
            }
        } else {
            content.classList.remove('active-content');
        }
    });
}

function loadIframe(filePath, targetElementId) {
    const iframe = document.createElement('iframe');
    iframe.src = filePath;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    const container = document.getElementById(targetElementId);
    if (container) {
        container.innerHTML = ''; // Clear any existing content
        container.appendChild(iframe);
    } else {
        console.error(`Target element with ID '${targetElementId}' not found.`);
    }
}