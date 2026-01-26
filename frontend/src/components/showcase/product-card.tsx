import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
    variant: "default" | "minimal" | "list"
    title: string
    price: number
    oldPrice?: number
    image: string
    inStock?: boolean
}

export function ProductCard({ variant, title, price, oldPrice, inStock = true }: ProductCardProps) {
    if (variant === "minimal") {
        return (
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group">
                <div className="aspect-square bg-muted relative rounded-t-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-xs">
                        [Product Image]
                    </div>
                    {!inStock && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                            <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{title}</h3>
                    <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-sm">₹{price.toLocaleString()}</span>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
            <CardContent className="p-0">
                <div className="relative aspect-[4/3] bg-muted/30 overflow-hidden group-hover:scale-[1.01] transition-transform">
                    <div className="absolute top-2 left-2 z-10 flex gap-1">
                        {oldPrice && <Badge className="bg-red-500 text-white border-0 hover:bg-red-600">-15%</Badge>}
                        <Badge variant={inStock ? "default" : "secondary"} className="bg-primary/90">
                            {inStock ? "In Stock" : "Pre-order"}
                        </Badge>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">IMG</div>
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
                        <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-black text-xs h-8">
                            <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-black text-xs h-8">
                            <Heart className="h-3 w-3 mr-1" /> Save
                        </Button>
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Implants</div>
                    <h3 className="font-semibold text-foreground line-clamp-2 min-h-[3rem]">
                        {title}
                    </h3>

                    <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-lg font-bold text-primary">₹{price.toLocaleString()}</span>
                        {oldPrice && (
                            <span className="text-sm text-muted-foreground line-through">₹{oldPrice.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full gap-2 font-medium bg-primary/90 hover:bg-primary">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    )
}
