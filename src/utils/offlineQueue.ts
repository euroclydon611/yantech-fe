import { BaseQueryApi } from "@reduxjs/toolkit/query";

export interface QueuedRequest {
  id: string;
  args: any;
  timestamp: number;
}

class OfflineQueue {
  private queue: QueuedRequest[] = [];
  private STORAGE_KEY = "offline_request_queue";
  private isProcessing = false;

  constructor() {
    this.loadFromStorage();
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.processQueue());
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.queue = JSON.parse(saved);
      }
    } catch (e) {
      this.queue = [];
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
  }

  /**
   * Adds a request to the queue
   */
  add(args: any) {
    // Only queue mutations (POST, PUT, PATCH, DELETE)
    // We generally don't want to queue GET requests as they are for reading data
    const method = typeof args === 'string' ? 'GET' : (args.method || 'GET').toUpperCase();
    if (method === 'GET') return;

    const request: QueuedRequest = {
      id: Math.random().toString(36).substring(7),
      args,
      timestamp: Date.now(),
    };
    
    // Avoid duplicates if needed (simple check by args stringification)
    const argsStr = JSON.stringify(args);
    const isDuplicate = this.queue.some(q => JSON.stringify(q.args) === argsStr);
    
    if (!isDuplicate) {
      this.queue.push(request);
      this.saveToStorage();
    }
  }

  /**
   * Processes the queue by retrying requests
   * This is meant to be called by the baseQuery or when online
   */
  async processQueue(baseQuery?: any, api?: BaseQueryApi) {
    if (this.isProcessing || this.queue.length === 0 || !navigator.onLine) return;

    this.isProcessing = true;
    const remainingQueue: QueuedRequest[] = [];

    for (const request of this.queue) {
      if (!navigator.onLine) {
        remainingQueue.push(request);
        continue;
      }

      try {
        if (baseQuery && api) {
          // If we have access to the baseQuery, we can actually execute the request
          await baseQuery(request.args, api, {});
        } else {
          // If called without baseQuery (like from event listener), 
          // we might need a different way to trigger these or wait for the next real request
          // For now, we'll keep them in queue until a real request triggers processQueue with context
          remainingQueue.push(request);
          continue;
        }
      } catch (error) {
        // If it fails again, keep it in queue for next time
        remainingQueue.push(request);
      }
    }

    this.queue = remainingQueue;
    this.saveToStorage();
    this.isProcessing = false;
  }

  getQueue() {
    return this.queue;
  }
}

export const offlineQueue = new OfflineQueue();
export default offlineQueue;
