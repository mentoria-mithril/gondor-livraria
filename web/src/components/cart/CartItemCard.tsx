import { SidebarMenuItem } from "../ui/sidebar";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"
import { SavedCartItem } from "@/types/cart/cartTypes"
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react"
type Props = {
    item: SavedCartItem
    onIncrease: (bookId: number) => void
    onDecrease: (bookId: number) => void
}

export function CartItemCard(props: Props) {
    return(
        <SidebarMenuItem>
            <Item>
                <ItemMedia variant="image" className="w-16 h-16 [&_img]:object-contain group-data-[collapsible=icon]:hidden">
                   {props.item.imageUrl
                    ? <img src={props.item.imageUrl} alt={props.item.title}/>
                    : <div className="bg-sidebar-foreground/10 size-full"/>}
                </ItemMedia>
                <ItemContent className="group-data-[collapsible=icon]:hidden">
                    <ItemTitle><span className="line-clamp-2">{props.item.title}</span></ItemTitle>
                    <ItemDescription>R$ {props.item.subtotal.toFixed(2)}</ItemDescription>
                    <ItemActions className="group-data-[collapsible=icon]:hidden border border-[#A60321] rounded-full w-fit">
                        <Button className="rounded-full hover:bg-[#A60321]/10" size="icon-xs" variant="ghost" onClick={() => props.onIncrease(props.item.bookId)}>
                            +
                        </Button>
                        <span className="px-2">{props.item.quantity}</span>
                        <Button className="rounded-full hover:bg-[#A60321]/10" size="icon-xs" variant="ghost" onClick={() => props.onDecrease(props.item.bookId)}>
                            {props.item.quantity > 1 ? '-' : <Trash2 className="w-4 h-4" />}
                        </Button>
                    </ItemActions>
                </ItemContent>
            </Item>
         </SidebarMenuItem>
    )
}