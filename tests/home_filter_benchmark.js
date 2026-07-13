import { MENU_ITEMS, MENU_CATEGORIES } from '../src/data/menu.js';

const ITERATIONS = 1000000;

function runBaseline() {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    const selectedCategory = MENU_CATEGORIES[i % MENU_CATEGORIES.length];
    const filteredItems = MENU_ITEMS.filter((item) => item.category === selectedCategory);
    const signatureDishes = MENU_ITEMS.filter((item) => item.isSignature);
  }
  const end = performance.now();
  return end - start;
}

console.log('Running baseline benchmark...');
const baselineTime = runBaseline();
console.log(`Baseline time for ${ITERATIONS} iterations: ${baselineTime.toFixed(2)}ms`);
console.log(`Average time per render: ${(baselineTime / ITERATIONS).toFixed(6)}ms`);
