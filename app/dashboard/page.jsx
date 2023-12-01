"use client";

import Navigation from "../../components/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

function ChartArea() {
  var colors = ["#6ee7b7", "#fbbf24", "#38bdf8"];

  var barOptions = {
    chart: { toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 10, borderRadiusApplication: "end" } },
    colors: colors,
    yaxis: { min: 0, max: 10, tickAmount: 5 },
    xaxis: {
      categories: [
        "should",
        "so...that",
        "too...to",
        "enough to",
        "should",
        "prefer A to B",
        "should",
      ],
    },
  };

  var barSeries = [
    {
      name: "문법",
      data: [3, 4, 6, 8, 10, 5, 6],
    },
    {
      name: "주제적합성",
      data: [7, 4, 2, 9, 7, 7, 5],
    },
    {
      name: "표현사용여부",
      data: [3, 4, 6, 8, 10, 5, 6],
    },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <ApexChart
        type="bar"
        options={barOptions}
        series={barSeries}
        height="300px"
        width="100%"
      />
      <div className="flex flex-row w-full h-fit-content gap-7">
        {barSeries.map((value, i) => {
          return (
            <ApexChart
              key={value.name}
              type="radialBar"
              options={{
                chart: {
                  height: 350,
                  type: "radialBar",
                },
                labels: [value.name],
                colors: [colors[i]],
                stroke: { lineCap: "round" },
              }}
              series={[
                parseInt(
                  (value.data.reduce(function add(sum, currValue) {
                    return sum + currValue;
                  }, 0) /
                    value.data.length) *
                    10
                ),
              ]}
              height="280px"
              width="250px"
            />
          );
        })}
        <div className="flex-1 flex flex-col justify-center pl-5">
          <div>{"가장 잘한 표현은"}</div>
          <div className="mb-8 text-3xl text-emerald-300">{"Should"}</div>
          <div>{"가장 못한 표현은"}</div>
          <div className="text-3xl text-sky-400">{"so ... that"}</div>
        </div>
      </div>
    </div>
  );
}

export default function DashBoard() {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  var chartArea = isMounted ? <ChartArea /> : <div />;

  return (
    <div className="flex flex-col w-screen h-screen bg-background justify-content items-center">
      <Navigation></Navigation>
      <div className="h-[calc(100vh-65px)] w-9/12 mt-10">{chartArea}</div>
    </div>
  );
}
