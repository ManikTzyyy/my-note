import { TransactionService } from "../services/transactionService.js";
import { accountServices } from "../services/accountService.js";
import { myUtils } from "../utils/utils.js";
import { TransactionModel } from "../models/transactionModel.js";


const datePlace = document.getElementById("dateNow");
const startInput = document.getElementById("start")
const endInput = document.getElementById("end")
const btnSubmit = document.getElementById("submit-data")
const ctx = document.getElementById("myChart");
const chartCashFlow = document.getElementById("myChartCash");
let myChart = null
let myChartCash
async function init() {
    lucide.createIcons();
    datePlace.innerHTML = new Date().toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const [accList, trcList] = await Promise.all([
        accountServices.getAll(),
        TransactionService.getAll(),
    ]);

    const dataTrc = myUtils.getAllWithAcc(trcList, accList);
    const elAsset = document.getElementById("ttl-assets");
    const totalBalance = accList.reduce((acc, item) => {
        return acc + item.balance;
    }, 0);

    const money = myUtils.formatMoney(totalBalance);

    elAsset.textContent = `IDR ${money}`;

    const now = new Date();
    const firstDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const lastDay = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
    );

    startInput.value = myUtils.formatDate(firstDay);
    endInput.value = myUtils.formatDate(lastDay);


    myChartCash = new Chart(chartCashFlow, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                { label: "balance", data: [] },
            ]
        }, options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x'
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function (value) {
                            if (value >= 1000000) {
                                return (value / 1000000) + "M";
                            }

                            if (value >= 1000) {
                                return (value / 1000) + "K";
                            }

                            return value;
                        }
                    }
                }, x: {
                    ticks: {
                        callback: function (value) {
                            const label = this.getLabelForValue(value);

                            return new Date(label).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                            });
                        }
                    }
                }


            }
        },
    });

    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                { label: "Income", data: [] },
                { label: "Expense", data: [] },
            ]
        }, options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x'
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function (value) {
                            if (value >= 1000000) {
                                return (value / 1000000) + "M";
                            }

                            if (value >= 1000) {
                                return (value / 1000) + "K";
                            }

                            return value;
                        }
                    }
                }, x: {
                    ticks: {
                        callback: function (value) {
                            const label = this.getLabelForValue(value);

                            return new Date(label).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                            });
                        }
                    }
                }
            }
        },
    });

    const swiper = new Swiper('.swiper', {
      
        loop: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        }
    });
}

const cbIncome = document.getElementById("cb-income");
const cbExpense = document.getElementById("cb-expense");

btnSubmit.addEventListener("click", async () => {
    const rawData = await TransactionModel.getDataFromRange(startInput.value, endInput.value)

    const data = await myUtils.extractDataToChart(rawData)
    const cashFlow = await myUtils.extractCashFlow(data)


    const labels = data.map(item => item.date)
    const income = data.map(item => item.income)
    const expense = data.map(item => item.expense)

    const cashLabels = cashFlow.map(item => item.date);
    const cashBalances = cashFlow.map(item => item.balance);


    const datasets = [];


    if (cbIncome.checked) {
        datasets.push({
            label: "Income",
            data: income,
            borderColor: "#22c55e",
            backgroundColor: "#22c55e",
        });
    }

    if (cbExpense.checked) {
        datasets.push({
            label: "Expense",
            data: expense,
            borderColor: "#ef4444",
            backgroundColor: "#ef4444",
        });
    }

    myChart.data.labels = labels;
    myChart.data.datasets = datasets;


    myChart.update();

    myChartCash.data.labels = cashLabels;

    myChartCash.data.datasets = [
        {
            label: "Balance",
            data: cashBalances,
            borderColor: "#3b82f6",
            backgroundColor: "#3b82f6",
        }
    ];

    myChartCash.update();


})




init();

particlesJS.load("particles-js", "../assets/particles.json", function () { });