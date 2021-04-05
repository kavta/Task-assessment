import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { DataTable } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 90,
  },
  heading: {
    textAlign: 'center',
    fontSize: 20,
  },
  addButton: {
    marginTop: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#5454f4',
    borderWidth: 1,
    borderRadius: 10,
    width: 70,
    height: 50,
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 10,
  },
  inputText: {
    height: 30,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  filterContainer: {
    margin: 20,
    flexDirection: 'row',
  },
  tableContainer: { height: 300, width: 350 },
  filter: {
    borderWidth: 1,
    marginLeft: 20,
    paddingLeft: 5,
    paddingRight: 5,
  },
});

const Mainpage = () => {
  const [personName, setPersonName] = useState('');
  const [country, setCountry] = useState('');
  const [favPhone, setFavPhone] = useState('');
  const [phone, setPhone] = useState('');
  const [tableData, settableData] = useState([]);
  const [countryFilter, setCountryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  const handlePersonName = (personName) => {
    setPersonName(personName);
  };

  const handleCountry = (country) => {
    setCountry(country);
  };

  const handlePhoneBrand = (favPhone) => {
    setFavPhone(favPhone);
  };
  const handlePhoneNumber = (phone) => {
    setPhone(phone);
  };

  const handleCountryFilter = (countryFilter) => {
    setCountryFilter(countryFilter);
    AsyncStorage.getItem('data')
      .then((req) => JSON.parse(req))
      .then((output) => {
        settableData(
          output.filter((item) => {
            const countryFiltered = countryFilter.toLowerCase();
            const countryName = item.country.toLowerCase();
            return countryName.includes(countryFiltered);
          })
        );
      });
  };

  const handleBrandFilter = async (brandFilter) => {
    setBrandFilter(brandFilter);
    await AsyncStorage.getItem('data')
      .then((req) => JSON.parse(req))
      .then((output) => {
        settableData(
          output.filter((item) => {
            return item.favPhone
              .toLowerCase()
              .includes(brandFilter.toLowerCase());
          })
        );
      });
  };

  const clearInformation = () => {
    AsyncStorage.clear();
    console.log('Cleared');
  };

  const addInformation = async () => {
    if (
      personName == null ||
      country == null ||
      favPhone == null ||
      phone == null
    ) {
      alert('Please,Enter all the field');
    } else {
      const data = [{ personName, country, favPhone, phone }];

      if (await AsyncStorage.getItem('data')) {
        await AsyncStorage.getItem('data')
          .then((req) => JSON.parse(req))
          .then((output) => {
            AsyncStorage.setItem('data', JSON.stringify(output.concat(data)))
              .then((output) => alert('Added Succesfully'))
              .catch((error) => console.log('error!'));
          })
          .catch((error) => console.log('error!'));
      } else {
        await AsyncStorage.setItem('data', JSON.stringify(data))
          .then((json) => alert('Added succesfully'))
          .catch((error) => console.log('error!'));
      }
      await AsyncStorage.getItem('data')
        .then((req) => JSON.parse(req))
        .then((output) => {
          settableData(output);
        })
        .catch((error) => console.log('error!'));
      setPersonName('');
      setPhone('');
      setCountry('');
      setFavPhone('');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.heading}>Task Assessment</Text>
        <Text>Name:</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={handlePersonName}
          value={personName}
        />
        <Text>Country:</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={handleCountry}
          value={country}
        />
        <Text>Favourite Phone Brand:</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={handlePhoneBrand}
          value={favPhone}
        />
        <Text>Phone Number:</Text>
        <TextInput
          style={styles.inputText}
          keyboardType="numeric"
          onChangeText={handlePhoneNumber}
          value={phone}
        />
      </View>
      <View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={addInformation}>
            <Text style={styles.buttonText}> Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={clearInformation}>
            <Text style={styles.buttonText}> Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          onChangeText={handleCountryFilter}
          placeholder="Filter as country"
          value={countryFilter}
          style={styles.filter}
        />
        <TextInput
          onChangeText={handleBrandFilter}
          placeholder="Filter as Phone Brand"
          value={brandFilter}
          style={styles.filter}
        />
      </View>
      <View>
        <DataTable style={styles.tableContainer}>
          <DataTable.Header>
            <DataTable.Title> Name</DataTable.Title>
            <DataTable.Title>Country</DataTable.Title>
            <DataTable.Title> Brand</DataTable.Title>
            <DataTable.Title>Phone Number</DataTable.Title>
          </DataTable.Header>
          <ScrollView>
            {tableData.map((value, i) => {
              return (
                <DataTable.Row key={i}>
                  <DataTable.Cell>{value.personName}</DataTable.Cell>
                  <DataTable.Cell>{value.country}</DataTable.Cell>
                  <DataTable.Cell>{value.favPhone}</DataTable.Cell>
                  <DataTable.Cell>{value.phone}</DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </ScrollView>
        </DataTable>
      </View>
    </SafeAreaView>
  );
};
export default Mainpage;
