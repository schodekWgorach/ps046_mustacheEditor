class MustacheEditor {
    constructor() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.imageInput = document.getElementById('imageInput');
        this.uploadSection = document.getElementById('uploadSection');
        this.canvasContainer = document.getElementById('canvasContainer');
        this.controls = document.getElementById('controls');
        this.placedMustaches = document.getElementById('placedMustaches');
        
        this.currentImage = null;
        this.selectedMustache = null;
        this.placedMustacheElements = [];
        this.isDragging = false;
        this.currentDraggingElement = null;
        this.dragOffset = { x: 0, y: 0 };
        
        this.initializeEventListeners();
        this.drawMustacheTemplates();
    }

    initializeEventListeners() {
        // Image upload
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Mustache selection
        document.querySelectorAll('.mustache-item').forEach(item => {
            item.addEventListener('click', () => this.selectMustache(item));
        });
        
        // Buttons
        document.getElementById('addMustacheBtn').addEventListener('click', () => this.addMustache());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportImage());
        
        // Drag and drop for image upload
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const uploadBox = document.querySelector('.upload-box');
        
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#667eea';
            uploadBox.style.background = '#f0f4ff';
        });
        
        uploadBox.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#cbd5e0';
            uploadBox.style.background = '#f8f9fa';
        });
        
        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#cbd5e0';
            uploadBox.style.background = '#f8f9fa';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    this.loadImage(file);
                } else {
                    this.showMessage('Proszę załadować plik w formacie JPG', 'error');
                }
            }
        });
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                this.loadImage(file);
            } else {
                this.showMessage('Proszę załadować plik w formacie JPG', 'error');
                this.imageInput.value = '';
            }
        }
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.setupCanvas();
                this.showWorkspace();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    setupCanvas() {
        if (!this.currentImage) return;
        
        // Set canvas size to match image
        this.canvas.width = this.currentImage.width;
        this.canvas.height = this.currentImage.height;
        
        // Draw image on canvas
        this.ctx.drawImage(this.currentImage, 0, 0);
        
        // Clear placed mustaches
        this.placedMustaches.innerHTML = '';
        this.placedMustacheElements = [];
    }

    showWorkspace() {
        this.uploadSection.style.display = 'none';
        this.canvasContainer.style.display = 'block';
        this.controls.style.display = 'flex';
    }

    drawMustacheTemplates() {
        const templates = [
            { type: 'classic', color: '#2d3748' },
            { type: 'thick', color: '#1a202c' },
            { type: 'thin', color: '#4a5568' },
            { type: 'curly', color: 'red' },
            { type: 'straight', color: '#1a202c' },
            { type: 'stylish', color: '#2d3748' }
        ];

        document.querySelectorAll('.mustache-canvas').forEach((canvas, index) => {
            const ctx = canvas.getContext('2d');
            const template = templates[index];
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawMustache(ctx, template.type, 50, 20, 40, template.color);
        });
    }

    drawMustache(ctx, type, x, y, size, color = '#2d3748') {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        switch (type) {
            case 'classic':
                // Classic mustache
                ctx.beginPath();
                ctx.ellipse(x - size/2, y, size/2, size/4, 0, 0, Math.PI * 2);
                ctx.ellipse(x + size/2, y, size/2, size/4, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'thick':
                // Thick mustache
                ctx.beginPath();
                ctx.ellipse(x - size/2, y, size/2, size/3, 0, 0, Math.PI * 2);
                ctx.ellipse(x + size/2, y, size/2, size/3, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'thin':
                // Thin mustache
                ctx.beginPath();
                ctx.ellipse(x - size/2, y, size/2, size/6, 0, 0, Math.PI * 2);
                ctx.ellipse(x + size/2, y, size/2, size/6, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'curly':
                // Curly mustache
                ctx.beginPath();
                ctx.arc(x - size/2, y, size/3, 0, Math.PI * 2);
                ctx.arc(x + size/2, y, size/3, 0, Math.PI * 2);
                ctx.fill();
                // Add curls
                ctx.beginPath();
                ctx.arc(x - size/2 - 5, y - 5, 3, 0, Math.PI * 2);
                ctx.arc(x + size/2 + 5, y - 5, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'straight':
                // Straight mustache
                ctx.fillRect(x - size, y - size/8, size * 2, size/4);
                break;
                
            case 'stylish':
                // Stylish mustache
                ctx.beginPath();
                ctx.moveTo(x - size, y);
                ctx.quadraticCurveTo(x - size/2, y - size/3, x, y);
                ctx.quadraticCurveTo(x + size/2, y - size/3, x + size, y);
                ctx.quadraticCurveTo(x + size/2, y + size/3, x, y);
                ctx.quadraticCurveTo(x - size/2, y + size/3, x - size, y);
                ctx.fill();
                break;
        }
    }

    selectMustache(item) {
        // Remove previous selection
        document.querySelectorAll('.mustache-item').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Add selection to clicked item
        item.classList.add('selected');
        this.selectedMustache = item.dataset.mustache;
    }

    addMustache() {
        if (!this.selectedMustache) {
            this.showMessage('Proszę najpierw wybrać wzór wąsów', 'error');
            return;
        }
        
        if (!this.currentImage) {
            this.showMessage('Proszę najpierw załadować zdjęcie', 'error');
            return;
        }

        // Create draggable mustache element
        const mustacheDiv = document.createElement('div');
        mustacheDiv.className = 'placed-mustache';
        mustacheDiv.style.position = 'absolute';
        
        // Create canvas for the mustache
        const mustacheCanvas = document.createElement('canvas');
        mustacheCanvas.width = 120;
        mustacheCanvas.height = 60;
        const mustacheCtx = mustacheCanvas.getContext('2d');
        
        // Draw the selected mustache type
        const mustacheTypes = ['classic', 'thick', 'thin', 'curly', 'straight', 'stylish'];
        const type = mustacheTypes[this.selectedMustache - 1];
        this.drawMustache(mustacheCtx, type, 60, 30, 50);
        
        mustacheDiv.appendChild(mustacheCanvas);
        
        // Position in center of canvas container
        const containerRect = this.canvasContainer.getBoundingClientRect();
        mustacheDiv.style.left = (containerRect.width / 2 - 60) + 'px';
        mustacheDiv.style.top = (containerRect.height / 2 - 30) + 'px';
        
        // Add drag functionality
        this.addDragFunctionality(mustacheDiv);
        
        // Add to container
        this.placedMustaches.appendChild(mustacheDiv);
        this.placedMustacheElements.push(mustacheDiv);
        
        this.showMessage('Wąsy dodane! Przesuń je na odpowiednie miejsce.', 'success');
    }

    addDragFunctionality(element) {
        element.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.currentDraggingElement = element;
            element.classList.add('dragging');
            
            const rect = element.getBoundingClientRect();
            const containerRect = this.placedMustaches.getBoundingClientRect();
            
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            e.preventDefault();
        });
    }

    // Global mouse events for dragging
    setupGlobalDragEvents() {
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.currentDraggingElement) {
                const containerRect = this.placedMustaches.getBoundingClientRect();
                
                let newX = e.clientX - containerRect.left - this.dragOffset.x;
                let newY = e.clientY - containerRect.top - this.dragOffset.y;
                
                // Keep within bounds
                newX = Math.max(0, Math.min(newX, containerRect.width - this.currentDraggingElement.offsetWidth));
                newY = Math.max(0, Math.min(newY, containerRect.height - this.currentDraggingElement.offsetHeight));
                
                this.currentDraggingElement.style.left = newX + 'px';
                this.currentDraggingElement.style.top = newY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.currentDraggingElement) {
                this.currentDraggingElement.classList.remove('dragging');
            }
            this.isDragging = false;
            this.currentDraggingElement = null;
        });
    }

    exportImage() {
        if (!this.currentImage) {
            this.showMessage('Proszę najpierw załadować zdjęcie', 'error');
            return;
        }

        // Create a temporary canvas for export
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        exportCanvas.width = this.canvas.width;
        exportCanvas.height = this.canvas.height;
        
        // Draw the main image
        exportCtx.drawImage(this.currentImage, 0, 0);
        
        // Draw all placed mustaches
        this.placedMustacheElements.forEach(mustacheElement => {
            const canvas = mustacheElement.querySelector('canvas');
            const x = parseInt(mustacheElement.style.left);
            const y = parseInt(mustacheElement.style.top);
            
            // Calculate scale factor
            const scaleX = this.canvas.width / this.canvasContainer.offsetWidth;
            const scaleY = this.canvas.height / this.canvasContainer.offsetHeight;
            
            exportCtx.drawImage(canvas, x * scaleX, y * scaleY, canvas.width * scaleX, canvas.height * scaleY);
        });
        
        // Convert to JPG and download
        exportCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mustache-photo.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showMessage('Zdjęcie zostało wyeksportowane pomyślnie!', 'success');
        }, 'image/jpeg', 0.9);
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e53e3e' : '#48bb78'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const editor = new MustacheEditor();
    editor.setupGlobalDragEvents();
});
