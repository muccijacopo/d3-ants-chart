import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

import { generateDataset } from "../utils/dataset-utils";
import { Ant, AntDataset } from "./DatasetModel";

interface PositionAttribute {
    x: keyof Ant;
    y: keyof Ant;
}

const translate = (x: number, y: number) => `translate(${x}, ${y})`;

const maxOf = (dataset: AntDataset, key: keyof Ant) => d3.max((dataset.map(e => e[key]))) as number;
const minOf = (dataset: AntDataset, key: keyof Ant) => d3.min((dataset.map(e => e[key]))) as number;

function AntsChart() {

    const [dataset, _] = useState(generateDataset())
    const [positionAttribute, setPositionAttribute] = useState<PositionAttribute>({ x: 'legsLength', y: 'bodySize'})
    const ref = useRef(null);

    useEffect(() => {
        const margin = {top: 30, right: 30, bottom: 70, left: 30},
        width = window.innerWidth - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom

        if (ref.current) {
            (ref.current as SVGAElement).innerHTML = "";
        }


        const svg = d3
            .select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", translate(margin.left, margin.top))

        /** X Axis */
        const xScale = d3
            .scaleLinear()
            .domain([0, maxOf(dataset, positionAttribute.x)])
            .range([0, width])

        const xAxis = d3.axisBottom(xScale);
        svg
            .append("g")
            .attr("transform", translate(0, height - 20))
            .call(xAxis);
        svg
            .append('text')
            .attr("transform", translate(width/2, height))
            .style("text-anchor", "middle")
            .text(positionAttribute.x)

        /** Y Axis */
        const yScale = d3
            .scaleLinear()
            .domain([0, maxOf(dataset, positionAttribute.y)])
            .range([height, 0])
        const yAxis = d3.axisLeft(yScale);
        svg
            .append("g")
            .attr("transform", translate(margin.left, 0))
            .call(yAxis);

        svg
        .append('text')
        .attr("transform", translate(margin.left, height / 2))
        .style("text-anchor", "middle")
        .text(positionAttribute.y)
        

        // Data binding
        const ants = svg.selectAll('ant').data(dataset);


        // Head
        ants
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d[positionAttribute.x]))
            .attr('cy', d => yScale(d[positionAttribute.y]))
            .attr("r", d => d.headSize)
            .attr("fill", "black")
            .attr("class", "ant-head")

        // Body
        ants
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d[positionAttribute.x]))
            .attr('cy', d => yScale(d[positionAttribute.y]) + d.headSize + d.bodySize / 2)
            .attr("r", d => d.bodySize)
            .attr("fill", "black")
            .attr("class", "ant-body")
        // Back
            ants
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d[positionAttribute.x]))
            .attr('cy', d => yScale(d[positionAttribute.y]) + d.headSize + d.bodySize + d.backSize / 2)
            .attr("r", d => d.backSize)
            .attr("fill", "black")
            .attr("class", "ant-body")
        
        // Antennas
        ants
            .enter()
            .append('line')
            .attr('x1', d => xScale(d[positionAttribute.x]))
            .attr('x2', d => xScale(d[positionAttribute.x]) + 5)
            .attr('y1', d => yScale(d[positionAttribute.y]))
            .attr('y2', d => yScale(d[positionAttribute.y]) - d.antennaeLength)
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
            .attr('class', "ant-antenna")
        ants.enter()
            .append('line')
            .attr('x1', d => xScale(d[positionAttribute.x]))
            .attr('x2', d => xScale(d[positionAttribute.x]) - 5)
            .attr('y1', d => yScale(d[positionAttribute.y]))
            .attr('y2', d => yScale(d[positionAttribute.y]) - d.antennaeLength)
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
            .attr("class", "ant-antenna")
    

        // Update


        // Removing

        // Listeners 
        d3.selectAll('.ant-antenna').on('click', () => {
            setPositionAttribute({ ...positionAttribute, x: 'antennaeLength'})
        });
        d3.selectAll('.ant-head').on('click', () => {
            setPositionAttribute({ ...positionAttribute, x: 'headSize'})
        });
        d3.selectAll('.ant-body').on('click', () => {
            setPositionAttribute({ ...positionAttribute, x: 'bodySize'})
        });

        d3.selectAll('.ant-antenna').on('contextmenu', (e) => {
            console.log(e);
            e.preventDefault();
            setPositionAttribute({ ...positionAttribute, y: 'antennaeLength'})
        });
        d3.selectAll('.ant-head').on('contextmenu', (e) => {
            e.preventDefault();
            setPositionAttribute({ ...positionAttribute, y: 'headSize'})
        });
        d3.selectAll('.ant-body').on('contextmenu', (e) => {
            e.preventDefault();
            setPositionAttribute({ ...positionAttribute, y: 'bodySize'})
        });


    }, [dataset, positionAttribute]);


    return <svg id="ants-chart" ref={ref}></svg>
}

export default AntsChart;
