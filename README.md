<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Compressor</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Image Compressor</h1>
        <div class="upload-area">
            <label for="imageUpload" class="upload-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                    <path fill-rule="evenodd" d="M12 2.25c-5.384 0-9.75 4.366-9.75 9.75s4.366 9.75 9.75 9.75 9.75-4.366 9.75-9.75S17.384 2.25 12 2.25ZM12 14.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM11.25 16.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                </svg>
                Choose an Image
            </label>
            <input type="file" id="imageUpload" accept="image/*">
            <div id="selectedFileName">No file chosen</div>
        </div>

        <div class="options">
            <label for="quality">Compression Quality (0-1):</label>
            <input type="range" id="quality" min="0" max="1" step="0.05" value="0.5"> <span id="qualityValue">0.5</span>
            <p style="font-size: 0.8em; color: #777;">Lower quality = More compression = Smaller size (potentially lower visual quality)</p>
        </div>

        <div class="preview-area">
            <div class="preview">
                <h3>Original Image</h3>
                <img id="originalImage" src="#" alt="Original Image">
                <p id="originalSize"></p>
            </div>
            <div class="preview">
                <h3>Compressed Image</h3>
                <canvas id="compressedCanvas"></canvas>
                <p id="compressedSize"></p>
                <div class="actions">
                    <a id="downloadLink" href="#" download="compressed_image.jpg" class="download-button" style="display: none;">Download</a>
                    <button id="shareButton" class="share-button" style="display: none;">Share</button>
                    <p id="shareMessage" style="margin-top: 10px; font-size: 0.9em; color: green; display: none;"></p>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
