import * as d3 from "d3";
import { Fragment, useEffect, useRef, useState } from "react";

import { generateDataset } from "../utils/dataset-utils";
import { Ant, AntDataset } from "./DatasetModel";

interface PositionAttribute {
    x: keyof Ant;
    y: keyof Ant;
}

const margin = {top: 30, right: 30, bottom: 70, left: 30},
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - 100 - margin.top - margin.bottom

const translate = (x: number, y: number) => `translate(${x}, ${y})`;

const maxOf = (dataset: AntDataset, key: keyof Ant) => d3.max((dataset.map(e => e[key]))) as number;
const minOf = (dataset: AntDataset, key: keyof Ant) => d3.min((dataset.map(e => e[key]))) as number;

function AntsChart() {

    const [dataset, setDataset] = useState<AntDataset>([])
    const [positionAttribute, setPositionAttribute] = useState<PositionAttribute>({ x: 'legsLength', y: 'bodySize'})
    const ref = useRef(null);

    function initializeChart () {
        console.log("initializeChart")
        const svg = d3.select(ref.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

        const chart = d3.select(ref.current).select(".chart");
        svg.append("g").attr("class", "chart")
        if (!chart) {

        }
        chart.attr("transform", translate(margin.left / 2, margin.top));
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
        const svg = d3.select(ref.current).select(".chart");
        if (!svg || !dataset.length) return;


        // Remove previous scales
        svg.select('.xAxis').remove();
        svg.select('.xAxis-label').remove();
        svg.select('.yAxis').remove();
        svg.select('.yAxis-label').remove();

        /** X Axis */
        const xScale = d3
            .scaleLinear()
            .domain([minOf(dataset, positionAttribute.x), maxOf(dataset, positionAttribute.x)])
            .range([margin.left + margin.right, width - margin.left - margin.right])

        const xAxis = d3.axisBottom(xScale);
        svg
            .append("g")
            .attr("transform", translate(0, height - 20))
            .attr('class', 'xAxis')
            .call(xAxis);
        svg
            .append('text')
            .attr("transform", translate(width/2, height))
            .style("text-anchor", "middle")
            .attr('class', 'xAxis-label')
            .text(positionAttribute.x)

        /** Y Axis */
        const yScale = d3
            .scaleLinear()
            .domain([minOf(dataset, positionAttribute.y), maxOf(dataset, positionAttribute.y)])
            .range([height - margin.bottom - margin.top - 100, 0])
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
        
        const antHeads = svg.selectAll('.ant.ant-head').data(dataset);
        // Head
        antHeads.enter()
            .append('circle')
            .attr("fill", "black")
            .attr("class", "ant ant-head")
        antHeads
            .transition()
            .duration(1000)
            .attr('cx', d => xScale(d[positionAttribute.x]))
            .attr('cy', d => yScale(d[positionAttribute.y]))
            .attr("r", d => d.headSize)

        const antsBodies = svg.selectAll('.ant.ant-body').data(dataset);
        // Bodies
        antsBodies
            .enter()
            .append('circle')
            .attr("fill", "black")
            .attr("class", "ant ant-body")
        antsBodies
            .transition()
            .duration(1000)
            .attr('cx', d => xScale(d[positionAttribute.x]))
            .attr('cy', d => yScale(d[positionAttribute.y]) + d.bodySize + (d.headSize / 2))
            .attr("r", d => d.bodySize)

        // Backs
        const antBacks = svg.selectAll('.ant.ant-back').data(dataset);
            antBacks
                .enter()
                .append('circle')
                .attr("fill", "black")
                .attr("class", "ant ant-back")
            antBacks
                .transition()
                .duration(1000)
                .attr('cx', d => xScale(d[positionAttribute.x]))
                .attr('cy', d => yScale(d[positionAttribute.y]) + d.headSize + d.bodySize + d.backSize)
                .attr("r", d => d.backSize)

        
        // Antennas
        const antAntennasFirst = svg.selectAll('.ant.ant-antenna-1').data(dataset);
        antAntennasFirst
            .enter()
            .append('line')
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
            .attr('class', "ant ant-antenna-1")
            
        antAntennasFirst
            .transition()
            .duration(1000)
            .attr('x1', d => xScale(d[positionAttribute.x]))
            .attr('x2', d => xScale(d[positionAttribute.x]) + 100)
            .attr('y1', d => yScale(d[positionAttribute.y]))
            .attr('y2', d => yScale(d[positionAttribute.y]) - d.antennaeLength)
        
        const antAntennasSecond = svg.selectAll('.ant.ant-antenna-2').data(dataset);
        antAntennasSecond
            .enter()
            .append('line')
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
            .attr("class", "ant ant-antenna-2")
        antAntennasSecond
            .transition()
            .duration(1000)
            .attr('x1', d => xScale(d[positionAttribute.x]))
            .attr('x2', d => xScale(d[positionAttribute.x]) - 6)
            .attr('y1', d => yScale(d[positionAttribute.y]))
            .attr('y2', d => yScale(d[positionAttribute.y]) - d.antennaeLength)


        const antLegsFirst = svg.selectAll('.ant.ant-leg-1').data(dataset);
        antLegsFirst
            .enter()
            .append('line')
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
            .attr('class', "ant ant-leg-1")
        antLegsFirst
            .transition()
            .duration(1000)
            .attr('x1', d => xScale(d[positionAttribute.x]))
            .attr('x2', d => xScale(d[positionAttribute.x]) - 10)
            .attr('y1', d => yScale(d[positionAttribute.y]) + (d.headSize / 2) + d.bodySize + d.backSize)
            .attr('y2', d => yScale(d[positionAttribute.y]) + (d.headSize / 2) + d.bodySize + d.backSize + d.legsLength)

        const antLegsSecond = svg.selectAll('.ant.ant-leg-2').data(dataset);
        antLegsSecond
            .enter()
            .append('line')
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
            .attr('class', "ant ant-leg-2")
        antLegsSecond
            .transition()
            .duration(1000)
            .attr('x1', d => xScale(d[positionAttribute.x]))
            .attr('x2', d => xScale(d[positionAttribute.x]) + 10)
            .attr('y1', d => yScale(d[positionAttribute.y]) + (d.headSize / 2) + d.bodySize + d.backSize)
            .attr('y2', d => yScale(d[positionAttribute.y]) + (d.headSize / 2) + d.bodySize + d.backSize + d.legsLength)

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
            <svg id="ants-chart" ref={ref}></svg>
        </div>
    )
}

export default AntsChart;
