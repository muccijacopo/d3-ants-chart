import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

import { generateDataset } from "../utils/dataset-utils";
import { Ant } from "./DatasetModel";

interface PositionAttribute {
    x: keyof Ant;
    y: keyof Ant;
}


function AntsChart() {

    const [dataset, _] = useState(generateDataset())
    const [positionAttribute, setPositionAttribute] = useState<PositionAttribute>({ x: 'antennaeLength', y: 'bodySize'})
    const ref = useRef(null);

    useEffect(() => {
        console.log({ dataset })

        const margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = window.innerWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        const svg = d3
                .select(ref.current)
                .style("width", width + margin.left + margin.right)
                .style("height", height + margin.top + margin.bottom);

        // Data binding
        const ants = svg.selectAll('ant').data(dataset);

        // Entering
        ants
            .enter()
            .append('circle')
            .attr('cx', d => d[positionAttribute.x])
            .attr('cy', d => d[positionAttribute.y])
            .attr("r", 5)
            .attr("fill", "black")

        // Update


        // Removing


    }, [dataset]);


    return <svg id="ants-chart" ref={ref}></svg>
}

export default AntsChart;
