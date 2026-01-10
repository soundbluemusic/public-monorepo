/**
 * @fileoverview colors.json에 colorCode(hex) 필드 추가
 *
 * CSS 표준 색상명 + 커스텀 색상 매핑을 조합하여
 * 각 색상 엔트리에 hex 코드를 추가합니다.
 *
 * @example
 * ```bash
 * pnpm tsx apps/context/scripts/add-color-codes.ts
 * ```
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COLORS_FILE = join(__dirname, '../../../data/context/entries/colors.json');

// CSS 표준 색상명 (148개) - https://www.w3.org/TR/css-color-4/#named-colors
const CSS_COLORS: Record<string, string> = {
  aliceblue: '#F0F8FF',
  antiquewhite: '#FAEBD7',
  aqua: '#00FFFF',
  aquamarine: '#7FFFD4',
  azure: '#F0FFFF',
  beige: '#F5F5DC',
  bisque: '#FFE4C4',
  black: '#000000',
  blanchedalmond: '#FFEBCD',
  blue: '#0000FF',
  blueviolet: '#8A2BE2',
  brown: '#A52A2A',
  burlywood: '#DEB887',
  cadetblue: '#5F9EA0',
  chartreuse: '#7FFF00',
  chocolate: '#D2691E',
  coral: '#FF7F50',
  cornflowerblue: '#6495ED',
  cornsilk: '#FFF8DC',
  crimson: '#DC143C',
  cyan: '#00FFFF',
  darkblue: '#00008B',
  darkcyan: '#008B8B',
  darkgoldenrod: '#B8860B',
  darkgray: '#A9A9A9',
  darkgreen: '#006400',
  darkkhaki: '#BDB76B',
  darkmagenta: '#8B008B',
  darkolivegreen: '#556B2F',
  darkorange: '#FF8C00',
  darkorchid: '#9932CC',
  darkred: '#8B0000',
  darksalmon: '#E9967A',
  darkseagreen: '#8FBC8F',
  darkslateblue: '#483D8B',
  darkslategray: '#2F4F4F',
  darkturquoise: '#00CED1',
  darkviolet: '#9400D3',
  deeppink: '#FF1493',
  deepskyblue: '#00BFFF',
  dimgray: '#696969',
  dodgerblue: '#1E90FF',
  firebrick: '#B22222',
  floralwhite: '#FFFAF0',
  forestgreen: '#228B22',
  fuchsia: '#FF00FF',
  gainsboro: '#DCDCDC',
  ghostwhite: '#F8F8FF',
  gold: '#FFD700',
  goldenrod: '#DAA520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#ADFF2F',
  honeydew: '#F0FFF0',
  hotpink: '#FF69B4',
  indianred: '#CD5C5C',
  indigo: '#4B0082',
  ivory: '#FFFFF0',
  khaki: '#F0E68C',
  lavender: '#E6E6FA',
  lavenderblush: '#FFF0F5',
  lawngreen: '#7CFC00',
  lemonchiffon: '#FFFACD',
  lightblue: '#ADD8E6',
  lightcoral: '#F08080',
  lightcyan: '#E0FFFF',
  lightgoldenrodyellow: '#FAFAD2',
  lightgray: '#D3D3D3',
  lightgreen: '#90EE90',
  lightpink: '#FFB6C1',
  lightsalmon: '#FFA07A',
  lightseagreen: '#20B2AA',
  lightskyblue: '#87CEFA',
  lightslategray: '#778899',
  lightsteelblue: '#B0C4DE',
  lightyellow: '#FFFFE0',
  lime: '#00FF00',
  limegreen: '#32CD32',
  linen: '#FAF0E6',
  magenta: '#FF00FF',
  maroon: '#800000',
  mediumaquamarine: '#66CDAA',
  mediumblue: '#0000CD',
  mediumorchid: '#BA55D3',
  mediumpurple: '#9370DB',
  mediumseagreen: '#3CB371',
  mediumslateblue: '#7B68EE',
  mediumspringgreen: '#00FA9A',
  mediumturquoise: '#48D1CC',
  mediumvioletred: '#C71585',
  midnightblue: '#191970',
  mintcream: '#F5FFFA',
  mistyrose: '#FFE4E1',
  moccasin: '#FFE4B5',
  navajowhite: '#FFDEAD',
  navy: '#000080',
  oldlace: '#FDF5E6',
  olive: '#808000',
  olivedrab: '#6B8E23',
  orange: '#FFA500',
  orangered: '#FF4500',
  orchid: '#DA70D6',
  palegoldenrod: '#EEE8AA',
  palegreen: '#98FB98',
  paleturquoise: '#AFEEEE',
  palevioletred: '#DB7093',
  papayawhip: '#FFEFD5',
  peachpuff: '#FFDAB9',
  peru: '#CD853F',
  pink: '#FFC0CB',
  plum: '#DDA0DD',
  powderblue: '#B0E0E6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#FF0000',
  rosybrown: '#BC8F8F',
  royalblue: '#4169E1',
  saddlebrown: '#8B4513',
  salmon: '#FA8072',
  sandybrown: '#F4A460',
  seagreen: '#2E8B57',
  seashell: '#FFF5EE',
  sienna: '#A0522D',
  silver: '#C0C0C0',
  skyblue: '#87CEEB',
  slateblue: '#6A5ACD',
  slategray: '#708090',
  snow: '#FFFAFA',
  springgreen: '#00FF7F',
  steelblue: '#4682B4',
  tan: '#D2B48C',
  teal: '#008080',
  thistle: '#D8BFD8',
  tomato: '#FF6347',
  turquoise: '#40E0D0',
  violet: '#EE82EE',
  wheat: '#F5DEB3',
  white: '#FFFFFF',
  whitesmoke: '#F5F5F5',
  yellow: '#FFFF00',
  yellowgreen: '#9ACD32',
};

// 커스텀 색상 매핑 (CSS에 없는 색상들)
const CUSTOM_COLORS: Record<string, string> = {
  // 기본 색상 변형
  adobe: '#BD6C48',
  ai: '#68A0B0',
  akane: '#B94047',
  almond: '#EFDECD',
  amber: '#FFBF00',
  amethyst: '#9966CC',
  apricot: '#FBCEB1',
  'atomic tangerine': '#FF9966',
  aubergine: '#614051',
  aurora: '#78D64B',
  'autumn leaf': '#A65D1A',
  avocado: '#568203',
  azalea: '#F19CBB',

  // B
  'baby blue': '#89CFF0',
  'baby pink': '#F4C2C2',
  'banana mania': '#FAE7B5',
  'bark brown': '#6E4C30',
  biscuit: '#D4A76A',
  bittersweet: '#FE6F5E',
  blackberry: '#4D0135',
  'blue bell': '#A2A2D0',
  blush: '#DE5D83',
  bone: '#E3DAC9',
  bordeaux: '#6D2C34',
  boysenberry: '#873260',
  brass: '#B5A642',
  brick: '#CB4154',
  'brick red': '#C62D42',
  bronze: '#CD7F32',
  buff: '#F0DC82',
  burgundy: '#800020',
  'burnt orange': '#CC5500',
  'burnt sienna': '#E97451',
  'burnt umber': '#8A3324',
  butter: '#FFFF99',
  buttercream: '#FFFCE0',

  // C
  camel: '#C19A6B',
  camellia: '#E3A9A9',
  cantaloupe: '#FFA62F',
  canyon: '#B97A57',
  caramel: '#FFD59A',
  carnation: '#FFA6C9',
  'carnation pink': '#FFA6C9',
  'celadon green': '#ACE1AF',
  cerulean: '#007BA7',
  champagne: '#F7E7CE',
  cherry: '#DE3163',
  'cherry blossom': '#FFB7C5',
  chestnut: '#954535',
  chrome: '#DBE4EB',
  chrysanthemum: '#FFB7B7',
  cinnabar: '#E34234',
  cinnamon: '#D2691E',
  claret: '#7F1734',
  'classic blue': '#0F4C81',
  clay: '#B66A50',
  cocoa: '#5C3A21',
  coconut: '#965A3E',
  coffee: '#6F4E37',
  copper: '#B87333',
  'copper penny': '#AD6F69',
  cornflower: '#9ACEEB',
  'cosmic latte': '#FFF8E7',
  'cotton candy': '#FFBCD9',
  cranberry: '#9C2542',
  cream: '#FFFDD0',
  currant: '#6B1C2A',

  // D
  dahlia: '#D8A903',
  'dancheong red': '#C8102E',
  dandelion: '#F0E130',
  'dawn pink': '#F4E3E3',
  denim: '#1560BD',
  desert: '#C19A6B',
  dirt: '#9B7653',
  driftwood: '#AF8751',
  dusk: '#4E5481',
  'dusty rose': '#DCAE96',

  // E
  earth: '#A98D6D',
  ecru: '#C2B280',
  eggplant: '#614051',
  eggshell: '#F0EAD6',
  elderberry: '#4F0147',
  'electric blue': '#7DF9FF',
  'electric lime': '#CCFF00',
  emerald: '#50C878',
  espresso: '#3C2415',

  // F
  fawn: '#E5AA70',
  fern: '#71BC78',
  flax: '#EEDC82',
  fluorescent: '#08FF08',
  'forest green': '#228B22',
  'fuzzy wuzzy': '#CC6666',

  // G
  'galaxy purple': '#3A243B',
  gardenia: '#F8F4E6',
  garnet: '#733635',
  ginger: '#B06500',
  'granny smith apple': '#A8E4A0',
  grape: '#6F2DA8',
  greenery: '#88B04B',
  greige: '#B5A794',

  // H
  'hanbok indigo': '#26619C',
  hazelnut: '#A67B5B',
  hemp: '#907B71',
  hibiscus: '#B6316C',
  'highlighter yellow': '#FDFC00',
  honey: '#EB9605',
  honeysuckle: '#E5A6A2',
  hyacinth: '#7B68EE',

  // I
  'ice blue': '#99FFFF',
  'ice pink': '#F7DDDC',
  illuminating: '#F5DF4D',
  'imperial yellow': '#FFD700',
  'inch worm': '#B2EC5D',
  iris: '#5A4FCF',

  // J
  jade: '#00A86B',
  'jade green': '#00A86B',
  jasmine: '#F8DE7E',
  'jazzberry jam': '#A50B5E',
  'jungle green': '#29AB87',

  // K
  kohaku: '#CA6924',

  // L
  'lapis lazuli': '#26619C',
  'laser lemon': '#FFFF66',
  latte: '#C8A282',
  lemon: '#FFF44F',
  lilac: '#C8A2C8',
  'living coral': '#FF6F61',
  lotus: '#F5B2B2',
  'lunar gray': '#B1B1B1',

  // M
  'macaroni and cheese': '#FFBD88',
  'magic mint': '#AAF0D1',
  magnolia: '#F8F4FF',
  mahogany: '#C04000',
  malachite: '#0BDA51',
  manatee: '#979AAA',
  mango: '#FF8243',
  'mango tango': '#FF8243',
  marigold: '#EAA221',
  marsala: '#964F4C',
  'martian red': '#A23B2D',
  matcha: '#C5E17A',
  mauve: '#E0B0FF',
  melon: '#FEBAAD',
  merlot: '#73343A',
  midnight: '#191970',
  'ming blue': '#36747D',
  mint: '#3EB489',
  'mint green': '#98FF98',
  mocha: '#967969',
  'mocha mousse': '#A47764',
  moonstone: '#3AA8C1',
  'moss green': '#8A9A5B',
  'mountain meadow': '#30BA8F',
  mud: '#70543E',
  mulberry: '#C54B8C',
  mushroom: '#C9B79C',
  mustard: '#FFDB58',

  // N
  'nebula blue': '#2E4A87',
  'neon blue': '#4D4DFF',
  'neon carrot': '#FFA343',
  'neon green': '#39FF14',
  'neon orange': '#FF5F1F',
  'neon pink': '#FF6EC7',
  'neon yellow': '#CFFF04',
  'neptune blue': '#5B9BD5',
  'norigae pink': '#D8A7A7',
  nutmeg: '#7E4A35',

  // O
  oatmeal: '#D9C5A0',
  'obangsaek black': '#000000',
  'obangsaek blue': '#0047AB',
  'obangsaek red': '#FF0000',
  'obangsaek white': '#FFFFFF',
  'obangsaek yellow': '#FFCC00',
  obsidian: '#3D3D3D',
  'ocean blue': '#4F97A3',
  ochre: '#CC7722',
  'olive green': '#BAB86C',
  onyx: '#353839',
  opal: '#A8C3BC',
  'outer space': '#414A4C',
  'outrageous orange': '#FF6E4A',
  oxblood: '#4A0000',
  oyster: '#E8E0D5',

  // P
  'pacific blue': '#1CA9C9',
  paprika: '#8B2500',
  peach: '#FFCBA4',
  'peach fuzz': '#FFBE98',
  pear: '#D1E231',
  pearl: '#FDEEF4',
  pebble: '#8E8E8E',
  peony: '#DE6FA1',
  peppermint: '#D8E4C8',
  peridot: '#E6E200',
  periwinkle: '#CCCCFF',
  'petal pink': '#FFDDF4',
  pewter: '#8E8E8E',
  'piggy pink': '#FDDDE6',
  'pine green': '#01796F',
  'pink flamingo': '#FC74FD',
  pistachio: '#93C572',
  platinum: '#E5E4E2',
  pomegranate: '#C0392B',
  poppy: '#E35335',
  printer: '#000000',
  'process blue': '#0085CA',
  pumpkin: '#FF7518',
  'purple heart': '#69359C',
  'purple mountains majesty': '#9D81BA',
  putty: '#E6D4A3',

  // R
  'radiant orchid': '#B163A3',
  'radical red': '#FF496C',
  raspberry: '#E30B5D',
  'raw sienna': '#D68A59',
  'raw umber': '#826644',
  'razzle dazzle rose': '#FF33CC',
  razzmatazz: '#E3256B',
  'reflex blue': '#001489',
  'rgb blue': '#0000FF',
  'rgb green': '#00FF00',
  'rgb red': '#FF0000',
  'rich black': '#010203',
  'robin egg blue': '#00CCCC',
  rose: '#FF007F',
  'rose gold': '#B76E79',
  'rose quartz': '#F7CAC9',
  'royal purple': '#7851A9',
  'rubine red': '#CE0058',
  ruby: '#E0115F',
  rust: '#B7410E',

  // S
  saffron: '#F4C430',
  sakura: '#FFB7C5',
  sand: '#C2B280',
  sandstone: '#786D5F',
  sapphire: '#0F52BA',
  'saturn gold': '#C5B358',
  scarlet: '#FF2400',
  'screamin green': '#76FF7A',
  seafoam: '#71EEB8',
  sepia: '#704214',
  serenity: '#92A8D1',
  shadow: '#8A795D',
  shamrock: '#45CEA2',
  'shell pink': '#FFB4B4',
  'shocking pink': '#FC0FC0',
  'snow white': '#FFFAFA',
  'soft lilac': '#DCD0FF',
  soil: '#6B4226',
  'solar flare': '#FF7800',
  stardust: '#9CA7B8',
  stone: '#888C8D',
  'storm gray': '#717486',
  strawberry: '#FC5A8D',
  sumi: '#595857',
  sunflower: '#FFDA03',
  sunglow: '#FFCF48',
  'sunset orange': '#FD5E53',

  // T
  tangerine: '#FF9966',
  'tangerine tango': '#DD4124',
  taupe: '#483C32',
  terra: '#C65D3E',
  terracotta: '#E2725B',
  'tickle me pink': '#FC89AC',
  timberwolf: '#DBD7D2',
  titanium: '#878681',
  toffee: '#755139',
  topaz: '#FFC87C',
  'torch red': '#FD0E35',
  'tropical rain forest': '#00755E',
  tulip: '#FF878D',
  tumbleweed: '#DEAA88',
  'turquoise blue': '#00FFEF',

  // U
  uguisu: '#6C6024',
  'ultimate gray': '#939597',
  'ultra violet': '#5F4B8B',
  umber: '#635147',
  'unmellow yellow': '#FFFF66',

  // V
  vanilla: '#F3E5AB',
  vermillion: '#E34234',
  'very peri': '#6667AB',
  'viva magenta': '#BE3455',
  'vivid tangerine': '#FFA089',
  'vivid violet': '#9F00FF',

  // W
  walnut: '#773F1A',
  'warm red': '#F9423A',
  wasabi: '#ACD978',
  watermelon: '#FD4659',
  'wild blue yonder': '#A2ADD0',
  'wild strawberry': '#FF43A4',
  'wild watermelon': '#FC6C85',
  wine: '#722F37',
  wisteria: '#C9A0DC',

  // Y
  'yellow orange': '#FFAE42',

  // CMYK
  'cmyk cyan': '#00FFFF',
  'cmyk key/black': '#000000',
  'cmyk magenta': '#FF00FF',
  'cmyk yellow': '#FFFF00',
};

// 모든 색상 매핑 통합
function getColorCode(englishName: string): string | null {
  const normalized = englishName.toLowerCase().trim();

  // CSS 표준 색상 확인
  if (CSS_COLORS[normalized]) {
    return CSS_COLORS[normalized];
  }

  // 커스텀 색상 확인
  if (CUSTOM_COLORS[normalized]) {
    return CUSTOM_COLORS[normalized];
  }

  // CamelCase를 소문자로 변환 (예: AliceBlue -> aliceblue)
  const camelToLower = normalized.replace(/([a-z])([A-Z])/g, '$1$2').toLowerCase();
  if (CSS_COLORS[camelToLower]) {
    return CSS_COLORS[camelToLower];
  }

  return null;
}

interface ColorEntry {
  id: string;
  korean: string;
  translations: {
    en: {
      word: string;
      [key: string]: unknown;
    };
    ko: {
      word: string;
      [key: string]: unknown;
    };
  };
  colorCode?: string;
  [key: string]: unknown;
}

async function main() {
  console.log('🎨 Adding color codes to colors.json...\n');

  // colors.json 읽기
  const content = readFileSync(COLORS_FILE, 'utf-8');
  const entries: ColorEntry[] = JSON.parse(content);

  let matched = 0;
  let unmatched = 0;
  const unmatchedColors: string[] = [];

  // 각 엔트리에 colorCode 추가
  for (const entry of entries) {
    const englishName = entry.translations.en.word;
    const colorCode = getColorCode(englishName);

    if (colorCode) {
      entry.colorCode = colorCode;
      matched++;
    } else {
      unmatched++;
      unmatchedColors.push(englishName);
    }
  }

  // 결과 저장
  writeFileSync(COLORS_FILE, JSON.stringify(entries, null, 2));

  console.log(`✅ Matched: ${matched}/${entries.length}`);
  console.log(`❌ Unmatched: ${unmatched}/${entries.length}`);

  if (unmatchedColors.length > 0) {
    console.log('\n⚠️  Unmatched colors:');
    for (const c of unmatchedColors) {
      console.log(`   - ${c}`);
    }
  }

  console.log('\n✨ Done! colors.json updated.');
}

main().catch(console.error);
