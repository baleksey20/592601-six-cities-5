import got from 'got';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
// import { appendFile } from 'node:fs/promises';

export class GenerateCommand implements Command {
  private initialData!: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
      console.log('this.initialData', this.initialData);
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);
    // console.log('tsvFileWriter', tsvFileWriter);

    for (let i = 0; i < offerCount; i++) {
      const data = tsvOfferGenerator.generate();
      console.log('tsvOfferGenerator.generate() ==> data', data);
      await tsvFileWriter.write(data);

      // напрямую без потоков
      // await appendFile(
      //   filepath,
      //   `${tsvOfferGenerator.generate()}\n`,
      //   {encoding: 'utf-8'}
      // );
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was created!`);
    } catch (error: unknown) {
      console.error(getErrorMessage(error));
    }
  }
}
