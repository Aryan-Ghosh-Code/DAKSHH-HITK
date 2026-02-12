export type MobileCrewmate = {
  src: string;
  left?: string;
  right?: string;
  top: string;
  size: number;
  rotate: string;
  mirror?: boolean;
  delay: 0 | 1 | 2 | 3;
};

export type DesktopCrewmate = {
  src: string;
  left?: string;
  right?: string;
  top: string;
  sizeClass: string;
  rotate: string;
  mirror?: boolean;
  delay: 0 | 1 | 2 | 3;
};

export const floatClass = (d: 0 | 1 | 2 | 3) => ['float', 'float-delay-1', 'float-delay-2', 'float-delay-3'][d];

export const MOBILE_CREWMATES: MobileCrewmate[] = [
  { src: '/1.png', left: '8%', top: '12%', size: 36, rotate: '28deg', delay: 0 },
  { src: '/6.png', right: '10%', top: '20%', size: 34, rotate: '-25deg', mirror: true, delay: 1 },
  { src: '/7.png', left: '12%', top: '78%', size: 35, rotate: '-22deg', delay: 2 },
  { src: '/10.png', right: '8%', top: '85%', size: 32, rotate: '20deg', mirror: true, delay: 3 },
  { src: '/2.png', left: '5%', top: '85vh', size: 32, rotate: '25deg', delay: 0 },
  { src: '/5.png', left: '15%', top: '90vh', size: 28, rotate: '-18deg', delay: 1 },
  { src: '/8.png', left: '25%', top: '88vh', size: 35, rotate: '30deg', delay: 2 },
  { src: '/3.png', right: '8%', top: '87vh', size: 33, rotate: '-28deg', mirror: true, delay: 3 },
  { src: '/9.png', right: '18%', top: '92vh', size: 29, rotate: '20deg', mirror: true, delay: 0 },
  { src: '/4.png', right: '28%', top: '89vh', size: 36, rotate: '-35deg', mirror: true, delay: 1 },
  { src: '/6.png', left: '8%', top: '95vh', size: 31, rotate: '22deg', delay: 2 },
  { src: '/7.png', right: '12%', top: '94vh', size: 34, rotate: '-22deg', mirror: true, delay: 3 },
  { src: '/5.png', left: '6%', top: '145vh', size: 33, rotate: '-30deg', delay: 0 },
  { src: '/10.png', left: '16%', top: '150vh', size: 28, rotate: '18deg', delay: 1 },
  { src: '/1.png', left: '26%', top: '148vh', size: 31, rotate: '-25deg', delay: 2 },
  { src: '/8.png', right: '7%', top: '146vh', size: 34, rotate: '30deg', mirror: true, delay: 3 },
  { src: '/2.png', right: '17%', top: '151vh', size: 29, rotate: '-19deg', mirror: true, delay: 0 },
  { src: '/9.png', right: '27%', top: '149vh', size: 32, rotate: '26deg', mirror: true, delay: 1 },
  { src: '/6.png', left: '12%', top: '153vh', size: 30, rotate: '40deg', delay: 2 },
  { src: '/7.png', right: '14%', top: '152vh', size: 35, rotate: '-40deg', mirror: true, delay: 3 },
  { src: '/3.png', left: '5%', top: '205vh', size: 35, rotate: '-22deg', delay: 0 },
  { src: '/7.png', left: '15%', top: '210vh', size: 30, rotate: '20deg', delay: 1 },
  { src: '/10.png', left: '25%', top: '208vh', size: 27, rotate: '-28deg', delay: 2 },
  { src: '/4.png', right: '8%', top: '206vh', size: 36, rotate: '22deg', mirror: true, delay: 3 },
  { src: '/5.png', right: '18%', top: '211vh', size: 31, rotate: '-21deg', mirror: true, delay: 0 },
  { src: '/8.png', right: '28%', top: '209vh', size: 28, rotate: '29deg', mirror: true, delay: 1 },
  { src: '/9.png', left: '10%', top: '213vh', size: 33, rotate: '15deg', delay: 2 },
  { src: '/6.png', right: '12%', top: '212vh', size: 29, rotate: '-15deg', mirror: true, delay: 3 },
  { src: '/4.png', left: '6%', top: '265vh', size: 32, rotate: '25deg', delay: 0 },
  { src: '/8.png', left: '16%', top: '270vh', size: 28, rotate: '-18deg', delay: 1 },
  { src: '/1.png', left: '26%', top: '268vh', size: 35, rotate: '30deg', delay: 2 },
  { src: '/9.png', right: '7%', top: '266vh', size: 33, rotate: '-28deg', mirror: true, delay: 3 },
  { src: '/2.png', right: '17%', top: '271vh', size: 29, rotate: '20deg', mirror: true, delay: 0 },
  { src: '/10.png', right: '27%', top: '269vh', size: 36, rotate: '-35deg', mirror: true, delay: 1 },
  { src: '/5.png', left: '11%', top: '273vh', size: 31, rotate: '-20deg', delay: 2 },
  { src: '/6.png', right: '13%', top: '272vh', size: 34, rotate: '24deg', mirror: true, delay: 3 },
  { src: '/7.png', left: '3%', top: '50vh', size: 30, rotate: '45deg', delay: 0 },
  { src: '/3.png', right: '3%', top: '50vh', size: 30, rotate: '-45deg', mirror: true, delay: 1 },
  { src: '/9.png', left: '3%', top: '180vh', size: 28, rotate: '35deg', delay: 2 },
  { src: '/10.png', right: '3%', top: '180vh', size: 28, rotate: '-35deg', mirror: true, delay: 3 },
  { src: '/5.png', left: '3%', top: '240vh', size: 29, rotate: '50deg', delay: 0 },
  { src: '/6.png', right: '3%', top: '240vh', size: 29, rotate: '-50deg', mirror: true, delay: 1 },
];

/* Crewmates for coming soon - viewport only */
export const COMING_SOON_MOBILE: MobileCrewmate[] = [
  { src: '/1.png', left: '8%', top: '12%', size: 36, rotate: '28deg', delay: 0 },
  { src: '/6.png', right: '10%', top: '20%', size: 34, rotate: '-25deg', mirror: true, delay: 1 },
  { src: '/7.png', left: '12%', top: '78%', size: 35, rotate: '-22deg', delay: 2 },
  { src: '/10.png', right: '8%', top: '85%', size: 32, rotate: '20deg', mirror: true, delay: 3 },
  { src: '/2.png', left: '5%', top: '75vh', size: 32, rotate: '25deg', delay: 0 },
  { src: '/5.png', left: '15%', top: '80vh', size: 28, rotate: '-18deg', delay: 1 },
  { src: '/8.png', left: '25%', top: '78vh', size: 35, rotate: '30deg', delay: 2 },
  { src: '/3.png', right: '8%', top: '77vh', size: 33, rotate: '-28deg', mirror: true, delay: 3 },
  { src: '/9.png', right: '18%', top: '82vh', size: 29, rotate: '20deg', mirror: true, delay: 0 },
  { src: '/4.png', right: '28%', top: '79vh', size: 36, rotate: '-35deg', mirror: true, delay: 1 },
  { src: '/7.png', left: '3%', top: '50vh', size: 30, rotate: '45deg', delay: 0 },
  { src: '/3.png', right: '3%', top: '50vh', size: 30, rotate: '-45deg', mirror: true, delay: 1 },
];

export const COMING_SOON_DESKTOP: DesktopCrewmate[] = [
  { src: '/1.png', left: '8px', top: '150px', sizeClass: 'w-[100px] h-[100px] lg:w-[120px] lg:h-[120px]', rotate: '-12deg', delay: 0 },
  { src: '/2.png', left: '8px', top: '400px', sizeClass: 'w-[90px] h-[90px] lg:w-[100px] lg:h-[100px]', rotate: '10deg', delay: 1 },
  // { src: '/5.png', left: 'calc(50% - 48px)', top: '55%', sizeClass: 'w-[80px] h-[80px] lg:w-[95px] lg:h-[95px]', rotate: '-8deg', delay: 2 },git 
  { src: '/7.png', left: '16px', top: '65%', sizeClass: 'w-[85px] h-[85px] lg:w-[100px] lg:h-[100px]', rotate: '15deg', delay: 3 },
  { src: '/6.png', right: '8px', top: '120px', sizeClass: 'w-[95px] h-[95px] lg:w-[110px] lg:h-[110px]', rotate: '-14deg', mirror: true, delay: 0 },
  { src: '/3.png', right: '8px', top: '350px', sizeClass: 'w-[105px] h-[105px] lg:w-[125px] lg:h-[125px]', rotate: '12deg', mirror: true, delay: 2 },
  { src: '/4.png', right: '8px', top: '75%', sizeClass: 'w-[95px] h-[95px] lg:w-[115px] lg:h-[115px]', rotate: '-10deg', mirror: true, delay: 1 },
];

export const DESKTOP_CREWMATES: DesktopCrewmate[] = [
  { src: '/1.png', left: '8px', top: '200px', sizeClass: 'w-[120px] h-[120px] lg:w-[150px] lg:h-[150px]', rotate: '-12deg', delay: 0 },
  { src: '/2.png', left: '8px', top: '550px', sizeClass: 'w-[100px] h-[100px] lg:w-[120px] lg:h-[120px]', rotate: '10deg', delay: 1 },
  { src: '/5.png', left: '700px', top: '700px', sizeClass: 'w-[100px] h-[100px] lg:w-[120px] lg:h-[120px]', rotate: '-8deg', delay: 2 },
  { src: '/7.png', left: '16px', top: '950px', sizeClass: 'w-[95px] h-[95px] lg:w-[110px] lg:h-[110px]', rotate: '15deg', delay: 3 },
  { src: '/9.png', left: '8px', top: '1200px', sizeClass: 'w-[105px] h-[105px] lg:w-[130px] lg:h-[130px]', rotate: '-18deg', delay: 0 },
  { src: '/10.png', left: '12px', top: '1480px', sizeClass: 'w-[98px] h-[98px] lg:w-[118px] lg:h-[118px]', rotate: '12deg', delay: 1 },
  { src: '/3.png', left: '8px', top: '1820px', sizeClass: 'w-[110px] h-[110px] lg:w-[135px] lg:h-[135px]', rotate: '-10deg', delay: 2 },
  { src: '/4.png', left: '12px', top: '2180px', sizeClass: 'w-[100px] h-[100px] lg:w-[120px] lg:h-[120px]', rotate: '8deg', delay: 3 },
  { src: '/6.png', right: '8px', top: '150px', sizeClass: 'w-[102px] h-[102px] lg:w-[125px] lg:h-[125px]', rotate: '-14deg', mirror: true, delay: 0 },
  { src: '/3.png', right: '8px', top: '500px', sizeClass: 'w-[120px] h-[120px] lg:w-[150px] lg:h-[150px]', rotate: '12deg', mirror: true, delay: 2 },
  { src: '/8.png', right: '16px', top: '850px', sizeClass: 'w-[97px] h-[97px] lg:w-[115px] lg:h-[115px]', rotate: '8deg', mirror: true, delay: 3 },
  { src: '/5.png', right: '8px', top: '1100px', sizeClass: 'w-[103px] h-[103px] lg:w-[128px] lg:h-[128px]', rotate: '-16deg', mirror: true, delay: 0 },
  { src: '/4.png', right: '8px', top: '1380px', sizeClass: 'w-[120px] h-[120px] lg:w-[150px] lg:h-[150px]', rotate: '-10deg', mirror: true, delay: 1 },
  { src: '/7.png', right: '12px', top: '1660px', sizeClass: 'w-[96px] h-[96px] lg:w-[112px] lg:h-[112px]', rotate: '11deg', mirror: true, delay: 2 },
  { src: '/1.png', right: '8px', top: '2000px', sizeClass: 'w-[108px] h-[108px] lg:w-[132px] lg:h-[132px]', rotate: '-12deg', mirror: true, delay: 3 },
  { src: '/2.png', right: '12px', top: '2350px', sizeClass: 'w-[95px] h-[95px] lg:w-[115px] lg:h-[115px]', rotate: '15deg', mirror: true, delay: 0 },
];
