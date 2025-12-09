# Transaction Validator - CI/CD Simulado

Este proyecto incluye:
- Microservicio Express con `/health` y `/validate`.
- Pruebas automatizadas con Jest y Supertest.
- Empaquetado Docker.
- Despliegue automatizado a un entorno simulado de producción usando Docker Compose dentro del pipeline.

## Uso
- Instala dependencias: `npm install`.
- Ejecuta pruebas: `npm test`.
- Levanta local: `npm start` y abre `http://localhost:8080/health`.

## Pipeline CI/CD
- Workflow en `.github/workflows/ci-cd.yml` ejecuta en cada push a `main`:
  - Construcción del artefacto Docker.
  - Pruebas automatizadas.
  - Empaquetado (imagen Docker y artifact `.tar`).
  - Despliegue simulado con Docker Compose, verificación de salud y smoke test.