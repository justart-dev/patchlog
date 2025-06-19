/**
 * HTML 문자열에 가독성을 위한 스타일을 추가하는 함수
 * @param html 변환할 HTML 문자열
 * @returns 스타일이 적용된 HTML 문자열
 */
export function addStylesToHtml(html: string): string {
  if (!html) return '';

    // 이스케이프 문자 제거
    html = html
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');

  // 공통 스타일링 함수
  const addStyle = (tag: string, style: string) => {
    const regex = new RegExp(`<${tag}(\\s+[^>]*)?>`, 'gi');
    return html.replace(regex, (match, group) => {
      if (group && group.includes('style=')) {
        return match.replace(
          /style=(["'])([^"']*)\1/i,
          (_, quote, styleValue) => `style="${styleValue} ${style}"`
        );
      } else {
        const attributes = group ? group : '';
        return `<${tag}${attributes} style="${style}">`;
      }
    });
  };

  // 제목 스타일
  html = addStyle('h1', 'font-weight: 700; font-size: 2rem; margin-bottom: 1.5rem; margin-top: 3rem; color: #111827; padding-bottom: 0.5rem;');
  html = addStyle('h2', 'font-weight: 700; font-size: 1.5rem; margin-bottom: 1.25rem; margin-top: 2rem; color: #1f2937;');
  html = addStyle('h3', 'font-weight: 600; font-size: 1.2rem; margin-bottom: 1rem; margin-top: 1.75rem; color: #374151;');
  
  // 단락 스타일
  html = addStyle('p', 'margin : 0.5rem 0; font-size: 1rem; color: #374151;');
  
  // 목록 스타일
  html = addStyle('ul', 'list-style-type: disc; padding-left: 2.5rem; margin-bottom: 2rem;');
  html = addStyle('ol', 'list-style-type: decimal; padding-left: 2.5rem; margin-bottom: 2rem;');
  html = addStyle('li', 'margin-bottom: 0.5rem; font-size: 0.95rem;');
  
  // 링크 스타일
  html = addStyle('a', 'color: #2563eb; text-decoration: none; font-size: 1rem;');
  html = addStyle('a:hover', 'text-decoration: underline; color: #1e40af;');
  
  // 강조 스타일
  html = addStyle('strong', 'font-weight: 600; color: #111827; font-size: 1rem;');
  html = addStyle('em', 'font-style: italic; font-size: 1rem;');
  
  // 코드 블록 스타일
  html = addStyle('code', 'background-color: #f3f4f6; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-family: monospace; font-size: 1rem;');
  html = addStyle('pre', 'background-color: #f3f4f6; padding: 1.5rem; border-radius: 0.5rem; overflow-x: auto; margin: 1.5rem 0; font-size: 1rem;');
  
  // 이미지 스타일
  html = addStyle('img', 'margin: 2rem 0; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); max-width: 100%; height: auto;');
  
  // 인용구 스타일
  html = addStyle('blockquote', 'border-left: 4px solid #d1d5db; padding-left: 1.5rem; padding-top: 1rem; padding-bottom: 1rem; margin: 2rem 0; color: #4b5563; font-style: italic;');
  
  return html;
}
