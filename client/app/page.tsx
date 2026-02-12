import { DotOrbit } from '@paper-design/shaders-react';
import ComingSoon from './components/ComingSoon';

export default function Home() {
  return (
    <div className="w-full min-h-screen relative">
      <div className="fixed inset-0 w-full h-full z-0">
        <DotOrbit
          width="100%"
          height="100%"
          colors={['#ffffff', '#006aff', '#fff675']}
          colorBack="#000000"
          stepsPerColor={4}
          size={0.2}
          sizeRange={0.5}
          spreading={1}
          speed={0.5}
          scale={0.35}
        />
      </div>
      <ComingSoon />
    </div>
  );
}
