import axios from 'axios';
import type { Reporter, FullConfig, Suite, TestCase, TestResult } from '@playwright/test/reporter';

type ReporterOptions = {
  slackWebhookUrl?: string;
  projectName?: string;
  maxFailures?: number;
};

export default class SlackReporter implements Reporter {
  private startTime = Date.now();
  private results: Array<{ test: TestCase; result: TestResult }> = [];
  private opts: ReporterOptions;

  constructor(options?: ReporterOptions) {
    this.opts = options || {};
    if (!this.opts.maxFailures) this.opts.maxFailures = 5;
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({ test, result });
  }

  async onEnd() {
    const totals = this.results.reduce(
      (acc, r) => {
        const status = r.result.status;
        acc.total += 1;
        if (status === 'passed') acc.passed += 1;
        else if (status === 'failed') acc.failed += 1;
        else if (status === 'skipped') acc.skipped += 1;
        else if (status === 'timedOut') acc.failed += 1;
        else acc.other += 1;
        return acc;
      },
      { total: 0, passed: 0, failed: 0, skipped: 0, other: 0 }
    );

    const durationMs = Date.now() - this.startTime;
    const duration = this.formatDuration(durationMs);

    const failures = this.results
      .filter((r) => r.result.status === 'failed')
      .slice(0, this.opts.maxFailures)
      .map((r) => ({
        title: r.test.title,
        file: r.test.location ? `${r.test.location.file}:${r.test.location.line}` : r.test.location,
        error: (r.result.error && r.result.error.message) || 'No message'
      }));

    const slackUrl = this.opts.slackWebhookUrl || process.env.SLACK_WEBHOOK || '';
    if (!slackUrl) {
      console.log('SlackReporter: no webhook configured, skipping Slack notification');
      return;
    }

    const summaryText = this.buildTextSummary(totals, duration, failures);

    const payload = {
      text: summaryText,
      attachments: failures.length
        ? [
            {
              color: 'danger',
              title: `Top ${failures.length} Failures`,
              text: failures
                .map((f, i) => `*${i + 1}.* ${f.title} — ${f.file}\n${this.truncate(f.error, 500)}`)
                .join('\n\n')
            }
          ]
        : []
    };

    await this.postWithRetry(slackUrl, payload, 3);
  }

  private buildTextSummary(totals: any, duration: string, failures: Array<any>) {
    const ciLink = process.env.CI_BUILD_URL || process.env.GITHUB_SERVER_URL
      ? `${process.env.GITHUB_SERVER_URL || ''}/${process.env.GITHUB_REPOSITORY || ''}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`
      : '';

    const lines = [] as string[];
    const project = this.opts.projectName || process.env.npm_package_name || 'Playwright Tests';

    lines.push(`*${project} — Test Results*`);
    lines.push(`• Total: *${totals.total}* — Passed: *${totals.passed}* • Failed: *${totals.failed}* • Skipped: *${totals.skipped}*`);
    lines.push(`• Duration: *${duration}*`);
    if (ciLink) lines.push(`• CI: ${ciLink}`);
    if (failures.length) lines.push(`• Top Failures: ${failures.length}`);
    return lines.join('\n');
  }

  private formatDuration(ms: number) {
    const s = Math.floor(ms / 1000);
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${hh}h ${mm}m ${ss}s`;
  }

  private truncate(str: string, n: number) {
    if (!str) return '';
    return str.length > n ? str.slice(0, n) + '…' : str;
  }

  private async postWithRetry(url: string, payload: any, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await axios.post(url, payload, { timeout: 10_000 });
        console.log('SlackReporter: notification sent');
        return;
      } catch (e: any) {
        console.warn(`SlackReporter: failed to post (attempt ${attempt}): ${e?.message || e}`);
        if (attempt === retries) {
          console.error('SlackReporter: all retries failed');
        } else {
          await new Promise((r) => setTimeout(r, attempt * 1000));
        }
      }
    }
  }
}
