#!/usr/bin/env node

/**
 * Context Analyzer Hook - Pre-prompt analysis for better AI assistance
 * Analyzes the current project context and provides relevant information
 */

import { readFile, access, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '../../');

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function analyzeProjectContext() {
  const context = {
    timestamp: new Date().toISOString(),
    project: 'Fourmi Financial Copilot',
    changes: [],
    relevantDocs: [],
    warnings: []
  };

  try {
    // Check recent changes in meta directory
    const metaDir = join(projectRoot, 'docs/meta');
    if (await fileExists(metaDir)) {
      const files = await readdir(metaDir);
      const changelogFiles = files.filter(f => f.includes('changes.md') || f === 'CHANGELOG.md');
      
      for (const file of changelogFiles) {
        try {
          const content = await readFile(join(metaDir, file), 'utf-8');
          const lines = content.split('\n').slice(0, 10); // First 10 lines
          context.changes.push({
            file: file,
            recentChanges: lines.filter(line => line.includes('2025-01-13')).slice(0, 3)
          });
        } catch (e) {
          // Ignore individual file errors
        }
      }
    }

    // Check if we're in a specific documentation area
    const cwd = process.cwd();
    if (cwd.includes('/docs/')) {
      const docType = cwd.split('/docs/')[1]?.split('/')[0];
      if (docType) {
        context.relevantDocs.push(`Currently in ${docType} documentation area`);
        
        // Suggest relevant documentation
        const docReadme = join(projectRoot, `docs/${docType}/README.md`);
        if (await fileExists(docReadme)) {
          context.relevantDocs.push(`See docs/${docType}/README.md for navigation`);
        }
      }
    }

    // Check for common setup issues
    const packageJson = join(projectRoot, 'package.json');
    if (await fileExists(packageJson)) {
      const pkg = JSON.parse(await readFile(packageJson, 'utf-8'));
      if (pkg.name === 'bun-react-template') {
        context.warnings.push('Package.json still has template name - needs Next.js migration');
      }
      if (!pkg.scripts || Object.keys(pkg.scripts).length === 0) {
        context.warnings.push('No scripts defined in package.json - needs development setup');
      }
    }

    // Output context for Claude
    if (context.changes.length > 0 || context.relevantDocs.length > 0 || context.warnings.length > 0) {
      console.log('📋 Project Context Analysis:');
      
      if (context.warnings.length > 0) {
        console.log('⚠️  Setup Warnings:');
        context.warnings.forEach(warning => console.log(`   - ${warning}`));
      }
      
      if (context.relevantDocs.length > 0) {
        console.log('📖 Relevant Documentation:');
        context.relevantDocs.forEach(doc => console.log(`   - ${doc}`));
      }
      
      if (context.changes.length > 0) {
        console.log('📝 Recent Documentation Changes:');
        context.changes.forEach(change => {
          if (change.recentChanges.length > 0) {
            console.log(`   - ${change.file}: ${change.recentChanges.length} recent updates`);
          }
        });
      }
    }

  } catch (error) {
    console.log('⚠️  Context analysis failed:', error.message);
  }
}

// Run the analyzer
analyzeProjectContext().catch(console.error);
EOF < /dev/null