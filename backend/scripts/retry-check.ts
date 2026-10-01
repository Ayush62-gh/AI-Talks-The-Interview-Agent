import { generateWithRetry } from '../src/providers/gemini.provider.js';

(global as any).setTimeout = (cb: any) => cb();

import { generateWithRetry } from '../src/providers/gemini.provider.js';

(global as any).setTimeout = (cb: any) => cb();
let timeOffset = 0;
const originalDateNow = Date.now;
Date.now = () => originalDateNow() + timeOffset;

class FakeClient {
  public callCount = 0;
  public modelsUsed: string[] = [];
  
  constructor(private plan: (attempt: number, model: string) => any) {
    this.models = {
      generateContent: async (args: any) => {
        this.callCount++;
        this.modelsUsed.push(args.model);
        return this.plan(this.callCount, args.model);
      }
    };
  }
  public models: any;
}

async function runTests() {
  console.log('--- Test 1: 503 twice on primary, then success ---');
  timeOffset = 0;
  let client1 = new FakeClient((attempt, model) => {
    if (attempt <= 2) throw { status: 503 };
    return { text: 'success' };
  });
  let res1 = await generateWithRetry(client1 as any, 'prompt', 'primary-model', {});
  console.log(`Result: ${res1.text}, Calls: ${client1.callCount}`);
  if (client1.callCount !== 3 || client1.modelsUsed[2] !== 'primary-model') throw new Error('Test 1 failed');

  console.log('\n--- Test 2: 503 on all primary attempts, success on fallback ---');
  timeOffset = 0;
  let client2 = new FakeClient((attempt, model) => {
    // 3 primary attempts (initial + 2 retries) -> then fallback
    if (model === 'primary-model') throw { status: 503 };
    return { text: 'fallback-success' };
  });
  let res2 = await generateWithRetry(client2 as any, 'prompt', 'primary-model', {});
  console.log(`Result: ${res2.text}, Calls: ${client2.callCount}, Models used: ${client2.modelsUsed.join(', ')}`);
  if (client2.modelsUsed[client2.modelsUsed.length - 1] === 'primary-model') throw new Error('Test 2 failed');

  console.log('\n--- Test 3: 429 on primary -> only 2 primary calls, then fallback ---');
  timeOffset = 0;
  let client3 = new FakeClient((attempt, model) => {
    if (model === 'primary-model') throw { status: 429 };
    return { text: 'fallback-success' };
  });
  let res3 = await generateWithRetry(client3 as any, 'prompt', 'primary-model', {});
  console.log(`Result: ${res3.text}, Calls: ${client3.callCount}`);
  if (client3.callCount !== 3 || client3.modelsUsed[2] === 'primary-model') throw new Error('Test 3 failed');

  console.log('\n--- Test 4: 401 -> 1 call, no retry ---');
  timeOffset = 0;
  let client4 = new FakeClient(() => { throw { status: 401 }; });
  try {
    await generateWithRetry(client4 as any, 'prompt', 'primary-model', {});
    throw new Error('Test 4 should have thrown immediately');
  } catch (err: any) {
    console.log(`Thrown status: ${err.status}, Calls: ${client4.callCount}`);
    if (client4.callCount !== 1) throw new Error('Test 4 failed');
  }

  console.log('\n--- Test 5: 404 on fallback -> throws with clear message ---');
  timeOffset = 0;
  let client5 = new FakeClient((attempt, model) => {
    if (model === 'primary-model') throw { status: 503 };
    throw { status: 404, message: 'Not found' };
  });
  try {
    await generateWithRetry(client5 as any, 'prompt', 'primary-model', {});
    throw new Error('Test 5 should have thrown');
  } catch (err: any) {
    console.log(`Thrown status: ${err.status}, Calls: ${client5.callCount}`);
    if (err.status !== 404) throw new Error('Test 5 failed');
  }

  console.log('\n--- Test 6: all fail with 503 -> timeout cap ---');
  timeOffset = 0;
  let client6 = new FakeClient(() => { 
    timeOffset += 10000; // Jump 10s per call
    throw { status: 503 }; 
  });
  try {
    await generateWithRetry(client6 as any, 'prompt', 'primary-model', {});
    throw new Error('Test 6 should have thrown');
  } catch (err: any) {
    console.log(`Thrown message: ${err.message}, Calls: ${client6.callCount}`);
    if (!err.message.includes('cap reached')) throw new Error('Test 6 failed');
  }

  console.log('\nALL TESTS PASSED');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
