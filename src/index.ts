/**
 * Code Analysis MCP Server
 * Analyzes code for safety patterns, best practices, and potential issues
 * Built with mcp-use server framework
 */

import { MCPServer, text } from 'mcp-use/server'
import { z } from 'zod'

// Safety patterns database
const DANGEROUS_PATTERNS = {
  javascript: [
    { pattern: 'eval(', severity: 'CRITICAL', description: 'Code injection risk' },
    { pattern: 'Function(', severity: 'CRITICAL', description: 'Dynamic code execution' },
    { pattern: 'innerHTML =', severity: 'HIGH', description: 'XSS vulnerability' },
    { pattern: 'document.write(', severity: 'HIGH', description: 'DOM manipulation risk' },
    { pattern: 'dangerouslySetInnerHTML', severity: 'HIGH', description: 'React XSS risk' }
  ],
  python: [
    { pattern: 'eval(', severity: 'CRITICAL', description: 'Code injection risk' },
    { pattern: 'exec(', severity: 'CRITICAL', description: 'Arbitrary code execution' },
    { pattern: '__import__(', severity: 'HIGH', description: 'Dynamic imports' },
    { pattern: 'os.system(', severity: 'HIGH', description: 'Shell command execution' },
    { pattern: 'subprocess.call(', severity: 'MEDIUM', description: 'Subprocess execution' }
  ],
  typescript: [
    { pattern: 'eval(', severity: 'CRITICAL', description: 'Code injection risk' },
    { pattern: 'Function(', severity: 'CRITICAL', description: 'Dynamic code execution' },
    { pattern: 'any as', severity: 'MEDIUM', description: 'Type safety bypass' },
    { pattern: '@ts-ignore', severity: 'LOW', description: 'TypeScript error suppression' }
  ]
}

const BEST_PRACTICES = {
  javascript: [
    'Use const/let instead of var',
    'Avoid global variables',
    'Use strict mode',
    'Validate all user input',
    'Use Content Security Policy'
  ],
  python: [
    'Use virtual environments',
    'Type hints for function signatures',
    'Avoid bare except clauses',
    'Use with statements for resources',
    'Follow PEP 8 style guide'
  ],
  typescript: [
    'Enable strict mode in tsconfig',
    'Avoid any type',
    'Use interfaces for object shapes',
    'Enable noImplicitAny',
    'Use readonly for immutable data'
  ]
}

// Create MCP server
const server = new MCPServer({
  name: 'code-analysis-server',
  version: '1.0.0',
  description: 'Analyzes code for safety patterns, vulnerabilities, and best practices'
})

// Tool 1: Analyze code safety
server.tool({
  name: 'analyze_code_safety',
  description: 'Scan code for dangerous patterns and security vulnerabilities',
  schema: z.object({
    code: z.string().describe('The code to analyze'),
    language: z.enum(['javascript', 'python', 'typescript']).describe('Programming language'),
    strict: z.boolean().optional().describe('Enable strict analysis mode')
  })
}, async ({ code, language, strict = false }) => {
  const patterns = DANGEROUS_PATTERNS[language] || []
  const findings: Array<{pattern: string, severity: string, description: string, line?: number}> = []

  // Scan for dangerous patterns
  const lines = code.split('\n')
  lines.forEach((line, index) => {
    patterns.forEach(({ pattern, severity, description }) => {
      if (line.includes(pattern)) {
        findings.push({
          pattern,
          severity,
          description,
          line: index + 1
        })
      }
    })
  })

  // Generate report
  let report = `# Code Safety Analysis Report\n\n`
  report += `**Language:** ${language}\n`
  report += `**Lines analyzed:** ${lines.length}\n`
  report += `**Strict mode:** ${strict ? 'Enabled' : 'Disabled'}\n\n`

  if (findings.length === 0) {
    report += `✅ **Result:** No dangerous patterns detected\n\n`
    report += `The code appears safe from common security vulnerabilities.\n`
  } else {
    report += `⚠️ **Result:** ${findings.length} issue(s) found\n\n`

    const critical = findings.filter(f => f.severity === 'CRITICAL')
    const high = findings.filter(f => f.severity === 'HIGH')
    const medium = findings.filter(f => f.severity === 'MEDIUM')
    const low = findings.filter(f => f.severity === 'LOW')

    report += `**Severity Breakdown:**\n`
    if (critical.length > 0) report += `- 🔴 CRITICAL: ${critical.length}\n`
    if (high.length > 0) report += `- 🟠 HIGH: ${high.length}\n`
    if (medium.length > 0) report += `- 🟡 MEDIUM: ${medium.length}\n`
    if (low.length > 0) report += `- 🟢 LOW: ${low.length}\n`
    report += `\n## Detailed Findings:\n\n`

    findings.forEach((finding, index) => {
      report += `### ${index + 1}. [${finding.severity}] ${finding.pattern}\n`
      report += `- **Description:** ${finding.description}\n`
      report += `- **Line:** ${finding.line}\n`
      report += `- **Recommendation:** Review and replace with safer alternative\n\n`
    })
  }

  return text(report)
})

// Tool 2: Get best practices
server.tool({
  name: 'get_best_practices',
  description: 'Get language-specific best practices and recommendations',
  schema: z.object({
    language: z.enum(['javascript', 'python', 'typescript']).describe('Programming language'),
    category: z.enum(['security', 'performance', 'maintainability', 'all']).optional()
      .describe('Category of best practices')
  })
}, async ({ language, category = 'all' }) => {
  const practices = BEST_PRACTICES[language] || []

  let report = `# ${language.toUpperCase()} Best Practices\n\n`
  report += `**Category:** ${category}\n\n`

  practices.forEach((practice, index) => {
    report += `${index + 1}. ${practice}\n`
  })

  report += `\n---\n`
  report += `💡 **Tip:** Following these practices will improve code quality, security, and maintainability.\n`

  return text(report)
})

// Tool 3: Compare code snippets
server.tool({
  name: 'compare_code_safety',
  description: 'Compare safety of two code snippets',
  schema: z.object({
    code1: z.string().describe('First code snippet'),
    code2: z.string().describe('Second code snippet'),
    language: z.enum(['javascript', 'python', 'typescript']).describe('Programming language')
  })
}, async ({ code1, code2, language }) => {
  const patterns = DANGEROUS_PATTERNS[language] || []

  const analyze = (code: string) => {
    return patterns.filter(({ pattern }) => code.includes(pattern)).length
  }

  const issues1 = analyze(code1)
  const issues2 = analyze(code2)

  let report = `# Code Safety Comparison\n\n`
  report += `**Language:** ${language}\n\n`
  report += `## Snippet 1:\n`
  report += `- Issues found: ${issues1}\n`
  report += `- Safety rating: ${issues1 === 0 ? '✅ Safe' : '⚠️ Has issues'}\n\n`
  report += `## Snippet 2:\n`
  report += `- Issues found: ${issues2}\n`
  report += `- Safety rating: ${issues2 === 0 ? '✅ Safe' : '⚠️ Has issues'}\n\n`
  report += `## Recommendation:\n`

  if (issues1 < issues2) {
    report += `✅ **Snippet 1 is safer** - Use this approach\n`
  } else if (issues2 < issues1) {
    report += `✅ **Snippet 2 is safer** - Use this approach\n`
  } else if (issues1 === 0 && issues2 === 0) {
    report += `✅ **Both snippets are safe** - Choose based on other factors\n`
  } else {
    report += `⚠️ **Both snippets have issues** - Refactor both\n`
  }

  return text(report)
})

// Tool 4: Batch analyze files
server.tool({
  name: 'batch_analyze',
  description: 'Analyze multiple code files at once',
  schema: z.object({
    files: z.array(z.object({
      filename: z.string(),
      code: z.string(),
      language: z.enum(['javascript', 'python', 'typescript'])
    })).describe('Array of files to analyze')
  })
}, async ({ files }) => {
  let report = `# Batch Analysis Report\n\n`
  report += `**Files analyzed:** ${files.length}\n\n`

  let totalIssues = 0
  const results: Array<{filename: string, issues: number, severity: string}> = []

  files.forEach(({ filename, code, language }) => {
    const patterns = DANGEROUS_PATTERNS[language] || []
    const issues = patterns.filter(({ pattern }) => code.includes(pattern)).length

    totalIssues += issues

    let severity = 'SAFE'
    if (issues > 0) severity = 'LOW'
    if (issues > 2) severity = 'MEDIUM'
    if (issues > 5) severity = 'HIGH'

    results.push({ filename, issues, severity })
  })

  report += `**Total issues found:** ${totalIssues}\n\n`
  report += `## File-by-File Results:\n\n`

  results.forEach(({ filename, issues, severity }) => {
    const emoji = severity === 'SAFE' ? '✅' : severity === 'LOW' ? '🟡' : severity === 'MEDIUM' ? '🟠' : '🔴'
    report += `${emoji} **${filename}** - ${issues} issue(s) [${severity}]\n`
  })

  report += `\n---\n`
  report += `💡 **Next steps:** Focus on files with HIGH or MEDIUM severity first.\n`

  return text(report)
})

// Start server with auto-inspector
const PORT = 3000
server.listen(PORT)

console.log(`🚀 Code Analysis MCP Server running!`)
console.log(`📊 Inspector available at: http://localhost:${PORT}/inspector`)
console.log(`🔧 4 analysis tools available`)
console.log(`\nTools:`)
console.log(`  1. analyze_code_safety    - Scan for vulnerabilities`)
console.log(`  2. get_best_practices      - Language-specific recommendations`)
console.log(`  3. compare_code_safety     - Compare two code snippets`)
console.log(`  4. batch_analyze          - Analyze multiple files`)
