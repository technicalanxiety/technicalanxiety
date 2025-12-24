#!/usr/bin/env node

/**
 * Script to get the correct Giscus configuration for the repository
 * Run this script and follow the instructions to get your Giscus config
 */

console.log('🔧 Giscus Configuration Helper');
console.log('================================\n');

console.log('Your repository is now public! Here\'s how to get the correct Giscus configuration:\n');

console.log('1. 📋 Repository Information:');
console.log('   Repository: technicalanxiety/technicalanxiety');
console.log('   Status: ✅ Public');
console.log('   Discussions: ✅ Enabled\n');

console.log('2. 🌐 Get Configuration:');
console.log('   Visit: https://giscus.app/');
console.log('   Enter repository: technicalanxiety/technicalanxiety');
console.log('   Choose mapping: "Discussion title contains page pathname"');
console.log('   Select category: "General" (or create "Comments" category)\n');

console.log('3. 📝 Update Configuration:');
console.log('   Copy the generated data-repo-id and data-category-id');
console.log('   Update src/config.ts with the new values\n');

console.log('4. 🧪 Test:');
console.log('   Deploy the site and visit a blog post');
console.log('   Comments should appear at the bottom\n');

console.log('Current configuration in src/config.ts:');
console.log('giscus: {');
console.log('  repo: \'technicalanxiety/technicalanxiety\',');
console.log('  repoId: \'R_kgDONZGJJw\', // ← Update this');
console.log('  category: \'Comments\',');
console.log('  categoryId: \'DIC_kwDONZGJJ84CkwJF\', // ← Update this');
console.log('},\n');

console.log('💡 Tip: The repo name is already correct, you just need the new IDs!');