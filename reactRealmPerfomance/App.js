import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import {clearDB, insertBulkPktData} from './dbInsert';
import {getPackets} from './packetCreator';

const Separator = () => <View style={styles.separator} />;

insertBuffer = () => {
  const t1 = performance.now();
  let packet = getPackets(1000, 1952);
  insertBulkPktData(packet, false);
  const t2 = performance.now();
  console.log('the time taken to insert it as buffer is', t2 - t1);
};
insertString = () => {
  const t1 = performance.now();
  let packet = getPackets(1000, 1952);
  insertBulkPktData(packet, true);
  const t2 = performance.now();
  console.log('the time taken to insert it as string is', t2 - t1);
};
const clearDb = () => {
  clearDB();
};

const App = () => (
  <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.title}>
        Click Below button to insert the db packets data as array buffer
      </Text>
      <Button title="Insert Array Buffer" onPress={insertBuffer} />
    </View>
    <Separator />
    <View>
      <Text style={styles.title}>
        Click Below button to insert the db packets data as baseenconded string
      </Text>
      <Button title="Insert String" color="#f194ff" onPress={insertString} />
    </View>
    <Separator />
    <View>
      <Text style={styles.title}>Click Below button to clear database</Text>
      <Button title="Clear Db" color="red" onPress={clearDb} />
    </View>
    <Separator />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
