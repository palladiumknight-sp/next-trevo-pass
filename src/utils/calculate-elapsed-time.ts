import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const calculateElapsedTime = (date: Date) =>
  formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR,
  });
