document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const selectedFileName = document.getElementById('selectedFileName');
    const originalImage = document.getElementById('originalImage');
    const originalSizeDisplay = document.getElementById('originalSize');
    const qualityInput = document.getElementById('quality');
    const qualityValueDisplay = document.getElementById('qualityValue');
    const compressedCanvas = document.getElementById('compressedCanvas');
    const compressedSizeDisplay = document.getElementById('compressedSize');
    const downloadLink = document.getElementById('downloadLink');
    const shareButton = document.getElementById('shareButton');
    const shareMessage = document.getElementById('shareMessage');

    let originalFile;
    let compressedBlob;

    imageUpload.addEventListener('change', (event) => {
        originalFile = event.target.files[0];
        if (originalFile) {
            selectedFileName.textContent = originalFile.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImage.src = e.target.result;
                originalSizeDisplay.textContent = `Original Size: ${(originalFile.size / 1024).toFixed(2)} KB`;
                compressImage(e.target.result, parseFloat(qualityInput.value));
            };
            reader.readAsDataURL(originalFile);
        } else {
            resetPreview();
        }
    });

    qualityInput.addEventListener('input', () => {
        const quality = parseFloat(qualityInput.value);
        qualityValueDisplay.textContent = quality.toFixed(2);
        if (originalImage.src && originalImage.src !== '#') {
            compressImage(originalImage.src, quality);
        }
    });

    function resetPreview() {
        selectedFileName.textContent = 'No file chosen';
        originalImage.src = '#';
        originalSizeDisplay.textContent = '';
        compressedCanvas.getContext('2d').clearRect(0, 0, compressedCanvas.width, compressedCanvas.height);
        compressedSizeDisplay.textContent = '';
        downloadLink.style.display = 'none';
        shareButton.style.display = 'none';
        shareMessage.style.display = 'none';
        compressedBlob = null;
    }

    function compressImage(imageDataURL, quality) {
        const img = new Image();
        img.onload = () => {
            const canvas = compressedCanvas;
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            canvas.toBlob(async (blob) => {
                console.log('toBlob callback executed. Blob:', blob);
                if (blob) {
                    compressedBlob = blob;
                    console.log('Compressed Blob set:', compressedBlob);
                    const compressedURL = URL.createObjectURL(compressedBlob);
                    downloadLink.href = compressedURL;
                    const fileExtension = 'jpg';
                    downloadLink.download = `compressed_${originalFile ? originalFile.name.split('.')[0] : 'image'}.${fileExtension}`;
                    compressedSizeDisplay.textContent = `Compressed Size: ${(compressedBlob.size / 1024).toFixed(2)} KB`;
                    downloadLink.style.display = 'inline-block';
                    shareButton.style.display = 'inline-block';
                    shareMessage.style.display = 'none';

                    if (originalFile && compressedBlob.size >= originalFile.size) {
                        console.warn("Compressed size is not smaller than the original. Try a lower quality setting.");
                        compressedSizeDisplay.innerHTML += '<br><span style="color: red;">Warning: Compressed size might not be smaller. Try lower quality.</span>';
                    }
                } else {
                    console.error('canvas.toBlob failed to create a blob.');
                    compressedSizeDisplay.textContent = 'Compression failed.';
                    downloadLink.style.display = 'none';
                    shareButton.style.display = 'none';
                    shareMessage.style.display = 'none';
                    compressedBlob = null;
                }
            }, 'image/jpeg', quality);
        };
        img.onerror = () => {
            console.error("Error loading image.");
            resetPreview();
            alert("Error loading the image. Please try a different file.");
        };
        img.src = imageDataURL;
    }

    downloadLink.addEventListener('click', (event) => {
        if (!compressedBlob) {
            event.preventDefault();
            alert("Please compress an image first.");
        } else {
            console.log('Download link clicked. compressedBlob is:', compressedBlob);
        }
    });

    shareButton.addEventListener('click', async () => {
        if (!compressedBlob) {
            alert("Please compress an image first.");
            return;
        }

        console.log('Share button clicked. compressedBlob is:', compressedBlob);

        if (navigator.share) {
            try {
                const file = new File([compressedBlob], `compressed_${originalFile ? originalFile.name.split('.')[0] : 'image'}.jpg`, { type: compressedBlob.type });
                console.log('File object for sharing:', file);
                await navigator.share({
                    files: [file],
                    title: 'Compressed Image',
                    text: 'Check out this compressed image!'
                });
                shareMessage.textContent = 'Shared successfully!';
                shareMessage.style.display = 'block';
                setTimeout(() => {
                    shareMessage.style.display = 'none';
                }, 3000);
            } catch (error) {
                console.error('Error sharing:', error);
                shareMessage.textContent = 'Sharing failed.';
                shareMessage.style.display = 'block';
                setTimeout(() => {
                    shareMessage.style.display = 'none';
                }, 3000);
            }
        } else {
            const compressedURL = URL.createObjectURL(compressedBlob);
            navigator.clipboard.writeText(compressedURL)
                .then(() => {
                    shareMessage.textContent = 'Link copied to clipboard!';
                    shareMessage.style.display = 'block';
                    setTimeout(() => {
                        shareMessage.style.display = 'none';
                    }, 3000);
                    setTimeout(() => {
                        URL.revokeObjectURL(compressedURL);
                    }, 10000);
                })
                .catch((err) => {
                    console.error('Could not copy link: ', err);
                    shareMessage.textContent = 'Could not copy link to clipboard.';
                    shareMessage.style.display = 'block';
                    setTimeout(() => {
                        shareMessage.style.display = 'none';
                    }, 3000);
                });
        }
    });
});