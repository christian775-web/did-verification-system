require("dotenv").config();

const contract = require("./services/blockchain");

async function test() {
  try {
    const result = await contract.verifyCredential(
      "CRD001",
      "abc123hash"
    );

    console.log("Blockchain Result:", result);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();