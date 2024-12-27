document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadBtn = document.getElementById('downloadBtn');
    const maxSizeSlider = document.getElementById('maxSize');
    const sizeValue = document.getElementById('sizeValue');

    let originalFile = null;
    let compressedFile = null;

    // 点击上传区域触发文件选择
    dropZone.addEventListener('click', () => fileInput.click());

    // 处理文件拖放
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#ddd';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0]);
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    // 处理质量滑块变化
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalFile) compressImage();
    });

    // 处理尺寸滑块变化
    maxSizeSlider.addEventListener('input', (e) => {
        sizeValue.textContent = `${e.target.value}px`;
        if (originalFile) compressImage();
    });

    // 处理文件
    async function handleFile(file) {
        if (!file.type.match(/image\/(jpeg|png)/)) {
            alert('请上传 JPG 或 PNG 格式的图片！');
            return;
        }

        originalFile = file;
        originalSize.textContent = `大小: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
        
        // 显示原始图片预览
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        await compressImage();
    }

    // 压缩图片
    async function compressImage() {
        if (!originalFile) return;

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: parseInt(maxSizeSlider.value),
            useWebWorker: true,
            quality: qualitySlider.value / 100
        };

        try {
            compressedFile = await imageCompression(originalFile, options);
            compressedSize.textContent = `大小: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                compressedPreview.src = e.target.result;
            };
            reader.readAsDataURL(compressedFile);

            downloadBtn.disabled = false;
        } catch (error) {
            console.error('压缩失败:', error);
            alert('图片压缩失败，请重试！');
        }
    }

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        if (!compressedFile) return;

        const link = document.createElement('a');
        link.download = `compressed_${originalFile.name}`;
        link.href = URL.createObjectURL(compressedFile);
        link.click();
    });
}); 