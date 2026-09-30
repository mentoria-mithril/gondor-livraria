import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface PaginationCatalogoProps {
    pagina: number;
    totalPaginas: number;
    setPagina: (pagina: number) => void;
}

export default function PaginationCatalogo({ pagina, totalPaginas, setPagina }: Readonly<PaginationCatalogoProps>) {

    return (
    <Pagination className="mt-6">
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious
                    href="#"
                    text="Anterior"
                    className="text-[#A60321] hover:bg-[#D9A577]/40 hover:text-[#A60321]"
                    aria-disabled={pagina === 1}
                    onClick={(event) => {
                        event.preventDefault();
                        if (pagina > 1) setPagina(pagina - 1);
                    }}
                />
            </PaginationItem>

            {Array.from({ length: totalPaginas }, (_, index) => {
                const numeroPagina = index + 1;
                return (
                    <PaginationItem key={numeroPagina}>
                        <PaginationLink
                            href="#"
                            isActive={numeroPagina === pagina}
                            className="text-[#A60321] hover:bg-[#D9A577]/40 hover:text-[#A60321] data-[active=true]:border-[#A60321] data-[active=true]:bg-[#A60321] data-[active=true]:text-[#F2E9D8]"
                            onClick={(event) => {
                                event.preventDefault();
                                setPagina(numeroPagina);
                            }}
                        >
                            {numeroPagina}
                        </PaginationLink>
                    </PaginationItem>
                );
            })}

            <PaginationItem>
                <PaginationNext
                    href="#"
                    text="Próxima"
                    className="text-[#A60321] hover:bg-[#D9A577]/40 hover:text-[#A60321]"
                    aria-disabled={pagina === totalPaginas}
                    onClick={(event) => {
                        event.preventDefault();
                        if (pagina < totalPaginas) setPagina(pagina + 1);
                    }}
                />
            </PaginationItem>
        </PaginationContent>
    </Pagination>
    );

}