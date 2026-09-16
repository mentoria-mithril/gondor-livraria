interface SinopseProp  {
  sinopse: string;
}

export default function Sinopse({sinopse} :Readonly<SinopseProp>) {
    return (
        <div className='p-4 '>
            <p className='leading-relaxed'>{sinopse}</p>
        </div>
    )
}