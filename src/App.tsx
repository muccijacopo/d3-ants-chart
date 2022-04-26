import { Fragment } from "react";
import AntsChart from "./AntsChart/AntsChart";
import BarChart from "./BarChart/BarChart";
import Circles from "./Circles/Circles";
import './App.css';
import SVGAnimation from "./SVGAnimations/SVGAnimations";

function App() {
    return (
        <Fragment>
            {/* <Circles /> */}
            {/* <BarChart /> */}
            {/* <SVGAnimation /> */}
            <AntsChart />
        </Fragment>
    )
}

export default App;