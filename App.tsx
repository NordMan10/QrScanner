import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Linking } from "react-native";
import { useCallback } from "react";
import { useState, useEffect } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner';

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [supUrl, setUrl] = useState("https://github.com/NordMan10/battleships")

  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(supUrl);

    if (supported) {
      await Linking.openURL(supUrl);  
    } else {
      alert(`Don't know how to open this link: ${supUrl}`);
    }
  }, [supUrl]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setUrl(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
      <View style={styles.container}>
        <View
          style={styles.scanner}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />

          {scanned && <Button title={'Let\'s go!'} onPress={() =>
            { 
              handlePress();
            }}/>}
          
          {scanned && <Button title={'Tap to Scan Again'} onPress={() =>
            { 
              setScanned(false);
            }} />}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,},
  scanner: 
  {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  }
});

export default App;