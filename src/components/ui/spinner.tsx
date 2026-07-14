import { Loader2Icon, X } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <Loader2Icon data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
      <span className="font-ubuntu">Carregando...</span>
    </div>
  )
}

export { Spinner }
