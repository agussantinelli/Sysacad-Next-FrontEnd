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
    <img src="https://img.shields.io/badge/Angular-18+-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular Badge"/>
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
    <img src="https://img.shields.io/badge/Angular%20Material-19-3f51b5?style=for-the-badge&logo=angular&logoColor=white" alt="Material Badge"/>
    <img src="https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=rxjs&logoColor=white" alt="RxJS Badge"/>
    <img src="https://img.shields.io/badge/Axios-HttpClient-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios Badge"/>
    <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Badge"/>
    <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node Badge"/>
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
    <li><strong>🔒 Seguridad Robusta:</strong> Backend Java con <strong>JWT</strong>. Cliente Frontend con <strong>Axios Interceptors</strong> para inyección automática de tokens y manejo de sesión seguro.</li>
    <li><strong>🧠 Smart Validation:</strong> Reglas de negocio en el cliente para evitar errores de inscripción antes de enviar la solicitud.</li>
</ul>

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
        <tr>
            <td><strong>Gestión de Estado</strong></td>
            <td>RxJS 7.8</td>
        <tr>
            <td><strong>Gestión de Estado</strong></td>
            <td>RxJS 7.8</td>
            <td>Manejo de asincronía y flujos de datos (Observables).</td>
        </tr>
        <tr>
            <td><strong>Cliente HTTP</strong></td>
            <td>Axios</td>
            <td>Cliente ligero con <strong>Interceptores</strong> para inyección de JWT.</td>
        </tr>
        <tr>
            <td><strong>Runtime</strong></td>
            <td>Node.js 18+</td>
            <td>Entorno de ejecución para desarrollo y construcción del proyecto.</td>
        </tr>     
        <tr>
            <td><strong>Iconos</strong></td>
            <td>Material Icons</td>
            <td>Paquete npm <code>material-icons</code>. Iconografía estándar de Google.</td>
        </tr>
        <tr>
            <td><strong>Tipografía</strong></td>
            <td>Questrial</td>
            <td>Google Fonts (vía <code>@fontsource/questrial</code>). Estética moderna y limpia.</td>
        </tr>
    </tbody>
</table>

<hr>
<h3>📦 Estructura del Proyecto</h3>

<pre><code>src/app/
├── core/
│   ├── api/        # Cliente Axios Configurado (Interceptors)
│   ├── models/     # Modelos de datos (Auth, User)
│   └── services/   # Servicios Globales (AuthService, ThemeService)
├── features/
│   ├── auth/
│   │   ├── login/           # Inicio de Sesión (Implementado)
│   │   └── forgot-password/ # Recuperación de Contraseña (Implementado)
│   ├── dashboard/  # Dashboard del Alumno (Implementado)
│   ├── academic/   # (En desarrollo) Notas, Inscripciones
│   └── profile/    # (En desarrollo) Datos personales
├── shared/
│   └── components/
│       ├── alert-message/   # Alertas Flotantes (Success/Error/Info)
│       ├── loading-spinner/ # Indicador de Carga
│       └── theme-toggle/    # Switch Modo Claro/Oscuro
└── layout/
    └── navbar/     # Barra de Navegación Responsive
</code></pre>

<h3>💻 Empezar (Setup Local)</h3>

<p>Este es un proyecto <strong>Angular</strong> inicializado con <code>Angular CLI</code>.</p>

<p>Instalá dependencias y levantá el servidor de desarrollo:</p>

<pre><code>npm install
npm run dev

# Para verificar estilo de código
npm run lint
</code></pre>

<p>Abrí <a href="http://localhost:4200">http://localhost:4200</a> en tu navegador para ver el resultado.</p>

<hr>

<h3>⚙️ Variables de Entorno</h3>

<p>Crea un archivo <code>.env</code> en la raíz del proyecto (basado en <code>.env.example</code>) para tener referencia de la conexión al <a href="https://github.com/agussantinelli/Sysacad-Next-BackEnd">Backend</a>:</p>

<pre><code># URL de la API (Backend Spring Boot)
BACKEND_URL=http://localhost:8081

# URL del Frontend (Angular)
FRONTEND_URL=http://localhost:4200

</code></pre>

<p><strong>Nota:</strong> Angular utiliza <code>src/environments/environment.development.ts</code> para conectar con la API en desarrollo. Asegúrate de que coincida con el puerto del backend:</p>

<pre><code>export const environment = {
  apiUrl: 'http://localhost:8081/api'
};</code></pre>

<hr>

<h2>👥 Roles y Accesos</h2>

<p>La plataforma implementa un estricto control de acceso basado en roles para asegurar la integridad académica.</p>

<ul>
    <li>
        <strong>👮 Administrador (Rol: ADMIN)</strong>
        <ul>
            <li><strong>Gestión Global:</strong> ABM de Alumnos, Profesores y Materias.</li>
            <li><strong>Panel Dedicado:</strong> (En construcción) Acceso a reportes y configuraciones.</li>
        </ul>
    </li>
    <li>
        <strong>👨‍🏫 Profesor (Rol: PROFESOR)</strong>
        <ul>
            <li><strong>Gestión de Cursadas:</strong> Carga de notas mediante Excel (Inteligente).</li>
            <li><strong>Vista Adaptada:</strong> El Dashboard muestra opciones relevantes para la docencia (Título Académico, Cursos).</li>
        </ul>
    </li>
    <li>
        <strong>🎓 Estudiante (Rol: ESTUDIANTE)</strong>
        <ul>
            <li><strong>Dashboard Completo:</strong> Acceso a Inscripciones, Estado Académico y Correlatividades.</li>
            <li><strong>Personalización:</strong> Visualización de carrera y plan de estudios en tiempo real.</li>
        </ul>
    </li>
</ul>

<p><em>Nota: La interfaz (Navbar y Dashboard) renderiza componentes dinámicamente basándose en el rol del usuario logueado.</em></p>

<hr>

<h2>🚀 Roadmap & Futuras Implementaciones</h2>

<ul>
    <li><strong>📧 Notificaciones por Email:</strong>
        <ul>
            <li>Alertas inmediatas al alumno cuando se carga una nueva nota.</li>
            <li>Avisos importantes enviados directamente a la casilla del estudiante.</li>
        </ul>
    </li>
    <li><strong>🤖 Carga Inteligente de Notas (AI + Spring):</strong>
        <ul>
            <li>Permitir a los profesores subir un Excel con notas finales.</li>
            <li><strong>Extractor Excel XML:</strong> Backend en Java Spring procesará el archivo.</li>
            <li><strong>Validación con IA:</strong> Corroboración automática de datos para asegurar consistencia antes de impactar en la base de datos.</li>
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
