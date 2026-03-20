/**
 * Convert Sanity PortableText blocks to clean Markdown.
 *
 * Used by the /api/md/ and /llms-full.txt endpoints to serve
 * structured content for AI retrieval systems.
 */

interface PTChild {
  _type: string;
  text?: string;
  marks?: string[];
}

interface PTMark {
  _key: string;
  _type: string;
  href?: string;
}

interface PTBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: PTChild[];
  markDefs?: PTMark[];
  listItem?: string;
  level?: number;
}

/**
 * Render inline children (text with marks like bold, italic, links)
 */
function renderChildren(children: PTChild[], markDefs: PTMark[] = []): string {
  if (!children?.length) return '';

  return children
    .map((child) => {
      if (child._type !== 'span' || !child.text) return child.text || '';

      let text = child.text;
      const marks = child.marks || [];

      for (const mark of marks) {
        // Check if it's an annotation (link, etc.)
        const def = markDefs.find((d) => d._key === mark);
        if (def) {
          if (def._type === 'link' && def.href) {
            text = `[${text}](${def.href})`;
          }
        } else {
          // Decorator marks
          if (mark === 'strong') text = `**${text}**`;
          if (mark === 'em') text = `*${text}*`;
        }
      }

      return text;
    })
    .join('');
}

/**
 * Convert a PortableText array to Markdown string.
 *
 * Handles: headings, paragraphs, bold, italic, links,
 * bullet/number lists, blockquotes, and break (hr).
 */
export function portableTextToMarkdown(blocks: unknown): string {
  if (!Array.isArray(blocks) || !blocks.length) return '';

  const lines: string[] = [];
  let inList: string | null = null;

  for (const block of blocks as PTBlock[]) {
    // Custom type: horizontal rule
    if (block._type === 'break') {
      if (inList) inList = null;
      lines.push('', '---', '');
      continue;
    }

    // Skip non-block types (images, embeds, etc.)
    if (block._type !== 'block') continue;

    const text = renderChildren(block.children || [], block.markDefs || []);
    const style = block.style || 'normal';

    // Handle list items
    if (block.listItem) {
      if (inList !== block.listItem) {
        if (inList) lines.push(''); // gap between different list types
        inList = block.listItem;
      }
      const prefix = block.listItem === 'number' ? '1.' : '-';
      lines.push(`${prefix} ${text}`);
      continue;
    }

    // Close any open list
    if (inList) {
      lines.push('');
      inList = null;
    }

    // Block styles
    switch (style) {
      case 'h1':
        lines.push('', `# ${text}`, '');
        break;
      case 'h2':
        lines.push('', `## ${text}`, '');
        break;
      case 'h3':
        lines.push('', `### ${text}`, '');
        break;
      case 'h4':
        lines.push('', `#### ${text}`, '');
        break;
      case 'blockquote':
        lines.push('', `> ${text}`, '');
        break;
      default:
        // normal paragraph
        if (text) lines.push('', text);
        break;
    }
  }

  // Clean up: collapse multiple blank lines, trim
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Accept PortableText array, plain string, or null — return markdown string.
 * Convenience wrapper matching the toText() pattern from the snapshot script.
 */
export function toMarkdown(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return portableTextToMarkdown(value);
  return String(value);
}
