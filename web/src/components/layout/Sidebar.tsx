"use client"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarRail,
  SidebarHeader,
  SidebarTrigger,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import type { SavedCartItem } from "@/types/cart/cartTypes"
import { CartItemCard } from "../cart/CartItemCard"

type Props = {
  items: SavedCartItem[]
  onIncrease: (bookId: number) => void
  onDecrease: (bookId: number) => void
}

export function AppSidebar({items, onIncrease, onDecrease}: Props) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row items-center justify-between  group-data-[collapsible=icon]:justify-center ">
        <span className="font-heading group-data-[collapsible=icon]:hidden text-lg font-semibold pl-3" >
          Gondor Livraria
        </span>
        <SidebarTrigger size="icon" className="[&_svg]:size-5 data-horizontal:mx-0 flex" />
      </SidebarHeader>
      <SidebarSeparator className="data-horizontal:mx-0" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="h-9 text-lg font-semibold text-foreground group-data-[collapsible=icon]:-mt-9">
            Carrinho
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.length === 0 && (
                <p className="px-3 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                  Nenhum livro no carrinho.
                </p>
              )}
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          <Button variant="outline" className="flex flex-col gap-2 p-2 bg-[#A60321] hover:bg-primary/30 rounded-full">Fechar pedido</Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
