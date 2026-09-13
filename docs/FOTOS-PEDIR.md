# Fotos que faltam para o site da NSA Cleaning

Todas as fotos enviadas até agora já estão no site (28 de 29; 4 arquivos eram flyers com texto com erro e foram descartados).
O acervo atual cobre: quartos, sala, cozinha e banheiro residenciais, decks e cabana à beira do lago, preparação de pintura,
um par antes/depois de banheira, o carro adesivado, dois retratos e o mapa da área de atendimento.

As seções abaixo estão hoje sem foto real porque não existe nenhuma imagem desses serviços.

## Prioridade alta

1. **Escritório (comercial)** — 3 a 4 fotos de um escritório já limpo: mesas com monitores, sala de reunião, copa, recepção.
   Sem essas fotos, toda a seção comercial do site fica só com ícones.
2. **Clínica ou hospital** — 2 a 3 fotos: sala de espera, consultório, recepção, banheiro. Sem paciente e sem tela com dados visíveis.
3. **Área comum de prédio** — 2 fotos: hall de entrada, corredor, escada ou elevador.
4. **Equipe uniformizada trabalhando** — 4 a 5 fotos: uniforme cinza, com aspirador, esfregão, pano, carrinho de material.
   Pode ser de costas ou de lado. É o tipo de foto que mais gera confiança e hoje não existe nenhuma.
5. **Carpete** — 3 a 4 fotos: a máquina de extração em ação e o antes/depois de uma mancha ou de uma faixa do carpete.

## Prioridade média

6. **Antes e depois em geral** — o máximo que tiver: cozinha, fogão, forno por dentro, geladeira, box do chuveiro, vaso,
   rejunte, janela. É o que mais converte. Hoje o site só tem um par (a banheira).
7. **Casa vazia de mudança (move-out)** — 2 a 3 fotos: cômodo vazio já limpo, armário aberto e vazio, piso limpo sem móveis.
8. **Pós-obra** — 3 a 4 fotos: o antes com poeira, respingo de tinta e entulho, e o depois limpo.
   Hoje a página só tem fotos de preparação de pintura.
9. **Power washing: o antes** — 2 a 3 fotos de deck ou siding sujo, com limo e escuro, antes de lavar. Só temos os depois.
10. **Restaurante, academia ou concessionária** — 2 fotos de cada um a que ele tiver acesso.

## Como tirar

- Celular serve. Horizontal (deitado) para as fotos principais, algumas na vertical.
- Luz acesa e cortina aberta. Sem filtro e sem flash direto no espelho.
- **Antes e depois do mesmo ângulo**: marcar onde pisou e tirar a segunda foto do mesmo lugar.
  Par que não bate de ângulo não serve para o comparador do site.
- Sem rosto de cliente, sem documento, sem tela com dados, sem número da casa aparecendo.
- Pedir autorização ao dono do imóvel antes de usar foto de um trabalho no site.

## Como enviar

As fotos atuais chegaram comprimidas pelo WhatsApp (768 a 1024 px), que é o limite de qualidade do site hoje.
Enviar as novas **como documento no WhatsApp, por e-mail ou AirDrop**, sem compressão, para ficarem nítidas em tela grande.

## Onde cada foto vai entrar

| Foto | Páginas |
|---|---|
| Escritório, clínica/hospital, área comum, restaurante, academia, concessionária | Home (faixa comercial), /commercial-cleaning, /services |
| Equipe uniformizada | Home ("Why NSA"), /about, páginas de serviço |
| Carpete | Home (bloco Carpet cleaning), /carpet-cleaning |
| Antes/depois gerais | /deep-cleaning, /recurring-cleaning, home (comparador) |
| Move-out | Home (bloco Move-in / move-out), /move-in-move-out-cleaning |
| Pós-obra | Home (bloco Post-construction), /post-construction-cleaning |
| Power washing antes | /power-washing, home |

Depois de receber: colocar os arquivos em `raw-images/`, adicionar as entradas em `raw-images/manifest.json`
(slug, alt, categoria, uso, larguras) e rodar `python3 scripts/optimize-images.py`.
