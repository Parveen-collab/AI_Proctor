import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export interface DetectionModel {
  faceDetector: any;
  cocoModel: any;
}

export function useDetectionModel() {
  const [model, setModel] = useState<DetectionModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await tf.ready();
        
        try {
          await tf.setBackend('webgl');
        } catch (err) {
          await tf.setBackend('cpu');
        }

        const cocoModel = await cocoSsd.load();
        
        const faceDetector = await (window as any).faceapi?.nets?.tinyFaceDetector?.load?.('/models');

        setModel({
          faceDetector,
          cocoModel,
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Model loading error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load models');
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  return { model, loading, error };
}
