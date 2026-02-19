
import React from 'react';

const QuestionCard = ({ question, value, onChange, onNext }) => {
    const handleChange = (e) => {
        const val = question.type === 'bool' ? e.target.value === 'true' : e.target.value;
        onChange(question.key, val);
    };

    const handleNext = (e) => {
        e.preventDefault();
        onNext();
    };

    return (
        <div className="question-content">
            <label>{question.text}</label>

            <form onSubmit={handleNext}>
                {question.type === 'bool' ? (
                    <select value={value === undefined ? '' : value.toString()} onChange={handleChange} required>
                        <option value="" disabled>Selecciona una opción</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                ) : (
                    <input
                        type="number"
                        value={value || ''}
                        onChange={handleChange}
                        placeholder="Ingresa un número"
                        required
                        min="0"
                        max="100"
                    />
                )}

                <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary">Siguiente</button>
                </div>
            </form>
        </div>
    );
};

export default QuestionCard;
