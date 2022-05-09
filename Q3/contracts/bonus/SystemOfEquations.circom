pragma circom 2.0.3;

include "../../node_modules/circomlib-matrix/circuits/matMul.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
    component mul = matMul(3,3,1);
    component isEqual[4];
    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            mul.a[i][j] <== A[i][j];
        }
        mul.b[i][0] <== x[i];
    }
    var valid;
    for (var i=0; i<3; i++) {
        isEqual[i] = IsEqual();
        isEqual[i].in[0] <== mul.out[i][0];
        isEqual[i].in[1] <== b[i];        
		valid = isEqual[i].out;
    }
	out <== valid;
}

component main {public [A, b]} = SystemOfEquations(3);