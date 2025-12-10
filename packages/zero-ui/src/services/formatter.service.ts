export class FormatterService {
  /**
   * Format HTML with proper indentation and support for script/style blocks
   */
  static formatHtml(code: string): string {
    const tab = '  ';
    let result = '';
    let indent = 0;
    
    // Normalize newlines
    code = code.replace(/\r\n/g, '\n');

    // Helper to process content inside <script> and <style>
    const processContent = (tagName: string, content: string) => {
        const baseIndent = tab.repeat(indent + 1);
        let formatted = '';
        if (tagName === 'script') formatted = this.formatJs(content);
        else if (tagName === 'style') formatted = this.formatCss(content);
        else formatted = content.trim();

        // Add base indentation to every line of the formatted content
        return formatted.split('\n').map(line => line ? baseIndent + line : '').join('\n');
    };

    let i = 0;
    while (i < code.length) {
      const char = code[i];

      // Handle tags
      if (char === '<') {
        const nextIdx = code.indexOf('>', i);
        if (nextIdx === -1) {
            result += char;
            i++;
            continue;
        }

        const tagFull = code.substring(i, nextIdx + 1);
        const isClosing = tagFull.startsWith('</');
        const isComment = tagFull.startsWith('<!--');
        const tagNameMatch = tagFull.match(/^<\/?([a-zA-Z0-9-]+)/);
        const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
        const isVoid = this._isVoidTag(tagName);

        if (isClosing) {
            indent = Math.max(0, indent - 1);
        }

        // Add newline and indent before tag (unless it's the first thing)
        if (result.trim().length > 0) {
            result = result.trimEnd() + '\n' + tab.repeat(indent);
        }
        result += tagFull;

        if (!isClosing && !isVoid && !isComment) {
            // Check for content that needs special formatting (script/style)
            if (tagName === 'script' || tagName === 'style') {
                indent++;
                const closingTag = `</${tagName}>`;
                const closingIndex = code.indexOf(closingTag, nextIdx + 1);
                
                if (closingIndex !== -1) {
                    const content = code.substring(nextIdx + 1, closingIndex);
                    if (content.trim()) {
                        result += '\n' + processContent(tagName, content);
                    }
                    i = closingIndex - 1; // Move pointer to just before closing tag start
                    // The loop will pick up the closing tag next iteration
                }
            } else {
                indent++;
            }
        }
        
        i = nextIdx + 1;
      } else {
        // Text content
        const nextTag = code.indexOf('<', i);
        const textEnd = nextTag === -1 ? code.length : nextTag;
        const text = code.substring(i, textEnd).trim();
        
        if (text) {
             result += '\n' + tab.repeat(indent) + text;
        }
        i = textEnd;
      }
    }
    
    return result.trim();
  }

  private static _isVoidTag(tag: string): boolean {
    const voids = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    return voids.includes(tag.toLowerCase());
  }

  /**
   * Format CSS using state machine
   */
  static formatCss(code: string): string {
    return this._formatCLike(code, 'css');
  }

  /**
   * Format JS using state machine
   */
  static formatJs(code: string): string {
    return this._formatCLike(code, 'js');
  }

  /**
   * Generic formatter for C-like syntax (JS, CSS)
   */
  private static _formatCLike(code: string, type: 'js' | 'css'): string {
    const tab = '  ';
    let output = '';
    let indentLevel = 0;
    
    let inString: false | "'" | '"' | '`' = false;
    let inComment: false | '//' | '/*' = false;
    let lastChar = '';
    
    // Normalize spaces
    code = code.replace(/\r\n/g, '\n');
    if (type === 'css') {
        // Simple CSS cleanup before processing
        code = code.replace(/\s*{\s*/g, ' { ').replace(/\s*;\s*/g, '; ').replace(/\s*:\s*/g, ': ');
    }

    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const nextChar = code[i + 1] || '';
        
        // Handle Strings
        if (!inComment && (char === '"' || char === "'" || char === '`')) {
            if (inString === char && lastChar !== '\\') {
                inString = false;
            } else if (!inString) {
                inString = char;
            }
            output += char;
            lastChar = char;
            continue;
        }

        if (inString) {
            output += char;
            lastChar = char;
            continue;
        }

        // Handle Comments
        if (!inComment) {
            if (char === '/' && nextChar === '/') {
                inComment = '//';
                output += char;
                lastChar = char;
                continue;
            } else if (char === '/' && nextChar === '*') {
                inComment = '/*';
                output += char;
                lastChar = char;
                continue;
            }
        } else {
            output += char;
            if (inComment === '//' && char === '\n') {
                inComment = false;
                output += tab.repeat(indentLevel);
            } else if (inComment === '/*' && char === '/' && lastChar === '*') {
                inComment = false;
            }
            lastChar = char;
            continue;
        }

        // Handle Indentation
        if (char === '{' || (type === 'js' && char === '[')) {
            output = output.trimEnd() + (type === 'css' ? ' ' : '') + char + '\n';
            indentLevel++;
            output += tab.repeat(indentLevel);
        } else if (char === '}' || (type === 'js' && char === ']')) {
            indentLevel = Math.max(0, indentLevel - 1);
            output = output.trimEnd() + '\n' + tab.repeat(indentLevel) + char;
            if (type === 'css') output += '\n' + tab.repeat(indentLevel);
        } else if (char === ';') {
             output += char + '\n' + tab.repeat(indentLevel);
        } else if (char === '\n') {
             if (output.trim().length > 0 && !output.endsWith('\n' + tab.repeat(indentLevel))) {
                 output += '\n' + tab.repeat(indentLevel);
             }
        } else {
            // Avoid adding spaces to empty lines
            if (char !== ' ' || (output.length > 0 && output[output.length-1] !== '\n' && output[output.length-1] !== ' ')) {
                 output += char;
            }
        }
        
        lastChar = char;
    }

    // Final cleanup of multiple newlines
    return output.replace(/\n\s*\n/g, '\n').trim();
  }
}
