pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template RangeProof(n) {
    assert(n <= 252);
    signal input in; // this is the number to be proved inside the range
    signal input range[2]; // the two elements should be the range, i.e. [lower bound, upper bound]
    signal output out;

    component low = LessEqThan(n);
    component high = GreaterEqThan(n);

    // [assignment] insert your code here
	// Initialize input of LessEqThan template
	low.in[0] <== in;
    low.in[1] <== range[1];
	// Check if input is lower than upper bound	and assign to temp
	var temp = low.out;    
    // Initialize input of GreaterEqThan template
    high.in[0] <== in;
    high.in[1] <== range[0];
    // Check if input is greater than lower bound. AND multiply with temp
    out <== temp * high.out;    
}