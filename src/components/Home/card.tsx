
interface CardProps {
    imgSrc: string;
    imgAlt?: string;
    title: string;
    description?: string;
    link?: string;
}

export function Card(props: CardProps) {
    return (
        <div className="um-card">
            <img className="card-img" src={props.imgSrc} alt={props.imgAlt} />
            <div className="card-title">{props.title}</div>
            <div className="card-description">{props.description}</div>
        </div>
    )
}