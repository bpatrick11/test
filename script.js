let pyodide;

// Python function references
let pyClick, pySecond, pyCPS;
let pyBuyProducer, pyGetPrice, pyGetOwned, pyGetProduction;
let pyIsDrainActive, pyStopDrain;
let pyGetDrainMultiplier;

async function main() {
    // Load Pyodide (Python runtime in browser)
    pyodide = await loadPyodide();

    // Load game.py fresh (cache-busted)
    let response = await fetch("game.py?v=" + Date.now());
    let code = await response.text();
    pyodide.runPython(code);

    // Link Python functions to JS
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

    // Currency click button
    document.getElementById("btn").onclick = () => {
        let result = pyClick();
        updateDisplay(result);
    };

    // Drain fix button
    document.getElementById("drainBtn").onclick = () => {
        let result = pyStopDrain();
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

    // Main UI update function
    function updateDisplay(currency) {
        let cps = pyCPS();                        // Base CPS
        let drainActive = pyIsDrainActive();      // Is drain active?
        let multiplier = pyGetDrainMultiplier();  // Drain multiplier

        // Update currency display
        document.getElementById("btn").innerText =
            "Currency: " + Math.floor(currency);

        // ----- CPS DISPLAY -----
        if (drainActive) {
            let effective = cps * multiplier; // actual CPS after drain

            document.getElementById("CPS").innerText =
                `Currency Per Second: ${cps} → ${Math.floor(effective)} (drained)`;
        } else {
            document.getElementById("CPS").innerText =
                "Currency Per Second: " + cps;
        }

        // ----- DRAIN BUTTON VISIBILITY -----
        let drainBtn = document.getElementById("drainBtn");

        if (drainActive) {
            drainBtn.style.display = "inline-block";
        } else {
            drainBtn.style.display = "none";
        }

        // ----- PRODUCER DISPLAY -----
        for (let i = 0; i < 5; i++) {
            let price = pyGetPrice(i);
            let owned = pyGetOwned(i);
            let producing = pyGetProduction(i);
            let btn = document.getElementById("prod" + i);

            let total = producing * owned;

            // Unlock next producer when previous is owned
            if (i === 0 || pyGetOwned(i - 1) > 0) {
                btn.style.display = "block";
            }

            // Button text logic
            if (owned === 0) {
                btn.innerText = `Buy Producer ${i + 1} (${price})`;
            } else {
                btn.innerText =
                    `Upgrade Producer ${i + 1} (${price}) | Owned: ${owned} | Producing: ${producing} each, ${total} total`;
            }
        }
    }

    // Game loop (runs every second)
    setInterval(() => {
        let result = pySecond();
        updateDisplay(result);
    }, 1000);
}

main();
