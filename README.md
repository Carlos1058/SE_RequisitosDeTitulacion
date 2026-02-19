# Sistema Experto de Requisitos de Titulación

## Universidad Autónoma de Aguascalientes (UAA)

![UAA Logo](https://www.uaa.mx/portal/wp-content/uploads/2019/07/logo_uaa.png)

### 📘 Materia: Sistemas Expertos Probabilísticos

**Proyecto: Sistema Experto Basado en Reglas (Python + React)**

---

## 🧐 ¿Qué hace este proyecto?

Este sistema es una herramienta inteligente diseñada para **validar automáticamente si un estudiante de pregrado cumple con los requisitos necesarios para titularse**.

A diferencia de un simple checklist, el sistema utiliza un **Motor de Inferencia** basado en reglas lógicas (simulando el comportamiento de Prolog pero en Python) para evaluar la situación académica del estudiante y ofrecer un diagnóstico preciso.

### Características Principales:

* **Diagnóstico Instantáneo**: Analiza créditos, servicio social, prácticas, idioma y adeudos.
* **Explicabilidad**: Si no cumples, el sistema te dice *exactamente por qué* (qué regla falló).
* **Interfaz Moderna**: Una UI web "Glassmorphism" desarrollada en React.

---

## 🧠 Base de Conocimiento (Knowledge Base)

La lógica del sistema fue extraída directamente del documento oficial:
📄 **"Informe Completos: Requisitos y Procesos de Titulación en la UAA (Actualizado a 2026)"**

### Reglas Implementadas (Pregrado):

1. **Acreditación Académica**: 100% de los créditos del plan de estudios aprobados.
2. **Servicio Social**: 500 horas liberadas (mínimo 6 meses).
3. **Prácticas Profesionales**: Mínimo 240 horas liberadas.
4. **Formación Humanista**: Créditos obligatorios cubiertos.
5. **Segundo Idioma**: Nivel acreditado según la carrera.
6. **Examen de Egreso (EGEL/EXANI)**: Presentación obligatoria.
7. **No Adeudos**: Sin deudas en Biblioteca, Laboratorios o Colegiatura.
8. **Pago de Derechos**: Cuota de titulación cubierta.

---

## 💻 Arquitectura Técnica

El proyecto sigue una arquitectura Cliente-Servidor moderna:

### 1. Backend (Python + Flask)

Es el "cerebro" del sistema. Expone una API REST que recibe los datos del formulario y los procesa con el motor de inferencia.

* **`knowledge_base.py`**:
  * Contiene la función `get_rules()`, que define la lista de reglas como objetos diccionarios. Cada regla tiene una función lambda `valid` que evalúa un hecho específico.
  * Ejemplo: `lambda facts: facts['credits'] >= 100`.
* **`inference_engine.py`**:
  * Implementa el **Encadenamiento Hacia Adelante (Forward Chaining)**.
  * Recorre todas las reglas y verifica si los hechos proporcionados las satisfacen.
  * Retorna una lista de reglas fallidas para explicar el resultado al usuario.
* **`app.py`**:
  * Servidor Flask que conecta el frontend con el motor de inferencia.
  * Endpoint `/api/evaluate`: Recibe JSON, ejecuta el motor y devuelve JSON.

### 2. Frontend (React + Vite)

La cara del sistema.

* Framework: **React** (creado con Vite).
* Estilo: **CSS Puro** con diseño "Universo" (Fondo oscuro, estrellas animadas, tarjetas de vidrio).
* Comunicación: Usa `fetch` para enviar las respuestas al backend de Python.

---

## 🚀 Instrucciones de Ejecución

Para correr el sistema completo, necesitas dos terminales abiertas al mismo tiempo.

### Paso 1: Iniciar el Backend (API)

En la carpeta raíz del proyecto:

```bash
# 1. Instalar dependencias (si no lo has hecho)
pip install flask flask-cors

# 2. Correr el servidor
python3 app.py
```

> El servidor iniciará en: `http://127.0.0.1:5001`

### Paso 2: Iniciar el Frontend (Web)

En una **segunda terminal**, entra a la carpeta `frontend`:

```bash
cd frontend

# 1. Instalar dependencias de Node
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

> La web estará disponible en: `http://localhost:5173`

### Paso 3: Usar el Sistema

Abre tu navegador en **http://localhost:5173** y realiza tu diagnóstico.

---

## 🧪 Ejecución de Pruebas (Testing)

El proyecto incluye pruebas unitarias para asegurar que el motor de inferencia respeta las reglas de la UAA.

Para correr las pruebas:

```bash
python3 test_expert_system.py
```

**Escenarios probados:**

* ✅ Estudiante que cumple todo.
* ❌ Estudiante sin Servicio Social.
* ❌ Estudiante con Adeudos.
* ❌ Estudiante con múltiples faltas.
