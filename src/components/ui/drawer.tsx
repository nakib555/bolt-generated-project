
    import * as React from "react"
    import { Drawer as DrawerPrimitive } from "vaul"

    import { cn } from "@/lib/utils"

    const Drawer = ({
      shouldScaleBackground = true,
      ...props
    }: React.ComponentProps