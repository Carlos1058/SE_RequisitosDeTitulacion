
import React from 'react';

const ResultCard = ({ result, onRetry }) => {
    const isPass = result.passed;

    return (
        <div className="fade-in">
            <h2 style={{ color: isPass ? '#4cc9f0' : '#f72585' }}>
                {isPass ? '¡Felicidades!' : 'Requisitos Pendientes'}
            </h2>

            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                {isPass
                    ? 'Cumples con todos los requisitos para titularte.'
                    : 'Aún no puedes titularte por las siguientes razones:'}
            </p>

            {!isPass && (
                <ul style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1rem 2rem', borderRadius: '12px' }}>
                    {result.reasons.map((reason, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>{reason}</li>
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
