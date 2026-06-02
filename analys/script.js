import { TransactionService } from "../services/transactionService.js";
import { accountServices } from "../services/accountService.js";
import { myUtils } from "../utils/utils.js";
import { TransactionModel } from "../models/transactionModel.js";


const datePlace = document.getElementById("dateNow");
const startInput = document.getElementById("start")
const endInput = document.getElementById("end")
const btnSubmit = document.getElementById("submit-data")
const ctx = document.getElementById("myChart");
let myChart = null
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
                }
            }
        },
    });
}

const cbIncome = document.getElementById("cb-income");
const cbExpense = document.getElementById("cb-expense");

btnSubmit.addEventListener("click", async () => {
    const rawData = await TransactionModel.getDataFromRange(startInput.value, endInput.value)
    console.log(rawData)

    const data = await myUtils.extratDataToChart(rawData)
    console.log(data)

    const labels = data.map(item => item.date)
    const income = data.map(item => item.income)
    const expense = data.map(item => item.expense)


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

})




init();

particlesJS.load("particles-js", "../assets/particles.json", function () { });