interface SinopseProp  {
  sinopse: string;
}

export default function Sinopse({sinopse}: Readonly<SinopseProp>) {
    return (
        <div className='p-2'>
            <p className='leading-relaxed text-xl'>{sinopse}</p>
        </div>
    );
}