(* Targeted mathematical checks. Run with TestReport["wolfram/Corrections.wlt"]. *)
VerificationTest[ComplexExpand[Re[a + I b]], a, TestID -> "A23-real-part"]
VerificationTest[ComplexExpand[Im[a + I b]], b, TestID -> "A24-imaginary-part"]
VerificationTest[Length[List @@ Expand[Normal[Series[ArcSin[x], {x, 1, 8}]]]], 9, TestID -> "B11-nine-nonzero-terms"]
VerificationTest[First[Maximize[1 - ((x - 2)^2)^(1/3), x]], 1, TestID -> "B13-real-maximum"]
VerificationTest[First[Minimize[{1 - ((x - 2)^2)^(1/3), 1 <= x <= 3}, x]], 0, TestID -> "B14-real-minimum"]
VerificationTest[FullSimplify[-D[Pi (t + t^2)^2 (1 + Sqrt[t]), t] /. t -> 2], -3 (20 + 23 Sqrt[2]) Pi, TestID -> "D2-full-flux-derivative"]
