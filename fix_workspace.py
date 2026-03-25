import sys

file_path = r'c:\TBE-Web\packages\components\src\containers\Cards\DsaPrepWorkspace.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Search for the lines around 172
# We want to replace the part from line 150 to 178
# ... 140: <div className="flex items-center gap-2">
# ... 150: {currentTopicConfig?.hasStudyGuide && ( ... ) }
# ... 173: </div>

new_lines = []
for i, line in enumerate(lines):
    if i == 149: # line 150
        new_lines.append('                  {currentTopicConfig?.hasStudyGuide && (\n')
    elif 150 <= i <= 176:
        # Keep lines 151 to 172 but adjust indentation if needed
        # Or just search and replace specifically
        new_lines.append(line)
    elif i == 177: # line 178 closing 81
         new_lines.append(line)
    else:
        new_lines.append(line)

# This is too complex. Let's just rewrite the whole Header Banner block.
start_index = -1
end_index = -1
for i, line in enumerate(lines):
    if '<div className="w-full min-h-[72px]' in line:
        start_index = i
    if '</div>' in line and i > start_index and start_index != -1:
        # We need the matching closing tag for line 79 (closed at 220)
        pass

# I'll just use a simpler approach: replace the problematic block with the correct one.
target = """                <div className="flex items-center gap-2">
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
        </div>"""

replacement = """                <div className="flex items-center gap-2">
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
        </div>"""

content = "".join(lines)
if target in content:
    new_content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Success")
else:
    print("Target not found")
