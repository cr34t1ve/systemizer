/** @format */

interface msgI {
  prompt: "get-text" | "create-frames";
  data: any;
}

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

figma.ui.onmessage = async (msg) => {
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
      data: listWithValues,
    });
  } else if (msg.prompt === "create-frames") {
    const frame = figma.createFrame();
    frame.x = 50;
    frame.y = 50;
    // frame.resize(1289, 720);
    frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    figma.currentPage.selection = [frame];
    msg.data.map(async (item: any, index: number) => {
      const text = figma.createText();
      // Move to (50, 50)
      // text.x = 200;
      // text.y = 200;
      // Load the font in the text node before setting the characters
      await figma.loadFontAsync({
        family: "Inter",
        style: "Regular",
      });
      await figma
        .loadFontAsync({
          family: item.fontName.family,
          style: item.fontName.style,
        })
        .then(() => {
          text.fontName = {
            family: item.fontName.family,
            style: item.fontName.style,
          };
          text.characters = "Lorem Ipsum";
          text.fontSize = item.fontSize;
          text.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
        });
      frame.appendChild(text);
      frame.layoutGrow = 1;
    });
    frame.layoutMode = "VERTICAL";
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.itemSpacing = 30;
    frame.verticalPadding = 100;
    frame.horizontalPadding = 100;
    // figma.closePlugin();
  }
};
