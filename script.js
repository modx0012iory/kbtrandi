let previousResults = [];
let latestResult = null;
let latestPeriod = null;
let storedHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];

//Ye website Team SRS ne leak ki hai aur aise saari websites ka source bhi leak hoga. DM karein for more source code aur follow karein @enzosrs -->
///This Web Free By #enzo #dev-->

async function fetchCurrentGameIssue() {
    const apiUrl = 'https://api.bdg88zf.com/api/webapi/GetGameIssue';
    const requestData = {
        typeId: 1,
        language: 0,
        random: "40079dcba93a48769c6ee9d4d4fae23f",
        signature: "D12108C4F57C549D82B23A91E0FA20AE",
        timestamp: 1727792520,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.code === 0) {
                latestPeriod = data.data.issueNumber;
                document.getElementById('period-number').textContent = latestPeriod;
                calculateBigSmall(); 
                fetchWinLossStatus(); 
            } else {
                console.error("❌ API returned error:", data.message);
            }
        } else {
            console.error("❌ API Response Error:", response.status);
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
    }
}

//Ye website Team SRS ne leak ki hai aur aise saari websites ka source bhi leak hoga. DM karein for more source code aur follow karein @enzosrs -->
//This Web Free By #enzo #dev-->

function calculateBigSmall() {
    if (!latestPeriod) return;

   
    let sumOfDigits = latestPeriod.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    latestResult = (sumOfDigits % 10 <= 4) ? 'SMALL' : 'BIG';

    document.getElementById('predicted-result').textContent = latestResult;
    updateHistory();
}


async function fetchWinLossStatus() {
    const apiUrl = 'https://api.bdg88zf.com/api/webapi/GetNoaverageEmerdList';
    const requestData = {
        pageSize: 10,
        pageNo: 1,
        typeId: 1,
        language: 0,
        random: "c2505d9138da4e3780b2c2b34f2fb789",
        signature: "7D637E060DA35C0C6E28DC6D23D71BED",
        timestamp: 1727792520,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.code === 0 && data.data.list.length > 0) {
                previousResults = data.data.list;
                updateWinLoss();
            } else {
                console.error("❌ API returned empty list or error:", data.message);
            }
        } else {
            console.error("❌ API Response Error:", response.status);
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
    }
}
//Ye website Team SRS ne leak ki hai aur aise saari websites ka source bhi leak hoga. DM karein for more source code aur follow karein @enzosrs -->
 ///This Web Free By #enzo #dev-->
function updateWinLoss() {
    if (!previousResults.length) return;

    const prevPeriod = storedHistory[1];
    if (prevPeriod) {
        prevPeriod.status = prevPeriod.prediction === (previousResults[0].number <= 4 ? 'SMALL' : 'BIG') ? "WIN" : "LOSS";
    }
    updateHistory();
}


function updateHistory() {
    const historyTable = document.getElementById('history-list');
    historyTable.innerHTML = '';

    const newHistoryEntry = {
        period: latestPeriod.toString().slice(-4),
        prediction: latestResult,
        status: "PENDING"
    };

    if (!storedHistory.some(entry => entry.period === newHistoryEntry.period)) {
        storedHistory.unshift(newHistoryEntry);
    }

    let winCount = 0, lossCount = 0;
    storedHistory.slice(0, 10).forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.period}</td>
            <td>${entry.prediction}</td>
            <td class="${entry.status === 'WIN' ? 'win-text' : entry.status === 'LOSS' ? 'loss-text' : 'pending-text'}">
                ${entry.status}
            </td>
        `;
        historyTable.appendChild(row);

        if (entry.status === "WIN") winCount++;
        else if (entry.status === "LOSS") lossCount++;
    });

    localStorage.setItem("gameHistory", JSON.stringify(storedHistory.slice(0, 10)));

    document.getElementById('win-count').textContent = winCount;
    document.getElementById('loss-count').textContent = lossCount;
    document.getElementById('win-percentage').textContent = 
        (winCount + lossCount > 0) ? ((winCount / (winCount + lossCount)) * 100).toFixed(2) + "%" : "0%";
}
////
///Ye website Team SRS ne leak ki hai aur aise saari websites ka source bhi leak hoga. DM karein for more source code aur follow karein @enzosrs -->
//This Web Free By #enzo #dev-->
setInterval(fetchCurrentGameIssue, 5000);
fetchCurrentGameIssue();