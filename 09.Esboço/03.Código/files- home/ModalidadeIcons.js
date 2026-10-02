import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

// -----------------------------------------------------------------------
// Ícones simples de modalidade, desenhados em SVG.
// Adicionar aqui um ícone por modalidade do clube (surf, natação, judo...).
// Requer: npm install react-native-svg
// -----------------------------------------------------------------------

export function SurfIcon({ size = 26, color = '#791F1F' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Path
        d="M5 19 C 9 11, 16 6, 22 4 C 21 10, 16 17, 8 21 C 6.5 21.5, 5.5 20.5, 5 19 Z"
        fill={color}
      />
      <Line
        x1="6.5"
        y1="18.5"
        x2="3"
        y2="22"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Mapa de modalidade -> componente de ícone, para facilitar a escolha
// dinâmica do ícone de cada aula a partir dos dados.
export const modalidadeIconMap = {
  surf: SurfIcon,
  // natacao: NatacaoIcon,
  // judo: JudoIcon,
  // karate: KarateIcon,
};

export function ModalidadeIcon({ modalidade, size, color }) {
  const IconComponent = modalidadeIconMap[modalidade] || SurfIcon;
  return <IconComponent size={size} color={color} />;
}
