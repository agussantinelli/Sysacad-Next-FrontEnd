import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoIntegranteDTO } from '@core/models/messaging.models';

@Component({
    selector: 'app-participants-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './participants-list.component.html',
    styleUrl: './styles/participants-list.component.css'
})
export class ParticipantsListComponent {
    @Input() participants: GrupoIntegranteDTO[] = [];
    @Input() totalCount: number = 0;
    @Output() close = new EventEmitter<void>();

    get sortedParticipants(): GrupoIntegranteDTO[] {
        return [...this.participants].sort((a, b) => {
            if (a.rol === 'ADMIN' && b.rol !== 'ADMIN') return -1;
            if (a.rol !== 'ADMIN' && b.rol === 'ADMIN') return 1;
            return a.apellido.localeCompare(b.apellido);
        });
    }

    onClose() {
        this.close.emit();
    }

    getProfileImageUrl(relativePath: string): string {
        if (!relativePath) return '';
        if (relativePath.startsWith('http')) return relativePath;
        const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        return `http://localhost:8080/${cleanPath}`;
    }

    getInitials(nombre: string, apellido: string): string {
        if (!nombre && !apellido) return '?';
        const first = nombre ? nombre.charAt(0) : '';
        const second = apellido ? apellido.charAt(0) : '';
        return (first + second).toUpperCase();
    }
}
