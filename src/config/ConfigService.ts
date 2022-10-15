import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/LoggerService';

export interface IConfigService {
	get: (key: string) => string;
}

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const { error, parsed }: DotenvConfigOutput = config();
		if (error) {
			this.logger.error(`[ConfigService] Cannot read file ".env"`);
		} else {
			this.logger.log(`[ConfigService] Config file ".env" is loaded`);
			this.config = parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
