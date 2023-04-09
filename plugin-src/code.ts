/** @format */

function sortByFontSizeDesc(textNodes: TextNode[]): TextNode[] {
  const mixedNodes: TextNode[] = [];
  const filteredNodes: TextNode[] = textNodes.filter((node) => {
    if (typeof node.fontSize === "number") {
      return true;
    } else {
      mixedNodes.push(node);
      return false;
    }
  });
  const sortedNodes: TextNode[] = filteredNodes.sort((a, b) => {
    if (typeof a.fontSize === "number" && typeof b.fontSize === "number") {
      return b.fontSize - a.fontSize;
    } else {
      // Return a default value or skip the comparison for mixed values
      return 0;
    }
  });
  return sortedNodes.concat(mixedNodes);
}

figma.showUI(__html__, { themeColors: true, height: 300, width: 420 });

figma.ui.onmessage = (msg) => {
  if (msg.prompt === "get-text") {
    figma.ui.resize(970, 690);
    // Array to store OG text list
    // TODO: Change to `new Set()` for persormance
    // let ogTextList: Set<TextNode> = new Set();
    let ogTextList: Array<TextNode> = [];
    let sortedTextList: Array<TextNode> = [];

    // Get all text nodes in figma page
    const specificText = figma.currentPage.findAllWithCriteria({
      types: ["TEXT"],
    });
    // const textStyles: { [key: string]: TextStyle } = {};

    // Filter for recurring styles
    specificText.map((node: TextNode, index: number) => {
      if (
        ogTextList.findIndex(
          (text: TextNode) => text.fontSize === node.fontSize
        ) === -1
      ) {
        ogTextList.push(node);
      }
    });

    // Sort array by Font Size in Descending Order
    const anotherList = sortByFontSizeDesc(ogTextList) as TextNode[];

    // Empty array to hold transformed values
    let listWithValues: Array<any> = [];

    // Manually structure object
    anotherList.map((node) => {
      // Do not include text nodes with mixed font styles
      if (typeof node.fontName !== typeof figma.mixed) {
        listWithValues.push({
          id: node.id,
          variationName: node.name,
          fontName: node.fontName,
          fontSize: node.fontSize,
        });
      }
    });

    console.log(listWithValues);

    // figma.currentPage.selection = nodes;
    // figma.viewport.scrollAndZoomIntoView(nodes);

    figma.ui.postMessage({
      type: "get-text",
      prompt: listWithValues,
    });
  }

  // figma.closePlugin();
};
