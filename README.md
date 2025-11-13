# Geinsp - Client Application

## Descripción del Proyecto

Esta es la aplicación cliente para el sistema Geinsp. Proporciona la interfaz de usuario para interactuar con el backend, gestionar inventario, remisiones y otras funcionalidades del sistema.

## Tecnologías Utilizadas

-   **Framework:** ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
-   **Bundler:** ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
-   **Lenguaje:** ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
-   **Enrutamiento:** ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
-   **Gestión de Estado:** ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
-   **Estilos:** ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Instalación

Para instalar las dependencias del proyecto, sigue estos pasos:

1.  Abre una terminal en el directorio `client`.
2.  Ejecuta el siguiente comando para instalar los paquetes necesarios:

    ```bash
    npm install
    ```

## Ejecución

Una vez instaladas las dependencias, puedes ejecutar la aplicación en modo de desarrollo.

1.  Asegúrate de estar en el directorio `client`.
2.  Ejecuta el siguiente comando:

    ```bash
    npm run dev
    ```

    La aplicación se iniciará y estará disponible en `http://localhost:5173` (o el puerto que Vite asigne si el 5173 está en uso).

## Configuración

La configuración de la aplicación se gestiona a través de variables de entorno.

1.  Crea un archivo `.env` en la raíz del directorio `client` (puedes copiar el archivo `.env.example` si existe).
2.  Define las variables de entorno necesarias en el archivo `.env`. La variable más importante es la URL del backend:

    ```
    VITE_API_URL=http://localhost:3000/api
    ```

    Asegúrate de que el valor de `VITE_API_URL` apunte a la URL correcta donde se está ejecutando el backend.

---

## Información de la Plantilla (Vite + React)

Este template proporciona una configuración mínima para que React funcione en Vite con HMR y algunas reglas de ESLint.

Actualmente, hay dos plugins oficiales disponibles:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) utiliza [Babel](https://babeljs.io/) para Fast Refresh.
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) utiliza [SWC](https://swc.rs/) para Fast Refresh.

### Expandiendo la Configuración de ESLint

Si estás desarrollando una aplicación de producción, se recomienda actualizar la configuración para habilitar reglas de linting conscientes del tipo:

```javascript
// eslint.config.js
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    // Remueve ...tseslint.configs.recommended y reemplázalo con esto
    ...tseslint.configs.recommendedTypeChecked,
    // Alternativamente, usa esto para reglas más estrictas
    ...tseslint.configs.strictTypeChecked,
    // Opcionalmente, añade esto para reglas de estilo
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // otras opciones...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

También puedes instalar [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) y [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) para reglas de linting específicas de React:

```javascript
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  plugins: {
    // Añade los plugins react-x y react-dom
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // otras reglas...
    // Habilita sus reglas recomendadas para typescript
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
