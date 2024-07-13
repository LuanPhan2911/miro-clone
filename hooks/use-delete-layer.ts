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
