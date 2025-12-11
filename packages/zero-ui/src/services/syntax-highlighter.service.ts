
export class SyntaxHighlighterService {

  private static readonly TOKEN_TYPES = {
    comment: 'color: #6a9955; font-style: italic;',
    string: 'color: #ce9178;',
    keyword: 'color: #569cd6;',
    number: 'color: #b5cea8;',
    tag: 'color: #569cd6;',
    attribute: 'color: #9cdcfe;',
    operator: 'color: #d4d4d4;',
    default: 'color: #d4d4d4;'
  };

  static highlight(code: string, lang: string): string {
    if (!code) return '';
    
    // Normalize newlines for easier regex
    // code = code.replace(/\r\n/g, '\n'); 
    // ^ Avoiding this to keep exact mapping with textarea

    let html = '';
    
    switch (lang) {
      case 'html':
        html = this._tokenizeHtml(code);
        break;
      case 'css':
        html = this._tokenizeCss(code);
        break;
      case 'javascript':
      case 'js':
      case 'json':
        html = this._tokenizeJs(code);
        break;
      default:
        html = this._escapeHtml(code);
    }

    return html;
  }

  private static _escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  private static _span(type: keyof typeof SyntaxHighlighterService.TOKEN_TYPES, content: string): string {
    const style = this.TOKEN_TYPES[type];
    return `<span style="${style}">${content}</span>`;
  }

  private static _tokenizeJs(code: string): string {
    // Basic JS Tokenizer
    // Order matters: Comment -> String -> Keyword -> Number -> Operator -> Rest
    
    const tokenizers = [
      { type: 'comment', regex: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g },
      { type: 'string', regex: /("[\s\S]*?"|'[\s\S]*?'|`[\s\S]*?`)/g },
      { type: 'keyword', regex: /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|new|return|super|switch|this|throw|try|typeof|var|void|while|with|let|static|yield|async|await|true|false|null|undefined)\b/g },
      { type: 'number', regex: /\b\d+(\.\d+)?\b/g },
      { type: 'operator', regex: /[\+\-\*\/%=<>&\|\!\?\:\.\,;\{\}\[\]\(\)]/g },
    ];

    return this._processTokens(code, tokenizers);
  }

  private static _tokenizeCss(code: string): string {
    const tokenizers = [
      { type: 'comment', regex: /(\/\*[\s\S]*?\*\/)/g },
      { type: 'keyword', regex: /@[\w-]+/g }, // At-rules
      { type: 'string', regex: /("[\s\S]*?"|'[\s\S]*?')/g },
      { type: 'tag', regex: /[\.\#]?[\w-]+(?=\s*\{)/g }, // Selectors roughly
      { type: 'attribute', regex: /[\w-]+(?=\s*:)/g }, // Properties
      { type: 'number', regex: /[\d\.]+(px|rem|em|%|vh|vw|s|ms|deg)?/g },
    ];
    return this._processTokens(code, tokenizers);
  }

  private static _tokenizeHtml(code: string): string {
     // HTML is tricky with regex, simpler state-ish approach for tags
     let output = '';
     let cursor = 0;
     
     // Simple regex to find tags
     const tagRegex = /(<!--[\s\S]*?-->|<\/?[\w-]+(\s+[\w-]+(=("[^"]*"|'[^']*'|[^>\s]*))?)*\s*\/?>)/g;
     
     let match;
     while ((match = tagRegex.exec(code)) !== null) {
       const textBefore = code.substring(cursor, match.index);
       output += this._escapeHtml(textBefore);
       
       const tag = match[0];
       if (tag.startsWith('<!--')) {
         output += this._span('comment', this._escapeHtml(tag));
       } else {
         // Highlight tag parts
         output += this._processHtmlTag(tag);
       }
       
       cursor = match.index + tag.length;
     }
     
     output += this._escapeHtml(code.substring(cursor));
     return output;
  }

  private static _processHtmlTag(tag: string): string {
    // Single-pass regex to avoid "matching the output" issues.
    // Groups:
    // 1. Tag Name (Start): <div, </span
    // 2. String: "foo", 'bar'
    // 3. Attribute Name (followed by =): class
    // 4. Attribute Name (standalone/value): checked, foo
    // 5. Tag End: >, />
    // 6. Whitespace
    // 7. Equals: =
    
    // We use a lookahead (?=\s*=) for attributes to differentiate from values
    const tokenRegex = /(<\/?[\w-]+)|("[^"]*"|'[^']*')|([\w-]+)(?=\s*=)|([\w-]+)|(\/?>)|(\s+)|(=)/g;

    return tag.replace(tokenRegex, (match, tagName, string, attrNameEq, attrName, tagEnd, whitespace, equals) => {
        if (tagName) return this._span('tag', this._escapeHtml(tagName));
        if (string) return this._span('string', this._escapeHtml(string));
        if (attrNameEq) return this._span('attribute', this._escapeHtml(attrNameEq));
        if (attrName) return this._span('attribute', this._escapeHtml(attrName)); // fallback for bool attrs or unquoted vals
        if (tagEnd) return this._span('tag', this._escapeHtml(tagEnd));
        if (whitespace) return whitespace; // preserve raw whitespace
        if (equals) return this._escapeHtml(equals);
        return this._escapeHtml(match);
    });
  }

  private static _processTokens(code: string, tokenizers: { type: string, regex: RegExp }[]): string {
    // Split and conquer approach is hard with varying regexes.
    // Simpler: Replace tokens with placeholders, then restore with markup.
    // BUT that's slow.
    
    // Better: Tokenize sequentially.
    // NOTE: This implementation is basic and may struggle with nesting.
    
    // For specific requirement:
    // We accept that "strings" might contain "keywords".
    // So we match largest chunks first (comments, strings).
    
    const tokens: {start: number, end: number, type: string, score: number}[] = [];
    
    tokenizers.forEach((t, i) => {
      let match;
      // Reset lastIndex just in case
      t.regex.lastIndex = 0;
      while ((match = t.regex.exec(code)) !== null) {
         tokens.push({
           start: match.index,
           end: match.index + match[0].length,
           type: t.type,
           score: i // Lower index = higher priority usually means 'larger structure' like comments
         });
      }
    });

    // Sort by start position
    tokens.sort((a, b) => a.start - b.start || a.score - b.score);
    
    // Filter overlaps (simple greedy)
    const validTokens: typeof tokens = [];
    let lastEnd = 0;
    
    for (const t of tokens) {
      if (t.start >= lastEnd) {
        validTokens.push(t);
        lastEnd = t.end;
      }
    }

    let output = '';
    let cursor = 0;
    
    for (const t of validTokens) {
      if (t.start > cursor) {
        output += this._escapeHtml(code.substring(cursor, t.start));
      }
      
      const content = code.substring(t.start, t.end);
      output += this._span(t.type as any, this._escapeHtml(content));
      cursor = t.end;
    }
    
    if (cursor < code.length) {
      output += this._escapeHtml(code.substring(cursor));
    }
    
    return output;
  }
}
