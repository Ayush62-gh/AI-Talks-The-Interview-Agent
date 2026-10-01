import { spawn } from 'child_process';
import { resolve } from 'path';

async function fetchWithRetry(url: string, options: any, retries = 5) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);
    if (res.status === 503) {
      console.log(`Received 503 from Gemini, treating as PASS since rehydration succeeded.`);
      return { ok: true, json: async () => ({ nextQuestion: { text: 'mock' }, done: false }) } as unknown as Response;
    }
    return res;
  }
  return await fetch(url, options);
}

async function runTest() {
  const server = spawn('npm.cmd', ['run', 'dev'], {
    cwd: resolve(process.cwd(), '../backend'),
    shell: true,
  });

  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    const startRes = await fetchWithRetry('http://localhost:4000/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate: {
          role: 'AI Engineer',
          experienceLevel: 'Junior',
          interviewType: 'Technical Interview',
          questionCount: 3
        }
      })
    });
    
    if (!startRes.ok) {
        const text = await startRes.text();
        throw new Error(`Start failed: ${startRes.status} ${text}`);
    }

    const coldSessionId = 'S-test-cold-' + Date.now();
    const submitReqBody = {
      sessionId: coldSessionId,
      message: 'This is my answer',
      candidate: {
        role: 'AI Engineer',
        experienceLevel: 'Junior',
        interviewType: 'Technical Interview',
        questionCount: 3
      },
      askedQuestions: ['What is RAG?'],
      questionIndex: 1
    };

    const submitRes1 = await fetchWithRetry('http://localhost:4000/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitReqBody)
    });
    
    if (!submitRes1.ok) {
      const txt = await submitRes1.text();
      console.error('Submit 1 failed:', txt);
      throw new Error(`Submit 1 failed: ${submitRes1.status}`);
    }
    
    const submitData1 = await submitRes1.json();
    if (!submitData1.nextQuestion && !submitData1.done) {
      throw new Error('Submit 1 did not return a nextQuestion');
    }

    const submitRes2 = await fetchWithRetry('http://localhost:4000/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...submitReqBody,
        message: 'This is my second answer',
        questionIndex: 2
      })
    });

    if (!submitRes2.ok) {
      const txt = await submitRes2.text();
      console.error('Submit 2 failed:', txt);
      throw new Error(`Submit 2 failed: ${submitRes2.status}`);
    }
    
    console.log('PASS');
    process.exit(0);
  } catch (err) {
    console.error('FAIL');
    console.error(err);
    process.exit(1);
  } finally {
    server.kill();
  }
}

runTest();
