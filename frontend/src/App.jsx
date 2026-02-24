
import { useState, useEffect } from 'react'
import './App.css'
import QuestionCard from './components/QuestionCard'
import ResultCard from './components/ResultCard'

function App() {
  const [step, setStep] = useState('start'); // start, question, result
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Define questions based on knowledge_base.py
  const questions = [
    { key: "credits_percentage", text: "¿Qué porcentaje de créditos has cubierto?", type: "int" },
    { key: "social_service_completed", text: "¿Has liberado tu Servicio Social?", type: "bool" },
    { key: "professional_practices_completed", text: "¿Has liberado tus Prácticas Profesionales?", type: "bool" },
    { key: "humanist_formation_completed", text: "¿Cubriste los créditos de Formación Humanista?", type: "bool" },
    { key: "language_requirement_met", text: "¿Acreditaste el Segundo Idioma?", type: "bool" },
    { key: "exit_exam_presented", text: "¿Presentaste el Examen de Egreso (EGEL/EXANI)?", type: "bool" },
    { key: "debt_tuition", text: "¿Tienes adeudos de colegiatura?", type: "bool" },
    { key: "debt_library", text: "¿Tienes adeudos de biblioteca?", type: "bool" },
    { key: "debt_lab", text: "¿Tienes adeudos de laboratorio?", type: "bool" },
    { key: "title_fee_paid", text: "¿Ya pagaste el derecho de titulación?", type: "bool" }
  ];

  useEffect(() => {
    // Generate background floating shapes
    const createShapes = () => {
      const container = document.getElementById('background-animations');
      if (container) {
        container.innerHTML = '';
        for (let i = 0; i < 15; i++) {
          const shape = document.createElement('div');
          shape.className = `floating-shape shape-${i % 3}`;
          shape.style.left = `${Math.random() * 100}%`;
          shape.style.top = `${Math.random() * 100}%`;
          const size = Math.random() * 150 + 50;
          shape.style.width = `${size}px`;
          shape.style.height = `${size}px`;
          shape.style.animationDelay = `${Math.random() * 5}s`;
          shape.style.animationDuration = `${Math.random() * 10 + 10}s`;
          container.appendChild(shape);
        }
      }
    };
    createShapes();
  }, []);

  const handleStart = () => {
    setStep('question');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finish and submit
      await submitDiagnosis();
    }
  };

  const submitDiagnosis = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5001/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });
      const data = await response.json();
      setResult({
        passed: data.passed,
        reasons: data.reasons || [] // Ensure array
      });
      setStep('result');
    } catch (error) {
      console.error("Error connecting to expert system:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="background-animations" className="background-container"></div>

      <div className="app-container">
        <h1>Experto en Titulación</h1>

        {step === 'start' && (
          <div className="fade-in">
            <p className="subtitle">
              Sistema inteligente de análisis académico.
              <br />Verifica tus requisitos para titulación.
            </p>
            <button className="btn-primary" onClick={handleStart}>
              Iniciar Diagnóstico
            </button>
          </div>
        )}

        {step === 'question' && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            value={answers[questions[currentQuestionIndex].key]}
            onChange={handleAnswerChange}
            onNext={handleNextQuestion}
          />
        )}

        {step === 'result' && result && (
          <ResultCard result={result} onRetry={handleStart} />
        )}

        {loading && <p className="fade-in" style={{ marginTop: '1.5rem', fontWeight: '600', color: 'var(--accent-color)' }}>Analizando...</p>}
      </div>
    </>
  )
}

export default App
