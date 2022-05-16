import * as fs from 'fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

const xmlParser = new XMLParser();

export function readXmlSync(path: string, encoding: BufferEncoding): any {
    try {
        const xmlData = fs.readFileSync(path, encoding);
        const validationResult = XMLValidator.validate(xmlData);
        if (validationResult === true) {
            return xmlParser.parse(xmlData);
        } else {
            throw validationResult;
        }
    } catch (error) {
        throw error;
    }
}

export async function readXmlAsync(path: string, encoding: BufferEncoding): Promise<any> {
    try {
        const xmlData = await fs.promises.readFile(path, encoding);
        const validationResult = XMLValidator.validate(xmlData);
        if (validationResult === true) {
            return xmlParser.parse(xmlData);
        } else {
            throw validationResult;
        }
    } catch (error) {
        return Promise.reject(error);
    }
}
