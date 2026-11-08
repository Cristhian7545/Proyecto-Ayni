import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parse, serializeOuter } from 'parse5';
import prettier from 'prettier';

// Conversión reproducible de las exportaciones originales. No se ejecuta en la app.
const project = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const source = path.resolve(
  project,
  '../stitch_redise_o_comunitario_entrevecinos',
);
const screens = [
  ['inicio_entrevecinos', 'Inicio', '/inicio', 'Inicio'],
  [
    'trueques_e_intercambios_entrevecinos',
    'Trueques',
    '/trueques-e-intercambios',
    'Trueques e Intercambios',
  ],
  [
    'apoyo_solidario_entrevecinos',
    'ApoyoSolidario',
    '/apoyo-solidario',
    'Apoyo Solidario',
  ],
  [
    'emprendimientos_y_servicios_entrevecinos',
    'Emprendimientos',
    '/emprendimientos-y-servicios',
    'Emprendimientos y Servicios',
  ],
  [
    'eventos_del_barrio_entrevecinos',
    'Eventos',
    '/eventos-del-barrio',
    'Eventos del Barrio',
  ],
  [
    'comunidades_y_aprobaci_n_entrevecinos',
    'Comunidades',
    '/comunidades',
    'Comunidades',
  ],
  ['mi_perfil_entrevecinos', 'Perfil', '/mi-perfil', 'Mi Perfil'],
  [
    'perfil_de_vecino_y_detalle_entrevecinos',
    'PerfilVecino',
    '/perfil-de-vecino',
    'Perfil del Vecino y Detalle',
  ],
  [
    'mensajer_a_y_chat_entre_vecinos_entrevecinos',
    'Mensajes',
    '/mensajes',
    'Mensajería Vecinal',
  ],
];
const routePaths = new Set(screens.map((s) => s[2].slice(1)));
const voidTags = new Set(
  'area base br col embed hr img input link meta param source track wbr'.split(
    ' ',
  ),
);
const booleanAttrs = new Set(
  'allowfullscreen autofocus checked controls default defer disabled formnovalidate hidden inert loop multiple muted nomodule novalidate open playsinline readonly required reversed selected'.split(
    ' ',
  ),
);
const attrNames = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  novalidate: 'noValidate',
  formnovalidate: 'formNoValidate',
  srcset: 'srcSet',
  crossorigin: 'crossOrigin',
  fillrule: 'fillRule',
  cliprule: 'clipRule',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  viewbox: 'viewBox',
};
const eventNames = {
  onclick: 'onClick',
  onsubmit: 'onSubmit',
  onchange: 'onChange',
  oninput: 'onInput',
};
const resources = new Map();
const reports = [];
let commonHeader, commonFooter, theme;
const stable = (value) =>
  JSON.stringify(value, (_, item) =>
    item && typeof item === 'object' && !Array.isArray(item)
      ? Object.fromEntries(
          Object.entries(item).sort(([a], [b]) => a.localeCompare(b)),
        )
      : item,
  );
const find = (node, predicate) => {
  if (predicate(node)) return node;
  for (const child of node.childNodes || []) {
    const result = find(child, predicate);
    if (result) return result;
  }
};
const walk = (node, fn) => {
  fn(node);
  (node.childNodes || []).forEach((child) => walk(child, fn));
};
const attr = (node, name) => node.attrs?.find((a) => a.name === name)?.value;
const setAttr = (node, name, value) => {
  const old = node.attrs.find((a) => a.name === name);
  if (old) old.value = value;
  else node.attrs.push({ name, value });
};
const write = async (relative, content) => {
  const target = path.join(project, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (/\.(jsx?|mjs)$/.test(relative))
    content = await prettier.format(content, {
      parser: 'babel',
      singleQuote: true,
    });
  fs.writeFileSync(target, content);
};
const asset = (url) => {
  if (!/^https?:/.test(url)) return url;
  if (!resources.has(url)) {
    const hash = crypto
      .createHash('sha256')
      .update(url)
      .digest('hex')
      .slice(0, 16);
    resources.set(url, `/assets/images/${hash}.jpg`);
  }
  return resources.get(url);
};
function styleObject(value) {
  return Object.fromEntries(
    value
      .split(';')
      .filter((s) => s.includes(':'))
      .map((s) => {
        const i = s.indexOf(':');
        const key = s.slice(0, i).trim();
        return [
          key.startsWith('--')
            ? key
            : key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
          s.slice(i + 1).trim(),
        ];
      }),
  );
}
function jsx(node, context = {}) {
  if (node.nodeName === '#text')
    return node.value ? `{${JSON.stringify(node.value)}}` : '';
  if (!node.tagName) return '';
  if (node.tagName === 'script' || node.tagName === 'style') return '';
  if (node.component) return `<${node.component} />`;
  let tag = node.tagName;
  if (tag === 'aside') {
    tag = 'Sidebar';
    context.imports?.add('Sidebar');
  }
  if (tag === 'article') {
    tag = 'PublicacionCard';
    context.imports?.add('PublicacionCard');
  }
  const isNav = tag === 'a' && routePaths.has(attr(node, 'data-path'));
  const isChat =
    tag === 'button' && attr(node, 'aria-label') === 'Mensajes y Chat';
  const isNeighbor = tag === 'a' && node.neighbor;
  const isBreadcrumb = tag === 'a' && !!node.destination;
  if (isNav) tag = 'NavLink';
  if (isChat || isNeighbor || isBreadcrumb) tag = 'Link';
  let attrs = '';
  const inputType = attr(node, 'type');
  for (const { name, value: originalValue } of node.attrs || []) {
    let value = originalValue;
    if (name === 'aria-current' && isNav) continue;
    if (name === 'href' && (isNav || isNeighbor || isBreadcrumb)) continue;
    if (name === 'type' && isChat) continue;
    if (name === 'style') {
      value = value.replace(
        /url\((['"]?)(https?:[^)'"\s]+)\1\)/g,
        (_, quote, url) => `url('${asset(url)}')`,
      );
      attrs += ` style={${JSON.stringify(styleObject(value))}}`;
      continue;
    }
    if (eventNames[name]) {
      let handler = value
        .replace(/\bthis\b/g, 'event.currentTarget')
        .replace(/\bdocument\b/g, 'actions.document');
      const functions = context.functions || [];
      for (const fn of functions)
        handler = handler.replace(
          new RegExp(`\\b${fn}\\s*\\(`, 'g'),
          `actions.${fn}(`,
        );
      attrs += ` ${eventNames[name]}={(event) => controller.run((actions) => { ${handler} })}`;
      continue;
    }
    if (name === 'class' && isNav) {
      attrs += ` className={({ isActive }) => isActive ? ${JSON.stringify(context.activeNav)} : ${JSON.stringify(context.inactiveNav)}}`;
      continue;
    }
    if (name === 'src' && tag === 'img') value = asset(value);
    let prop = attrNames[name] || name;
    if (name === 'checked') prop = 'defaultChecked';
    if (name === 'value' && ['input', 'textarea', 'select'].includes(tag))
      prop = 'defaultValue';
    if (name === 'selected') continue;
    if (booleanAttrs.has(name)) {
      attrs += ` ${prop}={true}`;
      continue;
    }
    attrs += ` ${prop}=${JSON.stringify(value).replace(/\\"/g, '&quot;')}`;
  }
  if (isNav) attrs += ` to="/${attr(node, 'data-path')}"`;
  if (isChat) attrs += ' to="/mensajes"';
  if (isNeighbor) attrs += ' to="/perfil-de-vecino"';
  if (isBreadcrumb) attrs += ` to="${node.destination}"`;
  if (node.messageLink) attrs += ' onClick={() => navigate("/mensajes")}';
  if (tag === 'button' && !inputType) attrs += ' type="button"';
  if (voidTags.has(tag)) return `<${tag}${attrs} />`;
  if (tag === 'textarea') {
    const initial = (node.childNodes || []).map((n) => n.value || '').join('');
    return `<textarea${attrs} defaultValue={${JSON.stringify(initial)}} />`;
  }
  let children = (node.childNodes || [])
    .map((child) => jsx(child, context))
    .join('');
  if (node.neighborName)
    children = `<Link to="/perfil-de-vecino" data-neighbor-link="true">${children}</Link>`;
  return `<${tag}${attrs}>${children}</${tag}>`;
}

for (const [folder, name, route, title] of screens) {
  const html = fs.readFileSync(path.join(source, folder, 'code.html'), 'utf8');
  const doc = parse(html);
  const header = find(doc, (n) => n.tagName === 'header');
  const footer = find(doc, (n) => n.tagName === 'footer');
  const main = find(doc, (n) => n.tagName === 'main');
  const body = find(doc, (n) => n.tagName === 'body');
  if (!commonHeader) {
    commonHeader = header;
    commonFooter = footer;
  }
  const config = html.match(/tailwind\.config\s*=\s*([\s\S]*?);<\/script>/)[1];
  const parsedConfig = JSON.parse(config);
  if (!theme) theme = parsedConfig;
  if (stable(parsedConfig) !== stable(theme))
    throw new Error(`Tema diferente: ${folder}`);
  let script = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter((m) => !m[1].includes('tailwind') && m[2].trim())
    .map((m) => m[2])
    .join('\n');
  const inlineHandlers = [];
  walk(body, (node) =>
    (node.attrs || [])
      .filter((a) => eventNames[a.name])
      .forEach((a) => inlineHandlers.push(a.value)),
  );
  const functions = [...script.matchAll(/\bfunction\s+(\w+)\s*\(/g)]
    .map((m) => m[1])
    .filter((fn) =>
      inlineHandlers.some((handler) =>
        new RegExp(`\\b${fn}\\s*\\(`).test(handler),
      ),
    );
  // Los listeners sobre elementos también deben limpiarse al desmontar la vista.
  script = script.replace(
    /\b(?!document\b|window\b)([\w$]+)\.addEventListener\(/g,
    'listen($1, ',
  );
  // Las plantillas originales se conservan; escapar únicamente los datos escritos por el usuario.
  script = script.replace(
    /\$\{(text|val|name|category|desc|district)\}/g,
    '${escapeUserText($1)}',
  );
  // La cola de comunidades inserta botones dinámicos: delegación local, sin globals.
  script = script.replace(
    /onclick="(rejectCommunity|approveCommunity)\('\$\{newCardId\}', '\$\{escapeUserText\(name\)\}'\)"/g,
    'data-community-action="$1" data-card-id="${newCardId}" data-community-name="${escapeUserText(name)}"',
  );
  if (name === 'Comunidades')
    script += `\n document.addEventListener('click', event => {
    const button=event.target.closest('[data-community-action]');
    if (!button) return;
    const action=button.dataset.communityAction === 'approveCommunity' ? approveCommunity : rejectCommunity;
    action(button.dataset.cardId, button.dataset.communityName);
  });\n`;
  await write(
    `src/controllers/${name}Controller.js`,
    `// Interacciones locales trasladadas desde ${folder}/code.html.\nexport default function initialize({document, window, listen, setTimeout, requestAnimationFrame}) {\nconst escapeUserText = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));\n${script}\nreturn {document, ${functions.join(', ')}};\n}`,
  );
  const context = { imports: new Set(), functions };
  // Conectar únicamente los enlaces existentes a la pantalla de detalle disponible.
  walk(main, (node) => {
    const directText = (node.childNodes || [])
      .filter((child) => child.nodeName === '#text')
      .map((child) => child.value)
      .join('')
      .trim();
    if (node.tagName === 'a' && attr(node, 'href') === '#') {
      if (directText === 'Inicio') node.destination = '/inicio';
      if (directText === 'Trueques e Intercambios')
        node.destination = '/trueques-e-intercambios';
    }
    if (
      name === 'Trueques' &&
      directText === 'Manuel Vílchez' &&
      node.tagName !== 'a'
    )
      node.neighborName = true;
    if (
      name !== 'Mensajes' &&
      node.tagName === 'button' &&
      attr(node, 'type') !== 'submit' &&
      !attr(node, 'onclick')
    ) {
      const label = serializeOuter(node)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (/Enviar mensaje|Contactar a Rosa|Contactar a Manuel/.test(label))
        node.messageLink = true;
    }
    if (node.tagName === 'a' && attr(node, 'href') === '#') {
      const text = serializeOuter(node);
      if (/Manuel Vílchez|Ver perfil|Ver detalle/i.test(text))
        node.neighbor = true;
    }
  });
  if (name === 'Inicio') {
    const section = find(
      main,
      (n) =>
        n.tagName === 'section' &&
        !!find(n, (c) => attr(c, 'id') === 'carousel-track'),
    );
    await write(
      'src/components/MuralCarrusel.jsx',
      `// Mural original de Inicio. El controlador de Inicio conserva su carrusel.\nexport default function MuralCarrusel() { return (${jsx(section)}); }`,
    );
    section.component = 'MuralCarrusel';
    context.imports.add('MuralCarrusel');
  }
  // Algunas exportaciones sitúan sus modales después de </main>. Incluir
  // también esos hermanos para conservar todas las pantallas auxiliares.
  const content = `<div ref={controller.rootRef} className="contents" data-stitch-view="${name}">${body.childNodes
    .filter((node) => node !== header && node !== footer)
    .map((node) => jsx(node, context))
    .join('')}</div>`;
  const imports = [...context.imports]
    .map((c) => `import ${c} from '../components/${c}.jsx';`)
    .join('\n');
  await write(
    `src/views/${name}.jsx`,
    `import { Link, NavLink, useNavigate } from 'react-router-dom';\nimport useStitchController from '../controllers/useStitchController.js';\nimport initialize from '../controllers/${name}Controller.js';\n${imports}\nexport default function ${name}() {\n const controller=useStitchController(initialize);\n const navigate=useNavigate();\n return (${content});\n}`,
  );
  const reference = path.join(
    project,
    'public/assets/referencias',
    `${name}.png`,
  );
  fs.mkdirSync(path.dirname(reference), { recursive: true });
  fs.copyFileSync(path.join(source, folder, 'screen.png'), reference);
  reports.push({
    folder,
    name,
    route,
    title,
    mainClass: attr(main, 'class'),
    bodyClass: attr(body, 'class'),
    originalArticles: html.match(/<article\b/g)?.length || 0,
    headerHash: crypto
      .createHash('sha256')
      .update(serializeOuter(header).replace(/aria-current="page"/g, ''))
      .digest('hex'),
  });
}

const nav = find(commonHeader, (n) => n.tagName === 'nav');
const navAnchors = nav.childNodes.filter((n) => n.tagName === 'a');
const activeNav = attr(navAnchors[0], 'class');
const inactiveNav = attr(navAnchors[1], 'class');
await write(
  'src/components/Header.jsx',
  `import { Link, NavLink } from 'react-router-dom';\nexport default function Header() {return (${jsx(commonHeader, { activeNav, inactiveNav })});}`,
);
await write(
  'src/components/Footer.jsx',
  `export default function Footer() {return (${jsx(commonFooter)});}`,
);
await write(
  'tailwind.config.js',
  `// Tokens exactos de los nueve HTML exportados por Stitch.\nexport default ${JSON.stringify({ ...theme, content: ['./index.html', './src/**/*.{js,jsx}'] })};`,
);
const sourceHtml = fs.readFileSync(
  path.join(source, screens[0][0], 'code.html'),
  'utf8',
);
const styles = [...sourceHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
  .map((m) => m[1])
  .join('\n');
fs.mkdirSync(path.join(project, 'src/styles'), { recursive: true });
fs.writeFileSync(
  path.join(project, 'src/styles/index.css'),
  `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Reglas originales de Stitch. Los tokens están en tailwind.config.js. */\n${styles}\n`,
);
fs.mkdirSync(path.join(project, 'src/models'), { recursive: true });
await write(
  'src/routes/screenRoutes.js',
  `// Inventario de pantallas realmente presentes en la exportación.\nexport const screenRoutes = ${JSON.stringify(reports.map(({ name, route, title }) => ({ name, path: route, title })))};`,
);
await write(
  'src/routes/AppRoutes.jsx',
  `import { lazy, Suspense, useEffect } from 'react';\nimport { Routes, Route, Navigate, useLocation } from 'react-router-dom';\nimport { screenRoutes } from './screenRoutes.js';\n${screens.map((s) => `const ${s[1]} = lazy(() => import('../views/${s[1]}.jsx'));`).join('\n')}\nexport default function AppRoutes() {\nconst {pathname}=useLocation();\nuseEffect(()=>{window.scrollTo(0,0);document.title='EntreVecinos · '+(screenRoutes.find(route=>route.path===pathname)?.title || 'Inicio');},[pathname]);\nreturn <Suspense fallback={null}><Routes><Route path="/" element={<Navigate to="/inicio" replace />} />${screens.map((s) => `<Route path="${s[2]}" element={<${s[1]} />} />`).join('')}<Route path="*" element={<Navigate to="/inicio" replace />} /></Routes></Suspense>;\n}`,
);

// Obtener copias de los recursos que ya utiliza Stitch; una copia por URL.
fs.mkdirSync(path.join(project, 'public/assets/images'), { recursive: true });
const assetResults = await Promise.all(
  [...resources].map(async ([url, local]) => {
    const target = path.join(project, 'public', local);
    try {
      if (!fs.existsSync(target)) {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(30000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()));
      }
      return { url, local, status: 'local' };
    } catch (error) {
      return { url, local, status: 'remote', reason: error.message };
    }
  }),
);
for (const failed of assetResults.filter((a) => a.status === 'remote')) {
  for (const file of fs.readdirSync(path.join(project, 'src/views'))) {
    const target = path.join(project, 'src/views', file);
    fs.writeFileSync(
      target,
      fs.readFileSync(target, 'utf8').replaceAll(failed.local, failed.url),
    );
  }
}
fs.mkdirSync(path.join(project, 'docs'), { recursive: true });
fs.writeFileSync(
  path.join(project, 'docs/inventario-stitch.json'),
  JSON.stringify(
    {
      source: '../stitch_redise_o_comunitario_entrevecinos',
      screens: reports,
      assets: assetResults,
    },
    null,
    2,
  ),
);
fs.copyFileSync(
  path.join(source, 'vecindario_c_lido/DESIGN.md'),
  path.join(project, 'docs/DESIGN-original.md'),
);
console.log(
  JSON.stringify(
    {
      screens: reports.length,
      assets: assetResults.length,
      local: assetResults.filter((a) => a.status === 'local').length,
      failed: assetResults.filter((a) => a.status === 'remote'),
    },
    null,
    2,
  ),
);
