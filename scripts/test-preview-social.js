#!/usr/bin/env node

/**
 * Test script to verify social media meta tags on the preview site
 */

const previewUrl = 'https://ambitious-wave-0d77c1c10-18.centralus.6.azurestaticapps.net';

console.log('🧪 Testing Social Media Integration on Preview Site');
console.log('==================================================\n');

console.log('📋 Preview Site URLs to Test:');
console.log(`🏠 Homepage: ${previewUrl}/`);
console.log(`📝 Blog Post: ${previewUrl}/confidence-engineering-pt1/`);
console.log(`🖼️  Social Image: ${previewUrl}/img/social-share-default.png`);
console.log('');

console.log('🔧 Manual Testing Steps:');
console.log('');

console.log('1. 📊 Test Image Headers:');
console.log(`   curl -I ${previewUrl}/img/social-share-default.png`);
console.log('   ✅ Should show: content-type: image/png');
console.log('');

console.log('2. 🌐 Facebook Debugger:');
console.log('   Visit: https://developers.facebook.com/tools/debug/');
console.log(`   Test URL: ${previewUrl}/confidence-engineering-pt1/`);
console.log('   ✅ Should show image preview without "invalid content type" error');
console.log('');

console.log('3. 🐦 Twitter Card Validator:');
console.log('   Visit: https://cards-dev.twitter.com/validator');
console.log(`   Test URL: ${previewUrl}/confidence-engineering-pt1/`);
console.log('   ✅ Should show proper card preview');
console.log('');

console.log('4. 💼 LinkedIn Post Inspector:');
console.log('   Visit: https://www.linkedin.com/post-inspector/');
console.log(`   Test URL: ${previewUrl}/confidence-engineering-pt1/`);
console.log('   ✅ Should show proper preview');
console.log('');

console.log('🎯 Expected Results:');
console.log('- ✅ Image serves with Content-Type: image/png');
console.log('- ✅ Facebook debugger processes image successfully');
console.log('- ✅ All social platforms show proper previews');
console.log('- ✅ No "invalid content type" errors');
console.log('');

console.log('🚀 If tests pass, the fix is working and ready to merge!');