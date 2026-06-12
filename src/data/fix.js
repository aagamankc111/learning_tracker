import sys

def fix_js_file(input_path, output_path):
with open(input_path, 'r', encoding = 'utf-8') as f:
content = f.read()

fixed_chars = []
in_string = False
escape = False

for ch in content:
    if escape:
        fixed_chars.append(ch)
escape = False
continue
if ch == '\\':
    escape = True
fixed_chars.append(ch)
continue
if ch == '"' and not in_string:
in_string = True
fixed_chars.append(ch)
continue
if ch == '"' and in_string:
in_string = False
fixed_chars.append(ch)
continue
if in_string and ch == '\n':
fixed_chars.append('\\n')
continue
fixed_chars.append(ch)

fixed_content = ''.join(fixed_chars)
with open(output_path, 'w', encoding = 'utf-8') as f:
f.write(fixed_content)
print(f"Fixed file written to {output_path}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python fix_js.py input.js output.js")
sys.exit(1)
fix_js_file(sys.argv[1], sys.argv[2])