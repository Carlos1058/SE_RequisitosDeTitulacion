
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
  const [showExamples, setShowExamples] = useState(false);

  // Predefined example cases
  const exampleCases = [
    {
      name: "1. Titulación Exitosa (Todo aprobado)",
      data: { credits_percentage: 100, social_service_completed: true, professional_practices_completed: true, humanist_formation_completed: true, language_requirement_met: true, exit_exam_presented: true, debt_tuition: false, debt_library: false, debt_lab: false, title_fee_paid: true }
    },
    {
      name: "2. Fallo por Servicio Social",
      data: { credits_percentage: 100, social_service_completed: false, professional_practices_completed: true, humanist_formation_completed: true, language_requirement_met: true, exit_exam_presented: true, debt_tuition: false, debt_library: false, debt_lab: false, title_fee_paid: true }
    },
    {
      name: "3. Adeudos Pendientes (Colegiatura y Biblio)",
      data: { credits_percentage: 100, social_service_completed: true, professional_practices_completed: true, humanist_formation_completed: true, language_requirement_met: true, exit_exam_presented: true, debt_tuition: true, debt_library: true, debt_lab: false, title_fee_paid: true }
    },
    {
      name: "4. Alumno de Mitad de Carrera (50% Créditos)",
      data: { credits_percentage: 50, social_service_completed: false, professional_practices_completed: false, humanist_formation_completed: false, language_requirement_met: false, exit_exam_presented: false, debt_tuition: false, debt_library: false, debt_lab: false, title_fee_paid: false }
    }
  ];

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
    setShowExamples(false);
  };

  const handleLoadExample = async (exampleData) => {
    setShowExamples(false);
    setAnswers(exampleData);
    await submitDiagnosis(exampleData);
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

  const submitDiagnosis = async (overrideAnswers = null) => {
    setLoading(true);
    const dataToSend = overrideAnswers || answers;
    try {
      const response = await fetch('http://127.0.0.1:5001/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
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

        {step === 'start' && !showExamples && (
          <div className="fade-in">
            <p className="subtitle">
              Sistema inteligente de análisis académico.
              <br />Verifica tus requisitos para titulación.
            </p>
            <button className="btn-primary" onClick={handleStart}>
              Iniciar Diagnóstico
            </button>
            <div style={{ marginTop: '2rem' }}>
              <button
                className="btn-subtle"
                onClick={() => setShowExamples(true)}
              >
                Cargar Casos de Ejemplo
              </button>
            </div>
          </div>
        )}

        {step === 'start' && showExamples && (
          <div className="fade-in">
            <p className="subtitle">Selecciona un caso de prueba para el Sistema Experto:</p>
            <div className="examples-list">
              {exampleCases.map((example, idx) => (
                <button
                  key={idx}
                  className="btn-example"
                  onClick={() => handleLoadExample(example.data)}
                >
                  {example.name}
                </button>
              ))}
            </div>
            <button className="btn-subtle" style={{ marginTop: '1.5rem' }} onClick={() => setShowExamples(false)}>
              Volver Atrás
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
