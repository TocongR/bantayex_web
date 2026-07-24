// Handles both the { text } option shape used internally and the plain
// string option shape used in AI-proposed actions.
export function optionText(opt) {
  return typeof opt === 'string' ? opt : (opt?.text ?? '');
}

export function toPlainOptions(options) {
  return (options || []).map(optionText);
}