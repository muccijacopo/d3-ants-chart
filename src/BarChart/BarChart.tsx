import * as d3 from "d3";
import { useEffect, useState } from "react";

interface DatasetItem {
    Country: string;
    Value: number;
}

type Dataset = DatasetItem[];


function BarChart() {

    const [data, setData] = useState<Dataset>()
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    async function fetchData() {
        const _data = await d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv");
        const data = _data.map(e => ({
            Country: e.Country,
            Value: Number(e.Value)
        }));
        setData(data as any);
    }


    useEffect(() => {
        fetchData();

        window.addEventListener('resize', (e) => {
            setScreenSize(window.innerWidth)
        })
    }, []);

    useEffect(() => {
        if (!data) return;

        const margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = screenSize - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        // document.querySelector('bar-chart')
        const svg = d3.select('.bar-chart')
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)


        // X axis
        const x = d3.scaleBand()
        .range([ 0, width])
        .domain(data.map(d => d.Country))
        .padding(0.2);

        svg.append("g").attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

        const min = d3.min(data.map(e => e.Value))!
        const max = d3.max(data.map(e => e.Value))!
        const y = d3.scaleLinear()
        .domain([min, max])
        .range([ height, 0]);

        svg.append("g").call(d3.axisLeft(y))
    

        // Binding data
        const bars = svg.selectAll('rect').data(data);
        
        bars
            .enter()
            .append("rect")
            .attr("x", d => x(d.Country) as number)
            .attr("y", d => y(d.Value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.Value))
            .attr("fill", "#69b3a2")
    }, [data, screenSize]);


    return (
        <div className="bar-chart"></div>
    )
}

export default BarChart;