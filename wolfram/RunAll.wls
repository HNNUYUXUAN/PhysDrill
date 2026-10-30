(* Reproducible audit: one fresh kernel process per answer variant.
   Run from the repository root: wolframscript -file wolfram/RunAll.wls *)
root = DirectoryName[DirectoryName[$InputFileName]];
bank = Import[FileNameJoin[{root, "src", "data", "bank.json"}], "RawJSON"];
out = FileNameJoin[{root, "public", "wolfram"}];
records = Flatten[Table[
  process = RunProcess[{"wolframscript", "-file", FileNameJoin[{root, "wolfram", "RunOne.wls"}], q["id"], v["id"]}];
  If[process["ExitCode"] =!= 0, Print[process]; Exit[1]];
  record = Import[FileNameJoin[{out, q["id"] <> "-" <> v["id"] <> ".json"}], "RawJSON"];
  Print[q["id"] <> "-" <> v["id"] <> " " <> record["status"]];
  record,
  {q, bank["questions"]}, {v, q["variants"]}], 1];
report = <|"kernel" -> $Version, "generatedAt" -> DateString[Now, "ISODateTime"],
  "bankVersion" -> bank["bankVersion"], "questionCount" -> Length[bank["questions"]], "records" -> records|>;
Export[FileNameJoin[{out, "audit.json"}], report, "RawJSON"];
Export[FileNameJoin[{root, "src", "data", "wolfram.json"}], report, "RawJSON"];
Print[Counts[Lookup[records, "status"]]];
