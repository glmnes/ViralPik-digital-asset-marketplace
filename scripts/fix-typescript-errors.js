const fs = require('fs');
const path = require('path');

// Map of files and their specific fixes
const fixes = {
  'app/admin/page.tsx': [
    { search: /\.reduce\(\(sum, asset\) =>/g, replace: '.reduce((sum: number, asset: any) =>' }
  ],
  'app/collection/[id]/page.tsx': [
    { search: /useState<any>/g, replace: 'useState<any>' }, // Keep any for now
    { search: /\.map\(ca => ca\./g, replace: '.map((ca: any) => ca.' }
  ],
  'app/contributor/analytics/page.tsx': [
    { search: /assets\.reduce\(\(sum, a\) =>/g, replace: 'assets.reduce((sum: number, a: any) =>' },
    { search: /assets\s*\n?\s*\.sort\(\(a, b\) =>/g, replace: 'assets\n          .sort((a: any, b: any) =>' },
    { search: /\.map\(asset =>/g, replace: '.map((asset: any) =>' },
    { search: /assets\.forEach\(asset =>/g, replace: 'assets.forEach((asset: any) =>' }
  ],
  'app/contributor/assets/page.tsx': [
    { search: /assets\.reduce\(\(sum, a\) =>/g, replace: 'assets.reduce((sum: number, a: any) =>' }
  ],
  'app/contributor/earnings/page.tsx': [
    { search: /assets\.forEach\(asset =>/g, replace: 'assets.forEach((asset: any) =>' }
  ],
  'app/contributor/page.tsx': [
    { search: /assets\?\.reduce\(\(sum, asset\) =>/g, replace: 'assets?.reduce((sum: number, asset: any) =>' },
    { search: /assets\?\.filter\(a => a\./g, replace: 'assets?.filter((a: any) => a.' },
    { search: /assets\?\.map\(a => a\./g, replace: 'assets?.map((a: any) => a.' },
    { search: /recentDownloads\?\.filter\(d =>/g, replace: 'recentDownloads?.filter((d: any) =>' }
  ],
  'app/contributor/upload/page.tsx': [
    { search: /onChange=\{handleFileSelect as any\}/g, replace: 'onChange={handleFileSelect as any}' }
  ],
  'app/explore/ads/page.tsx': [
    { search: /\.map\(asset =>/g, replace: '.map((asset: any) =>' }
  ],
  'app/explore/motion/page.tsx': [
    { search: /\.map\(asset =>/g, replace: '.map((asset: any) =>' }
  ],
  'app/explore/posts/page.tsx': [
    { search: /\.map\(asset =>/g, replace: '.map((asset: any) =>' }
  ],
  'app/explore/reels/page.tsx': [
    { search: /\.map\(asset =>/g, replace: '.map((asset: any) =>' }
  ],
  'app/explore/stories/page.tsx': [
    { search: /\.map\(asset =>/g, replace: '.map((asset: any) =>' }
  ],
  'app/explore/thumbnails/page.tsx': [
    { search: /\.map\(asset =>/g, replace: '.map((asset: any) =>' }
  ],
  'app/explore/[category]/page.tsx': [
    { search: /\.map\(asset =>/g, replace: '.map((asset: any) =>' }
  ],
  'app/explore/tag/[tag]/page.tsx': [
    { search: /\.map\(asset =>/g, replace: '.map((asset: any) =>' }
  ],
  'app/page.tsx': [
    { search: /\.map\(a => a\./g, replace: '.map((a: any) => a.' },
    { search: /\.filter\(url => url/g, replace: '.filter((url: string) => url' }
  ],
  'app/profile/[username]/page.tsx': [
    { search: /createdAssets\?\.reduce\(\(sum, asset\) =>/g, replace: 'createdAssets?.reduce((sum: number, asset: any) =>' }
  ],
  'components/SaveModal.tsx': [
    { search: /existingSaves\.map\(s => s\./g, replace: 'existingSaves.map((s: any) => s.' },
    { search: /existingSaves\?\.map\(s => s\./g, replace: 'existingSaves?.map((s: any) => s.' },
    { search: /existingCollectionIds\.filter\(id =>/g, replace: 'existingCollectionIds.filter((id: string) =>' },
    { search: /selectedCollections\.filter\(id =>/g, replace: 'selectedCollections.filter((id: string) =>' },
    { search: /toAdd\.map\(collectionId =>/g, replace: 'toAdd.map((collectionId: string) =>' }
  ],
  'contexts/AuthContext.tsx': [
    { search: /\.then\(\(\{ data: \{ session \} \}\) =>/g, replace: '.then(({ data: { session } }: any) =>' },
    { search: /onAuthStateChange\(\(_event, session\) =>/g, replace: 'onAuthStateChange((_event: any, session: any) =>' }
  ]
};

// Process each file
Object.entries(fixes).forEach(([filePath, replacements]) => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  replacements.forEach(({ search, replace }) => {
    const originalContent = content;
    content = content.replace(search, replace);
    if (content !== originalContent) {
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
});

console.log('\n🎉 TypeScript error fixes applied!');
