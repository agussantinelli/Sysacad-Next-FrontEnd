import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioResponse, UsuarioRequest } from '@core/models/usuario.models';
import { UsuarioService } from '@core/services/usuario.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-profile.component.html',
    styleUrl: './styles/edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
    private location = inject(Location);
    private usuarioService = inject(UsuarioService);
    private fb = inject(FormBuilder);
    private router = inject(Router);

    usuario: UsuarioResponse | null = null;
    isSaving = false;
    profileForm!: FormGroup;

    ngOnInit(): void {
        this.initForm();
        this.loadUser();
    }

    initForm() {
        this.profileForm = this.fb.group({
            nombre: [{ value: '', disabled: true }, Validators.required],
            apellido: [{ value: '', disabled: true }, Validators.required],
            dni: ['', Validators.required],
            mail: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            telefono: [''],
            direccion: [''],
            ciudad: [''],
            fechaNacimiento: [''],
            genero: ['']
        });
    }

    loadUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                this.usuario = JSON.parse(userStr);
                if (this.usuario) {
                    this.patchFormValues();
                }
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }
    }

    patchFormValues() {
        if (!this.usuario) return;
        this.profileForm.patchValue({
            nombre: this.usuario.nombre,
            apellido: this.usuario.apellido,
            dni: this.usuario.dni,
            mail: this.usuario.mail,
            telefono: this.usuario.telefono,
            direccion: this.usuario.direccion,
            ciudad: this.usuario.ciudad,
            fechaNacimiento: this.usuario.fechaNacimiento,
            genero: this.usuario.genero
        });
    }

    cancel() {
        this.router.navigate(['/profile']);
    }

    saveProfile() {
        if (this.profileForm.invalid || !this.usuario) return;

        this.isSaving = true;
        const formValues = this.profileForm.getRawValue();

        const request: UsuarioRequest = {
            ...formValues
        };

        this.usuarioService.actualizarUsuario(this.usuario.id, request).subscribe({
            next: (updatedUser) => {
                this.usuario = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
                this.isSaving = false;
                this.router.navigate(['/profile']); // Go back to profile view
            },
            error: (err) => {
                console.error('Update failed', err);
                this.isSaving = false;
                // Ideally show a toast
                alert('Error al actualizar el perfil. Por favor intente nuevamente.');
            }
        });
    }
}
