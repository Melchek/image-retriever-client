import React, { useRef, useEffect, useCallback } from 'react';

import { inject, observer } from 'mobx-react';

import MainStore from '../../../stores/main.store';
import { Dimensions } from '../../../models/Query-result.model';

interface ResultImageProps {
  mainStore?: MainStore;
}

const ResultImage = inject('mainStore')(
  observer((props: ResultImageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const draw = useCallback(
      (ctx: CanvasRenderingContext2D, image: string, rect: Dimensions) => {
        const img = new Image();
        img.src = image;

        const startPositionX = canvasRef.current!.width / 2 - img.width / 2;
        ctx.drawImage(img, startPositionX, 0);

        ctx.beginPath();
        ctx.rect(startPositionX + rect.x, rect.y, rect.width, rect.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'yellow';
        ctx.stroke();
      },
      [],
    );

    useEffect(() => {
      const { image, result } = props.mainStore!;
      if (canvasRef?.current && image && result) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')!;

        draw(context, image, result.location);
      }
    }, [draw, props.mainStore]);

    return <canvas ref={canvasRef} />;
  }),
);

export default ResultImage;
