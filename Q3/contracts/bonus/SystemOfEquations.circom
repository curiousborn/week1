pragma circom 2.0.3;

include "https://github.com/socathie/circomlib-matrix/blob/master/circuits/matMul.circom";
include "circomlib/comparators.circom";
include "circomlib/poseidon.circom";
// include "https://github.com/0xPARC/circom-secp256k1/blob/master/circuits/bigint.circom";
template Sum () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;  
   signal output c;  

   // Constraints.  
   c <== a + b;  
}
template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal c[n];
    signal output out; // 1 for correct solution, 0 for incorrect solution
    // [bonus] insert your code here
    component mul = matMul(3,3,1);   
    component isEqual[n];
    component sum[n];
    // Multiply A and X matrices 
    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            mul.a[i][j] <== A[i][j];
        }
        mul.b[i][0] <== x[i];
    }
    var isValid;
    // Initiate sum component
    sum[0] = Sum();
    sum[0].a <== 1;
    for (var i=0; i<n; i++) {
        isEqual[i] = IsEqual();
        isEqual[i].in[0] <== mul.out[i][0];
        isEqual[i].in[1] <== b[i];
        // Add sum and assign this value to next adder
        if(i < n-1){
            sum[i+1] = Sum();
            sum[i].b <== isEqual[i].out;
            sum[i+1].a <== sum[i].c;
        }        
    }
    // Check sum is n
   component isEqual1 = IsEqual();
   isEqual1.in[0] <== sum[n-2].c;
   isEqual1.in[1] <== n;
	out <== isEqual1.out ;
}

component main {public [A, b]} = SystemOfEquations(3);

/* INPUT = {
    "x": ["15", "17", "19"],
    "A": [
        ["1", "1",  "1"],
        ["1", "2",  "3"],
        ["2", "-1", "1"]
    ],
    "b": ["51", "106", "73014444064"]
} */
