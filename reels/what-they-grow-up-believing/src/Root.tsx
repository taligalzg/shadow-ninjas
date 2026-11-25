import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';

export const Root: React.FC = () => (
  <>
    <Composition id="Episode1" component={Reel} width={1080} height={1920} fps={30} durationInFrames={1350} defaultProps={{music: true}} />
  </>
);
