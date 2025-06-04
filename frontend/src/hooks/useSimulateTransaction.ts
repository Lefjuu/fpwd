import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TransactionResult } from "@/types";
import { API_ENDPOINTS } from "@/consts";

export const useSimulateTransaction = () =>
  useMutation<TransactionResult, Error, number>({
    mutationFn: async (eur: number) => {
      const { data } = await axios.post<TransactionResult>(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.EXCHANGE.SIMULATE}`,
        { eur }
      );
      return data;
    },
  });
