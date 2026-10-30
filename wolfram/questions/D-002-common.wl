(* PhysDrill D-002 / common / revision 2
Source: sources/questions.md, line 444
Generated from src/data/bank.json. Run each file in a fresh kernel. *)
r = t + t^2;
b = 1 + Sqrt[t];
Psi = Pi r^2 b;
v = -D[Psi, t];
t = 2;
Simplify[v]
