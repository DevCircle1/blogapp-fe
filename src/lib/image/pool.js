/**
 * A small pool of conversion workers. Size follows the CPU count (leaving one
 * core for the page) and is kept low on phones, where memory, not CPU, is what
 * a batch of photos runs out of. Each task resolves or rejects on its own, so
 * one bad file never stops the rest.
 */
export const isMobile = () => typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export function poolSize() {
  const cores = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4;
  return isMobile() ? Math.min(2, Math.max(1, cores - 1)) : Math.min(6, Math.max(1, cores - 1));
}

export class ConvertPool {
  constructor(size = poolSize()) {
    this.size = size;
    this.workers = [];
    this.idle = [];
    this.queue = [];
    this.nextId = 1;
    this.pending = new Map();
  }

  spawn() {
    const worker = new Worker(new URL('./convert.worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (event) => {
      const message = event.data;
      const task = this.pending.get(message.id);
      if (!task) return;
      this.pending.delete(message.id);
      this.idle.push(worker);
      if (message.type === 'done') task.resolve(message); else task.reject(Object.assign(new Error(message.message || 'failed'), { code: message.code }));
      this.pump();
    };
    worker.onerror = (event) => {
      // A crash (usually out of memory) fails the running task and retires the worker.
      const entry = [...this.pending.entries()].find(([, task]) => task.worker === worker);
      if (entry) { this.pending.delete(entry[0]); entry[1].reject(Object.assign(new Error(event.message || 'worker crashed'), { code: 'CRASH' })); }
      this.workers = this.workers.filter((w) => w !== worker);
      this.pump();
    };
    this.workers.push(worker);
    return worker;
  }

  pump() {
    while (this.queue.length) {
      const worker = this.idle.pop() || (this.workers.length < this.size ? this.spawn() : null);
      if (!worker) return;
      const task = this.queue.shift();
      if (task.cancelled) { this.idle.push(worker); continue; }
      task.worker = worker;
      this.pending.set(task.id, task);
      task.onStart?.();
      worker.postMessage({ id: task.id, file: task.file, name: task.name, options: task.options });
    }
  }

  run(file, name, options, onStart) {
    return new Promise((resolve, reject) => {
      const task = { id: this.nextId, file, name, options, onStart, resolve, reject };
      this.nextId += 1;
      this.queue.push(task);
      this.pump();
    });
  }

  cancelQueued() { this.queue.forEach((task) => { task.cancelled = true; task.reject(Object.assign(new Error('cancelled'), { code: 'CANCELLED' })); }); this.queue = []; }

  terminate() { this.workers.forEach((w) => w.terminate()); this.workers = []; this.idle = []; this.queue = []; }
}
