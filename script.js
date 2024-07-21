document.getElementById("fetchData").addEventListener("click", function () {
  const apiUrl = "http://localhost:3000/api/weather/6684f3e33e4f1de48eb7f122";
  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(apiUrl, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("response").textContent = JSON.stringify(
        data,
        null,
        2
      );
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      document.getElementById("response").textContent =
        "Failed to fetch data. See console for details.";
    });
});
