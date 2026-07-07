// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CredentialRegistry {

    struct Credential {
        string credentialId;
        string credentialHash;
        address holder;
        bool revoked;
    }

    mapping(string => Credential) private credentials;

    // IMPORTANT: holder must be indexed for filtering history
    event CredentialIssued(string credentialId, address indexed holder);
    event CredentialRevoked(string credentialId);

    // ========================
    // ISSUE CREDENTIAL
    // ========================
    function issueCredential(
        string memory credentialId,
        address holder,
        string memory credentialHash
    ) public {
        require(
            bytes(credentials[credentialId].credentialId).length == 0,
            "Already exists"
        );

        credentials[credentialId] = Credential({
            credentialId: credentialId,
            credentialHash: credentialHash,
            holder: holder,
            revoked: false
        });

        emit CredentialIssued(credentialId, holder);
    }

    // ========================
    // VERIFY CREDENTIAL
    // ========================
    function verifyCredential(
        string memory credentialId,
        string memory credentialHash
    ) public view returns (bool) {

        Credential memory c = credentials[credentialId];

        if (bytes(c.credentialId).length == 0) return false;
        if (c.revoked) return false;

        return keccak256(abi.encodePacked(c.credentialHash)) ==
               keccak256(abi.encodePacked(credentialHash));
    }

    // ========================
    // REVOKE CREDENTIAL
    // ========================
    function revokeCredential(string memory credentialId) public {
        require(
            bytes(credentials[credentialId].credentialId).length != 0,
            "Not found"
        );

        credentials[credentialId].revoked = true;

        emit CredentialRevoked(credentialId);
    }
}