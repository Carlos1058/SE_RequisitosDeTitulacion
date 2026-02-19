
# Guía Completa: Desarrollo de Sistemas Expertos en Python (Siguiendo la Lógica de Prolog)

Esta guía detalla qué son los Sistemas Expertos, cómo funcionan, y cómo podemos trasladar la poderosa lógica declarativa de Prolog a un entorno imperativo y orientado a objetos como Python.

## 1. ¿Qué es un Sistema Experto?

Un **Sistema Experto (SE)** es una rama de la Inteligencia Artificial que emula la capacidad de toma de decisiones de un experto humano. A diferencia de un programa convencional que sigue un algoritmo paso a paso, un SE utiliza **conocimiento** y **reglas de inferencia** para resolver problemas complejos.

### Componentes Principales
Un SE se compone típicamente de tres partes fundamentales:

1.  **Base de Conocimiento (Knowledge Base)**: Contiene los hechos (datos sobre el mundo) y las reglas (relaciones lógicas IF-THEN) que domina el experto.
2.  **Motor de Inferencia (Inference Engine)**: El "cerebro" del sistema. Es el mecanismo que aplica las reglas a los hechos conocidos para deducir nuevos hechos o llegar a una conclusión.
3.  **Interfaz de Usuario**: El medio por el cual el usuario interactúa con el sistema, respondiendo preguntas y recibiendo explicaciones.

---

## 2. La Lógica: Prolog vs. Python

Prolog (*Programming in Logic*) es el lenguaje por excelencia para SE debido a su naturaleza declarativa (dices *qué* quieres, no *cómo* hacerlo). Python es imperativo, pero mucho más flexible para integrarse con aplicaciones modernas (Web, APIs, Data Science).

### Traducción de Conceptos

| Concepto en Prolog | Equivalente en Python | Descripción |
| :--- | :--- | :--- |
| **Átomo / Hecho** | String, Boolean, Tupla | Un dato simple (ej. `es_padre(juan, pedro)` -> `("padre", "juan", "pedro")`). |
| **Predicado** | Función / Diccionario | Agrupación de hechos o lógica. |
| **Regla (`:-`)** | Función / Lambda / Clase | Lógica condicional (IF premisa THEN conclusión). |
| **Backtracking** | Recursión / Bucles | Buscar soluciones alternativas si la actual falla. |
| **Unificación** | Comparación (`==`) / Asignación | Verificar si dos términos coinciden. |

---

## 3. Desarrollo Paso a Paso en Python

Para construir un SE en Python que "piense" como Prolog, debemos estructurar nuestro código separando claramente los datos (hechos) de la lógica (reglas).

### Paso 1: Definir la Estructura de Hechos

En lugar de una base de datos compleja, podemos usar un **diccionario** o un **set** en Python para almacenar lo que sabemos.

```python
# Base de hechos inicial (lo que el sistema sabe)
hechos = {
    "tiene_fiebre": True,
    "tiene_tos": True,
    "tiene_manchas": False
}
```

### Paso 2: Implementar las Reglas (La Base de Conocimiento)

En Prolog, una regla se ve así:
`gripe :- tiene_fiebre, tiene_tos.` (Es gripe SI tiene fiebre Y tiene tos).

En Python, podemos modelar esto como una lista de objetos o diccionarios que contienen la **condición** (una función lambda) y la **conclusión**.

```python
rules = [
    {
        "nombre": "Diagnóstico de Gripe",
        # La condición evalúa los hechos y retorna True si se cumplen
        "condicion": lambda facts: facts.get("tiene_fiebre") and facts.get("tiene_tos"),
        "conclusion": "gripe"
    },
    {
        "nombre": "Diagnóstico de Sarampión",
        "condicion": lambda facts: facts.get("tiene_fiebre") and facts.get("tiene_manchas"),
        "conclusion": "sarampion"
    }
]
```

### Paso 3: Construir el Motor de Inferencia

El motor debe recorrer las reglas y verificar cuáles se cumplen basándose en los hechos actuales. Existen dos estrategias principales:

1.  **Encadenamiento hacia adelante (Forward Chaining)**: Partimos de los hechos conocidos y aplicamos reglas para descubrir todo lo posible. (Ideal para diagnósticos a partir de síntomas).
2.  **Encadenamiento hacia atrás (Backward Chaining)**: Partimos de una hipótesis (¿Tiene gripe?) e intentamos verificar si los hechos la soportan. (Estilo clásico de Prolog).

**Ejemplo de Motor de Inferencia Simple (Forward Chaining):**

```python
def motor_de_inferencia(reglas, hechos):
    conclusiones = []
    for regla in reglas:
        # Si la condición de la regla se cumple con los hechos actuales
        if regla["condicion"](hechos):
            conclusiones.append(regla["conclusion"])
    return conclusiones
```

### Paso 4: Interfaz Interactiva

A diferencia de Prolog donde lanzamos consultas (`?- gripe.`), en Python necesitamos preguntar activamente al usuario si no conocemos un hecho.

Podemos mejorar nuestro motor para que, si le falta un dato, pregunte al usuario:

```python
def obtener_hecho(nombre_hecho, hechos_actuales):
    if nombre_hecho in hechos_actuales:
        return hechos_actuales[nombre_hecho]
    
    respuesta = input(f"¿Es verdad que {nombre_hecho}? (s/n): ")
    es_verdad = respuesta.lower() == 's'
    hechos_actuales[nombre_hecho] = es_verdad
    return es_verdad
```

---

## 4. Ejemplo Comparativo Completo

### Escenario: Aprobación de Crédito

**Versión Prolog:**
```prolog
buen_historial(juan).
ingresos_altos(juan).

aprobado(X) :- buen_historial(X), ingresos_altos(X).
```

**Versión Python:**

```python
# 1. Base de Hechos
facts = {"juan_buen_historial": True, "juan_ingresos_altos": True}

# 2. Reglas
def regla_aprobado(persona, facts):
    historial = f"{persona}_buen_historial"
    ingresos = f"{persona}_ingresos_altos"
    return facts.get(historial) and facts.get(ingresos)

# 3. Inferencia
juan_aprobado = regla_aprobado("juan", facts)
print(f"¿Juan aprobado? {juan_aprobado}")
```

## Conclusión

Migrar de Prolog a Python implica cambiar de un paradigma donde el lenguaje "resuelve" la lógica por ti (backtracking automático, unificación) a uno donde **tú construyes** la estructura de control.

Sin embargo, Python ofrece ventajas inmensas:
-   **Legibilidad**: Es más fácil para no-programadores entender una función llamada `es_apto_para_graduarse` que un predicado críptico.
-   **Integración**: Tu sistema experto puede conectarse fácilmente a una base de datos SQL, una API web o una interfaz gráfica moderna (Tkinter, Web), algo muy difícil de hacer en Prolog puro.
