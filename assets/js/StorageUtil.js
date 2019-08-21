import AsyncStorage from '@react-native-community/async-storage';

export default class StorageUtil {
  static async saveJsonObject(key, value) {
    return await this.saveString(key, JSON.stringify(value));
  }

  static async getJsonObject(key, defaultObject) {
    let result = null;
    try {
      result = await this.getString(key, null);
      result = await JSON.parse(result);
    } catch (err) {
      if (defaultObject) {
        return Promise.resolve(defaultObject);
      } else {
        return Promise.reject(err);
      }
    }
    return result;
  }

  static async saveString(key, value) {
    if (key !== null && value !== null) {
      //Key 与Value 都不为空
      try {
        await AsyncStorage.setItem(key, value)
      } catch (err) {
        return Promise.reject(err)
      }
      return Promise.resolve(true);
    } else {
      return Promise.reject({'msg': 'Key and value can not be null'});
    }
  }

    static async getString(key, defaultValue) {
      let result = null;
      let noDataError = {'msg': 'No value found !'};
      if (key !== null) {
        result = await AsyncStorage.getItem(key);
        return result ? result : defaultValue !== null ? defaultValue : Promise.reject(noDataError);
      } else {
        if (defaultValue) {
          return Promise.resolve(defaultValue);
        } else {
          return Promise.reject(noDataError);
        }
      }
    }

    static async remove(key) {
      let result = true;
      try {
        result = await AsyncStorage.removeItem(key);
      } catch (err) {
        return Promise.reject(err)
      }
      return result;
    }

    static async getAllKeys() {
      let result = true;
      try {
        result = await AsyncStorage.getAllKeys();
      } catch (err) {
        return Promise.reject(err)
      }
      return result;
    }
}