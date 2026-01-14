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

    // Transform state (calculated automatically)
    zoom = 1;
    panX = 0;
    panY = 0;

    close() {
        this.closeParams.emit();
    }

    reset() {
        this.imageSource = null;
        this.zoom = 1;
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
                // Logic: "Cover" behavior (always fill 300x300)
                // 1. Determine which dimension needs to be scaled more to fill the container
                const scaleX = this.canvasSize / this.img.width;
                const scaleY = this.canvasSize / this.img.height;

                // Use the larger scale factor to ensure the image covers the canvas
                this.zoom = Math.max(scaleX, scaleY);

                // 2. Center the image
                this.panX = (this.canvasSize - this.img.width * this.zoom) / 2;
                this.panY = (this.canvasSize - this.img.height * this.zoom) / 2;

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
        this.renderImage();
    }

    renderImage() {
        if (!this.ctx) return;

        // Clear
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        // Draw image centered and covering
        this.ctx.drawImage(
            this.img,
            this.panX,
            this.panY,
            this.img.width * this.zoom,
            this.img.height * this.zoom
        );
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
