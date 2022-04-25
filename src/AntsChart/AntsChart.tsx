import * as d3 from "d3";
import { Fragment, useEffect, useRef, useState } from "react";

import { generateDataset, getPropertyByKey } from "../utils/dataset";
import { Ant, AntDataset } from "./DatasetModel";

interface PositionAttribute {
    x: keyof Ant;
    y: keyof Ant;
}

const translate = (x: number, y: number) => `translate(${x}, ${y})`;
const listOfPoints = (list: { x: number, y: number}[]) => {
    let a = "";
    list.forEach(point => a = a.concat(`${point.x}, ${point.y} `));
    return a;
}

const maxOf = (dataset: AntDataset, key: keyof Ant) => d3.max((dataset.map(e => e[key]))) as number;
const minOf = (dataset: AntDataset, key: keyof Ant) => d3.min((dataset.map(e => e[key]))) as number;

function calculateFrontLegsPoints (d: Ant, xScale: any, yScale: any, positionAttribute: PositionAttribute, position: "left" | "right") {
    return listOfPoints(
        [
            { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize * 0.2 },
            { x: xScale(d[positionAttribute.x]) + 10, y: yScale(d[positionAttribute.y]) + d.headSize },
            { x: xScale(d[positionAttribute.x]) + 15 + d.frontLegsLength, y: yScale(d[positionAttribute.y])   }
        ]
    )
}

const antColor = '#262626';
const transitionDuration = 800;

function AntsChart() {

    const [dataset, setDataset] = useState<AntDataset>([])
    const [positionAttribute, setPositionAttribute] = useState<PositionAttribute>({ x: 'legsLength', y: 'bodySize'})
    const ref = useRef(null);

    function isReady() {
        const card = document.querySelector(".card");
        console.log(card);
        return !!card;
    }

    function getDimensions () {
        const card = document.querySelector(".card")!;
        const outerWidth = card.getBoundingClientRect().width;
        const outerHeight = card.getBoundingClientRect().height;
        const margin = {top: 50, right: 50, bottom: 50, left: 25};
        const innerWidth = outerWidth - margin.left - margin.right;
        const innerHeight = outerHeight - margin.top - margin.bottom;
        return { outerHeight, outerWidth, margin, innerWidth, innerHeight}
    }

    function initializeChart () {
        if (isReady()) {
            const { outerWidth, outerHeight, margin } = getDimensions();
            console.log(outerHeight);
            const svg = d3.select(ref.current)
                .attr("width", outerWidth)
                .attr("height", outerHeight);
    
            svg.append("g")
                .attr("transform", translate(margin.left, margin.top))
                .attr("class", "ants-chart-svg-g")
        }
    }

    useEffect(() => {
        initializeChart();
        setDataset(generateDataset())
        // window.addEventListener('resize', () => {
        //     initializeChart();
        //     updateChart();
        // });
    }, []);


    function updateChart () {
        const svg = d3.select(ref.current).select('.ants-chart-svg-g')
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
            .domain([minOf(dataset, positionAttribute.x), maxOf(dataset, positionAttribute.x)])
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
            .text(positionAttribute.x)

        /** Y Axis */
        const yScale = d3
            .scaleLinear()
            .domain([minOf(dataset, positionAttribute.y), maxOf(dataset, positionAttribute.y)])
            .range([innerHeight, 0])
        const yAxis = d3.axisLeft(yScale);
        svg
            .append("g")
            .attr("transform", translate(margin.left, 0))
            .attr('class', 'yAxis')
            .call(yAxis);

        svg
        .append('text')
        .attr("transform", translate(margin.left, 20))
        .attr('class', 'yAxis-label')
        .text(positionAttribute.y)

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
            .attr('cx', d => xScale(d[positionAttribute.x]))
            .attr('cy', d => yScale(d[positionAttribute.y]))
            .attr("rx", d => d.headSize * 0.7)
            .attr("ry", d => d.headSize)


        const antsBodies = svg.selectAll('.ant.ant-body').data(dataset);
        // Bodies
        antsBodies
            .enter()
            .append('ellipse')
            .attr("fill", `${antColor}`)
            .attr("class", "ant ant-body")
        antsBodies
            .transition()
            .duration(transitionDuration)
            .attr('cx', d => xScale(d[positionAttribute.x]))
            .attr('cy', d => yScale(d[positionAttribute.y]) + d.headSize + d.bodySize)
            .attr("rx", d => d.bodySize * 0.7)
            .attr("ry", d => d.bodySize)

         // Front legs
         const frontLegs1 = svg.selectAll('.ant.ant-front-leg-1').data(dataset);
         frontLegs1
             .enter()
             .append('polyline')
             .attr('stroke', `${antColor}`)
             .attr('stroke-width', '2')
             .attr('fill', 'none')
             .attr("class", "ant ant-front-leg-1")
        frontLegs1
             .transition()
             .duration(transitionDuration)
             .attr('points', d => listOfPoints(
                 [
                     { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize * 0.2 },
                     { x: xScale(d[positionAttribute.x]) + 10, y: yScale(d[positionAttribute.y]) + d.headSize },
                     { x: xScale(d[positionAttribute.x]) + 15 + d.frontLegsLength, y: yScale(d[positionAttribute.y])   }
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
            frontLegs2
                 .transition()
                 .duration(transitionDuration)
                 .attr('points', d => listOfPoints(
                    [
                        { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize * 0.2 },
                        { x: xScale(d[positionAttribute.x]) - 10, y: yScale(d[positionAttribute.y]) + d.headSize },
                        { x: xScale(d[positionAttribute.x]) - 15 - d.frontLegsLength, y: yScale(d[positionAttribute.y])   }
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
        middleLegs1
                .transition()
                .duration(transitionDuration)
                .attr('points', d => listOfPoints(
                    [
                        { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize },
                        { x: xScale(d[positionAttribute.x]) + 10, y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize },
                        { x: xScale(d[positionAttribute.x]) + 10 + d.middleLegsLength, y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize + 5 },
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
        middleLegs2
            .transition()
            .duration(transitionDuration)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize },
                    { x: xScale(d[positionAttribute.x]) - 10, y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize },
                    { x: xScale(d[positionAttribute.x]) - 10 - d.middleLegsLength, y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize + 5 },
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
                .attr('cx', d => xScale(d[positionAttribute.x]))
                .attr('cy', d => yScale(d[positionAttribute.y]) + d.headSize + (d.bodySize * 2) + d.backSize)
                .attr('rx', d => d.backSize * 0.7)
                .attr('ry', d => d.backSize)

        
        // Antennas
        const antAntennasFirst = svg.selectAll('.ant.ant-antenna-1').data(dataset);
        antAntennasFirst
            .enter()
            .append('polyline')
            .attr('stroke', `${antColor}`)
            .attr('stroke-width', '2')
            .attr('fill', 'none')
            .attr('class', "ant ant-antenna-1")
            
        antAntennasFirst
            .transition()
            .duration(transitionDuration)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) - d.headSize * 0.4 },
                    { x: xScale(d[positionAttribute.x]) + 10, y: yScale(d[positionAttribute.y]) - d.headSize * 0.7 },
                    { x: xScale(d[positionAttribute.x]) + 20, y: yScale(d[positionAttribute.y]) - d.headSize - d.antennaeLength  }
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
        antAntennasSecond
            .transition()
            .duration(transitionDuration)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) - d.headSize * 0.4 },
                    { x: xScale(d[positionAttribute.x]) - 10, y: yScale(d[positionAttribute.y]) - d.headSize * 0.7  },
                    { x: xScale(d[positionAttribute.x]) - 20, y: yScale(d[positionAttribute.y]) - d.headSize - d.antennaeLength  }
                ]
            ))


        const antLegsFirst = svg.selectAll('.ant.ant-leg-1').data(dataset);
        antLegsFirst
            .enter()
            .append('line')
            .attr('stroke', `${antColor}`)
            .attr('stroke-width', '2')
            .attr('class', "ant ant-leg-1")
        
        antLegsFirst
            .transition()
            .duration(transitionDuration)
            .attr('x1', d => xScale(d[positionAttribute.x]))
            .attr('x2', d => xScale(d[positionAttribute.x]) - d.legsLength)
            .attr('y1', d => yScale(d[positionAttribute.y]) + d.headSize + (d.bodySize * 2) + d.backSize)
            .attr('y2', d => yScale(d[positionAttribute.y]) + d.headSize + (d.bodySize * 2) + d.backSize + d.legsLength)

        const antLegsSecond = svg.selectAll('.ant.ant-leg-2').data(dataset);
        antLegsSecond
            .enter()
            .append('line')
            .attr('stroke', `${antColor}`)
            .attr('stroke-width', '2')
            .attr('class', "ant ant-leg-2")
        antLegsSecond
            .transition()
            .duration(transitionDuration)
            .attr('x1', d => xScale(d[positionAttribute.x]))
            .attr('x2', d => xScale(d[positionAttribute.x]) + d.legsLength)
            .attr('y1', d => yScale(d[positionAttribute.y]) +  d.headSize + (d.bodySize * 2) + d.backSize)
            .attr('y2', d => yScale(d[positionAttribute.y]) +  d.headSize + (d.bodySize * 2) + d.backSize + d.legsLength)

        setEventListeners();
    }

    function setEventListenerOn(key: string) {
        const prop = getPropertyByKey(key);
        if (!prop) return;
        d3.selectAll('.' + key).on('click', () => {
            setPositionAttribute({ ...positionAttribute, x: prop})
        });
        d3.selectAll("."+ key).on('contextmenu', () => {
            setPositionAttribute({ ...positionAttribute, y: prop})
        });
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

    useEffect(() => {
        updateChart();
    }, [dataset, positionAttribute]);


    return (
        <div onContextMenu={e => e.preventDefault()}>
            <h1>Ant Visualization Chart</h1>
            <button
                style={{ marginBottom: 20, marginRight: 10 }} 
                onClick={() => console.log("From file")}>From file</button>
            <button
                style={{ marginBottom: 20 }} 
                onClick={() => setDataset(generateDataset())}>Random</button>
                <div className="card">
                    <svg id="ants-chart-svg" ref={ref}></svg>
                </div>
        </div>
    )
}

export default AntsChart;
