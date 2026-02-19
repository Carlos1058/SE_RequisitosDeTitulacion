
# knowledge_base.py
# -----------------------------------------------------------------------------------------
# Módulo de Base de Conocimiento
# Este archivo actúa como el repositorio central de reglas y hechos del Sistema Experto.
# Aquí se define QUÉ sabe el sistema sobre los requisitos de titulación.
# -----------------------------------------------------------------------------------------

def get_rules():
    """
    Retorna la lista de reglas del Sistema Experto para titulación de la UAA (2026).
    
    Cada regla es un diccionario con la siguiente estructura:
    - name: Nombre identificador de la regla (útil para debugging y logs).
    - description: Explicación humana de lo que valida la regla.
    - valid: Una función lambda que recibe el diccionario de 'facts' (hechos) y retorna True si se cumple.
             Esta es la parte lógica que el Motor de Inferencia evaluará.
    - error_message: El mensaje que se mostrará al usuario si esta regla NO se cumple.
    """
    return [
        # --- Requisitos de Pregrado (Licenciatura/TSU/Técnico) ---
        # Basado en el "Informe de Titulación UAA 2026"
        
        {
            "name": "Créditos Académicos",
            "description": "Verifica que el alumno haya aprobado el 100% de las materias.",
            # La función lambda verifica si el valor de 'credits_percentage' es mayor o igual a 100.
            # facts.get(key, default) se usa para evitar errores si el dato no existe.
            "valid": lambda facts: facts.get("credits_percentage", 0) >= 100,
            "error_message": "No has cubierto el 100% de los créditos de tu plan de estudios."
        },
        {
            "name": "Servicio Social",
            "description": "Verifica la liberación del Servicio Social (500 horas, min 6 meses).",
            "valid": lambda facts: facts.get("social_service_completed", False) is True,
            "error_message": "Debes concluir y liberar tu Servicio Social (500 horas)."
        },
        {
            "name": "Prácticas Profesionales",
            "description": "Verifica la liberación de Prácticas Profesionales (min 240 horas).",
            "valid": lambda facts: facts.get("professional_practices_completed", False) is True,
            "error_message": "Debes concluir y liberar tus Prácticas Profesionales (mínimo 240 horas)."
        },
        {
            "name": "Formación Humanista",
            "description": "Verifica la cobertura de créditos de Formación Humanista.",
            "valid": lambda facts: facts.get("humanist_formation_completed", False) is True,
            "error_message": "No has liberado los créditos de Formación Humanista."
        },
        {
            "name": "Segundo Idioma",
            "description": "Verifica la acreditación del idioma extranjero según el plan de estudios.",
            "valid": lambda facts: facts.get("language_requirement_met", False) is True,
            "error_message": "No has acreditado el requisito de Segundo Idioma (Inglés u otro)."
        },
        {
            "name": "Examen de Egreso (EGEL/EXANI)",
            "description": "Verifica la presentación del examen de egreso (requisito obligatorio).",
            "valid": lambda facts: facts.get("exit_exam_presented", False) is True,
            "error_message": "Es obligatorio presentar el Examen General de Egreso (EGEL/EXANI), aunque el resultado no Condicione el título."
        },
        {
            "name": "No Adeudos",
            "description": "Verifica que no existan deudas en las 3 áreas críticas: Colegiatura, Biblioteca, Lab.",
            # Esta regla es compuesta: Falla si CUALQUIERA de las deudas es True.
            # Se usa 'not' para indicar que la regla es válida solo si NO hay deudas.
            "valid": lambda facts: not (
                facts.get("debt_tuition", False) or 
                facts.get("debt_library", False) or 
                facts.get("debt_lab", False)
            ),
            "error_message": "Tienes adeudos pendientes (Colegiatura, Biblioteca o Laboratorio)."
        },
        {
            "name": "Pago de Título",
            "description": "Verifica el pago administrativo de derechos de titulación.",
            "valid": lambda facts: facts.get("title_fee_paid", False) is True,
            "error_message": "Debes cubrir el pago de derechos de Expedición de Título (~$2,300 - $2,500)."
        }
    ]

def get_questions():
    """
    Retorna la lista de preguntas que la Interfaz de Usuario (CLI o Web) debe hacer.
    
    Estructura:
    - key: La clave única donde se guardará la respuesta en el diccionario de 'hechos'.
           DEBE coincidir con las claves usadas en las funciones lambda de get_rules().
    - text: La pregunta legible para el usuario.
    - type: El tipo de dato esperado ('float' para números, 'bool' para sí/no).
            Esto ayuda al frontend a saber qué tipo de input mostrar.
    """
    return [
        {"key": "credits_percentage", "text": "1. ¿Qué porcentaje de créditos de tu plan de estudios has aprobado?", "type": "float"},
        {"key": "social_service_completed", "text": "2. ¿Ya liberaste tu Servicio Social (500 horas)?", "type": "bool"},
        {"key": "professional_practices_completed", "text": "3. ¿Ya liberaste tus Prácticas Profesionales (mín. 240 horas)?", "type": "bool"},
        {"key": "humanist_formation_completed", "text": "4. ¿Has cubierto los créditos de Formación Humanista?", "type": "bool"},
        {"key": "language_requirement_met", "text": "5. ¿Acreditaste el requisito de Segundo Idioma?", "type": "bool"},
        {"key": "exit_exam_presented", "text": "6. ¿Ya presentaste tu Examen de Egreso (EGEL/EXANI)?", "type": "bool"},
        {"key": "debt_tuition", "text": "7. ¿Tienes adeudos de colegiatura?", "type": "bool"},
        {"key": "debt_library", "text": "8. ¿Tienes adeudos en biblioteca?", "type": "bool"},
        {"key": "debt_lab", "text": "9. ¿Tienes adeudos en laboratorios?", "type": "bool"},
        {"key": "title_fee_paid", "text": "10. ¿Ya realizaste el pago de derechos de titulación?", "type": "bool"}
    ]
