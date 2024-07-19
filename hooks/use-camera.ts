import { Camera, Point } from "@/types/canvas";
import { useCallback } from "react";

export const useCamera = ({
  setCamera,
  camera,
}: {
  camera: Camera;
  setCamera: (camera: Camera) => void;
}) => {
  const translateCamera = useCallback(
    (origin: Point, point: Point) => {
      const offset = {
        x: point.x - origin.x,
        y: point.y - origin.y,
      };
      setCamera({
        x: camera.x + offset.x,
        y: camera.y + offset.y,
      });
    },
    [setCamera, camera]
  );
  return { translateCamera };
};
