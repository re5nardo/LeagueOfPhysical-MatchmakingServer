import * as fs from 'fs';
import path from 'path';
import { SubGameData } from '@src/interfaces/masterdata/subGameData.interface';
import { readXmlAsync } from '@src/utils/util.xml';

const MASTER_DATA_FOLDER = 'master_data';
const SUB_GAME_DATA_FOLDER = 'sub_game_data';

export enum MasterDataType {
    SubGameData = 0,
}

export const MasterData: Map<MasterDataType, Map<string, any>> = new Map<MasterDataType, Map<string, any>>();

async function loadSubGameData(path: string): Promise<SubGameData> {
    try {
        const parsedData = await readXmlAsync(path, 'utf-8');
        return parsedData.SubGameData as SubGameData;
    } catch (error) {
        return Promise.reject(error);
    }
}

async function loadSubGame() {
    try {
        const subGameDataPath = path.join(MASTER_DATA_FOLDER, SUB_GAME_DATA_FOLDER);
        const files = fs.readdirSync(subGameDataPath);
        for (const file of files) {
            const filePath = path.join(subGameDataPath, file);
            const subGameData = await loadSubGameData(filePath);

            if (MasterData.has(MasterDataType.SubGameData) === false) {
                MasterData.set(MasterDataType.SubGameData, new Map<string, any>());
            }

            MasterData.get(MasterDataType.SubGameData)?.set(subGameData.SubGameId, subGameData);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function load(): Promise<void> {
    try {
        await loadSubGame();
    } catch (error) {
        return Promise.reject(error);
    }
};
