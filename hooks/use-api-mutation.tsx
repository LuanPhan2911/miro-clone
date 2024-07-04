import { useMutation } from "convex/react";
import { useState } from "react";

export const useApiMutation = (mutationFunction: any) => {
  const [isPending, setPending] = useState(false);
  const apiMutation = useMutation(mutationFunction);
  const mutate = async (payload: any) => {
    setPending(true);
    try {
      try {
        const result = await apiMutation(payload);
        return result;
      } catch (error) {
        throw error;
      }
    } finally {
      setPending(false);
    }
  };
  return { isPending, mutate };
};
