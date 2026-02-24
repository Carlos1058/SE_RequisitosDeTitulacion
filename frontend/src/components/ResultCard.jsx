
import React from 'react';

const ResultCard = ({ result, onRetry }) => {
    const isPass = result.passed;

    return (
        <div className="fade-in">
            <h2 style={{ color: isPass ? '#10b981' : '#e11d48' }}>
                {isPass ? '¡Felicidades!' : 'Requisitos Pendientes'}
            </h2>

            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#1f2937' }}>
                {isPass
                    ? 'Cumples con todos los requisitos para titularte.'
                    : 'Aún no puedes titularte por las siguientes razones:'}
            </p>

            {!isPass && (
                <ul style={{ textAlign: 'left', background: 'rgba(15, 46, 84, 0.05)', padding: '1.5rem 2.5rem', borderRadius: '12px', border: '1px solid rgba(15,46,84,0.1)' }}>
                    {result.reasons.map((reason, index) => (
                        <li key={index} style={{ marginBottom: '0.8rem', color: '#0f2e54', fontWeight: '500' }}>{reason}</li>
                    ))}
                </ul>
            )}

            <button onClick={onRetry} className="btn-secondary">
                Nuevo Diagnóstico
            </button>
        </div>
    );
};

export default ResultCard;
