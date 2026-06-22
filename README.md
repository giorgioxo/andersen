# Andersen

Angular and Nx based application for authentication, Todo management, activity history, localization, and accessibility.

The project consists of a Shell application and independently developed Login, Todo, and History applications. The Shell is the main entry point and manages application routing and shared state.

## Install Dependencies

```bash
npm install
```

## Run The Project

```bash
npx nx serve shell
```

Open the application at:

```text
http://localhost:8002
```

## Run Lint

```bash
npx nx run-many --target=lint --all
```

## Run Tests

```bash
npx nx run-many --target=test --all
```
