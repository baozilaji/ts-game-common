const PAD = (n: number, len = 2): string => String(n).padStart(len, '0');

export function dateToString(d: Date, fmt = '%Y-%m-%d %H:%M:%S'): string {
  const map: Record<string, string> = {
    '%Y': String(d.getFullYear()),
    '%m': PAD(d.getMonth() + 1),
    '%d': PAD(d.getDate()),
    '%H': PAD(d.getHours()),
    '%M': PAD(d.getMinutes()),
    '%S': PAD(d.getSeconds()),
  };
  return fmt.replace(/%[YmdHMS]/g, (match) => map[match] || match);
}

const TOKEN_RE: Record<string, string> = {
  '%Y': '(\\d{4})',
  '%m': '(\\d{2})',
  '%d': '(\\d{2})',
  '%H': '(\\d{2})',
  '%M': '(\\d{2})',
  '%S': '(\\d{2})',
};

export function stringToDate(s: string, fmt = '%Y-%m-%d %H:%M:%S'): Date {
  let re = fmt;
  for (const k of Object.keys(TOKEN_RE)) re = re.split(k).join(TOKEN_RE[k]);
  const m = s.match(new RegExp(`^${re}$`));
  if (!m) throw new Error(`Invalid date string: ${s}`);
  const order = fmt.match(/%[YmdHMS]/g) || [];
  const vals: Record<string, number> = { Y: 0, m: 1, d: 1, H: 0, M: 0, S: 0 };
  order.forEach((t, i) => {
    vals[t[1]] = parseInt(m[i + 1], 10);
  });
  return new Date(vals.Y, vals.m - 1, vals.d, vals.H, vals.M, vals.S);
}
