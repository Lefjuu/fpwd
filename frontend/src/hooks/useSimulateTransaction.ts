import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface TransactionResult {
  eur: number;
  pln: number;
  rate: number;
  timestamp: string;
}

export const useSimulateTransaction = () =>
  useMutation<TransactionResult, Error, number>({
    mutationFn: async (eur: number) => {
      const { data } = await axios.post<TransactionResult>(
        `${process.env.NEXT_PUBLIC_API_URL}/exchange/simulate`,
        { eur }
      );
      return data;
    },
  });
