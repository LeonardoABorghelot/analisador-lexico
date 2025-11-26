export const State = {
  INITIAL: 'q0',
  ACCEPTING: 'q1',
  REJECTED: 'qReject'
} as const;

export type StateType = typeof State[keyof typeof State];

export interface Token {
  value: string;
  accepted: boolean;
  timestamp: number;
}

export interface StatePos {
  pos: number;
  char: string;
  state: StateType;
}

export class LexicalAutomaton {

  static transition(state: StateType, symbol: string): StateType {
    const isLowercase = /^[a-z]$/.test(symbol);

    if (!isLowercase) {
      return state;
    }

    switch (state) {
      case State.INITIAL:
        return State.ACCEPTING;

      case State.ACCEPTING:
        return State.ACCEPTING;

      case State.REJECTED:
        return State.REJECTED;

      default:
        return State.REJECTED;
    }
  }

  static processString(input: string): StateType {
    let currentState: StateType = State.INITIAL;

    for (const char of input) {
      currentState = this.transition(currentState, char);
    }

    return currentState;
  }

  static isAccepted(input: string): boolean {
    if (input.length === 0) {
      return false; 
    }
    return this.processString(input) === State.ACCEPTING;
  }

  static getStateHistory(input: string): StateType[] {
    const history: StateType[] = [State.INITIAL];
    let currentState: StateType = State.INITIAL;

    for (const char of input) {
      currentState = this.transition(currentState, char);
      history.push(currentState);
    }

    return history;
  }

  static getStatePositionHistory(input: string): StatePos[] {
    const result: StatePos[] = [];
    let currentState: StateType = State.INITIAL;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const newState: StateType = this.transition(currentState, char);

      result.push({
        pos: i,
        char,
        state: newState
      });

      currentState = newState;
    }

    return result;
  }

  static getStateColor(state: StateType): string {
    switch (state) {
      case State.INITIAL:
        return '#6c757d';
      case State.ACCEPTING:
        return '#28a745';
      case State.REJECTED:
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }

  static getStateName(state: StateType): string {
    switch (state) {
      case State.INITIAL:
        return 'Inicial';
      case State.ACCEPTING:
        return 'Aceitação';
      case State.REJECTED:
        return 'Rejeição';
      default:
        return 'Desconhecido';
    }
  }

  static isValidChar(char: string): boolean {
    return /^[a-z]$/.test(char);
  }

  static createToken(value: string): Token {
    return {
      value,
      accepted: this.isAccepted(value),
      timestamp: Date.now()
    };
  }
}