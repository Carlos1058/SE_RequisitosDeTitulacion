
# inference_engine.py
# -----------------------------------------------------------------------------------------
# Módulo de Motor de Inferencia
# Este es el "cerebro" lógico del sistema experto.
# Su única responsabilidad es procesar los hechos contra las reglas y emitir un juicio.
# -----------------------------------------------------------------------------------------

class InferenceEngine:
    def __init__(self, rules):
        """
        Inicializa el motor de inferencia con un conjunto de reglas.
        :param rules: Lista de reglas obtenida de knowledge_base.get_rules()
        """
        self.rules = rules

    def evaluate(self, facts):
        """
        Evalúa los hechos proporcionados contra todas las reglas cargadas.
        
        Implementa una lógica de 'Encadenamiento Hacia Adelante' simplificada:
        Toma los datos conocidos (facts) y verifica regla por regla.
        
        :param facts: Diccionario con las respuestas del usuario (ej. {'credits_percentage': 100, ...})
        :return: Tupla (success, failed_rules)
                 - success: True si TODAS las reglas pasaron, False si alguna falló.
                 - failed_rules: Lista de los objetos regla que no se cumplieron.
        """
        failed_rules = []
        
        # Iteramos sobre cada regla definida en la Base de Conocimiento
        for rule in self.rules:
            try:
                # Ejecutamos la función lógica 'valid' de la regla pasando los hechos actuales.
                # Si retorna False, significa que el requisito no se cumple.
                if not rule["valid"](facts):
                    failed_rules.append(rule)
            except Exception as e:
                # Manejo de errores robusto:
                # Si una regla tiene un error de programación o faltan datos críticos, 
                # la capturamos y la marcamos como fallida para no romper el sistema.
                print(f"Error evaluando la regla '{rule['name']}': {e}")
                failed_rules.append(rule)
        
        # El diagnóstico es exitoso solo si la lista de reglas fallidas está vacía.
        return len(failed_rules) == 0, failed_rules
