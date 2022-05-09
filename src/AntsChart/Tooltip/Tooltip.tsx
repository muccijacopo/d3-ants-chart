interface Props {
    x: number,
    y: number,
    visible?: boolean,
    title: string;
    value: string;
}

function Tooltip(props: Props) {
    const { title, value, x, y, visible } = props;
    return (<div className="tooltip" style={{ top: y, left: x, display: visible ? 'block' : 'none' }}>
        <div className="title">{title}</div>
        <div className="value">{value}</div>
    </div>)
}

export default Tooltip;