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
    <img src="https://img.shields.io/badge/Ngx%20Charts-Visualization-AA2B68?style=for-the-badge&logo=googleanalytics&logoColor=white" alt="NgxCharts Badge"/>
    <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Badge"/>
    <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node Badge"/>
</div>

<div align="center">
    <a href="https://drive.google.com/drive/folders/1Yoln2wLucIvrbcWCbQ_bY-hZ4Z1ENIdD" target="_blank">
        <img src="https://img.shields.io/badge/📂%20Documentación%20del%20Proyecto-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Docs Badge"/>
    </a>
</div>
<div align="center">
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT"/>
    </a>
</div>
<hr>

<h2>🎯 El Desafío (Legacy vs. Next)</h2>

<ul>
    <li><strong>Lentitud crítica:</strong> Colapsos sistémicos en periodos de alta demanda, especialmente durante las fechas de inscripción.</li>
    <li><strong>UX obsoleta:</strong> Interfaces rígidas no optimizadas para el uso cotidiano en dispositivos móviles.</li>
    <li><strong>Fragmentación:</strong> Dispersión de la información académica que dificulta el seguimiento real del progreso del alumno.</li>
    <li><strong>Inestabilidad del Servidor:</strong> Caídas constantes que interrumpen procesos vitales, generando un clima de frustración constante.</li>
    <li><strong>Malestar Estudiantil:</strong> Las fallas recurrentes provocan quejas legítimas de los alumnos y del Centro de Estudiantes, derivando en un descontento generalizado hacia la institución.</li>
    <li><strong>Burocracia Estatal:</strong> El sistema actual se ha convertido en el símbolo de una burocracia absurda y lenta que prioriza el trámite sobre el aprendizaje.</li>
</ul>

<p>Esta reingeniería transforma radicalmente esa experiencia, proponiendo una plataforma <strong>reactiva, SPA y centrada en el usuario</strong> que elimina la fricción burocrática y agiliza la vida universitaria.</p>


<h2>🚀 Propuesta de Valor</h2>

<ul>
    <li><strong>📱 Mobile First:</strong> Diseño 100% responsivo para gestionar la vida académica desde cualquier dispositivo.</li>
    <li><strong>⚡ Performance Superior:</strong> SPA (Single Page Application) fluida con carga de componentes bajo demanda (Lazy Loading).</li>
    <li><strong>🔒 Seguridad Avanzada:</strong>
        <ul>
            <li>Autenticación robusta con <strong>JWT</strong>.</li>
            <li><strong>Boot-Id Validation:</strong> Mecanismo de seguridad en Axios Interceptors que detecta reinicios del servidor o inconsistencias de sesión, forzando un logout seguro para proteger los datos.</li>
        </ul>
    </li>
    <li><strong>🧠 Smart Inscription:</strong> Validaciones preventivas de correlatividades y requisitos en el cliente para reducir errores antes de impactar el backend.</li>
    <li><strong>🔔 Sistema de Alertas Global:</strong> Servicio centralizado (`AlertService`) que garantiza feedback consistente y visualmente premium en toda la App.</li>
    <li><strong>📋 Gestión en Tiempo Real:</strong> Seguimiento activo de inscripciones, estado académico y visualización de notas con actualizaciones inmediatas.</li>
    <li><strong>📄 Trámites 24/7:</strong> Emisión de Certificado de Alumno Regular en PDF con un solo clic.</li>
</ul>

<hr>

<h2>🏗️ Arquitectura de Alto Nivel</h2>

<p>La aplicación sigue una arquitectura en capas separando presentación, lógica de negocio y acceso a datos:</p>

<table>
    <thead>
        <tr>
            <th>Capa</th>
            <th>Propósito</th>
            <th>Componentes Clave</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Application Shell</strong></td>
            <td>Bootstrapping y configuración raíz</td>
            <td><code>index.html</code>, <code>main.ts</code>, <code>app.routes.ts</code></td>
        </tr>
        <tr>
            <td><strong>Feature Modules</strong></td>
            <td>Funcionalidad de usuario por dominio</td>
            <td><code>auth/</code>, <code>dashboard/</code>, <code>profile/</code>, <code>student/</code></td>
        </tr>
        <tr>
            <td><strong>Layout</strong></td>
            <td>Estructura y navegación persistente</td>
            <td><code>navbar.component.ts</code></td>
        </tr>
        <tr>
            <td><strong>Core Layer</strong></td>
            <td>Lógica de negocio, API y Modelos</td>
            <td><code>axiosClient.ts</code>, servicios, DTOs</td>
        </tr>
        <tr>
            <td><strong>Shared Components</strong></td>
            <td>UI Reutilizable</td>
            <td>Tablas, Alertas, Modales, Spinner</td>
        </tr>
        <tr>
            <td><strong>Theming System</strong></td>
            <td>Consistencia visual y Dark Mode</td>
            <td><code>theme.service.ts</code>, <code>globals.css</code></td>
        </tr>
    </tbody>
</table>

<hr>

<h2>🧩 Patrones de Arquitectura Core</h2>

<h3>1. Arquitectura de Componentes Standalone</h3>
<p>La aplicación utiliza el patrón de componentes standalone de Angular, eliminando la necesidad de NgModules. Cada componente declara sus propias dependencias directamente.</p>
<ul>
    <li><strong>Beneficios:</strong> Menor tamaño de bundle (tree-shaking), gestión de dependencias simple y mejor organización.</li>
</ul>

<h3>2. Role-Based Access Control (RBAC)</h3>
<p>El sistema implementa tres roles de usuario distintos con capacidades diferenciadas:</p>
<ul>
    <li><strong>ESTUDIANTE:</strong> Inscripciones, consultas académicas, correlativas.</li>
    <li><strong>PROFESOR:</strong> Gestión de materias, carga de notas, mesas de examen.</li>
    <li><strong>ADMIN:</strong> Administración total del sistema y usuarios.</li>
</ul>

<h3>3. Flujo de Autenticación JWT</h3>
<p>La autenticación se maneja mediante tokens JWT con inyección automática vía <strong>Axios Interceptors</strong> (`axiosClient.ts`). El estado de autenticación se gestiona reactivamente con `BehaviorSubject` en `auth.service.ts`.</p>

<h3>4. Estrategia de Lazy Loading</h3>
<p>Todas las rutas de características (features) utilizan `loadComponent` para optimizar la carga inicial, descargando el código solo cuando el usuario navega a la ruta concerniente.</p>

<h3>5. Clean Code & Standalone Philosophy</h3>
<p>El proyecto ha sido refactorizado para seguir una arquitectura limpia y moderna:</p>
<ul>
    <li><strong>Sin Comentarios:</strong> El código está diseñado para ser auto-explicativo mediante nombres claros de variables y funciones, eliminando comentarios innecesarios para un mantenimiento más ágil.</li>
    <li><strong>Standalone Components:</strong> Uso nativo de componentes sin módulos para reducir el acoplamiento y mejorar el tree-shaking.</li>
</ul>

<hr>

<h2>🎨 Sistema de Temas (Theming)</h2>
<p>La aplicación implementa un sistema de temas global que soporta modos Claro y Oscuro.</p>
<ul>
    <li>Utiliza <strong>Angular Signals</strong> en `ThemeService` para gestionar el estado.</li>
    <li>La preferencia se persiste en <code>localStorage</code>.</li>
    <li>Uso de <strong>Variables CSS</strong> en `globals.css` para tokens de color tipados.</li>
</ul>

<hr>

<h2>🔌 Integración Backend</h2>
<p>El frontend se comunica con el backend Java Spring Boot a través de una API RESTful.</p>

<table>
    <thead>
        <tr>
            <th>Componente</th>
            <th>Tecnología</th>
            <th>Puerto Dev</th>
            <th>Propósito</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Frontend</strong></td>
            <td>Angular 18+ SPA</td>
            <td>4200</td>
            <td>Interfaz de usuario y lógica cliente</td>
        </tr>
        <tr>
            <td><strong>Backend</strong></td>
            <td>Java Spring Boot</td>
            <td>8080</td>
            <td>Lógica de negocio, persistencia, JWT</td>
        </tr>
    </tbody>
</table>
<p>Repositorio Backend: <a href="https://github.com/agussantinelli/Sysacad-Next-BackEnd">Sysacad-Next-BackEnd</a></p>

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
            <td>Angular 19.2.18</td>
            <td>Uso de Standalone Components, Signals y Control Flow Syntax.</td>
        </tr>
        <tr>
            <td><strong>Lenguaje</strong></td>
            <td>TypeScript 5.5.2</td>
            <td>Tipado estricto, Interfaces y DTOs alineados con Backend Java.</td>
        </tr>
        <tr>
            <td><strong>UI Kit</strong></td>
            <td>Angular Material 19.0.0</td>
            <td>Librería oficial. Componentes accesibles (Tablas, Cards, Datepickers).</td>
        </tr>
        <tr>
            <td><strong>Gestión de Estado</strong></td>
            <td>RxJS 7.8.0</td>
            <td>Manejo de asincronía y flujos de datos (Observables).</td>
        </tr>
        <tr>
            <td><strong>Cliente HTTP</strong></td>
            <td>Axios 1.13.2</td>
            <td>Cliente ligero con <strong>Interceptores</strong> para inyección de JWT.</td>
        </tr>
        <tr>
            <td><strong>Runtime</strong></td>
            <td>Node.js 18+</td>
            <td>Entorno de ejecución para desarrollo y construcción del proyecto.</td>
        </tr>     
        <tr>
            <td><strong>Iconos</strong></td>
            <td>Material Icons 1.13.14</td>
            <td>Paquete npm <code>material-icons</code>. Iconografía estándar de Google.</td>
        </tr>
        <tr>
            <td><strong>Tipografía</strong></td>
            <td>Questrial 5.2.8</td>
            <td>Google Fonts (vía <code>@fontsource/questrial</code>). Estética moderna y limpia.</td>
        </tr>
        <tr>
            <td><strong>Gráficos</strong></td>
            <td>Ngx-Charts ^23.1.0</td>
            <td>Visualización de datos (SVGs). Gráficos de torta y barras.</td>
        </tr>
    </tbody>
</table>

<hr>
<h3>📦 Estructura del Proyecto</h3>

<pre><code>Sysacad-Next-FrontEnd/
├── public/                                           # Assets estáticos servidos directamente
├── src/                                              # Código fuente de la aplicación
│   ├── app/
│   │   ├── core/
│   │   │   ├── api/                                  # Cliente Axios Configurado
│   │   │   ├── enums/                                # Enumerados (Materia, Inscripcion, Usuario...)
│   │   │   ├── guards/                               # Guardias de Ruta (AuthGuard)
│   │   │   ├── interceptors/                         # Interceptores HTTP (JWT Injection)
│   │   │   ├── models/                               # Modelos DTO
│   │   │   └── services/                             # Servicios de Entidades
│   │   ├── features/
│   │   │   ├── admin/                                # Módulo de Administración
│   │   │   │   ├── careers/                          # Gestión de Carreras
│   │   │   │   ├── commissions/                      # Gestión de Comisiones
│   │   │   │   ├── enroll-student/                   # Matriculación de Alumnos
│   │   │   │   ├── exam-tables/                      # Gestión de Mesas de Examen
│   │   │   │   ├── inscriptions/                     # Inscripciones y Matrículas
│   │   │   │   ├── plan-detail/                      # Detalle de Planes de Estudio
│   │   │   │   ├── reports/                          # Reportes Administrativos
│   │   │   │   ├── statistics/                       # Estadísticas Globales
│   │   │   │   ├── universities/                     # Gestión de Universidades
│   │   │   │   ├── user-profile/                     # Perfil de Usuario (Admin)
│   │   │   │   └── users/                            # Gestión de Usuarios
│   │   │   ├── announcements/                        # Avisos y Anuncios
│   │   │   ├── auth/                                 # Autenticación (Login)
│   │   │   ├── dashboard/                            # Dashboard (Role-Based)
│   │   │   ├── messages/                             # Sistema de Mensajería
│   │   │   ├── professor/                            # Módulo de Profesores
│   │   │   │   ├── exam-details/                     # Detalle de Mesa
│   │   │   │   ├── exam-statistics/                  # Estadísticas de Examen
│   │   │   │   ├── exams/                            # Listado de Mesas
│   │   │   │   ├── grade-commission/                 # Calificar Comisión
│   │   │   │   ├── grade-exam/                       # Carga de Notas de Examen
│   │   │   │   ├── my-commissions/                   # Mis Comisiones
│   │   │   │   ├── professor-cert/                   # Certificado de Servicios
│   │   │   │   ├── subject-commissions/              # Comisiones por Materia
│   │   │   │   └── subjects/                         # Mis Materias
│   │   │   ├── profile/                              # Perfil de Usuario
│   │   │   └── student/                              # Módulo de Estudiantes
│   │   │       ├── academic-status/                  # Estado Académico
│   │   │       ├── calendar/                         # Calendario
│   │   │       ├── current-enrollments/              # Cursado Actual
│   │   │       ├── inscription-course/               # Inscripción Cursado
│   │   │       ├── inscription-exam/                 # Inscripción Examen
│   │   │       ├── my-inscriptions/                  # Mis Inscripciones
│   │   │       ├── regular-cert/                     # Certificado Regular
│   │   │       └── study-plan/                       # Plan de Estudios
│   │   ├── layout/
│   │   │   └── navbar/                               # Barra de Navegación
│   │   ├── shared/
│   │   │   ├── components/                           # Reutilizables (Table, Spinner, Alert...)
│   │   │   ├── interfaces/                           # Interfaces UI
│   │   │   └── pipes/                                # Pipes Custom
│   ├── environments/                                 # Configuración de entorno
│   ├── globals.css                                   # Estilos globales y temas
│   ├── index.html                                    # Entry Point HTML
│   ├── main.ts                                       # Entry Point TS
│   └── styles.css                                    # Estilos de Material
├── .env                                              # Variables local
├── angular.json                                      # Config Angular
├── package.json                                      # Dependencias
└── README.md                                         # Documentación
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
BACKEND_URL=http://localhost:8080

# URL del Frontend (Angular)
FRONTEND_URL=http://localhost:4200
</code></pre>

> [!NOTE]
> **Gestión de Entornos:** Aunque se incluye un `.env` para referencia, Angular utiliza `src/environments/environment.development.ts` para conectar con la API en tiempo de desarrollo.

```typescript
export const environment = {
  apiUrl: 'http://localhost:8080/api'
};
```

<hr>

<h2>👥 Roles y Accesos</h2>

<p>La plataforma implementa un estricto control de acceso basado en roles para asegurar la integridad académica y la segregación de funciones.</p>

<ul>
    <li>
        <strong>👮 Administrador (Rol: ADMIN)</strong>
        <p>Acceso total al sistema para la gestión académica e institucional.</p>
        <ul>
            <li><strong>Administración Académica:</strong> Gestión ABM de Carreras, Facultades, Planes de Estudio, Materias, Horarios y Salones.</li>
            <li><strong>Gestión Institucional:</strong> Administración de Usuarios (Alumnos, Profesores), Inscripciones y Matriculación.</li>
            <li><strong>Gestión de Exámenes:</strong> Configuración de Mesas de Examen, turnos y generación de Actas Volantes.</li>
            <li><strong>Trámites y Comunicación:</strong> Gestión de Solicitudes de Certificados, publicación de Avisos y Calendario Académico.</li>
        </ul>
    </li>
    <li>
        <strong>👨‍🏫 Profesor (Rol: PROFESOR)</strong>
        <p>Herramientas optimizadas para la docencia y evaluación.</p>
        <ul>
            <li><strong>Gestión Académica:</strong> Visualización de "Mis Materias" y "Mis Comisiones" (Globales y por Materia).</li>
            <li><strong>Exámenes:</strong> Acceso a Mesas de Examen asignadas, carga de notas y firma de Actas Volantes.</li>
            <li><strong>Estadísticas:</strong> Visualización de reportes de rendimiento por examen.</li>
            <li><strong>Certificaciones:</strong> Descarga de Certificado de Servicios Docentes.</li>
        </ul>
    </li>
    <li>
        <strong>🎓 Estudiante (Rol: ESTUDIANTE)</strong>
        <p>Portal de autogestión centralizado para la vida universitaria.</p>
        <ul>
            <li><strong>Inscripciones:</strong> Inscripción ágil a Cursado de materias y Mesas de Examen final.</li>
            <li><strong>Consultas Académicas:</strong> Estado Académico (Analítico), Plan de Estudios interactivo y Cursada actual.</li>
            <li><strong>Correlatividades:</strong> Verificación visual de materias habilitadas para cursar o rendir.</li>
            <li><strong>Trámites:</strong> Solicitud y descarga inmediata de Certificado de Alumno Regular en PDF.</li>
        </ul>
    </li>
</ul>

### 👑 Poderes del Jefe de Cátedra
El **Jefe de Cátedra** tiene permisos extendidos sobre las materias que lidera:
- Puede ver **todas las comisiones** de la materia, no solo aquellas donde dicta clases.
- Puede cargar notas y gestionar exámenes para **cualquier comisión** de dicha materia.
- En los listados, se le muestra la información completa de todos los profesores y alumnos de la cátedra.
- **Mensajería**: Tiene permiso para enviar mensajes a los grupos de **cualquier comisión** de su materia, sin necesidad de estar asignado como docente frente a curso.

<p><em>Nota: La interfaz (Navbar y Dashboard) renderiza componentes dinámicamente basándose en el rol del usuario logueado.</em></p>

### 📊 Estado de Implementación por Rol

| Área / Funcionalidad | Estudiante | Profesor | Admin |
| :--- | :---: | :---: | :---: |
| **Core & Acceso** | | | |
| Login / Logout / Password Recovery | ✅ | ✅ | ✅ |
| Dashboard / Perfil de Usuario | ✅ | ✅ | ✅ |
| **Gestión Académica (Alumno)** | | | |
| Inscripciones (Cursado y Examen) | ✅ | ❌ | ✅ |
| Estado Académico (Analítico/Plan) | ✅ | ❌ | ✅ |
| Mis Inscripciones (Gestión Activa) | ✅ | ❌ | ✅ |
| Cursado actual y Notas | ✅ | ❌ | ❌ |
| **Módulo Docente (Profesor)** | | | |
| Mis Materias y Comisiones | ❌ | ✅ | ✅ |
| Carga de Notas y Calificaciones | ❌ | ✅ | ❌ |
| Mesas de Examen Asignadas | ❌ | ✅ | ✅ |
| Estadísticas de Exámenes | ❌ | ✅ | ✅ |
| **Administración (Institucional)** | | | |
| Carreras / Facultades / Universidades | ❌ | ❌ | ✅ |
| Planes de Estudio y Materias | ❌ | ❌ | ✅ |
| Gestión de Usuarios (ABM) | ❌ | ❌ | ✅ |
| Gestión de Inscripciones y Matrículas | ❌ | ❌ | ✅ |
| Mesas de Examen y Actas Volantes | ❌ | ❌ | ✅ |
| **Trámites y Certificados** | | | |
| Certificado de Alumno Regular | ✅ | ❌ | ❌ |
| Certificado de Servicios (Docente) | ❌ | ✅ | ❌ |
| Gestión de Solicitudes (Admin) | ❌ | ❌ | ✅ |
| **Comunicación & Entorno** | | | |
| Sistema de Avisos y Anuncios | ✅ | ✅ | ✅ |
| Mensajería Interna (Chat) | ✅ | ✅ | ✅ |
| Calendario Académico | ✅ | ✅ | ✅ |

<hr>


<h2>🤝 Contribuciones</h2>

<p>Este proyecto es parte de la iniciativa de modernización universitaria. Si encuentras un bug o tienes una idea:</p>
<ol>
    <li>Abre un <strong>Issue</strong> describiendo el caso.</li>
    <li>Haz un Fork y envía tu <strong>Pull Request</strong> a la rama `develop`.</li>
</ol>
<hr>

<h2 align="left">⚖️ Licencia</h2>

<p align="left">
  Este proyecto está bajo la <b>Licencia MIT</b>. Para más detalles, puedes consultar el archivo 
  <a href="LICENSE"><code>LICENSE</code></a> incluido en la raíz de este repositorio.
</p>

<p align="left">
  <i>
    La licencia MIT permite el uso, copia, modificación y distribución del software de forma gratuita, 
    siempre que se incluya el aviso de copyright original.
  </i>
</p>
<hr>
<p align="center">Desarrollado con ❤️ y mucho 🧉 para la comunidad académica.</p>
