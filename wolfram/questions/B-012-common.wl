(* PhysDrill B-012 / common / revision 1
Source: sources/questions.md, line 156
Generated from src/data/bank.json. Run each file in a fresh kernel. *)
DSolve[
  {y''[x] - y[x] == 1, y'[0] == y'[1], y[0] == 1 + y[1]},
  y[x], x
]
