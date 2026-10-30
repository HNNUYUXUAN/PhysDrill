r = TestReport[FileNameJoin[{DirectoryName[$InputFileName], "Corrections.wlt"}]];
Print[r["Results"]];
Export[FileNameJoin[{DirectoryName[$InputFileName], "corrections-test.json"}], <|"succeeded" -> r["TestsSucceededCount"], "failed" -> r["TestsFailedCount"], "kernel" -> $Version|>, "RawJSON"];
