import 'flowbite';
import Chart from "react-apexcharts";
import {useContext, useEffect, useState} from "react";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import {context} from "./Context.jsx";
import {useNavigate} from "react-router-dom";

export default function ProjectsChart() {



    let nav=useNavigate();
    const highestColor = "#ff4f4f";
    const highColor = "#ff9100";
    const mediumColor = "#ecf300";
    const lowColor = "#fbffa6";
    const lowestColor = "#7a7a7a";


    const neutralPrimaryColor = "#ffffff";


    const {toast_message,message_status,loading_status}=useContext(context);
    const [loading, setLoading] = loading_status;
    const [message,setMessage]=toast_message;
    const [status,setStatus]=message_status;

    const [highest,setHighest]=useState(0);
    const [high,setHigh]=useState(0);
    const [medium,setMedium]=useState(0);
    const [low,setLow]=useState(0);
    const [lowest,setLowest]=useState(0);



    useEffect(() => {
        if(sessionStorage.getItem('authorization')) {
            setLoading(true);
            async function fetchTicketData() {
                try {
                    const results = await FetchWrapper("/dashboard/priorities",
                        "GET",
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("authorization")}`
                        });
                    if (results.status === 401 && results.result.code==="UNAUTHORIZED") {
                        sessionStorage.clear();
                        nav("/login");
                    } else if (results.status === 404 && results.result.code==="NOT_FOUND") {
                        nav("/error");
                    } else if (results.status === 200 && results.result.code==="RETURNED") {
                        const total=results.result.data[0].highest+results.result.data[0].high+results.result.data[0].medium+results.result.data[0].low+results.result.data[0].lowest;
                        console.log("total: ",total);
                        if(total>0){
                            setHighest((results.result.data[0].highest*100)/total);
                            setHigh((results.result.data[0].high*100)/total);
                            setMedium((results.result.data[0].medium*100)/total);
                            setLow((results.result.data[0].low*100)/total);
                            setLowest((results.result.data[0].lowest*100)/total);
                        }
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

            fetchTicketData();
        }
    },[])



    const options =  {
            colors: [highestColor, highColor, mediumColor,lowColor,lowestColor],
            chart: {
                height: 420,
                width: "100%",
                type: "pie",
            },
            stroke: {
                colors: [neutralPrimaryColor],
                lineCap: "",
            },
            plotOptions: {
                pie: {
                    labels: {
                        show: true,
                    },
                    size: "100%",
                    dataLabels: {
                        offset: -25
                    }
                },
            },
            labels: ["Highest", "High", "Medium","Low","Lowest"],
            dataLabels: {
                enabled: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    colors: ["#000"]
                },
            },
            legend: {
                position: "bottom",
                fontFamily: "Inter, sans-serif",
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                        return value + "%"
                    },
                },
            },
            xaxis: {
                labels: {
                    formatter: function (value) {
                        return value  + "%"
                    },
                },
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
            },
        }


    return(
        <>
            <div
                className="absolute top-50 right-6 w-[48%] bg-neutral-primary-soft border border-default rounded-base shadow-md p-4 md:p-6 inline-block">

                <div className="flex justify-between items-start w-full">
                    <div className="flex-col items-center">
                        <div className="flex items-center mb-1">
                            <div>Priority</div>
                        </div>

                    </div>
                    <div className="flex justify-end items-center">
                        <div id="widgetDropdown"
                             className="z-10 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
                            <ul className="p-2 text-sm text-body font-medium" aria-labelledby="widgetDropdownButton">
                                <li>
                                    <a href="#"
                                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
                                        <svg className="w-4 h-4 me-1.5" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"/>
                                        </svg>
                                        Edit widget
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
                                        <svg className="w-4 h-4 me-1.5" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                        </svg>
                                        Download data
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
                                        <svg className="w-4 h-4 me-1.5" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M8 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0a4 4 0 0 1-4 4h-1a3 3 0 0 0-3 3"/>
                                        </svg>
                                        Add to repository
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
                                        <svg className="w-4 h-4 me-1.5" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                        </svg>
                                        Delete widget
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {loading ? <div>Loading...</div> : <div className="py-6" id="pie-chart"><Chart type={"pie"} options={options} series={[
                    highest,
                    high,
                    medium,
                    low,
                    lowest
                ]} height={638}></Chart></div>}


            </div>

        </>
    )
}