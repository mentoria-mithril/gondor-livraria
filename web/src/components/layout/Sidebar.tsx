"use client"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarRail,
  SidebarHeader,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import type { ItemCarrinho } from "@/types/carrinho/CarrinhoTypes"

type Props = {
  itens?: ItemCarrinho[]
  onAumentar?: (livroId: number) => void
  onDiminuir?: (livroId: number) => void
}

export function AppSidebar({
  itens = [],
  onAumentar = () => {},
  onDiminuir = () => {},
}: Props) {
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
          {/* h-9 + -mt-9 andam juntos: o colapso esconde o label puxando uma
              margem negativa do tamanho exato da altura (sidebar.tsx:406).
              Mudar só a altura deixaria uma sobra visível no modo ícone. */}
          <SidebarGroupLabel className="h-9 text-lg font-semibold text-foreground group-data-[collapsible=icon]:-mt-9">
            Carrinho
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Estado vazio: sem ele o usuário não sabe se está carregando
                  ou se realmente não tem nada. */}
              {itens.length === 0 && (
                <p className="px-3 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                  Nenhum livro no carrinho.
                </p>
              )}
              
              {/* key={livroId}: o id do DADO, nunca o índice do array — com
                  índice o React embaralha as linhas quando uma some do meio. 
              {itens.map((item) => (
                <CarrinhoItem
                  key={item.livroId}
                  item={item}
                  onAumentar={onAumentar}
                  onDiminuir={onDiminuir}
                />
              ))}
              */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
