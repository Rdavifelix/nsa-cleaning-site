#!/usr/bin/env python3
"""Gera o QR e o cartao impresso para pedir avaliacao no fim da limpeza.

    python3 scripts/review-kit.py            # gera os dois destinos
    python3 scripts/review-kit.py --abrir    # idem, e abre a pasta

Precisa do segno (pip install segno). Saida em docs/review-kit/. Nada disso entra no site:
e material para imprimir e mandar por mensagem.

Dois destinos:

  google.*  aponta direto para a caixa de avaliacao do Google. E o caminho que o Google
            permite sem ressalva, e o que mais converte, porque tem um passo a menos.
  site.*    aponta para /leave-a-review, a pagina com o seletor de estrelas: 5 vai para o
            Google, 1 a 4 para um recado privado ao Ronie. Esse filtro e proibido pelo Google
            (decisao registrada em docs/GBP.md, 30/10/2026); o perfil ja foi suspenso uma vez.
"""
import json, pathlib, re, sys, subprocess
import segno

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'docs' / 'review-kit'
cfg = json.loads((ROOT / 'site.config.json').read_text())
b = cfg['business']

ALVOS = {
    'google': (b['googleReviewUrl'], 'direto na caixa de avaliacao do Google'),
    'site':   (cfg['siteUrl'] + '/leave-a-review/', 'na pagina do site, com o seletor de estrelas'),
}

CARTAO = """<!doctype html>
<html lang="en"><meta charset="utf-8">
<title>NSA Cleaning &mdash; review card</title>
<style>
  @page {{ size: 3.5in 2in; margin: 0; }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; font-family: "Libre Franklin", "Helvetica Neue", Arial, sans-serif; }}
  .card {{
    width: 3.5in; height: 2in; padding: 0.17in 0.18in; background: #fff; color: #0A1F44;
    display: grid; grid-template-columns: 1fr 1.42in; gap: 0.14in; align-items: center;
    border: 1px solid #E5E7EB;
  }}
  h1 {{ margin: 0 0 0.05in; font-size: 13pt; line-height: 1.12; letter-spacing: -0.005em; }}
  p {{ margin: 0 0 0.055in; font-size: 8pt; line-height: 1.3; color: #374151; }}
  .mark {{ font-size: 6.4pt; letter-spacing: 0.07em; text-transform: uppercase; color: #0B70E0;
           margin: 0 0 0.06in; white-space: nowrap; font-weight: 700; }}
  .foot {{ font-size: 6.2pt; color: #4B5563; margin: 0.06in 0 0; white-space: nowrap; }}
  .qr {{ width: 1.42in; height: 1.42in; }}
  .qr svg {{ width: 100%; height: 100%; display: block; }}
  @media screen {{ body {{ background: #F8FAFC; padding: 24px; }} .card {{ margin: 0 auto; }} }}
</style>
<div class="card">
  <div>
    <p class="mark">NSA Cleaning LLC</p>
    <h1>How did we do?</h1>
    <p>Tell us how your cleaning went. A short review on Google takes a minute and helps other families find us.</p>
    <p>Point your phone camera at the code.</p>
    <p class="foot">Insured &middot; {phone}</p>
  </div>
  <div class="qr">{qr}</div>
</div>
</html>
"""

OUT.mkdir(parents=True, exist_ok=True)
for nome, (url, desc) in ALVOS.items():
    qr = segno.make(url, error='h')
    qr.save(OUT / f'{nome}-qr.svg', scale=10, dark='#0A1F44', light=None, border=2)
    qr.save(OUT / f'{nome}-qr.png', scale=12, dark='#0A1F44', light='#FFFFFF', border=2)
    # segno emite width/height fixos e nenhum viewBox. Sem viewBox, width:100% no CSS
    # estica a caixa do svg mas nao escala o desenho, e o QR sai do tamanho de uma unha.
    svg_inline = re.sub(
        r'<svg width="(\d+)" height="(\d+)"',
        lambda m: f'<svg viewBox="0 0 {m.group(1)} {m.group(2)}" width="100%" height="100%"',
        qr.svg_inline(dark='#0A1F44', light=None, border=2), count=1)
    if 'viewBox' not in svg_inline:
        raise SystemExit('o svg do segno mudou de formato: o viewBox nao foi inserido')
    (OUT / f'{nome}-card.html').write_text(CARTAO.format(qr=svg_inline, phone=b['phone']))
    print(f'{nome:7s} -> {desc}')
    print(f'        {url}')
    print(f'        {nome}-qr.svg, {nome}-qr.png, {nome}-card.html')

print(f'\nEm {OUT.relative_to(ROOT)}/')
print('Imprimir: abrir o -card.html no navegador e mandar imprimir em 3.5 x 2 pol (tamanho de cartao de visita).')
if '--abrir' in sys.argv:
    subprocess.run(['open', str(OUT)])
