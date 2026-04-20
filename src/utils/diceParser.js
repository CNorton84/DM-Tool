const MIN_DICE_FACES = 2;
const MAX_DICE_FACES = 10000;

// Token types
const TOKEN_TYPE = {
  OPERATOR: 'OPERATOR',
  DICE: 'DICE',
  NUMBER: 'NUMBER',
  INVALID: 'INVALID',
};

// Error codes
const ERROR_CODE = {
  EMPTY_INPUT: 'EMPTY_INPUT',
  INVALID_CHAR: 'INVALID_CHAR',
  DOUBLE_OPERATOR: 'DOUBLE_OPERATOR',
  TRAILING_OPERATOR: 'TRAILING_OPERATOR',
  INVALID_DICE_FACES: 'INVALID_DICE_FACES',
  INVALID_SYNTAX: 'INVALID_SYNTAX',
  EXPECTED_VALUE: 'EXPECTED_VALUE',
};

// Tokenizer: Convert input string into tokens
function tokenize(input) {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Operators
    if (char === '+' || char === '-') {
      tokens.push({ type: TOKEN_TYPE.OPERATOR, value: char, position: i });
      i++;
      continue;
    }

    // Dice notation: optional count, 'd' or 'D', required faces
    if (char.toLowerCase() === 'd' || (/[0-9]/.test(char) && input.slice(i).match(/^\d*[dD]\d+/))) {
      const match = input.slice(i).match(/^\d*[dD]\d+/);
      if (match) {
        const diceStr = match[0];
        const parts = diceStr.match(/^(\d*)[dD](\d+)$/i);
        tokens.push({
          type: TOKEN_TYPE.DICE,
          count: parts[1] ? parseInt(parts[1], 10) : 1,
          faces: parseInt(parts[2], 10),
          position: i,
        });
        i += diceStr.length;
        continue;
      }
    }

    // Numbers
    if (/[0-9]/.test(char)) {
      const match = input.slice(i).match(/^\d+/);
      if (match) {
        tokens.push({
          type: TOKEN_TYPE.NUMBER,
          value: parseInt(match[0], 10),
          position: i,
        });
        i += match[0].length;
        continue;
      }
    }

    // Invalid character
    tokens.push({ type: TOKEN_TYPE.INVALID, value: char, position: i });
    i++;
  }

  return tokens;
}

// Parser: Convert tokens into structured parts
function parseTokens(tokens) {
  const parts = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    // Check for invalid characters
    if (token.type === TOKEN_TYPE.INVALID) {
      return {
        valid: false,
        error: {
          message: `Invalid character '${token.value}'`,
          code: ERROR_CODE.INVALID_CHAR,
          position: token.position,
          input: '',
        },
      };
    }

    // Check for operators
    if (token.type === TOKEN_TYPE.OPERATOR) {
      // Leading operator - attach it to the next value
      if (parts.length === 0) {
        i++;
        const nextToken = tokens[i];
        if (nextToken.type === TOKEN_TYPE.DICE) {
          parts.push({
            type: 'dice',
            count: nextToken.count,
            faces: nextToken.faces,
            operator: token.value,
            position: nextToken.position,
          });
        } else if (nextToken.type === TOKEN_TYPE.NUMBER) {
          parts.push({
            type: 'modifier',
            value: nextToken.value,
            operator: token.value,
            position: nextToken.position,
          });
        }
        i++;
        continue;
      }

      // Check for double operator
      if (tokens[i + 1]?.type === TOKEN_TYPE.OPERATOR) {
        return {
          valid: false,
          error: {
            message: `Double operator detected. You can't use '${token.value}' and '${tokens[i + 1].value}' together`,
            code: ERROR_CODE.DOUBLE_OPERATOR,
            position: token.position,
            input: '',
          },
        };
      }

      // Check for trailing operator
      if (i + 1 >= tokens.length) {
        return {
          valid: false,
          error: {
            message: `Incomplete expression. Expected a value after '${token.value}'`,
            code: ERROR_CODE.TRAILING_OPERATOR,
            position: token.position,
            input: '',
          },
        };
      }

      // Store operator for next value
      const operator = token.value;
      i++;

      // Get next value and attach operator
      const nextToken = tokens[i];
      if (nextToken.type === TOKEN_TYPE.DICE) {
        parts.push({
          type: 'dice',
          count: nextToken.count,
          faces: nextToken.faces,
          operator: operator,
          position: nextToken.position,
        });
      } else if (nextToken.type === TOKEN_TYPE.NUMBER) {
        parts.push({
          type: 'modifier',
          value: nextToken.value,
          operator: operator,
          position: nextToken.position,
        });
      }
      i++;
      continue;
    }

    // Dice or Number without operator (first value or implicit +)
    if (token.type === TOKEN_TYPE.DICE) {
      parts.push({
        type: 'dice',
        count: token.count,
        faces: token.faces,
        operator: parts.length === 0 ? null : '+',
        position: token.position,
      });
    } else if (token.type === TOKEN_TYPE.NUMBER) {
      parts.push({
        type: 'modifier',
        value: token.value,
        operator: parts.length === 0 ? null : '+',
        position: token.position,
      });
    }

    i++;
  }

  // Check for empty result
  if (parts.length === 0) {
    return {
      valid: false,
      error: {
        message: 'Please enter a valid dice command (e.g., "2d6+1")',
        code: ERROR_CODE.EMPTY_INPUT,
        position: 0,
        input: '',
      },
    };
  }

  // Validate dice faces
  for (const part of parts) {
    if (part.type === 'dice') {
      if (part.faces < MIN_DICE_FACES || part.faces > MAX_DICE_FACES) {
        return {
          valid: false,
          error: {
            message: `Dice must have ${MIN_DICE_FACES}-${MAX_DICE_FACES} faces`,
            code: ERROR_CODE.INVALID_DICE_FACES,
            position: part.position,
            input: '',
          },
        };
      }
    }
  }

  return { valid: true, parts };
}

export function parseDiceCommand(input) {
  if (!input || typeof input !== 'string') {
    return {
      valid: false,
      error: {
        message: 'Please enter a dice command',
        code: ERROR_CODE.EMPTY_INPUT,
        position: 0,
        input: '',
      },
    };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: {
        message: 'Please enter a dice command',
        code: ERROR_CODE.EMPTY_INPUT,
        position: 0,
        input: '',
      },
    };
  }

  // Tokenize
  const tokens = tokenize(trimmed);

  // Parse tokens
  const parseResult = parseTokens(tokens);
  if (!parseResult.valid) {
    return {
      valid: false,
      error: { ...parseResult.error, input: trimmed },
    };
  }

  const parts = parseResult.parts;
  const formula = formatFormula(parts);
  return { valid: true, parts, formula };
}

export function rollDice(parts) {
  const dice = [];
  let total = 0;
  let minPossible = 0;
  let maxPossible = 0;

  for (const part of parts) {
    const sign = part.operator === '-' ? -1 : 1;
    
    if (part.type === 'dice') {
      for (let i = 0; i < part.count; i++) {
        const roll = Math.floor(Math.random() * part.faces) + 1;
        dice.push({ value: roll, sides: part.faces, sign });
        total += roll * sign;
      }
      minPossible += part.count * 1 * sign;
      maxPossible += part.count * part.faces * sign;
    } else if (part.type === 'modifier') {
      const modifierValue = part.value * sign;
      total += modifierValue;
      minPossible += modifierValue;
      maxPossible += modifierValue;
    }
  }

  return { dice, total, minPossible, maxPossible };
}

export function formatFormula(parts) {
  const formulaParts = [];
  for (const part of parts) {
    if (part.type === 'dice') {
      const operator = part.operator === '-' ? '-' : part.operator === '+' ? '+' : '';
      formulaParts.push(operator + (part.count === 1 ? `d${part.faces}` : `${part.count}d${part.faces}`));
    } else if (part.type === 'modifier') {
      const operator = part.operator === '-' ? '-' : part.operator === '+' ? '+' : '';
      formulaParts.push(operator + part.value.toString());
    }
  }
  return formulaParts.join('');
}
