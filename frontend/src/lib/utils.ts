import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMainImage(images: any[] | undefined): string {
  if (!images || !Array.isArray(images) || images.length === 0) return "/placeholder.png"
  const main = images.find((i: any) => i.image_type === "main")
  return main?.image_url || images[0]?.image_url || "/placeholder.png"
}
