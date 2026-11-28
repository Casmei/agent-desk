import { ConsoleLogger, type LogLevel } from '@nestjs/common';
import { logs, type Attributes } from '@opentelemetry/api';
import { REDACTED_KEYS } from './logger-options.js';

export class OtelLogger extends ConsoleLogger {
  override log(message: unknown, ...optionalParams: unknown[]): void {
    super.log(message, ...optionalParams);
    this.emit('log', message, optionalParams);
  }

  override warn(message: unknown, ...optionalParams: unknown[]): void {
    super.warn(message, ...optionalParams);
    this.emit('warn', message, optionalParams);
  }

  override error(message: unknown, ...optionalParams: unknown[]): void {
    super.error(message, ...optionalParams);
    this.emit('error', message, optionalParams);
  }

  override fatal(message: unknown, ...optionalParams: unknown[]): void {
    super.fatal(message, ...optionalParams);
    this.emit('fatal', message, optionalParams);
  }

  private emit(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ): void {
    if (!this.isLevelEnabled(level)) return;

    const attributes: Attributes = {};
    for (const param of optionalParams) {
      if (typeof param === 'string') attributes.context = param;
      else if (typeof param === 'object' && param !== null) {
        Object.assign(attributes, param);
      }
    }
    // The console output is redacted by Nest; what goes to OpenTelemetry needs the same treatment.
    for (const key of REDACTED_KEYS) delete attributes[key];

    logs.getLogger('agent-desk-api').emit({
      severityText: level,
      body: String(message),
      attributes,
    });
  }
}
