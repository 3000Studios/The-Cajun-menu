const MENU_ITEMS = [
  { id: 'app1', name: 'Creamy Crab Dip', description: 'House made silky crab dip infused with Old Bay seasoning and real lump crab meat.', category: 'Appetizers', isSignature: true },
  { id: 'app6', name: 'Smoked Sausage Boudin Balls', description: 'Crispy boudin croquettes with smoky andouille and creamy rice.', category: 'Appetizers', isSignature: false },
  // ... adding a few more for realistic filtering
  { id: 'main2', name: 'King’s Crab Boil', description: 'A feast fit for royalty: Two large clusters of Snow Crab, jumbo shrimp.', category: 'Main Courses', isSignature: true },
  { id: 'main3', name: 'Seafood Gumbo Bowl', description: 'A deep, dark roux perfected over generations.', category: 'Main Courses', isSignature: true },
];

const category = 'Seafood';
const query = 'shrimp';

function originalFilter() {
  const q = query.toLowerCase();
  return MENU_ITEMS.filter((item) => {
    if (category === 'Signature' && !item.isSignature) return false;
    if (category === 'Appetizers' && item.category !== 'Appetizers') return false;
    if (category === 'Seafood') {
      const seafoodRegex = /(shrimp|crab|crawfish|oyster|seafood|boil|gumbo)/i;
      if (!seafoodRegex.test(`${item.name} ${item.description}`)) return false;
    }
    if (q && !`${item.name} ${item.description}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

const SEAFOOD_REGEX = /(shrimp|crab|crawfish|oyster|seafood|boil|gumbo)/i;
const MENU_ITEMS_WITH_SEARCH = MENU_ITEMS.map(item => ({
    ...item,
    searchStr: `${item.name} ${item.description}`.toLowerCase()
}));

function optimizedFilter() {
  const q = query.toLowerCase();
  return MENU_ITEMS_WITH_SEARCH.filter((item) => {
    if (category === 'Signature' && !item.isSignature) return false;
    if (category === 'Appetizers' && item.category !== 'Appetizers') return false;
    if (category === 'Seafood') {
      if (!SEAFOOD_REGEX.test(item.searchStr)) return false;
    }
    if (q && !item.searchStr.includes(q)) return false;
    return true;
  });
}

const ITERATIONS = 1000000;

console.log('Running benchmark...');

const startOriginal = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  originalFilter();
}
const endOriginal = performance.now();

const startOptimized = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  optimizedFilter();
}
const endOptimized = performance.now();

const originalTime = endOriginal - startOriginal;
const optimizedTime = endOptimized - startOptimized;

console.log(`Original: ${originalTime.toFixed(2)}ms`);
console.log(`Optimized: ${optimizedTime.toFixed(2)}ms`);
console.log(`Improvement: ${((originalTime / optimizedTime) - 1) * 100}%`);
