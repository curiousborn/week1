const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16 } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
		 /* Generate the proof. The outputs are: 
			- proof - proof of computation 
			- PublicValues - The result of computation */
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");
		
		// Print the result
        console.log('1x2 =',publicSignals[0]);
		// Convert string to Integers, string array to Integer array & string attribute object to Integer attribute object
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // Convert string to Integers, string array to Integer array & string attribute object to Integer attribute object
		const editedProof = unstringifyBigInts(proof);
		// Generate the calldata(input data) for calling the contract
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
		// Convert multidimension array to one dimension array & convert hex array item to Integer 
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
		// Construct value for input a from argv array
        const a = [argv[0], argv[1]];
		// Construct value for input b from argv array
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
		// Construct value for output c from argv array
        const c = [argv[6], argv[7]];
        // Construct the proof from argv array
		const Input = argv.slice(8);
		
		// Call the verify proof method of the contract to verify the proof for the given inputs
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
		// Call the verify proof method of the contract to verify the proof for the given inputs
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
	let VerifierGroth16;
    let verifierGroth16;
    beforeEach(async function () {
		//[assignment] insert your script here
        VerifierGroth16 = await ethers.getContractFactory("Multiplier3Verifier");
        verifierGroth16 = await VerifierGroth16.deploy();
        await verifierGroth16.deployed();
    });

    it("Should return true for correct proof", async function () {
        ////[assignment] insert your script here
		 /* Generate the proof. The outputs are: 
			- proof - proof of computation 
			- PublicValues - The result of computation */
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2","c":"3"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");
		
		// Print the result
        console.log('1x2x3 =', publicSignals[0]);
		// Convert string to Integers, string array to Integer array & string attribute object to Integer attribute object
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // Convert string to Integers, string array to Integer array & string attribute object to Integer attribute object
		const editedProof = unstringifyBigInts(proof);
		// Generate the calldata(input data) for calling the contract
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);		
		// Convert multidimension array to one dimension array & convert hex array item to Integer 
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());		
		// Construct value for input a from argv array
        const a = [argv[0], argv[1]];
		// Construct value for input b from argv array
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
		// Construct value for output c from argv array
        const c = [argv[6], argv[7]];		
        // Construct the proof from argv array
		const Input = argv.slice(8);
		
		// Call the verify proof method of the contract to verify the proof for the given inputs
        expect(await verifierGroth16.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
		// Call the verify proof method of the contract to verify the proof for the given inputs
        expect(await verifierGroth16.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {

    let VerifierPlonk;
    let verifierPlonk;
    beforeEach(async function () {
		//[assignment] insert your script here
        VerifierPlonk = await ethers.getContractFactory("Multiplier3Verifier");
        verifierPlonk = await VerifierPlonk.deploy();
        await verifierPlonk.deployed();
    });

    it("Should return true for correct proof", async function () {
        ////[assignment] insert your script here
		 /* Generate the proof. The outputs are: 
			- proof - proof of computation 
			- PublicValues - The result of computation */
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2","c":"3"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");
		
		// Print the result
        console.log('1x2x3 =', publicSignals[0]);
		// Convert string to Integers, string array to Integer array & string attribute object to Integer attribute object
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // Convert string to Integers, string array to Integer array & string attribute object to Integer attribute object
		const editedProof = unstringifyBigInts(proof);
		// Generate the calldata(input data) for calling the contract
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);		
		// Convert multidimension array to one dimension array & convert hex array item to Integer 
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());		
		// Construct value for input a from argv array
        const a = [argv[0], argv[1]];
		// Construct value for input b from argv array
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
		// Construct value for output c from argv array
        const c = [argv[6], argv[7]];		
        // Construct the proof from argv array
		const Input = argv.slice(8);
		
		// Call the verify proof method of the contract to verify the proof for the given inputs
        expect(await verifierPlonk.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
		// Call the verify proof method of the contract to verify the proof for the given inputs
        expect(await verifierPlonk.verifyProof(a, b, c, d)).to.be.false;
    });
});