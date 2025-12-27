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

  // Show points initially
  savePoints();

  // ✅ Daily visit reward
  const lastVisit = localStorage.getItem("lastVisit");
  const today = new Date().toDateString();

  if (lastVisit !== today) {
    points += 1;
    localStorage.setItem("lastVisit", today);
    savePoints();
  }

  // ✅ Time-based reward (30 seconds)
  setTimeout(() => {
    points += 1;
    savePoints();
    alert("🎉 You earned 1 point for staying!");
  }, 30000);

  // ✅ Unlock joke using real API
  window.unlockJoke = async function () {
    if (points < 1) {
      alert("❌ Not enough points. Come back tomorrow!");
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

    } catch (error) {
      jokeBox.innerText = "⚠️ Failed to load joke. Try again.";
    }
  };

});
