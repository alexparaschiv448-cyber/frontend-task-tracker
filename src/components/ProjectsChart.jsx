import 'flowbite';
import Chart from "react-apexcharts";
import { Card } from "flowbite-react";
import {useContext, useEffect, useState} from "react";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import {context} from "./Context.jsx";
import {useNavigate} from "react-router-dom";

export default function ProjectsChart() {

    let nav=useNavigate();
    const newColor="#7e7e7e";
    const inProgressColor = "#3672ff";
    const doneColor = "#77ff73";
    const [statusesNew,setStatusesNew] = useState([]);
    const [statusesInProgress,setStatusesInProgress] = useState([]);
    const [statusesDone,setStatusesDone] = useState([]);
    const [newTotal,setNewTotal] = useState(0);
    const [inProgressTotal,setInProgressTotal] = useState(0);
    const [doneTotal,setDoneTotal] = useState(0);


    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;

    //const yAxisIncrement=10;
    const [yAxisIncrement,setYAxisIncrement] = useState(20);


    useEffect(() => {
        if(sessionStorage.getItem('authorization')) {
            setLoading(true);
            async function fetchProjectData() {
                try {
                    const results = await FetchWrapper("/dashboard/statuses",
                        "GET",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        });
                    if (results.status === 401) {
                        sessionStorage.clear();
                        nav("/login");
                    } else if (results.status === 404) {
                        nav("/error");
                    } else if (results.status === 200) {
                        setStatusesNew(results.result.map((item)=>{ const s={x:item.name,y:item.new};return s;}));
                        setStatusesInProgress(results.result.map((item)=>{ const s={x:item.name,y:item.in_progress};return s;}));
                        setStatusesDone(results.result.map((item)=>{ const s={x:item.name,y:item.done};return s;}));
                        let sum=0;
                        for(let i=0;i<results.result.length;i++){sum+=results.result[i].new}
                        setNewTotal(sum);
                        sum=0;
                        for(let i=0;i<results.result.length;i++){sum+=results.result[i].in_progress}
                        setInProgressTotal(sum);
                        sum=0;
                        for(let i=0;i<results.result.length;i++){sum+=results.result[i].done}
                        setDoneTotal(sum);

                    }

                } catch (error) {
                    setMessage("Error: " + error.message);
                    setStatus("error");
                    setTimeout(() => {
                        setMessage("");
                        setStatus("");
                    }, 3000);
                } finally {
                    setLoading(false);
                }
            }

            fetchProjectData();
        }
    },[])



    const data = [
        {
            name: "New",
            color: newColor,
            data: statusesNew,
        },
        {
            name: "In Progress",
            color: inProgressColor,
            data: statusesInProgress,
        },
        {
            name: "Done",
            color: doneColor,
            data: statusesDone,
        }
    ];

    const barWidth = 150;
    const chartWidth = data[0].data.length * barWidth;

    const allValues = data.flatMap(s => s.data.map(d => d.y));

    const rawMax = Math.max(...allValues);

    const maxY = Math.ceil(rawMax / yAxisIncrement) * yAxisIncrement;

    const tickCount = maxY / yAxisIncrement;

    const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
        maxY - i * yAxisIncrement
    );
    const options = {
        colors: [newColor, inProgressColor, doneColor],

        chart: {
            type: "bar",
            height: 320,
            fontFamily: "Inter, sans-serif",
            toolbar: {
                show: false,
            },
        },

        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: 0,
            },
        },

        tooltip: {
            shared: true,
            intersect: false,
        },

        stroke: {
            show: true,
            width: 3,
            colors: ["transparent"],
        },

        grid: {
            show: true,
            strokeDashArray: 4,
        },

        dataLabels: {
            enabled: false,
        },

        legend: {
            show: false,
        },

        xaxis: {
            labels: {
                rotate: 0,
                trim: false,
                style: {
                    fontFamily: "Inter, sans-serif",
                },
            },
        },

        yaxis: {
            show: false,
            min: 0,
            max: maxY,
            tickAmount: tickCount,
            labels: {
                formatter: (val) => val,
            },
        },

        fill: {
            opacity: 1,
        },
    };

    return (
        <div className="absolute top-50 w-[48%] bg-neutral-primary-soft border border-default rounded-base shadow-md p-4 md:p-6 inline-block">

            {/* HEADER */}
            <div className="flex justify-between pb-4 mb-4 border-b border-light">
                <div>Projects</div>

                <span className="inline-flex items-center bg-gray-400 border border-gray-500 text-xs px-1.5 py-0.5 rounded">
                  {newTotal+doneTotal+inProgressTotal>0 ? ((newTotal*100)/(newTotal+inProgressTotal+doneTotal)).toFixed(2) : 0}%
                </span>
                <span className="inline-flex items-center bg-blue-500 border border-blue-700 text-xs px-1.5 py-0.5 rounded text-white">
                  {newTotal+doneTotal+inProgressTotal>0 ? ((inProgressTotal*100)/(newTotal+inProgressTotal+doneTotal)).toFixed(2) : 0}%
                </span>
                <span className="inline-flex items-center bg-success-soft border border-success-subtle text-xs px-1.5 py-0.5 rounded">
                  {newTotal+doneTotal+inProgressTotal>0 ? ((doneTotal*100)/(newTotal+inProgressTotal+doneTotal)).toFixed(2) : 0}%
                </span>
            </div>

            {/* LEGEND */}
            <Card className="mb-4 relative">
                <input value={yAxisIncrement} type={"number"} className="absolute top-12 right-5 w-[80px] bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none text-center" min={1} max={100}
                onChange={(e)=>{console.log("yes"); if(e.currentTarget.value>100 || e.currentTarget.value<1){setYAxisIncrement(1);}
                else{setYAxisIncrement(e.currentTarget.value);}}} />
                <div className="space-y-2">
                    {data.map(series => (
                        <div key={series.name} className="flex items-center gap-2">
              <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: series.color }}
              />
                            <span className="text-sm text-body">
                {series.name}
              </span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* CHART + CUSTOM Y AXIS */}
            <div className="flex gap-3">

                {/* Y AXIS */}
                <Card className="w-14 h-[480px]">
                    <div className="h-[440px] flex flex-col justify-between text-xs text-body">
                        {yTicks.map((tick, i) => (
                            <span key={i}>{tick}</span>
                        ))}
                    </div>
                </Card>

                {/* CHART */}
                <div className="overflow-x-auto flex-1">
                    <div style={{ minWidth: chartWidth }}>
                        <Chart
                            options={options}
                            series={data}
                            type="bar"
                            height={500}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}