import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileComponent } from './edit-profile.component';
import { UsuarioService } from '@core/services/usuario.service';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('EditProfileComponent', () => {
    let component: EditProfileComponent;
    let fixture: ComponentFixture<EditProfileComponent>;
    let usuarioService: jasmine.SpyObj<UsuarioService>;

    beforeEach(async () => {
        const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['actualizarUsuario']);

        await TestBed.configureTestingModule({
            imports: [EditProfileComponent, NoopAnimationsModule, RouterTestingModule, ReactiveFormsModule],
            providers: [
                { provide: UsuarioService, useValue: usuarioSpy },
                FormBuilder
            ]
        }).compileComponents();

        // Mock localStorage
        const mockUser = { id: '1', nombre: 'Test', apellido: 'User', dni: '123', mail: 'test@example.com' };
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));

        fixture = TestBed.createComponent(EditProfileComponent);
        component = fixture.componentInstance;
        usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
