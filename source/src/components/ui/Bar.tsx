import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData
} from "chart.js";
import "chartjs-adapter-date-fns";
import { addDays, format } from "date-fns";
import { LoadingBlock } from "./loading";
import { useLocaleState, useTranslate } from "react-admin";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    startDate: Date;
    endDate: Date;
    typeTabActive: string;
    open: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ startDate, endDate, typeTabActive, open }) => {
    const [isChartVisible, setIsChartVisible] = useState(open);
    const [isLoading, setIsLoading] = useState(true);
    const translate = useTranslate();
    const [locale] = useLocaleState();

    useEffect(() => {
        if (open) {
            setIsChartVisible(true);
        } else {
            setTimeout(() => setIsChartVisible(false), 1200);
        }
    }, [open]);

    // useMemo для предотвращения лишних пересчетов данных графика
    const chartData = useMemo(() => {
        if (!open) return { labels: [], datasets: [] };

        const generateLabels = (start: Date, end: Date) => {
            const dates: string[] = [];
            let currentDate = start;
            while (currentDate <= end) {
                dates.push(currentDate.toLocaleDateString(locale));
                currentDate = addDays(currentDate, 1);
            }
            return dates;
        };

        const generateRandomData = (length: number) => {
            return Array.from({ length }, () => Math.floor(Math.random() * 50));
        };

        const labels = generateLabels(startDate, endDate);

        let newChartData: ChartData<"bar">;
        switch (typeTabActive) {
            case "Deposit":
                newChartData = {
                    labels,
                    datasets: [
                        {
                            label: translate("resources.transactions.types.deposit"),
                            data: generateRandomData(labels.length),
                            backgroundColor: "#008C99",
                            borderColor: "#008C99",
                            borderWidth: 1
                        }
                    ]
                };
                break;
            case "Withdraw":
                newChartData = {
                    labels,
                    datasets: [
                        {
                            label: translate("resources.transactions.types.withdraw"),
                            data: generateRandomData(labels.length),
                            backgroundColor: "#57CD8C",
                            borderColor: "#57CD8C",
                            borderWidth: 1
                        }
                    ]
                };
                break;
            case "Reward":
                newChartData = {
                    labels,
                    datasets: [
                        {
                            label: translate("resources.transactions.types.reward"),
                            data: generateRandomData(labels.length),
                            backgroundColor: "#D8F3E4",
                            borderColor: "#D8F3E4",
                            borderWidth: 1
                        }
                    ]
                };
                break;
            case "Transfer":
                newChartData = {
                    labels,
                    datasets: [
                        {
                            label: translate("resources.transactions.types.transfer"),
                            data: generateRandomData(labels.length),
                            backgroundColor: "#764b92",
                            borderColor: "#764b92",
                            borderWidth: 1
                        }
                    ]
                };
                break;
            default:
                newChartData = {
                    labels,
                    datasets: [
                        {
                            label: translate("resources.transactions.types.deposit"),
                            data: generateRandomData(labels.length),
                            backgroundColor: "#008C99",
                            borderColor: "#008C99",
                            borderWidth: 1
                        },
                        {
                            label: translate("resources.transactions.types.withdraw"),
                            data: generateRandomData(labels.length),
                            backgroundColor: "#57CD8C",
                            borderColor: "#57CD8C",
                            borderWidth: 1
                        },
                        {
                            label: translate("resources.transactions.types.reward"),
                            data: generateRandomData(labels.length),
                            backgroundColor: "#D8F3E4",
                            borderColor: "#D8F3E4",
                            borderWidth: 1
                        },
                        {
                            label: translate("resources.transactions.types.transfer"),
                            data: generateRandomData(labels.length),
                            backgroundColor: "#764b92",
                            borderColor: "#764b92",
                            borderWidth: 1
                        }
                    ]
                };
                break;
        }
        return newChartData;
    }, [startDate, endDate, typeTabActive, open]);

    useEffect(() => {
        if (open) {
            setIsLoading(true);
            // Закоммнтируй для бесконечной загрузки
            setTimeout(() => setIsLoading(false), 2000);
        }
    }, [open]);

    const options: ChartOptions<"bar"> = {
        animation: {
            easing: "easeOutQuart"
        },
        datasets: {
            bar: {
                barThickness: "flex",
                barPercentage: typeTabActive ? 0.4 : 0.9
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                displayColors: false
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: "rgba(179, 179, 179, 1)",
                    font: {
                        size: 12,
                        weight: 400
                    }
                },
                grid: {
                    drawOnChartArea: true,
                    color: "rgba(92, 92, 92, 1)"
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "rgba(179, 179, 179, 1)",
                    font: {
                        size: 12,
                        weight: 400
                    },
                    callback(tickValue, index, ticks) {
                        if (index === ticks.length - 1) return "USDT";
                        return tickValue;
                    }
                },
                grid: {
                    drawOnChartArea: true,
                    color: "rgba(92, 92, 92, 1)",
                    drawTicks: false
                },
                display: "auto"
            }
        }
    };

    const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const chartWidth = numberOfDays * 115;

    const maxHeight = open ? "300vh" : "0px";

    return isLoading ? (
        <div className={`bg-black flex items-center h-[637px] ${open ? "clicked" : "not-clicked"}`}>
            <LoadingBlock />
        </div>
    ) : (
        <div
            className={`bg-black mr-2 ${isLoading && open ? "pb-0 pt-0" : "p-5"} pb-0 ${
                open ? "clicked" : "not-clicked"
            }`}
            style={{
                maxHeight
            }}>
            <div className="overflow-x-auto">
                <div style={{ width: chartWidth + "px" }} className="pl-[22px] h-[561px] ">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
            <div className="flex justify-center mt-3 pb-3">
                <div className="flex flex-col md:flex-row items-center justify-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-12 h-5 rounded-full bg-[#008C99]" />
                        <span className="ml-2 text-title-1 text-neutral-50">
                            {translate("resources.transactions.types.deposit")}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-12 h-5 rounded-full bg-[#57CD8C]" />
                        <span className="text-title-1 text-neutral-50 ml-2">
                            {translate("resources.transactions.types.withdraw")}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-12 h-5 rounded-full bg-[#D8F3E4]" />
                        <span className="text-title-1 text-neutral-50 ml-2">
                            {translate("resources.transactions.types.reward")}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-12 h-5 rounded-full bg-[#764b92]" />
                        <span className="text-title-1 text-neutral-50 ml-2">
                            {translate("resources.transactions.types.transfer")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarChart;
