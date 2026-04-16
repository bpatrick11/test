/*let pyodide;
let pyClick;
let pySecond;
let pyCPS;
let pyBuyProducer;
let pyProducerPrice;

async function main() {
    pyodide = await loadPyodide();

    let response = await fetch("game.py?v=" + Date.now());
    let code = await response.text();

    pyodide.runPython(code);

    pyClick = pyodide.globals.get("increment");
    pySecond = pyodide.globals.get("second");
    pyCPS = pyodide.globals.get("CPS");
    pyBuyProducer = pyodide.globals.get("buy_producer");
    pyProducerPrice = pyodide.globals.get("producer_price");

    // Currency button
    document.getElementById("btn").onclick = () => {
        let result = pyClick();
        updateDisplay(result);
    };

    // Producer button
    document.getElementById("prod").onclick = () => {
        let result = pyBuyProducer();
        updateDisplay(result);
    };

    function updateDisplay(currency) {
        let CPS = pyCPS();
        let price = pyProducerPrice();

        document.getElementById("btn").innerText = "Currency: " + Math.floor(currency);
        document.getElementById("CPS").innerText = "Currency Per Second: " + CPS;
        document.getElementById("prod").innerText = "Buy Producer (" + price + ")";
    }

    // Tick every second
    setInterval(() => {
        let result = pySecond();
        updateDisplay(result);
    }, 1000);
}

main();*/

let pyodide;

let pyClick, pySecond, pyCPS;
let pyBuyProducer, pyGetPrice, pyGetOwned;

async function main() {
    pyodide = await loadPyodide();

    let response = await fetch("game.py?v=" + Date.now());
    let code = await response.text();
    pyodide.runPython(code);

    pyClick = pyodide.globals.get("increment");
    pySecond = pyodide.globals.get("second");
    pyCPS = pyodide.globals.get("CPS");
    pyBuyProducer = pyodide.globals.get("buy_producer");
    pyGetPrice = pyodide.globals.get("get_price");
    pyGetOwned = pyodide.globals.get("get_owned");

    // Currency click
    document.getElementById("btn").onclick = () => {
        let result = pyClick();
        updateDisplay(result);
    };

    // Producer buttons
    for (let i = 0; i < 5; i++) {
        let btn = document.getElementById("prod" + i);

        btn.onclick = () => {
            let result = pyBuyProducer(i);
            updateDisplay(result);
        };
    }

    function updateDisplay(currency) {
        let cps = pyCPS();

        document.getElementById("btn").innerText =
            "Currency: " + Math.floor(currency);
        document.getElementById("CPS").innerText =
            "Currency Per Second: " + cps;

        for (let i = 0; i < 5; i++) {
            let price = pyGetPrice(i);
            let owned = pyGetOwned(i);
            let btn = document.getElementById("prod" + i);

            // Unlock next producer
            if (i === 0 || pyGetOwned(i - 1) > 0) {
                btn.style.display = "block";
            }

            if (owned === 0) {
                btn.innerText = `Buy Producer ${i + 1} (${price})`;
            } else {
                btn.innerText = `Upgrade Producer ${i + 1} (${price}) | Owned: ${owned}`;
            }
        }
    }

    setInterval(() => {
        let result = pySecond();
        updateDisplay(result);
    }, 1000);
}

main();
