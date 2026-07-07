const express = require("express");
const router = express.Router();
const contract = require("../services/blockchain");

// =======================
// ISSUE CREDENTIAL
// =======================
router.post("/issue", async (req, res) => {
  try {
    const { credentialId, credentialHash, holder } = req.body;

    if (!credentialId || !credentialHash || !holder) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const tx = await contract.issueCredential(
      credentialId,
      holder,
      credentialHash
    );

    await tx.wait();

    res.json({
      success: true,
      message: "Credential issued successfully",
      tx: tx.hash,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.reason || err.message,
    });
  }
});

// =======================
// VERIFY CREDENTIAL
// =======================
router.post("/verify", async (req, res) => {
  try {
    const { credentialId, credentialHash } = req.body;

    const valid = await contract.verifyCredential(
      credentialId,
      credentialHash
    );

    res.json({
      success: true,
      valid,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.reason || err.message,
    });
  }
});

// =======================
// REVOKE CREDENTIAL
// =======================
router.post("/revoke", async (req, res) => {
  try {
    const { credentialId } = req.body;

    const tx = await contract.revokeCredential(credentialId);

    await tx.wait();

    res.json({
      success: true,
      message: "Credential revoked successfully",
      tx: tx.hash,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.reason || err.message,
    });
  }
});

// =======================
// HISTORY
// =======================
router.get("/history/:address", async (req, res) => {
  try {
    const address = req.params.address.toLowerCase();

    const issuedEvents = await contract.queryFilter(
      contract.filters.CredentialIssued()
    );

    const revokedEvents = await contract.queryFilter(
      contract.filters.CredentialRevoked()
    );

    const history = [];

    // Add all issued credentials
    issuedEvents.forEach((event) => {
      if (event.args.holder.toLowerCase() === address) {
        history.push({
  credentialId: event.args.credentialId,
  holder: event.args.holder,
  tx: event.transactionHash,
  block: Number(event.blockNumber),
  status: "ACTIVE",
});
      }
    });

    // Mark revoked credentials
    revokedEvents.forEach((event) => {
      const item = history.find(
        (h) => h.credentialId === event.args.credentialId
      );

      if (item) {
        item.status = "REVOKED";
        item.revokeTx = event.transactionHash;
      }
    });

    history.sort((a, b) => b.block - a.block);

    res.json(history);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.reason || err.message,
    });
  }
});

module.exports = router;