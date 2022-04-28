import * as d3 from "d3";
import { Fragment, useEffect, useRef, useState } from "react";

import { generateDataset, getPropertyByKey, isDatasetValid } from "../utils/dataset";
import { Ant, AntDataset } from "./DatasetModel";
import './AntsChart.css';
import AntSVG from "./Ant/Ant";
import Tooltip from "./Tooltip/Tooltip";
import { translateCSS } from "../utils/geometry";
import { translateProperty } from "../utils/translation";

export interface Feature {
    antennaeLength: number;
    // frontLegsLength: number;
    // middleLegsLength: number;
    legsLength: number;
    headSize: number;
    bodySize: number;
    backSize: number;
}

export interface FeatureToVariabile  {
    x: string;
    y: string;
    antennaeLength: string;
    // frontLegsLength: string;
    // middleLegsLength: string;
    legsLength: string;
    headSize: string;
    bodySize: string;
    // backSize: string;
}

const maxOf = (dataset: AntDataset, key: keyof Ant) => d3.max((dataset.map(e => e[key]))) as number;
const minOf = (dataset: AntDataset, key: keyof Ant) => d3.min((dataset.map(e => e[key]))) as number;

function AntsChart() {

    /** State */
    const [dataset, setDataset] = useState<AntDataset>([])
    const [feature2Variable, setFeature2Variable] = useState<FeatureToVariabile>(
        { 
            x: 'v1', 
            y: 'v2',
            antennaeLength: 'v3',
            legsLength: 'v4',
            headSize: 'v5',
            bodySize: 'v6'
    });
    const [tooltip, setTooltip] = useState({ x: 0, y: 0, visible: false, value: "", lastUpdate: 0 });
    const [_, setResize] = useState(window.innerWidth);
    const SVGRef = useRef(null);
    const chartRef = useRef(null);
    const fileUploadRef = useRef(null);

    useEffect(() => {
        window.addEventListener('resize', () => setResize(window.innerWidth));
    }, []);

    function getVariabileByFeature (feat: keyof FeatureToVariabile): keyof Ant {
        return feature2Variable[feat] as keyof Ant
    }

    function getAntValue (ant: Ant, feat: keyof FeatureToVariabile) {
        return ant[getVariabileByFeature(feat)];
    }

    function getDimensions () {
        const card = document.querySelector(".card")
        const outerWidth = card?.getBoundingClientRect().width ?? window.innerWidth
        const outerHeight = card?.getBoundingClientRect().height ?? window.innerHeight
        const margin = {top: 50, right: 50, bottom: 50, left: 50 };
        const innerWidth = outerWidth - margin.left - margin.right;
        const innerHeight = outerHeight - margin.top - margin.bottom;
        return { outerHeight, outerWidth, margin, innerWidth, innerHeight}
    }

    function onLeftClick(event: any) {
        const key = event.target.getAttribute('class')
        const prop = getPropertyByKey(key);
        if (!prop) return;
        const currentXVariable = feature2Variable.x;
        const newXVariable = getVariabileByFeature(prop as any);
        setFeature2Variable({ ...feature2Variable, x: newXVariable, [prop]: currentXVariable })

    }

    function onRightClick (event: any) {
        const key = event.target.getAttribute('class')
        const prop = getPropertyByKey(key);
        if (!prop) return;
        const currentYVariable = feature2Variable.x;
        const newYVariable = getVariabileByFeature(prop as any);
        setFeature2Variable({ ...feature2Variable, y: newYVariable, [prop]: currentYVariable })
    }

    function onMouseOver (idx: number, event: any) {
        const key = event.target.getAttribute('class');
        const prop = getPropertyByKey(key);
        const ant = dataset[idx];
        const value = getAntValue(ant, prop);
        if (new Date().getTime() - tooltip.lastUpdate < 50) return;
        setTooltip({ visible: true, x: event.pageX + 10, y: event.pageY - 10, value: `${translateProperty(prop)} (${getVariabileByFeature(prop)}): ${value}`, lastUpdate: new Date().getTime()  })
    }

    function onMouseLeave() {
        if (new Date().getTime() - tooltip.lastUpdate < 50) return;
        setTooltip({ ...tooltip, visible: false, lastUpdate: new Date().getTime() })
    }

    function onFileUploadButtonClick () {
        (fileUploadRef.current as any).click();
    }

    function handleFileUpload (evt: any) {
        const file = evt.target.files[0];

        let reader = new FileReader();
        reader.readAsText(file);

        const cleanUp = () => {
            (fileUploadRef.current as any).value = "";
        }

        reader.onload = () => {
            try {
                const dataset = JSON.parse(reader.result as string);
                if (isDatasetValid(dataset)) setDataset(dataset);                
                cleanUp();
            } catch {
                console.error("Error during file parsing");
                cleanUp();
            }
        }

        reader.onerror = () => {
            console.error("Error during file upload");
            cleanUp();
        }
    }
    const { margin, innerWidth, innerHeight } = getDimensions();

    const xScale = d3
    .scaleLinear()
    .domain([minOf(dataset, getVariabileByFeature('x')), maxOf(dataset, getVariabileByFeature('x'))])
    .range([0, innerWidth])

    const yScale = d3
            .scaleLinear()
            .domain([minOf(dataset, getVariabileByFeature('y')), maxOf(dataset, getVariabileByFeature('y'))])
            .range([innerHeight, 0])

    const chart = d3.select(chartRef.current);
    // Remove previous scales
    chart.select('.xAxis').remove();
    chart.select('.xAxis-label').remove();
    chart.select('.yAxis').remove();
    chart.select('.yAxis-label').remove();

    const xAxis = d3.axisBottom(xScale);
    chart
        .append("g")
        .attr("transform", translateCSS(0, innerHeight))
        .attr('class', 'xAxis')
        .call(xAxis);
    chart
        .append('text')
        .attr("transform", translateCSS(innerWidth / 2, innerHeight + 30))
        .style("text-anchor", "middle")
        .attr('class', 'xAxis-label')
        .text(feature2Variable.x)

    /** Y Axis */
    const yAxis = d3.axisLeft(yScale);
    chart
        .append("g")
        .attr("transform", translateCSS(0, 0))
        .attr('class', 'yAxis')
        .call(yAxis);

    chart
    .append('text')
    .attr("transform", translateCSS(-10, -20))
    .attr('class', 'yAxis-label')
    .text(feature2Variable.y)

    return (
        <Fragment>
            <header>
                <h1>🐜 Ant Visualization Chart</h1>
                <button
                    style={{ marginBottom: 20, marginRight: 10 }} 
                    onClick={onFileUploadButtonClick}>From file (.JSON)</button>
                    <input type="file" style={{ display: 'none'}} ref={fileUploadRef} onChange={handleFileUpload}/>
                <button
                    style={{ marginBottom: 20 }} 
                    onClick={() => setDataset(generateDataset())}>Random data</button>
            </header>
            <div className="container">
                <div className="card" onContextMenu={e => e.preventDefault()}>
                    <svg id="ants-chart-svg" ref={SVGRef} width={outerWidth} height={outerHeight} >
                        <g transform={translateCSS(margin.left, margin.top)} ref={chartRef}>
                            {dataset.map((d, idx) => (
                                <AntSVG
                                    key={idx} 
                                    x={xScale(getAntValue(d, 'x'))} 
                                    y={yScale(getAntValue(d, 'y'))} 
                                    bodySize={getAntValue(d, 'bodySize')}
                                    headSize={getAntValue(d, 'headSize')}
                                    antennaeLength={getAntValue(d, 'antennaeLength')}
                                    legsLength={getAntValue(d, 'legsLength')}
                                    onLeftClick={onLeftClick}
                                    onRightClick={onRightClick}
                                    onMouseOver={e => onMouseOver(idx, e)}
                                    onMouseLeave={onMouseLeave}
                                />
                            ))}
                        </g>
                    </svg>
                    <Tooltip x={tooltip.x} y={tooltip.y} value={tooltip.value} visible={tooltip.visible} />
                </div>
            </div>
        </Fragment>
    )
}

export default AntsChart;
