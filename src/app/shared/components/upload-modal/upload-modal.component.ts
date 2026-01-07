import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, NgZone, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-upload-modal',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent],
    templateUrl: './upload-modal.component.html',
    styleUrl: './styles/upload-modal.component.css'
})
export class UploadModalComponent {
    private ngZone = inject(NgZone);

    @Input() isUploading = false;
    @Output() closeParams = new EventEmitter<void>();
    @Output() imageCropped = new EventEmitter<File>();
    @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    imageSource: string | null = null;
    isDragging = false;
    isProcessing = false;

    // Cropping logic
    private img = new Image();
    private ctx!: CanvasRenderingContext2D;
    private canvasSize = 300; // Match CSS size

    // Transform state
    currentZoom = 1;
    minZoom = 1;
    maxZoom = 3;
    panX = 0;
    panY = 0;
    isDraggingImage = false;
    lastMouseX = 0;
    lastMouseY = 0;

    close() {
        this.closeParams.emit();
    }

    reset() {
        this.imageSource = null;
        this.currentZoom = 1;
        this.panX = 0;
        this.panY = 0;
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        this.isDragging = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        this.isDragging = false;
        if (event.dataTransfer?.files.length) {
            this.handleFile(event.dataTransfer.files[0]);
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.handleFile(input.files[0]);
        }
    }

    handleFile(file: File) {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.imageSource = e.target?.result as string;
            this.img.src = this.imageSource;
            this.img.onload = () => {
                // Calculate initial zoom to fit cover
                const scaleX = this.canvasSize / this.img.width;
                const scaleY = this.canvasSize / this.img.height;
                this.minZoom = Math.max(scaleX, scaleY);
                this.currentZoom = this.minZoom;
                this.maxZoom = this.minZoom * 4;

                // Center image
                this.panX = (this.canvasSize - this.img.width * this.currentZoom) / 2;
                this.panY = (this.canvasSize - this.img.height * this.currentZoom) / 2;

                // Initialize canvas after view update
                setTimeout(() => this.initCanvas(), 0);
            };
        };
        reader.readAsDataURL(file);
    }

    initCanvas() {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        canvas.width = this.canvasSize;
        canvas.height = this.canvasSize;
        this.ctx = canvas.getContext('2d')!;
        this.texturaImage();
    }

    texturaImage() {
        if (!this.ctx) return;

        // Clear
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        // Draw image with transforms
        this.ctx.drawImage(
            this.img,
            this.panX,
            this.panY,
            this.img.width * this.currentZoom,
            this.img.height * this.currentZoom
        );
    }

    // Interaction Logic
    startDrag(event: MouseEvent | TouchEvent) {
        event.preventDefault();
        this.isDraggingImage = true;
        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        this.lastMouseX = clientX;
        this.lastMouseY = clientY;

        // Global listeners for drag outside container
        window.addEventListener('mousemove', this.doDrag);
        window.addEventListener('mouseup', this.stopDrag);
        window.addEventListener('touchmove', this.doDrag, { passive: false });
        window.addEventListener('touchend', this.stopDrag);
    }

    doDrag = (event: MouseEvent | TouchEvent) => {
        if (!this.isDraggingImage) return;
        event.preventDefault();

        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

        const deltaX = clientX - this.lastMouseX;
        const deltaY = clientY - this.lastMouseY;

        this.panX += deltaX;
        this.panY += deltaY;

        this.constrainPan();
        this.texturaImage();

        this.lastMouseX = clientX;
        this.lastMouseY = clientY;
    }

    stopDrag = () => {
        this.isDraggingImage = false;
        window.removeEventListener('mousemove', this.doDrag);
        window.removeEventListener('mouseup', this.stopDrag);
        window.removeEventListener('touchmove', this.doDrag);
        window.removeEventListener('touchend', this.stopDrag);
    }

    onZoomChange(event: Event) {
        const slider = event.target as HTMLInputElement;
        const oldZoom = this.currentZoom;
        this.currentZoom = parseFloat(slider.value);

        // Zoom centered logic (simplified: maintain center relative ratio roughly)
        const factor = this.currentZoom / oldZoom;

        this.constrainPan();
        this.texturaImage();
    }

    constrainPan() {
        // Ensure image always covers the canvas
        const imgWidth = this.img.width * this.currentZoom;
        const imgHeight = this.img.height * this.currentZoom;

        if (this.panX > 0) this.panX = 0;
        if (this.panX + imgWidth < this.canvasSize) this.panX = this.canvasSize - imgWidth;

        if (this.panY > 0) this.panY = 0;
        if (this.panY + imgHeight < this.canvasSize) this.panY = this.canvasSize - imgHeight;
    }

    cropAndSave() {
        try {
            this.isProcessing = true; // Trigger UI update

            if (!this.canvasRef || !this.canvasRef.nativeElement) {
                console.error('Canvas not found');
                this.isProcessing = false;
                return;
            }

            // Create output canvas
            const outputCanvas = document.createElement('canvas');
            outputCanvas.width = 300; // Final upload size
            outputCanvas.height = 300;
            const ctx = outputCanvas.getContext('2d');

            if (!ctx) {
                console.error('Could not get context for output canvas');
                this.isProcessing = false;
                return;
            }

            // Draw current view to output
            ctx.drawImage(this.canvasRef.nativeElement, 0, 0, 300, 300);

            outputCanvas.toBlob((blob) => {
                this.ngZone.run(() => {
                    try {
                        if (blob) {
                            // Convert blob to file
                            const file = new File([blob], "profile-pic.jpg", { type: "image/jpeg" });
                            // Emit event
                            this.imageCropped.emit(file);
                        } else {
                            console.error('Blob generation failed');
                        }
                    } catch (e) {
                        console.error('Error in emission', e);
                    } finally {
                        // Ensure this runs inside the zone so UI updates
                        this.isProcessing = false;
                    }
                });
            }, 'image/jpeg', 0.9);
        } catch (e) {
            console.error('Error in cropAndSave', e);
            this.isProcessing = false;
        }
    }
}
