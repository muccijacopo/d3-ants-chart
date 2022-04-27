import { Fragment } from 'react';
import * as d3 from 'd3';
import './Ant.css';

export interface Props {
    x: number;
    y: number;
    antennaeLength: number;
    legsLength: number;
    headSize: number;
    bodySize: number;
    onLeftClick: any
    onRightClick: any;
}

function AntSVG(props: Props) {

    function path(points: any) {
        return d3.line()(points)!;
    }

    function line(points: any) {
        const line = d3.line().curve(d3.curveNatural);
        return line(points)!;
    }

    const { x, y, antennaeLength, bodySize, legsLength, headSize } = props;

    return (
        <Fragment>
            <g className='ant' onClick={props.onLeftClick} onContextMenu={props.onRightClick}>
                <path
                    className="ant-antenna-1"
                    d={line([[x, y - bodySize - headSize], [x - 10, y - bodySize - headSize - antennaeLength], [x - 5, y - bodySize - headSize - antennaeLength - 10]])}
                ></path>
                <path
                    className="ant-antenna-2"
                    d={line([[x, y - bodySize - headSize], [x + 10, y - bodySize - headSize - antennaeLength], [x + 5, y - bodySize - headSize - antennaeLength - 10]])}
                ></path>
                <path
                    className="ant-front-leg-1"
                    d={path([[x, y], [x + 15, y - 10], [x + 20, y - 10 - legsLength]])}
                ></path>
                <path
                    className="ant-front-leg-2"
                    d={path([[x, y], [x - 15, y - 10], [x - 20, y - 10 - legsLength]])}
                ></path>
                <path
                    className="ant-middle-leg-1"
                    d={path([[x, y], [x - 15, y], [x - 15 - legsLength, y - legsLength]])}
                ></path>
                <path
                    className="ant-middle-leg-2"
                    d={path([[x, y], [x + 15, y], [x + 15 + legsLength, y - legsLength]])}
                ></path>
                <path
                    className="ant-back-leg-1"
                    d={path([[x, y], [x + bodySize + 5, y + 5], [x + bodySize + 5 + legsLength, y + 5 + legsLength]])}
                ></path>
                <path
                    className="ant-back-leg-2"
                    d={path([[x, y], [x - bodySize - 5, y + 5], [x - bodySize - 5 - legsLength, y + 5 + legsLength]])}
                ></path>
                <ellipse className="ant-head"
                    cx={x}
                    cy={y - bodySize - headSize}
                    rx={headSize * 0.6}
                    ry={headSize}
                ></ellipse>
                <ellipse className='ant-body' cx={x} cy={y} rx={bodySize * 0.8} ry={bodySize}></ellipse>
                <ellipse className='ant-back' cx={x} cy={y + bodySize * 2} rx={bodySize * 0.9} ry={bodySize}></ellipse>
            </g>


        </Fragment>
    )
}

export default AntSVG;