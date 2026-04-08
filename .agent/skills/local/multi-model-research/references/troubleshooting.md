# Multi-Model Research Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Gemini CLI Timeout or Hangs

**Symptoms**:
- Gemini command doesn't return after 2-3 minutes
- Process appears frozen
- No output after initial startup logs

**Root Causes**:
1. OAuth token expired (most common)
2. Prompt too long for direct CLI
3. Network connectivity issues
4. Google API rate limiting

**Solutions**:

**Solution 1: Switch to gemp (Recommended)**
```bash
# Use gemp which handles token refresh automatically
cat > /tmp/gemini_prompt.txt << 'PROMPT_EOF'
Your question here
PROMPT_EOF

cat /tmp/gemini_prompt.txt | node ~/.gemini/long_task_runner.js 2>&1
```

**Solution 2: Refresh OAuth Token**
```bash
# Check current auth status
gemini --version

# Re-authenticate if needed
# Follow OAuth flow in browser
```

**Solution 3: Shorten Prompt**
```bash
# If prompt is very long, summarize or split into chunks
# Aim for < 2000 words per query
```

**Solution 4: Add Timeout**
```bash
# Use timeout command to prevent infinite hangs
timeout 300 gemini --yolo -c "$PROMPT" 2>&1 | grep -v "STARTUP|YOLO|Load"
```

---

### Issue 2: Codex Returns JSONL Format

**Symptoms**:
- Output contains lines like `{"type":"text","data":"..."}`
- Multiple JSON objects instead of plain text
- Hard to read response

**Root Cause**:
- Codex CLI outputs in JSONL format by default
- Each event (text, thinking) is a separate JSON object

**Solutions**:

**Solution 1: Parse JSONL Events (Recommended)**
```bash
cat /tmp/codex_prompt.txt | codex exec --dangerously-bypass-approvals-and-sandbox - 2>&1 | \
  grep '"type":"text"' | \
  sed 's/.*"data":"\(.*\)".*/\1/' | \
  sed 's/\\n/\n/g'
```

**Solution 2: Limit Output with head**
```bash
# Get first 500 lines (usually sufficient)
cat /tmp/codex_prompt.txt | codex exec --dangerously-bypass-approvals-and-sandbox - 2>&1 | head -500
```

**Solution 3: Save to File and Parse**
```bash
cat /tmp/codex_prompt.txt | \
  codex exec --dangerously-bypass-approvals-and-sandbox -o /tmp/codex_output.txt - 2>&1

# Read and parse the file
cat /tmp/codex_output.txt
```

---

### Issue 3: Shell Escaping Errors

**Symptoms**:
- `bash: syntax error near unexpected token`
- `parse error` in heredoc
- Quotes not properly escaped

**Root Cause**:
- Complex prompts with nested quotes
- Special characters in prompts
- Heredoc delimiters not properly escaped

**Solutions**:

**Solution 1: Always Use Temporary Files (Best Practice)**
```bash
# Write prompt to file first
cat > /tmp/gemini_prompt.txt << 'PROMPT_EOF'
Your question with "quotes" and 'apostrophes'
Can include any special characters: $, `, \, etc.
PROMPT_EOF

# Then pipe to CLI
cat /tmp/gemini_prompt.txt | gemini --yolo 2>&1 | grep -v "STARTUP|YOLO|Load"
```

**Solution 2: Use Single-Quoted Heredoc**
```bash
# 'EOF' prevents variable expansion
cat > /tmp/prompt.txt << 'EOF'
Content here
EOF
```

**Solution 3: Escape Special Characters**
```bash
# If must use command line, escape properly
PROMPT="Question with \"quotes\" and \`backticks\`"
gemini --yolo -c "$PROMPT"
```

---

### Issue 4: CLI Commands Not Found

**Symptoms**:
- `gemini: command not found`
- `codex: command not found`

**Root Cause**:
- CLI tools not installed or not in PATH
- Shell session doesn't have updated PATH

**Solutions**:

**Solution 1: Check Installation**
```bash
# Verify gemini
which gemini
# Should show: /usr/local/bin/gemini or similar

# Verify codex
which codex
# Should show: /opt/homebrew/opt/nvm/versions/node/v22.17.1/bin/codex or similar
```

**Solution 2: Verify PATH**
```bash
echo $PATH | grep -o '[^:]*gemini[^:]*'
echo $PATH | grep -o '[^:]*codex[^:]*'
```

**Solution 3: Reload Shell Configuration**
```bash
# Reload .zshrc or .bashrc
source ~/.zshrc
# or
source ~/.bashrc
```

**Solution 4: Use Full Path**
```bash
# Use absolute path if PATH not updated
/usr/local/bin/gemini --yolo -c "$PROMPT"
/opt/homebrew/opt/nvm/versions/node/v22.17.1/bin/codex exec --dangerously-bypass-approvals-and-sandbox -
```

---

### Issue 5: Empty or Incomplete Responses

**Symptoms**:
- CLI returns empty string
- Response cuts off mid-sentence
- Only startup logs, no actual response

**Root Causes**:
1. Filtering removed actual content
2. Timeout too short
3. API error not visible
4. Prompt unclear or malformed

**Solutions**:

**Solution 1: Remove Output Filtering**
```bash
# Don't filter output to see full response
cat /tmp/gemini_prompt.txt | gemini --yolo 2>&1
# Check if actual content is being filtered out
```

**Solution 2: Check for Errors**
```bash
# Look for error messages in full output
cat /tmp/gemini_prompt.txt | gemini --yolo 2>&1 | grep -i "error\|fail\|invalid"
```

**Solution 3: Increase Timeout**
```bash
# Use gemp with 20-minute timeout
cat /tmp/gemini_prompt.txt | node ~/.gemini/long_task_runner.js 2>&1
```

**Solution 4: Simplify Prompt**
```bash
# Test with simple prompt first
echo "What is 2+2?" | gemini --yolo 2>&1
```

---

### Issue 6: gemp Script Not Found or Fails

**Symptoms**:
- `node ~/.gemini/long_task_runner.js: No such file or directory`
- `gemp: command not found`

**Root Cause**:
- gemp not installed or misconfigured
- Node.js not available

**Solutions**:

**Solution 1: Verify gemp Installation**
```bash
# Check if file exists
ls -la ~/.gemini/long_task_runner.js

# Check Node.js
which node
node --version
```

**Solution 2: Fallback to Standard gemini CLI**
```bash
# Use standard gemini CLI if gemp unavailable
cat /tmp/gemini_prompt.txt | gemini --yolo 2>&1 | grep -v "STARTUP|YOLO|Load"
```

**Solution 3: Reinstall gemp**
```bash
# Follow gemp installation instructions
# (instructions depend on gemp distribution method)
```

---

### Issue 7: Rate Limiting or Quota Exceeded

**Symptoms**:
- "Rate limit exceeded" error
- "Quota exceeded" message
- 429 HTTP status code

**Root Cause**:
- Too many requests in short time
- Daily quota reached
- Account limits

**Solutions**:

**Solution 1: Wait and Retry**
```bash
# Wait 60 seconds before retry
sleep 60
cat /tmp/gemini_prompt.txt | gemini --yolo 2>&1
```

**Solution 2: Batch Requests**
```bash
# Combine multiple questions into one prompt
# Instead of 3 separate calls, use 1 call with 3 questions
```

**Solution 3: Check Quota Status**
```bash
# Check Google Cloud Console for quota details
# (specific to Gemini API setup)
```

---

### Issue 8: Codex Authentication Errors

**Symptoms**:
- "Authentication failed" from codex
- "Invalid credentials"
- 401 or 403 errors

**Root Cause**:
- Codex API key expired or invalid
- Permissions not set correctly

**Solutions**:

**Solution 1: Verify Codex Configuration**
```bash
# Check codex configuration
codex --version
codex config list
```

**Solution 2: Re-authenticate**
```bash
# Follow codex authentication flow
codex login
# or
codex config set api_key YOUR_KEY
```

**Solution 3: Check Permissions**
```bash
# Ensure --dangerously-bypass-approvals-and-sandbox is allowed
# (This is a security flag, ensure proper authorization)
```

---

## Quick Debugging Checklist

When multi-model research fails, check these in order:

1. **CLI Availability**
   - [ ] `which gemini` works
   - [ ] `which codex` works
   - [ ] `which node` works (for gemp)

2. **Authentication**
   - [ ] `gemini --version` shows authenticated
   - [ ] `codex --version` works

3. **Prompt File**
   - [ ] `/tmp/gemini_prompt.txt` exists and readable
   - [ ] `/tmp/codex_prompt.txt` exists and readable
   - [ ] Files contain expected content

4. **Network**
   - [ ] Internet connectivity working
   - [ ] No proxy issues
   - [ ] Google API accessible

5. **Output**
   - [ ] Check unfiltered output first
   - [ ] Look for error messages
   - [ ] Verify response not empty

---

## Best Practices for Reliability

1. **Always Use Temporary Files**
   - Avoids shell escaping issues
   - Easier to debug
   - Can inspect prompt content

2. **Prefer gemp Over gemini CLI**
   - Better timeout handling (20 min vs 2-3 min)
   - Automatic token refresh
   - Cleaner output

3. **Add Timeouts to All Commands**
   - Prevents infinite hangs
   - `timeout 300` for 5-minute limit

4. **Log All Outputs for Debugging**
   - Save full output before filtering
   - Check logs when issues occur

5. **Test Simple Queries First**
   - Verify CLI working with "What is 2+2?"
   - Then try actual complex prompt

6. **Use Error Handling in Scripts**
   ```bash
   if ! cat /tmp/prompt.txt | gemini --yolo 2>&1 > /tmp/output.txt; then
     echo "Gemini CLI failed, check /tmp/output.txt"
     exit 1
   fi
   ```

---

## Emergency Fallback Strategy

If all else fails, use this minimal working example:

```bash
# 1. Create prompt file
echo "Your question here" > /tmp/test_prompt.txt

# 2. Try gemp first
if command -v node &> /dev/null; then
  cat /tmp/test_prompt.txt | node ~/.gemini/long_task_runner.js 2>&1 > /tmp/response.txt
fi

# 3. Fallback to gemini CLI
if [ ! -s /tmp/response.txt ]; then
  cat /tmp/test_prompt.txt | gemini --yolo 2>&1 > /tmp/response.txt
fi

# 4. Show result
cat /tmp/response.txt
```

This provides maximum compatibility and fallback options.
