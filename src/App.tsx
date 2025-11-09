import React, { useState } from 'react';
import { CheckCircle, XCircle, Activity, Info } from 'lucide-react';
import { LexicalAutomaton, State } from '../src/analizadorLexico';
import type { Token, StateType } from '../src/analizadorLexico';
import "./styles/app.css";


const App: React.FC = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [currentState, setCurrentState] = useState<StateType>(State.INITIAL);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [stateHistory, setStateHistory] = useState<StateType[]>([State.INITIAL]);

  const processCharacter = (char: string): void => {
    if (char === ' ') {
      if (currentInput.length > 0) {
        const newToken = LexicalAutomaton.createToken(currentInput);
        setTokens(prev => [...prev, newToken]);
        setCurrentInput('');
        setCurrentState(State.INITIAL);
        setStateHistory([State.INITIAL]);
      }
      return;
    }

    const newState = LexicalAutomaton.transition(currentState, char);
    setCurrentState(newState);
    setCurrentInput(prev => prev + char);
    setStateHistory(prev => [...prev, newState]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const lastChar = newValue[newValue.length - 1];

    if (newValue.length > currentInput.length) {
      processCharacter(lastChar);
    } else {
      setCurrentInput(newValue);
      const state = LexicalAutomaton.processString(newValue);
      const history = LexicalAutomaton.getStateHistory(newValue);
      setCurrentState(state);
      setStateHistory(history);
    }
  };

  const clearAll = () => {
    setCurrentInput('');
    setCurrentState(State.INITIAL);
    setTokens([]);
    setStateHistory([State.INITIAL]);
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="header">
          <Activity size={24} color="#4f46e5" />
          <h1>Analisador Léxico</h1>
        </header>

        <p className="subtitle">Alfabeto: a–z (minúsculas) | Separador: espaço</p>

        <label htmlFor="tokenInput" className="input-label">Entrada:</label>
        <input
          id="tokenInput"
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          placeholder="Digite e pressione espaço..."
          className="input"
        />

        <section className="state-section">
          <div className="state-header">
            <h2>Estado Atual</h2>
            <span className="state-badge" style={{ background: LexicalAutomaton.getStateColor(currentState) }}>
              {currentState}
            </span>
          </div>

          {currentInput && (
            <div className="state-history">
              <div>Token atual: <strong>{currentInput}</strong></div>
              <div className="history">{stateHistory.join(' → ')}</div>
            </div>
          )}
        </section>

        <hr className="divider" />

        <section className="tokens-section">
          <div className="tokens-header">
            <h2>Tokens ({tokens.length})</h2>
            {tokens.length > 0 && (
              <button onClick={clearAll} className="clear-button">Limpar</button>
            )}
          </div>

          <div className="tokens-list">
            {tokens.length === 0 ? (
              <p className="empty-tokens">Nenhum token processado.</p>
            ) : (
              tokens.map((token, idx) => (
                <div
                  key={idx}
                  className={`token-item ${token.accepted ? 'token-accepted' : 'token-rejected'}`}
                >
                  <div className="token-left">
                    {token.accepted ? (
                      <CheckCircle color="#16a34a" size={20} />
                    ) : (
                      <XCircle color="#dc2626" size={20} />
                    )}
                    <span>{token.value}</span>
                  </div>
                  <span className={`token-status ${token.accepted ? 'accepted' : 'rejected'}`}>
                    {token.accepted ? 'ACEITO' : 'REJEITADO'}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rules-section">
          <div className="rules-header">
            <Info size={18} />
            <h2>Regras do Autômato</h2>
          </div>
          <ul className="rules-list">
            <li>Inicia no estado <strong>q0</strong></li>
            <li>Letras de a–z são válidas</li>
            <li>Espaço separa tokens</li>
            <li>Token aceito se termina em estado final</li>
            <li>Token rejeitado se entrar em <strong>q_erro</strong></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default App;
