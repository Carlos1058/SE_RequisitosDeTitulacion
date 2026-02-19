
from flask import Flask, jsonify, request
from flask_cors import CORS
from knowledge_base import get_rules
from inference_engine import InferenceEngine

# -----------------------------------------------------------------------------------------
# Módulo Principal del Servidor (API)
# Este archivo conecta la lógica de Python (Sistema Experto) con el mundo exterior (Web React).
# Usa Flask para crear un servidor web ligero.
# -----------------------------------------------------------------------------------------

app = Flask(__name__)
CORS(app) # Habilita Cross-Origin Resource Sharing para que React (puerto 5173) pueda hablar con Flask (puerto 5001)

# --- Inicialización del Sistema Experto ---
# Al arrancar el servidor, cargamos las reglas y preparamos el motor.
# Esto se hace una sola vez para eficiencia.
rules = get_rules()
engine = InferenceEngine(rules)

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    """
    Endpoint de la API que recibe los datos del formulario y retorna el diagnóstico.
    
    Método: POST
    Entrada (JSON): { "credits_percentage": 100, "social_service_completed": true, ... }
    Salida (JSON): { "success": true, "passed": true/false, "reasons": ["Falta X", "Falta Y"] }
    """
    try:
        # 1. Obtener los datos enviados por el Frontend (React)
        data = request.json
        print(f"Datos recibidos para análisis: {data}")
        
        # 2. Invocar al Motor de Inferencia para evaluar los hechos
        success, failed_rules = engine.evaluate(data)
        
        # 3. Formatear la lista de razones (mensajes de error) para el usuario
        reasons = [rule['error_message'] for rule in failed_rules]
        
        # 4. Responder con un JSON estructurado
        return jsonify({
            "success": True,         # Indica que la petición HTTP fue exitosa
            "message": "Evaluación completada.",
            "passed": success,       # El resultado del diagnóstico (¿Se titula o no?)
            "reasons": reasons       # Lista de por qués (si no pasó)
        })
    except Exception as e:
        # Manejo de errores internos del servidor
        print(f"Error durante la evaluación: {e}")
        return jsonify({
            "success": False,
            "message": "Error interno del servidor durante la evaluación."
        }), 500

if __name__ == '__main__':
    # Inicia el servidor de desarrollo de Flask en el puerto 5001
    app.run(debug=True, port=5001)
