exports = function (changeEvent) {
  try {
    console.log("Change Event: ", JSON.stringify(changeEvent));

    const documentKey = changeEvent.documentKey;

    if (!documentKey) {
      console.log(
        "No documentKey in changeEvent. Change Event: ",
        JSON.stringify(changeEvent)
      );
      return;
    }

    const db = context.services.get("qldWeather").db("b=weather_db");
    const logCollection = db.collection("weather_deletion_logs");

    const logDocument = {
      ...documentKey,
      deletedAt: new Date(),
      reason: "Deleted",
      operationType: changeEvent.operationType,
      ns: changeEvent.ns,
      clusterTime: changeEvent.clusterTime,
      wallTime: changeEvent.wallTime,
    };

    console.log("Logging document: ", JSON.stringify(logDocument));

    logCollection
      .insertOne(logDocument)
      .then((result) => {
        console.log("Deleted record logged successfully:", result);
      })
      .catch((err) => {
        console.error("Error logging deleted record:", err);
      });
  } catch (err) {
    console.error("Error in trigger function:", err);
  }
};
