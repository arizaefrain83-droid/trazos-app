const r1 = (n: number) => Math.round(n * 10) / 10;

export function circle(cx: number, cy: number, r: number): string {
  return `M${r1(cx + r)} ${cy} A${r} ${r} 0 1 1 ${r1(cx - r)} ${cy} A${r} ${r} 0 1 1 ${r1(cx + r)} ${cy}`;
}

export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${r1(cx + rx)} ${cy} A${rx} ${ry} 0 1 1 ${r1(cx - rx)} ${cy} A${rx} ${ry} 0 1 1 ${r1(cx + rx)} ${cy}`;
}

export function petal(cx: number, cy: number, angleDeg: number, inner: number, length: number, width: number): string {
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const px = -dy;
  const py = dx;
  const bx = cx + dx * inner;
  const by = cy + dy * inner;
  const tx = cx + dx * (inner + length);
  const ty = cy + dy * (inner + length);
  const mx = cx + dx * (inner + length * 0.55);
  const my = cy + dy * (inner + length * 0.55);
  return `M${r1(bx)} ${r1(by)} Q${r1(mx + px * width)} ${r1(my + py * width)} ${r1(tx)} ${r1(ty)} Q${r1(mx - px * width)} ${r1(my - py * width)} ${r1(bx)} ${r1(by)}`;
}

/** Approximate length of an absolute-command SVG path (M L H V Q C A Z), used to time the stroke animation. */
export function pathLength(d: string): number {
  const tokens = d.match(/[MLHVQCAZ]|-?\d*\.?\d+/g) ?? [];
  let i = 0;
  let cmd = "M";
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  let total = 0;
  const num = () => parseFloat(tokens[i++]);
  const sample = (f: (t: number) => [number, number]) => {
    let px = x;
    let py = y;
    for (let k = 1; k <= 16; k++) {
      const [qx, qy] = f(k / 16);
      total += Math.hypot(qx - px, qy - py);
      px = qx;
      py = qy;
    }
  };
  while (i < tokens.length) {
    if (/[A-Z]/.test(tokens[i])) cmd = tokens[i++];
    if (cmd === "Z") {
      total += Math.hypot(sx - x, sy - y);
      x = sx;
      y = sy;
      continue;
    }
    if (cmd === "M") {
      x = sx = num();
      y = sy = num();
      cmd = "L";
    } else if (cmd === "L" || cmd === "H" || cmd === "V") {
      const nx = cmd === "V" ? x : num();
      const ny = cmd === "H" ? y : cmd === "V" ? num() : num();
      total += Math.hypot(nx - x, ny - y);
      x = nx;
      y = ny;
    } else if (cmd === "Q") {
      const [cx, cy, ex, ey] = [num(), num(), num(), num()];
      const [ox, oy] = [x, y];
      sample((t) => [(1 - t) ** 2 * ox + 2 * (1 - t) * t * cx + t * t * ex, (1 - t) ** 2 * oy + 2 * (1 - t) * t * cy + t * t * ey]);
      x = ex;
      y = ey;
    } else if (cmd === "C") {
      const [c1x, c1y, c2x, c2y, ex, ey] = [num(), num(), num(), num(), num(), num()];
      const [ox, oy] = [x, y];
      const b = (t: number, a: number, p: number, q: number, e: number) =>
        (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * p + 3 * (1 - t) * t * t * q + t ** 3 * e;
      sample((t) => [b(t, ox, c1x, c2x, ex), b(t, oy, c1y, c2y, ey)]);
      x = ex;
      y = ey;
    } else if (cmd === "A") {
      const rx = num();
      const ry = num();
      i += 3;
      const ex = num();
      const ey = num();
      // Every arc in this app is a half ellipse.
      total += Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
      x = ex;
      y = ey;
    } else {
      i++;
    }
  }
  return total;
}

export function star(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${r1(cx + Math.cos(a) * rad)} ${r1(cy + Math.sin(a) * rad)}`);
  }
  return `M${pts.join(" L")} Z`;
}
