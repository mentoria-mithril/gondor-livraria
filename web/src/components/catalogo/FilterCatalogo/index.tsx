import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterX, Search } from 'lucide-react';

interface FilterCatalogoProps {
    handleSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
    setBusca: (busca: string) => void;
    setCategoria: (categoria: string) => void;
    setPagina: (pagina: number) => void;
}

export default function FilterCatalogo({ handleSubmit, setBusca, setCategoria, setPagina }: Readonly<FilterCatalogoProps>) {

    const limparFiltros = () => {
        setBusca('');
        setCategoria('');
        setPagina(1);
    }

    return (
        <nav>
            <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
                <Input
                    className="border-[#D9A577] bg-[#D9A577]/30 text-[#4A1F1F] placeholder:text-[#6E4840] focus-visible:border-[#A60321] focus-visible:ring-[#A60321]/30"
                    name='busca'
                    placeholder='Buscar...'
                />
                <Input
                    className="border-[#D9A577] bg-[#D9A577]/30 text-[#4A1F1F] placeholder:text-[#6E4840] focus-visible:border-[#A60321] focus-visible:ring-[#A60321]/30"
                    name='categoria'
                    placeholder='Buscar por Categoria...'
                />
                <Button className="bg-[#A60321] text-[#F2E9D8] hover:bg-[#87021B]" type='submit'>
                    <Search className="h-4 w-4" />
                    Buscar</Button>
                <Button className="bg-[#A60321] text-[#F2E9D8] hover:bg-[#87021B]" type='reset' onClick={limparFiltros}>
                    <FilterX className="h-4 w-4" />
                    Limpar Filtros
                </Button>
            </form>
        </nav>
);

}