import 'flowbite';
import ApexCharts from 'apexcharts';
import Chart from "react-apexcharts";
import { Card } from "flowbite-react";


export default function ProjectsChart(){

    const brandColor = "#0048ff";
    const brandSecondaryColor = "#8efa86";

    const options = {
        colors: [brandColor, brandSecondaryColor],
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
                columnWidth: "70%",
                borderRadiusApplication: "end",
                borderRadius: 8,
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        },
        states: {
            hover: {
                filter: {
                    type: "darken",
                    value: 1,
                },
            },
        },
        stroke: {
            show: true,
            width: 3,
            colors: ["transparent"],
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
        },
        xaxis: {
            floating: false,
            labels: {
                rotate: -45,
                rotateAlways: true,
                hideOverlappingLabels: false,
                trim: false,
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-body'
                }
            },
            axisBorder: {
                show: true,
            },
            axisTicks: {
                show: true,
            },
        },
        yaxis: {
            show: true,
        },
        fill: {
            opacity: 1,
        },
    }

    const data= [
        {
            name: "Organic",
            color: brandColor,
            data: [
                { x: "Mon", y: 231 },
                { x: "Tue", y: 122 },
                { x: "Wed", y: 63 },
                { x: "Thu", y: 421 },
                { x: "Fri", y: 122 },
                { x: "Sat", y: 323 },
                { x: "Sun", y: 111 },
                { x: "Sun", y: 111 },
                { x: "Sun", y: 111 },
                { x: "Sun", y: 111 },
                { x: "Sun", y: 111 },
                { x: "Sun", y: 111 },
                { x: "Fri", y: 122 },
                { x: "Fri", y: 122 },
                { x: "Fri", y: 122 },
                { x: "Fri", y: 122 },
            ],
        },
        {
            name: "Social media",
            color: brandSecondaryColor,
            data: [
                { x: "Mon", y: 232 },
                { x: "Tue", y: 113 },
                { x: "Wed", y: 341 },
                { x: "Thu", y: 224 },
                { x: "Fri", y: 522 },
                { x: "Sat", y: 411 },
                { x: "Sun", y: 243 },
                { x: "Sun", y: 243 },
                { x: "Sun", y: 243 },
                { x: "Sun", y: 243 },
                { x: "Sun", y: 243 },
                { x: "Sun", y: 243 },
                { x: "Fri", y: 122 },
                { x: "Fri", y: 122 },
                { x: "Fri", y: 122 },
                { x: "Fri", y: 122 },

            ],
        },
    ]
    const barWidth = 80;
    const chartWidth = data[0].data.length * barWidth;



    return(
        <>
            <div className="  w-[50%] bg-neutral-primary-soft border border-default rounded-base shadow-xs p-4 md:p-6">
                <div className="flex justify-between pb-4 mb-4 border-b border-light">
                    <div className="flex items-center">
                        Projects
                    </div>
                    <div>
              <span
                  className="inline-flex items-center bg-success-soft border border-success-subtle text-fg-success-strong text-xs font-medium px-1.5 py-0.5 rounded">
                <svg className="w-4 h-4 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                           strokeWidth="2" d="M12 6v13m0-13 4 4m-4-4-4 4"/></svg>
                42.5%
              </span>
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <dl className="flex items-center">
                        <dt className="text-body text-sm font-normal me-1">Progress</dt>
                    </dl>
                </div>
                <Card><div id="column-chart" className="overflow-x-auto scroll-smooth" ><div style={{ minWidth: chartWidth}}><Chart options={options} series={data} type={"bar"} height={500}/></div></div></Card>
                <div className="grid grid-cols-1 items-center border-light border-t justify-between">
                    <div className="flex justify-between items-center pt-4 md:pt-6">
                        <button id="dropdownLastDaysButton" data-dropdown-toggle="LastDaysdropdown"
                                data-dropdown-placement="bottom"
                                className="text-sm font-medium text-body hover:text-heading text-center inline-flex items-center"
                                type="button">
                            Last 7 days
                            <svg className="w-4 h-4 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                 width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="m19 9-7 7-7-7"/>
                            </svg>
                        </button>
                        <div id="LastDaysdropdown"
                             className="z-10 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
                            <ul className="p-2 text-sm text-body font-medium" aria-labelledby="dropdownLastDaysButton">
                                <li>
                                    <a href="#"
                                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Yesterday</a>
                                </li>
                                <li>
                                    <a href="#"
                                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Today</a>
                                </li>
                                <li>
                                    <a href="#"
                                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Last
                                        7 days</a>
                                </li>
                                <li>
                                    <a href="#"
                                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Last
                                        30 days</a>
                                </li>
                                <li>
                                    <a href="#"
                                       className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Last
                                        90 days</a>
                                </li>
                            </ul>
                        </div>
                        <a href="#"
                           className="inline-flex items-center text-fg-brand bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none">
                            Leads Report
                            <svg className="w-4 h-4 ms-1.5 -me-0.5 rtl:rotate-180" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}