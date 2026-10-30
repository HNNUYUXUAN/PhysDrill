(* Run with: wolframscript -file wolfram/RunOne.wls C-014 modern
   Requires a licensed Wolfram kernel. No cloud service is used.
   Each program runs in an isolated context. Messages are retained in a dedicated stream.
   Runtime success is not a proof of mathematical correctness. *)
root = DirectoryName[DirectoryName[$InputFileName]];
bank = Import[FileNameJoin[{root, "src", "data", "bank.json"}], "RawJSON"];
out = FileNameJoin[{root, "public", "wolfram"}];
If[!DirectoryQ[out], CreateDirectory[out, CreateIntermediateDirectories -> True]];
Clear[run];
run[q_, v_] := Module[{ctx, file, value, messages, image = "", status, result, elapsed, graphic, exported, stream, logFile},
  ctx = "PhysDrillAudit" <> StringReplace[CreateUUID[], "-" -> ""] <> "`";
  file = q["id"] <> "-" <> v["id"];
  logFile = FileNameJoin[{out, file <> ".log"}];
  stream = OpenWrite[logFile, CharacterEncoding -> "UTF-8"];
  Block[{$Context = ctx, $ContextPath = {"System`"}, $Messages = {stream}},
    {elapsed, value} = AbsoluteTiming[TimeConstrained[
      Get[FileNameJoin[{root, "wolfram", "questions", file <> ".wl"}]], 30, $Aborted]];
    (* The source D1 ends with semicolons. Explicitly read its requested values. *)
    If[q["id"] === "D-001" && value === Null,
      value = ToExpression["{v2, a2}"]];
    graphic = MemberQ[{Graphics, Graphics3D}, Head[value]];
    status = Which[value === $Aborted, "timeout", value === $Failed, "failed",
      True, "evaluated"];
    If[graphic,
      exported = Check[Export[FileNameJoin[{out, file <> ".png"}],
        Show[value, ImageSize -> 900, Background -> White], "PNG"], $Failed];
      If[StringQ[exported], image = "wolfram/" <> file <> ".png",
        status = "export-failed"];
    ];
    result = If[graphic, ToString[Head[value]], ToString[value, InputForm, PageWidth -> 100]];
  ];
  Close[stream];
  messages = DeleteCases[StringSplit[Import[logFile, "Text"], "\n\n"], ""];
  If[Length[messages] > 0 && status === "evaluated", status = "messages"];
  Remove[Evaluate[ctx <> "*"]];
  Print[file <> " " <> status];
  <|"qid" -> q["id"], "variant" -> v["id"], "revision" -> v["revision"],
    "program" -> v["program"], "status" -> status, "result" -> result,
    "messages" -> messages, "image" -> image, "seconds" -> elapsed,
    "source" -> "wolfram/questions/" <> file <> ".wl"|>
];
qid = $ScriptCommandLine[[-2]];
variant = $ScriptCommandLine[[-1]];
q = SelectFirst[bank["questions"], #["id"] === qid &];
v = SelectFirst[q["variants"], #["id"] === variant &];
record = run[q, v];
Export[FileNameJoin[{out, qid <> "-" <> variant <> ".json"}], record, "RawJSON"];
