import * as d3 from "d3";
import { Fragment, useEffect, useRef, useState } from "react";

import { generateDataset } from "../utils/dataset-utils";
import { Ant, AntDataset } from "./DatasetModel";

interface PositionAttribute {
    x: keyof Ant;
    y: keyof Ant;
}

const margin = {top: 20, right: 0, bottom: 20, left: 20};
const outerWidth = window.innerWidth - 30;
const outerHeight = window.innerHeight - 50;
const antMaxHeight = 100;
const antMaxWidth = 25;
const innerWidth = outerWidth - margin.left - margin.right - antMaxWidth;
const innerHeight = outerHeight - margin.top - margin.bottom - antMaxHeight;
const antColor = '#262626';

const translate = (x: number, y: number) => `translate(${x}, ${y})`;
const listOfPoints = (list: { x: number, y: number}[]) => {
    let a = "";
    list.forEach(point => a = a.concat(`${point.x}, ${point.y} `));
    console.log(a);
    return a;
}

const maxOf = (dataset: AntDataset, key: keyof Ant) => d3.max((dataset.map(e => e[key]))) as number;
const minOf = (dataset: AntDataset, key: keyof Ant) => d3.min((dataset.map(e => e[key]))) as number;

function AntsChart() {

    const [dataset, setDataset] = useState<AntDataset>([])
    const [positionAttribute, setPositionAttribute] = useState<PositionAttribute>({ x: 'legsLength', y: 'bodySize'})
    const ref = useRef(null);

    function initializeChart () {
        console.log("initializeChart")
        const svg = d3.select(ref.current)
            .attr("width", outerWidth - margin.left)
            .attr("height", outerHeight);

        console.log(window.innerWidth)
        svg.append("g")
            .attr("transform", translate(margin.left, margin.top))
            .attr("class", "ants-chart-svg-g")
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
        const svg = d3.select(ref.current).select(".ants-chart-svg-g");
        if (!svg || !dataset.length) return;

        console.log(dataset)


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
            .attr("transform", translate(margin.left - 10, 0))
            .attr('class', 'yAxis')
            .call(yAxis);

        svg
        .append('text')
        .attr("transform", translate(margin.left, 20))
        .attr('class', 'yAxis-label')
        .text(positionAttribute.y)


        // const ants = svg
        //     .selectAll('.ant')
        //     .data(dataset)
        //     .enter()
        //     .append("g")
        //     .attr("class", "ant");

        // console.log(ants)
        
        // Head
        const antHeads = svg.selectAll('.ant.ant-head').data(dataset);
        antHeads
            .enter()
            .append('ellipse')
            .attr("fill", `${antColor}`)
            .attr("class", "ant ant-head")
            antHeads
            .transition()
            .duration(1000)
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
            .duration(1000)
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
             .duration(1000)
             .attr('points', d => listOfPoints(
                 [
                     { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize },
                     { x: xScale(d[positionAttribute.x]) + 15, y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize - d.bodySize * 0.5 },
                     { x: xScale(d[positionAttribute.x]) + 15 + d.frontLegs, y: yScale(d[positionAttribute.y])   }
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
                 .duration(1000)
                 .attr('points', d => listOfPoints(
                     [
                         { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize },
                         { x: xScale(d[positionAttribute.x]) - 15, y: yScale(d[positionAttribute.y]) + d.headSize + d.bodySize - d.bodySize * 0.5 },
                         { x: xScale(d[positionAttribute.x]) - 15 - d.frontLegs, y: yScale(d[positionAttribute.y])   }
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
                .duration(1000)
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
            .duration(1000)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) - d.headSize * 0.4 },
                    { x: xScale(d[positionAttribute.x]) + 15, y: yScale(d[positionAttribute.y]) - d.headSize * 0.7 },
                    { x: xScale(d[positionAttribute.x]) + 10, y: yScale(d[positionAttribute.y]) - d.headSize - d.antennaeLength  }
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
            .duration(1000)
            .attr('points', d => listOfPoints(
                [
                    { x: xScale(d[positionAttribute.x]), y: yScale(d[positionAttribute.y]) - d.headSize * 0.4 },
                    { x: xScale(d[positionAttribute.x]) - 15, y: yScale(d[positionAttribute.y]) - d.headSize * 0.7  },
                    { x: xScale(d[positionAttribute.x]) - 10, y: yScale(d[positionAttribute.y]) - d.headSize - d.antennaeLength  }
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
            .duration(1000)
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
            .duration(1000)
            .attr('x1', d => xScale(d[positionAttribute.x]))
            .attr('x2', d => xScale(d[positionAttribute.x]) + d.legsLength)
            .attr('y1', d => yScale(d[positionAttribute.y]) +  d.headSize + (d.bodySize * 2) + d.backSize)
            .attr('y2', d => yScale(d[positionAttribute.y]) +  d.headSize + (d.bodySize * 2) + d.backSize + d.legsLength)

        setEventListeners();
    }

    function setEventListeners () {
        // Listeners 
        d3.selectAll('.ant-antenna-1, .ant-antenna-2').on('click', () => {
            setPositionAttribute({ ...positionAttribute, x: 'antennaeLength'})
        });
        d3.selectAll('.ant-leg-1, .ant-leg-2').on('click', () => {
            setPositionAttribute({ ...positionAttribute, x: 'legsLength'})
        });
        d3.selectAll('.ant-head').on('click', () => {
            setPositionAttribute({ ...positionAttribute, x: 'headSize'})
        });
        d3.selectAll('.ant-body').on('click', () => {
            setPositionAttribute({ ...positionAttribute, x: 'bodySize'})
        });
        d3.selectAll('.ant-back').on('click', () => {
            setPositionAttribute({ ...positionAttribute, x: 'backSize'})
        });

        d3.selectAll('.ant-antenna-1, .ant-antenna-2').on('contextmenu', (e) => {
            setPositionAttribute({ ...positionAttribute, y: 'antennaeLength'})
        });
        d3.selectAll('.ant-leg-1, .ant-leg-2').on('contextmenu', () => {
            setPositionAttribute({ ...positionAttribute, y: 'legsLength'})
        });
        d3.selectAll('.ant-head').on('contextmenu', (e) => {
            setPositionAttribute({ ...positionAttribute, y: 'headSize'})
        });
        d3.selectAll('.ant-body').on('contextmenu', (e) => {
            setPositionAttribute({ ...positionAttribute, y: 'bodySize'})
        });
        d3.selectAll('.ant-back').on('contextmenu', (e) => {
            setPositionAttribute({ ...positionAttribute, y: 'backSize'})
        });
    }

    useEffect(() => {
        updateChart();
    }, [dataset, positionAttribute]);


    return (
        <div onContextMenu={e => e.preventDefault()}>
            <h1>Ant Visualization Chart</h1>
            <button
                style={{ marginBottom: 20 }} 
                onClick={() => setDataset(generateDataset())}>Refresh</button>
            <svg id="ants-chart-svg" ref={ref}>

            </svg>
        </div>
    )
}

export default AntsChart;
