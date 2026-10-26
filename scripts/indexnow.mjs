// Avisa Bing e Yandex de URLs novas ou alteradas, via IndexNow.
// Não precisa de login em lugar nenhum: a autenticação é o arquivo de chave hospedado no próprio site.
//   node scripts/indexnow.mjs                  envia o sitemap inteiro
//   node scripts/indexnow.mjs /kitchen-remodeling  envia só essas
//
// O Google não participa do IndexNow. Para ele o caminho é o Search Console.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// dirname() de um caminho terminado em barra sobe um nivel a mais; fileURLToPath resolve certo.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const host = new URL(process.env.SITE_URL || site.siteUrl).host;

const chave = fs.readdirSync(path.join(ROOT, 'public'))
  .map((f) => f.match(/^([0-9a-f]{32})\.txt$/)?.[1]).find(Boolean);
if (!chave) { console.error('Nenhum arquivo de chave em public/. Crie public/<chave>.txt com a chave dentro.'); process.exit(1); }

let urls = process.argv.slice(2);
if (!urls.length) {
  const sm = path.join(ROOT, 'dist', 'sitemap.xml');
  if (!fs.existsSync(sm)) { console.error('Sem dist/sitemap.xml. Rode o build antes.'); process.exit(1); }
  urls = [...fs.readFileSync(sm, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
} else {
  urls = urls.map((u) => (u.startsWith('http') ? u : `https://${host}${u.startsWith('/') ? '' : '/'}${u}`));
}

const corpo = { host, key: chave, keyLocation: `https://${host}/${chave}.txt`, urlList: urls };
console.log(`Enviando ${urls.length} URLs de ${host}`);
const r = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(corpo),
});
// 200 e 202 são aceite. 403 quase sempre é a chave não acessível no ar.
console.log(`HTTP ${r.status}`, r.status === 403 ? '→ confira se a chave está publicada em ' + corpo.keyLocation : '');
if (r.status >= 400) { console.error(await r.text()); process.exit(1); }
console.log('Aceito.');
