import type { Sentence, Word } from "nlcst";
import { ParseEnglish } from "parse-english";
import { toString } from "nlcst-to-string";
import { type Modifier, modifyChildren } from "unist-util-modify-children";

let segmenter: Modifier<Sentence> = (child, index, sentence) => {
  if (child.type === "WordNode" && child.position) {
    const text = toString(child);

    const segmenter = new Intl.Segmenter("zh", { granularity: "word" });
    const segments = segmenter.segment(text);

    let currentOffset = child.position.start.offset ?? 0;
    let currentColumn = child.position.start.column;

    const newWordNodes: Word[] = [];

    for (const segment of segments) {
      const segmentText = segment.segment;

      const startOffset = currentOffset;
      const endOffset = startOffset + segmentText.length;
      const startColumn = currentColumn;
      const endColumn = startColumn + segmentText.length;

      const nodePosition = {
        start: {
          line: child.position?.start.line,
          column: startColumn,
          offset: startOffset,
        },
        end: {
          line: child.position?.end.line,
          column: endColumn,
          offset: endOffset,
        },
      };

      newWordNodes.push({
        type: "WordNode",
        children: [
          {
            type: "TextNode",
            value: segment.segment,
            position: nodePosition,
          },
        ],
        position: nodePosition,
      });

      currentOffset = endOffset;
      currentColumn = endColumn;
    }

    sentence.children.splice(index, 1, ...newWordNodes);

    return index + newWordNodes.length;
  }
  return index + 1;
};

/**
 * Create a new parser.
 *
 * `ParseChinese` extends `ParseEnglish`.
 * `ParseEnglish` extends `ParseLatin`.
 * See `parse-latin` for API docs.
 */
export class ParseChinese extends ParseEnglish {}

/**
 * List of transforms handling a sentence.
 */
ParseEnglish.prototype.tokenizeSentencePlugins = [
  modifyChildren(segmenter),
  ...ParseEnglish.prototype.tokenizeSentencePlugins,
];

/**
 * List of transforms handling a paragraph.
 */
ParseEnglish.prototype.tokenizeParagraphPlugins = [
  ...ParseEnglish.prototype.tokenizeParagraphPlugins,
];
