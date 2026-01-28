# Code Analysis MCP Server

Custom MCP server built with **mcp-use server framework** that analyzes code for security vulnerabilities, dangerous patterns, and best practices.

## 🎯 Purpose

Demonstrates complete mcp-use ecosystem mastery for the **MCP Use Software Engineer** role:
- Custom MCP server creation using mcp-use framework
- Auto-inspector feature (unique to mcp-use)
- Production-ready tool definitions with Zod schemas
- Real-world code analysis use case

## ✨ Features

- **4 Analysis Tools:**
  - `analyze_code_safety` - Scan for dangerous patterns
  - `get_best_practices` - Language-specific recommendations
  - `compare_code_safety` - Compare two code snippets
  - `batch_analyze` - Analyze multiple files at once

- **3 Languages Supported:** JavaScript, Python, TypeScript

- **Auto-Inspector:** Built-in web UI at `http://localhost:3000/inspector`

- **Severity Levels:** CRITICAL, HIGH, MEDIUM, LOW

## 🚀 Installation
```bash
# Install dependencies
npm install

# Copy .env if needed
cp .env.example .env
```

## 💻 Usage

### Start the Server
```bash
npm start
```

Server starts at `http://localhost:3000`
Inspector at `http://localhost:3000/inspector`

### Use the Inspector

1. Open http://localhost:3000/inspector in your browser
2. Test tools interactively with the web UI
3. See real-time tool execution and results

### Example Tool Calls

**Analyze code safety:**
```json
{
  "code": "eval(userInput)",
  "language": "javascript",
  "strict": true
}
```

**Get best practices:**
```json
{
  "language": "python",
  "category": "security"
}
```

**Compare code:**
```json
{
  "code1": "eval(data)",
  "code2": "JSON.parse(data)",
  "language": "javascript"
}
```

## 🏗️ Architecture
```
MCP Client → [HTTP/SSE] → Code Analysis Server → Analysis Engine
                                    ↓
                            Auto-Inspector UI
```

## 🔧 Tech Stack

- **mcp-use/server**: Server framework with auto-inspector
- **Zod**: Schema validation
- **TypeScript**: Type-safe implementation
- **Pattern Matching**: Security vulnerability detection

## 📊 Detection Capabilities

### JavaScript
- Code injection (eval, Function)
- XSS vulnerabilities (innerHTML, dangerouslySetInnerHTML)
- DOM manipulation risks

### Python
- Code execution (eval, exec)
- Shell injection (os.system)
- Dynamic imports

### TypeScript
- Type safety bypasses (any, @ts-ignore)
- Same JavaScript vulnerabilities

## 🎓 What I Learned

- Building production MCP servers with mcp-use
- The power of auto-inspector for debugging
- Zod schema validation for tool inputs
- Creating reusable code analysis patterns

## 📚 Citation

If you use this project or mcp-use in your research or work, please cite:

@software{mcp_use2025,
  author = {Zullo, Pietro and Contributors},
  title = {MCP-Use: Complete MCP Ecosystem for Python and TypeScript},
  year = {2025},
  publisher = {GitHub},
  url = {https://github.com/mcp-use/mcp-use}
}

## 🔗 Related Projects

- [Project 1: Terminal Safety Analyzer](https://github.com/dbustosjr/terminal-safety-analyzer) - Python + MCPAgent
- [Project 2: Multi-Server Orchestrator](https://github.com/dbustosjr/multi-server-orchestrator) - TypeScript + MCPClient
- This Project: Custom MCP Server with mcp-use framework

## 📝 License

MIT
