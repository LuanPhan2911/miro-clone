import { Layer } from "@/types/canvas";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { useMutation, useSelf } from "@liveblocks/react/suspense";

export const useDeleteLayer = () => {
  const selection = useSelf((me) => me.presence.selection);

  return useMutation(
    ({ storage, setMyPresence }) => {
      if (selection.length === 0) {
        return;
      }

      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");

      for (let id of selection) {
        liveLayers.delete(id);
        const index = liveLayerIds.indexOf(id);
        if (index !== -1) {
          liveLayerIds.delete(index);
        }
      }
      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [selection]
  );
};
export const useDeleteAllLayer = () => {
  return useMutation(({ storage, setMyPresence }) => {
    storage.update({
      layerIds: new LiveList<string>([]),
      layers: new LiveMap<string, LiveObject<Layer>>(),
    });
    setMyPresence(
      {
        selection: [],
      },
      {
        addToHistory: true,
      }
    );
  }, []);
};
