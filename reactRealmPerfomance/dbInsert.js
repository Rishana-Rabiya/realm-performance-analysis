import Realm from 'realm';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import {v4 as uuidv4} from 'uuid';
var realm;
var schema = {
  name: 'WbcEcg',
  properties: {
    _id: 'string',
    type: 'int',
    time: 'int',
    ch0SampleIndex: 'int',
    ch1SampleIndex: 'int',
    ch0SampleEndIndex: 'int',
    ch1SampleEndIndex: 'int',
    ch0Count: 'int',
    ch1Count: 'int',
    ch0DataString: {type: 'string', optional: true},
    ch1DataString: {type: 'string', optional: true},
    ch0Data: {type: 'data', optional: true},
    ch1Data: {type: 'data', optional: true},

    isEventPresent: 'bool',
  },
  primaryKey: '_id',
};
const getDBInstance = () => {
  try {
    if (!realm) {
      const realmConfig = {
        path: 'ecg-realm-db',
        schema: [schema],
        schemaVersion: 1,
      };
      realm = new Realm(realmConfig);
    }
  } catch (error) {
    throw new Error(
      'PktRepositoryRealm: getDBInstance - Error getting instance',
    );
  }
};
export const getfileSize = () => {
  // Get the path to the Realm file
  getDBInstance();
  const realmPath = realm.path;

  // Use react-native-fs to get file size
  RNFS.stat(realmPath)
    .then(stats => {
      const fileSizeInBytes = stats.size;
      const fileSizeInKB = fileSizeInBytes / 1024;
      const fileSizeInMB = fileSizeInKB / 1024;

      console.log(`Realm file size: ${fileSizeInBytes} bytes`);
      console.log(`Realm file size: ${fileSizeInKB} KB`);
      console.log(`Realm file size: ${fileSizeInMB} MB`);
    })
    .catch(error => console.error('Error getting file stats:', error));
};

export const initDB = () => {
  try {
    getDBInstance();
    clearDB();
  } catch (error) {
    throw new Error('PktRepositoryRealm: initDB - Error initializing DB');
  }
};

/**
 * clear data from DB
 */
export const clearDB = () => {
  try {
    console.log('clearing db');
    getDBInstance();
    if (realm) {
      console.log('has realm');
      realm.write(() => {
        realm.delete(realm.objects('WbcEcg'));
      });
    }
    getfileSize();
  } catch (error) {
    throw new Error('PktRepositoryRealm: clearDB - Error clearing DB');
  }
};

/**
 * insert packet data
 * @param pktDto
 */
export const insertPktData = pktDto => {
  try {
    getDBInstance();

    const dbInput = convertPktData(pktDto);
    realm.write(() => {
      realm.create('WbcEcg', dbInput);
    });
    getfileSize();

    return dbInput;
  } catch (error) {
    throw new Error('PktRepositoryRealm: insertPktData - Error inserting data');
  }
};

/**
 * convert data for db input
 * @param pktDto
 * @returns
 */
export const convertPktData = pktDto => {
  const dbInput = {
    type: pktDto.type,
    time: pktDto.time,
    ch0SampleIndex: pktDto.ch0SampleIndex - 1,
    ch1SampleIndex: pktDto.ch1SampleIndex - 1,
    ch0Count: pktDto.ch0Count,
    ch1Count: pktDto.ch1Count,
    ch0DataString: convertUint8ArrayToBase64String(pktDto.ch0Data),
    ch1DataString: convertUint8ArrayToBase64String(pktDto.ch1Data),
    isEventPresent: pktDto.isEventPresent,
    ch0SampleEndIndex: pktDto.ch0SampleIndex + pktDto.ch0Count - 2,
    ch1SampleEndIndex: pktDto.ch1SampleIndex + pktDto.ch1Count - 2,
    _id: Math.random().toString(),
  };
  return dbInput;
};

const convertPktDataBuffer = pktDto => {
  const dbInput = {
    type: pktDto.type,
    time: pktDto.time,
    ch0SampleIndex: pktDto.ch0SampleIndex - 1,
    ch1SampleIndex: pktDto.ch1SampleIndex - 1,
    ch0Count: pktDto.ch0Count,
    ch1Count: pktDto.ch1Count,
    ch0Data: pktDto.ch0Data.buffer,
    ch1Data: pktDto.ch1Data.buffer,
    isEventPresent: pktDto.isEventPresent,
    ch0SampleEndIndex: pktDto.ch0SampleIndex + pktDto.ch0Count - 2,
    ch1SampleEndIndex: pktDto.ch1SampleIndex + pktDto.ch1Count - 2,
    _id: Math.random().toString(),
  };
  return dbInput;
};

/**
 * convert data to base 64 encoded string for db input
 */
export const convertUint8ArrayToBase64String = data => {
  try {
    const convertedToBase64String = Buffer.from(data.buffer).toString('base64');
    return convertedToBase64String;
  } catch (error) {
    throw new Error(
      'PktRepositoryRealm: insertPktData - Error in converting channel data to base64 encoded string',
    );
  }
};

/**
 *  bulk insert packet data
 * @param pktDto
 */
export const insertBulkPktData = (pktDto, string) => {
  try {
    getDBInstance();

    realm.write(() => {
      pktDto.forEach(item => {
        if (string) {
          const dbInput = convertPktData(item);
          realm.create('WbcEcg', dbInput);
        } else {
          const dbInput = convertPktDataBuffer(item);
          realm.create('WbcEcg', dbInput);
        }
      });
    });
    getfileSize();
  } catch (error) {
    throw new Error(
      'PktRepositoryRealm: bulkInsert - Error inserting data' +
        JSON.stringify(error),
    );
  }
};

/**
 * close DB
 */
export const closeDB = () => {
  if (realm.isClosed) {
    realm.close();
  }
  realm = null;
};
