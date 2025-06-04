import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ExchangeRate } from "@/types";
import { QUERY_KEYS, API_ENDPOINTS } from "@/consts";

export const useExchangeRate = () =>
  useQuery<ExchangeRate, Error>({
    queryKey: [QUERY_KEYS.EXCHANGE_RATE],
    queryFn: async () => {
      const { data } = await axios.get<ExchangeRate>(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.EXCHANGE.RATE}`
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });
