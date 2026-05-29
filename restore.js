const fs = require('fs');
const lines = fs.readFileSync('/Users/toandle/.gemini/antigravity-ide/brain/6dc63361-9dcc-46bc-ae4f-5850b65555c9/.system_generated/logs/transcript.jsonl', 'utf-8').split('\n');
let contentToRestore = '';
for (const line of lines) {
  if (!line) continue;
  const obj = JSON.parse(line);
  if (obj.type === 'TOOL_CALL_RESULT' && obj.content.includes('File Path: `file:///Users/toandle/Downloads/Restaurant%20backend/fampam-restaurant-admin/src/worker.ts`')) {
    if (obj.content.includes('Total Lines: 629')) {
      contentToRestore = obj.content;
    }
  }
}
if (contentToRestore) {
  const parts = contentToRestore.split('The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.\n');
  if (parts.length > 1) {
    let actualContent = parts[1].split('\nThe above content shows the entire, complete file contents of the requested file.')[0];
    // strip the line numbers
    const finalContent = actualContent.split('\n').map(l => l.replace(/^\d+:\s?/, '')).join('\n');
    fs.writeFileSync('src/worker.ts', finalContent);
    console.log('Restored successfully');
  } else {
    console.log('Could not find split string');
  }
} else {
  console.log('Could not find the view_file log');
}
