document.addEventListener("DOMContentLoaded", () => {
	let score = 0;
	let clickValue = 1;
	const scoreElement = document.getElementById("score");
	const clickButton = document.getElementById("click-button");
	const upgradeButtons = document.querySelectorAll(".upgrade-button");
	const colors = ["#61dafb", "#ff6347", "#32cd32", "#ffa500", "#800080"];

	function updateScore() {
		scoreElement.textContent = `Points: ${score}`;
		upgradeButtons.forEach((button) => {
			const cost = parseInt(button.getAttribute("data-cost"));
			button.disabled = score < cost;
		});
	}

	clickButton.addEventListener("click", (event) => {
		score += clickValue;
		updateScore();
		createClickEffect(event.clientX, event.clientY);
	});

	upgradeButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const cost = parseInt(button.getAttribute("data-cost"));
			const value = parseInt(button.getAttribute("data-value"));
			if (score >= cost) {
				score -= cost;
				clickValue += value;
				button.setAttribute("data-cost", cost * 2);
				button.textContent = `Upgrade (${cost * 2} points)`;
				updateScore();
			}
		});
	});

	function createClickEffect(x, y) {
		const effect = document.createElement("span");
		effect.className = "click-effect";
		effect.style.left = `${x}px`;
		effect.style.top = `${y}px`;
		effect.style.backgroundColor =
			colors[Math.floor(Math.random() * colors.length)];
		document.body.appendChild(effect);
		setTimeout(() => document.body.removeChild(effect), 500);
	}

	updateScore();
});
