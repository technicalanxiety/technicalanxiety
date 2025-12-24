#!/usr/bin/env node

/**
 * Debug script to check homepage meta tags
 */

console.log('🔍 Debugging Homepage Meta Tags');
console.log('================================\n');

console.log('📋 Expected Meta Tags for Homepage:');
console.log('');
console.log('<meta property="og:type" content="website" />');
console.log('<meta property="og:title" content="Technical Anxiety | Experience Blog" />');
console.log('<meta property="og:description" content="A technical blog covering Azure, Log Analytics, leadership, and navigating anxiety in tech. Cloud architecture insights, leadership lessons, and mental health in tech." />');
console.log('<meta property="og:image" content="https://ambitious-wave-0d77c1c10-18.centralus.6.azurestaticapps.net/img/social-share-default.png" />');
console.log('<meta property="og:image:width" content="1200" />');
console.log('<meta property="og:image:height" content="630" />');
console.log('<meta property="og:image:type" content="image/png" />');
console.log('');

console.log('🧪 Manual Testing Steps:');
console.log('');
console.log('1. 📊 Verify Image Serves Correctly:');
console.log('   curl -I https://ambitious-wave-0d77c1c10-18.centralus.6.azurestaticapps.net/img/social-share-default.png');
console.log('   ✅ Should return: content-type: image/png');
console.log('');

console.log('2. 🌐 Facebook Debugger:');
console.log('   - Visit: https://developers.facebook.com/tools/debug/');
console.log('   - Enter: https://ambitious-wave-0d77c1c10-18.centralus.6.azurestaticapps.net/');
console.log('   - Click "Debug"');
console.log('   - If no image, click "Scrape Again"');
console.log('   - Wait 30 seconds and try "Scrape Again" once more');
console.log('');

console.log('3. 🔄 If Still No Image:');
console.log('   - Check if Azure deployment is still in progress');
console.log('   - Try a different browser/incognito mode');
console.log('   - Wait 2-3 minutes for full deployment');
console.log('   - Test a blog post URL to confirm the fix is working there');
console.log('');

console.log('4. 🎯 Expected Results:');
console.log('   - ✅ Homepage shows social share image');
console.log('   - ✅ Blog posts show social share image');
console.log('   - ✅ No "invalid content type" errors');
console.log('');

console.log('💡 Note: Azure Static Web Apps can take 2-3 minutes to fully deploy changes.');
console.log('If the image URL works directly but not in Facebook debugger, try waiting a bit longer.');