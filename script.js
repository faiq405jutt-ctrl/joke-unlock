document.addEventListener("DOMContentLoaded", () => {

  let points = localStorage.getItem("points")
    ? parseFloat(localStorage.getItem("points"))
    : 0;

  const pointsEl = document.getElementById("points");
  const jokeBox = document.getElementById("jokeBox");

  function savePoints() {
    localStorage.setItem("points", points);
    pointsEl.innerText = points.toFixed(1);
  }

  // Show points
  savePoints();

  // ✅ Daily visit reward
  const lastVisit = localStorage.getItem("lastVisit");
  const today = new Date().toDateString();

  if (lastVisit !== today) {
    points += 1;
    localStorage.setItem("lastVisit", today);
    savePoints();
  }

  // ✅ Time reward (30 sec)
  setTimeout(() => {
    points += 1;
    savePoints();
    alert("🎉 You earned 1 point for staying!");
  }, 30000);

  // ✅ Unlock Joke
  window.unlockJoke = async function () {
    if (points < 1) {
      alert("❌ Not enough points!");
      return;
    }

    points -= 1;
    savePoints();
    jokeBox.innerText = "😂 Loading joke...";

    try {
      const res = await fetch(
        "https://v2.jokeapi.dev/joke/Programming?type=single&safe-mode"
      );
      const data = await res.json();

      jokeBox.innerText = data.joke;

      // Reading reward
      points += 0.5;
      savePoints();

    } catch {
      jokeBox.innerText = "⚠️ Failed to load joke.";
    }
  };

  // ✅ PRINT JOKE (THIS IS THE STEP YOU LIKED)
  window.printJoke = function () {
    const jokeText = jokeBox.innerText;

    if (!jokeText || jokeText.includes("Loading")) {
      alert("❌ Unlock a joke first!");
      return;
    }

    if (points < 1) {
      alert("❌ Not enough points to print!");
      return;
    }

    points -= 1;
    savePoints();

    const printWindow = window.open("", "", "width=600,height=400");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Joke</title>
          <style>
            body {
              font-family: Arial;
              padding: 20px;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <h2>😂 Your Joke</h2>
          <p>${jokeText}</p>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

});
