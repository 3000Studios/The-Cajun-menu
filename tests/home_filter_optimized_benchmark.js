import { MENU_ITEMS, MENU_CATEGORIES } from '../src/data/menu.js';

const ITERATIONS = 1000000;

const signatureDishes = MENU_ITEMS.filter((item) => item.isSignature);

function runOptimized() {
  const start = performance.now();
  const memoCache = new Map();
  let currentCategory = null;
  let currentFilteredItems = null;

  for (let i = 0; i < ITERATIONS; i++) {
    const selectedCategory = MENU_CATEGORIES[i % MENU_CATEGORIES.length];

    // Simulating useMemo for filteredItems
    if (selectedCategory !== currentCategory) {
      if (memoCache.has(selectedCategory)) {
        currentFilteredItems = memoCache.get(selectedCategory);
      } else {
        currentFilteredItems = MENU_ITEMS.filter((item) => item.category === selectedCategory);
        memoCache.set(selectedCategory, currentFilteredItems);
      }
      currentCategory = selectedCategory;
    }

    // signatureDishes is already outside and not recalculated
    const items = currentFilteredItems;
    const sig = signatureDishes;
  }
  const end = performance.now();
  return end - start;
}

console.log('Running optimized benchmark (simulating useMemo and hoisted constant)...');
const optimizedTime = runOptimized();
console.log(`Optimized time for ${ITERATIONS} iterations: ${optimizedTime.toFixed(2)}ms`);
console.log(`Average time per render: ${(optimizedTime / ITERATIONS).toFixed(6)}ms`);
