const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toFa(input) {
  if (input === null || input === undefined) return '';
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function esc(input) {
  if (input === null || input === undefined) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function ltr(text, extraClass = '') {
  const cls = extraClass ? `ltr-tech ${extraClass}` : 'ltr-tech';
  return `<bdi dir="ltr" class="${cls}">${esc(text)}</bdi>`;
}

export function formatToman(amount) {
  const formatted = Number(amount).toLocaleString('en-US').replace(/,/g, '٬');
  return `${toFa(formatted)} تومان`;
}
