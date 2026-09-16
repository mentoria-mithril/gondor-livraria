interface HeroSectionProps {
    titulo: string;
    autor: string;
    categoria: string;
}

export default function HeroSection({ titulo, autor, categoria }: Readonly<HeroSectionProps>) {
    return (
        <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#A60321]">{titulo}</h1>
        <p className="text-base text-[#6E4840]">{autor} | {categoria}</p>
        </div>
    );
}
