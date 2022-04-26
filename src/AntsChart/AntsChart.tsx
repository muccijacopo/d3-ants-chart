import * as d3 from "d3";
import { Fragment, useEffect, useRef, useState } from "react";

import { generateDataset, getPropertyByKey, isDatasetValid } from "../utils/dataset";
import { Ant, AntDataset } from "./DatasetModel";
import './AntsChart.css';

interface PositionAttribute {
    x: keyof Ant;
    y: keyof Ant;
}

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

const translate = (x: number, y: number) => `translate(${x}, ${y})`;
const listOfPoints = (list: { x: number, y: number}[]) => {
    let a = "";
    list.forEach(point => a = a.concat(`${point.x}, ${point.y} `));
    return a;
}

const maxOf = (dataset: AntDataset, key: keyof Ant) => d3.max((dataset.map(e => e[key]))) as number;
const minOf = (dataset: AntDataset, key: keyof Ant) => d3.min((dataset.map(e => e[key]))) as number;

const antColor = '#262626';
const transitionDuration = 800;

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
    const [resize, setResize] = useState(window.innerWidth);
    const SVGRef = useRef(null);
    const fileUploadRef = useRef(null);

    /** Effects */

    useEffect(() => {
        initializeChart();
        updateChart();
        window.addEventListener('resize', () => setResize(window.innerWidth));
    }, []);

    useEffect(() => {
        initializeChart();
        updateChart();
    }, [resize])

    useEffect(() => {
        updateChart();
    }, [dataset, feature2Variable]);

    /** Utility functions */

    function getVariabileByFeature (feat: keyof FeatureToVariabile): keyof Ant {
        return feature2Variable[feat] as keyof Ant
    }

    function getAntValue (ant: Ant, feat: keyof FeatureToVariabile) {
        return ant[getVariabileByFeature(feat)];
    }

    function isReady() {
        const card = document.querySelector(".card");
        return !!card;
    }

    function getDimensions () {
        const card = document.querySelector(".card")!;
        const outerWidth = card.getBoundingClientRect().width;
        const outerHeight = card.getBoundingClientRect().height;
        const margin = {top: 50, right: 50, bottom: 50, left: 50 };
        const innerWidth = outerWidth - margin.left - margin.right;
        const innerHeight = outerHeight - margin.top - margin.bottom;
        return { outerHeight, outerWidth, margin, innerWidth, innerHeight}
    }


    /** Chart  */

    function initializeChart () {
        if (isReady()) {
            const { outerWidth, outerHeight, margin } = getDimensions();
            const svg = d3.select(SVGRef.current)
                .attr("width", outerWidth)
                .attr("height", outerHeight);

            const chart = svg.select("g").node();
            if (!chart) svg.append("g").attr("class", "ants-chart-svg-g")
            svg.select("g")
                .attr("transform", translate(margin.left, margin.top))
                .attr("width", outerWidth)
                .attr("height", outerHeight);
        }
    }

    function updateChart () {
        const svg = d3.select(SVGRef.current).select(".ants-chart-svg-g")
        if (!svg || !dataset.length || !isReady()) return;
        const { margin, innerWidth, innerHeight } = getDimensions();
        

        // Remove previous scales
        svg.select('.xAxis').remove();
        svg.select('.xAxis-label').remove();
        svg.select('.yAxis').remove();
        svg.select('.yAxis-label').remove();

        /** X Axis */
        const xScale = d3
            .scaleLinear()
            .domain([minOf(dataset, getVariabileByFeature('x')), maxOf(dataset, getVariabileByFeature('x'))])
            .range([0, innerWidth])

        const xAxis = d3.axisBottom(xScale);
        svg
            .append("g")
            .attr("transform", translate(0, innerHeight))
            .attr('class', 'xAxis')
            .call(xAxis);
        svg
            .append('text')
            .attr("transform", translate(innerWidth / 2, innerHeight + 30))
            .style("text-anchor", "middle")
            .attr('class', 'xAxis-label')
            .text(feature2Variable.x)

        /** Y Axis */
        const yScale = d3
            .scaleLinear()
            .domain([minOf(dataset, getVariabileByFeature('y')), maxOf(dataset, getVariabileByFeature('y'))])
            .range([innerHeight, 0])
        const yAxis = d3.axisLeft(yScale);
        svg
            .append("g")
            .attr("transform", translate(0, 0))
            .attr('class', 'yAxis')
            .call(yAxis);

        svg
        .append('text')
        .attr("transform", translate(-10, -20))
        .attr('class', 'yAxis-label')
        .text(feature2Variable.y)


        /**
         * Create ants bodies
         */
        const antsBodies = svg.selectAll('.ant.ant-body').data(dataset);
        antsBodies
            .enter()
            .append('ellipse')
            .attr("fill", `${antColor}`)
            .attr("class", "ant ant-body")
        antsBodies
            .transition()
            .duration(transitionDuration)
            .attr('cx', d => xScale(getAntValue(d, 'x')))
            .attr('cy', d => yScale(d[getVariabileByFeature('y')]))
            .attr("rx", d => d[getVariabileByFeature('bodySize')] *0.8)
            .attr("ry", d => d[getVariabileByFeature('bodySize')])


          // Head
          const antHeads = svg.selectAll('.ant.ant-head').data(dataset);
          antHeads
              .enter()
              .append('ellipse')
              .attr("fill", `${antColor}`)
              .attr("class", "ant ant-head")
              antHeads
              .transition()
              .duration(transitionDuration)
              .attr('cx', d => xScale(getAntValue(d, 'x')))
              .attr('cy', d => yScale(d[getVariabileByFeature('y')]) - getAntValue(d, 'bodySize') - getAntValue(d, 'headSize'))
              .attr("rx", d => getAntValue(d, 'headSize') * 0.7)
              .attr("ry", d => getAntValue(d, 'headSize'))

         // Front legs
         const frontLegs1 = svg.selectAll('.ant.ant-front-leg-1').data(dataset);
         frontLegs1
             .enter()
             .append('polyline')
             .attr('stroke', `${antColor}`)
             .attr('stroke-width', '2')
             .attr('fill', 'none')
             .attr("class", "ant ant-front-leg-1")
             .attr('points', d => listOfPoints(
                [
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                ]
            ))
        frontLegs1
             .transition()
             .duration(transitionDuration)
             .attr('points', d => listOfPoints(
                 [
                     { x: xScale(getAntValue(d, 'x')), y: yScale(getAntValue(d, 'y')) },
                     { x: xScale(getAntValue(d, 'x')) + 15, y: yScale(getAntValue(d, 'y')) - 10 },
                     { x: xScale(getAntValue(d, 'x')) + 20, y: yScale(getAntValue(d, 'y')) - 10 - getAntValue(d, 'legsLength')   }
                 ]
             ))
        const frontLegs2 = svg.selectAll('.ant.ant-front-leg-2').data(dataset);
        frontLegs2
            .enter()
            .append('polyline')
            .attr('stroke', `${antColor}`)
            .attr('stroke-width', '2')
            .attr('fill', 'none')
            .attr("class", "ant ant-front-leg-2")
            .attr('points', d => listOfPoints(
                [
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                ]
            ))
    frontLegs2
            .transition()
            .duration(transitionDuration)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(getAntValue(d, 'x')), y: yScale(getAntValue(d, 'y')) },
                    { x: xScale(getAntValue(d, 'x')) - 15, y: yScale(getAntValue(d, 'y')) - 10 },
                    { x: xScale(getAntValue(d, 'x')) - 20, y: yScale(getAntValue(d, 'y')) - 10 - getAntValue(d, 'legsLength')   }
                ]
            ))


        // Middle legs
        const middleLegs1 = svg.selectAll('.ant.ant-middle-leg-1').data(dataset);
        middleLegs1
            .enter()
            .append('polyline')
            .attr('stroke', `${antColor}`)
            .attr('stroke-width', '2')
            .attr('fill', 'none')
            .attr("class", "ant ant-middle-leg-1")
            .attr('points', d => listOfPoints(
                [
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                ]
            ))
        middleLegs1
                .transition()
                .duration(transitionDuration)
                .attr('points', d => listOfPoints(
                    [
                        { x: xScale(getAntValue(d, 'x')), y: yScale(getAntValue(d, 'y')) },
                        { x: xScale(getAntValue(d, 'x')) + 15, y: yScale(getAntValue(d, 'y')) },
                        { x: xScale(getAntValue(d, 'x')) + 15 + getAntValue(d, 'legsLength'), y: yScale(getAntValue(d, 'y')) - getAntValue(d, 'legsLength') },
                    ]
                ))
        const middleLegs2 = svg.selectAll('.ant.ant-middle-leg-2').data(dataset);
        middleLegs2
            .enter()
            .append('polyline')
            .attr('stroke', `${antColor}`)
            .attr('stroke-width', '2')
            .attr('fill', 'none')
            .attr("class", "ant ant-middle-leg-2")
            .attr('points', d => listOfPoints(
                [
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                ]
            ))
        middleLegs2
            .transition()
            .duration(transitionDuration)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(getAntValue(d, 'x')), y: yScale(getAntValue(d, 'y')) },
                    { x: xScale(getAntValue(d, 'x')) - 15, y: yScale(getAntValue(d, 'y')) },
                    { x: xScale(getAntValue(d, 'x')) - 15 - getAntValue(d, 'legsLength'), y: yScale(getAntValue(d, 'y')) - getAntValue(d, 'legsLength') },
                ]
            ))


        // Backs
        const antBacks = svg.selectAll('.ant.ant-back').data(dataset);
            antBacks
                .enter()
                .append('ellipse')
                .attr("fill", `${antColor}`)
                .attr("class", "ant ant-back")
            antBacks
                .transition()
                .duration(transitionDuration)
                .attr('cx', d => xScale(getAntValue(d, 'x')))
                .attr('cy', d => yScale(getAntValue(d, 'y')) + getAntValue(d, 'bodySize') * 2)
                .attr('rx', d => getAntValue(d, 'bodySize') * 0.8)
                .attr('ry', d => getAntValue(d, 'bodySize'))

        
        // Antennas
        const antAntennasFirst = svg.selectAll('.ant.ant-antenna-1').data(dataset);
        antAntennasFirst
            .enter()
            .append('polyline')
            .attr('stroke', `${antColor}`)
            .attr('stroke-width', '2')
            .attr('fill', 'none')
            .attr('class', "ant ant-antenna-1")
            .attr('points', d => listOfPoints(
                [
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                ]
            ))
            
        antAntennasFirst
            .transition()
            .duration(transitionDuration)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(getAntValue(d, 'x')), y: yScale(getAntValue(d, 'y')) - getAntValue(d, 'bodySize') - getAntValue(d, 'headSize') },
                    { x: xScale(getAntValue(d, 'x')) + getAntValue(d, 'antennaeLength') * 2, y: yScale(getAntValue(d, 'y')) - getAntValue(d, 'bodySize') - getAntValue(d, 'headSize') - getAntValue(d, 'antennaeLength') * 2 },
                ]
            ))
        
        const antAntennasSecond = svg.selectAll('.ant.ant-antenna-2').data(dataset);
        antAntennasSecond
            .enter()
            .append('polyline')
            .attr('stroke', `${antColor}`)
            .attr('stroke-width', '2')
            .attr('fill', 'none')
            .attr("class", "ant ant-antenna-2")
            .attr('points', d => listOfPoints(
                [
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                ]
            ))
        antAntennasSecond
            .transition()
            .duration(transitionDuration)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(getAntValue(d, 'x')), y: yScale(getAntValue(d, 'y')) - getAntValue(d, 'bodySize') - getAntValue(d, 'headSize') },
                    { x: xScale(getAntValue(d, 'x')) - getAntValue(d, 'antennaeLength') * 2, y: yScale(getAntValue(d, 'y')) - getAntValue(d, 'bodySize') - getAntValue(d, 'headSize') - getAntValue(d, 'antennaeLength') * 2 },
                ]
            ))


        const antLegsFirst = svg.selectAll('.ant.ant-leg-1').data(dataset);
        antLegsFirst
            .enter()
            .append('polyline')
            .attr('stroke', `${antColor}`)
            .attr('stroke-width', '2')
            .attr('fill', 'none')
            .attr('class', "ant ant-leg-1")
            .attr('points', d => listOfPoints(
                [
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                ]
            ))
        
        antLegsFirst
            .transition()
            .duration(transitionDuration)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(getAntValue(d, 'x')), y: yScale(getAntValue(d, 'y')) },
                    { x: xScale(getAntValue(d, 'x')) + getAntValue(d, 'bodySize') + 5, y: yScale(getAntValue(d, 'y')) + 5 },
                    { x: xScale(getAntValue(d, 'x')) + getAntValue(d, 'bodySize') + 5 + getAntValue(d, 'legsLength'), y: yScale(getAntValue(d, 'y')) + 5 + getAntValue(d, 'legsLength') },
                ]
            ))

        const antLegsSecond = svg.selectAll('.ant.ant-leg-2').data(dataset);
        antLegsSecond
            .enter()
            .append('polyline')
            .attr('stroke', `${antColor}`)
            .attr('stroke-width', '2')
            .attr('fill', 'none')
            .attr('class', "ant ant-leg-2")
            .attr('points', d => listOfPoints(
                [
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                ]
            ))
        antLegsSecond
            .transition()
            .duration(transitionDuration)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(getAntValue(d, 'x')), y: yScale(getAntValue(d, 'y')) },
                    { x: xScale(getAntValue(d, 'x')) - getAntValue(d, 'bodySize') - 5, y: yScale(getAntValue(d, 'y')) + 5 },
                    { x: xScale(getAntValue(d, 'x')) - getAntValue(d, 'bodySize') - 5 - getAntValue(d, 'legsLength'), y: yScale(getAntValue(d, 'y')) + 5 + getAntValue(d, 'legsLength') },
                ]
            ))

        setEventListeners();
    }

    /** Sets all events listeners */
    function setEventListeners () {
        setEventListenerOn('ant-antenna-1');
        setEventListenerOn('ant-antenna-2');
        setEventListenerOn('ant-head');
        setEventListenerOn('ant-front-leg-1');
        setEventListenerOn('ant-front-leg-2');
        setEventListenerOn('ant-middle-leg-1');
        setEventListenerOn('ant-middle-leg-2');
        setEventListenerOn('ant-leg-1');
        setEventListenerOn('ant-leg-2');
    }

    function setEventListenerOn(key: string) {
        const prop = getPropertyByKey(key);
        if (!prop) return;

        d3.selectAll('.' + key).on('click', () => {
            const currentXVariable = feature2Variable.x;
            const newXVariable = getVariabileByFeature(prop as any);
            setFeature2Variable({ ...feature2Variable, x: newXVariable, [prop]: currentXVariable })
        });
        d3.selectAll("."+ key).on('contextmenu', () => {
            const currentYVariable = feature2Variable.x;
            const newYVariable = getVariabileByFeature(prop as any);
            setFeature2Variable({ ...feature2Variable, y: newYVariable, [prop]: currentYVariable })
        });
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
                console.log(isDatasetValid(dataset));
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


    return (
        <Fragment>
            <header>
                <h1>🐜 Ant Visualization Chart</h1>
                <button
                    style={{ marginBottom: 20, marginRight: 10 }} 
                    onClick={onFileUploadButtonClick}>From file</button>
                    <input type="file" style={{ display: 'none'}} ref={fileUploadRef} onChange={handleFileUpload}/>
                <button
                    style={{ marginBottom: 20 }} 
                    onClick={() => setDataset(generateDataset())}>Random</button>
            </header>
            <div className="container">
                <div className="card" onContextMenu={e => e.preventDefault()}>
                    <svg id="ants-chart-svg" ref={SVGRef}></svg>
                </div>
            </div>
        </Fragment>
    )
}

export default AntsChart;
