import { Fragment } from "react";
import AntsChart from "./AntsChart/AntsChart";
import BarChart from "./BarChart/BarChart";
import Circles from "./Circles/Circles";
import './App.css';

function App() {
    return (
        <Fragment>
            {/* <Circles /> */}
            {/* <BarChart /> */}
            <AntsChart />
        </Fragment>
    )
}

export default App;