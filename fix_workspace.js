const fs = require("fs");
const filePath =
  "c:/TBE-Web/packages/components/src/containers/Cards/DsaPrepWorkspace.tsx";
let content = fs.readFileSync(filePath, "utf-8");

const target = `                <div className="flex items-center gap-2">
                  {selectedTopic && (
                    <Button
                      onClick={onBackToTopics}
                      variant="OUTLINE"
                      size="SMALL"
                      text="←"
                      className="border-gray-800 text-gray-400 bg-transparent hover:border-red-500 hover:bg-red-500/10 shrink-0 py-[3px] px-[8px] h-auto text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
                    />
                  )}
                {currentTopicConfig?.hasStudyGuide && (
                  <button
                    onClick={handleToggleStudyGuide}
                    className={cn(
                      "flex items-center justify-center w-[30px] h-[30px] rounded-[6px] border-[0.5px] transition-all duration-300 flex-shrink-0",
                      isStudyGuideOpen
                        ? "bg-red-500/15 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] scale-105"
                        : "bg-red-500/[0.04] border-red-500/20 text-red-400 group-hover:border-red-500/40 hover:text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.1)]",
                    )}
                    title={
                      isStudyGuideOpen
                        ? "Back to Questions"
                        : "Open Study Guide"
                    }
                  >
                    <BookOpen
                      className={cn(
                        "w-[16px] h-[16px] transition-all duration-300",
                        isStudyGuideOpen ? "scale-110" : "",
                      )}
                      strokeWidth={2}
                    />
                  </button>
                )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>`;

const replacement = `                <div className="flex items-center gap-2">
                  {selectedTopic && (
                    <Button
                      onClick={onBackToTopics}
                      variant="OUTLINE"
                      size="SMALL"
                      text="←"
                      className="border-gray-800 text-gray-400 bg-transparent hover:border-red-500 hover:bg-red-500/10 shrink-0 py-[3px] px-[8px] h-auto text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
                    />
                  )}
                  {currentTopicConfig?.hasStudyGuide && (
                    <button
                      onClick={handleToggleStudyGuide}
                      className={cn(
                        "flex items-center justify-center w-[30px] h-[30px] rounded-[6px] border-[0.5px] transition-all duration-300 flex-shrink-0",
                        isStudyGuideOpen
                          ? "bg-red-500/15 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] scale-105"
                          : "bg-red-500/[0.04] border-red-500/20 text-red-400 group-hover:border-red-500/40 hover:text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.1)]",
                      )}
                      title={
                        isStudyGuideOpen
                          ? "Back to Questions"
                          : "Open Study Guide"
                      }
                    >
                      <BookOpen
                        className={cn(
                          "w-[16px] h-[16px] transition-all duration-300",
                          isStudyGuideOpen ? "scale-110" : "",
                        )}
                        strokeWidth={2}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>`;

// Use normalize function to deal with line endings CRLF vs LF
function normalize(str) {
  return str.replace(/\\r\\n/g, "\\n").trim();
}

if (normalize(content).includes(normalize(target))) {
  // This is risky for a full replace if there are multiple occurrences (not likely here)
  // We'll just use string replacement on normalized content but that loses line endings info.
  // Better: find start and end and replace the lines.
  const lines = content.split(/\\r?\\n/);
  const targetLines = target.split(/\\r?\\n/);

  // Find target line sequence
  let foundIndex = -1;
  for (let i = 0; i < lines.length - targetLines.length; i++) {
    let match = true;
    for (let j = 0; j < targetLines.length; j++) {
      if (lines[i + j].trim() !== targetLines[j].trim()) {
        match = false;
        break;
      }
    }
    if (match) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex !== -1) {
    lines.splice(
      foundIndex,
      targetLines.length,
      ...replacement.split(/\\r?\\n/),
    );
    fs.writeFileSync(filePath, lines.join("\\n"), "utf-8");
    console.log("Success");
  } else {
    console.log("Target lines not found sequence");
  }
} else {
  console.log("Target not found");
}
