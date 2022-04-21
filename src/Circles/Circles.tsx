import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react'

const generateCircles = () => {
  return Array.from({ length: 10}).map(() => Math.random() < 0.5);
}

function Circles() {
  const [visibleCircles, setVisibleCircles] = useState(
    generateCircles()
  )
  const ref = useRef(null);

  const totalWidth = 600;
  const totalHeight = 300;
  const circleRadius = 30;

  useEffect(() => {
    const interval = setInterval(() => {
      const circles = generateCircles();
      setVisibleCircles(circles);
    }, 2000);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    const svgElement = d3.select(ref.current).style('width', totalWidth).style('height', totalHeight)
    // Binding data
    const circles = svgElement.selectAll("circle").data(visibleCircles)
    
    // Enter
    circles.enter()
        .append("circle")
        .attr("cx", (d, idx) => (idx + 1) * 20 * 2 + 30)
        .attr("cy", totalHeight / 2)
        .attr("r", 20)
        .attr("fill", "cornflowerblue")

    circles
    .transition().duration(1000).attr("fill", (d) => {
      return d ? 'cornflowerblue' : 'tomato' 
    });
  }, [visibleCircles])
  return (
    <svg
      ref={ref}
    />
  )
}

export default Circles;
