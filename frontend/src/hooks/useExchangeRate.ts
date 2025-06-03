import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ExchangeRate {
  rate: number;
  timestamp: string;
}

export const useExchangeRate = () =>
  useQuery<ExchangeRate, Error>({
    queryKey: ["exchange-rate"],
    queryFn: async () => {
      const { data } = await axios.get<ExchangeRate>(
        `${process.env.NEXT_PUBLIC_API_URL}/exchange/rate`
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
