<h1 align="center">🎓 Sysacad Next - Frontend</h1>

<div align="center">
    <a href="https://github.com/agussantinelli/Sysacad-Next-FrontEnd" target="_blank">
        <img src="https://img.shields.io/badge/🚀%20Repo%20Frontend%20(Estás%20Aquí)-Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Frontend Repo Badge"/>
    </a>
    <a href="https://github.com/agussantinelli/Sysacad-Next-BackEnd" target="_blank">
        <img src="https://img.shields.io/badge/⚙️%20Repo%20Backend-Java%20Spring-F80000?style=for-the-badge&logo=spring&logoColor=white" alt="Backend Repo Badge"/>
    </a>
    <a href="https://github.com/agussantinelli" target="_blank">
        <img src="https://img.shields.io/badge/👤%20Contacto-agussantinelli-000000?style=for-the-badge&logo=github&logoColor=white" alt="Contact Badge"/>
    </a>
</div>

<div align="center">
    <img src="https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular Badge"/>
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
</div>

<div align="center">
    <a href="https://drive.google.com/drive/folders/1Yoln2wLucIvrbcWCbQ_bY-hZ4Z1ENIdD" target="_blank">
        <img src="https://img.shields.io/badge/📂%20Documentación%20del%20Proyecto-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Docs Badge"/>
    </a>
</div>

<hr>

<h2>🎯 Objetivo</h2>

<p>Reemplazar el sistema de autogestión heredado ("Legacy") con una solución moderna, rápida y centrada en la experiencia del alumno, eliminando la fricción burocrática mediante una interfaz reactiva e intuitiva.</p>

<h2>🧭 Visión General</h2>

<p><strong>Sysacad Next</strong> es la evolución de la plataforma universitaria. Mientras la versión anterior se centraba en formularios estáticos, esta reingeniería propone:</p>
<ul>
    <li>Inscripciones en tiempo real con validación inmediata de correlatividades.</li>
    <li>Visualización gráfica del avance de carrera (Plan de Estudios Interactivo).</li>
    <li>Notificaciones instantáneas sobre estados de mesas de examen y trámites.</li>
    <li>Arquitectura desacoplada (Angular + Java) para mayor escalabilidad.</li>
</ul>

<h2>💼 Problema (Legacy)</h2>

<p>El sistema actual presenta:</p>
<ul>
    <li><strong>Lentitud crítica</strong> durante los periodos de inscripción masiva.</li>
    <li><strong>UX obsoleta</strong> no adaptada a dispositivos móviles.</li>
    <li>Dificultad para obtener un estado académico consolidado sin navegar múltiples menús.</li>
</ul>

<h2>🚀 Propuesta de Valor</h2>

<ul>
    <li><strong>📱 Mobile First:</strong> Diseño 100% responsivo para gestionar la vida académica desde el celular.</li>
    <li><strong>⚡ Performance:</strong> Carga de datos optimizada y navegación SPA (Single Page Application) sin recargas.</li>
    <li><strong>🔒 Seguridad Robusta:</strong> Integración con Backend Java mediante JWT y protección de rutas por roles (Alumno/Admin).</li>
    <li><strong>🧠 Smart Validation:</strong> Reglas de negocio en el cliente para evitar errores de inscripción antes de enviar la solicitud.</li>
</ul>

<hr>

<h2>🌐 Frontend (este repositorio)</h2>

<p>Este repositorio aloja la <strong>Single Page Application (SPA)</strong> desarrollada en Angular, encargada de toda la interacción con el usuario final.</p>

<h3>⚙️ Stack Tecnológico</h3>

<table>
    <thead>
        <tr>
            <th>Componente</th>
            <th>Tecnología</th>
            <th>Notas</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Framework</strong></td>
            <td>Angular 18+</td>
            <td>Uso de Standalone Components, Signals y Control Flow Syntax.</td>
        </tr>
        <tr>
            <td><strong>Lenguaje</strong></td>
            <td>TypeScript 5</td>
            <td>Tipado estricto, Interfaces y DTOs alineados con Backend Java.</td>
        </tr>
        <tr>
            <td><strong>UI Kit</strong></td>
            <td>Angular Material</td>
            <td>Librería oficial. Componentes accesibles (Tablas, Cards, Datepickers).</td>
        </tr>
    </tbody>
</table>

<h3>🏗️ Arquitectura de Capas Propuesta</h3>

<p>Organizamos el código verticalmente por <strong>Features</strong> (funcionalidad de negocio) en lugar de horizontalmente por tipo de archivo, favoreciendo la escalabilidad.</p>

<pre><code>src/app/
├── core/
│   ├── models/     # Modelos de datos (Auth, User)
│   └── services/   # Servicios Globales (AuthService, ThemeService)
├── features/
│   ├── auth/
│   │   └── login/  # Pantalla de Inicio de Sesión
│   ├── dashboard/  # (En desarrollo) Resumen del alumno
│   ├── academic/   # (En desarrollo) Notas, Inscripciones
│   └── profile/    # (En desarrollo) Datos personales
├── shared/
│   └── components/ # UI Reutilizable (ThemeToggle)
└── layout/         # (En desarrollo) Estructura base
</code></pre>

<h3>💻 Setup Local</h3>

<p>Requisitos: Node.js 18+ y Angular CLI.</p>

<pre><code># 1. Instalar dependencias
npm install

# 2. Configurar Variables de Entorno
# Copiar el archivo de ejemplo
# cp .env.example .env

# Configurar las URLs en .env (Referencia)
# BACKEND_URL=http://localhost:8081
# FRONTEND_URL=http://localhost:4200

# IMPORTANTE: Asegurarse de que 'src/environments/environment.development.ts' coincida con el puerto del Backend:
# export const environment = { apiUrl: 'http://localhost:8081/api' };

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Acceder
# Abre http://localhost:4200
</code></pre>

<h3>🛠️ Scripts y Comandos</h3>

<p>Los siguientes scripts están disponibles en <code>package.json</code>:</p>

<table>
    <thead>
        <tr>
            <th>Comando</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>npm run dev</code></td>
            <td>Inicia el servidor de desarrollo (alias de <code>ng serve</code>, igual que <code>start</code>).</td>
        </tr>
        <tr>
            <td><code>npm start</code></td>
            <td>Inicia el servidor de desarrollo (alias de <code>ng serve</code>).</td>
        </tr>
        <tr>
            <td><code>npm run build</code></td>
            <td>Compila la aplicación para producción en la carpeta <code>dist/</code>.</td>
        </tr>
        <tr>
            <td><code>npm run watch</code></td>
            <td>Modo de desarrollo con recarga en caliente y configuración de watch.</td>
        </tr>
        <tr>
            <td><code>npm test</code></td>
            <td>Ejecuta las pruebas unitarias con Karma/Jasmine.</td>
        </tr>
    </tbody>
</table>

<hr>

<h2>👥 Roles y Accesos</h2>

<p>La plataforma implementa un estricto control de acceso basado en roles para asegurar la integridad académica.</p>

<ul>
    <li>
        <strong>👮 Administrador</strong>
        <ul>
            <li><strong>Gestión Global:</strong> ABM de Alumnos, Profesores y Materias.</li>
            <li><strong>Calendario Académico:</strong> Configuración de turnos de examen y fechas de inscripción.</li>
            <li><strong>Planes de Estudio:</strong> Definición de correlatividades y currículas.</li>
            <li>Auditoría y reportes gerenciales.</li>
        </ul>
    </li>
    <li>
        <strong>👨‍🏫 Profesor</strong>
        <ul>
            <li>Gestión de comisiones y visualización de inscriptos.</li>
            <li><strong>Carga de Notas:</strong> Regularidades y cierre de Actas de Examen.</li>
            <li>Toma de asistencia.</li>
            <li>Comunicación directa con sus alumnos.</li>
        </ul>
    </li>
    <li>
        <strong>🎓 Alumno</strong>
        <ul>
            <li><strong>Inscripciones:</strong> Alta y baja en Cursado y Mesas Finales.</li>
            <li><strong>Autogestión:</strong> Consulta de Historia Académica (Analítico) y estado de situación.</li>
            <li>Solicitud de constancias (Alumno Regular, Examen).</li>
        </ul>
    </li>
</ul>

<hr>

<h2>🤝 Contribuciones</h2>

<p>Este proyecto es parte de la iniciativa de modernización universitaria. Si encuentras un bug o tienes una idea:</p>
<ol>
    <li>Abre un <strong>Issue</strong> describiendo el caso.</li>
    <li>Haz un Fork y envía tu <strong>Pull Request</strong> a la rama `develop`.</li>
</ol>

<p align="center">Desarrollado con ❤️ y mucho ☕ para la comunidad académica.</p>
