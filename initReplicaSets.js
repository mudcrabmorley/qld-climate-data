// Initialize Config Server Replica Set
const configReplSet = {
  _id: "configReplSet",
  configsvr: true,
  members: [{ _id: 0, host: "configsvr:27019" }],
};

// Initialize Shard 1 Replica Set
const shard1ReplSet = {
  _id: "shard1ReplSet",
  members: [{ _id: 0, host: "shard1:27018" }],
};

// Initialize Shard 2 Replica Set
const shard2ReplSet = {
  _id: "shard2ReplSet",
  members: [{ _id: 0, host: "shard2:27017" }],
};

// Initialize Shard 3 Replica Set
const shard3ReplSet = {
  _id: "shard3ReplSet",
  members: [{ _id: 0, host: "shard3:27016" }],
};

print("Initiating Config Server Replica Set...");
rs.initiate(configReplSet);

print("Initiating Shard 1 Replica Set...");
rs.initiate(shard1ReplSet);

print("Initiating Shard 2 Replica Set...");
rs.initiate(shard2ReplSet);

print("Initiating Shard 3 Replica Set...");
rs.initiate(shard3ReplSet);
