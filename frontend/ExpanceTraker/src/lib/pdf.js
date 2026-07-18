function buildSimplePdf(lines) {
  const pageWidth = 595;
  const pageHeight = 842;
  const left = 50;
  const top = 790;
  const lineHeight = 18;
  const maxLinesPerPage = 40;
  const pages = [];

  for (let index = 0; index < lines.length; index += maxLinesPerPage) {
    pages.push(lines.slice(index, index + maxLinesPerPage));
  }

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  let objectIndex = 1;

  const addObject = (content) => {
    offsets[objectIndex] = pdf.length;
    pdf += `${objectIndex} 0 obj\n${content}\nendobj\n`;
    objectIndex += 1;
    return objectIndex - 1;
  };

  const fontObject = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const pageObjectIds = [];

  pages.forEach((pageLines) => {
    const textCommands = pageLines
      .map((line, lineIndex) => {
        const safeLine = escapePdfText(line);
        const y = top - lineIndex * lineHeight;
        return `BT /F1 12 Tf 1 0 0 1 ${left} ${y} Tm (${safeLine}) Tj ET`;
      })
      .join('\n');

    const streamObject = addObject(
      `<< /Length ${textCommands.length} >>\nstream\n${textCommands}\nendstream`
    );

    const pageObject = addObject(
      `<< /Type /Page /Parent PAGES_REF /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${streamObject} 0 R /Resources << /Font << /F1 ${fontObject} 0 R >> >> >>`
    );

    pageObjectIds.push(pageObject);
  });

  const pagesObjectId = addObject(
    `<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] >>`
  );

  pdf = pdf.replaceAll('PAGES_REF', `${pagesObjectId} 0 R`);

  const catalogObjectId = addObject(`<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`);
  const xrefOffset = pdf.length;

  pdf += `xref\n0 ${objectIndex}\n`;
  pdf += '0000000000 65535 f \n';

  for (let index = 1; index < objectIndex; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objectIndex} /Root ${catalogObjectId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

function escapePdfText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

export { buildSimplePdf };
