import { useState } from 'react';
import './SVGAnimation.css';

function SVGAnimation () {
    const [y, setY] = useState(50);
    return ( 
        <svg width="100" height="100">
        <circle cx="50" cy={y} r="20" onClick={() => setY(10)}></circle>
        </svg>
    )
}
export default SVGAnimation;