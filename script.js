let pyodide;

let pyClick, pySecond, pyCPS;
let pyBuyProducer, pyGetPrice, pyGetOwned, pyGetProduction;
let pyIsDrainActive, pyStopDrain;
let pyGetDrainMultiplier;

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
    pyGetProduction = pyodide.globals.get("get_production");

    pyIsDrainActive = pyodide.globals.get("is_drain_active");
    pyStopDrain = pyodide.globals.get("stop_drain");
    pyGetDrainMultiplier = pyodide.globals.get("get_drain_multiplier");

    // Currency click
    document.getElementById("btn").onclick = () => {
        let result = pyClick();
        updateDisplay(result);
    };

    // Drain button
    document.getElementById("drainBtn").onclick = () => {
        let result = pyStopDrain();
        updateDisplay(result);
    };

    // Producer buttons (UNCHANGED from working version)
    for (let i = 0; i < 5; i++) {
        let btn = document.getElementById("prod" + i);

        btn.onclick = () => {
            let result = pyBuyProducer(i);
            updateDisplay(result);
        };
    }

    function updateDisplay(currency) {
        let cps = pyCPS();
        let drainActive = pyIsDrainActive();
        let multiplier = pyGetDrainMultiplier();

        document.getElementById("btn").innerText =
            "Currency: " + Math.floor(currency);
        
        if (drainActive) {
            let effective = cps * multiplier;
            let drainAmount = cps - effective;

            document.getElementById("CPS").innerText =
                `Currency Per Second: ${cps} (- ${Math.floor(drainAmount)} (draining))`;
        } else {
            document.getElementById("CPS").innerText =
            "Currency Per Second: " + cps;
        }

        // Drain button visibility (ONLY addition)
        let drainActive = pyIsDrainActive();
        let drainBtn = document.getElementById("drainBtn");

        if (drainActive) {
            drainBtn.style.display = "inline-block";
        } else {
            drainBtn.style.display = "none";
        }

        // Producers (UNCHANGED logic)
        for (let i = 0; i < 5; i++) {
            let price = pyGetPrice(i);
            let owned = pyGetOwned(i);
            let producing = pyGetProduction(i);
            let btn = document.getElementById("prod" + i);
            let total = producing * owned;

            // Unlock next producer
            if (i === 0 || pyGetOwned(i - 1) > 0) {
                btn.style.display = "block";
            }

            if (owned === 0) {
                btn.innerText = `Buy Producer ${i + 1} (${price})`;
            } else {
                btn.innerText = `Upgrade Producer ${i + 1} (${price}) | Owned: ${owned} | Producing: ${producing} each, ${total} total`;
            }
        }
    }

    setInterval(() => {
        let result = pySecond();
        updateDisplay(result);
    }, 1000);
}

main();
