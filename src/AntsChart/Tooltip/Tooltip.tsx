interface Props {
    x: number, 
    y: number,
    visible?: boolean,
    value?: string;
}

function Tooltip (props: Props) {
    const { value, x, y, visible } = props;
    return (<div className="tooltip" style={{ top: y, left: x, display: visible ? 'block' : 'none' }}>{value}</div>)
}

export default Tooltip;